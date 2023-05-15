const util = function() {
	function factorialize(num) {
		if (num < 0) return -1;
		else if (num == 0) return 1;
		else return (num * factorialize(num - 1));
	}
	const calculateProbability = function(minItemCount, totalItemCount, totalCount, maxInstanceCount) {
		const fac1 = factorialize(totalCount - minItemCount);
		const fac2 = factorialize(totalCount);
		const fac3 = factorialize(totalItemCount - minItemCount);
		const fac4 = factorialize(totalItemCount);
		return (fac1/fac2) * (fac3/fac4);
	}

	const convertTsToObject = function(ts) {
		const convertedText = ts
			.substring(0, ts.lastIndexOf(";\n")) // remove ; at the end
			.substring(ts.indexOf("} = {") + 4) // remove TS method name
			.replace(/(?:\/\*(?:[^\*]|\**[^\*\/])*\*+\/)|(?:\/\/[\S ]*)/g, "") // remove comments
			.replace(/([{,]\n\s*)['"]?([a-z0-9A-Z_]+)['"]?/g, "$1\"$2\"") // add quotes to object names
			.replace(/,\s*}/g, "\n}"); // remove trailing commas
		return JSON.parse(convertedText);
	}
	
	const equalsIgnoreOrder = function(a, b) {
		if (a.length !== b.length) return false;
		const uniqueValues = new Set([...a, ...b]);
		for (const v of uniqueValues) {
			const aCount = a.filter(e => e === v).length;
			const bCount = b.filter(e => e === v).length;
			if (aCount !== bCount) return false;
		}
		return true;
	}
	
	const generateCombinations = function(sourceArray, comboLength) {
		if (comboLength > sourceArray.length) comboLength = sourceArray.length;
		const combos = [];
		const makeNextCombos = (workingCombo, currentIndex, remainingCount) => {
			const oneAwayFromComboLength = remainingCount == 1;
			for (let sourceIndex = currentIndex; sourceIndex < sourceArray.length; sourceIndex++) {
				const next = [ ...workingCombo, sourceArray[sourceIndex] ];
				if (oneAwayFromComboLength) combos.push(next);
				else makeNextCombos(next, sourceIndex + 1, remainingCount - 1);
			}
		}
		makeNextCombos([], 0, comboLength);
		return combos;
	}

	const removeDuplicates = function(arr, field, countField) {
		return arr.filter((item, index) => {
			const duplicates = arr.filter((checkItem, checkIndex) => {
				if (index > checkIndex) {
					const equals = field != null ? equalsIgnoreOrder(item[field], checkItem[field]) : item === checkItem;
					if (equals && countField != null) checkItem[countField] = checkItem[countField] + item[countField];
					return equals;
				}
				return false;
			});
			return duplicates.length === 0;
		});
	}

	const filterObject = function(obj, predicate) {
		return Object.keys(obj)
		.filter( key => predicate(obj[key]) )
		.reduce( (res, key) => (res[key] = obj[key], res), {} );
	}

	const capitalizeFirstLetter = function(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
	
	return {
		calculateProbability: calculateProbability,
		capitalizeFirstLetter: capitalizeFirstLetter,
		convertTsToObject: convertTsToObject,
		generateCombinations: generateCombinations,
		filterObject: filterObject,
		removeDuplicates: removeDuplicates
	}
}();