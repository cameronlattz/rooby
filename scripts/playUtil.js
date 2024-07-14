
const playUtil = function () {
    const buildSettingsP = function (labelText, labelName, labelClassName, options, selectedValue, event, attributes) {
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

    const chatOutput = function (inputElement, message, className) {
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

    const getActivePokemonId = function (trainerElement) {
        const labelSpan = Array.from(trainerElement.querySelectorAll(".picon.has-tooltip"))
            .find(span => span.getAttribute("aria-label").endsWith("(active)"));
        if (labelSpan == void 0) return;
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
        if (trainerStatElement == void 0) return false;
        return Array.from(trainerStatElement.querySelectorAll("span")).some(e => e.innerText === "Transformed");
    }

    const getLevelFromStatElement = function (statElement) {
        const levelSmall = Array.from(statElement.querySelectorAll("small")).find(s => s.innerHTML.charAt(0) === "L");
        return levelSmall != void 0 && levelSmall.innerHTML != void 0
            ? Number.parseInt(levelSmall.innerHTML.substring(1))
            : 100;
    }

    const getParentRoomElement = function (element, page) {
        return page === "play"
            ? element.closest(".ps-room-opaque")
            : document.querySelector(".battle").parentElement;
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
        const nickedPokemon = possibleNickedNameElementHtmls.map(h => pokemons.find(p => p.name === h)).find(p => p != void 0);
        const tooltipPokemonName = nickedPokemon != void 0
            ? nickedPokemon.name
            : h2.childNodes[0].nodeValue.trim();
        return tooltipPokemonName;
    }

    const getPokemonIdByName = function (pokemonName) {
        const pokedexMons = Object.keys(consts.pokedex).map(k => { const dexEntry = consts.pokedex[k]; dexEntry.id = k; return dexEntry; });
        const pokemon = pokedexMons.find(p => p.name === pokemonName);
        return pokemon != void 0 ? pokemon.id : null;
    }

    const getPokemonLevelById = function (levels, timeoutIds, tab, trainerName, pokemonId, isRight) {

        const getLevels = function (levels, tab, trainerName, pokemonId) {
            if (!!levels[tab] && !!levels[tab][trainerName] && !!levels[tab][trainerName][pokemonId]) {
                return levels[tab][trainerName][pokemonId];
            }
            else if (!!levels[tab] && !!levels[tab][trainerName] && pokemonId == void 0) {
                return levels[tab][trainerName];
            }
            else if (!!levels[tab] && trainerName == void 0 && pokemonId == void 0) {
                return levels[tab];
            }
            else if (tab == void 0 && trainerName == void 0 && pokemonId == void 0) {
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
        if (level != void 0) return level;
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
        getActivePokemonId,
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
        getStatElementBySide
    }
}();