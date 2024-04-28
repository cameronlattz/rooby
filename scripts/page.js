(function() {
    window.addEventListener("message", (event) => {
        if (event.origin !== "https://play.pokemonshowdown.com" && event.origin !== "https://replay.pokemonshowdown.com") return;
        if (event.data.function != void 0 && !event.data.function.endsWith("Return")) {
            const room = Object.keys(window.app.rooms).map(key => window.app.rooms[key]).find(r => r.id.endsWith(event.data.args.tab));
            event.data.args = runFunc(event.data.function, room, event.data.args);
            if (event.data.args == void 0) return;
            event.data.function = event.data.function + "Return";
            event.source.postMessage(event.data, event.origin);
        }
    });

    const runFunc = function(functionName, rooms, args) {
        return eval(functionName)(rooms, args);
    }

    const getExactHealthByName = function(room, args) {
        const pokemon = getPokemonFromData(room, args.isRight, args.name);
        if (pokemon == void 0) return;
        const hasExactStats = room.battle.myPokemon != void 0;
        const myPokemon = hasExactStats ? room.battle.myPokemon.find(p => p.name === args.name) : null;
        args.healthRemainingPercent = hasExactStats ? myPokemon.hp / myPokemon.maxhp * 100 : pokemon.hp;
        args.exactHealth = hasExactStats ? myPokemon.hp : null;
        return args;
    }

    const getPokemonLevels = function(room, args) {
        args.pokemons = [];
        for (const isRight of [false, true]) {
            const pokemons = getPokemonFromData(room, isRight);
            for (const pokemon of pokemons) {
                args.pokemons.push({name: pokemon.speciesForme, level: pokemon.level, isRight: isRight});
            }
        }
        return args;
    }

    const getPokemonStatsByName = function(room, args) {
        const pokemon = getPokemonFromData(room, args.isRight, args.name);
        if (pokemon == void 0) return;
        args.level = pokemon.level;
        if (pokemon.volatiles["transform"] != void 0 && !ignoreTransform) {
            args.transformed = {
                name: pokemon.volatiles["transform"][1].name,
                level: pokemon.volatiles["transform"][1].level
            };
        }
        const myPokemon = room.battle.myPokemon != void 0 ? room.battle.myPokemon.find(p => p.name === args.pokemonName) : null;
        const hasExactHealth = myPokemon && !args.isRight;
        args.healthRemainingPercent = hasExactHealth ? myPokemon.hp / myPokemon.maxhp * 100 : pokemon.hp;
        args.exactHealth = hasExactHealth ? myPokemon.hp : null;
        return args;
    }

    const exportTeams = function(room, args, pokemons) {
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
        const pokemon = pokemonName != void 0
            ? side.pokemon.find(p => p.name === pokemonName)
            : side.pokemon;
        return pokemon;
    }
})();