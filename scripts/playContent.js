(function () {
    "use strict";
    const api = chrome || browser;
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
    let _roobyFormats = {};
    let _roobyLeaderboards = {};
    let _roobyLadders = [];
    const _playUrl = consts.urls.gameUrls[0];
    const _playRoomSelector = "div[id^=room-battle-gen1]:not([style*=\"display: none\"]:not([style*=\"display:none\"]";
    const _page = window.location.hostname.split(".")[0];
    const _doc = document;

    (function () {
        const mouseoverfunc = function (event) {
            const element = event.target;
            const roomElement = _page === "play" ? event.target.closest(_playRoomSelector) : document.querySelector(".battle").parentElement;
            if (roomElement == undefined) return;
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
                if (event.target.closest(".rightbar") != undefined || event.target.getAttribute("data-id") === "p2a") {
                    showTooltip(element, tooltipWrapper.querySelector(".tooltipinner"), true);
                }
                else if (event.target.closest(".leftbar") != undefined || event.target.getAttribute("data-id") === "p1a" || event.target.closest(".controls") != undefined) {
                    showTooltip(element, tooltipWrapper.querySelector(".tooltipinner"), false);
                }
            }
        }
        _doc.addEventListener("mouseover", mouseoverfunc);
        _doc.addEventListener("touchstart", function(event) { setTimeout(function() { mouseoverfunc(event); }, 0); });

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
        const savedSettings = await util.getStorage("settings");
        for (const key in savedSettings) {
            if (_settings[key] !== undefined) {
                _settings[key] = savedSettings[key];
            }
        }
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
                api.runtime.sendMessage({ function: "init", args: { pokemons } }, function (odds) {
                    _initialTypeOdds = odds;
                    void api.runtime.lastError;
                });
            }
        });
        loadLadderData();
        loadRoobyLadderData();
        loadRoobyLeaderboardData();
        util.getRooBYFormats().then(formats => {
            _roobyFormats = formats;
            const roomLadder = document.getElementById("room-ladder");
            if (roomLadder) {
                const ladder = roomLadder.querySelector(".ladder");
                if (ladder) addToLadder(ladder);
            }
        });
        setInterval(function () {
            const allRooms = Array.from(document.querySelectorAll(".ps-room")).filter(e => e.id.indexOf("gen1randombattle") !== -1);
            const isRoomWithThreeToFiveRevealed = allRooms
                .map(r => Array.from(r.querySelectorAll(".trainer")))
                .flat(Infinity)
                .map(t => { const rp = playUtil.getRevealedPokemonIds(t); return rp ? rp.length : 0 })
                .some(l => l >= 3 && l <= 5);
            if (isRoomWithThreeToFiveRevealed) {
                api.runtime.sendMessage({ function: "keepAlive", args: { pokemons: _pokemons } }, function () {
                    void api.runtime.lastError;
                });
            }
        }, 10000);
        setInterval(function () {
            util.pruneCalculations([..._pokemons]);
        }, 300000);
        setInterval(function () {
            loadLadderData();
            loadRoobyLadderData();
        }, 5000);
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
                if (value.startsWith("/unrevealed")) {
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
                event.target.removeAttribute("data-value");
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
                    if (damageCalc == undefined) continue;
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
        if (_randomSprites[tab] == undefined) {
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
        if (element.closest == undefined || element.classList == undefined) return;
        if (element.classList.contains("ps-popup")) {
            if (element.querySelector("p:not([style])").textContent === "Your replay has been uploaded! It's available at:") {
                const a = element.querySelector("a");
                const wonChat = document.querySelector("[data-uploading]");
                if (wonChat) {
                    wonChat.removeAttribute("data-uploading");
                    const replayLink = a.href.split(".com/")[1];
                    const strong = element.querySelector("strong");
                    const log = wonChat.closest(".message-log");
                    const small = log.querySelector("small");
                    if (small.getAttribute("data-rooby")) {
                        util.reportRooBYLadder("", replayLink, "end");
                        setTimeout(function () { strong.parentElement.click() }, 0);
                        const players = {};
                        const cleanSplit = small.textContent.replace(/\W/g, '').split("and");
                        const player1Name = cleanSplit[0].replace(/\s/g,'').toLowerCase();
                        const player2Name = cleanSplit[1].replace("joined", "").replace(/\s/g,'').toLowerCase();
                        const battleHistories = Array.from(document.querySelectorAll(".battle-history"));
                        const battleHistory = battleHistories.find(bh => bh.innerHTML.includes(" won the battle!"));
                        let winnerName = "";
                        if (battleHistory) {
                            winnerName = battleHistory.querySelector("strong").textContent.replace(/\s/g,'').toLowerCase();
                        }
                        const format = "rooby_crazyhouse";
                        const rating = "Elo";
                        const playerNames = [player1Name, player2Name];
                        for (const name of playerNames) {
                            players[name] = 1000;
                            if (_roobyLeaderboards &&_roobyLeaderboards[format] && _roobyLeaderboards[format][name]
                                && _roobyLeaderboards[format][name][rating]) {
                                    players[name] = Math.round(_roobyLeaderboards[format][name][rating]);
                            }
                        }
                        for (const name in players) {
                            const opponentName = player1Name === name ? player2Name : player1Name;
                            const result = winnerName === name ? 1 : winnerName === opponentName ? -1 : 0;
                            const isWinner = result === 1;
                            const change = roobyCalc.Elo(players[name], players[opponentName], result);
                            const ratingChange = document.createElement("div");
                            ratingChange.className = "chat";
                            const rating = players[name];
                            const textNode1 = document.createTextNode(name + "'s RooBY rating: " + rating + " → ");
                            const newRatingStrong = document.createElement("strong");
                            const br = document.createElement("br");
                            let newRating = rating;
                            if (result !== 0) newRating = isWinner ? rating + change : rating - change;
                            newRating = Math.round(Math.max(1000, newRating));
                            const newChange = Math.round(Math.abs(rating - newRating));
                            newRatingStrong.textContent = newRating;
                            let text = "(+" + newChange + " for winning)";
                            if (result === 0) text = "(" + (rating - newRating > 0 ? "+" : "") + newChange + " for tying)";
                            else if (!isWinner) text = "(-" + newChange + " for losing)";
                            const textNode2 = document.createTextNode(text);
                            ratingChange.appendChild(textNode1);
                            ratingChange.appendChild(newRatingStrong);
                            ratingChange.appendChild(br);
                            ratingChange.appendChild(textNode2);
                            log.appendChild(ratingChange);
                        }
                    }

                }
            } else setTimeout(function () { settingsPopup(element); }, 10);
        }
        else if (element.classList.contains("formatselect")) {
            const battleform = element.closest("form.battleform");
            if (battleform.hasAttribute("data-rooby-name")) {
                element.textContent = "[Gen 1] " + battleform.getAttribute("data-rooby-name");
            }
        }
        else if (element.classList.contains("ladder")) {
            addToLadder(element);
        }
        else if (element.classList.contains("chat")) {
            if (element.classList.contains("message-error")) {
                const commands = [ "unrevealed", "movesets", "moves", "export", "winrates", "rooby"];
                for (const command of commands) {
                    if (element.innerText.startsWith("The command \"/" + command)) {
                        removeChatError(element, command);
                        break;
                    }
                }
            }
            else {
                const small = element.querySelector("small");
                if (small && small.textContent.endsWith(" joined") && small.textContent.includes("and")) {
                    const username = document.querySelector(".usernametext");
                    if (username) {
                        const loggedInName = username.innerText.replace(/\s/g,'').toLowerCase();
                        const clean = small.textContent.replace(/\W/g, '');
                        const p1 = clean.split("and")[0].replace(/\s/g,'').toLowerCase();
                        const p2 = clean.split("and")[1].split("joined")[0].replace(/\s/g,'').toLowerCase();
                        const opponent = p1 === loggedInName ? p2 : p1;
                        const pmWindow = document.querySelector(".pm-window[data-userid='" + opponent + "']");
                        if (pmWindow == undefined) return;
                        const lastChat = pmWindow.querySelector("div[role='log']").lastElementChild;
                        const log = lastChat.querySelector(".message-log");
                        small.setAttribute("data-rooby", "true");
                        if (log && lastChat.textContent.includes(" wants to battle!")) {
                            const a = log.querySelector("a");
                            if (a == undefined) {
                                setTimeout(function () {
                                    const lastChat = pmWindow.querySelector("div[role='log']").lastElementChild;
                                    const a = lastChat.querySelector("a");
                                    if (a && lastChat.textContent.includes(" accepted the challenge, starting ")) {
                                        let input = a.parentElement;
                                        while (input && input.tagName !== "INPUT") {
                                            input = input.previousElementSibling;
                                        }
                                        if (input) util.reportRooBYLadder(input.value, a.href.split(".com/")[1], "start");
                                    }
                                }, 0);
                            }
                        }
                    }
                }
            }
        }
        else {
            let roomElement;
            let gametype;
            if (_page === "play") {
                const currentTab = document.querySelector(".roomtab.cur");
                if (currentTab == undefined) return;
                const tabElement = currentTab.querySelector(".text");
                if (tabElement == undefined) return;
                gametype = tabElement.innerText;
                roomElement = playUtil.getParentRoomElement(element, _page);
            }
            else if (_page === "replay") {
                gametype = document.title.split(":")[0];
                roomElement = playUtil.getParentRoomElement(element, _page);
            }
            if (roomElement == undefined) return;
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
                    setTimeout(function (elem) { updateBackdrop(elem); }, 500, element);
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
                            const firstSmall = element.closest("div[role='log']").querySelector("small");
                            if (firstSmall.getAttribute("data-rooby") !== "true") return;
                            const winnerName = element.children[0].innerHTML.split(" won the battle!")[0].replace(/\s/g,'').toLowerCase();
                            const opponentName = loggedInName === leftName ? rightName : leftName;
                            const result = loggedInName === winnerName ? 1 : -1;
                            const tabId = playUtil.getTabIdByRoomElement(roomElement);
                            const winnerTrainerElement = loggedInName === leftName ? leftTrainerElement : rightTrainerElement;
                            const opponentTrainerElement = loggedInName === leftName ? rightTrainerElement : leftTrainerElement;
                            const pokemons = playUtil.getRevealedPokemonIds(winnerTrainerElement);
                            const opponentPokemons = playUtil.getRevealedPokemonIds(opponentTrainerElement);
                            saveResult(opponentName, tabId, result, pokemons, opponentPokemons);
                            element.setAttribute("data-uploading", "true");
                            playUtil.uploadReplay(tabId);
                        }
                    }
                }
                else {
                    const tab = playUtil.getTabIdByRoomElement(roomElement);
                    const isRight = element.classList.contains("lstatbar");
                    const trainerElement = playUtil.getTrainerElementBySide(roomElement, isRight);
                    if (trainerElement == undefined) return;
                    const trainerName = playUtil.getTrainerNameByElement(trainerElement);
                    if (isRight) {
                        const opponentTrainerElement = playUtil.getTrainerElementBySide(roomElement, isRight);
                        const opponentPokemonId = playUtil.getActivePokemonId(opponentTrainerElement);
                        const opponentTrainerName = playUtil.getTrainerNameByElement(trainerElement);
                        recoveryFailureCheck(tab, opponentTrainerName, opponentPokemonId, isRight);
                    }
                    if (element.classList.contains("statbar")) {
                        const pokemonId = playUtil.getActivePokemonId(trainerElement);
                        if (pokemonId == undefined) return;
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
        const userElement = document.createElement(_settings.trainerTooltip === false ? "span" : "a");
        if (_settings.trainerTooltip !== false) {
            userElement.href = "https://pokemonshowdown.com/users/" + userId;
            userElement.target = "_new";
        }
        userElement.textContent = trainerNameWithSpaces;
        trainerElement.querySelector("strong").innerHTML = "";
        trainerElement.querySelector("strong").appendChild(userElement);
    }

    const addToLadder = function (ladder) {
        const formatKeys = Object.keys(_roobyFormats);
        if (_settings.roobyMatchmaking === false || formatKeys.length === 0) return;
        const h3s = Array.from(ladder ? ladder.querySelectorAll("h3") : []);
        const formatH3 = h3s.find(h => formatKeys.some(fk => h.textContent.includes(fk)));
        if (formatH3) {
            const formatKey = formatKeys.find(fk => formatH3.textContent.includes(fk));
            formatH3.textContent = "[Gen 1] " + formatH3.textContent.replace(formatKey, _roobyFormats[formatKey].name);
            formatH3.nextSibling.remove();
            const table = document.createElement("table");
            const tbody = document.createElement("tbody");
            const headerTr = document.createElement("tr");
            const blankTh = document.createElement("th");
            blankTh.textContent = "";
            headerTr.appendChild(blankTh);
            const nameTh = document.createElement("th");
            nameTh.textContent = "Name";
            headerTr.appendChild(nameTh);
            const ladders = _roobyLeaderboards[formatKey];
            const ladderKeys = ladders ? Object.keys(ladders) : ["Rating"];
            const ratingNames = [];
            if (ladderKeys.length > 0) {
                const nameKeys = ladders ? Object.keys(ladders[ladderKeys[0]]) : [];
                for (const nameKey of nameKeys) {
                    const eloTh = document.createElement("th");
                    eloTh.textContent = nameKey;
                    headerTr.appendChild(eloTh);
                    ratingNames.push(nameKey);
                }
            }
            tbody.appendChild(headerTr);
            loadRoobyLeaderboardData();
            let index = 1;
            for (const name in ladders) {
                const ladder = ladders[name];
                const tr = document.createElement("tr");
                const tdIndex = document.createElement("td");
                tdIndex.textContent = index++;
                tr.appendChild(tdIndex);
                const tdName = document.createElement("td");
                tdName.textContent = name;
                tr.appendChild(tdName);
                for (const ratingName of ratingNames) {
                    const tdElo = document.createElement("td");
                    tdElo.style = "font-weight:bold";
                    tdElo.textContent = parseInt(ladder[ratingName]);
                    tr.appendChild(tdElo);
                }
                tbody.appendChild(tr);
            }
            if (ladders == undefined) {
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.colSpan = 3;
                td.textContent = "No players found.";
                tr.appendChild(td);
                tbody.appendChild(tr);
            }
            table.appendChild(tbody);
            formatH3.after(table);
        }
        else {
            let ul = document.getElementById("roobyLadder");
            const ladderExists = ul != undefined;
            if (!ladderExists && ladder == undefined) return;
            ul = ul || document.createElement("ul");
            ul.id = "roobyLadder";
            ul.style = "list-style:none;margin:0;padding:0";
            ul.textContent = "";
            for (const format of formatKeys) {
                const li = document.createElement("li");
                li.style = "margin:5px";
                const button = document.createElement("button");
                button.name = "selectFormat";
                button.value = format;
                button.className = "button";
                button.style = "width:320px;height:30px;text-align:left;font:12pt Verdana";
                button.textContent = _roobyFormats[format].name;
                li.appendChild(button);
                ul.appendChild(li);
            }
            if (!ladderExists) ladder.appendChild(ul);
            if (!h3s.some(h => h.textContent === "RooBY Mods")) {
                const h3 = document.createElement("h3");
                h3.textContent = "RooBY Mods";
                ul.before(h3);
            };
            return ul;
        }
    }

    const removeChatError = function (inputElement, command) {
        setTimeout(function (command) {
            const chatBox = util.getNearestRelativeElement(inputElement, ".message-log");
            if (chatBox.querySelector(".message-error") == undefined) return;
            const errorElement = Array.from(chatBox.querySelectorAll(".message-error"))
                .findLast(c => c.innerHTML.startsWith("The command \"/" + command + "\" does not exist."));
            if (errorElement != undefined) errorElement.remove();
        }, 0, command);
    }

    const loadRatings = function (trainerElement) {
        const trainerName = playUtil.getTrainerNameByElement(trainerElement).replace(/\s/g,'').toLowerCase();
        if (!_ratings[trainerName] || _ratings[trainerName].accessTime + 60000 < Date.now()) {
            _timeoutIds[trainerName + "ratings"] = util.debounce(function () {
                util.loadRatingsData(util.slugify(trainerName), consts.urls.ratingsDataUrl).then(data => {
                    if (data == undefined) return;
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
            if (format === "") return;
            util.loadLadderData(format, consts.urls.laddersUrl).then(data => {
                if (data) _ladders[format] = data.toplist.map(t => t.userid);
            });
    }

    const loadRoobyLadderData = function() {
        return util.loadRooBYLadderData().then(data => {
            _roobyLadders = data;
            updateRoobyBattles(data);
            showRoobyLadder(data);
        });
    }

    const loadRoobyLeaderboardData = function() {
        return util.loadRooBYLeaderboardData().then(data => {
            _roobyLeaderboards = data;
        });
    }

    const recoveryFailureCheck = function (tab, trainerName, pokemonId, isRight) {
        if (!_settings.miscCalculator || pokemonId == undefined) return;
        const dexMons = Object.keys(consts.pokedex).map(k => consts.pokedex[k]);
        const pokemonName = dexMons.find(p => p.id == pokemonId).name;
        if (pokemonName == undefined) return;
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
            if (result != undefined && result.odds != undefined) {
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
                                        checkingElement.textContent = "Calculations finished! Hover over again to see the odds.";
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
        if (_timeoutIds[tab] == undefined) initializeTab(tab, trainerName);
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
            if (_unrevealedPokemonOdds[tab] != undefined && _unrevealedPokemonOdds[tab][trainerName] != undefined) {
                unrevealedPokemonOdds = _unrevealedPokemonOdds[tab][trainerName][dittoMonNumbers] || unrevealedPokemonOdds;
            }
            calculateUnrevealedPokemon(trainerElement, roomElement);
        }
        else unrevealedPokemonOdds = _initialTypeOdds;
        const container = document.createElement('div');
        const h2 = document.createElement('h2');
        h2.className = 'unrevealed-pokemon';
        h2.textContent = 'Unrevealed Pokémon:';
        container.appendChild(h2);
        const p = document.createElement('p');

        const sortedTypeKeys = Object.keys(unrevealedPokemonOdds)
            .sort((a, b) => unrevealedPokemonOdds[b] - unrevealedPokemonOdds[a])
            .sort((a, b) => a === "Paralysis" ? -1 : b === "Paralysis" ? 1 : 0)
            .sort((a, b) => a === "Sleep" ? -1 : b === "Sleep" ? 1 : 0);

        if (Object.keys(unrevealedPokemonOdds).length === 0) {
            const span = document.createElement('span');
            span.id = 'unrevealedPokemonChecking';
            span.textContent = 'Calculating, check again soon...';
            p.appendChild(span);
        } else {
            const small = document.createElement('small');
            small.textContent = `(${unrevealedPokemonOdds["Total"]} possible)`;
            h2.appendChild(small);
        }

        for (const typeKey of sortedTypeKeys) {
            if (typeKey === "Total") continue;

            if (typeKey === "Sleep") {
                const b = document.createElement('b');
                b.className = 'title';
                b.textContent = 'Status inflicters:';
                p.appendChild(b);
                p.appendChild(document.createElement('br'));
            }

            const span = document.createElement('span');
            if (Number.parseFloat((unrevealedPokemonOdds[typeKey] * 100).toFixed(1)) == 0) {
                span.className = 'zero';
            }

            const approximate = (unrevealedPokemonOdds[typeKey] > 0 && revealedPokemonIds.length < 5) ? "~" : "";
            span.textContent = ` • ${util.capitalizeFirstLetter(typeKey)}: ${approximate}${(unrevealedPokemonOdds[typeKey] * 100).toFixed(1)}%`;
            p.appendChild(span);
            p.appendChild(document.createElement('br'));

            if (typeKey === "Paralysis") {
                const b = document.createElement('b');
                b.className = 'title';
                b.textContent = 'Types:';
                p.appendChild(b);
                p.appendChild(document.createElement('br'));
            }
        }

        container.appendChild(p);

        const tooltip = util.battleTooltips;
        tooltip.showTooltip(container, element, "unrevealedPokemon", { trainer: trainerName, pokemon: dittoMonNumbers });
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
        if (_settings.trainerTooltip === false) return;
        const trainerNameWithSpaces = playUtil.getTrainerNameByElement(element.closest(".trainer"), false);
        const userId = trainerNameWithSpaces.replace(/\s/g,'').toLowerCase();
        const format = window.location.pathname.startsWith("/battle")
            ? window.location.pathname.split("-")[1]
            : window.location.pathname.split("-")[0].substring(1);
        const container = document.createElement('div');

        const h2 = document.createElement('h2');
        h2.textContent = trainerNameWithSpaces;
        if (_ladders[format] && _ladders[format].includes(util.slugify(userId))) {
            const span = document.createElement('span');
            span.className = 'info';
            span.textContent = `#${_ladders[format].indexOf(util.slugify(userId)) + 1}`;
            h2.appendChild(span);
        }
        container.appendChild(h2);
        
        const p = document.createElement('p');
        container.appendChild(p);
        
        let elo = element.hasAttribute("title")
            ? element.getAttribute("title").substring(element.getAttribute("title").indexOf("Rating: ") + 8)
            : "Loading...";
        let age = "Loading...";
        let gxe = "Loading...";
        let glicko = "Loading...";
        const { wins, draws, losses } = _results[userId] ?? { wins: 0, draws: 0, losses: 0 };
        let winLoss = `${wins}-${draws}-${losses}`;
        if (wins + losses > 0) winLoss += ` (${Math.round(wins / (wins + losses) * 100)}%)`;
        
        const roomElement = playUtil.getParentRoomElement(element, _page);
        const winProbabilityValueSpan = document.createElement('span');
        const eloChangeValueSpan = document.createElement('span');

        const battleLog = roomElement.querySelector(".battle-log");
        const small = battleLog.querySelector("small");
        const isRoobyBattle = small.getAttribute("data-rooby") === "true";

        winProbabilityValueSpan.textContent = "Loading...";
        if (_ratings[userId]) {
            const isRight = playUtil.getIsRightByChildElement(element);
            const opponentTrainerElement = playUtil.getTrainerElementBySide(roomElement, !isRight);
            const opponentId = playUtil.getTrainerNameByElement(opponentTrainerElement).replace(/\s/g, '').toLowerCase();
            const roobyFormat = isRoobyBattle ? "rooby_crazyhouse" : format;
            const leaderboards = _roobyLeaderboards[roobyFormat] ? _roobyLeaderboards[roobyFormat][userId] ? _roobyLeaderboards[roobyFormat][userId] : {} : {};
            const opponentLeaderboards = _roobyLeaderboards[roobyFormat] ? _roobyLeaderboards[roobyFormat][opponentId] ? _roobyLeaderboards[roobyFormat][opponentId] : {} : {};
            const eloRating = isRoobyBattle ? leaderboards?.Elo : _ratings[userId][roobyFormat]?.elo;
            const opponentEloRating = isRoobyBattle ? opponentLeaderboards?.Elo : _ratings[opponentId][roobyFormat]?.elo;
            if (elo === "Loading..." || _page === "play") elo = eloRating ? Math.round(eloRating) : 1000;
            const eloLoss = roobyCalc.Elo(eloRating, opponentEloRating, -1);
            const eloTie = roobyCalc.Elo(eloRating, opponentEloRating, 0);
            const eloGain = roobyCalc.Elo(eloRating, opponentEloRating, 1);
            if (_ratings[userId].registertime > 0) age = new Date(_ratings[userId].registertime * 1000).toLocaleDateString("en-US");
            else age = "Unregistered";
            gxe = _ratings[userId][roobyFormat]?.gxe ? `${_ratings[userId][roobyFormat].gxe}%` : "50.0%";
            glicko = _ratings[userId][roobyFormat]?.rpr
                ? `${Math.round(_ratings[userId][roobyFormat].rpr)} ± ${Math.round(_ratings[userId][roobyFormat].rprd)}`
                : "1500 ± 130";
            const winRate = roobyCalc.winRate(_ratings[userId][roobyFormat], _ratings[opponentId][roobyFormat]);
            winProbabilityValueSpan.className = winRate > .5 ? "green" : "red";
            winProbabilityValueSpan.textContent = (winRate * 100).toFixed(2) + "%";
            eloChangeValueSpan.className = eloGain > 0 ? "green" : eloLoss > 0 ? "red" : "black";
            const greenSpan = document.createElement('span');
            greenSpan.className = "green";
            greenSpan.textContent = "+" + Math.round(eloGain);
            const tieSpan = document.createElement('span');
            tieSpan.textContent = (eloTie > 0 ? "+" : "") + Math.round(eloTie);
            const redSpan = document.createElement('span');
            redSpan.className = "red";
            redSpan.textContent = Math.round(eloLoss);
            eloChangeValueSpan.appendChild(greenSpan);
            eloChangeValueSpan.appendChild(document.createTextNode(" / "));
            eloChangeValueSpan.appendChild(tieSpan);
            eloChangeValueSpan.appendChild(document.createTextNode(" / "));
            eloChangeValueSpan.appendChild(redSpan);
        }
        
        const registeredSpan = document.createElement('span');
        registeredSpan.className = 'section';
        registeredSpan.textContent = 'Registered:';
        const registeredInfoSpan = document.createElement('span');
        registeredInfoSpan.className = 'info';
        registeredInfoSpan.textContent = age;
        registeredSpan.appendChild(registeredInfoSpan);
        p.appendChild(registeredSpan);
        
        const eloSpan = document.createElement('span');
        eloSpan.className = 'section';
        const eloTitle = document.createElement('span');
        eloTitle.textContent = (isRoobyBattle ? "RooBY " : "") + 'Elo:';
        const eloInfoSpan = document.createElement('span');
        eloInfoSpan.className = 'info';
        const eloBold = document.createElement('b');
        eloBold.textContent = elo;
        eloInfoSpan.appendChild(eloBold);
        eloSpan.appendChild(eloTitle);
        eloSpan.appendChild(eloInfoSpan);
        eloSpan.appendChild(document.createElement('br'));

        if (!isRoobyBattle) {
            const gxeTitleSpan = document.createElement('span');
            gxeTitleSpan.textContent = 'GXE:';
            const gxeInfoSpan = document.createElement('span');
            gxeInfoSpan.className = 'info';
            gxeInfoSpan.textContent = gxe;
            eloSpan.appendChild(gxeTitleSpan);
            eloSpan.appendChild(gxeInfoSpan);
            eloSpan.appendChild(document.createElement('br'));
    
            const glickoTitleSpan = document.createElement('span');
            glickoTitleSpan.textContent = 'Glicko-1:';
            const glickoInfoSpan = document.createElement('span');
            glickoInfoSpan.className = 'info';
            glickoInfoSpan.textContent = glicko;
            eloSpan.appendChild(glickoTitleSpan);
            eloSpan.appendChild(glickoInfoSpan);
            eloSpan.appendChild(document.createElement('br'));
        }

        p.appendChild(eloSpan);

        const winProbabilitySpan = document.createElement('span');
        winProbabilitySpan.className = 'section';
        const winProbabilityTitleSpan = document.createElement('span');
        winProbabilityTitleSpan.textContent = 'Win probability:';
        winProbabilityValueSpan.classList.add("info");
        winProbabilitySpan.appendChild(winProbabilityTitleSpan);
        winProbabilitySpan.appendChild(winProbabilityValueSpan);
        winProbabilitySpan.appendChild(document.createElement('br'));
        
        if (roomElement.querySelector(".rated") || isRoobyBattle) {
            const eloChangeTitleSpan = document.createElement('span');
            eloChangeTitleSpan.textContent = 'Elo change:';
            eloChangeValueSpan.className = 'info';
            winProbabilitySpan.appendChild(eloChangeTitleSpan);
            winProbabilitySpan.appendChild(eloChangeValueSpan);
        }

        p.appendChild(winProbabilitySpan);
        
        if (document.querySelector(".usernametext")) {
            const loggedInName = document.querySelector(".usernametext").innerText.replace(/\s/g, '').toLowerCase();
            if (loggedInName !== userId) {
                const personalRecordSpan = document.createElement('span');
                personalRecordSpan.className = 'section';
                personalRecordSpan.textContent = 'Personal record:';
                const personalRecordInfoSpan = document.createElement('span');
                personalRecordInfoSpan.className = 'info';
                personalRecordInfoSpan.textContent = winLoss;
                personalRecordSpan.appendChild(personalRecordInfoSpan);
                p.appendChild(personalRecordSpan);
            }
        }
        const tooltip = util.battleTooltips;
        tooltip.showTooltip(container, element, "trainer", { trainer: userId });
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
            if (statElement != undefined && statElement.querySelector(".status") != undefined) {
                const statStatusElement = statElement.querySelector(".status");
                const statusElements = statStatusElement.children.length === 0
                    ? [statStatusElement]
                    : [...statStatusElement.children];
                if (tooltip != undefined && tooltip.querySelector(".status") != undefined) {
                    status = tooltip.querySelector(".status").innerText;
                }
                else {
                    if (statStatusElement.children.length === 0) {
                        status = statStatusElement.innerText;
                    }
                    else {
                        const statusChild = Array.from(statStatusElement.children).find(e => e.className !== "bad" && e.className !== "good");
                        if (statusChild != undefined) status = statusChild.innerText;
                    }
                }
                let isActive = true;
                if (tooltip != undefined && !tooltip.classList.contains("tooltip-move")) {
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
            if (tooltip != undefined && !!pokemons) {
                const statElement = playUtil.getStatElementBySide(roomElement, isRight);
                const opponentStatElement = playUtil.getStatElementBySide(roomElement, !isRight);
                const opponentTrainerElement = playUtil.getTrainerElementBySide(roomElement, !isRight);

                let { exactHealth, healthRemainingPercent } = playUtil.getPokemonHealth(tooltip.querySelectorAll("p")[0].childNodes[1], statElement);
                //let attackMultiplier = playUtil.getAttackMultiplier(roomElement, isRight);
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
                    hasLightScreen: status.hasLightScreen,
                    //attackMultiplier: attackMultiplier
                }
                if (pokemon.level == undefined) return;
                const transformedId = playUtil.getTransformedId(trainerElement, statElement);
                const opponentTrainerName = playUtil.getTrainerNameByElement(opponentTrainerElement);
                if (isActive && transformedId !== pokemon.id) {
                    pokemon.transformedId = transformedId;
                    pokemon.transformedLevel = playUtil.getPokemonLevelById(_levels, _timeoutIds, tab, opponentTrainerName, transformedId, !isRight);
                    if (pokemon.transformedLevel == undefined) return;
                }
                const opponentPokemonId = playUtil.getActivePokemonId(opponentTrainerElement);
                const opponentStatus = getStatus(opponentStatElement, opponentTrainerElement);
                if (opponentPokemonId != undefined) {
                    const opponent = {
                        healthRemainingPercent: Number.parseInt(opponentStatElement.querySelector(".hptext").childNodes[0].nodeValue.trim().replace("%", "")),
                        id: opponentPokemonId,
                        level: playUtil.getLevelFromStatElement(opponentStatElement),
                        boosts: opponentStatus.boosts,
                        status: opponentStatus.status,
                        hasReflect: opponentStatus.hasReflect,
                        hasLightScreen: opponentStatus.hasLightScreen
                    }
                    if (opponent.level == undefined) return;
                    const opponentTransformedId = playUtil.getTransformedId(opponentTrainerElement, opponentStatElement)
                    if (opponentTransformedId !== opponent.id) {
                        opponent.transformedId = opponentTransformedId;
                        opponent.transformedLevel = playUtil.getPokemonLevelById(_levels, _timeoutIds, tab, trainerName, opponentTransformedId, !isRight);
                        if (opponent.transformedLevel == undefined) return;
                    }
                    pokemon.opponent = opponent;
                }
                return pokemon;
            }
        }

        const tooltip = tooltipElement.querySelector(".tooltip-pokemon, .tooltip-switchpokemon, .tooltip-move, .tooltip-activepokemon");
        const roomElement = Array.from(document.querySelectorAll(".ps-room-opaque, div:not([class]) > .battle")).find(e => e.style.display !== "none");
        if (tooltip != undefined) {
            let section = tooltipElement.querySelector(".section");
            if (tooltip.querySelector(".calculator") != undefined) return;
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
        if (pokemon.id == undefined) return;
        if (tooltip.querySelector(".tooltip-section").querySelector(".calculator") != undefined) return;
        section = document.createElement("p");
        section.className = "section";
        const moveName = tooltip.querySelector("h2").childNodes[0].nodeValue;
        if (moveName === "Recharge") return;
        const moveButton = Array.from(roomElement.querySelectorAll("button[name=chooseMove]")).find(b => b.childNodes[0].nodeValue === moveName);
        let failureRate = Number.parseFloat(moveButton.getAttribute("data-failure-rate"));
        failureRate = isNaN(failureRate) ? null : failureRate;

        let damageCalc = roobyCalc.damage(pokemon, pokemon.opponent, moveName);
        const critDamageCalc = roobyCalc.damage(pokemon, pokemon.opponent, moveName, null, true);
        if (damageCalc.critRate >= 1) damageCalc = critDamageCalc;

        if (!isNaN(damageCalc.maxDamage) || (damageCalc.minDamage === "?" && damageCalc.maxDamage === "?")) {
            const minDamage = damageCalc.minDamage === "?" ? "?" : ((damageCalc.minDamage * 100).toFixed(1) + "%");
            const maxDamage = damageCalc.maxDamage === "?" ? "?" : ((damageCalc.maxDamage * 100).toFixed(1) + "%");
            const calculatorDiv = document.createElement('div');
            calculatorDiv.className = 'calculator';

            const damageContainerDiv = document.createElement('div');
            damageContainerDiv.className = 'damage-container';

            const damageSpan = document.createElement('span');
            damageSpan.textContent = 'Damage: ' + minDamage + ' - ' + maxDamage;
            damageContainerDiv.appendChild(damageSpan);

            if (damageCalc.minRecoil !== undefined) {
                const recoilSmall = document.createElement('small');
                recoilSmall.className = 'recoil';
                recoilSmall.textContent = '(' + (damageCalc.minRecoil * 100).toFixed(1) + '% - ' + (damageCalc.maxRecoil * 100).toFixed(1) + '% recoil)';
                damageContainerDiv.appendChild(recoilSmall);
            }

            calculatorDiv.appendChild(damageContainerDiv);

            if (!isNaN(critDamageCalc.minDamage) && damageCalc.critRate < 1 && damageCalc.critRate > 0) {
                const critDiv = document.createElement('div');
                critDiv.textContent = 'Crit (' + (damageCalc.critRate * 100).toFixed(1) + '%): ' + (critDamageCalc.minDamage * 100).toFixed(1) + '% - ' + (critDamageCalc.maxDamage * 100).toFixed(1) + '%';
                calculatorDiv.appendChild(critDiv);
            }

            if (damageCalc.hkoPercentage !== undefined) {
                const hkoDiv = document.createElement('div');
                hkoDiv.className = 'hko';
                hkoDiv.textContent = (damageCalc.hkoPercentage * 100).toFixed(1) + '% chance to ' + damageCalc.hkoMultiple + 'HKO';
                calculatorDiv.appendChild(hkoDiv);

                if (damageCalc.hkoMultiple > 1 && damageCalc.critRate < 1 && damageCalc.critRate > 0) {
                    const critHkoDiv = document.createElement('div');
                    critHkoDiv.textContent = (critDamageCalc.hkoPercentage * 100).toFixed(1) + '% chance to ' + critDamageCalc.hkoMultiple + 'HKO with crit';
                    calculatorDiv.appendChild(critHkoDiv);
                }
            }

            section.appendChild(calculatorDiv);
            tooltip.querySelector(".tooltip-section").before(section);
        }
        else if (failureRate != undefined && _settings.miscCalculator !== false) {
            const calculatorDiv = document.createElement('div');
            calculatorDiv.className = 'calculator';

            const damageContainerDiv = document.createElement('div');
            damageContainerDiv.className = 'damage-container';

            const failureSmall = document.createElement('small');
            failureSmall.className = 'failure p' + (failureRate * 100).toFixed(0);
            failureSmall.textContent = '(' + (failureRate != 0 && failureRate != 1 ? '~' : '') + (failureRate * 100).toFixed(0) + '% chance of failure)';

            damageContainerDiv.appendChild(failureSmall);
            calculatorDiv.appendChild(damageContainerDiv);
            section.appendChild(calculatorDiv);
            tooltip.querySelector(".tooltip-section").before(section);
        }
    }

    const showPokemonTooltip = function (section, tooltip, roomElement, isRight, tooltipPokemon) {
                
        const showRecoverFailureRate = function (revealedMoveElement, failureRate) {
            if (failureRate != undefined && _settings.miscCalculator !== false) {
                const recoverSpan = document.createElement("span");
                const small = document.createElement('small');
                small.className = "failure p" + (failureRate * 100).toFixed(0);
                small.textContent = '(' + (failureRate != 0 && failureRate != 1 ? '~' : '') + (failureRate * 100).toFixed(0) + '% fail)';
                recoverSpan.appendChild(small);
                revealedMoveElement.parentElement.insertBefore(recoverSpan, revealedMoveElement.nextSibling);
            }
        }

        if (section == undefined) {
            section = document.createElement("p");
            section.className = "section";
        }
        const h2 = tooltip.querySelector(".tooltip h2");
        const trainerElement = playUtil.getTrainerElementBySide(roomElement, isRight);
        const trainerStatElement = playUtil.getStatElementBySide(roomElement, isRight);
        const isTransformed = playUtil.getIsTransformedByStatElement(trainerStatElement);
        const nameSmall = Array.from(h2.querySelectorAll("small"))
            .find(s => !s.innerHTML.startsWith(consts.transformedIntoString) && !s.innerHTML.startsWith("(L") && !s.innerHTML.startsWith("(Type"));
        const pokemonName = nameSmall != undefined && nameSmall.innerHTML != undefined && nameSmall.innerHTML.indexOf("(") !== -1
            ? nameSmall.innerHTML.substring(1, nameSmall.innerHTML.length - 1)
            : h2.childNodes[0].nodeValue.trim();
        const pokemon = _pokemons.find(p => p.name == pokemonName);
        if (pokemon == undefined) return;
        const pokemonLevel = playUtil.getLevelFromStatElement(h2);
        const tab = playUtil.getTabIdByRoomElement(roomElement);
        const trainerName = playUtil.getTrainerNameByElement(trainerElement);
        setLevels(pokemonLevel, tab, trainerName, pokemon.id);
        const transformedSmall = Array.from(h2.querySelectorAll("small")).find(s => s.innerHTML.indexOf(consts.transformedIntoString) !== -1);
        const transformedIntoName = transformedSmall != undefined
            ? transformedSmall.innerHTML.substring(transformedSmall.innerHTML.indexOf(consts.transformedIntoString) + consts.transformedIntoString.length, transformedSmall.innerHTML.length - 1)
            : pokemonName;
        tooltip.appendChild(section);

        if (_settings.miscCalculator !== false) {
            const confusionDamageSpan = document.createElement("span");
            confusionDamageSpan.className = "self-hit damage";
            confusionDamageSpan.textContent = "(" + (pokemon.confusionDamage[0] * 100).toFixed(1) + "% or " + (pokemon.confusionDamage[1] * 100).toFixed(1) + "% self-hit)";
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
            if (tooltipPokemon.opponent != undefined) {
                let damageCalc = roobyCalc.damage(tooltipPokemon, tooltipPokemon.opponent, revealedMoveName);
                if (damageCalc.critRate >= 1) damageCalc = roobyCalc.damage(tooltipPokemon, tooltipPokemon.opponent, revealedMoveName, null, true);
                if (damageCalc == undefined) return;
                let failureRate = moveButton == undefined ? damageCalc.failureRate : Number.parseFloat(moveButton.getAttribute("data-failure-rate"));
                failureRate = isNaN(failureRate) ? damageCalc.failureRate : failureRate;
                if (!isNaN(damageCalc.maxDamage) && _settings.damageCalculator !== false) {
                    const damageSpan = document.createElement("span");
                    damageSpan.className = "damage";
                    damageSpan.textContent = (damageCalc.minDamage * 100).toFixed(1) + "%-" + (damageCalc.maxDamage * 100).toFixed(1) + "%";
                    const isSwitchPokemon = tooltip.classList.contains("tooltip-switchpokemon");
                    revealedMoveElement.parentElement.insertBefore(damageSpan, isSwitchPokemon ? revealedMoveElement.nextSibling : revealedMoveElement);
                }
                else showRecoverFailureRate(revealedMoveElement, failureRate);
            }
            else {
                const damageCalc = roobyCalc.damage(tooltipPokemon, tooltipPokemon.opponent, revealedMoveName);
                let failureRate = moveButton == undefined ? damageCalc.failureRate : Number.parseFloat(moveButton.getAttribute("data-failure-rate"));
                failureRate = isNaN(failureRate) ? damageCalc.failureRate : failureRate;
                showRecoverFailureRate(revealedMoveElement, failureRate);
            }
        }
        if (!tooltip.classList.contains("tooltip-switchpokemon")) {
            for (const move of unrevealedMoves) {
                const probability = Math.round(move.probability * 100) / 100;
                let className = "calculator";
                if (probability == 0) className += " zero";
                const moveDiv = document.createElement('div');
                moveDiv.className = className;

                const moveText = document.createTextNode('• ' + move.name + ' ');
                moveDiv.appendChild(moveText);

                const small = document.createElement('small');
                small.textContent = probability + '%';

                if (tooltipPokemon.opponent !== undefined) {
                    const damageCalc = roobyCalc.damage(tooltipPokemon, tooltipPokemon.opponent, move.name);
                    const moveButton = Array.from(roomElement.querySelectorAll("button[name=chooseMove]")).find(b => b.childNodes[0].nodeValue === move.name);
                    let failureRate = moveButton == undefined ? damageCalc.failureRate : Number.parseFloat(moveButton.getAttribute("data-failure-rate"));
                    failureRate = isNaN(failureRate) ? damageCalc.failureRate : failureRate;

                    if (((!isNaN(damageCalc.minDamage) && !isNaN(damageCalc.maxDamage)) || (damageCalc.minDamage === "?" && damageCalc.maxDamage === "?")) && _settings.damageCalculator !== false) {
                        const minDamage = damageCalc.minDamage === "?" ? "?" : ((damageCalc.minDamage * 100).toFixed(1) + "%");
                        const maxDamage = damageCalc.maxDamage === "?" ? "?" : ((damageCalc.maxDamage * 100).toFixed(1) + "%");
                        const damageSpan = document.createElement('span');
                        damageSpan.className = 'damage';
                        damageSpan.textContent = minDamage + '-' + maxDamage;
                        small.appendChild(damageSpan);
                    } else if (failureRate !== undefined && _settings.miscCalculator !== false) {
                        const failureSpan = document.createElement('span');
                        failureSpan.className = 'failure p' + (failureRate * 100).toFixed(0);
                        failureSpan.textContent = '(' + (failureRate * 100).toFixed(0) + '% fail)';
                        small.appendChild(failureSpan);
                    }
                }

                moveDiv.appendChild(small);
                section.appendChild(moveDiv);
            }
        }
    }

    const simulateOdds = function (target, value) {
        const args = value.split(" ").map(a => a.toLowerCase());
        const simulationTypes = ["pokemon", "types", "dual types"];
        if (args.length > 2 && args[1] === "dual" && args[2] === "types") args[1] = "dual types";
        const examplesTitle = [
            {b: "Examples:"}
        ];
        const exampleTitle = [
            {b: "Examples:"}
        ];
        const example1 = [
            {code: "/unrevealed dual types [butterfree, golduck]"}
        ];
        const example2 = [
            {code: "/unrevealed types [gengar, pinsir, snorlax] ditto:true simulations:200000"}
        ];
        if (args.length === 1 || args[1] === "help") {
            const help = [
                {text: "Use the command "},
                {code: "/unrevealed"},
                {text: " followed by the simulation type, the Pokémon team between brackets and optionally "},
                {i: "\"ditto:true\""},
                {text: " and "},
                {i: "\"simulations:NUMBER\""},
                {text: "."}
            ];
            const simTypes = [
                {text: "Valid simulation types are: "}
            ]
            for (const simulationType of simulationTypes) {
                simTypes.push({i: "\"" + simulationType + "\""});
                if (simulationType !== simulationTypes[simulationTypes.length - 1]) simTypes.push({text: ", "});
                else simTypes.push({text: "."});
            }
            playUtil.chatOutput(target, [help, simTypes, examplesTitle, example1, example2]);
        }
        else if (!simulationTypes.includes(args[1])) {
            const invalid = [
                {span: "Invalid simulation type.", properties: [{ class: "failure" }]},
                {text: " Valid types are: "}
            ];
            for (const simulationType of simulationTypes) {
                invalid.push({i: "\"" + simulationType + "\""});
                if (simulationType !== simulationTypes[simulationTypes.length - 1]) invalid.push({text: ", "});
                else invalid.push({text: "."});
            }
            playUtil.chatOutput(target, [invalid, examplesTitle, example1, example2]);
        }
        else if (value.indexOf("[") === -1 || value.indexOf("]") === -1) {
            const invalid = [
                {span: "Invalid team format.", properties: [{ class: "failure" }]},
                {text: " Please use brackets to enclose the team. If team is empty, use an empty bracket "},
                {i: "\"[]\""},
                {text: "."}
            ];
            playUtil.chatOutput(target, [invalid, examplesTitle, example1, example2]);
        }
        else {
            let simulations;
            if (value.indexOf("simulations") !== -1) {
                const simulationsArg = args.find(a => a.startsWith("simulations:"));
                simulations = Number.parseInt(simulationsArg.substring(12, simulationsArg.length));
                if (isNaN(simulations)) {
                    const invalid = [
                        {span: "Invalid simulations number.", properties: [{ class: "failure" }]},
                        {text: " Please use a valid number."}
                    ];
                    playUtil.chatOutput(target, [invalid, exampleTitle, example2]);
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
            const calculating = [
                {text: "Calculating remaining " + (type === "pokemon" ? "Pokémon" : type) + ", please wait..."}
            ]
            playUtil.chatOutput(target, [calculating], "rooby-calculating");
            const oddsDisplay = function (key, odds, isApproximate) {
                const isTotal = key === "Total";
                isApproximate = isApproximate && odds > 0;
                if (isTotal) key = "Total Pokémon";
                else odds = (odds * 100).toFixed(1).replace(".0", "");
                const result = [
                    {b: key + ":"},
                    {text: (isApproximate && !isTotal ? " ~" : " ") + odds + (isTotal ? "" : "%")}
                ]
                return result;
            }
            api.runtime.sendMessage({ function: "simulate", args: { type, currentTeamNumbers, isDitto, pokemons, simulations } }, function (result) {
                let output = Object.keys(result.odds)
                    .map(o => [o, result.odds[o]])
                    .filter(o => type === "pokemon" ? o[1] > 0 : true)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .sort((a, b) => b[1] - a[1])
                    .sort((a, b) => b[0] === "Total" ? -1 : a[0] === "Total" ? 1 : 0)
                    .sort((a, b) => a[0] === "Paralysis" ? -1 : b[0] === "Paralysis" ? 0 : 1)
                    .sort((a, b) => a[0] === "Sleep" ? -1 : b[0] === "Sleep" ? 0 : 1)
                    .map(o => oddsDisplay(o[0], o[1], currentTeamNumbers.length < 5 && simulations == undefined));
                const pokemonNames = safePokemonIds.map(p => consts.pokedex[p].name).join(", ");
                if (safePokemonIds.length < 3) result.simulations = result.simulations || consts.defaultSimulations * 4;
                const title = "Remaining " + (type === "pokemon" ? "Pokémon" : type) + " for a"
                    + (pokemonNames.length > 0 ? " " + pokemonNames : "n empty") + " team"
                    + (result.simulations != undefined ? " (" + result.simulations + " simulations)" : "")
                    + ":"
                const simulateTitle = [
                    {b: title}
                ];
                playUtil.chatOutput(target, [simulateTitle, ...output]);
                void api.runtime.lastError;
            });
        }
    }

    const showMovesets = function (target, value) {
        const args = value.split(" ").map(a => a.toLowerCase());
        const example = [
            {b: "Example:"},
            {code: "/movesets Parasect"}
        ];
        if (args.length === 1 || args[1] === "help") {
            const title = [
                {text: "Use the command "},
                {code: "/movesets"},
                {text: " followed by the name of the Pokémon."}
            ];
            playUtil.chatOutput(target, [title, example]);
        }
        else {
            const pokedexNames = Object.keys(consts.pokedex).map(p => consts.pokedex[p].name);
            const joined = args.slice(1).join(" ");
            const name = util.getMostSimilarString(joined, pokedexNames);
            if (name == undefined) {
                const invalid = [
                    {span: "Invalid Pokémon name.", properties: [{ class: "failure" }]}
                ]
                playUtil.chatOutput(target, [invalid, example]);
            }
            else {
                let pokemon = _pokemons.find(p => p.name === name);
                if (pokemon == undefined) {
                    const pokedexName = Object.keys(consts.pokedex).find(p => consts.pokedex[p].name === name);
                    if (pokedexName == undefined) return;
                    pokemon = { name: name, moveSets: [] };
                }
                const moveSetDisplay = function (moveset) {
                    const moveNames = moveset.moves.map(m => consts.moves[m].name);
                    return [
                        {text: moveNames.join(", ") + ": "},
                        {b: (moveset.percent * 100).toFixed(2) + "%"}
                    ];
                }
                const moveSetsOutput = pokemon.moveSets
                    .sort((a, b) => a.moves.toString().localeCompare(b.moves.toString()))
                    .sort((a, b) => b.percent - a.percent)
                    .map(m => moveSetDisplay(m));
                const movesetsTitle = [
                    {b: "Movesets for " + pokemon.name + ":"}
                ];
                playUtil.chatOutput(target, [movesetsTitle, ...moveSetsOutput]);
            }
        }
    }

    const showMoves = function (target, value) {
        const args = value.split(" ").map(a => a.toLowerCase());
        const example = [
            {b: "Example:"},
            {code: "/moves Slowbro"}
        ];
        if (args.length === 1 || args[1] === "help") {
            const help = [
                {text: "Use the command "},
                {code: "/moves"},
                {text: " followed by the name of the Pokémon."}
            ]
            playUtil.chatOutput(target, [help, example]);
        }
        else {
            const pokedexNames = Object.keys(consts.pokedex).map(p => consts.pokedex[p].name);
            const joined = args.slice(1).join(" ");
            const name = util.getMostSimilarString(joined, pokedexNames);
            if (name == undefined) {
                const invalid = [
                    {span: "Invalid Pokémon name.", properties: [{ class: "failure" }]}
                ]
                playUtil.chatOutput(target, [invalid, example]);
            }
            else {
                let pokemon = _pokemons.find(p => p.name === name);
                if (pokemon == undefined) {
                    const pokedexName = Object.keys(consts.pokedex).find(p => consts.pokedex[p].name === name);
                    if (pokedexName == undefined) return;
                    pokemon = { name: name, moves: [] };
                }
                const moveSetDisplay = function (move) {
                    return [
                        {text: move.name + ": "},
                        {b: (move.probability * 100).toFixed(2) + "%"}
                    ];
                }
                const movesOutput = pokemon.moves
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .sort((a, b) => b.probability - a.probability)
                    .map(m => moveSetDisplay(m));
                const title = [
                    {b: "Moves for " + pokemon.name + ":"}
                ];
                playUtil.chatOutput(target, [title, ...movesOutput]);
            }
        }
    }

    const showWinRate = function (target, value) {
        const args = value.split(" ").map(a => a.toLowerCase());
        const winrateTypes = ["personal", "opponent", "reset"];
        const example = [
            {b: "Example:"},
            {code: "/winrates personal"}
        ]
        if (args.length === 1 || args[1] === "help") {
            const help = [
                {text: "Use the command "},
                {code: "/winrates"},
                {text: " followed by the Pokémon winrate type. "},
                {code: "/winrates reset"},
                {text: " will wipe your Pokémon winrate records."}
            ];
            const validTypes = [
                {text: "Valid winrate types are: "}
            ];
            for (const winrateType of winrateTypes) {
                validTypes.push({i: "\"" + winrateType + "\""});
                if (winrateType !== winrateTypes[winrateTypes.length - 1]) validTypes.push({text: ", "});
                else validTypes.push({text: "."});
            }
            playUtil.chatOutput(target, [help, validTypes, example]);
        }
        else if (!winrateTypes.includes(args[1])) {
            const invalid = [
                {span: "Invalid Pokémon winrate type.", properties: [{ class: "failure" }]},
                {text: " Valid types are: "},
                {i: "\"" + winrateTypes.join("\", \"") + "\""},
                {text: "."}
            ]
            playUtil.chatOutput(target, [invalid, example]);
        }
        else if (args[1] === "reset") {
            const newWinrates = { wins: {}, losses: {}, opponentWins: {}, opponentLosses: {} };
            _winRates = newWinrates;
            util.saveStorage("winRates", newWinrates);
            const reset = [
                {text: "Personal and opponent Pokémon winrates have been reset."}
            ]
            playUtil.chatOutput(target, [reset]);
        }
        else if (args[1] === "personal" || args[1] === "opponent") {
            const isPersonal = args[1] === "personal";
            const title = [
                {b: (isPersonal ? "Personal" : "Opponent") + " winrates:"}
            ]
            const output = [];
            for (const pokemon of _pokemons) {
                if (_winRates.wins == undefined) _winRates = { wins: {}, losses: {}, opponentWins: {}, opponentLosses: {} };
                const wins = (isPersonal ? _winRates.wins[pokemon.number] : _winRates.opponentWins[pokemon.number]) ?? 0;
                const losses = (isPersonal ? _winRates.losses[pokemon.number] : _winRates.opponentLosses[pokemon.number]) ?? 0;
                const percent = wins + losses > 0
                    ? ((wins / (wins + losses)) * 100).toFixed(2) + "%"
                    : "N/A";
                output.push([
                    {b: pokemon.name + ":"},
                    {text: " " + percent + " (" + (wins + losses) + " matches)"}
                ]);
            }
            playUtil.chatOutput(target, [title, ...output]);
        }
    }

    const showRooby = function (target) {
        const elements = [
            [
                {b: "RooBY Commands"}
            ],
            [
                {code: "/unrevealed"},
                {text: " - Calculate the odds of a Pokémon or type appearing in a random battle."}
            ],
            [
                {code: "/movesets"},
                {text: " - Calculate the movesets odds for a Pokémon."}
            ],
            [
                {code: "/moves"},
                {text: " - Calculate the move odds for a Pokémon."}
            ],
            [
                {code: "/winrates"},
                {text: " - Show your winrate with individual Pokémon."}
            ],
            [
                {code: "/export"},
                {text: " - Export the current battle's teams to the "},
                {a: "Showdown Damage Calculator", properties: [
                    { href: "https://calc.pokemonshowdown.com/randoms.html?gen=1&mode=randoms" },
                    { target: "_new" },
                ]},
                {text: "."},
            ],
            [
                {code: "/rooby"},
                {text: " - Show this message."},
            ],
            [
                {text: "Click the "},
                {button: "", properties: [{ class: "icon button" }], children: [
                    {i: "", properties: [{ class: "fa fa-cog" }] },
                ]},
                {text: " Options button on the top right of the page to change RooBY settings."}
            ]
        ];

        playUtil.chatOutput(target, elements);
    }

    const getWinRates = async function() {
        let savedWinRates = await util.getStorage("winRates");
        if (savedWinRates == undefined) savedWinRates = { wins: {}, losses: {}, opponentWins: {}, opponentLosses: {} };
        else savedWinRates = savedWinRates.winRates;
        _winRates = savedWinRates;
        return savedWinRates;
    }

    const saveResult = async function(opponentName, tab, result, pokemons, opponentPokemons) {
        let savedResults = await util.getStorage("results");
        if (savedResults == undefined) savedResults = {};
        else savedResults = savedResults.results;
        if (savedResults[opponentName] == undefined) savedResults[opponentName] = {};
        if (savedResults[opponentName][tab] == undefined) {
            savedResults[opponentName][tab] = result;
            if (_results[opponentName] == undefined) _results[opponentName] = { wins: 0, draws: 0, losses: 0 };
            if (result === 1) _results[opponentName].wins++;
            else if (result === 0) _results[opponentName].draws++;
            else if (result === -1) _results[opponentName].losses++;
            util.saveStorage("results", savedResults);
            let savedWinRates = await getWinRates();
            for (const pokemon of pokemons) {
                const pokemonNumber = consts.pokedex[pokemon].num;
                if (result === -1) {
                    if (savedWinRates.losses[pokemonNumber] == undefined) savedWinRates.losses[pokemonNumber] = 0;
                    savedWinRates.losses[pokemonNumber]++;
                }
                else if (result === 1) {
                    if (savedWinRates.wins[pokemonNumber] == undefined) savedWinRates.wins[pokemonNumber] = 0;
                    savedWinRates.wins[pokemonNumber]++;
                }
            }
            for (const pokemon of opponentPokemons) {
                const pokemonNumber = consts.pokedex[pokemon].num;
                if (result === 1) {
                    if (savedWinRates.opponentLosses[pokemonNumber] == undefined) savedWinRates.opponentLosses[pokemonNumber] = 0;
                    savedWinRates.opponentLosses[pokemonNumber]++;
                }
                else if (result === -1) {
                    if (savedWinRates.opponentWins[pokemonNumber] == undefined) savedWinRates.opponentWins[pokemonNumber] = 0;
                    savedWinRates.opponentWins[pokemonNumber]++;
                }
            }
            _winRates = savedWinRates;
            util.saveStorage("winRates", savedWinRates);
        }
    }

    const getResults = async function(opponentName) {
        let savedResults = await util.getStorage("results");
        if (savedResults == undefined) savedResults = {};
        else savedResults = savedResults.results;
        if (savedResults[opponentName] != undefined) {
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
                output += trainerName + " (" + pokemon.name + ")\n";
                output += "Level: " + pokemon.level + "\n";
                for (const move of pokemon.moves) {
                    output += "- " + move + "\n";
                }
            }
            return output;
        }

        const target = document.querySelector("[data-uid=\"" + uid + "\"]");
        target.removeAttribute("data-uid");
        const teams = [];
        const trainerNames = [];
        const currents = [];
        for (let i = 0; i < teamInfos.length; i++) {
            teams[i] = [];
            const trainer = target.closest(".ps-room").querySelectorAll(".trainer")[i];
            trainerNames[i] = trainer.querySelector("strong").innerText.replace(/\s/g, '');
            const picons = Array.from(trainer.querySelectorAll(".picon"));
            const currentPicon = picons.find(p => p.getAttribute("aria-label").includes("(active)"));
            const currentName = currentPicon ? currentPicon.getAttribute("aria-label").split(" (active)")[0] : null;
            currents.push(currentName);
            for (const memberInfo of teamInfos[i]) {
                const pokemon = _pokemons.find(p => p.name === memberInfo.name);
                const revealedMoves = pokemon.moves.filter(m => memberInfo.moves.includes(m.name));
                const unrevealedMoves = roobyCalc
                    .unrevealedMoves(pokemon, revealedMoves);
                const filteredUnrevealedMoves = unrevealedMoves == undefined
                    ? []
                    : unrevealedMoves
                    .filter(um => !revealedMoves.some(rm => rm.name === um.name))
                    .sort((a, b) => a.basePower - b.basePower)
                    .sort((a, b) => a.probability - b.probability);
                const moves = revealedMoves.concat(filteredUnrevealedMoves);
                const moveNames = moves.map(m => m.name);
                const member = {
                    name: memberInfo.name,
                    level: memberInfo.level,
                    moves: moveNames.slice(0, 4)
                }
                teams[i].push(member);
            }
        }
        const output = teams.map((t, i) => exportTeam(t, trainerNames[i])).join("\n\n");
        const encodedUri = encodeURI(btoa(output));
        let href = "https://calc.pokemonshowdown.com/randoms.html?gen=1&mode=one-vs-one&import=" + encodedUri;
        for (let i = 0; i < trainerNames.length; i++) {
            if (trainerNames[i]) href += "&t" + (i + 1) + "=" + trainerNames[i];
            if (currents[i]) href += "&p" + (i + 1) + "=" + currents[i];
        }
        const exportedTitle = [
            {text: "Exported teams. "},
            {a: "Click here to import into the Showdown Damage Calculator", properties: [
                { href: href },
                { target: "_new" },
            ]},
            {text: "."}
        ]
        playUtil.chatOutput(target, [exportedTitle]);
    }

    const updateRoobyBattles = function (battles) {
        const battleLogs = document.querySelectorAll(".battle-log");
        for (const battleLog of battleLogs) {
            const tabId = playUtil.getTabIdByRoomElement(battleLog.closest(".ps-room"));
            const battleHasTab = battles.some(b => b.link && b.link.indexOf(tabId) !== -1);
            if (battleHasTab) {
                const small = battleLog.querySelector("small");
                if (small && small.textContent.endsWith(" joined")) {
                    small.setAttribute("data-rooby", "true");
                }
            }
        }
    }

    const showRoobyLadder = function (battles) {
        const mainmenu = document.getElementById("room-").querySelector(".mainmenu");
        if (_settings.roobyMatchmaking === false) return;
        let roobyMenu = mainmenu.querySelector(".rooby-menu");
        if (roobyMenu == undefined) {
            roobyMenu = document.createElement("div");
            mainmenu.children[0].after(roobyMenu);
        }
        roobyMenu.className = "menugroup rooby-menu list";
        let image = roobyMenu.querySelector("img");
        if (image == undefined) {
            image = document.createElement("img");
            image.src = api.runtime.getURL("images/icon-128.png");
            roobyMenu.appendChild(image);
        }
        let roobyMenuTitle = roobyMenu.querySelector("p");
        if (roobyMenuTitle == undefined) {
            roobyMenuTitle = document.createElement("p");
            roobyMenu.appendChild(roobyMenuTitle);
        }
        let roobyTitleLabel = roobyMenuTitle.querySelector("label");
        if (roobyTitleLabel == undefined) {
            roobyTitleLabel = document.createElement("label");
            roobyTitleLabel.className = "label";
            roobyMenuTitle.appendChild(roobyTitleLabel);
        }
        roobyTitleLabel.textContent = battles.length + " RooBY Game(s)";
        let blocklinks = Array.from(roobyMenu.querySelectorAll("a.blocklink"));
        for (let i = 0; i < blocklinks.length; i++) {
            if (!battles.some(b => b.id === blocklinks[i].getAttribute("data-rooby-id"))) {
                blocklinks[i].remove();
            }
        }
        for (const battle of battles) {
            if (_roobyFormats[battle.format] == undefined) continue;
            const now = (new Date())/1000;
            if (battle.link && now - battle.timestamp > 120) continue;
            const loggedInName = document.querySelector(".usernametext")?.innerText.replace(/\s/g, '').toLowerCase();
            if (loggedInName && battle.p1 === loggedInName && !battle.p2) {
                battle.self = true;
            }
            let blocklink = blocklinks.find(bl => bl.getAttribute("data-rooby-id") == battle.id);
            if (blocklink == undefined) {
                const div = document.createElement("div");
                blocklink = document.createElement("a");
                blocklink.className = "blocklink";
                blocklink.setAttribute("data-rooby-id", battle.id);
                div.appendChild(blocklink);
                roobyMenuTitle.after(div);
            }
            if (blocklink.getAttribute("data-rooby-id") == battle.id) {
                let firstSmall = blocklink.querySelector("small");
                if (firstSmall == undefined) {
                    firstSmall = document.createElement("small");
                    blocklink.appendChild(firstSmall);
                }
                if (battle.rating) {
                    firstSmall.textContent = "(rated: " + battle.rating + ")";
                }
                else if (battle.link) {
                    firstSmall.textContent = "Watch";
                }
                else if (battle.self) {
                    firstSmall.textContent = "Cancel";
                }
                else if (!battle.p2) {
                    firstSmall.textContent = "Join";
                }
                else {
                    firstSmall.textContent = "Connecting";
                }
                firstSmall.style = "float: right";
                let secondSmall = firstSmall.nextElementSibling;
                if (secondSmall == undefined) {
                    secondSmall = document.createElement("small");
                    blocklink.appendChild(secondSmall);
                }
                secondSmall.textContent = "[Gen 1] " + _roobyFormats[battle.format].name;
                let br = blocklink.querySelector("br");
                if (br == undefined) {
                    br = document.createElement("br");
                    blocklink.appendChild(br);
                }
                let firstEm = blocklink.querySelector("em");
                if (firstEm == undefined) {
                    firstEm = document.createElement("em");
                    if (battle.p2) firstEm.className = "p1";
                    blocklink.appendChild(firstEm);
                }
                if (!battle.p2 && battle.self) {
                    firstEm.textContent = " Searching...";
                    const spinner = document.createElement("i");
                    spinner.className = "fa fa-refresh fa-spin";
                    firstEm.prepend(spinner);
                }
                else {
                    firstEm.textContent = battle.p1;
                    if (!battle.p2) firstEm.textContent += " (seeking)";
                }
                blocklink.setAttribute("data-rooby-id", battle.id);
                const clone = blocklink.cloneNode(true);
                blocklink.parentNode.replaceChild(clone, blocklink);
                blocklink = clone;
                if (battle.p2) {
                    let thirdSmall = firstEm.nextElementSibling;
                    if (thirdSmall == undefined) {
                        thirdSmall = document.createElement("small");
                        blocklink.appendChild(thirdSmall);
                    }
                    thirdSmall.textContent = "vs.";
                    let secondEm = blocklink.querySelector("em.p2");
                    if (secondEm == undefined) {
                        secondEm = document.createElement("em");
                        secondEm.className = "p2";
                        blocklink.appendChild(secondEm);
                    }
                    secondEm.textContent = battle.p2;
                    blocklink.appendChild(secondEm);
                    blocklink.addEventListener("click", function (e) {
                        const battleId = e.currentTarget.getAttribute("data-rooby-id");
                        const battle = battles.find(b => b.id === battleId);
                        playUtil.joinRoom(battle.link);
                    });
                }
                else if (battle.self) {
                    const spinner = document.createElement("i");
                    spinner.className = "fa fa-refresh fa-spin";
                    firstEm.prepend(spinner);
                    blocklink.addEventListener("click", function (e) {
                        const usernameText = document.querySelector(".usernametext");
                        if (usernameText == undefined) return;
                        const loggedInName = usernameText.innerText.replace(/\s/g,'').toLowerCase();
                        const battleId = e.currentTarget.getAttribute("data-rooby-id");
                        e.currentTarget.style.display = "none";
                        util.requestRooBYLadder(loggedInName, null, battleId, true).then(function (battles) {
                            showRoobyLadder(battles);
                        });
                    });
                }
                else {
                    blocklink.addEventListener("click", function (e) {
                        const usernameText = document.querySelector(".usernametext");
                        if (usernameText == undefined) {
                            playUtil.notify("You must be logged in to join a RooBY battle.");
                            return;
                        };
                        const loggedInName = usernameText.innerText.replace(/\s/g,'').toLowerCase();
                        const battleId = e.currentTarget.getAttribute("data-rooby-id");
                        const battle = battles.find(b => b.id === battleId);
                        const newBattles = battles.filter(b => b.id !== battleId);
                        showRoobyLadder(newBattles);
                        util.requestRooBYLadder(loggedInName, null, battleId).then(function (data) {
                            showRoobyLadder(data.battles);
                            const roomElement = document.getElementById("room-");
                            const tab = playUtil.getTabIdByRoomElement(roomElement);
                            playUtil.challenge(tab, battle.p1, _roobyFormats[battle.format], data.command, battle.id);
                        });
                    });
                }
            }
        }
        const emptyDivs = roobyMenu.querySelectorAll("div:empty");
        for (const emptyDiv of emptyDivs) {
            emptyDiv.remove();
        }
    }

    const settingsPopup = function (element) {
        const avatarButton = element.querySelector("[name='avatars']");
        if (avatarButton == undefined) {
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
                    button.setAttribute("style", "background-image: url(" + api.runtime.getURL("images/sprites/trainers/" + randomType + ".png") + ");")
                    button.classList.add("option", "pixelated", "custom");
                    const animated = randomType === "randomAnimatedTrainer" ? "animated" : "";
                    button.setAttribute("title", "Random " + animated + " per battle");
                    button.addEventListener("click", function () {
                        const sprites = animated.length === 0 ? consts.trainerSprites : consts.animatedTrainerSprites;
                        const randomSprite = sprites[Math.floor(Math.random() * sprites.length)];
                        playUtil.changeAvatar(randomSprite, _settings.animateTrainer);
                        _settings.randomAvatar = animated.length === 0 ? 1 : 2;
                        util.saveStorage("settings", "randomAvatar", _settings.randomAvatar);
                        this.parentElement.parentElement.querySelector("[name=close]").click();
                    });
                    avatarList.prepend(button);
                }
            }
            else if (Array.from(element.childNodes).some(c => c.getAttribute("name") === "formats")) {
                if (element.querySelector(".rooby-mods") || _settings.roobyMatchmaking === false) return;
                const popupmenu = element.querySelector("[name=formats] .popupmenu");
                const details = popupmenu.querySelector("details");
                const detailsClone = details.cloneNode(true);
                detailsClone.classList.add("rooby-mods");
                detailsClone.setAttribute("section", "[Gen 1] RooBY Mods");
                detailsClone.querySelector("strong").textContent = "RooBY Mods [Gen 1]";
                const lis = detailsClone.querySelectorAll("li");
                const roobyFormats = Object.keys(_roobyFormats);
                const searchClick = function(e) {
                    const loggedInName = document.querySelector(".usernametext").innerText.replace(/\s/g,'').toLowerCase();
                    const roobyName = e.currentTarget.closest("form").getAttribute("data-rooby-name");
                    const roobyFormats = Object.keys(_roobyFormats);
                    const format = roobyFormats.find(fk => _roobyFormats[fk].name === roobyName);
                    util.requestRooBYLadder(loggedInName, format).then(function (battles) {
                        const lastBattle = battles[battles.length - 1];
                        lastBattle.self = true;
                        showRoobyLadder(battles);
                    });
                }
                for (const formatKey of roobyFormats) {
                    const format = _roobyFormats[formatKey];
                    const newLi = lis[1].cloneNode(true);
                    const button = newLi.querySelector("button");
                    button.textContent = format.name;
                    button.setAttribute("data-rooby-value", formatKey);
                    button.value = format.command;
                    button.addEventListener("click", function (e) {
                        setTimeout(function () {
                            const battleform = document.getElementById("room-").querySelector("form.battleform");
                            const search = battleform.querySelector("button[name='search']");
                            if (search) {
                                const formatselect = battleform.querySelector("button.formatselect");
                                formatselect.textContent = "[Gen 1] " + e.target.textContent;
                                battleform.setAttribute("data-rooby-name", e.target.textContent);
                                const newSearch = search.cloneNode(true);
                                search.parentNode.replaceChild(newSearch, search);
                                newSearch.addEventListener("click", searchClick);
                            }
                        }, 0);
                        button.click();
                    });
                    detailsClone.appendChild(newLi);
                }
                for (const li of lis) {
                    li.remove();
                }
                const buttons = Array.from(popupmenu.querySelectorAll("button"));
                for (const button of buttons) {
                    button.addEventListener("click", function () {
                        const battleform = document.getElementById("room-").querySelector("form.battleform");
                        battleform.removeAttribute("data-rooby-name");
                    });
                }
                popupmenu.appendChild(detailsClone);
            }
            else if (element.querySelector("p")) {
                if (element.querySelector("p").textContent !== "Error: Your format gen1customgame is not ladderable.") return;
                const battleform = document.getElementById("room-").querySelector("form.battleform");
                const formatselect = battleform.querySelector("button.formatselect");
                element.querySelector("p").textContent = "Error: Your format " + formatselect.textContent + " is not ladderable with Pokemon Showdown. Would you like to try the RooBY ladder? (Note: You must enable spectators to gain Elo)";
                const button = element.querySelector("button");
                button.querySelector("strong").textContent = "Close";
                const roobyButton = button.cloneNode(true);
                roobyButton.querySelector("strong").textContent = "RooBY Ladder";
                roobyButton.setAttribute("data-rooby-name", formatselect.textContent);
                roobyButton.addEventListener("click", function (e) {
                    const loggedInName = document.querySelector(".usernametext").innerText.replace(/\s/g,'').toLowerCase();
                    const roobyName = e.currentTarget.getAttribute("data-rooby-name");
                    const roobyFormats = Object.keys(_roobyFormats);
                    const format = roobyFormats.find(fk => _roobyFormats[fk].name === roobyName);
                    util.requestRooBYLadder(loggedInName, format).then(function (battles) {
                        const lastBattle = battles[battles.length - 1];
                        lastBattle.self = true;
                        showRoobyLadder(battles);
                    });
                });
                button.after(roobyButton);
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
                if (checkbox == undefined) return;
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
                else if (checkbox.name === "roobyMatchmaking") {
                    const menus = document.getElementsByClassName("rooby-menu");
                    for (const menu of menus) {
                        menu.style.display = checkbox.checked ? "block" : "none";
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
            parent.after(playUtil.buildSettingsP("Disable RooBY matchmaking", "roobyMatchmaking", className, null, null, disableFunction, { type: "checkbox", checked: _settings.roobyMatchmaking === false }));
            const strongP = document.createElement("p");
            const strong = document.createElement("strong");
            strong.textContent = "RooBY (Generation 1)";
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
            if (backdropBottom == undefined) {
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
        if (element != null && element.style.backgroundImage != undefined) {
            let backdrop = _settings.backdrop;
            const roomElement = playUtil.getParentRoomElement(element, _page);
            if (roomElement == undefined || roomElement.id.indexOf("-gen1") === -1) return;
            const tab = playUtil.getTabIdByRoomElement(roomElement);
            if (_randomSprites[tab] == undefined) initializeTab(tab);
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
                url = api.runtime.getURL("images/backdrops/" + backdrop);
            }
            element.style = "background-image: url('" + url + "'); display: block; opacity: 0.8;";
        }
    }

    const updateIcons = function (trainer) {
        let iconsPrefix = _settings.sprites.icons || 0;
        if (trainer == undefined) return;
        const roomElement = playUtil.getParentRoomElement(trainer, _page);
        const tab = playUtil.getTabIdByRoomElement(roomElement);
        if (tab == undefined || roomElement.id.indexOf("-gen1") === -1) return;
        if (_randomSprites[tab] == undefined) initializeTab(tab);
        else if (iconsPrefix == 1) iconsPrefix = _randomSprites[tab].icons;
        else if (iconsPrefix == 2) iconsPrefix = _randomDefaultSprites[tab].icons;
        else if (iconsPrefix == 3) {
            if (trainer.classList.contains("trainer-near")) {
                let backSetting = _settings.sprites.back;
                if (_settings.sprites.back == 1) backSetting = _randomSprites[tab].back;
                if (_settings.sprites.back == 2) backSetting = _randomDefaultSprites[tab].back;
                if (backSetting == undefined) return;
                if (backSetting == 0) backSetting = "gen1-back";
                iconsPrefix = consts.spriteSets[backSetting.substring(0, backSetting.length - 5)].icons;
            }
            else if (trainer.classList.contains("trainer-far")) {
                let frontSetting = _settings.sprites.front;
                if (_settings.sprites.front == 1) frontSetting = _randomSprites[tab].front;
                if (_settings.sprites.front == 2) frontSetting = _randomDefaultSprites[tab].front;
                if (frontSetting == undefined) return;
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
                else src += api.runtime.getURL("images/digimon" + srcEnd);
            }
            else if (iconsPrefix === "art") src += api.runtime.getURL("images/" + iconsPrefix + srcEnd);
            else if (iconsPrefix === "gen5") src += api.runtime.getURL("images/" + iconsPrefix + srcEnd);
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
        if (src.indexOf("/sprites/") !== -1 && _settings.sprites["front"] != undefined) {
            let key = "front";
            if (src.indexOf("back") !== -1) {
                key = "back";
            }
            const roomElement = playUtil.getParentRoomElement(element, _page);
            const tab = playUtil.getTabIdByRoomElement(roomElement);
            if (tab == undefined || roomElement.id.indexOf("-gen1") === -1) return;
            if (_randomSprites[tab] == undefined) initializeTab(tab);
            const isRight = key !== "back";
            const trainerElement = playUtil.getTrainerElementBySide(roomElement, isRight);
            const trainerName = playUtil.getTrainerNameByElement(trainerElement);

            let urlEnd = src.substring(src.lastIndexOf("/"));
            let spriteSrc;
            if (_settings.sprites[key] == 0) spriteSrc = "gen1" + (key === "back" ? "-back" : "");
            else if (_settings.sprites[key] == 1) spriteSrc = _randomSprites[tab][key];
            else if (_settings.sprites[key] == 2) spriteSrc = _randomDefaultSprites[tab][key];
            else spriteSrc = _settings.sprites[key];
            if (spriteSrc == undefined) return;
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
                    typoedPokemonId = util.replaceIdWithSafeId(pokemonId, consts.pokedex, replaceSpace, typos);
                    urlEnd = "/" + typoedPokemonId + "." + (extension ? extension : "png");
                }
                else if (spriteSrc.indexOf("afd-shiny") !== -1 || spriteSrc.indexOf("afd-back-shiny") !== -1) {
                    const typos = consts.spriteSets[spriteSetName].shinyTypos;
                    typoedPokemonId = util.replaceIdWithSafeId(pokemonId, consts.pokedex, false, typos)
                    urlEnd = "/" + typoedPokemonId + "." + (extension ? extension : "png");
                }
                else if (consts.spriteSets[spriteSetName].custom === true) {
                    urlEnd = api.runtime.getURL("images/sprites/" + spriteSrc + "/" + pokemonId + ".png");
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
        if (tab != undefined && trainerName != undefined && pokemonId != undefined) {
            _levels[tab] = _levels[tab] || {};
            _levels[tab][trainerName] = _levels[tab][trainerName] || {};
            _levels[tab][trainerName][pokemonId] = levels;
        }
        else if (tab != undefined && trainerName != undefined && pokemonId == undefined) {
            _levels[tab] = _levels[tab] || {};
            _levels[tab][trainerName] = levels;
        }
        else if (tab != undefined && trainerName == undefined && pokemonId == undefined) {
            _levels[tab] = levels;
        }
        else if (tab == undefined && trainerName == undefined && pokemonId == undefined) {
            _levels = levels;
        }
    }
})();