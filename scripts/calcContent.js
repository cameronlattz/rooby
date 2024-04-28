(function() {
    "use strict";
    const getGen = function() {
        const inputs = Array.from(document.querySelector(".genSelection").querySelectorAll("input"));
        const checkedInput = inputs.find(i => i.checked);
        return checkedInput.value;
    }

    const elementInserted = function(e) {
        if (getGen() != 1) return;
        if (e.nodeName === "#text" && e.data != void 0 && e.parentElement != void 0) {
            if (e.parentElement.closest(".select2-chosen")) {
                if (!e.parentElement.closest(".set-selector")) return;
                const classLetter = e.parentNode.closest("fieldset").id === "p1" ? "L" : "R";
                const button = document.querySelector("#selectTransformInstruction" + classLetter);
                if (e.parentNode.innerHTML.indexOf(consts.transformedIntoString) === -1) {
                    delete button.oldName;
                    delete button.oldMoves;
                    delete button.oldHp;
                    delete button.oldLevel;
                    button.checked = false;
                }
            }
            else if (e.parentElement.closest(".move-result-subgroup") && e.parentNode.nodeName === "LABEL") {
                const forAttribute = e.parentElement.getAttribute("for");
                const isRight = forAttribute.substring(forAttribute.length-2, forAttribute.length-1) === "R";
                const selector = "#p" + (isRight ? "2" : "1");
                const nameHtml = document.querySelector(selector + " .select2-chosen").innerHTML;
                const opponentSelector = "#p" + (isRight ? "1" : "2");
                const opposingNameHtml = document.querySelector(opponentSelector + " .select2-chosen").innerHTML;
                if (nameHtml.indexOf(consts.transformedIntoString) === -1 && opposingNameHtml.indexOf(consts.transformedIntoString) === -1) return;
                const moveIndex = forAttribute.substring(forAttribute.length - 1);
                const moveContainer = document.querySelector(selector + " .move" + moveIndex);
                const isCrit = moveContainer.querySelector(".move-crit").checked;
                const result = calculateDamage(moveContainer, isRight, isCrit);
                const textNode = e.parentNode.parentNode.querySelector("span").childNodes[0];
                const mainSpan = e.parentElement.closest("body").querySelector("#mainResult");
                const button = e.parentNode.previousElementSibling;
                if (button.checked) {
                    mainSpan.innerHTML = mainSpan.innerHTML.substring(0, mainSpan.innerHTML.indexOf(":") + 2) + result.range[0];
                    if (result.range.length > 1) mainSpan.innerHTML += "-" + result.range[result.range.length-1];
                    mainSpan.innerHTML += " (" + (result.minDamage*100).toFixed(1) + " - " + (result.maxDamage*100).toFixed(1) + "%) -- ";
                    if (result.hkoPercentage == 1) mainSpan.innerHTML += "guaranteed ";
                    else mainSpan.innerHTML += (result.hkoPercentage*100).toFixed(1) + "% chance to ";
                    if (result.hkoMultiple == 1) mainSpan.innerHTML += "OHKO";
                    else mainSpan.innerHTML += result.hkoMultiple + "HKO";
                }
                textNode.nodeValue = isNaN(result.minDamage)
                    ? "0 - 0%"
                    : (result.minDamage*100).toFixed(1) + " - " + (result.maxDamage*100).toFixed(1) + "%";
            }
        }
    };

    (function() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                const nodes = Array.prototype.slice.call(mutation.addedNodes);
                nodes.forEach(function(node) {
                    elementInserted(node);
                });
            });
        });
        observer.observe(document, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false,
        });
        const transformedIntoString = "Transform into Pokémon ";
        const hiddenId = "selectTransformInstruction";
        const fieldInfo = document.querySelector("[aria-label=\"Field information\"]");
        const transformInfo = fieldInfo.cloneNode(true);
        transformInfo.id = "transformInfo";
        transformInfo.setAttribute("aria-label", "Transform information");
        transformInfo.querySelector("legend").innerText = "Transform";
        const leechSeedRow = transformInfo.querySelector("#selectLeechSeedInstruction").closest("tr");
        Array.from(document.querySelectorAll(".gen")).forEach(input => {
            input.addEventListener("change", function(e) {
                const transformInfo = document.querySelector("#transformInfo");
                transformInfo.style.display = e.target.value === "1" ? "unset" : "none";
            });
        });
        Array.from(transformInfo.querySelectorAll("tr")).forEach(tr => {
            if (tr !== leechSeedRow) tr.remove();
        });
        Array.from(transformInfo.querySelector("fieldset").childNodes).forEach(fs => {
           if (fs.nodeName !== "LEGEND" && fs.nodeName !== "TABLE") fs.remove();
        });
        const classDivs = Array.from(leechSeedRow.querySelectorAll("div[class]"));
        let pokemonNumber = 2;
        for (const classDiv of classDivs) {
            classDiv.title = transformedIntoString + pokemonNumber;
            const classLetter = util.capitalizeFirstLetter(classDiv.classList[0])[0];
            const input = classDiv.querySelector("input");
            const hiddenDiv = classDiv.querySelector("div[hidden]");
            if (hiddenDiv != void 0) {
                hiddenDiv.id = hiddenId;
                hiddenDiv.innerHTML = transformedIntoString + pokemonNumber;
            }
            input.id = hiddenId + classLetter;
            input.setAttribute("aria-describedby", hiddenId);
            input.setAttribute("aria-described-by", hiddenId);
            input.transformNumber = pokemonNumber === 2 ? 1 : 2;
            input.addEventListener("click", function(e) {
                onTransformClick(e.target);
            });
            const label = classDiv.querySelector("label");
            label.htmlFor = input.id;
            label.innerHTML = "Transform";
            pokemonNumber--;
        }
        transformInfo.style.display = getGen() === "1" ? "unset" : "none";
        fieldInfo.before(transformInfo);
        const critButtons = document.querySelectorAll("input.move-crit");
        for (const critButton of critButtons) {
            critButton.addEventListener("click", function(e) { onCritClick(e.target); });
        }
    })();

    const calculateDamage = function(moveDiv, isRight, isCrit) {
        const selector = "#p" + (isRight ? "2" : "1");
        const opponentSelector = "#p" + (isRight ? "1" : "2");
        const name = document.querySelector(selector + " .select2-chosen").innerHTML;
        const pokemonLevel = Number.parseInt(document.querySelector(selector + " input.level").value);
        const exactHealth = Number.parseInt(document.querySelector(selector + " input.current-hp").value);
        const healthRemainingPercent = Number.parseInt(document.querySelector(selector + " input.percent-hp").value);
        const opponentPokemonLevel = Number.parseInt(document.querySelector(opponentSelector + " input.level").value);
        const opponentPokemonRemainingHealth = Number.parseInt(document.querySelector(opponentSelector + " input.percent-hp").value);
        const pokemon = getPokemonByName(name, pokemonLevel);
        const opponentName = document.querySelector(opponentSelector + " .select2-chosen").innerHTML;
        const opponentPokemon = getPokemonByName(opponentName, opponentPokemonLevel);
        const moveName = moveDiv.querySelector("select.move-selector").value;
        const moveBp = Number.parseInt(moveDiv.querySelector("input.move-bp").value);
        const transformInputs = document.querySelectorAll("#transformInfo input.calc-trigger");
        const transformInput = transformInputs[!isRight ? 0 : 1];
        const opposingTransformInput = transformInputs[isRight ? 0 : 1];
        pokemon.exactHealth = exactHealth;
        pokemon.healthRemainingPercent = healthRemainingPercent;
        pokemon.transformedId = transformInput.transformedId;
        pokemon.transformedLevel = transformInput.transformedLevel;
        opponentPokemon.healthRemainingPercent = opponentPokemonRemainingHealth;
        opponentPokemon.transformedId = opposingTransformInput.transformedId;
        opponentPokemon.transformedLevel = opposingTransformInput.transformedLevel;
        const result = roobyCalc.damage(pokemon, opponentPokemon, moveName, moveBp, isCrit);
        return result;
    };

    const getPokemonByName = function(name, level, ignoreDitto) {
        if (ignoreDitto && name.indexOf(consts.transformedIntoString) !== -1) {
            name = name.substring(name.indexOf(consts.transformedIntoString) + consts.transformedIntoString.length, name.indexOf(")"));
        }
        else if (name.indexOf(" ") !== -1) {
            name = name.substring(0, name.indexOf(" "));
        }
        const pokemonId = Object.keys(consts.pokedex).find(i => consts.pokedex[i].name === name);
        const pokemon = consts.pokedex[pokemonId];
        pokemon.id = pokemonId;
        if (level != void 0) pokemon.level = level;
        return pokemon;
    };

    const onCritClick = function(button) {
        if (document.querySelector(".gen").value !== "1") return;
        const moveNumber = button.id.substring(4);
        const isRight = moveNumber.substring(0, 1) === "R";
        const opponentSelector = "#p" + (isRight ? "1" : "2");
        const opposingNameHtml = document.querySelector(opponentSelector + " .select2-chosen").innerHTML;
        if (opposingNameHtml.indexOf(consts.transformedIntoString) === -1) return;
        const resultSpan = document.querySelector("#resultMove" + moveNumber).parentElement.querySelector("span");
        if (button.checked) {
            resultSpan.oldText = resultSpan.innerHTML;
            const result = calculateDamage(button.parentElement, isRight);
            setTimeout(function() {
                resultSpan.innerHTML = (result.critMinDamage*100).toFixed(1) + " - " + (result.critMaxDamage*100).toFixed(1) + "%";
            }, 1);
        }
        else {
            resultSpan.innerHTML = resultSpan.oldText;
        }
    };

    const onTransformClick = function(button) {
        if (document.querySelector(".gen").value !== "1") return;
        const index = button.transformNumber - 1;
        const setSelector = document.querySelectorAll("div.set-selector")[index];
        const setInput = setSelector.parentElement.querySelector("input.set-selector");
        const moves = setSelector.parentElement.querySelectorAll("select.move-selector");
        if (button.checked) {
            const nameSpan = setSelector.querySelector(".select2-chosen");
            const name = nameSpan.innerHTML;
            if (name.indexOf(consts.transformedIntoString) === -1) {
                const otherIndex = index == 0 ? 1 : 0;
                const otherSetSelector = document.querySelectorAll("div.set-selector")[otherIndex];
                const otherName = otherSetSelector.querySelector(".select2-chosen").innerHTML;
                const infoGroups = setSelector.parentElement.querySelectorAll(".info-group");
                const boosts = infoGroups[1].querySelectorAll(".boost");
                const otherInfoGroups = otherSetSelector.parentElement.querySelectorAll(".info-group");
                const otherBoosts = Array.from(otherInfoGroups[1].querySelectorAll(".boost")).map(e => e.value);
                const otherMoves = Array.from(otherSetSelector.parentElement.querySelectorAll("select.move-selector")).map(e => e.value);
                button.oldName = name;
                button.oldMoves = Array.from(moves).map(e => e.value);
                button.oldHp = setSelector.parentElement.querySelector(".hp input.base").value;
                button.oldLevel = setSelector.parentElement.querySelector("input.level").value;
                const opposingName = otherName.substring(0, otherName.indexOf(" "));
                button.transformedId = Object.keys(consts.pokedex).find(p => consts.pokedex[p].name === opposingName);
                button.transformedLevel = Number.parseInt(otherSetSelector.parentElement.querySelector("input.level").value);
                const setInput = setSelector.parentElement.querySelector("input.set-selector");
                setInput.value = otherName;
                setSelector.parentElement.querySelector("input.level").value = otherSetSelector.parentElement.querySelector("input.level").value;
                setInput.dispatchEvent(new Event("change", { "bubbles": false }));
                setSelector.parentElement.querySelector("input.level").value = button.oldLevel;
                setSelector.parentElement.querySelector(".hp input.base").value = button.oldHp;
                for (let i = 0; i < boosts.length; i++) {
                    boosts[i].value = otherBoosts[i];
                    boosts[i].dispatchEvent(new Event("change", { "bubbles": true }));
                }
                for (let i = 0; i < moves.length; i++) {
                    moves[i].value = otherMoves[i];
                    moves[i].dispatchEvent(new Event("change", { "bubbles": true }));
                }
                const spaceIndex = name.indexOf(" ");
                const otherSpaceIndex = otherName.indexOf(" ");
                const newName = name.substring(0, spaceIndex + 1) + consts.transformedIntoString + otherName.substring(0, otherSpaceIndex) + ")" + name.substring(spaceIndex);
                setInput.value = name; 
                setSelector.querySelector(".select2-chosen").innerHTML = newName;
                setTimeout(function() { 
                    setSelector.parentElement.querySelector("span.totalMod").innerHTML = otherSetSelector.parentElement.querySelector("span.totalMod").innerHTML;
                }, 0);
            }
            else {
                setInput.value = name.substring(0, name.indexOf(consts.transformedIntoString)) + name.substring(name.indexOf(") (") + 1);
                setInput.dispatchEvent(new Event("change", { "bubbles": true }));
                setSelector.querySelector(".select2-chosen").innerHTML = setInput.value;
            }
        }
        else {
            setInput.value = button.oldName;
            setInput.dispatchEvent(new Event("change", { "bubbles": true }));
            setSelector.querySelector(".select2-chosen").innerHTML = setInput.value;
            if (!!button.oldMoves) for (let i = 0; i < button.oldMoves.length; i++) {
                moves[i].value = button.oldMoves[i];
                moves[i].dispatchEvent(new Event("change", { "bubbles": true }));
            }
        }
    };
})();