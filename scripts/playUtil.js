
const playUtil = function () {
    const buildSettingsP = function (labelText, labelName, labelClassName, options, selectedValue, event, attributes) {
        const isSelect = attributes == undefined;
        const isCheckbox = !isSelect && attributes.type === "checkbox";
        attributes = attributes || {};
        const p = document.createElement("p");
        const label = document.createElement("label");
        label.className = labelClassName;
        if (!isCheckbox) label.textContent = labelText + ": ";
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
            input.classList.add("button");
            const selectOptions = [];
            if (labelName !== "shiny") {
                const defaultOption = document.createElement("option");
                defaultOption.textContent = "Default";
                defaultOption.value = "0";
                selectOptions.push(defaultOption);
            }
            const randomBattleOption = document.createElement("option");
            randomBattleOption.textContent = "Random per battle";
            randomBattleOption.value = "1";
            selectOptions.push(randomBattleOption);
            const randomBattleNoCustomOption = document.createElement("option");
            randomBattleNoCustomOption.textContent = "Random per battle (no customs)";
            randomBattleNoCustomOption.value = "2";
            selectOptions.push(randomBattleNoCustomOption);
            for (const optionObject of options) {
                const option = document.createElement("option");
                if (typeof optionObject === "string" || optionObject instanceof String) {
                    option.textContent = optionObject;
                }
                else {
                    option.textContent = optionObject.text;
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
        if (isCheckbox) {
            label.textContent += " " + labelText;
            label.prepend(input);
        }
        else label.appendChild(input);
        p.appendChild(label);
        return p;
    }

    function createElementWithOptions(elementOption) {
        const keys = Object.keys(elementOption);
        const tag = keys[0];
        const element = document.createElement(tag);
        element.textContent = elementOption[tag];
        if (tag === "code") {
            element.addEventListener("click", function () {
                const room = element.closest(".ps-room");
                const textarea = room.querySelector("form.chatbox").querySelector("textarea:not([aria-hidden])");
                textarea.value = element.textContent;
                textarea.setAttribute("data-value", element.textContent);
                textarea.focus();
            });
        }
        if (elementOption.properties) {
            for (const propertyOption of elementOption.properties) {
                const property = Object.keys(propertyOption)[0];
                element.setAttribute(property, propertyOption[property]);
            }
        }
        if (elementOption.children) {
            for (const child of elementOption.children) {
                const childElement = createElementWithOptions(child);
                element.appendChild(childElement);
            }
        }
        return element;
    }

    const chatOutput = function (inputElement, message, className) {
        const chatBox = util.getNearestRelativeElement(inputElement, ".message-log");
        if (chatBox == undefined) return;
        const div = document.createElement("div");
        const classNames = ["rooby-chat"];
        if (className != undefined) classNames.push(className);
        else classNames.push("infobox");
        div.classList.add(...classNames);
        if (typeof message === "string" || message instanceof String) {
            div.textContent = message;
        }
        else {
            for (const group of message) {
                const wrapper = document.createElement("div");
                for (const elementOption of group) {
                    const tag = Object.keys(elementOption)[0];
                    const element = tag === "text"
                        ? document.createTextNode(elementOption[tag])
                        : createElementWithOptions(elementOption);
                    wrapper.appendChild(element);
                }
                div.appendChild(wrapper);
            }
        }
        chatBox.appendChild(div);
        const scrollDiv = document.createElement("div");
        div.after(scrollDiv)
        scrollDiv.scrollIntoView();
        scrollDiv.remove();
    }

    const animateAvatar = function (img, attribute, animateTrainer) {
        const src = img.getAttribute(attribute);
        const parenthesesIndex = src.indexOf("(");
        const pngIndex = src.indexOf(".png");
        const slashIndex = src.lastIndexOf("/") !== -1 ? src.lastIndexOf("/") : src.lastIndexOf("\\");;
        const prefix = parenthesesIndex !== -1 ? src.substring(0, parenthesesIndex + 1) : "";
        const postfix = src.substring(pngIndex + 4, src.length);
        let trainerName = src.substring(slashIndex + 1, pngIndex);
        if (!consts.animatedTrainerSprites.includes(trainerName)) return;
        let url = "https://play.pokemonshowdown.com/sprites/trainers/" + trainerName + ".png";
        if (animateTrainer) {
            const api = chrome || browser;
            url = api.runtime.getURL("images/sprites/trainers/" + trainerName + ".png");
        }
        img.setAttribute(attribute, prefix + url + postfix);
    }

    const uploadReplay = function (tabId) {
        window.postMessage({
            function: "uploadReplay",
            args: {
                tab: tabId
            }
        });
    }

    const challenge = function (room, opponent, format, command, roobyId) {
        if (command) format.command = command;
        window.postMessage({
            function: "challenge",
            args: {
                tab: room,
                opponent: opponent,
                format: format,
                roobyId: roobyId
            }
        });
    }

    const joinRoom = function (room) {
        if (room) window.postMessage({
            function: "joinRoom",
            args: {
                id: room
            }
        });
    }

    const addPopup = function (html) {
        window.postMessage({
            function: "addPopup",
            args: { html }
        });
    }

    const notify = function (message) {
        window.postMessage({
            function: "notify",
            args: { message }
        });
    }

    const closePopup = function () {
        window.postMessage({
            function: "closePopup",
            args: {}
        });
    }

    const changeAvatar = function (name, animateTrainer) {
        setTimeout(function() {
            const pmLogs = Array.from(document.querySelectorAll(".pm-log"));
            for (const pmLog of pmLogs) {
                const chats = pmLog.querySelectorAll(".chat");
                for (const chat of chats) {
                    const img = chat.querySelector("img");
                    if (!img) continue;
                    playUtil.animateAvatar(img, "src", animateTrainer);
                }
            }
        }, 1000);
        window.postMessage({
            function: "changeAvatar",
            args: {
                name: name
            }
        });
    }

    const getActivePokemonId = function (trainerElement) {
        const labelSpan = Array.from(trainerElement.querySelectorAll(".picon.has-tooltip"))
            .find(span => span.getAttribute("aria-label").endsWith("(active)"));
        if (labelSpan == undefined) return;
        const activeIconNameWithoutNick = labelSpan.getAttribute("aria-label").substring(0, labelSpan.getAttribute("aria-label").lastIndexOf(" ("));
        const name = activeIconNameWithoutNick.indexOf("(") !== -1
            ? activeIconNameWithoutNick.substring(activeIconNameWithoutNick.lastIndexOf(" (") + 2, activeIconNameWithoutNick.length - 1)
            : activeIconNameWithoutNick;
        return playUtil.getPokemonIdByName(name);
    }

    const getIsRightByChildElement = function (element) {
        const trainerOrStatElement = element.closest(".trainer, .statbar");
        return ["lstatbar", "trainer-far"].some(c => trainerOrStatElement.classList.contains(c));
    }

    const getIsTransformedByStatElement = function (trainerStatElement) {
        if (trainerStatElement == undefined) return false;
        return Array.from(trainerStatElement.querySelectorAll("span")).some(e => e.innerText === "Transformed");
    }

    const getLevelFromStatElement = function (statElement) {
        const levelSmall = Array.from(statElement.querySelectorAll("small")).find(s => s.innerHTML.charAt(0) === "L");
        return levelSmall != undefined && levelSmall.innerHTML != undefined
            ? Number.parseInt(levelSmall.innerHTML.substring(1))
            : 100;
    }

    const getParentRoomElement = function (element, page) {
        return page === "play"
            ? element.closest(".ps-room-opaque")
            : document.querySelector(".battle").parentElement;
    }

    const getAttackMultiplier = function (roomElement, isRight, maxIndex) {
        if (isRight == undefined) isRight = false;
        const battleLog = roomElement.querySelector(".battle-log");
        if (battleLog == undefined) return;
        let attack = 1;
        let boosts = 0;
        const rightTrainerElement = playUtil.getTrainerElementBySide(roomElement, maxIndex == undefined ? true : isRight);
        const rightTrainerName = playUtil.getTrainerNameByElement(rightTrainerElement, false);
        const battleHistories = Array.from(battleLog.querySelectorAll(".battle-history"));
        if (maxIndex != undefined) battleHistories.splice(maxIndex, battleHistories.length - maxIndex);
        let lastSwitch = battleHistories.findLastIndex(e => e.textContent.startsWith("Go! ") && e.textContent.endsWith("!") && e.querySelector("strong"));
        let lastOpponentSwitch = battleHistories.findLastIndex(e => e.textContent.startsWith(rightTrainerName + " sent out ") && e.textContent.endsWith("!") && e.querySelector("strong"));
        if (isRight) {
            const temp = lastSwitch;
            lastSwitch = lastOpponentSwitch;
            lastOpponentSwitch = temp;
        }
        let burned = false;
        for (let i = Math.min(lastSwitch, lastOpponentSwitch); i < battleHistories.length; i++) {
            const battleHistory = battleHistories[i];
            const text = battleHistory.textContent;
            const correctSide = isRight ? text.startsWith("The opposing ") : !text.startsWith("The opposing ");
            if (i === lastSwitch) {
                attack = 1;
                boosts = 0;
                burned = false;
            }
            else if (text.endsWith("!") && text.indexOf(" used ") !== -1 && battleHistory.querySelector("strong")) {
                const move = text.substring(text.indexOf(" used ") + 6, text.lastIndexOf("!"));
                if (!correctSide) {
                    const boostingMoves = Object.keys(consts.moves).filter(m => !!consts.moves[m].boosts);
                    if (burned && boostingMoves.find(bm => consts.moves[bm].name === move)) {
                        attack = attack / 2;
                    }
                }
            }
            else if (correctSide) {
                if (battleHistory.querySelector("small")) {
                    if (text.endsWith(" was burned!")) {
                        burned = true;
                        attack = attack / 2;
                    }
                    else if (text.endsWith(" was hurt by its burn!")) {
                        burned = true;
                    }
                    else if (text.endsWith(" slept and became healthy!")) {
                        burned = false;
                    }
                    else if (text.endsWith("All STATUS changes are eliminated!")) {
                        attack = 1;
                        boosts = 0;
                    }
                    else if (text.endsWith(" Attack rose!") || text.endsWith(" Attack rose sharply!")) {
                        boosts = boosts + (text.endsWith(" sharply!") ? 2 : 1);
                        attack = boosts > 0 ? (boosts + 2) / 2 : 2 / (2 - boosts);
                    }
                    else if (text.endsWith(" Attack fell!")) {
                        boosts = boosts - 1;
                        attack = boosts > 0 ? (boosts + 2) / 2 : 2 / (2 - boosts);
                    }
                }
                else if (text.indexOf(" transformed into ") !== -1 && maxIndex == undefined) {
                    const transformedAttack = getAttackMultiplier(roomElement, !isRight, i);
                    if (transformedAttack != undefined) {
                        attack = transformedAttack;
                        burned = true;
                    }
                }
            }
            else if (text.endsWith("All STATUS changes are eliminated!")) {
                burned = false;
                attack = 1;
                boosts = 0;
            }
        }
        return burned ? attack : null;
    }

    const getPokemonHealth = function (healthElement, statElement) {
        if (!healthElement) {
            const healthRemainingPercent = Number.parseInt(statElement.querySelector(".hptext").childNodes[0].nodeValue.trim().replace("%", ""));
            return { healthRemainingPercent };
        }
        else {
            const healthText = healthElement.nodeValue;
            const paranthesisIndex = healthText.indexOf("(");
            if (paranthesisIndex !== -1) {
                const fullStats = healthText.substring(paranthesisIndex + 1, healthText.lastIndexOf(")"));
                const healthNumber = Number.parseInt(fullStats.substring(0, fullStats.indexOf("/")));
                const totalNumber = Number.parseInt(fullStats.substring(fullStats.indexOf("/") + 1));
                return {
                    exactHealth: healthNumber,
                    healthRemainingPercent: healthNumber / totalNumber * 100
                }
            }
            else {
                const healthRemainingPercent = Number.parseInt(healthText.trim().replace("%", ""));
                return { healthRemainingPercent };
            }
        }
    }

    const getPokemonNameFromTooltip = function (tooltip, pokemons) {
        const h2 = tooltip.querySelector("h2");
        const possibleNickedNameElementHtmls = Array.from(h2.querySelectorAll("small"))
            .filter(s => s.innerHTML.startsWith("(") && s.innerHTML.endsWith(")"))
            .map(e => e.innerHTML.substring(1, e.innerHTML.length - 1));
        const nickedPokemon = possibleNickedNameElementHtmls.map(h => pokemons.find(p => p.name === h)).find(p => p != undefined);
        const tooltipPokemonName = nickedPokemon != undefined
            ? nickedPokemon.name
            : h2.childNodes[0].nodeValue.trim();
        return tooltipPokemonName;
    }

    const getPokemonIdByName = function (pokemonName) {
        const pokedexMons = Object.keys(consts.pokedex).map(k => { const dexEntry = consts.pokedex[k]; dexEntry.id = k; return dexEntry; });
        const pokemon = pokedexMons.find(p => p.name === pokemonName);
        return pokemon != undefined ? pokemon.id : null;
    }

    const getPokemonLevelById = function (levels, timeoutIds, tab, trainerName, pokemonId, isRight) {

        const getLevels = function (levels, tab, trainerName, pokemonId) {
            if (!!levels[tab] && !!levels[tab][trainerName] && !!levels[tab][trainerName][pokemonId]) {
                return levels[tab][trainerName][pokemonId];
            }
            else if (!!levels[tab] && !!levels[tab][trainerName] && pokemonId == undefined) {
                return levels[tab][trainerName];
            }
            else if (!!levels[tab] && trainerName == undefined && pokemonId == undefined) {
                return levels[tab];
            }
            else if (tab == undefined && trainerName == undefined && pokemonId == undefined) {
                return levels;
            }
        }

        if (tab === "") tab = "replay";
        timeoutIds[tab][trainerName] = util.debounce(function () {
            window.postMessage({
                function: "getPokemonLevels",
                args: {
                    isRight: isRight,
                    tab: tab
                }
            });
        }, 20, timeoutIds[tab][trainerName]);
        const level = getLevels(levels, tab, trainerName, pokemonId);
        if (level != undefined) return level;
    }

    const getRevealedPokemonIds = function (trainerElement) {
        const labelSpans = Array.from(trainerElement.querySelectorAll(".picon.has-tooltip"));
        if (labelSpans.length === 0) return;
        return labelSpans
            .map(l => l.getAttribute("aria-label"))
            .map(n => n.indexOf("(") !== -1 ? n.substring(0, n.lastIndexOf(" (")) : n)
            .map(n => getPokemonIdByName(n));
    }

    const getRoomElementByTabId = function (tabId) {
        return Array.from(document.querySelectorAll(".ps-room")).find(e => e.id.endsWith(tabId));
    }

    const getStatElementBySide = function (roomElement, isRight) {
        return Array.from(roomElement.querySelectorAll(isRight ? ".lstatbar" : ".rstatbar")).find(e => e.style.display !== "none");
    }

    const getTabIdByRoomElement = function (roomElement) {
        return roomElement.id.substring(roomElement.id.lastIndexOf("-") + 1, roomElement.id.length);
    }

    const getTrainerNameByElement = function (trainerElement, removeSpaces = true) {
        return removeSpaces 
            ? trainerElement.querySelector("strong").innerText.replace(/\s/g, '')
            : trainerElement.querySelector("strong").innerText;
    }

    const getTrainerElementByName = function (roomElement, trainerName, getOpponent = false) {
        const trainerElements = roomElement.querySelectorAll(".trainer");
        for (const trainerElement of trainerElements) {
            const tName = getTrainerNameByElement(trainerElement);
            if (!trainerName.localeCompare(tName) !== getOpponent) return trainerElement;
        }
        return null;
    }

    const getTrainerElementBySide = function (roomElement, isRight) {
        return roomElement.querySelector(isRight ? ".trainer-far" : ".trainer-near");
    }

    const getTransformedId = function (trainerElement, statElement) {
        const isTransformed = getIsTransformedByStatElement(statElement);
        if (!isTransformed) return getActivePokemonId(trainerElement);
        const roomElement = trainerElement.closest(".ps-room");
        const transformEntries = Array.from(roomElement.querySelector(".battle-log").querySelectorAll(".battle-history"))
            .map(e => e.innerText)
            .filter(e => e.indexOf("transformed into") !== -1);
        const lastTransformEntry = getIsRightByChildElement(trainerElement)
            ? transformEntries.findLast(e => e.startsWith("The opposing"))
            : transformEntries.findLast(e => !e.startsWith("The opposing"));
        if (lastTransformEntry != undefined) {
            const transformedIntoName = lastTransformEntry.substring(lastTransformEntry.indexOf("transformed into") + 17, lastTransformEntry.length - 2);
            const pokemonId = playUtil.getPokemonIdByName(transformedIntoName);
            return pokemonId;
        }
        return null;
    }

    return {
        addPopup,
        animateAvatar,
        buildSettingsP,
        chatOutput,
        changeAvatar,
        challenge,
        closePopup,
        getActivePokemonId,
        getAttackMultiplier,
        getIsRightByChildElement,
        getIsTransformedByStatElement,
        getLevelFromStatElement,
        getParentRoomElement,
        getPokemonHealth,
        getPokemonIdByName,
        getPokemonLevelById,
        getPokemonNameFromTooltip,
        getRevealedPokemonIds,
        getRoomElementByTabId,
        getTabIdByRoomElement,
        getTrainerElementByName,
        getTrainerElementBySide,
        getTrainerNameByElement,
        getTransformedId,
        getStatElementBySide,
        joinRoom,
        notify,
        uploadReplay
    }
}();