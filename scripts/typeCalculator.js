let unrevealedPokemons = [];
let currentTypeProbabilities = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.calc === "type") {
        const types = unrevealedTypes(message.options.revealedTeam, message.options.haveDitto, true, message.options.pokemons);
        sendResponse(types);
    }
    return true;
});

const uuTiers = ["NFE", "UU", "UUBL", "NU"];
	
const nuTiers = [...uuTiers, "LC"];

const maxTeamSize = 6;
	
const typechart = {
    bug: {
        damageTaken: {
            Bug: 0,
            Dragon: 0,
            Electric: 0,
            Fighting: 2,
            Fire: 1,
            Flying: 1,
            Ghost: 0,
            Grass: 2,
            Ground: 2,
            Ice: 0,
            Normal: 0,
            Poison: 1,
            Psychic: 0,
            Rock: 1,
            Water: 0
        }
    },
    dark: {
        damageTaken: {
            prankster: 3,
            Bug: 1,
            Dark: 2,
            Dragon: 0,
            Electric: 0,
            Fairy: 1,
            Fighting: 1,
            Fire: 0,
            Flying: 0,
            Ghost: 2,
            Grass: 0,
            Ground: 0,
            Ice: 0,
            Normal: 0,
            Poison: 0,
            Psychic: 3,
            Rock: 0,
            Steel: 0,
            Water: 0,
        }
    },
    dragon: {
        damageTaken: {
            Bug: 0,
            Dark: 0,
            Dragon: 1,
            Electric: 2,
            Fairy: 1,
            Fighting: 0,
            Fire: 2,
            Flying: 0,
            Ghost: 0,
            Grass: 2,
            Ground: 0,
            Ice: 1,
            Normal: 0,
            Poison: 0,
            Psychic: 0,
            Rock: 0,
            Steel: 0,
            Water: 2,
        }
    },
    electric: {
        damageTaken: {
            par: 3,
            Bug: 0,
            Dark: 0,
            Dragon: 0,
            Electric: 2,
            Fairy: 0,
            Fighting: 0,
            Fire: 0,
            Flying: 2,
            Ghost: 0,
            Grass: 0,
            Ground: 1,
            Ice: 0,
            Normal: 0,
            Poison: 0,
            Psychic: 0,
            Rock: 0,
            Steel: 2,
            Water: 0
        }
    },
    fairy: {
        damageTaken: {
            Bug: 2,
            Dark: 2,
            Dragon: 3,
            Electric: 0,
            Fairy: 0,
            Fighting: 2,
            Fire: 0,
            Flying: 0,
            Ghost: 0,
            Grass: 0,
            Ground: 0,
            Ice: 0,
            Normal: 0,
            Poison: 1,
            Psychic: 0,
            Rock: 0,
            Steel: 1,
            Water: 0
        }
    },
    fighting: {
        damageTaken: {
            Bug: 2,
            Dark: 2,
            Dragon: 0,
            Electric: 0,
            Fairy: 1,
            Fighting: 0,
            Fire: 0,
            Flying: 1,
            Ghost: 0,
            Grass: 0,
            Ground: 0,
            Ice: 0,
            Normal: 0,
            Poison: 0,
            Psychic: 1,
            Rock: 2,
            Steel: 0,
            Water: 0
        }
    },
    fire: {
        damageTaken: {
            Bug: 2,
            Dragon: 0,
            Electric: 0,
            Fighting: 0,
            Fire: 2,
            Flying: 0,
            Ghost: 0,
            Grass: 2,
            Ground: 1,
            Ice: 0,
            Normal: 0,
            Poison: 0,
            Psychic: 0,
            Rock: 1,
            Water: 1
        }
    },
    flying: {
        damageTaken: {
            Bug: 2,
            Dark: 0,
            Dragon: 0,
            Electric: 1,
            Fairy: 0,
            Fighting: 2,
            Fire: 0,
            Flying: 0,
            Ghost: 0,
            Grass: 2,
            Ground: 3,
            Ice: 1,
            Normal: 0,
            Poison: 0,
            Psychic: 0,
            Rock: 1,
            Steel: 0,
            Water: 0
        }
    },
    ghost: {
        damageTaken: {
            Bug: 2,
            Dragon: 0,
            Electric: 0,
            Fighting: 3,
            Fire: 0,
            Flying: 0,
            Ghost: 1,
            Grass: 0,
            Ground: 0,
            Ice: 0,
            Normal: 3,
            Poison: 2,
            Psychic: 0,
            Rock: 0,
            Water: 0
        }
    },
    grass: {
        damageTaken: {
            powder: 3,
            Bug: 1,
            Dark: 0,
            Dragon: 0,
            Electric: 2,
            Fairy: 0,
            Fighting: 0,
            Fire: 1,
            Flying: 1,
            Ghost: 0,
            Grass: 2,
            Ground: 2,
            Ice: 1,
            Normal: 0,
            Poison: 1,
            Psychic: 0,
            Rock: 0,
            Steel: 0,
            Water: 2
        }
    },
    ground: {
        damageTaken: {
            sandstorm: 3,
            Bug: 0,
            Dark: 0,
            Dragon: 0,
            Electric: 3,
            Fairy: 0,
            Fighting: 0,
            Fire: 0,
            Flying: 0,
            Ghost: 0,
            Grass: 1,
            Ground: 0,
            Ice: 1,
            Normal: 0,
            Poison: 2,
            Psychic: 0,
            Rock: 2,
            Steel: 0,
            Water: 1
        }
    },
    ice: {
        damageTaken: {
            Bug: 0,
            Dark: 0,
            Dragon: 0,
            Electric: 0,
            Fairy: 0,
            Fighting: 1,
            Fire: 1,
            Flying: 0,
            Ghost: 0,
            Grass: 0,
            Ground: 0,
            Ice: 2,
            Normal: 0,
            Poison: 0,
            Psychic: 0,
            Rock: 1,
            Steel: 1,
            Water: 0
        }
    },
    normal: {
        damageTaken: {
            Bug: 0,
            Dark: 0,
            Dragon: 0,
            Electric: 0,
            Fairy: 0,
            Fighting: 1,
            Fire: 0,
            Flying: 0,
            Ghost: 3,
            Grass: 0,
            Ground: 0,
            Ice: 0,
            Normal: 0,
            Poison: 0,
            Psychic: 0,
            Rock: 0,
            Steel: 0,
            Water: 0
        }
    },
    poison: {
        damageTaken: {
            psn: 3,
            tox: 3,
            Bug: 1,
            Dragon: 0,
            Electric: 0,
            Fighting: 2,
            Fire: 0,
            Flying: 0,
            Ghost: 0,
            Grass: 2,
            Ground: 1,
            Ice: 0,
            Normal: 0,
            Poison: 2,
            Psychic: 1,
            Rock: 0,
            Water: 0
        }
    },
    psychic: {
        damageTaken: {
            Bug: 1,
            Dragon: 0,
            Electric: 0,
            Fighting: 2,
            Fire: 0,
            Flying: 0,
            Ghost: 3,
            Grass: 0,
            Ground: 0,
            Ice: 0,
            Normal: 0,
            Poison: 0,
            Psychic: 2,
            Rock: 0,
            Water: 0
        }
    },
    rock: {
        damageTaken: {
            sandstorm: 3,
            Bug: 0,
            Dark: 0,
            Dragon: 0,
            Electric: 0,
            Fairy: 0,
            Fighting: 1,
            Fire: 2,
            Flying: 2,
            Ghost: 0,
            Grass: 1,
            Ground: 1,
            Ice: 0,
            Normal: 2,
            Poison: 2,
            Psychic: 0,
            Rock: 0,
            Steel: 1,
            Water: 1
        }
    },
    steel: {
        damageTaken: {
            psn: 3,
            tox: 3,
            sandstorm: 3,
            Bug: 2,
            Dark: 0,
            Dragon: 2,
            Electric: 0,
            Fairy: 2,
            Fighting: 1,
            Fire: 1,
            Flying: 2,
            Ghost: 0,
            Grass: 2,
            Ground: 1,
            Ice: 2,
            Normal: 2,
            Poison: 3,
            Psychic: 2,
            Rock: 2,
            Steel: 2,
            Water: 0
        }
    },
    water: {
        damageTaken: {
            Bug: 0,
            Dark: 0,
            Dragon: 0,
            Electric: 1,
            Fairy: 0,
            Fighting: 0,
            Fire: 2,
            Flying: 0,
            Ghost: 0,
            Grass: 1,
            Ground: 0,
            Ice: 2,
            Normal: 0,
            Poison: 0,
            Psychic: 0,
            Rock: 0,
            Steel: 2,
            Water: 2
        }
    }
};

const calculatePokemonProbabilities = function(revealedTeam, haveDitto, pokemons) {
    const tempTeam = [];
    for (const revealedMon of revealedTeam) {
        const slot = {};
        for (const pokemon of pokemons) {
            slot[pokemon.id] = (revealedMon === pokemon.name ? 1 : 0);
        }
        tempTeam.push(slot);
    }
    for (let index = revealedTeam.length; index < maxTeamSize; index++) {
        const slot = {};
        let totalProbabilities = 0;
        for (const pokemon of pokemons) {
            if (revealedTeam.includes(pokemon.id)) {
                slot[pokemon.id] = 0;
                continue;
            }
            slot[pokemon.id] = 1;
            if (pokemon.id === "ditto") haveDitto ? 0 : slot[pokemon.id] = slot[pokemon.id]/2;
            else if (pokemon.tier === "NFE" || pokemon.tier === "LC") slot[pokemon.id] = slot[pokemon.id]/2; // if NFE or LC, cut odds in half
            if (tempTeam.length > 0) {
                const emptyArray = tempTeam.map(p => 0);
                let totalPreviousProbability = [...emptyArray];
                let oneSameTypePreviousProbability = [...emptyArray];
                let twoSameTypePreviousProbability = [...emptyArray];
                let twoWeakPreviousProbability = [...emptyArray];
                let uberTierPreviousProbability = [...emptyArray];
                let nuTierPreviousProbability = [...emptyArray];
                for (let i = 0; i < tempTeam.length; i++) {
                    const previousSlot = tempTeam[i];
                    for (const previousPokemonId in previousSlot) {
                        const previousPokemon = pokemons.find(p => p.id === previousPokemonId);
                        totalPreviousProbability[i] += previousSlot[previousPokemonId];
                        const typeProbabilities = [];
                        for (let k = 0; k < pokemon.types.length; k++) {
                            const type = pokemon.types[k];
                            if (previousPokemon.types.includes(type)) {
                                const otherSlots = tempTeam.slice(0, i - 1);
                                let isTwo = false;
                                for (let j = 0; j < otherSlots.length; j++) {
                                    const otherSlot = otherSlots[j];
                                    for (const otherPokemonId in otherSlot) {
                                        const otherPokemon = pokemons.find(p => p.id === otherPokemonId);
                                        if (otherPokemon.types.includes(type)) {
                                            isTwo = true;
                                            if (revealedTeam.includes(previousPokemonId) && revealedTeam.includes(otherPokemonId)) {
                                                typeProbabilities[k] = 0;
                                            }
                                            else if (revealedTeam.includes(previousPokemonId)) {
                                                typeProbabilities[k] = 1/2 - (1 - otherSlot[otherPokemonId]);
                                            }
                                            else if (revealedTeam.includes(otherPokemonId)) {
                                                typeProbabilities[k] = 1/2 - (1 - previousSlot[previousPokemonId]);
                                            }
                                            else {
                                                typeProbabilities[k] = 1 - ((1 - previousSlot[previousPokemonId]) * (1 - otherSlot[otherPokemonId]));
                                            }
                                        }
                                    }
                                }
                                if (!isTwo && revealedTeam.includes(previousPokemonId)) {
                                    typeProbabilities[k] = previousSlot[previousPokemonId]/2;
                                }
                            }
                        }
                        if (typeProbabilities.length !== 0) {
                            // if revealedTeam has two types,
                            twoSameTypePreviousProbability[i] = typeProbabilities.reduce((partialSum, a) => partialSum + a, 0)/typeProbabilities.length;
                        }
                        if (previousPokemon.types.some(ppt => pokemon.types.includes(ppt))) {
                            oneSameTypePreviousProbability[i] += previousSlot[previousPokemonId];
                        }
                        // do weakness check
                        if (previousPokemon.tier === "Uber") {
                            uberTierPreviousProbability[i] += previousSlot[previousPokemonId];
                        }
                        else if (nuTiers.includes(previousPokemon.tier)) {
                            nuTierPreviousProbability[i] += previousSlot[previousPokemonId];
                        }
                    }
                    oneSameTypePreviousProbability[i] = (oneSameTypePreviousProbability[i] - twoSameTypePreviousProbability[i]) / totalPreviousProbability[i];
                    twoSameTypePreviousProbability[i] = twoSameTypePreviousProbability[i] / totalPreviousProbability[i];
                    twoWeakPreviousProbability[i] = twoWeakPreviousProbability[i] / totalPreviousProbability[i];
                    uberTierPreviousProbability[i] = uberTierPreviousProbability[i] / totalPreviousProbability[i];
                    nuTierPreviousProbability[i] = nuTierPreviousProbability[i] / totalPreviousProbability[i];
                }
                const oneSameTypeOdds = oneSameTypePreviousProbability.reduce((partialSum, a) => partialSum + a, 0)/oneSameTypePreviousProbability.length;
                const twoSameTypeOdds = twoSameTypePreviousProbability.reduce((partialSum, a) => partialSum + a, 0)/twoSameTypePreviousProbability.length;
                const twoWeakOdds = twoWeakPreviousProbability.reduce((partialSum, a) => partialSum + a, 0)/twoWeakPreviousProbability.length;
                const uberTierOdds = uberTierPreviousProbability.reduce((partialSum, a) => partialSum + a, 0)/uberTierPreviousProbability.length;
                const nuTierOdds = nuTierPreviousProbability.reduce((partialSum, a) => partialSum + a, 0)/nuTierPreviousProbability.length;
                if (pokemon.tier === "LC" || pokemon.tier == "NFE") {
                    if (tempTeam.length > 3) slot[pokemon.id] = slot[pokemon.id] * (1 - nuTierOdds);
                }
                else if (pokemon.tier === "Uber") {
                    slot[pokemon.id] = slot[pokemon.id] * (1 - uberTierOdds);
                }
                else if (tempTeam.length > 3 && uuTiers.includes(pokemon.tier)) {
                    slot[pokemon.id] = slot[pokemon.id] * (1 - nuTierOdds/2);
                }
                slot[pokemon.id] = slot[pokemon.id] * (1 - oneSameTypeOdds/2) * (1 - twoSameTypeOdds) * (1 - twoWeakOdds);
            }
            totalProbabilities += slot[pokemon.id];
        }
        for (const pokemonId in slot) {
            slot[pokemonId] = (1/totalProbabilities)*slot[pokemonId];
        }
        tempTeam.push(slot);
    }
    const result = {};
    for (const pokemon of pokemons) {
        let totalProbability = 0;
        for (const slot of tempTeam) {
            totalProbability += slot[pokemon.id];
        }
        result[pokemon.id] = totalProbability/tempTeam.length;
    }
    return result;
}

const capitalizeFirstLetter = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
	
const unrevealedTypes = function(revealedMons, haveDitto, changed, pokemons) {
    if (!changed) {
        return currentTypeProbabilities;
    }
    unrevealedPokemons = calculatePokemonProbabilities(revealedMons, haveDitto, pokemons);
    let validTypes = [];
    let typeProbabilities = [];
    for (const type in typechart) {
      const capitalizedType = capitalizeFirstLetter(type);
      if (pokemons.some(p => p.types.includes(capitalizedType))) {
          validTypes.push(capitalizedType);
      }
    }
    for (const type of validTypes) {
      const capitalizedType = capitalizeFirstLetter(type);
      let typeOdds = 1;
      let sameTypeCount = 0;
      if (pokemons.some(p => p.types.includes(capitalizedType))) {
        const unrevealedMons = [];
        for (const unrevealedPokemon in unrevealedPokemons) {
            const unrevealedMon = pokemons.find(p => p.id === unrevealedPokemon);
            if (unrevealedMon.types.includes(capitalizedType)) {
                typeOdds = typeOdds * (1 - unrevealedPokemons[unrevealedPokemon]);
                sameTypeCount++;
            }
        }
        const probability = typeOdds * (sameTypeCount/pokemons.length);
        typeProbabilities.push({ type: type, probability: probability });
      }
    }
    typeProbabilities.sort((a, b) => b.probability - a.probability);
    currentTypeProbabilities = [...typeProbabilities];
    return typeProbabilities;
}