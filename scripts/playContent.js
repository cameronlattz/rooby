(function () {
    "use strict";
    let _pokemons = [];
    let _initialTypeOdds = {};
    let _unrevealedPokemonOdds = {};
    let _timeoutIds = {};
    let _hiddenDitto = {};
    let _levels = {};
    let _randomSprites = {};
    let _randomDefaultSprites = {};
    let _randomBackdrop = {};
    let _randomDefaultBackdrop = {};
    let _settings = JSON.parse(JSON.stringify(consts.defaultSettings));
    let _ratings = [];
    let _ladders = [];
    let _results = {};
    let _winRates = {};
    const _playUrl = consts.urls.gameUrls[0];
    const _playRoomSelector = "div[id^=room-battle-gen1]:not([style*=\"display: none\"]:not([style*=\"display:none\"]";
    const _page = window.location.hostname.split(".")[0];
    const _doc = document;

    (function () {
        _doc.addEventListener("mouseover", (event) => {
            const element = event.target;
            const roomElement = _page === "play" ? event.target.closest(_playRoomSelector) : document.querySelector(".battle").parentElement;
            if (roomElement == void 0) return;
            if (roomElement.id === "" && _page === "replay") roomElement.id = "room-battle-" + window.location.pathname.substring(1);
            const pokemons = [..._pokemons];
            if (element.getAttribute("title") === "Not revealed" && !!pokemons && _settings.unrevealedCalculator !== false) {
                let isRandomBattle = roomElement.id.indexOf("randombattle") !== -1;
                if (isRandomBattle || (_page === "replay" && window.location.pathname.indexOf("gen1randombattle") !== -1)) {
                    showUnrevealedPokemon(element);
                }
            }
            else if (element.classList.contains("trainersprite")) {
                showTrainerTooltip(element);
            }
            const tooltipWrapper = document.querySelector("#tooltipwrapper");
            if (tooltipWrapper) {
                if (event.target.closest(".rightbar") != void 0 || event.target.getAttribute("data-id") === "p2a") {
                    showTooltip(element, tooltipWrapper.querySelector(".tooltipinner"), true);
                }
                else if (event.target.closest(".leftbar") != void 0 || event.target.getAttribute("data-id") === "p1a" || event.target.closest(".controls") != void 0) {
                    showTooltip(element, tooltipWrapper.querySelector(".tooltipinner"), false);
                }
            }
        });

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                const nodes = Array.prototype.slice.call(mutation.addedNodes);
                nodes.forEach(function (node) {
                    elementInserted(node);
                });
            });
        });
        observer.observe(_doc, {
            childList: true,
            subtree: true
        });
    })();

    window.onload = async function () {
        _settings = await util.getStorage("settings") || _settings;
        updateBackdrop(document.querySelector(".backdrop"));
        for (const img of Array.from(document.querySelectorAll("img"))) {
            updateSprite(img);
        }
        const trainers = document.querySelectorAll(".trainer");
        for (const trainer of trainers) {
            updateIcons(trainer);
        }
        util.loadRandomsData("gen1", consts.urls.randomsDataUrl).then(async data => {
            const pokemons = roobyCalc.buildSettingsPokemons(data);
            _pokemons = pokemons;
            const dualTypes = pokemons
                .map(p => p.types.sort((a, b) => a - b).join(",") + (p.level === 100 ? "-100" : ""))
                .filter((value, index, array) => array.indexOf(value) === index);
            consts.dualTypesNamesDictionary = {};
            for (const dualTypeKey of dualTypes) {
                consts.dualTypesNamesDictionary[dualTypeKey] = dualTypes.indexOf(dualTypeKey);
            };
            if (_page === "play" || _page === "replay") {
                chrome.runtime.sendMessage({ function: "init", args: { pokemons } }, function (odds) {
                    _initialTypeOdds = odds;
                    void chrome.runtime.lastError;
                });
            }
        });
        loadLadderData();
        setInterval(function () {
            const allRooms = Array.from(document.querySelectorAll(".ps-room")).filter(e => e.id.indexOf("gen1randombattle") !== -1);
            const isRoomWithThreeToFiveRevealed = allRooms
                .map(r => Array.from(r.querySelectorAll(".trainer")))
                .flat(Infinity)
                .map(t => { const rp = playUtil.getRevealedPokemonIds(t); return rp ? rp.length : 0 })
                .some(l => l >= 3 && l <= 5);
            if (isRoomWithThreeToFiveRevealed) {
                chrome.runtime.sendMessage({ function: "keepAlive", args: { pokemons: _pokemons } }, function () {
                    void chrome.runtime.lastError;
                });
            }
        }, 10000);
        setInterval(function () {
            util.pruneCalculations([..._pokemons]);
            loadLadderData();
        }, 300000);
        setTimeout(function () {
            util.pruneCalculations([..._pokemons]);
        }, 5000);
        _doc.addEventListener("keyup", function (event) {
            if (event.key !== "Enter") {
                event.target.setAttribute("data-value", event.target.value);
            }
            else if (event.target.parentElement.classList.contains("chatbox") && event.target.tagName === "TEXTAREA") {
                const value = event.target.getAttribute("data-value");
                if (!value || value.length === "") return;
                if (value.startsWith("/odds")) {
                    simulateOdds(event.target, value);
                }
                else if (value.startsWith("/movesets")) {
                    showMovesets(event.target, value);
                }
                else if (value.startsWith("/moves")) {
                    showMoves(event.target, value);
                }
                else if (value.startsWith("/export")) {
                    const tabElement = playUtil.getParentRoomElement(event.target, _page);
                    const tab = playUtil.getTabIdByRoomElement(tabElement);
                    const randomNumber = util.randomNumbersGenerator(Date.now());
                    const uid = (randomNumber + "").replace("0.", "");
                    event.target.setAttribute("data-uid", uid);
                    window.postMessage({
                        function: "exportTeams",
                        args: { tab: tab, targetUid: uid }
                    });
                }
                else if (value.startsWith("/winrates")) {
                    showWinRate(event.target, value);
                }
                else if (value.startsWith("/opponentwr")) {
                    showWinRate(event.target, value);
                }
                else if (value.startsWith("/rooby")) {
                    showRooby(event.target);
                }
            }
        });

        window.addEventListener("message", (event) => {
            if (!consts.urls.gameUrls.includes(event.origin)) return;
            const args = event.data.args;
            if (event.data.function === "getPokemonLevelsReturn") {
                for (const pokemon of args.pokemons) {
                    const pokemonId = playUtil.getPokemonIdByName(pokemon.name);
                    const roomElement = playUtil.getRoomElementByTabId(args.tab);
                    const trainerElement = playUtil.getTrainerElementBySide(roomElement, pokemon.isRight);
                    const trainerName = playUtil.getTrainerNameByElement(trainerElement);
                    setLevels(pokemon.level, args.tab, trainerName, pokemonId);
                }
            }
            else if (event.data.function === "getExactHealthByNameReturn") {
                const pokemonId = playUtil.getPokemonIdByName(args.name);
                const roomElement = playUtil.getRoomElementByTabId(args.tab);
                const moveButtons = Array.from(roomElement.querySelectorAll("button[name=chooseMove]"));
                for (const moveButton of moveButtons) {
                    const moveName = moveButton.childNodes[0].textContent;
                    const pokemon = {
                        id: pokemonId,
                        level: args.level,
                        healthRemainingPercent: args.healthRemainingPercent,
                        exactHealth: args.exactHealth,
                    }
                    const damageCalc = roobyCalc.damage(pokemon, null, moveName);
                    if (damageCalc.failureRate > 0 && args.healthRemainingPercent !== 100) {
                        moveButton.classList.add("recovery-failure");
                        moveButton.setAttribute("title", (damageCalc.failureRate*100).toFixed(2) + "%  chance a recovery move will fail");
                    }
                    moveButton.setAttribute("data-failure-rate", damageCalc.failureRate);
                }
            }
            else if (event.data.function === "exportTeamsReturn") {
                exportTeams(args.targetUid, args.teams);
            }
        }, false);
    }

    const initializeTab = function (tab, trainerName) {
        _unrevealedPokemonOdds[tab] = _unrevealedPokemonOdds[tab] || {};
        if (trainerName) {
            _unrevealedPokemonOdds[tab][trainerName] = _unrevealedPokemonOdds[tab][trainerName] || {};
        }
        _timeoutIds[tab] = _timeoutIds[tab] || {};
        let spritesSetNames = Object.keys(consts.spriteSets);
        let frontSprites = spritesSetNames.filter(ssn => consts.spriteSets[ssn].front === true);
        let backSprites = spritesSetNames.filter(ssn => consts.spriteSets[ssn].back === true);
        let iconSprites = [...new Set(spritesSetNames.map(ssn => consts.spriteSets[ssn].icons).flat())];
        let shinySprites = spritesSetNames.filter(ssn => consts.spriteSets[ssn].shiny === true);
        let frontDefaultSprites = spritesSetNames.filter(ssn => consts.spriteSets[ssn].front === true && consts.spriteSets[ssn].custom !== true);
        let backDefaultSprites = spritesSetNames.filter(ssn => consts.spriteSets[ssn].back === true && consts.spriteSets[ssn].custom !== true);
        let iconDefaultSprites = [...new Set(spritesSetNames.map(ssn => consts.spriteSets[ssn].icons && consts.spriteSets[ssn].custom !== true).flat())];
        let shinyDefaultSprites = spritesSetNames.filter(ssn => consts.spriteSets[ssn].shiny === true && consts.spriteSets[ssn].custom !== true);
        if (_randomSprites[tab] == void 0) {
            const randomNumbers = util.randomNumbersGenerator(tab, [frontSprites.length, backSprites.length, 
                iconSprites.length, shinySprites.length, frontDefaultSprites.length, backDefaultSprites.length, 
                iconDefaultSprites.length, shinyDefaultSprites.length, consts.backdrops.length, 68]);
            _randomSprites[tab] = {};
            _randomSprites[tab].front = frontSprites[randomNumbers[0]];
            _randomSprites[tab].back = backSprites[randomNumbers[1]] + "-back";
            _randomSprites[tab].icons = iconSprites[randomNumbers[2]];
            _randomSprites[tab]["back-shiny"] = shinySprites[randomNumbers[3]] + "-back-shiny";
            _randomSprites[tab].shiny = shinySprites[randomNumbers[3]] + "-shiny";
            _randomDefaultSprites[tab] = {};
            _randomDefaultSprites[tab].front = frontDefaultSprites[randomNumbers[4]];
            _randomDefaultSprites[tab].back = backDefaultSprites[randomNumbers[5]] + "-back";
            _randomDefaultSprites[tab].icons = iconDefaultSprites[randomNumbers[6]];
            _randomDefaultSprites[tab]["back-shiny"] = shinyDefaultSprites[randomNumbers[7]] + "-back-shiny";
            _randomDefaultSprites[tab].shiny = shinyDefaultSprites[randomNumbers[7]] + "-shiny";
            _randomBackdrop[tab] = consts.backdrops[randomNumbers[8]];
            _randomDefaultBackdrop[tab] = consts.backdrops[randomNumbers[9]];
        }
        getWinRates();
    }

    const elementInserted = function (element) {
        if (element.closest == void 0 || element.classList == void 0) return;
        if (element.classList.contains("ps-popup")) {
            settingsPopup(element);
        }
        else {
            let roomElement;
            let gametype;
            if (_page === "play") {
                const currentTab = document.querySelector(".roomtab.cur");
                if (currentTab == void 0) return;
                const tabElement = currentTab.querySelector(".text");
                if (tabElement == void 0) return;
                gametype = tabElement.innerText;
                roomElement = playUtil.getParentRoomElement(element, _page);
            }
            else if (_page === "replay") {
                gametype = document.title.split(":")[0];
                roomElement = playUtil.getParentRoomElement(element, _page);
            }
            if (roomElement == void 0) return;
            if (consts.gameTypes.some(gt => gametype.localeCompare("gen1" + gt.replace(/\s/g, ""))) && roomElement) {
                if (element.classList.contains("trainer")) {
                    updateIcons(element);
                    updateTrainerIcon(element);
                    loadRatings(element);
                    addUserLink(element);
                    const isRight = playUtil.getIsRightByChildElement(element);
                    const opponentTrainerElement = playUtil.getTrainerElementBySide(roomElement, !isRight);
                    if (opponentTrainerElement) {
                        const opponentTrainerName = playUtil.getTrainerNameByElement(opponentTrainerElement).replace(/\s/g,'').toLowerCase();;
                        getResults(opponentTrainerName);
                    }
                    if (gametype.replace(/\s/g, "").toLowerCase().indexOf("randombattle") !== -1 && (_page === "play" || _page === "replay")) {
                        calculateUnrevealedPokemon(element, roomElement);
                    }
                }
                else if (element.tagName === "IMG" && element.hasAttribute("src")) {
                    updateSprite(element);
                }
                else if (element.classList.contains("backdrop")) {
                    updateBackdrop(element);
                    setTimeout(function (elem) { updateBackdrop(elem); }, 0, element);
                }
                else if (element.classList.contains("battle-history") && document.querySelector(".usernametext")) {
                    if (element.innerHTML.indexOf("Battle started between ") !== -1 && _page === "play") {
                        changeAvatar(element);
                    }
                    else if (element.innerHTML.indexOf(" won the battle!") !== -1) {
                        const loggedInName = document.querySelector(".usernametext").innerText.replace(/\s/g,'').toLowerCase();
                        const leftTrainerElement = playUtil.getTrainerElementBySide(roomElement, false);
                        const leftName = playUtil.getTrainerNameByElement(leftTrainerElement).replace(/\s/g,'').toLowerCase();
                        const rightTrainerElement = playUtil.getTrainerElementBySide(roomElement, true);
                        const rightName = playUtil.getTrainerNameByElement(rightTrainerElement).replace(/\s/g,'').toLowerCase();
                        if (loggedInName === leftName || loggedInName === rightName) {
                            const winnerName = element.children[0].innerHTML.split(" won the battle!")[0].replace(/\s/g,'').toLowerCase();
                            const opponentName = loggedInName === leftName ? rightName : leftName;
                            const result = loggedInName === winnerName ? 1 : -1;
                            const tabId = playUtil.getTabIdByRoomElement(roomElement);
                            const winnerTrainerElement = loggedInName === leftName ? leftTrainerElement : rightTrainerElement;
                            const opponentTrainerElement = loggedInName === leftName ? rightTrainerElement : leftTrainerElement;
                            const pokemons = playUtil.getRevealedPokemonIds(winnerTrainerElement);
                            const opponentPokemons = playUtil.getRevealedPokemonIds(opponentTrainerElement);
                            saveResult(opponentName, tabId, result, pokemons, opponentPokemons);
                        }
                    }
                }
                else if (element.classList.contains("message-error")) {
                    const commands = [ "odds", "movesets", "moves", "export", "winrates", "rooby"];
                    for (const command of commands) {
                        if (element.innerText.startsWith("The command \"/" + command)) {
                            removeChatError(element, command);
                            break;
                        }
                    }
                }
                else {
                    const tab = playUtil.getTabIdByRoomElement(roomElement);
                    const isRight = element.classList.contains("lstatbar");
                    const trainerElement = playUtil.getTrainerElementBySide(roomElement, isRight);
                    if (trainerElement == void 0) return;
                    const trainerName = playUtil.getTrainerNameByElement(trainerElement);
                    if (isRight) {
                        const opponentTrainerElement = playUtil.getTrainerElementBySide(roomElement, isRight);
                        const opponentPokemonId = playUtil.getActivePokemonId(opponentTrainerElement);
                        const opponentTrainerName = playUtil.getTrainerNameByElement(trainerElement);
                        recoveryFailureCheck(tab, opponentTrainerName, opponentPokemonId, isRight);
                    }
                    if (element.classList.contains("statbar")) {
                        const pokemonId = playUtil.getActivePokemonId(trainerElement);
                        if (pokemonId == void 0) return;
                        const statElement = playUtil.getStatElementBySide(roomElement, isRight);
                        const pokemonLevel = playUtil.getLevelFromStatElement(statElement);
                        setLevels(pokemonLevel, tab, trainerName, pokemonId);
                    }
                    else if (element.classList.contains("controls") && !!element.querySelector(".switchmenu")) {
                        if (gametype.replace(/\s/g, "").toLowerCase().indexOf("randombattle") === -1 || (_page !== "play" && _page !== "replay")) {
                            return;
                        }
                        if (Array.from(element.querySelectorAll("button[name=chooseSwitch]")).map(n => n.innerText).some(t => t === "Ditto")) {
                            _hiddenDitto[tab] = trainerName;
                        }
                        const pokemonId = playUtil.getActivePokemonId(trainerElement);
                        recoveryFailureCheck(tab, trainerName, pokemonId, false);
                    }
                }
            }
        }
    }

    const addUserLink = function (trainerElement) {
        const trainerNameWithSpaces = playUtil.getTrainerNameByElement(trainerElement, false);
        const userId = trainerNameWithSpaces.replace(/\s/g,'').toLowerCase();
        trainerElement.querySelector("strong").innerHTML = _settings.trainerTooltip === false
            ? trainerNameWithSpaces
            : "<a href=\"https://pokemonshowdown.com/users/" + userId + "\" target=\"_new\">" + trainerNameWithSpaces + "</a>";
    }

    const removeChatError = function (inputElement, command) {
        setTimeout(function (command) {
            const chatBox = util.getNearestRelativeElement(inputElement, ".message-log");
            const errorElement = Array.from(chatBox.querySelectorAll(".message-error"))
                .findLast(c => c.innerHTML.startsWith("The command \"/" + command + "\" does not exist."));
            if (errorElement != void 0) errorElement.remove();
        }, 0, command);
    }

    const loadRatings = function (trainerElement) {
        const trainerName = playUtil.getTrainerNameByElement(trainerElement).replace(/\s/g,'').toLowerCase();
        if (!_ratings[trainerName] || _ratings[trainerName].accessTime + 60000 < Date.now()) {
            _timeoutIds[trainerName + "ratings"] = util.debounce(function () {
                util.loadRatingsData(util.slugify(trainerName), consts.urls.ratingsDataUrl).then(data => {
                    if (data == void 0) return;
                    _ratings[trainerName] = data.ratings;
                    _ratings[trainerName].registertime = data.registertime;
                    _ratings[trainerName].accessTime = Date.now();
                });
            }, 100, _timeoutIds[trainerName + "ratings"]);
        }
    }

    const loadLadderData = function() {
        const format = window.location.pathname.startsWith("/battle")
            ? window.location.pathname.split("-")[1]
            : window.location.pathname.split("-")[0].substring(1);
        util.loadLadderData(format, consts.urls.laddersUrl).then(data => {
            if (data) _ladders[format] = data.toplist.map(t => t.userid);
        });
    }

    const recoveryFailureCheck = function (tab, trainerName, pokemonId, isRight) {
        if (!_settings.miscCalculator || pokemonId == void 0) return;
        const dexMons = Object.keys(consts.pokedex).map(k => consts.pokedex[k]);
        const pokemonName = dexMons.find(p => p.id == pokemonId).name;
        if (pokemonName == void 0) return;
        const roomElement = playUtil.getRoomElementByTabId(tab);
        const statElement = playUtil.getStatElementBySide(roomElement, isRight);
        const { healthRemainingPercent } = playUtil.getPokemonHealth(null, statElement);
        let failureRate = 0;
        if (isRight) {
            if (!_pokemons) return;
            const hasRecoveryMove = _pokemons.find(p => p.name === pokemonName).moves.some(m => consts.recoveryMoves.includes(m.id));
            if (hasRecoveryMove) {
                const level = playUtil.getLevelFromStatElement(statElement);
                const pokemon = {
                    id: pokemonId,
                    level: level,
                    healthRemainingPercent: healthRemainingPercent
                }
                const damageCalc = roobyCalc.damage(pokemon, null, "Rest");
                if (damageCalc.failureRate > 0 && healthRemainingPercent !== 100) {
                    failureRate = damageCalc.failureRate;
                }
            }
            const strong = statElement.querySelector("strong");
            if (failureRate > 0) {
                strong.classList.add("recovery-failure");
                strong.setAttribute("title", (failureRate * 100).toFixed(2) + "%  chance a recovery move will fail");
            }
            else {
                strong.classList.remove("recovery-failure");
                strong.removeAttribute("title");
            }
        }
        else {
            window.postMessage({
                function: "getExactHealthByName",
                args: {
                    name: pokemonName,
                    healthRemainingPercent: healthRemainingPercent,
                    isRight: false,
                    tab: tab,
                    trainerName: trainerName
                }
            });
        }
    }

    const calculateUnrevealedPokemon = function (trainer, roomElement) {

        const typeCheckReturnFunction = function (tab, trainerName, result) {
            if (result != void 0 && result.odds != void 0) {
                const monNumbers = result.currentTeamNumbers;
                _unrevealedPokemonOdds[tab] = _unrevealedPokemonOdds[tab] ?? {};
                _unrevealedPokemonOdds[tab][trainerName] = _unrevealedPokemonOdds[tab][trainerName] ?? {};
                _unrevealedPokemonOdds[tab][trainerName][monNumbers] = result.odds;
                const roomElements = document.querySelectorAll(_page === "play" ? _playRoomSelector : ".battle");
                for (const roomElement of roomElements) {
                    if (tab === playUtil.getTabIdByRoomElement(roomElement)) {
                        const checkingElement = document.querySelector("#unrevealedPokemonChecking");
                        if (checkingElement) {
                            const tooltip = checkingElement.closest(".tooltip");
                            const trainers = document.querySelectorAll(".trainer-near, .trainer-far");
                            for (const trainer of trainers) {
                                const trainerElementName = playUtil.getTrainerNameByElement(trainer);
                                if (trainerElementName === trainerName && trainerName === tooltip.getAttribute("data-trainer")) {
                                    const revealedPokemonIds = playUtil.getRevealedPokemonIds(trainer) || [];
                                    const opponentTrainerElement = playUtil.getTrainerElementByName(roomElement, trainerName, true);
                                    const opponentTrainerName = playUtil.getTrainerNameByElement(opponentTrainerElement);
                                    const opponentRevealedPokemonIds = playUtil.getRevealedPokemonIds(opponentTrainerElement) || [];
                                    const opponentHasDitto = _hiddenDitto[tab] === opponentTrainerName || opponentRevealedPokemonIds.some(p => p === "ditto");
                                    const revealedPokemonNumbers = revealedPokemonIds.map(rpi => _pokemons.find(p => p.id === rpi)).map(p => p.number).sort((a, b) => a - b).join(",")
                                        + (opponentHasDitto ? "DITTO" : "");
                                    if (revealedPokemonNumbers === monNumbers && monNumbers === tooltip.getAttribute("data-pokemon")) {
                                        checkingElement.innerHTML = "Calculations finished! Hover over again to see the odds.";
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        const revealedPokemon = Array.from(trainer.querySelectorAll(".teamicons"))
            .map(node => Array.from(node.querySelectorAll(".has-tooltip")))
            .flat().map(node => node.getAttribute("aria-label").split("(")[0].trim());
        if (revealedPokemon.length === 0) return;
        const trainerName = trainer.querySelector("strong").innerText.replace(/\s/g, '');
        const opponentTrainer = playUtil.getTrainerElementByName(roomElement, trainerName, true);
        const opponentTrainerName = playUtil.getTrainerNameByElement(opponentTrainer);
        const opponentRevealedPokemon = playUtil.getRevealedPokemonIds(opponentTrainer) || [];
        let tab = roomElement.id.substring(roomElement.id.lastIndexOf("-") + 1, roomElement.id.length);
        if (tab === "") tab = "replay";
        if (_timeoutIds[tab] == void 0) initializeTab(tab, trainerName);
        const opponentHasDitto = _hiddenDitto[tab] === opponentTrainerName || opponentRevealedPokemon.some(p => p === "ditto");
        const pokemons = [..._pokemons];
        _timeoutIds[tab][trainerName] = util.debounce(roobyCalc.buildTeamTree, 100, _timeoutIds[tab][trainerName], tab, trainerName, 
            revealedPokemon, opponentRevealedPokemon, opponentHasDitto, pokemons, typeCheckReturnFunction);
    }

    const showUnrevealedPokemon = function (element) {
        const roomElement = playUtil.getParentRoomElement(element, _page);
        const isRight = playUtil.getIsRightByChildElement(element);
        const trainerElement = playUtil.getTrainerElementBySide(roomElement, isRight);
        const trainerName = playUtil.getTrainerNameByElement(trainerElement);
        const revealedPokemonIds = playUtil.getRevealedPokemonIds(trainerElement) || [];
        const revealedPokemonNumbers = revealedPokemonIds.map(p => consts.pokedex[p].num).slice(0, 5).sort((a, b) => a - b);
        const monNumbers = revealedPokemonNumbers.join(",");
        let tab = playUtil.getTabIdByRoomElement(roomElement);
        if (tab === "") tab = "replay";
        const opponentTrainerElement = playUtil.getTrainerElementBySide(roomElement, !isRight);
        const opponentTrainerName = playUtil.getTrainerNameByElement(opponentTrainerElement);
        const opponentRevealedPokemonIds = playUtil.getRevealedPokemonIds(opponentTrainerElement) || [];
        const opponentHasDitto = _hiddenDitto[tab] === opponentTrainerName || opponentRevealedPokemonIds.some(p => p === "ditto");
        const dittoMonNumbers = monNumbers + (opponentHasDitto ? "DITTO" : "");

        let unrevealedPokemonOdds = {};
        if (revealedPokemonIds.length !== 0) {
            if (_unrevealedPokemonOdds[tab] != void 0 && _unrevealedPokemonOdds[tab][trainerName] != void 0) {
                unrevealedPokemonOdds = _unrevealedPokemonOdds[tab][trainerName][dittoMonNumbers] || unrevealedPokemonOdds;
            }
            calculateUnrevealedPokemon(trainerElement, roomElement);
        }
        else unrevealedPokemonOdds = _initialTypeOdds;
        let html = "<h2 class=\"unrevealed-pokemon\">Unrevealed Pokémon:";
        const sortedTypeKeys = Object.keys(unrevealedPokemonOdds)
            .sort((a, b) => unrevealedPokemonOdds[b] - unrevealedPokemonOdds[a])
            .sort((a, b) => a === "Paralysis" ? -1 : b === "Paralysis" ? 1 : 0)
            .sort((a, b) => a === "Sleep" ? -1 : b === "Sleep" ? 1 : 0);
        if (Object.keys(unrevealedPokemonOdds).length === 0) html += "</h2><p><span id=\"unrevealedPokemonChecking\">Calculating, check again soon...</span>";
        else html += " <small>(" + unrevealedPokemonOdds["Total"] + " possible)</small></h2><p>";
        for (const typeKey of sortedTypeKeys) {
            if (typeKey === "Total") continue;
            else if (typeKey === "Sleep") html += "<b class=\"title\">Status inflicters:</b></br>";
            if (Number.parseFloat((unrevealedPokemonOdds[typeKey] * 100).toFixed(1)) == 0) html += "<span class=\"zero\">";
            else html += "<span>";
            const approximate = (unrevealedPokemonOdds[typeKey] > 0 && revealedPokemonIds.length < 5) ? "~" : "";
            html += "&nbsp;• " + util.capitalizeFirstLetter(typeKey) + ": " + approximate + (unrevealedPokemonOdds[typeKey] * 100).toFixed(1) + "%</br></span>";
            if (typeKey === "Paralysis") html += "<br><b class=\"title\">Types:</b></br>";
        }
        html += "</p>";

        const tooltip = util.battleTooltips;
        tooltip.showTooltip(html, element, "unrevealedPokemon", { trainer: trainerName, pokemon: dittoMonNumbers });
        element.removeAttribute("title");
        element.addEventListener("mouseout", function (event) {
            tooltip.hideTooltip(event.target);
            element.setAttribute("title", "Not revealed");
        });
    }

    const changeAvatar = function(element) {
        if (!_settings.randomAvatar || _settings.randomAvatar === 0) return;
        const tab = playUtil.getParentRoomElement(element, _page);
        if (!tab) return;
        const usernameElement = document.querySelector(".usernametext");
        const trainerElements = tab.querySelectorAll(".trainer");
        let match = false;
        for (const trainerElement of trainerElements) {
            const trainerName = playUtil.getTrainerNameByElement(trainerElement);
            const loggedInName = usernameElement.innerText.replace(/\s/g,'');
            if (trainerName == loggedInName) match = true;
        }
        if (!match) return;
        const form = tab.querySelector("form.chatbox");
        if (!form) return;
        const histories = tab.querySelectorAll(".battle-log");
        for (const history of histories) {
            if (history.innerHTML.indexOf("Avatar changed to:") !== -1) return;
        }
        let trainerName = "";
        while (trainerName.length === 0 || trainerName.indexOf("2") !== -1) {
            const spriteNames = _settings.randomAvatar === 1 ? consts.trainerSprites : consts.animatedTrainerSprites;
            trainerName = spriteNames[Math.floor(Math.random() * spriteNames.length)];
        }
        playUtil.changeAvatar(trainerName, _settings.animateTrainer);
    }

    const showTrainerTooltip = function (element) {
        const calculateWinRate = function (ratings, opponentRatings) {
            const eloWinRate = calculateEloWinRate(ratings?.elo, opponentRatings?.elo);
            const glickoWinRate = calculateGlickoWinRate(ratings?.rpr, ratings?.rprd, opponentRatings?.rpr, opponentRatings?.rprd);
            const lowestDeviation = Math.min(ratings?.rprd || 0, opponentRatings?.rprd || 0);
            const eloWeight = (Math.min(lowestDeviation, 125) - 25) / 200;
            const glickoWeight = 1- eloWeight;
            return isNaN(glickoWinRate) ? eloWinRate : (eloWinRate * eloWeight) + (glickoWinRate * glickoWeight);
        }
    
        const calculateGlickoWinRate = function (rating, ratingDeviation, opponentRating, opponentRatingDeviation) {
            if (!rating || !ratingDeviation || !opponentRating || !opponentRatingDeviation) return;
            const pi2 = 9.8696044;
            const q = 0.00575646273;    
            const rd = Math.sqrt(ratingDeviation * ratingDeviation + opponentRatingDeviation * opponentRatingDeviation);
            const g = 1 / Math.sqrt(1 + 3 * q * q * rd * rd / pi2);
            return 1 / (1 + Math.pow(10, -1 * g * (rating - opponentRating) / 400));
        }
    
        const calculateEloWinRate = function (rating, opponentRating) {
            if (!rating || rating < 1000) rating = 1000;
            if (!opponentRating || opponentRating < 1000) opponentRating = 1000;
            const eloWinRate = 1 / (1 + Math.pow(10, (opponentRating - rating) / 400));
            return eloWinRate;
        }

        const calculateElo = function(rating, opponentRating, result) {
            if (!rating || rating < 1000) rating = 1000;
            if (!opponentRating || opponentRating < 1000) opponentRating = 1000;
            let k = 50;
			if (rating < 1100) {
				if (result === -1) {
					k = 20 + (rating - 1000)*30/100;
				} else if (result === 1) {
					k = 80 - (rating - 1000)*30/100;
				}
			} else if (rating > 1300) {
				k = 40;
			} else if (rating >= 1600) {
                k = 32;
            }
            var winRate = calculateEloWinRate(rating, opponentRating);
            let change = k * (((result + 1) / 2) - winRate);
            if (rating + change < 1000) change = 1000 - rating;
            return change;
        }

        if (_settings.trainerTooltip === false) return;
        const trainerNameWithSpaces = playUtil.getTrainerNameByElement(element.closest(".trainer"), false);
        const userId = trainerNameWithSpaces.replace(/\s/g,'').toLowerCase();
        const format = window.location.pathname.startsWith("/battle")
            ? window.location.pathname.split("-")[1]
            : window.location.pathname.split("-")[0].substring(1);
        let html = _ladders[format] && _ladders[format].includes(util.slugify(userId))
            ? "<h2>" + trainerNameWithSpaces + " <span class=\"info\">#" + (_ladders[format].indexOf(util.slugify(userId)) + 1) + "</span></h2><p>"
            : "<h2>" + trainerNameWithSpaces + "</h2><p>";
        let elo = element.hasAttribute("title")
            ? element.getAttribute("title").substring(element.getAttribute("title").indexOf("Rating: ") + 8)
            : "Loading...";
        let eloChange = "Loading...";
        let age = "Loading...";
        let gxe = "Loading...";
        let glicko = "Loading...";
        let winProbability = "Loading...";
        const { wins, draws, losses } = _results[userId] ?? { wins: 0, draws: 0, losses: 0 };
        let winLoss = wins + "-" + draws + "-" + losses;
        if (wins + losses > 0) winLoss += " (" + Math.round(wins / (wins + losses) * 100) + "%)";
        const roomElement = playUtil.getParentRoomElement(element, _page);
        if (_ratings[userId]) {
            const isRight = playUtil.getIsRightByChildElement(element);
            const opponentTrainerElement = playUtil.getTrainerElementBySide(roomElement, !isRight);
            const opponentId = playUtil.getTrainerNameByElement(opponentTrainerElement).replace(/\s/g,'').toLowerCase();
            if (elo === "Loading..." || _page === "play") elo = _ratings[userId][format]?.elo ? Math.round(_ratings[userId][format].elo) : 1000;
            const eloLoss = calculateElo(_ratings[userId][format]?.elo, _ratings[opponentId][format]?.elo, -1);
            const eloTie = calculateElo(_ratings[userId][format]?.elo, _ratings[opponentId][format]?.elo, 0);
            const eloGain = calculateElo(_ratings[userId][format]?.elo, _ratings[opponentId][format]?.elo, 1);
            if (_ratings[userId].registertime > 0) age = new Date(_ratings[userId].registertime*1000).toLocaleDateString("en-US");
            else age = "Unregistered";
            gxe = _ratings[userId][format]?.gxe ? _ratings[userId][format].gxe + "%" : "50.0%";
            glicko = _ratings[userId][format]?.rpr
                ? Math.round(_ratings[userId][format].rpr) + " ± " + Math.round(_ratings[userId][format].rprd)
                : "1500 ± 130";
            const winRate = calculateWinRate(_ratings[userId][format], _ratings[opponentId][format]);
            winProbability = "<span class=\"" + (winRate > .5 ? "green" : "red") + "\">" + (winRate * 100).toFixed(2) + "%</span>";
            eloChange = "<span class=\"green\">+" + Math.round(eloGain)
                + "</span> / " + (eloTie > 0 ? "+" : "") + Math.round(eloTie)
                + " / <span class=\"red\">" + Math.round(eloLoss) + "</span>";
        }
        html += "<span class=\"section\">Registered:<span class=\"info\">" + age + "</span></span>"
            + "<span class=\"section\">Elo:<span class=\"info\"><b>" + elo + "</b></span><br>"
            + "GXE:<span class=\"info\">" + gxe + "</span><br>"
            + "Glicko-1:<span class=\"info\">" + glicko + "</span></span>";
        html += "<span class=\"section\">Win probability:<span class=\"info\">" + winProbability + "</span><br>";
        if (roomElement.querySelector(".rated")) {
            html += "Elo change:<span class=\"info\">" + eloChange + "</span></span>";
        }
        if (document.querySelector(".usernametext")) {
            const loggedInName = document.querySelector(".usernametext").innerText.replace(/\s/g,'').toLowerCase();
            if (loggedInName !== userId) html += "<span class=\"section\">Personal record:<span class=\"info\">" + winLoss + "</span></span>";
        }
        html += "</p>";
        const tooltip = util.battleTooltips;
        tooltip.showTooltip(html, element, "trainer", { trainer: userId });
        const title = element.getAttribute("title");
        element.removeAttribute("title");
        element.addEventListener("mouseout", function (event) {
            tooltip.hideTooltip(event.target);
            if (title) element.setAttribute("title", title);
        });
    }

    const showTooltip = function (element, tooltipElement, isRight) {

        const getStatus = function (statElement, trainerElement, tooltip) {
            let status = "";
            let hasReflect = false;
            let hasLightScreen = false;
            const boosts = {};
            if (statElement != void 0 && statElement.querySelector(".status") != void 0) {
                const statStatusElement = statElement.querySelector(".status");
                const statusElements = statStatusElement.children.length === 0
                    ? [statStatusElement]
                    : [...statStatusElement.children];
                if (tooltip != void 0 && tooltip.querySelector(".status") != void 0) {
                    status = tooltip.querySelector(".status").innerText;
                }
                else {
                    if (statStatusElement.children.length === 0) {
                        status = statStatusElement.innerText;
                    }
                    else {
                        const statusChild = Array.from(statStatusElement.children).find(e => e.className !== "bad" && e.className !== "good");
                        if (statusChild != void 0) status = statusChild.innerText;
                    }
                }
                let isActive = true;
                if (tooltip != void 0 && !tooltip.classList.contains("tooltip-move")) {
                    const tooltipPokemonName = playUtil.getPokemonNameFromTooltip(tooltip, _pokemons);
                    const pokemonId = playUtil.getPokemonIdByName(tooltipPokemonName);
                    isActive = playUtil.getActivePokemonId(trainerElement) === pokemonId;
                }
                if (isActive) {
                    for (const element of statusElements) {
                        if (element.innerText === "Reflect") hasReflect = true;
                        else if (element.innerText === "Light Screen") hasLightScreen = true;
                        else {
                            const index = element.innerText.indexOf("\u00D7");
                            if (index !== -1) {
                                const parsedValue = Number.parseFloat(element.innerText.substring(0, index));
                                const boostValue = parsedValue < 1
                                    ? 2 - Math.round(2 / parsedValue)
                                    : (parsedValue * 2) - 2;
                                const boostName = element.innerText.substring(index + 1).trim().toLowerCase();
                                boosts[boostName] = boostValue;
                            }
                        }
                    }
                }
            }
            return { status: status, hasReflect: hasReflect, hasLightScreen: hasLightScreen, boosts: boosts };

        }

        const buildTooltipPokemon = function (tooltip, roomElement, isRight, pokemonId) {
            const pokemons = [..._pokemons];
            if (tooltip != void 0 && !!pokemons) {
                const statElement = playUtil.getStatElementBySide(roomElement, isRight);
                const opponentStatElement = playUtil.getStatElementBySide(roomElement, !isRight);
                const opponentTrainerElement = playUtil.getTrainerElementBySide(roomElement, !isRight);

                let { exactHealth, healthRemainingPercent } = playUtil.getPokemonHealth(tooltip.querySelectorAll("p")[0].childNodes[1], statElement);
                const tab = playUtil.getTabIdByRoomElement(roomElement);
                const trainerElement = playUtil.getTrainerElementBySide(roomElement, isRight);
                const trainerName = playUtil.getTrainerNameByElement(trainerElement);
                const isActive = playUtil.getActivePokemonId(trainerElement) === pokemonId;
                const pokemonLevel = playUtil.getLevelFromStatElement(!isActive ? tooltip.querySelector("h2") : statElement);
                const status = getStatus(statElement, trainerElement, tooltip);
                const pokemon = {
                    exactHealth: exactHealth,
                    healthRemainingPercent: healthRemainingPercent,
                    id: pokemonId,
                    level: pokemonLevel,
                    boosts: status.boosts,
                    status: status.status,
                    hasReflect: status.hasReflect,
                    hasLightScreen: status.hasLightScreen
                }
                if (pokemon.level == void 0) return;
                const transformedId = playUtil.getTransformedId(trainerElement, statElement);
                const opponentTrainerName = playUtil.getTrainerNameByElement(opponentTrainerElement);
                if (isActive && transformedId !== pokemon.id) {
                    pokemon.transformedId = transformedId,
                        pokemon.transformedLevel = playUtil.getPokemonLevelById(_levels, _timeoutIds, tab, opponentTrainerName, transformedId, !isRight)
                    if (pokemon.transformedLevel == void 0) return;
                }
                const opponentPokemonId = playUtil.getActivePokemonId(opponentTrainerElement);
                const opponentStatus = getStatus(opponentStatElement, opponentTrainerElement);
                if (opponentPokemonId != void 0) {
                    const opponent = {
                        healthRemainingPercent: Number.parseInt(opponentStatElement.querySelector(".hptext").childNodes[0].nodeValue.trim().replace("%", "")),
                        id: opponentPokemonId,
                        level: playUtil.getLevelFromStatElement(opponentStatElement),
                        boosts: opponentStatus.boosts,
                        status: opponentStatus.status,
                        hasReflect: opponentStatus.hasReflect,
                        hasLightScreen: opponentStatus.hasLightScreen
                    }
                    if (opponent.level == void 0) return;
                    const opponentTransformedId = playUtil.getTransformedId(opponentTrainerElement, opponentStatElement)
                    if (opponentTransformedId !== opponent.id) {
                        opponent.transformedId = opponentTransformedId;
                        opponent.transformedLevel = playUtil.getPokemonLevelById(_levels, _timeoutIds, tab, trainerName, opponentTransformedId, !isRight);
                        if (opponent.transformedLevel == void 0) return;
                    }
                    pokemon.opponent = opponent;
                }
                return pokemon;
            }
        }

        const tooltip = tooltipElement.querySelector(".tooltip-pokemon, .tooltip-switchpokemon, .tooltip-move, .tooltip-activepokemon");
        const roomElement = Array.from(document.querySelectorAll(".ps-room-opaque, div:not([class]) > .battle")).find(e => e.style.display !== "none");
        if (tooltip != void 0) {
            let section = tooltipElement.querySelector(".section");
            if (tooltip.querySelector(".calculator") != void 0) return;
            if (tooltip.classList.contains("tooltip-move") && _settings.damageCalculator !== false) {
                const trainerElement = playUtil.getTrainerElementBySide(roomElement, isRight);
                const activePokemonId = playUtil.getActivePokemonId(trainerElement);
                const tooltipPokemon = buildTooltipPokemon(tooltip, roomElement, isRight, activePokemonId);
                showMoveTooltip(section, tooltip, roomElement, tooltipPokemon);
            }
            else {
                const tooltipPokemonName = playUtil.getPokemonNameFromTooltip(tooltip, _pokemons);
                const pokemonId = playUtil.getPokemonIdByName(tooltipPokemonName);
                const tooltipPokemon = buildTooltipPokemon(tooltip, roomElement, isRight, pokemonId);
                if (tooltipPokemon) showPokemonTooltip(section, tooltip, roomElement, isRight, tooltipPokemon);
            }
            util.battleTooltips.placeTooltip(null, element, true);
        }
    }

    const showMoveTooltip = function (section, tooltip, roomElement, pokemon) {
        if (pokemon.id == void 0) return;
        if (tooltip.querySelector(".tooltip-section").querySelector(".calculator") != void 0) return;
        section = document.createElement("p");
        section.className = "section";
        const moveName = tooltip.querySelector("h2").childNodes[0].nodeValue;
        if (moveName === "Recharge") return;
        const moveButton = Array.from(roomElement.querySelectorAll("button[name=chooseMove]")).find(b => b.childNodes[0].nodeValue === moveName);
        let failureRate = Number.parseFloat(moveButton.getAttribute("data-failure-rate"));
        failureRate = isNaN(failureRate) ? null : failureRate;

        const damageCalc = roobyCalc.damage(pokemon, pokemon.opponent, moveName);
        const critDamageCalc = roobyCalc.damage(pokemon, pokemon.opponent, moveName, null, true);

        if (!isNaN(damageCalc.maxDamage) || (damageCalc.minDamage === "?" && damageCalc.maxDamage === "?")) {
            const minDamage = damageCalc.minDamage === "?" ? "?" : ((damageCalc.minDamage * 100).toFixed(1) + "%");
            const maxDamage = damageCalc.maxDamage === "?" ? "?" : ((damageCalc.maxDamage * 100).toFixed(1) + "%");
            let html = "<div class=\"calculator\"><div class=\"damage-container\"><span>Damage: " + minDamage + " - " + maxDamage + "</span>";
            if (damageCalc.minRecoil != void 0) {
                html += "<small class=\"recoil\">(" + (damageCalc.minRecoil * 100).toFixed(1) + "% - " + (damageCalc.maxRecoil * 100).toFixed(1) + "% recoil)</small>";
            }
            if (!isNaN(critDamageCalc.minDamage) && damageCalc.critRate < 1 && damageCalc.critRate > 0) {
                html += "</div><div>Crit (" + (damageCalc.critRate * 100).toFixed(1) + "%): " + (critDamageCalc.minDamage * 100).toFixed(1) + "% - " + (critDamageCalc.maxDamage * 100).toFixed(1) + "%</div>"
            }
            if (damageCalc.hkoPercentage != void 0) {
                html += "<div class=\"hko\">" + (damageCalc.hkoPercentage * 100).toFixed(1) + "% chance to " + damageCalc.hkoMultiple + "HKO</div>";
                if (damageCalc.hkoMultiple > 1 && damageCalc.critRate < 1 && damageCalc.critRate > 0) {
                    html += "<div>" + (critDamageCalc.hkoPercentage * 100).toFixed(1) + "% chance to " + critDamageCalc.hkoMultiple + "HKO with crit</span></div>";
                }
                else html += "</div>";
            }
            section.innerHTML += html;
            tooltip.querySelector(".tooltip-section").before(section);
        }
        else if (failureRate != void 0 && _settings.miscCalculator !== false) {
            section.innerHTML += "<div class=\"calculator\"><div class=\"damage-container\"><small class=\"failure p"
                + (failureRate * 100).toFixed(0) + "\">("
                + (failureRate != 0 && failureRate != 1 ? "~" : "")
                + (failureRate * 100).toFixed(0)
                + "% chance of failure)</small></div>";
            tooltip.querySelector(".tooltip-section").before(section);
        }
    }

    const showPokemonTooltip = function (section, tooltip, roomElement, isRight, tooltipPokemon) {

        const showRecoverFailureRate = function (revealedMoveElement, failureRate) {
            if (failureRate != void 0 && _settings.miscCalculator !== false) {
                const recoverSpan = document.createElement("span");
                recoverSpan.innerHTML = "<small class=\"failure p" + (failureRate * 100).toFixed(0) + "\">(" 
                    + (failureRate != 0 && failureRate != 1 ? "~" : "") + (failureRate * 100).toFixed(0) + "% fail)</small>";
                revealedMoveElement.parentElement.insertBefore(recoverSpan, revealedMoveElement.nextSibling);
            }
        }

        if (section == void 0) {
            section = document.createElement("p");
            section.className = "section";
        }
        const h2 = tooltip.querySelector(".tooltip h2");
        const trainerElement = playUtil.getTrainerElementBySide(roomElement, isRight);
        const trainerStatElement = playUtil.getStatElementBySide(roomElement, isRight);
        const isTransformed = playUtil.getIsTransformedByStatElement(trainerStatElement);
        const nameSmall = Array.from(h2.querySelectorAll("small"))
            .find(s => !s.innerHTML.startsWith(consts.transformedIntoString) && !s.innerHTML.startsWith("(L") && !s.innerHTML.startsWith("(Type"));
        const pokemonName = nameSmall != void 0 && nameSmall.innerHTML != void 0 && nameSmall.innerHTML.indexOf("(") !== -1
            ? nameSmall.innerHTML.substring(1, nameSmall.innerHTML.length - 1)
            : h2.childNodes[0].nodeValue.trim();
        const pokemon = _pokemons.find(p => p.name == pokemonName);
        if (pokemon == void 0) return;
        const pokemonLevel = playUtil.getLevelFromStatElement(h2);
        const tab = playUtil.getTabIdByRoomElement(roomElement);
        const trainerName = playUtil.getTrainerNameByElement(trainerElement);
        setLevels(pokemonLevel, tab, trainerName, pokemon.id);
        const transformedSmall = Array.from(h2.querySelectorAll("small")).find(s => s.innerHTML.indexOf(consts.transformedIntoString) !== -1);
        const transformedIntoName = transformedSmall != void 0
            ? transformedSmall.innerHTML.substring(transformedSmall.innerHTML.indexOf(consts.transformedIntoString) + consts.transformedIntoString.length, transformedSmall.innerHTML.length - 1)
            : pokemonName;
        tooltip.appendChild(section);

        if (_settings.miscCalculator !== false) {
            const confusionDamageSpan = document.createElement("span");
            confusionDamageSpan.className = "self-hit damage";
            confusionDamageSpan.innerHTML = "(" + (pokemon.confusionDamage[0] * 100).toFixed(1) + "% or " + (pokemon.confusionDamage[1] * 100).toFixed(1) + "% self-hit)";
            const healthElement = tooltip.querySelectorAll("p")[0].childNodes[1];
            healthElement.parentElement.appendChild(confusionDamageSpan);
        }

        const revealedMoveElements = Array.prototype.slice.call(section.parentNode.childNodes)
            .filter(cn => cn.className === "tooltip-section")
            .map(cn => Array.prototype.slice.call(cn.childNodes).filter(cncn => cncn.nodeName === "#text"))
            .flat();
        let unrevealedMoves = [];
        let isRandomBattle = roomElement.id.indexOf("randombattle") !== -1;
        if (_page === "replay") {
            if (window.location.pathname.indexOf("gen1randombattle") !== -1) isRandomBattle = true;
        }
        if (_settings.movesetCalculator !== false && isRandomBattle) {
            const transformedMoveElements = revealedMoveElements.filter(rme => rme.nodeValue.indexOf("• ") === -1);
            const transformedMoveNames = transformedMoveElements.map(rme => rme.nodeValue.trim());
            const revealedMoveNames = revealedMoveElements.map(rme => rme.nodeValue.trim().substring(2)).filter(rmn => !transformedMoveNames.includes(rmn));
            const clickedMoves = pokemon.moves.filter(move => revealedMoveNames.includes(move.name));
            if (isTransformed) {
                const transformedInto = isTransformed ? _pokemons.find(p => p.name === (isTransformed ? transformedIntoName : pokemonName)) : pokemon;
                const transformedMoves = transformedInto.moves.filter(move => transformedMoveNames.includes(move.name));
                unrevealedMoves = roobyCalc.unrevealedMoves(transformedInto, transformedMoves).filter(um => !transformedMoves.some(cm => cm.id == um.id));
            }
            else {
                unrevealedMoves = roobyCalc.unrevealedMoves(pokemon, clickedMoves).filter(um => !clickedMoves.some(cm => cm.id == um.id));
            }
        }

        for (const revealedMoveElement of revealedMoveElements) {
            const revealedMoveName = revealedMoveElement.nodeValue.trim().substring(revealedMoveElement.nodeValue.trim().indexOf("• ") === -1 ? 0 : 2);
            const moveButton = Array.from(roomElement.querySelectorAll("button[name=chooseMove]")).find(b => b.childNodes[0].nodeValue === revealedMoveName);
            if (tooltipPokemon.opponent != void 0) {
                const damageCalc = roobyCalc.damage(tooltipPokemon, tooltipPokemon.opponent, revealedMoveName);
                let failureRate = moveButton == void 0 ? damageCalc.failureRate : Number.parseFloat(moveButton.getAttribute("data-failure-rate"));
                failureRate = isNaN(failureRate) ? damageCalc.failureRate : failureRate;
                if (!isNaN(damageCalc.maxDamage) && _settings.damageCalculator !== false) {
                    const damageSpan = document.createElement("span");
                    damageSpan.className = "damage";
                    damageSpan.innerHTML = (damageCalc.minDamage * 100).toFixed(1) + "%-" + (damageCalc.maxDamage * 100).toFixed(1) + "%";
                    const isSwitchPokemon = tooltip.classList.contains("tooltip-switchpokemon");
                    revealedMoveElement.parentElement.insertBefore(damageSpan, isSwitchPokemon ? revealedMoveElement.nextSibling : revealedMoveElement);
                }
                else showRecoverFailureRate(revealedMoveElement, failureRate);
            }
            else {
                const damageCalc = roobyCalc.damage(tooltipPokemon, tooltipPokemon.opponent, revealedMoveName);
                let failureRate = moveButton == void 0 ? damageCalc.failureRate : Number.parseFloat(moveButton.getAttribute("data-failure-rate"));
                failureRate = isNaN(failureRate) ? damageCalc.failureRate : failureRate;
                showRecoverFailureRate(revealedMoveElement, failureRate);
            }
        }
        if (!tooltip.classList.contains("tooltip-switchpokemon")) {
            for (const move of unrevealedMoves) {
                const probability = Math.round(move.probability * 100) / 100;
                let className = "calculator";
                if (probability == 0) className += " zero";
                let moveString = "<div class='" + className + "'>• " + move.name + " <small>" + probability + "%";
                if (tooltipPokemon.opponent != void 0) {
                    const damageCalc = roobyCalc.damage(tooltipPokemon, tooltipPokemon.opponent, move.name);
                    const moveButton = Array.from(roomElement.querySelectorAll("button[name=chooseMove]")).find(b => b.childNodes[0].nodeValue === move.name);
                    let failureRate = moveButton == void 0 ? damageCalc.failureRate : Number.parseFloat(moveButton.getAttribute("data-failure-rate"));
                    failureRate = isNaN(failureRate) ? damageCalc.failureRate : failureRate;
                    if (((!isNaN(damageCalc.minDamage) && !isNaN(damageCalc.maxDamage)) || (damageCalc.minDamage === "?" && damageCalc.maxDamage === "?")) && _settings.damageCalculator !== false) {
                        const minDamage = damageCalc.minDamage === "?" ? "?" : ((damageCalc.minDamage * 100).toFixed(1) + "%");
                        const maxDamage = damageCalc.maxDamage === "?" ? "?" : ((damageCalc.maxDamage * 100).toFixed(1) + "%");
                        moveString += " <span class='damage'>" + minDamage + "-" + maxDamage + "</span>";
                    }
                    else if (failureRate != void 0 && _settings.miscCalculator !== false) {
                        moveString += "<span class=\"failure p" + (failureRate * 100).toFixed(0) + "\">(" + (failureRate * 100).toFixed(0) + "% fail)</span>";
                    }
                }
                moveString += "</small></div>";
                section.innerHTML += moveString;
            }
        }
    }

    const simulateOdds = function (target, value) {
        const args = value.split(" ").map(a => a.toLowerCase());
        const simulationTypes = ["pokemon", "types", "dual types"];
        if (args.length > 2 && args[1] === "dual" && args[2] === "types") args[1] = "dual types";
        const example = "<b>Example:</b> /odds dual types [butterfree, golduck, vulpix] ditto:true";
        if (args.length === 1 || args[1] === "help") {
            playUtil.chatOutput(target, 
                "Use the command /odds followed by the simulation type, the team between brackets and optionally <i>\"ditto:true.\"</i> and <i>\"simulations:200000.\"</i><br>" 
                + "Valid simulation types are: " + simulationTypes.map(st => "<i>\"" + st + "\"</i>").join(", ") + ".<br>"
                + example);
        }
        else if (!simulationTypes.includes(args[1])) {
            playUtil.chatOutput(target, 
                "<span class=\"failure\">Invalid simulation type.</span> Valid types are: <i>\"" + simulationTypes.join("\"</i>, <i>\"") + "\"</i>.<br>" + example);
        }
        else if (value.indexOf("[") === -1 || value.indexOf("]") === -1) {
            playUtil.chatOutput(target, 
                "<span class=\"failure\">Invalid team format.</span> Please use brackets to enclose the team. If team is empty, use an empty bracket \"<i>[]</i>\".<br>" + example);
        }
        else {
            let simulations;
            if (value.indexOf("simulations") !== -1) {
                const simulationsArg = args.find(a => a.startsWith("simulations:"));
                simulations = Number.parseInt(simulationsArg.substring(12, simulationsArg.length));
                if (isNaN(simulations)) {
                    playUtil.chatOutput(target, "<span class=\"failure\">Invalid simulations number.</span> Please use a valid number.<br>" + example + " simulations:200000");
                    return;
                }
            }
            const type = args[1];
            const currentTeamIdsOrNamesString = value.substring(value.indexOf("[") + 1, value.indexOf("]"));
            const currentTeamIdsOrNames = currentTeamIdsOrNamesString.replace(/\s/g, '').split(",");
            const pokemonIds = Object.keys(consts.pokedex);
            const safePokemonIds = currentTeamIdsOrNames.filter(ion => ion.length > 0).map(ion => util.getMostSimilarString(ion, pokemonIds));
            const currentTeamNumbers = safePokemonIds.map(p => consts.pokedex[p].num);
            const isDitto = args.some(a => a === "ditto:true");
            const pokemons = [..._pokemons];
            playUtil.chatOutput(target, "Calculating remaining " + (type === "pokemon" ? "Pokémon" : type) + ", please wait...");
            const oddsDisplay = function (key, odds, isApproximate) {
                const isTotal = key === "Total";
                isApproximate = isApproximate && odds > 0;
                if (isTotal) key = "Total Pokémon";
                else odds = (odds * 100).toFixed(1).replace(".0", "");
                let output = "<b>" + key + ":</b> " + (isApproximate && !isTotal ? "~" : "") + odds + (isTotal ? "" : "%");
                if (key === "Paralysis") output += "<br>";
                return output;
            }
            chrome.runtime.sendMessage({ function: "simulate", args: { type, currentTeamNumbers, isDitto, pokemons, simulations } }, function (result) {
                let output = Object.keys(result.odds)
                    .map(o => [o, result.odds[o]])
                    .filter(o => type === "pokemon" ? o[1] > 0 : true)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .sort((a, b) => b[1] - a[1])
                    .sort((a, b) => b[0] === "Total" ? -1 : a[0] === "Total" ? 0 : 1)
                    .sort((a, b) => a[0] === "Paralysis" ? -1 : b[0] === "Paralysis" ? 1 : 0)
                    .sort((a, b) => a[0] === "Sleep" ? -1 : b[0] === "Sleep" ? 1 : 0)
                    .map(o => oddsDisplay(o[0], o[1], currentTeamNumbers.length < 5 && simulations == void 0))
                    .join("<br>");
                const pokemonNames = safePokemonIds.map(p => consts.pokedex[p].name).join(", ");
                if (safePokemonIds.length < 3) result.simulations = result.simulations || consts.defaultSimulations * 4;
                output = "<b>Remaining " + (type === "pokemon" ? "Pokémon" : type) + " for a"
                    + (pokemonNames.length > 0 ? " " + pokemonNames : "n empty") + " team"
                    + (result.simulations != void 0 ? " (" + result.simulations + " simulations)" : "")
                    + ":</b><hr>" + output;
                playUtil.chatOutput(target, output, "rooby-chat-info");
                void chrome.runtime.lastError;
            });
        }
    }

    const showMovesets = function (target, value) {
        const args = value.split(" ").map(a => a.toLowerCase());
        if (args.length === 1 || args[1] === "help") {
            const example = "<b>Example:</b> /movesets Parasect";
            playUtil.chatOutput(target, "Use the command /movesets followed by the name of the Pokémon.<br>" + example);
        }
        else {
            const name = util.getMostSimilarString(args[1], _pokemons.map(p => p.name));
            const pokemon = _pokemons.find(p => p.name === name);
            const moveSetDisplay = function (moveset) {
                const moveNames = moveset.moves.map(m => consts.moves[m].name);
                const output = moveNames.join(", ") + ": " + (moveset.percent * 100).toFixed(2) + "%";
                return output;
            }
            const moveSetsOutput = pokemon.moveSets
                .sort((a, b) => a.moves.toString().localeCompare(b.moves.toString()))
                .sort((a, b) => b.percent - a.percent)
                .map(m => moveSetDisplay(m))
                .join("<br>");
            const output = "<b>Movesets for " + pokemon.name + ":</b><hr>" + moveSetsOutput;
            playUtil.chatOutput(target, output, "rooby-chat-info");
        }
    }

    const showMoves = function (target, value) {
        const args = value.split(" ").map(a => a.toLowerCase());
        if (args.length === 1 || args[1] === "help") {
            const example = "<b>Example:</b> /moves Slowbro";
            playUtil.chatOutput(target, "Use the command /moves followed by the name of the Pokémon.<br>" + example);
        }
        else {
            const name = util.getMostSimilarString(args[1], _pokemons.map(p => p.name));
            const pokemon = _pokemons.find(p => p.name === name);
            const moveSetDisplay = function (move) {
                const output = move.name + ": " + (move.probability * 100).toFixed(2) + "%";
                return output;
            }
            const movesOutput = pokemon.moves
                .sort((a, b) => a.name.localeCompare(b.name))
                .sort((a, b) => b.probability - a.probability)
                .map(m => moveSetDisplay(m))
                .join("<br>");
            const output = "<b>Moves for " + pokemon.name + ":</b><hr>" + movesOutput;
            playUtil.chatOutput(target, output, "rooby-chat-info");
        }
    }

    const showWinRate = function (target, value) {
        const args = value.split(" ").map(a => a.toLowerCase());
        const winrateTypes = ["personal", "opponent", "reset"];
        const example = "<b>Example:</b> /winrates personal";
        if (args.length === 1 || args[1] === "help") {
            playUtil.chatOutput(target, 
                "Use the command /winrates followed by the Pokémon winrate type. /winrates reset will wipe your Pokémon winrate records.<br>" 
                + "Valid winrate types are: " + winrateTypes.map(st => "<i>\"" + st + "\"</i>").join(", ") + ".<br>"
                 + example);
        }
        else if (!winrateTypes.includes(args[1])) {
            playUtil.chatOutput(target, 
                "<span class=\"failure\">Invalid Pokémon winrate type.</span> Valid types are: <i>\"" + winrateTypes.join("\"</i>, <i>\"") + "\"</i>.<br>" + example);
        }
        else if (args[1] === "reset") {
            const newWinrates = { wins: {}, losses: {}, opponentWins: {}, opponentLosses: {} };
            _winRates = newWinrates;
            util.saveStorage("winRates", newWinrates);
            playUtil.chatOutput(target, "<b>Personal and opponent Pokémon winrates reset.</b>", "rooby-chat-info");
        }
        else if (args[1] === "personal" || args[1] === "opponent") {
            const isPersonal = args[1] === "personal";
            let output = "<b>" + (isPersonal ? "Personal" : "Opponent") + " winrates:</b><hr>";
            for (const pokemon of _pokemons) {
                if (_winRates.wins == void 0) _winRates = { wins: {}, losses: {}, opponentWins: {}, opponentLosses: {} };
                const wins = (isPersonal ? _winRates.wins[pokemon.number] : _winRates.opponentWins[pokemon.number]) ?? 0;
                const losses = (isPersonal ? _winRates.losses[pokemon.number] : _winRates.opponentLosses[pokemon.number]) ?? 0;
                const percent = wins + losses > 0
                    ? ((wins / (wins + losses)) * 100).toFixed(2) + "%"
                    : "N/A";
                output += pokemon.name + ": " + percent + " (" + (wins + losses) + " matches)<br>";
            }
            playUtil.chatOutput(target, output, "rooby-chat-info");
        }
    }

    const showRooby = function (target) {
        let output = "<b>RooBY Commands</b><hr>";
        output += "<b>/odds</b> - Calculate the odds of a Pokémon or type appearing in a random battle. Use /odds help for more info.<br>";
        output += "<b>/movesets</b> - Show all possible movesets for a Pokémon. Use /movesets help for more info.<br>";
        output += "<b>/moves</b> - Show all possible moves for a Pokémon. Use /moves help for more info.<br>";
        output += "<b>/winrates</b> - Show your winrate with individual Pokémon. Use /winrates help for more info.<br>";
        output += "<b>/export</b> - Export the current battle's teams to the <a href=\"https://calc.pokemonshowdown.com/\" target=\"_new\">Showdown Damage Calculator</a>.<br>";
        output += "<b>/rooby</b> - Show this message.<br>";
        output += "Click the <i class=\"fa fa-cog\"></i> Options button on the top right to change RooBY settings.<br>";
        playUtil.chatOutput(target, output, "rooby-chat-info");
    }

    const getWinRates = async function() {
        let savedWinRates = await util.getStorage("winRates");
        if (savedWinRates == void 0) savedWinRates = { wins: {}, losses: {}, opponentWins: {}, opponentLosses: {} };
        else savedWinRates = savedWinRates.winRates;
        _winRates = savedWinRates;
        return savedWinRates;
    }

    const saveResult = async function(opponentName, tab, result, pokemons, opponentPokemons) {
        let savedResults = await util.getStorage("results");
        if (savedResults == void 0) savedResults = {};
        else savedResults = savedResults.results;
        if (savedResults[opponentName] == void 0) savedResults[opponentName] = {};
        if (savedResults[opponentName][tab] == void 0) {
            savedResults[opponentName][tab] = result;
            if (_results[opponentName] == void 0) _results[opponentName] = { wins: 0, draws: 0, losses: 0 };
            if (result === 1) _results[opponentName].wins++;
            else if (result === 0) _results[opponentName].draws++;
            else if (result === -1) _results[opponentName].losses++;
            util.saveStorage("results", savedResults);
            let savedWinRates = await getWinRates();
            for (const pokemon of pokemons) {
                const pokemonNumber = consts.pokedex[pokemon].num;
                if (result === -1) {
                    if (savedWinRates.losses[pokemonNumber] == void 0) savedWinRates.losses[pokemonNumber] = 0;
                    savedWinRates.losses[pokemonNumber]++;
                }
                else if (result === 1) {
                    if (savedWinRates.wins[pokemonNumber] == void 0) savedWinRates.wins[pokemonNumber] = 0;
                    savedWinRates.wins[pokemonNumber]++;
                }
            }
            for (const pokemon of opponentPokemons) {
                const pokemonNumber = consts.pokedex[pokemon].num;
                if (result === 1) {
                    if (savedWinRates.opponentLosses[pokemonNumber] == void 0) savedWinRates.opponentLosses[pokemonNumber] = 0;
                    savedWinRates.opponentLosses[pokemonNumber]++;
                }
                else if (result === -1) {
                    if (savedWinRates.opponentWins[pokemonNumber] == void 0) savedWinRates.opponentWins[pokemonNumber] = 0;
                    savedWinRates.opponentWins[pokemonNumber]++;
                }
            }
            _winRates = savedWinRates;
            util.saveStorage("winRates", savedWinRates);
        }
    }

    const getResults = async function(opponentName) {
        let savedResults = await util.getStorage("results");
        if (savedResults == void 0) savedResults = {};
        else savedResults = savedResults.results;
        if (savedResults[opponentName] != void 0) {
            let wins = 0;
            let draws = 0;
            let losses = 0;
            for (const tab in savedResults[opponentName]) {
                const result = savedResults[opponentName][tab];
                if (result === 1) wins++;
                else if (result === 0) draws++;
                else if (result === -1) losses++;
            }
            _results[opponentName] = { wins: wins, draws: draws, losses: losses };
        }
        else _results[opponentName] = { wins: 0, draws: 0, losses: 0 };
    }

    const exportTeams = function (uid, teamInfos) {

        const exportTeam = function (team, trainerName) {
            let output = "";
            for (const pokemon of team) {
                output += pokemon.name + " (" + trainerName + ")<br>";
                output += "Level: " + pokemon.level + "<br>";
                for (const move of pokemon.moves) {
                    output += "- " + move + "<br>";
                }
            }
            return output;
        }

        const target = document.querySelector("[data-uid=\"" + uid + "\"]");
        target.removeAttribute("data-uid");
        const teams = [];
        const trainerNames = [];
        for (let i = 0; i < teamInfos.length; i++) {
            teams[i] = [];
            trainerNames[i] = target.closest(".ps-room").querySelectorAll(".trainer")[i].querySelector("strong").innerText.replace(/\s/g, '');
            for (const memberInfo of teamInfos[i]) {
                const pokemon = _pokemons.find(p => p.name === memberInfo.name);
                const revealedMoves = pokemon.moves.filter(m => memberInfo.moves.includes(m.name));
                const unrevealedMoves = roobyCalc
                    .unrevealedMoves(pokemon, revealedMoves)
                    .filter(um => !revealedMoves.some(rm => rm.name === um.name))
                    .sort((a, b) => a.basePower - b.basePower)
                    .sort((a, b) => a.probability - b.probability);
                const moves = revealedMoves.concat(unrevealedMoves);
                const moveNames = moves.map(m => m.name);
                const member = {
                    name: memberInfo.name,
                    level: memberInfo.level,
                    moves: moveNames.slice(0, 4)
                }
                teams[i].push(member);
            }
        }
        const output = teams.map((t, i) => exportTeam(t, trainerNames[i])).join("<br><br>");
        playUtil.chatOutput(target, output, "rooby-chat-info");
    }

    const settingsPopup = function (element) {
        const avatarButton = element.querySelector("[name='avatars']");
        if (avatarButton == void 0) {
            const avatarList = element.querySelector(".avatarlist");
            if (avatarList && !avatarList.querySelector("button[id]")) {
                const avatarButtons = Array.from(avatarList.querySelectorAll("button:not([id])"));
                for (const button of avatarButtons) {
                    button.addEventListener("click", function (e) {
                        _settings.randomAvatar = 0;
                        util.saveStorage("settings", "randomAvatar", _settings.randomAvatar);
                    });
                }
                const randomTypes = ["randomTrainer", "randomAnimatedTrainer"];
                for (const randomType of randomTypes) {
                    const button = document.createElement("button");
                    button.setAttribute("id", "randomAvatarButton");
                    button.setAttribute("style", "background-image: url(" + chrome.runtime.getURL("images/sprites/trainers/" + randomType + ".png") + ");")
                    button.classList.add("option", "pixelated", "custom");
                    const animated = randomType === "randomAnimatedTrainer" ? "animated" : "";
                    button.setAttribute("title", "Random " + animated + " per battle");
                    button.addEventListener("click", function () {
                        const sprites = animated.length === 0 ? consts.trainerSprites : consts.animatedTrainerSprites;
                        const randomSprite = sprites[Math.floor(Math.random() * sprites.length)];
                        playUtil.changeAvatar(randomSprite, _settings.animateTrainer);
                        _settings.randomAvatar = animated.length === 0 ? 2 : 1;
                        util.saveStorage("settings", "randomAvatar", _settings.randomAvatar);
                        this.parentElement.parentElement.querySelector("[name=close]").click();
                    });
                    avatarList.prepend(button);
                }
            }
            return;
        };
        if (element.querySelectorAll(".sprite-selector").length === 0) {
            const noPastGensCheckbox = document.querySelector("[name='nopastgens']");
            const className = noPastGensCheckbox.parentNode.className;
            const parent = noPastGensCheckbox.parentNode.parentNode;

            const randomFunction = function (e) {
                _settings.shinyPercentage = e.target.value;
                util.saveStorage("settings", "shinyPercentage", _settings.shinyPercentage);
                const imgs = Array.from(document.querySelectorAll(".innerbattle")).map(b => Array.from(b.querySelectorAll("img"))).flat();
                for (const img of imgs) {
                    updateSprite(img);
                }
            };
            const backdropFunction = function (e) {
                _settings.backdrop = e.target.value;
                util.saveStorage("settings", "backdrop", _settings.backdrop);
                const backdrops = document.querySelectorAll(".backdrop");
                for (const backdrop of backdrops) {
                    updateBackdrop(backdrop);
                }
            };
            const disableFunction = function (e) {
                const checkbox = e.target.childNodes[0];
                if (checkbox == void 0) return;
                _settings[checkbox.name] = checkbox.checked;
                util.saveStorage("settings", checkbox.name, _settings[checkbox.name]);
                if (checkbox.name === "trainerTooltip") {
                    const trainerElements = document.querySelectorAll(".trainer");
                    for (const trainerElement of trainerElements) {
                        addUserLink(trainerElement);
                    }
                }
                else if (checkbox.name === "animateTrainer") {
                    const trainerElements = document.querySelectorAll(".trainer");
                    for (const trainerElement of trainerElements) {
                        updateTrainerIcon(trainerElement);
                    }
                    const pmLogs = Array.from(document.querySelectorAll(".pm-log"));
                    for (const pmLog of pmLogs) {
                        const chats = pmLog.querySelectorAll(".chat");
                        for (const chat of chats) {
                            const img = chat.querySelector("img");
                            if (!img) continue;
                            playUtil.animateAvatar(img, "src", checkbox.checked);
                        }
                    }
                }
            };
            const spritesFunction = function (e) {
                changeSprites(e.target.value, e.target.getAttribute("name"));
                if (e.target.getAttribute("name") === "back") {
                    const backdrops = document.querySelectorAll(".backdrop");
                    for (const backdrop of backdrops) {
                        updateBackdrop(backdrop);
                    }
                }
            };

            const changeSprites = function (gen, type) {
                _settings.sprites[type] = gen;
                util.saveStorage("settings", "sprites", _settings.sprites);
                if (gen == 0) gen = "gen1";
                if (type === "shiny") {
                    _settings.sprites["shiny"] = gen;
                    _settings.sprites["back-shiny"] = gen;
                    if (gen.indexOf("-shiny") !== -1) _settings.sprites["back-shiny"] = gen.substring(0, gen.indexOf("-shiny")) + "-back-shiny";
                    if (gen.indexOf("-back") !== -1) _settings.sprites["back-shiny"] = (gen === "gen1rg" || gen === "gen1rb" ? "gen1rgb" : gen.substring(0, gen.indexOf("-back"))) + "-back";
                }
                const imgs = Array.from(document.querySelectorAll(".innerbattle")).map(b => Array.from(b.querySelectorAll("img"))).flat();
                for (const img of imgs) {
                    updateSprite(img);
                }
                const trainers = document.querySelectorAll(".trainer");
                for (const trainer of trainers) {
                    updateIcons(trainer);
                }
            }
            
            parent.after(playUtil.buildSettingsP("Backdrop", "backdrop", className, consts.backdrops, _settings.backdrop ?? consts.defaultSettings.backdrop, backdropFunction));
            parent.after(playUtil.buildSettingsP("Randoms shiny percentage", "shiny_percentage", className, null, _settings.shinyPercentage ?? consts.defaultSettings.shinyPercentage, randomFunction, 
                { type: "number", max: 100, min: 0, value: 0, id: "shinyPercentage" }));
            for (const key of ["shiny", "icons", "back", "front"]) {
                const noPastGensCheckbox = document.querySelector("[name='nopastgens']");
                const options = [];
                const spriteSets = util.filterObject(consts.spriteSets, ss => ss[key] === true);
                let title = key === "shiny" ? "Randoms shiny" : util.capitalizeFirstLetter(key);
                if (key === "icons") {
                    const icons = [...new Set(Object.keys(consts.spriteSets).map(ss => consts.spriteSets[ss].icons).flat())];
                    options.push({ text: "Match sprites", value: "3" })
                    for (const icon of icons) {
                        if (icon === "pokemon") continue;
                        options.push({ text: icon, value: icon });
                    }
                }
                else if (key === "shiny") {
                    options.push({ text: "Match sprites", value: "3" })
                    const backAndFrontSets = util.filterObject(consts.spriteSets, ss => ss["shiny"] == true);
                    for (const spriteSet in backAndFrontSets) {
                        options.push({ text: backAndFrontSets[spriteSet].text ?? spriteSet + "-shiny", value: spriteSet + "-shiny" });
                    }
                }
                else {
                    for (const spriteSet in spriteSets) {
                        options.push({ text: (spriteSets[spriteSet].text ?? spriteSet) + (key !== "front" ? "-" + key : ""), value: spriteSet + (key !== "front" ? "-" + key : "") });
                    }
                    title += " sprites";
                }
                options.sort((a, b) => isNaN(a.value) && isNaN(b.value) && a.text.localeCompare(b.text));
                const p = playUtil.buildSettingsP(title, key, className + " sprite-selector", options, _settings.sprites[key], spritesFunction);
                noPastGensCheckbox.parentNode.parentNode.after(p);
            }
            parent.after(playUtil.buildSettingsP("Disable avatar animations", "animateTrainer", className, null, null, disableFunction, { type: "checkbox", checked: _settings.animateTrainer === false }));
            parent.after(playUtil.buildSettingsP("Disable trainer tooltips", "trainerTooltip", className, null, null, disableFunction, { type: "checkbox", checked: _settings.trainerTooltip === false }));
            parent.after(playUtil.buildSettingsP("Disable miscellaneous calculators", "miscCalculator", className, null, null, disableFunction, { type: "checkbox", checked: _settings.miscCalculator === false }));
            parent.after(playUtil.buildSettingsP("Disable unrevealed calculator", "unrevealedCalculator", className, null, null, disableFunction, { type: "checkbox", checked: _settings.unrevealedCalculator === false }));
            parent.after(playUtil.buildSettingsP("Disable moveset calculator", "movesetCalculator", className, null, null, disableFunction, { type: "checkbox", checked: _settings.movesetCalculator === false }));
            parent.after(playUtil.buildSettingsP("Disable damage calculator", "damageCalculator", className, null, null, disableFunction, { type: "checkbox", checked: _settings.damageCalculator === false }));
            const strongP = document.createElement("p");
            const strong = document.createElement("strong");
            strong.innerHTML = "RooBY (Generation 1)";
            strongP.appendChild(strong);
            parent.after(strongP);
            parent.after(document.createElement("hr"));
        }

        document.querySelector("[name='nopastgens']").addEventListener("change", function (e) {
            _settings.useModernSprites = e.target.checked;
            if (e.target.checked === false) {
                changeSprites(_settings.sprites["front"], "front");
                changeSprites(_settings.sprites["back"], "back");
            }
        })
    }

    const updateBackdrop = function (element) {

        const buildBackdropBottom = function (roomElement, tab, backdrop) {
            let backdropBottom = roomElement.querySelector("#backdropBottom");
            if (backdropBottom == void 0) {
                backdropBottom = document.createElement("div");
                backdropBottom.id = "backdropBottom";
                roomElement.querySelector(".innerbattle").prepend(backdropBottom);
            }
            let backSprite = _settings.sprites["back"] == 1 ? _randomSprites[tab]["back"] : _settings.sprites["back"];
            if (backSprite == 0) backSprite = "gen1-back";
            backdropBottom.classList = [];
            const gens = ["other-gen", "mid-gen", "old-gen"];
            for (const gen of gens) {
                backdropBottom.classList.remove(gen);
                backdropBottom.classList.remove(gen + "-backdrop");
            }
            if (backSprite.startsWith("gen1") || backSprite.startsWith("gen2")) {
                backdropBottom.classList.add("old-gen");
            }
            else if (backSprite.startsWith("gen3") || backSprite.startsWith("gen4")) {
                backdropBottom.classList.add("mid-gen");
            }
            else if (backSprite.startsWith("digimon") || backSprite.includes("ani") || backSprite.includes("gen5") 
                || backSprite.includes("afd")) {
                    backdropBottom.classList.add("other-gen");
            }
            if (backdrop.includes("-gen")) {
                if (backdrop.includes("-gen3") || backdrop.includes("-gen4")) {
                    backdropBottom.classList.add("mid-gen-backdrop");
                }
                else {
                    backdropBottom.classList.add("old-gen-backdrop");
                }
            }
            else if (backdrop.includes("gen1jpn")) {
                backdropBottom.classList.add("other-gen-backdrop");
            }
            const trainers = roomElement.querySelectorAll(".trainer");
            for (const trainer of trainers) {
                updateIcons(trainer);
            }
        }
        if (element != null && element.style.backgroundImage != void 0) {
            let backdrop = _settings.backdrop;
            const roomElement = playUtil.getParentRoomElement(element, _page);
            if (roomElement == void 0 || roomElement.id.indexOf("-gen1") === -1) return;
            const tab = playUtil.getTabIdByRoomElement(roomElement);
            if (_randomSprites[tab] == void 0) initializeTab(tab);
            if (!_settings.backdrop || _settings.backdrop == 0) backdrop = "fx/bg-gen1.png";
            else if (_settings.backdrop == 1) backdrop = _randomBackdrop[tab];
            else if (_settings.backdrop == 2) backdrop = _randomDefaultBackdrop[tab];
            buildBackdropBottom(roomElement, tab, backdrop);
            let url = _playUrl + "/" + backdrop;
            const folders = [...new Set(consts.backdrops.map(b => b.split("/")[0]))];
            folders.splice(0, 2);
            for (const folder of folders) {
                element.classList.remove(folder);
            }
            if (!backdrop.startsWith("fx/") && !backdrop.startsWith("sprites/")) {
                const classes = backdrop.split("/");
                for (let i = 0; i < classes.length - 1; i++) {
                    element.classList.add(classes[i]);
                }
                url = chrome.runtime.getURL("images/backdrops/" + backdrop);
            }
            element.style = "background-image: url('" + url + "'); display: block; opacity: 0.8;";
        }
    }

    const updateIcons = function (trainer) {
        let iconsPrefix = _settings.sprites.icons || 0;
        if (trainer == void 0) return;
        const roomElement = playUtil.getParentRoomElement(trainer, _page);
        const tab = playUtil.getTabIdByRoomElement(roomElement);
        if (tab == void 0 || roomElement.id.indexOf("-gen1") === -1) return;
        if (_randomSprites[tab] == void 0) initializeTab(tab);
        else if (iconsPrefix == 1) iconsPrefix = _randomSprites[tab].icons;
        else if (iconsPrefix == 2) iconsPrefix = _randomDefaultSprites[tab].icons;
        else if (iconsPrefix == 3) {
            if (trainer.classList.contains("trainer-near")) {
                let backSetting = _settings.sprites.back;
                if (_settings.sprites.back == 1) backSetting = _randomSprites[tab].back;
                if (_settings.sprites.back == 2) backSetting = _randomDefaultSprites[tab].back;
                if (backSetting == void 0) return;
                if (backSetting == 0) backSetting = "gen1-back";
                iconsPrefix = consts.spriteSets[backSetting.substring(0, backSetting.length - 5)].icons;
            }
            else if (trainer.classList.contains("trainer-far")) {
                let frontSetting = _settings.sprites.front;
                if (_settings.sprites.front == 1) frontSetting = _randomSprites[tab].front;
                if (_settings.sprites.front == 2) frontSetting = _randomDefaultSprites[tab].front;
                if (frontSetting == void 0) return;
                if (frontSetting == 0) frontSetting = "gen1";
                iconsPrefix = consts.spriteSets[frontSetting].icons;
            }
        }
        const picons = trainer.querySelectorAll(".picon");
        for (const picon of picons) {
            const backgroundSrc = picon.style.background;
            const srcStart = backgroundSrc.substring(0, backgroundSrc.lastIndexOf("/") + 1);
            const srcEnd = backgroundSrc.substring(backgroundSrc.lastIndexOf("icons"), backgroundSrc.length);
            let src = srcStart.substring(0, srcStart.indexOf("\"") + 1);
            if (iconsPrefix.indexOf("digimon") !== -1) {
                if (backgroundSrc.indexOf("pokeball") !== -1) src += _playUrl + "/sprites/digimon/sprites/xy" + srcEnd;
                else src += chrome.runtime.getURL("images/digimon" + srcEnd);
            }
            else if (iconsPrefix === "art") src += chrome.runtime.getURL("images/" + iconsPrefix + srcEnd);
            else if (iconsPrefix === "gen5") src += chrome.runtime.getURL("images/" + iconsPrefix + srcEnd);
            else src += _playUrl + "/sprites/pokemon" + srcEnd;
            picon.style.background = src;
        }
    }

    const updateTrainerIcon = function (element) {
        if ((_page !== "play" && _page != "replay") || !element.classList.contains("trainer")) return;
        const trainer = element.querySelector(".trainersprite");
        playUtil.animateAvatar(trainer, "style", _settings.animateTrainer);
    }

    const updateSprite = function (element) {
        const src = element.getAttribute("src");
        if (_settings.useModernSprites === true || (_page !== "play" && _page != "replay") || src.indexOf("/types/") !== -1) return;
        let urlStart = _playUrl + "/sprites/";
        if (src.indexOf("/sprites/") !== -1 && _settings.sprites["front"] != void 0) {
            let key = "front";
            if (src.indexOf("back") !== -1) {
                key = "back";
            }
            const roomElement = playUtil.getParentRoomElement(element, _page);
            const tab = playUtil.getTabIdByRoomElement(roomElement);
            if (tab == void 0 || roomElement.id.indexOf("-gen1") === -1) return;
            if (_randomSprites[tab] == void 0) initializeTab(tab);
            const isRight = key !== "back";
            const trainerElement = playUtil.getTrainerElementBySide(roomElement, isRight);
            const trainerName = playUtil.getTrainerNameByElement(trainerElement);

            let urlEnd = src.substring(src.lastIndexOf("/"));
            let spriteSrc;
            if (_settings.sprites[key] == 0) spriteSrc = "gen1" + (key === "back" ? "-back" : "");
            else if (_settings.sprites[key] == 1) spriteSrc = _randomSprites[tab][key];
            else if (_settings.sprites[key] == 2) spriteSrc = _randomDefaultSprites[tab][key];
            else spriteSrc = _settings.sprites[key];
            if (spriteSrc == void 0) return;
            const spriteSetName = spriteSrc.indexOf("-") === -1 ? spriteSrc : spriteSrc.substring(0, spriteSrc.indexOf("-"));
            const substitute = consts.spriteSets[spriteSetName].substitute;

            const isSubstitute = src.endsWith("substitute.png");
            if (isSubstitute && !!substitute) {
                spriteSrc = substitute + (key === "back" ? "-back" : "");
            }
            else if (!isSubstitute) {
                const unsafedPokemonId = urlEnd.substring(1, urlEnd.lastIndexOf("."));
                const pokemonId = util.getMostSimilarString(unsafedPokemonId, Object.keys(consts.pokedex));

                let shinyPrngName = tab + trainerName + pokemonId;
                if (playUtil.getActivePokemonId(trainerElement) == "ditto") {
                    const statElement = playUtil.getStatElementBySide(roomElement, isRight);
                    const isTransformed = playUtil.getIsTransformedByStatElement(statElement);
                    if (isTransformed) {
                        const transformedIntoId = playUtil.getTransformedId(trainerElement, statElement);
                        const opponentTrainerElement = playUtil.getTrainerElementBySide(roomElement, !isRight);
                        const opponentTrainerName = playUtil.getTrainerNameByElement(opponentTrainerElement);
                        shinyPrngName = tab + opponentTrainerName + transformedIntoId;
                    }
                }
                const pokemonShinyPrng = util.randomNumbersGenerator(shinyPrngName, [100])[0];
                const shinyPercentage = Number.parseInt(_settings.shinyPercentage) || 0;
                const spritesObj = _settings.sprites[key] == 1 ? _randomSprites[tab] : _randomDefaultSprites[tab];
                if (pokemonShinyPrng < shinyPercentage && shinyPercentage !== 0) {
                    // if (_settings.sprites["shiny"] == 0) {
                    //     spriteSrc = key === "back" ? spritesObj["back-shiny"] : spritesObj["shiny"];
                    // }
                    if (_settings.sprites["shiny"] == 1 || _settings.sprites["shiny"] == 2) {
                        spriteSrc = spritesObj[key === "back" ? "back-shiny" : "shiny"];
                    }
                    else if (_settings.sprites["shiny"] == 3) {
                        let matchingSpriteSetKey = _settings.sprites[key];
                        if (matchingSpriteSetKey == 0) matchingSpriteSetKey = "gen1";
                        else if (matchingSpriteSetKey == 1 || matchingSpriteSetKey == 2) {
                            const matchingSpriteSet = matchingSpriteSetKey == 1 ? _randomSprites[tab] : _randomDefaultSprites[tab];
                            const randomKey = matchingSpriteSet[key].replace("-back", "");
                            const randomSet = consts.spriteSets[randomKey];
                            matchingSpriteSetKey = randomSet.shiny === true ? randomKey : randomSet.shiny.replace("-shiny", "");
                        }
                        const gen = matchingSpriteSetKey.replace("-back", "").replace("-shiny", "");
                        const matchingSpriteSet = consts.spriteSets[gen];
                        if (matchingSpriteSet.shiny === true) {
                            spriteSrc = gen + (key === "back" ? "-back" : "") + "-shiny";
                        }
                        else {
                            spriteSrc = key === "back"
                                ? matchingSpriteSet.shiny.replace("-shiny", "") + "-back-shiny"
                                : matchingSpriteSet.shiny;
                        }
                    }
                    else {
                        spriteSrc = _settings.sprites[key === "back" ? "back-shiny" : "shiny"];
                    }
                }

                const spriteSetName = spriteSrc.indexOf("-") === -1 ? spriteSrc : spriteSrc.substring(0, spriteSrc.indexOf("-"));
                const extension = consts.spriteSets[spriteSetName].extension;
                let typoedPokemonId = pokemonId;
                if (spriteSrc.indexOf("digimon") !== -1) {
                    const typos = consts.spriteSets[spriteSetName].typos;
                    const replaceSpace = key === "back" && pokemonId.indexOf("nidoran") !== -1;
                    typoedPokemonId = util.replaceIdWithSafeId(pokemonId, consts.pokedex, replaceSpace, typos)
                }
                else if (spriteSrc.indexOf("afd-shiny") !== -1 || spriteSrc.indexOf("afd-back-shiny") !== -1) {
                    const typos = consts.spriteSets[spriteSetName].shinyTypos;
                    typoedPokemonId = util.replaceIdWithSafeId(pokemonId, consts.pokedex, false, typos)
                    urlEnd = "/" + typoedPokemonId + "." + (extension ? extension : "png");
                }
                else if (consts.spriteSets[spriteSetName].custom === true) {
                    urlEnd = chrome.runtime.getURL("images/sprites/" + spriteSrc + "/" + pokemonId + ".png");
                    urlStart = "";
                    spriteSrc = "";
                }
                else urlEnd = "/" + typoedPokemonId + "." + (extension ? extension : "png");
            }

            if (spriteSrc.indexOf("digimon/sprites/pokemon-back-shiny") !== -1) {
                spriteSrc = spriteSrc.replace("pokemon-back-shiny", "pokemon-shiny-back");
            }
            element.style.visibility = "hidden";
            const scaleFunc = function (element) {
                element.style.visibility = "visible";
                element.style.transform = "scaleY(" + Math.min(element.naturalHeight * 2 / 192, 1) + ") scaleX(" + Math.min(element.naturalWidth * 2 / 192, 1) + ")";
            }
            setTimeout(function () {  scaleFunc(element); }, 0);
            element.onload = function () { scaleFunc(element); }
            if (urlEnd.indexOf("gen1art") !== -1) {
                element.classList.add("hd");
                element.classList.remove("pixelated");
            }
            else {
                element.classList.remove("hd");
                element.classList.add("pixelated");
            }
            element.setAttribute("src", urlStart + spriteSrc + urlEnd);
        }
    }

    const setLevels = function (levels, tab, trainerName, pokemonId) {
        if (tab != void 0 && trainerName != void 0 && pokemonId != void 0) {
            _levels[tab] = _levels[tab] || {};
            _levels[tab][trainerName] = _levels[tab][trainerName] || {};
            _levels[tab][trainerName][pokemonId] = levels;
        }
        else if (tab != void 0 && trainerName != void 0 && pokemonId == void 0) {
            _levels[tab] = _levels[tab] || {};
            _levels[tab][trainerName] = levels;
        }
        else if (tab != void 0 && trainerName == void 0 && pokemonId == void 0) {
            _levels[tab] = levels;
        }
        else if (tab == void 0 && trainerName == void 0 && pokemonId == void 0) {
            _levels = levels;
        }
    }
})();