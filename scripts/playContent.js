(function() {
    "use strict";
    let _pokemons = [];
    let _initialTypeOdds = {};
    let _unrevealedPokemonOdds = {};
    let _timeoutIds = {};
    let _hiddenDitto = {};
    let _levels = {};
    let _randomSprites = {};
    let _randomBackdrop = {};
    let _settings = JSON.parse(JSON.stringify(consts.defaultSettings));
    const _playUrl = consts.urls.gameUrls[0];
    const _playRoomSelector = "div[id^=room-battle-gen1]:not([style*=\"display: none\"]:not([style*=\"display:none\"]";
    const _page = window.location.hostname.split(".")[0];
    const _doc = document;

    (function() {
        _doc.addEventListener("mouseover", (event) => {
            const element = event.target;
            const roomElement = _page === "play" ? event.target.closest(_playRoomSelector) : document.querySelector(".battle");
            if (roomElement == void 0) return;
            const isRandomBattle = roomElement.id.indexOf("randombattle") !== -1;
            const pokemons = [..._pokemons];
            if (element.getAttribute("title") === "Not revealed" && !! pokemons && _settings.unrevealedCalculator !== false){
                
                let isRandomBattle = roomElement.id.indexOf("randombattle") !== -1;
                if (isRandomBattle || (_page === "replay" && window.location.pathname.indexOf("gen1randombattle") !== -1)) {
                    showUnrevealedPokemon(element);
                }
            }
            const tooltipWrapper = document.querySelector("#tooltipwrapper");
            if (!!tooltipWrapper) {
                if (event.target.closest(".rightbar") != void 0 || event.target.getAttribute("data-id") === "p2a") {
                    showTooltip(tooltipWrapper.querySelector(".tooltipinner"), true,);
                }
                else if (event.target.closest(".leftbar") != void 0 || event.target.getAttribute("data-id") === "p1a" || event.target.closest(".controls") != void 0) {
                    showTooltip(tooltipWrapper.querySelector(".tooltipinner"), false);
                }
            }
        });
  
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                const nodes = Array.prototype.slice.call(mutation.addedNodes);
                nodes.forEach(function(node) {
                    elementInserted(node);
                });
            });
        });
        observer.observe(_doc, {
            childList: true,
            subtree: true
        });
    })();
    
    window.onload = async function() {
        _settings = await util.getSettings() || _settings;
        updateBackdrop(document.querySelector(".backdrop"));
        for (const img of Array.from(document.querySelectorAll("img"))) {
            updateSprite(img);
        }
        const trainers =  document.querySelectorAll(".trainer");
        for (const trainer of trainers) {
            updateIcons(trainer);
        }
        util.loadRandomsData("gen1", consts.urls).then(async data => {
            const pokemons = roobyCalc.buildSettingsPokemons(data);
            _pokemons = pokemons;
            const dualTypes = pokemons
                .map(p => p.types.sort((a,b) => a - b).join(",") + (p.level === 100 ? "-100" : ""))
                .filter((value, index, array) => array.indexOf(value) === index);
            consts.dualTypesNamesDictionary = {};
            for (const dualTypeKey of dualTypes) {
                consts.dualTypesNamesDictionary[dualTypeKey] = dualTypes.indexOf(dualTypeKey);
            };
            if (_page === "play" || _page === "replay") {
                chrome.runtime.sendMessage({function: "init", args: {pokemons}}, function(odds) {
                    _initialTypeOdds = odds;
                    void chrome.runtime.lastError;
                });
            }
        });
        setInterval(function() {
            const allRooms = Array.from(document.querySelectorAll(".ps-room")).filter(e => e.id.indexOf("gen1randombattle") !== -1);
            const isRoomWithThreeToFiveRevealed = allRooms
                .map(r => Array.from(r.querySelectorAll(".trainer")))
                .flat(Infinity)
                .map(t => { const rp = playUtil.getRevealedPokemonIds(t); return !!rp ? rp.length : 0 })
                .some(l => l >= 3 && l <= 5);
            if (isRoomWithThreeToFiveRevealed) {
                chrome.runtime.sendMessage({function: "keepAlive", args: {pokemons: _pokemons}}, function() {
                    void chrome.runtime.lastError;
                });
            }
        }, 10000);
        setInterval(function() {
            util.pruneCalculations([..._pokemons]);
        }, 300000);
        setTimeout(function() {
            util.pruneCalculations([..._pokemons]);
        }, 5000);
        _doc.addEventListener("keyup", function(event) {
            if (event.key !== "Enter") {
                event.target.setAttribute("data-value", event.target.value);
            }
            else if (event.target.parentElement.classList.contains("chatbox") && event.target.tagName === "TEXTAREA") {
                const value = event.target.getAttribute("data-value");
                if (value.startsWith("/odds ")) {
                    simulateOdds(event.target, value);
                }
                else if (value.startsWith("/export")) {
                    const tabElement = playUtil.getParentRoomElement(event.target);
                    const tab = playUtil.getTabIdByRoomElement(tabElement);
                    const randomNumber = util.randomNumbersGenerator(Date.now());
                    const uid = (randomNumber + "").replace("0.", "");
                    event.target.setAttribute("data-uid", uid);
                    window.postMessage({
                        function:"exportTeams",
                        args: {tab: tab, targetUid: uid}
                    });
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
                    }
                    moveButton.setAttribute("data-failure-rate", damageCalc.failureRate);
                }
            }
            else if (event.data.function === "exportTeamsReturn") {
                exportTeams(args.targetUid, args.teams);
            }
        }, false);
    }

    const initializeTab = function(tab, trainerName) {
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
        if (_randomSprites[tab] == void 0) {
            const randomNumbers = util.randomNumbersGenerator(tab, [frontSprites.length, backSprites.length, iconSprites.length, shinySprites.length, consts.backdrops.length]);
            _randomSprites[tab] = {};
            _randomSprites[tab].front = frontSprites[randomNumbers[0]];
            _randomSprites[tab].back = backSprites[randomNumbers[1]] + "-back";
            _randomSprites[tab].icons = iconSprites[randomNumbers[2]];
            _randomSprites[tab]["back-shiny"] = shinySprites[randomNumbers[3]] + "-back-shiny";
            _randomSprites[tab].shiny = shinySprites[randomNumbers[3]] + "-shiny";
            _randomBackdrop[tab] = consts.backdrops[randomNumbers[4]];
        }
    }

    const elementInserted = function(element) {
        if (element.closest == void 0 || element.classList == void 0) return;
        if (element.classList.contains("ps-popup")) {
            settingsPopup(element);
        }
        else {
            const currentTab = document.querySelector(".roomtab.cur");
            if (currentTab == void 0) return;
            const tabElement = currentTab.querySelector(".text");
            if (tabElement == void 0) return;
            const gametype = tabElement.innerText;
            const roomElement = playUtil.getParentRoomElement(element);
            if (roomElement == void 0) return;
            if (consts.gameTypes.some(gt => gametype.localeCompare("gen1" + gt.replace(/\s/g, ""))) && roomElement != void 0) {
                if (element.classList.contains("trainer")) {
                    updateIcons(element);
                    if (gametype.replace(/\s/g, "").toLowerCase().indexOf("randombattle") !== -1 && (_page === "play" || _page === "replay")) {
                        calculateUnrevealedPokemon(element, roomElement);
                    }
                }
                else if (element.tagName === "IMG" && element.hasAttribute("src")) {
                    updateSprite(element);
                }
                else if (element.classList.contains("backdrop")) {
                    updateBackdrop(element);
                    setTimeout(function(elem) {updateBackdrop(elem);}, 0, element);
                }
                else if (element.classList.contains("message-error")) {
                    if (element.innerText.startsWith("The command \"/odds") || element.innerText.startsWith("The command \"/export")) {
                        const isOdds = element.innerText.startsWith("The command \"/odds");
                        playUtil.removeChatError(element, isOdds ? "odds" : "export");
                    }
                }
                else {
                    const tab = playUtil.getTabIdByRoomElement(roomElement);
                    const isRight = element.classList.contains("lstatbar");
                    const trainerElement = playUtil.getTrainerElementBySide(roomElement, isRight);
                    if (trainerElement == void 0) return;
                    const trainerName = playUtil.getTrainerNameByElement(trainerElement);
                    if (element.classList.contains("statbar")) {
                        const pokemonId = playUtil.getActivePokemonId(trainerElement);
                        if (pokemonId == void 0) return;
                        const statElement = playUtil.getStatElementBySide(roomElement, isRight);
                        const pokemonLevel = playUtil.getLevelFromStatElement(statElement);
                        setLevels(pokemonLevel, tab, trainerName, pokemonId);
                    }
                    else if (element.classList.contains("controls") && element.querySelector(".switchmenu") != void 0) {
                        if (gametype.replace(/\s/g, "").toLowerCase().indexOf("randombattle") === -1 || (_page !== "play" && _page !== "replay")) {
                            return;
                        }
                        if (Array.from(element.querySelectorAll("button[name=chooseSwitch]")).map(n => n.innerText).some(t => t === "Ditto")) {
                            _hiddenDitto[tab] = trainerName;
                        }
                        const pokemonId = playUtil.getActivePokemonId(trainerElement);
                        playUtil.recoveryFailureCheck(tab, trainerName, pokemonId);
                    }
                }
            }
        }
    }

    const calculateUnrevealedPokemon = function(trainer, roomElement) {
    
        const typeCheckReturnFunction = function(tab, trainerName, result) {
            if (result != void 0 && result.odds != void 0) {
                const monNumbers = result.currentTeamNumbers;
                _unrevealedPokemonOdds[tab] = _unrevealedPokemonOdds[tab] ?? {};
                _unrevealedPokemonOdds[tab][trainerName] = _unrevealedPokemonOdds[tab][trainerName] ?? {};
                _unrevealedPokemonOdds[tab][trainerName][monNumbers] = result.odds;
                const roomElements = document.querySelectorAll(_page === "play" ? _playRoomSelector : ".battle");
                for (const roomElement of roomElements) {
                    if (tab === playUtil.getTabIdByRoomElement(roomElement)) {
                        const checkingElement = document.querySelector("#unrevealedPokemonChecking");
                        if (!!checkingElement) {
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
        
        const revealedPokemon = Array.from(trainer.querySelectorAll(".teamicons")).map(node => Array.from(node.querySelectorAll(".has-tooltip"))).flat().map(node => node.getAttribute("aria-label").split("(")[0].trim());
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
        _timeoutIds[tab][trainerName] = util.debounce(roobyCalc.buildTeamTree, 100, _timeoutIds[tab][trainerName], tab, trainerName, revealedPokemon, opponentRevealedPokemon, opponentHasDitto, pokemons, typeCheckReturnFunction);
    }

    const showUnrevealedPokemon = function(element) {
        const roomElement = playUtil.getParentRoomElement(element);
        const isRight = playUtil.getIsRightByChildElement(element);
        const trainerElement = playUtil.getTrainerElementBySide(roomElement, isRight);
        const trainerName = playUtil.getTrainerNameByElement(trainerElement);
        const revealedPokemonIds = playUtil.getRevealedPokemonIds(trainerElement) || [];
        const revealedPokemonNumbers = revealedPokemonIds.map(p => consts.pokedex[p].num).slice(0,5).sort((a, b) => a - b);
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
            if (Number.parseFloat((unrevealedPokemonOdds[typeKey]*100).toFixed(1)) == 0) html += "<span class=\"zero\">";
            else html += "<span>";
            const approximate = (unrevealedPokemonOdds[typeKey] > 0 && revealedPokemonIds.length < 5) ? "~" : "";
            html += "&nbsp;• " + util.capitalizeFirstLetter(typeKey) + ": " + approximate + (unrevealedPokemonOdds[typeKey]*100).toFixed(1) + "%</br></span>";
            if (typeKey === "Paralysis") html += "<br><b class=\"title\">Types:</b></br>";
        }
        html += "</p>";

        const tooltip = util.battleTooltips;
        tooltip.showTooltip(html, element, "unrevealedPokemon", { trainer: trainerName, pokemon: dittoMonNumbers});
        element.removeAttribute("title");
        element.addEventListener("mouseout", function(event) {
            tooltip.hideTooltip(event.target);
            element.setAttribute("title", "Not revealed");
        });
    }

    const showTooltip = function(element, isRight) {

        const buildTooltipPokemon = function(tooltip, roomElement, isRight, pokemonId) {
            const pokemons = [..._pokemons];
            if (tooltip != void 0 && !!pokemons) {
                const statElement = playUtil.getStatElementBySide(roomElement, isRight);
                const opponentStatElement = playUtil.getStatElementBySide(roomElement, !isRight);
                const opponentTrainerElement = playUtil.getTrainerElementBySide(roomElement, !isRight);
                    
                let exactHealth = null, healthRemainingPercent = null;
                const healthElement = tooltip.querySelectorAll("p")[0].childNodes[1];
                if (!healthElement) {
                    healthRemainingPercent = Number.parseInt(statElement.querySelector(".hptext").childNodes[0].nodeValue.trim().replace("%", ""));
                }
                else {
                    const healthText = healthElement.nodeValue;
                    const paranthesisIndex = healthText.indexOf("(");
                    if (paranthesisIndex !== -1) {
                        const fullStats = healthText.substring(paranthesisIndex + 1, healthText.lastIndexOf(")"));
                        const healthNumber = Number.parseInt(fullStats.substring(0, fullStats.indexOf("/")));
                        const totalNumber = Number.parseInt(fullStats.substring(fullStats.indexOf("/") + 1));
                        healthRemainingPercent = healthNumber/totalNumber*100;
                        exactHealth = healthNumber;
                    }
                    else {
                        healthRemainingPercent = Number.parseInt(tooltip.querySelectorAll("p")[0].childNodes[1].nodeValue.trim().replace("%", ""));
                    }
                }
                const tab = playUtil.getTabIdByRoomElement(roomElement);
                const trainerElement = playUtil.getTrainerElementBySide(roomElement, isRight);
                const trainerName = playUtil.getTrainerNameByElement(trainerElement);
                const isActive = playUtil.getActivePokemonId(trainerElement) === pokemonId;
                const pokemonLevel = playUtil.getLevelFromStatElement(!isActive ? tooltip.querySelector("h2") : statElement);
                const pokemon = {
                    exactHealth: exactHealth,
                    healthRemainingPercent: healthRemainingPercent,
                    id: pokemonId,
                    level: pokemonLevel,
                }
                if (pokemon.level == void 0) return;
                const transformedId = playUtil.getTransformedId(trainerElement, statElement);
                const opponentTrainerName = playUtil.getTrainerNameByElement(opponentTrainerElement);
                if (isActive && transformedId !== pokemon.id) {
                    pokemon.transformedId = transformedId,
                    pokemon.transformedLevel = playUtil.getPokemonLevelById(tab, opponentTrainerName, transformedId, !isRight)
                    if (pokemon.transformedLevel == void 0) return;
                }
                const opponentPokemonId = playUtil.getActivePokemonId(opponentTrainerElement);
                if (opponentPokemonId != void 0) {
                    const opponent = {
                        healthRemainingPercent: Number.parseInt(opponentStatElement.querySelector(".hptext").childNodes[0].nodeValue.trim().replace("%", "")),
                        id: opponentPokemonId,
                        level: playUtil.getLevelFromStatElement(opponentStatElement),
                    }
                    if (opponent.level == void 0) return;
                    const opponentTransformedId = playUtil.getTransformedId(opponentTrainerElement, opponentStatElement)
                    if (opponentTransformedId !== opponent.id) {
                        opponent.transformedId = opponentTransformedId;
                        opponent.transformedLevel = playUtil.getPokemonLevelById(tab, trainerName, opponentTransformedId, !isRight);
                        if (opponent.transformedLevel == void 0) return;
                    }
                    pokemon.opponent = opponent;
                }
                return pokemon;
            }
        }

        const tooltip = element.querySelector(".tooltip-pokemon, .tooltip-switchpokemon, .tooltip-move, .tooltip-activepokemon");
        const roomElement = Array.from(document.querySelectorAll(".ps-room-opaque, div:not([class]) > .battle")).find(e => e.style.display !== "none");
        if (tooltip != void 0) {
            let section = element.querySelector(".section");
            if (tooltip.querySelector(".calculator") != void 0) return;
            if (tooltip.classList.contains("tooltip-move") && _settings.damageCalculator !== false) {
                const trainerElement = playUtil.getTrainerElementBySide(roomElement, isRight);
                const activePokemonId = playUtil.getActivePokemonId(trainerElement);
                const tooltipPokemon = buildTooltipPokemon(tooltip, roomElement, isRight, activePokemonId);
                showMoveTooltip(section, tooltip, roomElement, false, tooltipPokemon);
            }
            else {
                const h2 = tooltip.querySelector("h2");
                const possibleNickedNameElementHtmls = Array.from(h2.querySelectorAll("small"))
                    .filter(s => s.innerHTML.startsWith("(") && s.innerHTML.endsWith(")"))
                    .map(e => e.innerHTML.substring(1, e.innerHTML.length - 1));
                const nickedPokemon = possibleNickedNameElementHtmls.map(h => _pokemons.find(p => p.name === h)).find(p => p != void 0);
                const tooltipPokemonName = nickedPokemon != void 0
                    ? nickedPokemon.name
                    : h2.childNodes[0].nodeValue.trim();
                const pokemonId = playUtil.getPokemonIdByName(tooltipPokemonName);
                const tooltipPokemon = buildTooltipPokemon(tooltip, roomElement, isRight, pokemonId);
                if (!!tooltipPokemon) showPokemonTooltip(section, tooltip, roomElement, isRight, tooltipPokemon);
            }
            let parentElement;
            if (tooltip.classList.contains("tooltip-pokemon")) {
                const picons = Array.from(roomElement.querySelector(!isRight ? ".leftbar" : ".rightbar").querySelectorAll(".picon.has-tooltip"));
                const tooltipPokemonName = tooltip.querySelector("h2").childNodes[0].nodeValue.trim();
                parentElement = picons.filter(p => p.getAttribute("aria-label").startsWith(tooltipPokemonName))[0];
            }
            else if (tooltip.classList.contains("tooltip-activepokemon")) {
                if (isRight) parentElement = roomElement.querySelector("[data-id=p2a]");
                else parentElement = roomElement.querySelector("[data-id=p1a]");
            }
            util.battleTooltips.placeTooltip(null, parentElement);
        }
    }

    const showMoveTooltip = function(section, tooltip, roomElement, isRight, pokemon) {
        if (pokemon.id == void 0) return;
        if (tooltip.querySelector(".tooltip-section").querySelector(".calculator") != void 0) return;
        section = document.createElement("p");
        section.className = "section";
        const moveName = tooltip.querySelector("h2").childNodes[0].nodeValue;
        const moveButton = Array.from(roomElement.querySelectorAll("button[name=chooseMove]")).find(b => b.childNodes[0].nodeValue === moveName);
        let failureRate = Number.parseFloat(moveButton.getAttribute("data-failure-rate"));
        failureRate = isNaN(failureRate) ? null: failureRate;

        const damageCalc = roobyCalc.damage(pokemon, pokemon.opponent, moveName);
        const critDamageCalc = roobyCalc.damage(pokemon, pokemon.opponent, moveName, null, true);

        if (!isNaN(damageCalc.maxDamage) || (damageCalc.minDamage === "?" && damageCalc.maxDamage === "?")) {
            const minDamage = damageCalc.minDamage === "?" ? "?" : ((damageCalc.minDamage*100).toFixed(1) + "%");
            const maxDamage = damageCalc.maxDamage === "?" ? "?" : ((damageCalc.maxDamage*100).toFixed(1) + "%");
            let html = "<div class=\"calculator\"><div class=\"damage-container\"><span>Damage: " + minDamage + " - " + maxDamage + "</span>";
            if (damageCalc.minRecoil != void 0) {
                html += "<small class=\"recoil\">(" + (damageCalc.minRecoil*100).toFixed(1) + "% - " + (damageCalc.maxRecoil*100).toFixed(1) + "% recoil)</small>";
            }
            if (!isNaN(critDamageCalc.minDamage) && damageCalc.critRate < 1 && damageCalc.critRate > 0) {
                html += "</div><div>Crit (" + (damageCalc.critRate*100).toFixed(1) + "%): " + (critDamageCalc.minDamage*100).toFixed(1) + "% - " + (critDamageCalc.maxDamage*100).toFixed(1) + "%</div>" 
            }
            if (damageCalc.hkoPercentage != void 0) {
                html += "<div class=\"hko\">" + (damageCalc.hkoPercentage*100).toFixed(1) + "% chance to " + damageCalc.hkoMultiple + "HKO</div>";
                if (damageCalc.hkoMultiple > 1 && damageCalc.critRate < 1 && damageCalc.critRate > 0) {
                    html += "<div>" + (critDamageCalc.hkoPercentage*100).toFixed(1) + "% chance to " + critDamageCalc.hkoMultiple + "HKO with crit</span></div>";
                }
                else html += "</div>";
            }
            section.innerHTML += html;
            tooltip.querySelector(".tooltip-section").before(section);
        }
        else if (failureRate != void 0 && _settings.miscCalculator !== false) {
            section.innerHTML += "<div class=\"calculator\"><div class=\"damage-container\"><small class=\"failure p" 
                + (failureRate*100).toFixed(0) +"\">(" 
                + (failureRate != 0 && failureRate != 1 ? "~" : "") 
                + (failureRate*100).toFixed(0) 
                + "% chance of failure)</small></div>";
            tooltip.querySelector(".tooltip-section").before(section);
        }
    }

    const showPokemonTooltip = function(section, tooltip, roomElement, isRight, tooltipPokemon) {
        
        const showRecoverFailureRate = function(revealedMoveElement, failureRate) {
            if (failureRate != void 0 && _settings.miscCalculator !== false) {
                const recoverSpan = document.createElement("span");
                recoverSpan.innerHTML = "<small class=\"failure p" + (failureRate*100).toFixed(0) +"\">(" + (failureRate != 0 && failureRate != 1 ? "~" : "") + (failureRate*100).toFixed(0) + "% fail)</small>";
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
            confusionDamageSpan.innerHTML = "(" + (pokemon.confusionDamage[0]*100).toFixed(1) + "% or " + (pokemon.confusionDamage[1]*100).toFixed(1) + "% self-hit)";
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
                let failureRate = moveButton == void 0 ?  damageCalc.failureRate : Number.parseFloat(moveButton.getAttribute("data-failure-rate"));
                failureRate = isNaN(failureRate) ? damageCalc.failureRate : failureRate;
                if (!isNaN(damageCalc.maxDamage) && _settings.damageCalculator !== false) {
                    const damageSpan = document.createElement("span");
                    damageSpan.className = "damage";
                    damageSpan.innerHTML = (damageCalc.minDamage*100).toFixed(1) + "%-" + (damageCalc.maxDamage*100).toFixed(1) + "%";
                    const isSwitchPokemon = tooltip.classList.contains("tooltip-switchpokemon");
                    revealedMoveElement.parentElement.insertBefore(damageSpan, isSwitchPokemon ? revealedMoveElement.nextSibling : revealedMoveElement);
                }
                else showRecoverFailureRate(revealedMoveElement, failureRate);
            }
            else {
                const damageCalc = roobyCalc.damage(tooltipPokemon, tooltipPokemon.opponent, revealedMoveName);
                let failureRate = moveButton == void 0 ?  damageCalc.failureRate : Number.parseFloat(moveButton.getAttribute("data-failure-rate"));
                failureRate = isNaN(failureRate) ? damageCalc.failureRate : failureRate;
                showRecoverFailureRate(revealedMoveElement, failureRate);        
            }
        }
        if (!tooltip.classList.contains("tooltip-switchpokemon")) {
            for (const move of unrevealedMoves) {
                const probability = Math.round(move.probability * 100)/100;
                let className = "calculator";
                if (probability == 0) className += " zero";
                let moveString = "<div class='" + className + "'>• " + move.name + " <small>" + probability + "%";
                if (tooltipPokemon.opponent != void 0) {
                    const damageCalc = roobyCalc.damage(tooltipPokemon, tooltipPokemon.opponent, move.name);
                    const moveButton = Array.from(roomElement.querySelectorAll("button[name=chooseMove]")).find(b => b.childNodes[0].nodeValue === move.name);
                    let failureRate = moveButton == void 0 ?  damageCalc.failureRate : Number.parseFloat(moveButton.getAttribute("data-failure-rate"));
                    failureRate = isNaN(failureRate) ? damageCalc.failureRate : failureRate;
                    if (((!isNaN(damageCalc.minDamage) && !isNaN(damageCalc.maxDamage)) || (damageCalc.minDamage === "?" && damageCalc.maxDamage === "?")) && _settings.damageCalculator !== false) {
                        const minDamage = damageCalc.minDamage === "?" ? "?" : ((damageCalc.minDamage*100).toFixed(1) + "%");
                        const maxDamage = damageCalc.maxDamage === "?" ? "?" : ((damageCalc.maxDamage*100).toFixed(1) + "%");
                        moveString += " <span class='damage'>" + minDamage + "-" + maxDamage + "</span>";
                    }
                    else if (failureRate != void 0 && _settings.miscCalculator !== false) {
                        moveString += "<span class=\"failure p" + (failureRate*100).toFixed(0) +"\">(" + (failureRate*100).toFixed(0) + "% fail)</span>";
                    }
                }
                moveString += "</small></div>";
                section.innerHTML += moveString;
            }
        }
    }

    const simulateOdds = function(target, value) {
        const args = value.split(" ");
        const simulationTypes = ["pokemon", "types", "dual types"];
        if (args[1] === "dual" && args[2] === "types") args[1] = "dual types";
        const example = "<b>Example:</b> /odds dual types [butterfree, golduck, vulpix] ditto:true";
        if (args[1] === "help") {
            playUtil.chatOutput(target, "Use the command /odds followed by the simulation type, the team between brackets and optionally <i>\"ditto:true.\"</i> and <i>\"simulations:200000.\"</i><br>" + example);
        }
        else if (!simulationTypes.includes(args[1])) {
            playUtil.chatOutput(target, "<span class=\"failure\">Invalid simulation type.</span> Valid types are: <i>\"" + simulationTypes.join("\"</i>, <i>\"") + "\"</i>.<br>" + example);
        }
        else if (value.indexOf("[") === -1 || value.indexOf("]") === -1) {
            playUtil.chatOutput(target, "<span class=\"failure\">Invalid team format.</span> Please use brackets to enclose the team. If team is empty, use an empty bracket \"<i>[]</i>\".<br>" + example);
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
            const oddsDisplay = function(key, odds, isApproximate) {
                const isTotal = key === "Total";
                isApproximate = isApproximate && odds > 0;
                if (isTotal) key = "Total Pokémon";
                else odds = (odds*100).toFixed(1).replace(".0", "");
                let output = "<b>" + key + ":</b> " + (isApproximate && !isTotal ? "~" : "") + odds + (isTotal ? "" : "%");
                if (key === "Paralysis") output += "<br>";
                return output;
            }
            chrome.runtime.sendMessage({function:"simulate", args: {type, currentTeamNumbers, isDitto, pokemons, simulations}}, function(result) {
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
                if (safePokemonIds.length < 3) result.simulations = result.simulations || consts.defaultSimulations*4;
                output = "<b>Remaining " + (type === "pokemon" ? "Pokémon" : type) + " for a" 
                    + (pokemonNames.length > 0 ? " "  + pokemonNames : "n empty") + " team" 
                    + (result.simulations != void 0 ? " (" + result.simulations + " simulations)" : "") 
                    + ":</b><hr>" + output;
                playUtil.chatOutput(target, output, "rooby-chat-info");
                void chrome.runtime.lastError;
            });
        }
    }

    const exportTeams = function(uid, teamInfos) {

        const exportTeam = function(team, trainerName) {
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

    const settingsPopup = function(element) {
        const avatarButton = element.querySelector("[name='avatars']");
        if (avatarButton == void 0) return;
        if (element.querySelectorAll(".sprite-selector").length === 0) {
            const noPastGensCheckbox = document.querySelector("[name='nopastgens']");
            const className = noPastGensCheckbox.parentNode.className;
            const parent = noPastGensCheckbox.parentNode.parentNode;

            const randomFunction = function(e) {
                _settings.shinyPercentage = e.target.value;
                util.saveSetting("shinyPercentage", _settings.shinyPercentage);
                const imgs = Array.from(document.querySelectorAll(".innerbattle")).map(b => Array.from(b.querySelectorAll("img"))).flat();
                for (const img of imgs) {
                    updateSprite(img);
                }
            };
            const backdropFunction = function(e) {
                _settings.backdrop = e.target.value;
                util.saveSetting("backdrop", _settings.backdrop);
                const backdrops = document.querySelectorAll(".backdrop");
                for (const backdrop of backdrops) {
                    updateBackdrop(backdrop);
                }
            };
            const disableFunction = function(e) {
                const checkbox = e.target.childNodes[0];
                if (checkbox == void 0) return;
                _settings[checkbox.name] = checkbox.checked;
                util.saveSetting(checkbox.name, _settings[checkbox.name]);
            };
            const spritesFunction = function(e) {
                changeSprites(e.target.value, e.target.getAttribute("name"));
                if (e.target.getAttribute("name") === "back") {
                    const backdrops = document.querySelectorAll(".backdrop");
                    for (const backdrop of backdrops) {
                        updateBackdrop(backdrop);
                    }
                }
            };

            const changeSprites = function(gen, type) {
                _settings.sprites[type] = gen;
                util.saveSetting("sprites", _settings.sprites);
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
            
            parent.after(playUtil.buildSettingsP("Backdrop", "backdrop", className, consts.backdrops, _settings.backdrop, backdropFunction));
            parent.after(playUtil.buildSettingsP("Randoms shiny percentage", "shiny_percentage", className, null, _settings.shinyPercentage, randomFunction, { type: "number", max: 100, min: 0, value: 0, id: "shinyPercentage" }));
            for (const key of ["shiny", "icons", "back", "front"]) {
                const noPastGensCheckbox = document.querySelector("[name='nopastgens']");
                const options = [];
                const spriteSets = util.filterObject(consts.spriteSets, ss => ss[key] === true);
                let title = key === "shiny" ? "Randoms shiny" : util.capitalizeFirstLetter(key);
                if (key === "icons") {
                    const icons = [...new Set(Object.keys(consts.spriteSets).map(ss => consts.spriteSets[ss].icons).flat())];
                    options.push({ text: "Match sprites", value: "2" })
                    for (const icon of icons) {
                        if (icon === "pokemon") continue;
                        options.push({ text: icon, value: icon });
                    }
                }
                else if (key === "shiny") {
                    options.push({ text: "Match sprites", value: "2" })
                    const backAndFrontSets = util.filterObject(consts.spriteSets, ss => ss["front"] != void 0 && ss["back"] != void 0);
                    for (const spriteSet in backAndFrontSets) {
                        options.push({ text: backAndFrontSets[spriteSet].text ?? spriteSet, value: spriteSet });
                    }
                }
                else {
                    for (const spriteSet in spriteSets) {
                        options.push({ text: (spriteSets[spriteSet].text ?? spriteSet) + (key !== "front" ? "-" + key : ""), value: spriteSet + (key !== "front" ? "-" + key : "")});
                    }
                    title += " sprites";
                }
                options.sort((a, b) => isNaN(a.value) && isNaN(b.value) && a.text.localeCompare(b.text));
                const p = playUtil.buildSettingsP(title, key, className + " sprite-selector", options, _settings.sprites[key], spritesFunction);
                noPastGensCheckbox.parentNode.parentNode.after(p);
            }
            parent.after(playUtil.buildSettingsP("Disable miscellaneous calculators", "miscCalculator", className, null, null, disableFunction, { type: "checkbox", checked: _settings.miscCalculator === false }));
            parent.after(playUtil.buildSettingsP("Disable unrevealed calculator", "unrevealedCalculator", className, null, null, disableFunction, { type: "checkbox", checked: _settings.unrevealedCalculator === false }));
            parent.after(playUtil.buildSettingsP("Disable moveset calculator", "movesetCalculator", className, null, null, disableFunction, { type: "checkbox", checked: _settings.movesetCalculator === false }));
            parent.after(playUtil.buildSettingsP("Disable damage calculator", "damageCalculator", className, null, null, disableFunction, { type: "checkbox", checked: _settings.damageCalculator === false }));
            const strongP = document.createElement("p");
            const strong = document.createElement("strong");
            strong.innerHTML = "RooBY - Generation 1";
            strongP.appendChild(strong);
            parent.after(strongP);
            parent.after(document.createElement("hr"));
        }

        document.querySelector("[name='nopastgens']").addEventListener("change", function(e) {
            _settings.useModernSprites = e.target.checked;
            if (e.target.checked === false) {
                changeSprites(_settings.sprites["front"], "front");
                changeSprites(_settings.sprites["back"], "back");
            }
        })
    }

    const updateBackdrop = function(element) {
        
        const buildBackdropBottom = function(roomElement, tab, backdrop) {
            let backdropBottom = roomElement.querySelector("#backdropBottom");
            if (backdropBottom == void 0) {
                backdropBottom = document.createElement("div");
                backdropBottom.id = "backdropBottom";
                roomElement.querySelector(".innerbattle").appendChild(backdropBottom);
            }
            let backSprite = _settings.sprites["back"] == 1 ? _randomSprites[tab]["back"] : _settings.sprites["back"];
            if (backSprite == 0) backSprite = "gen1-back";
            backdropBottom.classList = [];
            if (backSprite.startsWith("gen1") || backSprite.startsWith("gen2")) {
                backdropBottom.classList.add("old-gen");
            }
            else if (backSprite.startsWith("digimon") || backSprite.includes("ani") || backSprite.includes("gen5") || backSprite.includes("afd")) {
                backdropBottom.classList.add("big-gen");
            }
            if (backdrop.indexOf("-gen") === -1) {
                backdropBottom.classList.add("no-border");
            }
            const trainers = roomElement.querySelectorAll(".trainer");
            for (const trainer of trainers) {
                updateIcons(trainer);
            }
        }
        if (element != null && element.style.backgroundImage != void 0 && _page === "play") {
            let backdrop = _settings.backdrop;
            const roomElement = playUtil.getParentRoomElement(element);
            if (roomElement == void 0 || roomElement.id.indexOf("-gen1") === -1) return;
            const tab = playUtil.getTabIdByRoomElement(roomElement);
            if (_randomSprites[tab] == void 0) initializeTab(tab);
            if (_settings.backdrop == 0) backdrop = "fx/bg-gen1.png";
            else if (_settings.backdrop == 1) backdrop = _randomBackdrop[tab];
            buildBackdropBottom(roomElement, tab, backdrop);
            element.style = "background-image: url('" + _playUrl + "/" + backdrop + "'); display: block; opacity: 0.8;";
        }
    }

    const updateIcons = function(trainer) {
        let iconsPrefix = _settings.sprites.icons || 0;
        if (trainer == void 0) return;
        const roomElement = playUtil.getParentRoomElement(trainer);
        const tab = playUtil.getTabIdByRoomElement(roomElement);
        if (tab == void 0 || roomElement.id.indexOf("-gen1") === -1) return;
        if (_randomSprites[tab] == void 0) initializeTab(tab);
        else if (iconsPrefix == 1) iconsPrefix = _randomSprites[tab].icons;
        else if (iconsPrefix == 2) {
            if (trainer.classList.contains("trainer-near")) {
                let backSetting = _settings.sprites.back == 1 ? _randomSprites[tab].back : _settings.sprites.back;
                if (backSetting == void 0) return;
                if (backSetting == 0) backSetting = "gen1-back";
                iconsPrefix = consts.spriteSets[backSetting.substring(0, backSetting.length - 5)].icons;
            }
            else if (trainer.classList.contains("trainer-far")) {
                let frontSetting = _settings.sprites.front == 1 ? _randomSprites[tab].front : _settings.sprites.front;
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
            else if (iconsPrefix === "gen5") src += chrome.runtime.getURL("images/" + iconsPrefix + srcEnd);
            else src += _playUrl + "/sprites/pokemon" + srcEnd;
            picon.style.background = src;
        }
    }

    const updateSprite = function(element) {
        const src = element.getAttribute("src");
        if (_settings.useModernSprites === true || _page !== "play" || src.indexOf("/types/") !== -1) return;
        const urlStart = _playUrl + "/sprites/";
        if (src.startsWith(urlStart) && _settings.sprites["front"] != void 0) {
            let key = "front";
            if (src.indexOf("back") !== -1) {
                key = "back";
            }
            const roomElement = playUtil.getParentRoomElement(element);
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
                if (pokemonShinyPrng < shinyPercentage && shinyPercentage !== 0) {
                    if (_settings.sprites["shiny"] == 0) {
                        spriteSrc = key === "back" ? _randomSprites[tab]["back-shiny"] : _randomSprites[tab]["shiny"];
                    }
                    else if (_settings.sprites["shiny"] == 2) {
                        let matchingSpriteSetKey = _settings.sprites[key];
                        if (matchingSpriteSetKey == 0) matchingSpriteSetKey = "gen1";
                        else if (matchingSpriteSetKey == 1) {
                            const randomKey = _randomSprites[tab][key].replace("-back", "");
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
                        spriteSrc = key === "back" ? (_settings.sprites["back-shiny"] + "-back") : _settings.sprites["shiny"];
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
                urlEnd = "/" + typoedPokemonId + "." + (!!extension ? extension : "png");
            }

            if (spriteSrc.indexOf("digimon/sprites/pokemon-back-shiny") !== -1) {
                spriteSrc = spriteSrc.replace("pokemon-back-shiny", "pokemon-shiny-back");
            }
            element.style.visibility = "hidden";
            setTimeout(function() {
                element.style.visibility = "visible";
                element.style.transform = "scaleY(" + element.naturalHeight*2/192 + ") scaleX(" + element.naturalWidth*2/192 + ")";
            }, 0);
            element.onload = function() {
                element.style.visibility = "visible";
                element.style.transform = "scaleY(" + element.naturalHeight*2/192 + ") scaleX(" + element.naturalWidth*2/192 + ")";
            }
            element.setAttribute("src", urlStart + spriteSrc + urlEnd);
        }
    }

    const getLevels = function(tab, trainerName, pokemonId) {
        if (!!_levels[tab] && !!_levels[tab][trainerName] && !!_levels[tab][trainerName][pokemonId]) {
            return _levels[tab][trainerName][pokemonId];
        }
        else if (!!_levels[tab] && !!_levels[tab][trainerName] && pokemonId == void 0) {
            return _levels[tab][trainerName];
        }
        else if (!!_levels[tab] && trainerName == void 0 && pokemonId == void 0) {
            return _levels[tab];
        }
        else if (tab == void 0 && trainerName == void 0 && pokemonId == void 0) {
            return _levels;
        }
    }

    const setLevels = function(levels, tab, trainerName, pokemonId) {
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

    const playUtil = function() {
        const buildSettingsP = function(labelText, labelName, labelClassName, options, selectedValue, event, attributes) {
            const isSelect = attributes == void 0;
            const isCheckbox = !isSelect && attributes.type === "checkbox";
            attributes = attributes || {};
            const p = document.createElement("p");
            const label = document.createElement("label");
            label.className = labelClassName;
            if (!isCheckbox) label.innerHTML = labelText + ": ";
            const input = isSelect ? document.createElement("select") : document.createElement("input");
            input.addEventListener("change", event);
            if (!isSelect) {
                for (const attribute in attributes) {
                    let value = attributes[attribute];
                    if (attribute === "checked") {
                        if (value === false) continue;
                        else value = "checked";
                    }
                    input.setAttribute(attribute, value);
                }
                if (!isCheckbox) input.value = selectedValue;
                else label.addEventListener("click", event);
            }
            input.name = labelName;
            if (isSelect) {
                const selectOptions = [];
                if (labelName !== "shiny") {
                    const defaultOption = document.createElement("option");
                    defaultOption.innerHTML = "Default";
                    defaultOption.value = "0";
                    selectOptions.push(defaultOption);
                }
                const randomBattleOption = document.createElement("option");
                randomBattleOption.innerHTML = "Random per battle";
                randomBattleOption.value = "1";
                selectOptions.push(randomBattleOption);
                for (const optionObject of options) {
                    const option = document.createElement("option");
                    if (typeof optionObject === "string" || optionObject instanceof String) {
                        option.innerHTML = optionObject;
                    }
                    else {
                        option.innerHTML = optionObject.text;
                        option.value = optionObject.value;
                    }
                    selectOptions.push(option);
                }
                const optionIndex = selectOptions.findIndex(so => so.value === selectedValue);
                for (const selectOption of selectOptions) {
                    input.appendChild(selectOption);
                }
                input.selectedIndex = optionIndex;
            }
            label.appendChild(input);
            if (isCheckbox) {
                label.innerHTML += " " + labelText;
            }
            p.appendChild(label);
            return p;
        }
    
        const chatOutput = function(inputElement, message, className) {
            const chatBox = util.getNearestRelativeElement(inputElement, ".message-log");
            const div = document.createElement("div");
            const classNames = ["rooby-chat"];
            if (className != void 0) classNames.push(className);
            div.classList.add(...classNames);
            div.innerHTML = message;
            chatBox.appendChild(div);
            const scrollDiv = document.createElement("div");
            div.after(scrollDiv)
            scrollDiv.scrollIntoView();
            scrollDiv.remove();
        }
    
        const removeChatError = function(inputElement, command) {
            setTimeout(function() {
                const chatBox = util.getNearestRelativeElement(inputElement, ".message-log");
                const errorElement = Array.from(chatBox.querySelectorAll(".message-error"))
                    .findLast(c => c.innerHTML.startsWith("The command \"/" + command + "\" does not exist."));
                if (errorElement != void 0) errorElement.remove();
            }, 0);
        }
    
        const recoveryFailureCheck = function(tab, trainerName, pokemonId) {
    
            const getPokemonNameById = function(pokemonId) {
                const pokemons = Object.keys(consts.pokedex).map(k => consts.pokedex[k]);
                const pokemon = pokemons.find(p => p.id == pokemonId);
                return pokemon != void 0 ? pokemon.name : null;
            }
    
            if (pokemonId == void 0) return;
            const pokemonName = getPokemonNameById(pokemonId);
            if (pokemonName == void 0) return;
            window.postMessage({
                function:"getExactHealthByName",
                args: {
                    name: pokemonName,
                    isRight: false,
                    tab: tab,
                    trainerName: trainerName
                }
            });
        }

        const getActivePokemonId = function(trainerElement) {
            const labelSpan = Array.from(trainerElement.querySelectorAll(".picon.has-tooltip"))
                .find(span => span.getAttribute("aria-label").endsWith("(active)"));
            if (labelSpan == void 0) return;
            const activeIconNameWithoutNick = labelSpan.getAttribute("aria-label").substring(0, labelSpan.getAttribute("aria-label").lastIndexOf(" ("));
            const name = activeIconNameWithoutNick.indexOf("(") !== -1 
                ? activeIconNameWithoutNick.substring(activeIconNameWithoutNick.lastIndexOf(" (") + 2, activeIconNameWithoutNick.length - 1)
                : activeIconNameWithoutNick;
            return playUtil.getPokemonIdByName(name);
        }
    
        const getIsRightByChildElement = function(element) {
            const trainerOrStatElement = element.closest(".trainer, .statbar");
            return ["lstatbar", "trainer-far"].some(c => trainerOrStatElement.classList.contains(c));
        }

        const getIsTransformedByStatElement = function(trainerStatElement) {
            if (trainerStatElement == void 0) return false;
            return Array.from(trainerStatElement.querySelectorAll("span")).some(e => e.innerText === "Transformed");
        }

        const getLevelFromStatElement = function(statElement) {
            const levelSmall = Array.from(statElement.querySelectorAll("small")).find(s => s.innerHTML.charAt(0) === "L");
            return levelSmall != void 0 && levelSmall.innerHTML != void 0
                ? Number.parseInt(levelSmall.innerHTML.substring(1))
                : 100;
        }

        const getParentRoomElement = function(element) {
            return element.closest(_page === "play" ? ".ps-room-opaque" : ".battle");
        }
    
        const getPokemonIdByName = function(pokemonName) {
            const pokedexMons = Object.keys(consts.pokedex).map(k => {const dexEntry = consts.pokedex[k]; dexEntry.id = k; return dexEntry;});
            const pokemon = pokedexMons.find(p => p.name === pokemonName);
            return pokemon != void 0 ? pokemon.id : null;
        }

        const getPokemonLevelById = function(tab, trainerName, pokemonId, isRight) {
            if (tab === "") tab = "replay";
            _timeoutIds[tab][trainerName] = util.debounce(function() {
                window.postMessage({
                    function:"getPokemonLevels",
                    args: {
                        isRight: isRight,
                        tab: tab
                    }
                });
            }, 20, _timeoutIds[tab][trainerName]);
            const level = getLevels(tab, trainerName, pokemonId);
            if (level != void 0) return level;
        }

        const getRevealedPokemonIds = function(trainerElement) {
            const labelSpans = Array.from(trainerElement.querySelectorAll(".picon.has-tooltip"));
            if (labelSpans.length === 0) return;
            return labelSpans
                .map(l => l.getAttribute("aria-label"))
                .map(n => n.indexOf("(") !== -1 ? n.substring(0, n.lastIndexOf(" (")) : n)
                .map(n => getPokemonIdByName(n));
        }

        const getRoomElementByTabId = function(tabId) {
            return Array.from(document.querySelectorAll(".ps-room")).find(e => e.id.endsWith(tabId));
        }

        const getStatElementBySide = function(roomElement, isRight) {
            return roomElement.querySelector(isRight ? ".lstatbar" : ".rstatbar");
        }

        const getTabIdByRoomElement = function(roomElement) {
            return roomElement.id.substring(roomElement.id.lastIndexOf("-") + 1, roomElement.id.length);
        }

        const getTrainerNameByElement = function(trainerElement) {
            return trainerElement.querySelector("strong").innerText.replace(/\s/g, '');
        }

        const getTrainerElementByName = function(roomElement, trainerName, getOpponent = false) {
            const trainerElements = roomElement.querySelectorAll(".trainer");
            for (const trainerElement of trainerElements) {
                const tName = getTrainerNameByElement(trainerElement);
                if (!trainerName.localeCompare(tName) !== getOpponent) return trainerElement;
            }
            return null;
        }

        const getTrainerElementBySide = function(roomElement, isRight) {
            return roomElement.querySelector(isRight ? ".trainer-far" : ".trainer-near");
        }

        const getTransformedId = function(trainerElement, statElement) {
            const isTransformed = getIsTransformedByStatElement(statElement);
            if (!isTransformed) return getActivePokemonId(trainerElement);
            const roomElement = trainerElement.closest(".ps-room");
            const transformEntries = Array.from(roomElement.querySelector(".battle-log").querySelectorAll(".battle-history"))
                .map(e => e.innerText)
                .filter(e => e.indexOf("transformed into") !== -1);
            const lastTransformEntry = getIsRightByChildElement(trainerElement)
                ? transformEntries.findLast(e => e.startsWith("The opposing"))
                : transformEntries.findLast(e => !e.startsWith("The opposing"));
            if (lastTransformEntry != void 0) {
                const transformedIntoName = lastTransformEntry.substring(lastTransformEntry.indexOf("transformed into") + 17, lastTransformEntry.length - 2);
                const pokemonId = playUtil.getPokemonIdByName(transformedIntoName);
                return pokemonId;
            }
            return null;
        }
    
        return {
            buildSettingsP,
            chatOutput,
            removeChatError,
            recoveryFailureCheck,
            getActivePokemonId,
            getIsRightByChildElement,
            getIsTransformedByStatElement,
            getLevelFromStatElement,
            getParentRoomElement,
            getPokemonIdByName,
            getPokemonLevelById,
            getRevealedPokemonIds,
            getRoomElementByTabId,
            getTabIdByRoomElement,
            getTrainerElementByName,
            getTrainerElementBySide,
            getTrainerNameByElement,
            getTransformedId,
            getStatElementBySide
        }
    }();
})();