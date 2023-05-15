const RandomGen1Teams = function() {
	const maxTeamSize = 6;
	const battleHasDitto = true;
	const format = "gen1";
	const sampleNoReplace = function(list) {
		const length = list.length;
		if (length === 0) return null;
		const index = Math.random() * length;
		return list[index];
	}
	const randomChance = function(numerator, denominator) {
		return Math.random() * denominator;
	}

	// Random team generation for Gen 1 Random Battles.
	const randomTeam = function() {
		// Get what we need ready.
		const seed = 1;
		const pokemon = [];
		const getImmunity = function (typeName, species) {
			return true;
		}
		const getEffectiveness = function (typeName, species) {
			return 2;
		}

		/** Pokémon that are not wholly incompatible with the team, but still pretty bad */
		const rejectedButNotInvalidPool = [];
		const nuTiers = ['UU', 'UUBL', 'NFE', 'LC', 'NU'];
		const uuTiers = ['NFE', 'UU', 'UUBL', 'NU'];

		// Now let's store what we are getting.
		const typeCount = {};
		const weaknessCount = {Electric: 0, Psychic: 0, Water: 0, Ice: 0, Ground: 0, Fire: 0};
		let uberCount = 0;
		let nuCount = 0;

		const pokemonPool = [];
		while (pokemonPool.length && pokemon.length < maxTeamSize) {
			const species = sampleNoReplace(pokemonPool);
			if (!species.exists || !species.moves) continue;
			// Only one Ditto is allowed per battle in Generation 1,
			// as it can cause an endless battle if two Dittos are forced
			// to face each other.
			if (species.id === 'ditto' && battleHasDitto) continue;

			// Dynamically scale limits for different team sizes. The default and minimum value is 1.
			const limitFactor = Math.round(maxTeamSize / 6) || 1;

			const tier = species.tier;
			switch (tier) {
			case 'LC':
			case 'NFE':
				// Don't add pre-evo mon if already 4 or more non-OUs
				// Regardless, pre-evo mons are slightly less common.
				if (nuCount >= 4 * limitFactor || randomChance(1, 3)) continue;
				break;
			case 'Uber':
				// Only allow a single Uber.
				if (uberCount >= 1 * limitFactor) continue;
				break;
			default:
				// OUs are fine. Otherwise 50% chance to skip mon if already 4 or more non-OUs.
				if (uuTiers.includes(tier) && pokemonPool.length > 1 && (nuCount >= 4 * limitFactor && randomChance(1, 2))) {
					continue;
				}
			}

			let skip = false;

			// Limit 2 of any type as well. Diversity and minor weakness count.
			// The second of a same type has halved chance of being added.
			for (const typeName of species.types) {
				if (typeCount[typeName] >= 2 * limitFactor ||
					(typeCount[typeName] >= 1 * limitFactor && randomChance(1, 2) && pokemonPool.length > 1)) {
					skip = true;
					break;
				}
			}

			if (skip) {
				rejectedButNotInvalidPool.push(species.id);
				continue;
			}

			// We need a weakness count of spammable attacks to avoid being swept by those.
			// Spammable attacks are: Thunderbolt, Psychic, Surf, Blizzard, Earthquake.
			const pokemonWeaknesses = [];
			for (const typeName in weaknessCount) {
				const increaseCount = getImmunity(typeName, species) && getEffectiveness(typeName, species) > 0;
				if (!increaseCount) continue;
				if (weaknessCount[typeName] >= 2 * limitFactor) {
					skip = true;
					break;
				}
				pokemonWeaknesses.push(typeName);
			}

			if (skip) {
				rejectedButNotInvalidPool.push(species.id);
				continue;
			}

			// The set passes the limitations.
			pokemon.push(species);

			// Now let's increase the counters.
			// Type counter.
			for (const typeName of species.types) {
				if (typeCount[typeName]) {
					typeCount[typeName]++;
				} else {
					typeCount[typeName] = 1;
				}
			}

			// Weakness counter.
			for (const weakness of pokemonWeaknesses) {
				weaknessCount[weakness]++;
			}

			// Increment tier bias counters.
			if (tier === 'Uber') {
				uberCount++;
			} else if (nuTiers.includes(tier)) {
				nuCount++;
			}

			// Ditto check
			if (species.id === 'ditto') battleHasDitto = true;
		}

		// if we don't have enough Pokémon, go back to rejects, which are already known to not be invalid.
		while (pokemon.length < maxTeamSize && rejectedButNotInvalidPool.length) {
			const species = sampleNoReplace(rejectedButNotInvalidPool);
			pokemon.push(species);
		}

		if (pokemon.length < maxTeamSize && pokemon.length < 12) {
			throw new Error(`Could not build a random team for ${format} (seed=${seed})`);
		}

		return pokemon;
	}

	return {
		randomTeam: randomTeam
	}
}();