(function() {
    window.addEventListener("message", (event) => {
        if (event.origin !== "https://play.pokemonshowdown.com" && event.origin !== "https://replay.pokemonshowdown.com") return;
        if (event.data.function != undefined && !event.data.function.endsWith("Return")) {
            const room = Object.keys(window.app.rooms).map(key => window.app.rooms[key]).find(r => r.id.endsWith(event.data.args.tab));
            event.data.args = runFunc(event, room);
            if (event.data.args == undefined) return;
            event.data.function = event.data.function + "Return";
            event.source.postMessage(event.data, event.origin);
        }
    });

    const runFunc = function(event, room) {
        switch (event.data.function) {
            case "addPopup":
                return addPopup(event, event.data.args);
            case "challenge":
                return challenge(room, event.data.args);
            case "changeAvatar":
                return changeAvatar(room, event.data.args);
            case "closePopup":
                return closePopup();
            case "getPokemonLevels":
                return getPokemonLevels(room, event.data.args);
            case "getPokemonStatsByName":
                return getPokemonStatsByName(room, event.data.args);
            case "exportTeams":
                return exportTeams(room, event.data.args);
            case "getExactHealthByName":
                return getExactHealthByName(room, event.data.args);
            case "joinRoom":
                return joinRoom(event.data.args);
            case "notify":
                return notify(event.data.args);
            case "uploadReplay":
                return uploadReplay(room);
            default:
                return;
        }
    }

    this.uploadReplay = function(room) {
        room.send("/savereplay");
    }

    this.joinRoom = function(args) {
        window.app.joinRoom(args.id);
    }

    this.addPopup = function(event, args) {
        const popup = window.app.addPopup(Popup, {htmlMessage: args.html});
        const buttons = popup.el.querySelectorAll("button.close");
        for (const button of buttons) {
            button.addEventListener("click", (element) => {
                const button = element.target.closest("button") || element.target;
                const popup = element.target.closest(".ps-popup");
                const buttons = popup.querySelectorAll("button.close");
                const buttonIndex = Array.from(buttons).indexOf(button);
                event.data.args = [buttonIndex];
                event.data.function = event.data.function + "Return";
                event.source.postMessage(event.data, event.origin);
                window.app.closePopup();
            });
        }
    }

    this.notify = function(args) {
        window.app.addPopupMessage(args.message);
    }

    this.closePopup = function() {
        window.app.closePopup();
    }

    this.challenge = function(room, args) {
        app.rooms[""].challenge(args.opponent, args.format.command);
        const pmWindow = document.querySelector(".pm-window[data-userid='" + args.opponent + "']");
        const log = pmWindow.querySelector("div[role='log']");
        const hiddenMessage = document.createElement("input");
        hiddenMessage.type = "hidden";
        hiddenMessage.className = "rooby-id";
        hiddenMessage.value = args.roobyId;
        log.appendChild(hiddenMessage);
    }

    this.changeAvatar = function(room, args) {
        window.app.send("/avatar " + args.name, room);
    }

    this.getExactHealthByName = function(room, args) {
        const pokemon = getPokemonFromData(room, args.isRight, args.name);
        if (pokemon == undefined) return;
        const hasExactStats = room.battle.myPokemon != undefined;
        const myPokemon = hasExactStats ? room.battle.myPokemon.find(p => p.name === args.name) : null;
        const healthRemainingPercent = hasExactStats ? myPokemon.hp / myPokemon.maxhp * 100 : pokemon.hp;
        if (args.healthRemainingPercent != Math.ceil(healthRemainingPercent)) return;
        args.exactHealth = hasExactStats ? myPokemon.hp : null;
        return args;
    }

    this.getPokemonLevels = function(room, args) {
        args.pokemons = [];
        for (const isRight of [false, true]) {
            const pokemons = getPokemonFromData(room, isRight);
            for (const pokemon of pokemons) {
                args.pokemons.push({name: pokemon.speciesForme, level: pokemon.level, isRight: isRight});
            }
        }
        return args;
    }

    this.getPokemonStatsByName = function(room, args) {
        const pokemon = getPokemonFromData(room, args.isRight, args.name);
        if (pokemon == undefined) return;
        args.level = pokemon.level;
        if (pokemon.volatiles["transform"] != undefined && !ignoreTransform) {
            args.transformed = {
                name: pokemon.volatiles["transform"][1].name,
                level: pokemon.volatiles["transform"][1].level
            };
        }
        const myPokemon = room.battle.myPokemon != undefined ? room.battle.myPokemon.find(p => p.name === args.pokemonName) : null;
        const hasExactHealth = myPokemon && !args.isRight;
        args.healthRemainingPercent = hasExactHealth ? myPokemon.hp / myPokemon.maxhp * 100 : pokemon.hp;
        args.exactHealth = hasExactHealth ? myPokemon.hp : null;
        return args;
    }

    this.exportTeams = function(room, args) {
        args.teams = [];
        for (const isRight of [false, true]) {
            const pokemons = getPokemonFromData(room, isRight);
            isRight ? args.teams[1] = [] : args.teams[0] = [];
            for (const pokemon of pokemons) {
                const moves = pokemon.moveTrack.map(m => m[0]);
                (isRight ? args.teams[1] : args.teams[0]).push({
                    name: pokemon.name,
                    level: pokemon.level,
                    moves: moves,
                });
            }
        }
        return args;
    }

    const getPokemonFromData = function(room, isRight, pokemonName) {
        const side = room.battle[isRight ? "farSide" : "nearSide"];
        const pokemon = pokemonName != undefined
            ? side.pokemon.find(p => p.name === pokemonName)
            : side.pokemon;
        return pokemon;
    }
})();