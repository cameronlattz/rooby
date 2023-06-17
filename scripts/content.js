(function() {
  const sprites = {};
  let backdrop;
  const doc = document;
  doc.addEventListener("DOMNodeInserted", (event) => {
    const element = event.target;
    if (element.classList != void 0) {
      if (element.classList.contains("tooltipinner")) {
        tooltipCalculations(element);
      }
      else if (element.classList.contains("ps-popup")) {
        settingsPopup(element);
      }
      else if (Object.keys(sprites).length !== 0 && element.hasAttribute("src")) {
        updateSprite(element);
        updateBackdrop(element);
      }
    }
  });
  doc.addEventListener("mouseover", (event) => {
    const element = event.target;
    if (element.getAttribute("title") === "Not revealed") {
      const trainer = element.parentNode.parentNode;
      const opposingTrainer = trainer.classList.contains("trainer-near") ? document.querySelector(".trainer-far") : document.querySelector(".trainer-near");
      const revealedPokemon = Array.from(trainer.querySelectorAll(".teamicons")).map(node => Array.from(node.querySelectorAll(".has-tooltip"))).flat().map(node => node.getAttribute("aria-label").split("(")[0].trim());
      const hasDitto = Array.from(opposingTrainer.querySelectorAll(".teamicons")).map(node => Array.from(node.querySelectorAll(".has-tooltip"))).flat().map(node => node.getAttribute("aria-label").split("(")[0].trim()).some(name => name === "Ditto");
 
      const unrevealedTypes = calc.unrevealedTypes(revealedPokemon, hasDitto);
      var html = "<h2>Unrevealed Pokemon:</h2><p>";
      for (const typeProbability of unrevealedTypes) {
        html += "&nbsp;• " + util.capitalizeFirstLetter(typeProbability.type) + ": " + (typeProbability.probability*100).toFixed(0) + "%</br>";
      }
      html += "</p>";

      const tooltip = util.battleTooltips;
      tooltip.showTooltip(html, element);
      element.removeAttribute("title");
      element.addEventListener("mouseout", function(event) {
        tooltip.hideTooltip(event.target);
        element.setAttribute("title", "Not revealed");
      });
    }
  });

  const tooltipCalculations = function(element) {
    const tooltip = element.querySelector(".tooltip-pokemon, .tooltip-activepokemon, .tooltip-move");
    if (tooltip != void 0) {
      let section = element.querySelector(".section");
      if (section == void 0) {
        section = document.createElement("p");
        section.className = "section";
      }
      if (tooltip.classList.contains("tooltip-move")) {
        const moveTag = tooltip.querySelector(".section");
        section = document.createElement("p");
        section.className = "section";
        const damageCalc = calc.damage();
        section.innerHTML += "<div class='calculator'>Damage: " + damageCalc.minDamage + "% - " + damageCalc.maxDamage + "%<br>Crit (" + damageCalc.critRate + "%): " + 
          damageCalc.critMinDamage + "% - " + damageCalc.critMaxDamage + "%<br>" + damageCalc.hkoChance + "% chance to " + damageCalc.hkoMultiple + "HKO</div>";
        moveTag.before(section);
      }
      else {
        tooltip.appendChild(section);
        const tooltipPokemonName = tooltip.querySelector("h2").innerHTML.split("<small>")[0].trim();
        const pokemon = consts.pokemons.find(p => p.name == tooltipPokemonName);
        const clickedMoves = pokemon.moves.filter(move => section.innerHTML.indexOf(move.name + " ") !== -1);
        const unrevealedMoves = calc.unrevealedMoves(pokemon, clickedMoves);
        for (const move of unrevealedMoves) {
          section.innerHTML += "<div class='calculator'>• " + move.name + " <small>" + move.probability + "%</small></div>";
        }
      }
    }
  }

  const settingsPopup = function(element) {
    const avatarButton = element.querySelector("[name='avatars']");
    const extensionAvatarButton = avatarButton.parentNode.parentNode.querySelector(".extension-avatar");
    if (extensionAvatarButton == void 0) {
      const avatarsP = document.createElement("p");
      const disableCustomAvatarsCheckbox = document.createElement("input");
      disableCustomAvatarsCheckbox.setAttribute("type", "checkbox");
      const disableCustomAvatarsLabel = document.createElement("label");
      disableCustomAvatarsLabel.className = "optlabel";
      disableCustomAvatarsLabel.appendChild(disableCustomAvatarsCheckbox);
      avatarsP.appendChild(disableCustomAvatarsLabel);
      disableCustomAvatarsLabel.innerHTML += " Disable opponent custom avatars";
      avatarButton.parentNode.after(avatarsP);
      const button = document.createElement("button");
      button.innerHTML = "Change custom avatar";
      button.className = "extension-avatar";
      button.addEventListener("click", function() {
        const url = window.prompt("Please enter a URL to your new custom avatar:");
        const name = sprite.parentNode.childNodes[1].innerHTML;
        saveAvatar(name, url);
        updateAvatars(url);
      });
      const p = document.createElement("p");
      p.appendChild(button);
      avatarButton.parentNode.after(p);
    }
    if (element.querySelectorAll(".sprite-selector").length === 0) {
      const noPastGensCheckbox = document.querySelector("[name='nopastgens']");
      const className = noPastGensCheckbox.parentNode.className;
      const parent = noPastGensCheckbox.parentNode.parentNode;

      const randomFunction = function(e) {
        window.alert("random");
      }

      const backdropFunction = function(e) {
        backdrop = e.target.value;
        updateBackdrop(document.querySelector(".backdrop"));
      };

      const iconFunction = function(e) {
        
      }
      
      parent.after(pBuilder("Random shiny percentage", "shiny_percentage", className, null, randomFunction, { type: "number", max: 100, min: 0}));
      parent.after(pBuilder("Backdrop", "backdrop", className, consts.backdrops, backdropFunction));
      parent.after(pBuilder("Icon sprites", "icon", className, consts.icons, iconFunction));
      
      for (const key of ["shiny", "back", "front"]) {
        const noPastGensCheckbox = document.querySelector("[name='nopastgens']");
        const options = [];
        for (const spriteSet in util.filterObject(consts.spriteSets, ss => ss[key] === true)) {
          options.push({ text: spriteSet, value: spriteSet + (key === "back" || key === "shiny" ? "-" + key : "")});
        }
        const func = function(e) {
          changeSprites(e.target.value, e.target.getAttribute("name"));
        };
        const p = pBuilder(util.capitalizeFirstLetter(key) + " sprites", key, className + " sprite-selector", options, func);
        noPastGensCheckbox.parentNode.parentNode.after(p);
      }
    }
    document.querySelector("[name='nopastgens']").addEventListener("change", function(e) {
      if (e.target.checked === true) {
        changeSprites();
      }
    })
  }

  const pBuilder = function(labelText, labelName, labelClassName, options, event, attributes) {
    const p = document.createElement("p");
    const label = document.createElement("label");
    label.className = labelClassName;
    label.innerHTML = labelText + ": ";
    const input = attributes == void 0 ? document.createElement("select") : document.createElement("input");
    if (attributes != void 0) {
      for (const attribute in attributes) {
        input.setAttribute(attribute, attributes[attribute]);
      }
    }
    input.name = labelName;
    if (attributes == void 0) {
      const defaultOption = document.createElement("option");
      const randomBattleOption = document.createElement("option");
      const randomPokemonOption = document.createElement("option");
      defaultOption.innerHTML = "Default";
      defaultOption.value = "0";
      input.appendChild(defaultOption);
      randomBattleOption.innerHTML = "Random per battle";
      randomBattleOption.value = "1";
      input.appendChild(randomBattleOption);
      randomPokemonOption.innerHTML = "Random per Pokemon";
      randomPokemonOption.value = "2";
      input.appendChild(randomPokemonOption);
      for (const optionObject of options) {
        const option = document.createElement("option");
        if (typeof optionObject === "string" || optionObject instanceof String) {
          option.innerHTML = optionObject;
        }
        else {
          option.innerHTML = optionObject.text;
          option.value = optionObject.value;
        }
        input.appendChild(option);
      }
    }
    input.addEventListener("change", event);
    label.appendChild(input);
    p.appendChild(label);
    return p;
  }

  const updateBackdrop = function(element) {
    if (element.style.backgroundImage != void 0 && element.style.backgroundImage.indexOf("https://play.pokemonshowdown.com/fx/") !== -1) {
      element.style = "background-image: url('https://play.pokemonshowdown.com/fx/" + backdrop + "'); display: block; opacity: 0.8;";
    }
  }

  const updateSprite = function(element) {
    const src = element.getAttribute("src");
    const urlStart = "https://play.pokemonshowdown.com/sprites/";
    if (src.startsWith(urlStart)) {
      let key = "front";
      for (const modifier of ["back-shiny", "shiny", "back"]) {
        if (src.indexOf(modifier) !== -1) {
          key = modifier;
          break;
        }
      }
      let urlEnd = src.substring(src.lastIndexOf("/"));
      urlEnd = urlEnd.substring(0, urlEnd.lastIndexOf(".") + 1) + (sprites.extension != void 0 ? sprites.extension : "png");
      element.setAttribute("src", urlStart + (sprites.directory ? sprites.directory : sprites[key]) + urlEnd);
    }
  }

  const updateAvatars = function(url) {
    const sprite = element.querySelector(".trainersprite");
    sprite.src = url;
  }

  const saveAvatar = function(name, url) {
    console.log("name: " + name + "; url: " + url);
  }

  const changeSprites = function(gen, changedSet) {
    if (gen == void 0) {
      for (const key of ["backdrop", "icon", "shiny", "back", "front"]) {
        psPopup.querySelector("[name=" + key + "]").value = "";
      }
      return;
    }
    if (changedSet === "front") {
      sprites.front = gen;
      const psPopup = document.querySelector(".ps-popup");
      const spriteSet = consts.spriteSets[gen];
      for (const key in spriteSet) {
        if (key !== changedSet) {
          const select = psPopup.querySelector("[name=" + key + "]");
          if (select != void 0 && spriteSet[key] != void 0) {
            select.value = spriteSet[key] === true ? gen + "-" + key : spriteSet[key];
            select.dispatchEvent(new Event("change"));
            sprites[key] = select.value;
          }
          else {
            sprites[key] = spriteSet[key];
          }
        }
      }
    }
    for (const img of Array.from(document.querySelectorAll("img"))) {
      updateSprite(img);
    }
  }
})();