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

	const BattleTooltips = function() {
		function BattleTooltips(battle) {
			var _this = this;
			this.battle = void 0;
			this.clickTooltipEvent = function(e) {
				if (BattleTooltips.isLocked) {
					e.preventDefault();
					e.stopImmediatePropagation();
				}
			};
			this.holdLockTooltipEvent = function(e) {
				if (BattleTooltips.isLocked) BattleTooltips.hideTooltip();
				var target = e.currentTarget;
				_this.showTooltip(target);
				var factor = e.type === 'mousedown' && target.tagName === 'BUTTON' ? 2 : 1;
				BattleTooltips.longTapTimeout = setTimeout(function() {
					BattleTooltips.longTapTimeout = 0;
					_this.lockTooltip();
				}, BattleTooltips.LONG_TAP_DELAY * factor);
			};
			this.showTooltipEvent = function(e) {
				if (BattleTooltips.isLocked)
					return;
				_this.showTooltip(e.currentTarget);
			};
			this.battle = battle;
		}
		BattleTooltips.hideTooltip = function hideTooltip() {
			if (!BattleTooltips.elem) return;
			BattleTooltips.elem.parentNode.removeChild(BattleTooltips.elem);
			BattleTooltips.elem = null;
			BattleTooltips.parentElem = null;
			BattleTooltips.isLocked = false;
			document.querySelector("#tooltipwrapper").classList.remove("tooltip-locked");
		};
		var _proto = BattleTooltips.prototype;
		_proto.lockTooltip = function lockTooltip() {
			if (BattleTooltips.elem && !BattleTooltips.isLocked) {
				BattleTooltips.isLocked = true;
				if (BattleTooltips.isPressed) {
					BattleTooltips.parentElem.classList.remove("pressed");
					BattleTooltips.isPressed = false;
				}
				document.querySelector("#tooltipwrapper").classList.add("tooltip-locked");
			}
		};
		_proto.listen = function listen(elem) {
				const hasTooltip = elem.querySelector('.has-tooltip');
				hasTooltip.addEventListener('mouseover', this.showTooltipEvent.bind(this));
				hasTooltip.addEventListener('click', this.clickTooltipEvent.bind(this));
				hasTooltip.addEventListener('focus', this.showTooltipEvent.bind(this));
				hasTooltip.addEventListener('mouseout', BattleTooltips.unshowTooltip.bind(BattleTooltips));
				hasTooltip.addEventListener('mousedown', this.holdLockTooltipEvent.bind(this));
				hasTooltip.addEventListener('blur', BattleTooltips.unshowTooltip.bind(BattleTooltips));
				hasTooltip.addEventListener('mouseup', BattleTooltips.unshowTooltip.bind(BattleTooltips));
		};
		BattleTooltips.unshowTooltip = function unshowTooltip() {
			if (BattleTooltips.isLocked) return;
			if (BattleTooltips.isPressed) {
				BattleTooltips.parentElem.classList.remove("pressed");
				BattleTooltips.isPressed = false;
			}
			BattleTooltips.hideTooltip();
		};
		_proto.showTooltip = function showTooltip(html, elem) {
			this.placeTooltip(html, elem);
			return true;
		};
		_proto.placeTooltip = function placeTooltip(innerHTML, hoveredElem, notRelativeToParent, type) {
			var elem;
			if (hoveredElem) {
				elem = hoveredElem;
			} else {
				elem = this.battle.scene.$turn[0];
				notRelativeToParent = true;
			}
			var hoveredX1 = elem.getBoundingClientRect().left;
			if (!notRelativeToParent) {
				elem = elem.parentNode;
			}
			var hoveredY1 = elem.getBoundingClientRect().top;
			var hoveredY2 = hoveredY1 + elem.offsetHeight;
			var x = Math.max(hoveredX1 - 2, 0);
			var y = Math.max(hoveredY1 - 5, 0);
			var wrapper = document.querySelector("#tooltipwrapper");
			if (wrapper == void 0) {
				wrapper = document.createElement("div");
				wrapper.id = "tooltipwrapper";
				wrapper.setAttribute("role", "tooltip");
				document.body.appendChild(wrapper);
				wrapper.addEventListener("click", function(e) {
					try {
						var selection = window.getSelection();
						if (selection.type === 'Range')	return;
					} catch (err) {}
					BattleTooltips.hideTooltip();
				});
			} else {
				wrapper.classList.remove("tooltip-locked");
			}
			wrapper.style.left = x + "px";
			wrapper.style.top = y + "px";
			innerHTML = "<div class=\"tooltipinner\"><div class=\"tooltip tooltip-" + type + "\">" + innerHTML + "</div></div>";
			wrapper.innerHTML = innerHTML;
			document.body.appendChild(wrapper);
			BattleTooltips.elem = wrapper.querySelector(".tooltip");
			BattleTooltips.isLocked = false;
			var height = BattleTooltips.elem.offsetHeight;
			if (y - height < 1) {
				y = hoveredY2 + height + 5;
				if (y > document.documentElement.clientHeight) {
					y = height + 1;
				}
				wrapper.style.top = y + "px";
			} else if (y < 75) {
				y = hoveredY2 + height + 5;
				if (y < document.documentElement.clientHeight) {
					wrapper.style.top = y + "px";
				}
			}
			var width = BattleTooltips.elem.offsetWidth;
			if (x > document.documentElement.clientWidth - width - 2) {
				x = document.documentElement.clientWidth - width - 2;
				wrapper.style.left = x + "px";
			}
	
			BattleTooltips.parentElem = hoveredElem || null;
			return true;
		};
		_proto.hideTooltip = function hideTooltip() {
			BattleTooltips.hideTooltip();
		};
		return BattleTooltips;
	}();

	const battleTooltips = new BattleTooltips();
	
	const loadRandomsData = function(buildFunc, format) {
		if (consts.pokemons != void 0) return new Promise();
		const randomDataUrl = consts.randomDataUrl[format];
		const formatsDataUrl = consts.formatsDataUrl[format];
		//return fetch("https://cors-anywhere.herokuapp.com/" + formatsDataUrl)
		return fetch(formatsDataUrl)
			.then(response => response.text())
			.then(formatsData => {
				return fetch(randomDataUrl)
				.then(response => response.json())
				.then(randomData => {
					let formats = util.convertTsToObject(formatsData);
					let pokemons = [];
					for (const pokemon in randomData) {
						pokemons.push(pokemon);
					}
					buildFunc(randomData, formats);
				})
			});
	}
	
	return {
		battleTooltips: battleTooltips,
		calculateProbability: calculateProbability,
		capitalizeFirstLetter: capitalizeFirstLetter,
		convertTsToObject: convertTsToObject,
		generateCombinations: generateCombinations,
		filterObject: filterObject,
		loadRandomsData: loadRandomsData,
		removeDuplicates: removeDuplicates
	}
}();