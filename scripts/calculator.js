window.roobyCalc = function() {
	"use strict";
	const api = chrome || browser;
	const calculateDistribution = function(pokemon) {
	// originally created by popotheslope
		class Tree {
			constructor(percent, set) {
				this.children = [];
				this.percent = percent;
				this.set = set;
			}
		}

		const sameSet = function(set1, set2) {
			const isSame = (set1.length == set2.length) && set1.every(function(element, index) {
				  return element === set2[index]; 
			});
			return isSame;
		}

		const updateSets = function(sets, new_set) {
			let found = false;
			for (const set of sets) {
				  if (sameSet(set["moves"], new_set.set)) {
					set["percent"] += new_set.percent;
					found = true;
					break;
				  }
			}
			if (!found) {
				  sets.push({
					"moves": new_set.set,
					"percent": new_set.percent
				  });
			}
			return sets;
		}

		const updateLeaves = function(tree) {
			if (tree.children.length === 0) {
				leaves.push(tree);
			} else {
				for (const child of tree.children) {
					updateLeaves(child);
				}
			}
		}

		const shouldCullMove = function(current_moves, new_move) {
			for (const redundantSet of consts.redundantSets) {
				if (redundantSet.includes(new_move) && redundantSet.some(rm => current_moves.some(cm => cm === rm))) {
					return true;
				}
			}
	
			const statusMoveCount = current_moves.filter(cm => consts.moves[cm].category === "Status");
	
			if (consts.statusMoves.includes(new_move) && statusMoveCount > 1) {
				return true;
			}
			
			const physicalMoveCount = current_moves.filter(cm => consts.moves[cm].category === "Physical");
			const specialMoveCount = current_moves.filter(cm => consts.moves[cm].category === "Special");
	
			if (consts.physicalSetupMoves.some(psm => current_moves.some(cm => cm === psm))) {
				if (consts.specialSetupMoves.some(ssm => current_moves.some(cm => cm === ssm)) || physicalMoveCount === 0 || specialMoveCount > physicalMoveCount) {
					return true;
				}
			}
	
			if (consts.specialSetupMoves.some(ssm => current_moves.some(cm => cm === ssm))) {
				if (consts.physicalSetupMoves.some(psm => current_moves.some(cm => cm === psm)) || specialMoveCount === 0 || physicalMoveCount > specialMoveCount) {
					return true;
				}
			}
	
			return false;
		}
		
		const orderMovesetDistribution = function(movesetDistribution) {
			const uniqueMovesets = [];
			for (const moveset of movesetDistribution) {
				if (uniqueMovesets.some(um => um.moves.every(m => moveset.moves.includes(m)))) continue;
				const duplicateMovesets = movesetDistribution.filter(m => m.moves.every(mv => moveset.moves.includes(mv)));
				const percent = duplicateMovesets.reduce((sum, dm) => sum + dm.percent, 0);
				const sortedMoveset = duplicateMovesets[0].moves.sort((a, b) => a.localeCompare(b));
				uniqueMovesets.push({moves: sortedMoveset, percent});
			}
		
			return uniqueMovesets;
		}

		const calculateTotalChance = function(moveset) {
			if (!moveset) return 0;
			let total_chance = 0;
			for (const move of moveset) {
				total_chance += move["chance"];
			}
			return total_chance;
		}

		let leaves = [];
		let real_essentialMoves, real_exclusiveMoves, real_randomBattleMoves;
		const root = new Tree(1, []);
		updateLeaves(root);
		root.children.push(new Tree(pokemon["comboMoves"] ? 0.5 : 1, []));
	
		if (pokemon["comboMoves"]) {
		  	for (const leaf of leaves) {
				const tree = new Tree(0.5 * leaf.percent, pokemon["comboMoves"].map(cm => cm.move));
				root.children.push(tree);
		  	}
		}
	
		leaves = [];
		updateLeaves(root);
	
		if (pokemon["exclusiveMoves"]) {
		  	for (const leaf of leaves) {
				if (leaf.set.length < 4) {
			  	real_exclusiveMoves = function () {
					const realExclusiveMoves = [];
					for (const move of pokemon["exclusiveMoves"]) {
						if (!leaf.set.includes(move.move)) {
							realExclusiveMoves.push(move);
						}
					}
					return realExclusiveMoves;
			  	}.call(this);
	
				const exclusiveMovesTotalChance = calculateTotalChance(real_exclusiveMoves);
				for (const move of real_exclusiveMoves) {
					const tree = new Tree(move["chance"] * 1.0 / exclusiveMovesTotalChance * leaf.percent, leaf.set.concat([move["move"]]));
					leaf.children.push(tree);
			  	}
			}
		  }
		}
	
		leaves = [];
		updateLeaves(root);
	
		if (pokemon["essentialMoves"]) {
		  	let exhausted = false;
		  	while (!exhausted) {
				exhausted = true;
				leaves = [];
				updateLeaves(root);
		
				for (const leaf of leaves) {
			  		if (leaf.set.length < 4) {
						real_essentialMoves = function () {
				  			const realEssentialMoves = [];
				  			for (const move of pokemon["essentialMoves"]) {
								if (!leaf.set.includes(move.move)) {
					  				realEssentialMoves.push(move);
								}
				  			}
				  			return realEssentialMoves;
						}.call(this);
						if (real_essentialMoves.length === 0) {
							continue;
						}
	
						exhausted = false;
						const essentialMovesTotalChance = calculateTotalChance(real_essentialMoves);
						for (const move of real_essentialMoves) {
							const tree = new Tree(move["chance"] * 1.0 / essentialMovesTotalChance * leaf.percent, leaf.set.concat([move["move"]]));
							leaf.children.push(tree);
						}
			  		}
				}
		  	}
		}
	
		leaves = [];
		updateLeaves(root);
	
		if (pokemon["randomBattleMoves"]) {
		  let exhausted = false;
		  while (!exhausted) {
			exhausted = true;
			leaves = [];
			updateLeaves(root);
	
			for (const leaf of leaves) {
			  if (leaf.set.length < 4) {
				real_randomBattleMoves = function () {
					const realRandomBattleMoves = [];
					for (const move of pokemon["randomBattleMoves"]) {
						if (!leaf.set.includes(move.move)) {
							realRandomBattleMoves.push(move);
						}
					}
					return realRandomBattleMoves;
				}.call(this);
	
				if (real_randomBattleMoves.length === 0) continue;
				for (let i = real_randomBattleMoves.length - 1; i >= 0; i--) {
					const move = real_randomBattleMoves[i];
					if (real_randomBattleMoves.length > 1 && shouldCullMove(leaf.set, move["move"])) {
						real_randomBattleMoves.splice(real_randomBattleMoves.indexOf(move));
					}
				}
	
				exhausted = false;
				const randomBattleMovesTotalChance = calculateTotalChance(real_randomBattleMoves);
				for (const move of real_randomBattleMoves) {
					const tree = new Tree(move["chance"] * 1.0 / randomBattleMovesTotalChance * leaf.percent, leaf.set.concat([move["move"]]));
					leaf.children.push(tree);
				}
			  }
			}
		  }
		}
	
		leaves = [];
		updateLeaves(root);
	
		let sets = [];
		for (const leaf of leaves) {
		  sets = updateSets(sets, leaf);
		}
		return orderMovesetDistribution(sets);
	}

	const buildSettingsPokemons = function(moveSets) {

		const convertMovedex = function(movedex, pokemon) {
			const convertedMovedex = { name: pokemon };
			for (let moveType in movedex) {
				if (Array.isArray(movedex[moveType])) {
					const moves = Object.values(movedex[moveType].reduce((c, v) => {
						c[v] = c[v] || [v, 0];
						c[v][1]++;
						return c;
					},{})).map(x => ({"move" : x[0], "chance": x[1]}));
					if (moveType === "moves") moveType = "randomBattleMoves";
					convertedMovedex[moveType] = moves;
				}
			}
			return convertedMovedex;
		}

		const calculateMoveSets = function(movedex, pokemon) {
			const convertedMovedex = convertMovedex(movedex, pokemon);
			const movesetDistribution = calculateDistribution(convertedMovedex);
			return movesetDistribution;
		}

		const calculateConfusionDamage = function(pokemonName) {
			const confusionDamage = consts.confusionDamages[consts.pokedex[pokemonName].num - 1];
			return [confusionDamage[0]/100, confusionDamage[1]/100];
		}
	
		const calculateMoves = function(moveSets) {
			const moves = [];
			for (const moveSet of moveSets) {
				for (const move of moveSet.moves) {
					const existingMoves = moves.filter(existingMove => existingMove.id === move);
					const moveConst = consts.moves[move];
					if (existingMoves.length === 0) moves.push({ id: move, name: moveConst.name, probability: moveSet.percent });
					else existingMoves[0].probability += moveSet.percent;
				}
			}
			return moves.sort((a, b) => b.probability - a.probability);
		}

		const validPokemonMoveSets = {};
		for (const moveSetName in moveSets) {
			const moveSet = moveSets[moveSetName];
			validPokemonMoveSets[moveSetName] = moveSet;
		}
		let pokemons = [];
		for (const pokemonId in validPokemonMoveSets) {
			const pokemonMoveSets = calculateMoveSets(validPokemonMoveSets[pokemonId], pokemonId);
			const pokemonLevel = moveSets[pokemonId].level;
			const pokemonMoves = calculateMoves(pokemonMoveSets);
			const dexMon = consts.pokedex[pokemonId];
			const pokemon = {
				confusionDamage: calculateConfusionDamage(pokemonId),
				id: pokemonId,
				level: pokemonLevel,
				moves: pokemonMoves,
				moveSets: pokemonMoveSets,
				name: dexMon.name,
				number: dexMon.num,
				probability: 1,
				types: dexMon.types
			}; 
			pokemons.push(pokemon);
		}
		pokemons = pokemons.sort((a, b) => a.number - b.number);
		return pokemons;
	}

	const buildTeamTree = function(tab, trainer, revealedPokemonNames, opponentRevealedPokemonNames, opponentHasDitto, pokemons, returnFunction) {
		if (pokemons == void 0 || pokemons.length === 0) {
			setTimeout(function() { buildTeamTree(tab, trainer, revealedPokemonNames, opponentRevealedPokemonNames, opponentHasDitto, pokemons, returnFunction); }, 1000);
			return;
		}
		const revealedPokemon = revealedPokemonNames.map(name => pokemons.find(p => p.name === name || p.id === name));
		const currentTeamNumbers = revealedPokemon.map(p => p.number);
		const opponentRevealedPokemon = opponentRevealedPokemonNames.map(name => pokemons.find(p => p.name === name || p.id === name));
		const opponentPokemonNumbers = opponentRevealedPokemon.map(p => p.number);
		const args = {pokemons, currentTeamNumbers, opponentPokemonNumbers, opponentHasDitto};
		api.runtime.sendMessage({function:"calculate", args: args}, function(result) {
			returnFunction(tab, trainer, result);
			void api.runtime.lastError;
		});
	}

	const damage = function(pokemon, opponent, moveName, moveBp, isCrit) {

		const getCalculation = function(generation, pokemon, opposingPokemon, move, fieldEffects) {
			const field = new calc.Field(generation);
			if (fieldEffects != void 0) {
				field.defenderSide.isReflect = fieldEffects.defenderSide.isReflect;
				field.defenderSide.isLightScreen = fieldEffects.defenderSide.isLightScreen;
			}
			const calculation = calc.calculate(generation, pokemon, opposingPokemon, move, field);
			const dexMove = Object.values(consts.moves).find(m => m.name === moveName);
			if (dexMove.multihit != void 0) {
				const newDamage = [];
				const multihit = dexMove.multihit[0] != void 0 ? dexMove.multihit : [dexMove.multihit, dexMove.multihit];
				for (let multiplier = multihit[0]; multiplier <= multihit[1]; multiplier++) {
					const damages = isNaN(calculation.damage) ? calculation.damage : [calculation.damage];
					for (const damageResult of damages) {
						newDamage.push(damageResult * multiplier);
					}
				}
				newDamage.sort((a, b) => a - b);
				calculation.damage = newDamage;
			}
			return calculation;
		}

		const getTransformedStats = function(generation, pokemonId, pokemonLevel, transformedIntoId, transformedIntoLevel, boosts) {
			const isTransformed = transformedIntoId != void 0 && pokemonId !== transformedIntoId;
			const transformee = isTransformed ? new calc.Pokemon(generation, transformedIntoId, {level:transformedIntoLevel}) : {};
			const calcPokemon = new calc.Pokemon(generation, pokemonId, {level:pokemonLevel});
			const pokemonStats = {
				level: pokemonLevel,
				rawStats: isTransformed ? transformee.rawStats : calcPokemon.rawStats,
				stats: isTransformed ? transformee.stats : calcPokemon.stats,
				ivs: isTransformed ? transformee.ivs : calcPokemon.ivs,
				evs: isTransformed ? transformee.evs : calcPokemon.evs,
				species: isTransformed ? transformee.species : calcPokemon.species,
				boosts: boosts || isTransformed ? transformee.boosts : calcPokemon.boosts
			}
			pokemonStats.rawStats.hp = calcPokemon.rawStats.hp;
			pokemonStats.stats.hp = calcPokemon.stats.hp;
			pokemonStats.species.name = isTransformed ? transformee.species.name : calcPokemon.species.name;
			pokemonStats.species.id = isTransformed ? transformee.species.id : calcPokemon.species.id;
			return pokemonStats;
		}

		const getHealthRange = function(healthRemainingPercent, hp) {
			const healthRange = [];
			const startingRange = Math.ceil((healthRemainingPercent)*hp/100);
			const endingRange = Math.floor((healthRemainingPercent + 1)*hp/100);
			for (let i = startingRange; i <= endingRange; i++) {
				healthRange.push(i);
			}
			return healthRange;
		}

		const getCritRate = function(baseSpeed, moveName) {
			let moveCritDivider = 512;
			if (moveName) {
				const move = Object.entries(consts.moves).filter(x => x[1].name === moveName)[0][1];
				if (move.critRatio === 0) return 0;
				if (move.critRatio > 1) moveCritDivider = moveCritDivider / 8;
			}
			return baseSpeed / moveCritDivider;
		}

		const generation = calc.Generations.get(1);
		const move = new calc.Move(generation, moveName, {bp: moveBp, isCrit: isCrit});
		const moveKey = Object.keys(consts.moves).filter(m => consts.moves[m].name === moveName)[0];
		if (move.category === "Status" && !consts.recoveryMoves.includes(moveKey)) return {};
		const pokemonStats = getTransformedStats(generation, pokemon.id, pokemon.level, pokemon.transformedId, pokemon.transformedLevel, pokemon.boosts);
		if (consts.recoveryMoves.includes(moveKey)) {
			if (pokemon.exactHealth) {
				if (pokemon.exactHealth === pokemonStats.stats.hp) return { failureRate: 1 };
				else if ((pokemonStats.stats.hp - pokemon.exactHealth) % 256 === 255) return { failureRate: 1 };
			}
			else {
				if (pokemon.healthRemainingPercent === 100) return { failureRate: 1 };
				const actualMin = Math.floor((pokemon.healthRemainingPercent - 1) / 100 * pokemonStats.stats.hp);
				const actualMax = Math.ceil(pokemon.healthRemainingPercent / 100 * pokemonStats.stats.hp);
				for (let healthValue = actualMin; healthValue < actualMax; healthValue++) {
					if ((pokemonStats.stats.hp - healthValue) % 256 === 255) {
						return { failureRate: 1/(1 + actualMax - actualMin) };
					}
				}
				return { failureRate: 0 };
			}
		}
		if (opponent == void 0) return {};
		const untransformedPokemon = new calc.Pokemon(generation, pokemon.id, pokemonStats);
		const critRate = getCritRate(untransformedPokemon.species.baseStats.spe, move.name);
		const safePokemonId = (!move.isCrit && !!pokemon.transformedId) ? pokemon.transformedId : pokemon.id;
		const calcPokemon = new calc.Pokemon(generation, safePokemonId, pokemonStats);
		for (const stat in pokemon.boosts) {
			calcPokemon.boosts[stat] = pokemon.boosts[stat];
		}
		if (pokemon.status.toLowerCase().length !== 0) calcPokemon.status = pokemon.status.toLowerCase();
		const opposingId = (!move.isCrit && !!opponent.transformedId) ? opponent.transformedId : opponent.id;
		const opposingPokemonStats = getTransformedStats(generation, opponent.id, opponent.level, opponent.transformedId, opponent.transformedLevel);
		const opposingCalcPokemon = new calc.Pokemon(generation, opposingId, opposingPokemonStats);
		for (const stat in opponent.boosts) {
			opposingCalcPokemon.boosts[stat] = opponent.boosts[stat];
		}
		if (opponent.status.toLowerCase().length !== 0) opposingCalcPokemon.status = opponent.status.toLowerCase();
		move.isCrit = isCrit != void 0 ? isCrit : critRate >= 1;
		const fieldEffects = { defenderSide: { isReflect: opponent.hasReflect, isLightScreen: opponent.hasLightScreen } };
		const calculation = getCalculation(generation, calcPokemon, opposingCalcPokemon, move, fieldEffects);
		const isHighCritRate = isCrit != void 0 ? isCrit : critRate > .2735
		let critCalculation;
		if (isHighCritRate) {
			move.isCrit = true;
			critCalculation = getCalculation(generation, calcPokemon, opposingCalcPokemon, move, fieldEffects);
			if (!Array.isArray(critCalculation.damage)) critCalculation.damage = [critCalculation.damage];
		}
		const opposingHealthRange = getHealthRange(opponent.healthRemainingPercent, calculation.defender.stats.hp);

		const floor = 1000;
		if (Number.isNaN(calculation.damage) && !Array.isArray(calculation.damage)) return {};
		if (!Array.isArray(calculation.damage)) calculation.damage = [calculation.damage];
		const dmgs = {
			min: calculation.damage[0],
			max: (isHighCritRate ? critCalculation : calculation).damage[calculation.damage.length - 1]
		};
		if (dmgs.min > dmgs.max) [dmgs.min, dmgs.max] = [dmgs.max, dmgs.min];
		const damage = {
			range: isHighCritRate ? calculation.damage.concat(critCalculation.damage).sort((a, b) => a - b) : calculation.damage,
		}
		if (critRate > 0) damage.critRate = critRate;
		for (const dmgKey of Object.keys(dmgs)) {
			const dmg = dmgs[dmgKey];
			damage[dmgKey + "Damage"] = Math.floor(dmg/calculation.defender.stats.hp*floor)/floor;
	
			if (move.recoil != void 0) {
				const lowerDamage = dmg > calculation.defender.stats.hp ? calculation.defender.stats.hp : dmg;
				damage[dmgKey + "Recoil"] = (lowerDamage * (move.recoil[0] / move.recoil[1]))/calculation.attacker.stats.hp;
			}
			switch (moveName) {
				case "Fissure": case "Guillotine": case "Horn Drill":
					damage[dmgKey + "Damage"] = calculation.attacker.rawStats.spe < calculation.defender.rawStats.spe ? 0 : 1;
					break;
				case "Super Fang":
					damage[dmgKey + "Damage"] = pokemon.exactHealth != void 0 
						? opponent.healthRemainingPercent/200 
						: opposingHealthRange[dmgKey === "min" ? 0 : opposingHealthRange.length-1]/(2*calculation.defender.stats.hp);
					break;
				case "Bide": case "Counter": case "Metronome": case "Mirror Move":
					damage[dmgKey + "Damage"] = "?";
					break;
			}
		}
		const opponentHealth = (opponent.healthRemainingPercent/100)*calculation.defender.stats.hp;
		const hkoMultiple = dmgs.max > 0
			? Math.ceil(opponentHealth/dmgs.max)
			: null;
		if (hkoMultiple != void 0 && hkoMultiple !== 0) {
			if (hkoMultiple > 1000) {
				damage.hkoMultiple = 1000;
				damage.hkoPercentage = 0;
			}
			else {
				let hkos = 0;
				for (const damageResult of calculation.damage) {
					for (const opposingHealth of opposingHealthRange) {
						if (damageResult * hkoMultiple >= opposingHealth) hkos++;
					}
				}
				damage.hkoMultiple = hkoMultiple;
				damage.hkoPercentage = hkos/(calculation.damage.length*opposingHealthRange.length);
			}
		};
		return damage;
	}

	const unrevealedMoves = function(pokemon, revealedMoves) {
		const moveSets = JSON.parse(JSON.stringify(pokemon.moveSets));
		const allMoves = moveSets.map(ms => ms.moves).flat().filter((value, index, array) => array.indexOf(value) === index);
		const possibleMoveSets = moveSets.filter(ms => revealedMoves.every(rm => ms.moves.includes(rm.id)));
		if (possibleMoveSets.length < 1) return null;
		const totalPercentage = possibleMoveSets.map(pms => pms.percent).reduce((a, b) => a + b);
		possibleMoveSets.forEach((pms, index) => possibleMoveSets[index].percent = 100*pms.percent/totalPercentage);
		const possibleMoves = possibleMoveSets.map(pms => pms.moves).flat().filter((value, index, array) => array.indexOf(value) === index);
		const impossibleMoves = allMoves.filter(m => !possibleMoves.includes(m) && !revealedMoves.includes(m));
		const possibleMovePercentages = possibleMoves.map(pm => ({
			id: pm,
			name: consts.moves[pm].name,
			probability: possibleMoveSets.filter(pms => pms.moves.some(m => m == pm)).map(pms => pms.percent).reduce((a, b) => a + b)
		}));
		const impossibleMovePercentages = impossibleMoves.map(im => ({
			id: im,
			name: consts.moves[im].name,
			probability: 0
		}));
		const movePercentages = [...possibleMovePercentages, ...impossibleMovePercentages];
		movePercentages.sort((a, b) => b.id - a.id);
		movePercentages.sort((a, b) => b.probability - a.probability)
		return movePercentages;
	}

	return {
		buildSettingsPokemons,
		buildTeamTree,
		damage,
		unrevealedMoves
	}
}();