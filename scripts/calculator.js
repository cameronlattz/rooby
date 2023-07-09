const calc = function() {
	let currentTypeProbabilities = [];
	let unrevealedPokemons = {};

	window.onload = function() {
		util.loadRandomsData(buildPokemons, "gen1").then(function(data) {
			unrevealedPokemons = calculatePokemonProbabilities([], false);
		});
	}
	
	const calculatePokemonProbabilities = function(revealedTeam, haveDitto) {
		const tempTeam = [];
		for (const revealedMon of revealedTeam) {
			const slot = {};
			for (const pokemon of consts.pokemons) {
				slot[pokemon.id] = (revealedMon === pokemon.name ? 1 : 0);
			}
			tempTeam.push(slot);
		}
		for (let index = revealedTeam.length; index < consts.maxTeamSize; index++) {
			const slot = {};
			let totalProbabilities = 0;
			for (const pokemon of consts.pokemons) {
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
							const previousPokemon = consts.pokemons.find(p => p.id === previousPokemonId);
							totalPreviousProbability[i] += previousSlot[previousPokemonId];
							const typeProbabilities = [];
							for (let k = 0; k < pokemon.types.length; k++) {
								const type = pokemon.types[k];
								if (previousPokemon.types.includes(type)) {
									const otherSlots = tempTeam.slice(0, i - 1);
									for (let j = 0; j < otherSlots.length; j++) {
										const otherSlot = otherSlots[j];
										for (const otherPokemonId in otherSlot) {
											const otherPokemon = consts.pokemons.find(p => p.id === otherPokemonId);
											if (otherPokemon.types.includes(type)) {
												typeProbabilities[k] = 1 - ((1 - previousSlot[previousPokemonId]) * (1 - otherSlot[otherPokemonId]));
											}
										}
									}
								}
							}
							if (typeProbabilities.length === 0) twoSameTypePreviousProbability[i] = 0;
							else twoSameTypePreviousProbability[i] = typeProbabilities.reduce((partialSum, a) => partialSum + a, 0)/typeProbabilities.length;
							if (previousPokemon.types.some(ppt => pokemon.types.includes(ppt))) {
								oneSameTypePreviousProbability[i] += previousSlot[previousPokemonId];
							}
							// do weakness check
							if (previousPokemon.tier === "Uber") {
								uberTierPreviousProbability[i] += previousSlot[previousPokemonId];
							}
							else if (consts.nuTiers.includes(previousPokemon.tier)) {
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
					else if (tempTeam.length > 3 && consts.uuTiers.includes(pokemon.tier)) {
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
		for (const pokemon of consts.pokemons) {
			let totalProbability = 0;
			for (const slot of tempTeam) {
				totalProbability += slot[pokemon.id];
			}
			result[pokemon.id] = totalProbability/tempTeam.length;
		}
		return result;
	}

	const buildPokemons = function(moveSets, tiers) {;
		const validPokemonMoveSets = {};
		for (const moveSetName in moveSets) {
			const moveSet = moveSets[moveSetName];
			validPokemonMoveSets[moveSetName] = moveSet;
		}
		let pokemons = [];
		for (const pokemonId in validPokemonMoveSets) {
			const pokemonMoveSets = calculateMoveSets(validPokemonMoveSets[pokemonId]);
			const pokemon = {
				critRate: critRate(1), // TODO
				id: pokemonId,
				level: moveSets[pokemonId].level,
				moves: calculateMoves(pokemonMoveSets),
				moveSets: pokemonMoveSets,
				name: consts.pokedex[pokemonId].name,
				number: consts.pokedex[pokemonId].num,
				probability: 1,
				tier: tiers[pokemonId].tier,
				types: consts.pokedex[pokemonId].types
			}; 
			pokemons.push(pokemon);
		}
		consts.pokemons = pokemons;
		return pokemons;
	}
	
	const calculateProbabilities = function(pokemons) {
		const viablePokemons = pokemons.filter(p => p.moves.length === 0);
		const nuPokemonCount = viablePokemons.filter(p => p.tier === "NU").length;
		const nuOrLowerPokemonCount = viablePokemons.filter(pokemon => consts.nuTiers.some(tier => pokemon.tier === tier)).length;
		if (pokemons.length < consts.maxTeamSize) {
			for (const pokemon of pokemons) {
				pokemon.probability = 1/pokemons.length;
			}
			return;
		}
		const adjustedTotal = (2*nuOrLowerPokemonCount)/3 + (pokemons.length - nuOrLowerPokemonCount);
		for (let slotIndex = 0; slotIndex < consts.maxTeamSize; slotIndex++) {
			for (const pokemon of pokemons) {
				let probability = 1 / (adjustedTotal - slotIndex);
				if (pokemon.tier === "LC" || pokemon.tier === "NFE") {
					probability = probability * 2/3;
					if (slotIndex > 4) {
						const nuPokemonProbability = util.calculateProbability(4, nuPokemonCount, viablePokemons.length, consts.maxTeamSize);
						probability = probability * (1 - nuPokemonProbability);
					}
				}
				else if (pokemon.tier === "Ubers") {
					probability = (1 - pokemon.probability) * probability;
				}
				else if (consts.uuTiers.some(tier => pokemon.tier === tier) && slotIndex > 4) {
					const nuPokemonProbability = util.calculateProbability(4, nuPokemonCount, viablePokemons.length, consts.maxTeamSize);
					probability = probability * (1 - (nuPokemonProbability * .5));
				}
				const sameTypesPokemons = viablePokemons.filter(vp => vp.types != null && vp.types.some(t => pokemon.types.includes(t)));
				const twoOfSameTypeProbability = util.calculateProbability(2, sameTypesPokemons.length, viablePokemons.length, consts.maxTeamSize);
				probability = probability * (1 - twoOfSameTypeProbability);
				const weaknesses = getWeaknesses(pokemon.types);
				const sameWeaknessesPokemons = viablePokemons.filter(vp => getWeaknesses(vp.types).some(t => weaknesses.includes(t)));
				const twoOfSameWeaknessProbability = util.calculateProbability(2, sameWeaknessesPokemons.length, viablePokemons.length, consts.maxTeamSize);
				probability = probability * (1 - twoOfSameWeaknessProbability);
				pokemon.probability = pokemon.probability * (1 - probability);
			}
		}
		for (const pokemon of pokemons) {
			if (pokemon.moves.length === 0) pokemon.probability = 1;
			else if (pokemon.id === "ditto") pokemon.probability = 1 - ((1 - pokemon.probability) * pokemon.probability);
			pokemon.probability = 1 - pokemon.probability;
		}
	}

	const getWeaknesses = function(types) {
		if (types == null) return [];
		let weaknesses = [];
		let resistances = [];
		for (const type of types) {
			const typeChartEntry = consts.typechart[type.toLowerCase()];
			if (typeChartEntry == null) return [];
			const damageTaken = typeChartEntry.damageTaken;
			for (const key in damageTaken) {
				if (damageTaken[key] === 2) {
					if (weaknesses.includes(key)) weaknesses = weaknesses.filter(w => w !== key);
					else resistances.push(key);
				}
				else if (damageTaken[key] === 1) {
					if (resistances.includes(key)) resistances = resistances.filter(w => w !== key);
					else weaknesses.push(key);
				}
			}
		}
		return util.removeDuplicates(weaknesses);
	}
	
	const getCounters = function(pokemonMoves) {
		let counters = {Status: 0, Special: 0, Physical: 0, specialSetup: 0, physicalSetup: 0};
		for (const move of pokemonMoves) {
			if (consts.physicalSetupMoves.includes(move)) counters.physicalSetup++;
			if (consts.specialSetupMoves.includes(move)) counters.specialSetup++;
			counters[consts.moves[move].category]++;
		}
		return counters;
	}
	
	const shouldCullMove = function(pokemonMove, pokemonMoves) {
		for (const redundantSet of consts.redundantSets) {
			if (redundantSet.includes(pokemonMove)) {
				for (const redundantMove of redundantSet) {
					if (pokemonMove !== redundantMove && pokemonMoves.includes(redundantMove)) return true;
				}
				return false;
			}
		}
		const counters = getCounters(pokemonMoves);
		for (const move of pokemonMoves) {
			if (pokemonMove === move) continue;
			if (consts.physicalSetupMoves.includes(pokemonMove)) {
				if (counters["Special"] > counters["Physical"] || counters["Physical"] === 0 || consts.specialSetupMoves.some(ssm => pokemonMoves.includes(ssm))) {
					return true;
				}
			}
			else if (consts.specialSetupMoves.includes(pokemonMove)) for (const specialSetupMove of consts.specialSetupMoves) {
				if (counters["Physical"] > counters["Special"] || counters["Special"] === 0 || consts.physicalSetupMoves.some(psm => pokemonMoves.includes(psm))) {
					return true;
				}
			}
			else if (consts.statusMoves.includes(pokemonMove) && counters["Status"] > 1) return true;
		}
		return false;
	}
	
	const calculateMoves = function(moveSets) {
		const moves = [];
		for (const moveSet of moveSets) {
			for (const move of moveSet.moves) {
				const existingMoves = moves.filter(existingMove => existingMove.id === move);
				if (existingMoves.length === 0) moves.push({ id: move, name: consts.moves[move].name, probability: moveSet.probability, category: consts.moves[move].category });
				else existingMoves[0].probability += moveSet.probability;
			}
		}
		return moves.sort((a, b) => b.probability - a.probability);
	}

	const calculateMoveSets = function(pokemon) {
		const comboMoves = pokemon.comboMoves !== void 0 ? pokemon.comboMoves : [];
		const exclusiveMoves = pokemon.exclusiveMoves !== void 0 ? pokemon.exclusiveMoves : [];
		const essentialMoves = pokemon.essentialMove !== void 0 ? [pokemon.essentialMove] : [];
		const moves = pokemon.moves !== void 0 ? pokemon.moves : [];

		const addMoves = function(moveSets, moves, isExclusiveMoves) {
			let newMoveSets = [];
			for (const moveSet of moveSets) {
				let availableMoves = [...moves];
				if (moveSet.culledMoves != null) availableMoves = moves.filter(m => !moveSet.culledMoves.includes(m) && !moveSet.moves.includes(m));
				const newMoveSet = JSON.parse(JSON.stringify(moveSet));
				if (moveSet.moves.length < consts.maxMoveCount && availableMoves.length !== 0) {
					const combinationsCount = isExclusiveMoves ? 1 : consts.maxMoveCount - moveSet.moves.length;
					const moveCombinations = util.generateCombinations(availableMoves, combinationsCount);
					for (const moveCombination of moveCombinations) {
						newMoveSet.moves = [...moveSet.moves, ...moveCombination];
						newMoveSet.probability = moveSet.probability / moveCombinations.length;
						newMoveSets.push(JSON.parse(JSON.stringify(newMoveSet)));
					}
				} else newMoveSets.push(newMoveSet);
			}
			return newMoveSets;
		}

		const minimumMoveSetLength = comboMoves.length > 0 ? 2 : 1;
		let moveSets = [];
		for (let i = 0; i < minimumMoveSetLength; i++) {
			let totalMoves = exclusiveMoves.length + essentialMoves.length + moves.length;
			if (i === 1) totalMoves += comboMoves.length;
			let newMoveSets = [{ moves: (i === 1 ? [...comboMoves] : []), probability: 1/minimumMoveSetLength }];
			newMoveSets = addMoves(newMoveSets, exclusiveMoves, true);
			newMoveSets = addMoves(newMoveSets, essentialMoves);
			while (newMoveSets.some(nms => nms.moves.length < consts.maxMoveCount && nms.moves.length < totalMoves)) {
				newMoveSets = addMoves(newMoveSets, moves);
				for (let j = 0; j < newMoveSets.length; j++) {
					newMoveSets[j].culledMoves = newMoveSets[j].culledMoves || [];
					for (const move of newMoveSets[j].moves) {
						if (essentialMoves.includes(move) || newMoveSets[j].culledMoves.includes(move)) continue;
						if (!moves.some(rbm => !newMoveSets[j].moves.includes(rbm) && !newMoveSets[j].culledMoves.includes(rbm))) break;
						if (shouldCullMove(move, newMoveSets[j].moves)) {
							newMoveSets[j].moves = newMoveSets[j].moves.filter(m => m !== move);
							newMoveSets[j].culledMoves = [...newMoveSets[j].culledMoves, move];
							break;
						}
					}
				}
			}
			moveSets = [...moveSets, ...newMoveSets];
		}
		if (!moveSets.some(ms => ms.moves.length !== 0)) return [];
		moveSets = util.removeDuplicates(moveSets, "moves", "probability");
		return moveSets.sort((a, b) => b.probability - a.probability);
	}

	const unrevealedMoves = function(pokemon, clickedMoves) {
        const validMoveSets = pokemon.moveSets.filter(ms => clickedMoves.every(cm => ms.moves.includes(cm.id)));
        const unrevealedMoves = [];
        for (const move of pokemon.moves.filter(move => !clickedMoves.includes(move))) {
          const probability = validMoveSets.filter(vms => vms.moves.includes(move.id)).length / validMoveSets.length;
          unrevealedMoves.push({ name: move.name, probability: (probability*100).toFixed(0) });
        }
        unrevealedMoves.sort((a, b) => b.probability - a.probability);
		return unrevealedMoves;
	}
	
	const unrevealedTypes = function(revealedMons, haveDitto, changed) {
		if (changed) {
			unrevealedPokemons = calculatePokemonProbabilities(revealedMons, haveDitto);
		}
		let validTypes = [];
		let typeProbabilities = [];
		for (const type in consts.typechart) {
		  const capitalizedType = util.capitalizeFirstLetter(type);
		  if (consts.pokemons.some(p => p.types.includes(capitalizedType))) {
			  validTypes.push(capitalizedType);
		  }
		}
		for (const type of validTypes) {
		  const capitalizedType = util.capitalizeFirstLetter(type);
		  let typeOdds = 1;
		  let sameTypeCount = 0;
		  if (consts.pokemons.some(p => p.types.includes(capitalizedType))) {
			const unrevealedMons = [];
			for (const unrevealedPokemon in unrevealedPokemons) {
				const unrevealedMon = consts.pokemons.find(p => p.id === unrevealedPokemon);
				if (unrevealedMon.types.includes(capitalizedType)) {
					typeOdds = typeOdds * (1 - unrevealedPokemons[unrevealedPokemon]);
					sameTypeCount++;
				}
			}
			const probability = typeOdds * (sameTypeCount/consts.pokemons.length);
			typeProbabilities.push({ type: type, probability: probability });
		  }
		}
		typeProbabilities.sort((a, b) => b.probability - a.probability);
		currentTypeProbabilities = [...typeProbabilities];
		return typeProbabilities;
	}

	const damage = function(pokemon, opposingPokemon, healthRemaining, burned, buffs, debuffs) {
		return {
			minDamage: (Math.random()*25).toFixed(0),
			maxDamage: (Math.random()*25 + 25).toFixed(0),
			critRate: (Math.random()*25).toFixed(0),
			critMinDamage: (Math.random()*50).toFixed(0),
			critMaxDamage: (Math.random()*50 + 50).toFixed(0),
			hkoChance: (Math.random()*100).toFixed(0),
			hkoMultiple: (Math.random()*3 + 1).toFixed(0)
		}
	}

	const critRate = function(baseSpeed) {
		return 1;
	}

	return {
		buildPokemons: buildPokemons,
		damage: damage,
		unrevealedMoves: unrevealedMoves,
		unrevealedTypes: unrevealedTypes
	}
}();