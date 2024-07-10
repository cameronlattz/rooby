(function() {
    "use strict";
    const {onMessage} = chrome.runtime, {addListener} = onMessage; 
    onMessage.addListener = fn => addListener.call(onMessage, (msg, sender, respond) => {
        const res = fn(msg, sender, respond);
        if (res instanceof Promise) return !!res.then(respond, void 0);
        if (res !== undefined) respond(res);
    });
    onMessage.addListener(
        async function(request, sender, sendResponse) {
            if (request.args != null) {
                if (request.function !== "init" && _pokemons == void 0 && request.args.pokemons != void 0) {
                    await init(request.args.pokemons);
                }
                if (request.function === "calculate" && request.args.currentTeamNumbers !== null && request.args.currentTeamNumbers.length < consts.maxTeamSize) {
                    const odds = await getOdds(request.args, "types", true);
                    const opponentHasDitto = (request.args.opponentPokemonNumbers != void 0 && request.args.opponentPokemonNumbers.includes(_dittoNumber)) || request.args.opponentHasDitto === true;
                    const dittoCurrentTeamNumbers = request.args.currentTeamNumbers + (opponentHasDitto ? "DITTO" : "");
                    sendResponse({currentTeamNumbers: dittoCurrentTeamNumbers, odds: odds});
                }
                else if (request.function === "simulate" && request.args.currentTeamNumbers !== null) {
                    const odds = await getOdds(request.args, request.args.type, false);
                    const opponentHasDitto = (request.args.opponentPokemonNumbers != void 0 && request.args.opponentPokemonNumbers.includes(_dittoNumber)) || request.args.opponentHasDitto === true;
                    const dittoCurrentTeamNumbers = request.args.currentTeamNumbers + (opponentHasDitto ? "DITTO" : "");
                    sendResponse({currentTeamNumbers: dittoCurrentTeamNumbers, odds: odds, simulations: request.args.simulations});
                }
                else if (request.function === "prune" && request.args.saveMonNumbers !== null) {
                    deleteTrees(request.args.saveMonNumbers);
                    await pruneOddsStorage(request.args.saveMonNumbers);
                    sendResponse(true);
                }
                else if (request.function === "init" && request.args.pokemons != null) {
                    _trees = {};
                    await init(request.args.pokemons);
                    const odds = await getOdds(request.args, "types", true);
                    sendResponse(odds);
                }
                else if (request.function === "keepAlive") {
                    sendResponse(true);
                }
            }
        }
    );

    let _pokemons;
    let _trees = {};
    let _odds = {};
    let _lockedNumbers = [];

    let _level100PokemonNumbers;
    let _sleepProbabilityByPokemon;
    let _paralyzeProbabilityByPokemon;
    let _pokemonNameByNumber = {};
    let _pokemonTypesByNumber = {};
    let _pokemonNumbersByTypeWeakness = {};
    let _spammableWeaknessesByPokemon = {};
    let _dittoNumber;

    const consts = chrome.extension.consts;

    const init = async function(pokemons) {
        const saved = saveStorage("pokemons", pokemons);
        pruneOddsStorage([]);
        const capitalizeFirstLetter = function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        _pokemons = pokemons;
        _level100PokemonNumbers = pokemons.filter(p => p.level === 100).map(p => p.number);
        _pokemonNameByNumber = pokemons.reduce((a, p) => ({ ...a, [p.number]: p.name}), {});
        _pokemonTypesByNumber = pokemons.reduce((a, p) => ({ ...a, [p.number]: p.types}), {});
        _pokemonNumbersByTypeWeakness = consts.spammableTypes
            .map(t => capitalizeFirstLetter(t))
            .reduce((a, t) => ({ ...a, [t]: pokemons
                .filter(p => isWeakTo(p.types, t))
                .map(p => p.number)}), {});
        _spammableWeaknessesByPokemon = pokemons
            .reduce((a, p) => ({ ...a, [p.id]: consts.spammableTypes
                .map(t => capitalizeFirstLetter(t))
                .filter(t => isWeakTo(p.types, t))}), {});
        const sleepMoves = Object.keys(consts.moves).filter(m => consts.moves[m].status === "slp");
        _sleepProbabilityByPokemon = pokemons
            .filter(p => p.moves.some(m => sleepMoves.includes(m.id)))
            .reduce((a, p) => ({ ...a, [p.number]: p.moves.filter(m => sleepMoves.includes(m.id))[0].probability}), {});
        const paralyzeMoves = Object.keys(consts.moves).filter(m => consts.moves[m].status === "par");
        _paralyzeProbabilityByPokemon = pokemons
            .filter(p => p.moves.some(m => paralyzeMoves.includes(m.id)))
            .reduce((a, p) => ({ ...a, [p.number]: p.moves.filter(m => paralyzeMoves.includes(m.id))[0].probability}), {});
        _dittoNumber = pokemons.find(p => p.id === "ditto").number;
        await saved;
    }

    const isWeakTo = function(types, type) {
        const weaknesses = types.filter((t) => {
            return consts.typechart[t.toLowerCase()].damageTaken[type.toLowerCase()] === 1;
        });
        const resistances = types.filter((t) => {
            const damageTaken = consts.typechart[t.toLowerCase()].damageTaken[type.toLowerCase()];
            return [2,3].includes(damageTaken);
        });
        return weaknesses.length - resistances.length > 0;
    }

    const getStorage = async (storageKey, key) => {
        let result = await chrome.storage.local.get([storageKey]);
        if (key == void 0) result = result[storageKey];
        else if (result[storageKey] != void 0) result = result[storageKey][key];
        return result;
    }

    const saveStorage = async function(storageKey, arg1, arg2) {
        if (storageKey == void 0 || arg1 == void 0) return false;
        let storageValues = await getStorage(storageKey);
        if (arg2 == void 0) {
            storageValues = arg1;
        }
        else {
            if (storageValues == void 0) storageValues = {};
            storageValues[arg1] = arg2;
        }
        await chrome.storage.local.set({[storageKey]: storageValues});
    }

    const pruneOddsStorage = async function(saveMonNumbers) {
        const allStoredOdds = await getStorage("odds") || {};
        const storedOddsMonNumbers = Object.keys(allStoredOdds);
        const allPossibleSaveMonNumbers = saveMonNumbers.map(smn => smn.map((_, i) => smn.slice(0, i + 1))).flat(1);
        const saveMons = allPossibleSaveMonNumbers.map(smn => smn.sort((a, b) => a - b).join(","));
        const currentTime = Date.now();
        const storedOrSaveMonNumbers = saveMonNumbers.length !== 0
            ? storedOddsMonNumbers.filter(m => saveMons.includes(m))
            : storedOddsMonNumbers.filter(m => allStoredOdds[m].time != void 0 && allStoredOdds[m].time > currentTime - 7200000);
        const newStoredOdds = {};
        for (const monNumbers of storedOrSaveMonNumbers) {
            newStoredOdds[monNumbers] = allStoredOdds[monNumbers];
        }
        const oddsMonNumbers = Object.keys(_odds);
        const deleteMonNumbers = oddsMonNumbers.filter(m => !saveMons.includes(m) && m.startsWith("NONE"));
        for (const monNumbers of deleteMonNumbers) {
            delete _odds[monNumbers];
        }
        await chrome.storage.local.set({"odds": newStoredOdds});
        return true;
    }

    const getPokemons = async function() {
        return _pokemons || await getStorage("pokemons");
    }

    const getStoredOdds = async function(monNumbers) {
        if (_odds[monNumbers] != void 0) {
            return _odds[monNumbers];
        }
        const timedOdds = await getStorage("odds", monNumbers);
        return timedOdds?.odds;
    }

    const saveStoredOdds = async function(monNumbers, odds) {
        const allOdds = await chrome.storage.local.get(["odds"]);
        if (allOdds == void 0) {
            return;
        }
        await saveStorage("odds", monNumbers, {time: Date.now(), odds: odds});
    }

    const getTree = function(monNumbers) {
        return cloneTree(_trees[monNumbers]);
    }

    const saveTree = function(monNumbers, tree) {
        _trees[monNumbers] = tree;
    }

    const deleteTree = function(monNumbers) {
        if (_trees[monNumbers]) delete _trees[monNumbers];
    }

    const deleteTrees = function(saveMonNumbers) {
        const treeMonNumbers = Object.keys(_trees);
        const saveMons = saveMonNumbers.map(smn => smn.sort((a, b) => a - b).join(","));
        const deleteMonNumbers = treeMonNumbers.filter(m => !saveMons.includes(m));
        for (const monNumbers of deleteMonNumbers) {
            deleteTree(monNumbers);
        }
    }

    const cloneTree = function(tree) {
        if (tree == void 0) return tree;
        const clone = (tree) => tree.map(branch => Array.isArray(branch) ? clone(branch) : branch);
        return clone(tree);
    }

    const updateTree = function(tree, currentTeamNumbers, opponentHasDitto) {
        if (Array.isArray(tree[1])) {
            for (const currentTeamNumber of currentTeamNumbers) {
                for (const leaf of tree) {
                    if (currentTeamNumber === leaf[0] || (opponentHasDitto && leaf[0] === _dittoNumber)) {
                        tree = leaf.slice(1);
                    }
                }
            }
        }
        return tree;
    }

    const buildTeamTree = async function(currentTeamNumbers, opponentHasDitto) {
        const treeArray = [];
        const pokemons = (await getPokemons()).filter(p => !currentTeamNumbers.includes(p.number));
        for (let pokemon4 of pokemons) {
            if (!isValid(pokemon4, currentTeamNumbers, opponentHasDitto)) continue;
            const slot4 = [pokemon4.number];
            currentTeamNumbers.push(pokemon4.number);
            for (let pokemon5 of pokemons) {
                if (!isValid(pokemon5, currentTeamNumbers, opponentHasDitto)) continue;
                const slot5 = [pokemon5.number];
                currentTeamNumbers.push(pokemon5.number);
                for (let pokemon6 of pokemons) {
                    if (!isValid(pokemon6, currentTeamNumbers, opponentHasDitto)) continue;
                    slot5.push(pokemon6.number);
                }
                slot4.push(slot5);
                currentTeamNumbers.pop();
            }
            treeArray.push(slot4);
            currentTeamNumbers.pop();
        }
        return treeArray;
    }

    const getOdds = async function(args, type, doSave) {
        const teamNumbers = (args.currentTeamNumbers || []);
        const first3TeamMembers = teamNumbers.slice(0, 3).sort((a, b) => a - b);
        const remainingTeamMembers = teamNumbers.slice(3);
        const currentTeamNumbers = teamNumbers.sort((a, b) => a - b);
        let monNumbers = currentTeamNumbers.join(",");
        const opponentHasDitto = ((args.opponentPokemonNumbers || []).includes(_dittoNumber) || args.hiddenDitto === true) && !currentTeamNumbers.includes(_dittoNumber);
        const storedOddsKey = monNumbers + (opponentHasDitto ? "DITTO" : "");
        let odds = doSave ? await getStoredOdds(storedOddsKey) : {};
        if (odds == void 0 || Object.keys(odds).length === 0 && !_lockedNumbers.includes(currentTeamNumbers)) {
            if (currentTeamNumbers.length >= 5 && args.simulations == void 0) {
                const first3MonNumbers = first3TeamMembers.join(",") + (opponentHasDitto ? "DITTO" : "");
                let tree = getTree(first3MonNumbers);
                const noTree = tree == void 0;
                _lockedNumbers.push(storedOddsKey);
                if (noTree) {
                    tree = await buildTeamTree(first3TeamMembers, opponentHasDitto);
                    if (tree == void 0) return false;
                    if (doSave) saveTree(first3MonNumbers, tree);
                    odds = await buildOdds(tree, type);
                    if (currentTeamNumbers.length !== 3) _odds[first3MonNumbers] = odds;
                }
                if (currentTeamNumbers.length !== 3) {
                    tree = updateTree(tree, remainingTeamMembers, opponentHasDitto);
                }
                if (!noTree || currentTeamNumbers.length !== 3) odds = await buildOdds(tree, type, currentTeamNumbers);
                _odds[storedOddsKey] = odds;
                _lockedNumbers.splice(_lockedNumbers.indexOf(storedOddsKey), 1);
                if (currentTeamNumbers.length >= 5 && doSave) {
                    deleteTree(first3MonNumbers);
                }
            }
            else {
                _lockedNumbers.push(storedOddsKey);
                const simulationCount = args.simulations ?? consts.defaultSimulations*(doSave ? 1 : 4);
                odds = await buildOdds(simulationCount, type, currentTeamNumbers, opponentHasDitto);
                _odds[storedOddsKey] = odds;
                _lockedNumbers.splice(_lockedNumbers.indexOf(currentTeamNumbers), 1);
            }
            if (doSave) await saveStoredOdds(storedOddsKey, odds);
        }
        _odds[storedOddsKey] = odds;
        return odds;
    }

    const buildOdds = async function(treeOrSimulationCount, type, currentTeamNumbers, opponentHasDitto) {
        const odds = {};
        const pokemons = await getPokemons();
        if (pokemons == void 0) return;
        if (type === "pokemon") {
            for (const pokemon of pokemons) {
                odds[pokemon.name] = 0;
            }
        }
        else {
            odds["Sleep"] = 0;
            odds["Paralysis"] = 0;
            if (type === "dual types") {
                const dualTypes = pokemons.map(p => p.types.sort().join("/")).filter((value, index, array) => array.indexOf(value) === index);
                for (const dualType of dualTypes) {
                    odds[dualType] = 0;
                }
            }
            else {
                const types = pokemons.map(p => p.types).flat().filter((value, index, array) => array.indexOf(value) === index);
                for (const type of types) {
                    odds[type] = 0;
                }
            }
        }
        const calculatedOdds = !isNaN(treeOrSimulationCount)
            ? getOddsFromSimulations(treeOrSimulationCount, type, currentTeamNumbers, pokemons, opponentHasDitto)
            : getOddsFromTree(treeOrSimulationCount, type);
        for (const type in calculatedOdds) {
            odds[type] = calculatedOdds[type];
        }
        return odds;
    }

    const getOddsFromTree = function(tree, type) {
        
        const buildTreeOdds = function(tree, type) {
            const addPokemonsToTotal = function(currentPokemonNumbers, newPokemonNumbers, type, odds) {
                for (const newPokemonNumber of newPokemonNumbers) {
                    odds = updateOdds([...currentPokemonNumbers, newPokemonNumber], type, odds);
                }
                return newPokemonNumbers.length;
            }
        
            let teams = 0;
            let odds = {};
            if (Array.isArray(tree[0])) {
                for (const firstBranch of tree) {
                    const firstBranchChildren = firstBranch.slice(1);
                    if (Array.isArray(firstBranchChildren[0])) {
                        for (const secondBranch of firstBranchChildren) {
                            const secondBranchChildren = secondBranch.slice(1);
                            teams += addPokemonsToTotal([firstBranch[0], secondBranch[0]], secondBranchChildren, type, odds);
                        }
                    }
                    else {
                        teams += addPokemonsToTotal([firstBranch[0]], firstBranchChildren, type, odds);
                    }
                }
            }
            else {
                teams += addPokemonsToTotal([], tree, type, odds);
            }
            return {teams, odds};
        }

        let {teams, odds} = buildTreeOdds(tree, type);
        const finalOdds = finalizeOdds(odds, teams, tree.length);
        return finalOdds;
    }

    const getOddsFromSimulations = function(simulationCount, type, currentTeamNumbers = [], pokemons, isDitto) {
        
        const showdownSimulator = function(currentTeamNumbers, pokemons, hasDitto) {
            const pokemonPool = [...pokemons];
            const pokemon = [];
            const initialPokemon = [...currentTeamNumbers];
        
            const rejectedButNotInvalidPool = [];
        
            const typeCount = {};
            const weaknessCount = {Electric: 0, Psychic: 0, Water: 0, Ice: 0, Ground: 0, Fire: 0};
            let numMaxLevelPokemon = 0;
            
            while (pokemonPool.length && pokemon.length < consts.maxTeamSize) { // redo this to use isValid
                let species;
                if (initialPokemon.length > 0) {
                    const speciesNumber = initialPokemon.shift();
                    species = pokemons.find(p => p.number === speciesNumber);
                }
                else {
                    const randomIndex = Math.floor(Math.random()*pokemonPool.length);
                    species = pokemonPool[randomIndex];
                    delete pokemonPool[randomIndex];
                }
                if (species == void 0) continue;
        
                if (species.id === 'ditto' && hasDitto) continue;
        
                const limitFactor = Math.round(consts.maxTeamSize / 6) || 1;
        
                let skip = false;
        
                for (const typeName of species.types) {
                    if (typeCount[typeName] >= 2 * limitFactor) {
                        skip = true;
                        break;
                    }
                }
        
                if (skip) {
                    rejectedButNotInvalidPool.push(species.number);
                    continue;
                }

                if (species.level === 100 && numMaxLevelPokemon >= limitFactor) {
                    rejectedButNotInvalidPool.push(species.number);
                    continue;
                }
        
                const pokemonWeaknesses = [];
                for (const typeName in weaknessCount) {
                    const increaseCount = isWeakTo(species.types, typeName);
                    if (!increaseCount) continue;
                    if (weaknessCount[typeName] >= 2 * limitFactor) {
                        skip = true;
                        break;
                    }
                    pokemonWeaknesses.push(typeName);
                }
        
                if (skip) {
                    rejectedButNotInvalidPool.push(species.number);
                    continue;
                }
        
                pokemon.push(species.number);
        
                for (const typeName of species.types) {
                    if (typeCount[typeName]) {
                        typeCount[typeName]++;
                    } else {
                        typeCount[typeName] = 1;
                    }
                }
        
                for (const weakness of pokemonWeaknesses) {
                    weaknessCount[weakness]++;
                }

                if (species.level === 100) numMaxLevelPokemon++;
        
                if (species.id === 'ditto') hasDitto = true;
            }
        
            while (pokemon.length < consts.maxTeamSize && rejectedButNotInvalidPool.length) {
                const speciesNumber = rejectedButNotInvalidPool[rejectedRandomIndex];
                if (speciesNumber == void 0) continue;
                delete pokemonPool[randomIndex];
                pokemon.push(speciesNumber);
            }
        
            if (pokemon.length < consts.maxTeamSize && pokemon.length < 12) {
                throw new Error("Could not build a random team.");
            }
        
            for (let i = pokemon.length - 1; i >= 0; i--) {
                if (currentTeamNumbers.includes(pokemon[i])) {
                    pokemon.splice(i, 1);
                }
            }
            return pokemon;
        }

        const odds = {};
        let uniquePokemonNumbers = [];
        for (let i = 0; i < simulationCount; i++) {
            const team = showdownSimulator(currentTeamNumbers, pokemons, isDitto === true);
            updateOdds(team, type, odds, uniquePokemonNumbers);
        }
        const finalOdds = finalizeOdds(odds, simulationCount, uniquePokemonNumbers.length);
        return finalOdds;
    }

    const updateOdds = function(team, type, odds, uniquePokemonNumbers) {
        const teamTotal = {};
        if (type === "pokemon") {
            for (const pokemonNumber of team) {
                const pokemonName = _pokemonNameByNumber[pokemonNumber];
                teamTotal[pokemonName] = 1;
                if (uniquePokemonNumbers != void 0 && !uniquePokemonNumbers.includes(pokemonNumber)) {
                    uniquePokemonNumbers.push(pokemonNumber);
                }
            }
        }
        else {
            for (const pokemonNumber of team) {
                if (uniquePokemonNumbers != void 0 && !uniquePokemonNumbers.includes(pokemonNumber)) {
                    uniquePokemonNumbers.push(pokemonNumber);
                }
                const types = _pokemonTypesByNumber[pokemonNumber];
                if (type === "dual types") {
                    const dualType = types.sort().join("/");
                    teamTotal[dualType] = 1;
                }
                else {
                    for (const type of types) {
                        teamTotal[type] = 1;
                    }
                }
                const sleeperOdds = _sleepProbabilityByPokemon[pokemonNumber];
                if (sleeperOdds) {
                    teamTotal["Sleep"] = (1 - (1 - (teamTotal["Sleep"] || 0)) * (1-sleeperOdds));
                }
                const paralyzerOdds = _paralyzeProbabilityByPokemon[pokemonNumber];
                if (paralyzerOdds) {
                    teamTotal["Paralysis"] = (1 - (1 - (teamTotal["Paralysis"] || 0)) * (1-paralyzerOdds));
                }
            }
        }
        for (const field in teamTotal) {
            odds[field] = (odds[field] || 0) + teamTotal[field];
        }
        return odds;
    }

    const finalizeOdds = function(odds, teamCount, total) {
        for (const field in odds) {
            odds[field] = (odds[field] || 0) / teamCount;
        }
        odds["Total"] = total;
        return odds;
    }

    const isValid = function(pokemon, currentTeamNumbers, isDitto) {
        if (currentTeamNumbers.includes(pokemon.number)) return false;

        if (isDitto && pokemon.number === _dittoNumber) return false;
    
        for (const type of pokemon.types) {
            let typeTotal = 0;
            for (const currentTeamNumber of currentTeamNumbers) {
                if (_pokemonTypesByNumber[currentTeamNumber].includes(type)) {
                    typeTotal++;
                }
            }
            if (typeTotal >= 2) return false;
        }
        
        if (_level100PokemonNumbers.includes(pokemon.number)) {
            if (currentTeamNumbers.some(num => _level100PokemonNumbers.includes(num))) {
                return false;
            }
        }
    
        const weaknesses = _spammableWeaknessesByPokemon[pokemon.id];
        for (const weakness of weaknesses) {
            const sharedWeakMonNumbers = _pokemonNumbersByTypeWeakness[weakness];
            if (currentTeamNumbers.filter(n => sharedWeakMonNumbers.includes(n)).length >= 2) {
                return false;
            }
        }
        return true;
    }
})();