window.util = function() {
	const api = chrome || browser;
	const environment = "";
	const BattleTooltips = function() {
		function BattleTooltips(battle) {
			const _this = this;
			this.battle = undefined;
			this.clickTooltipEvent = function(e) {
				if (BattleTooltips.isLocked) {
					e.preventDefault();
					e.stopImmediatePropagation();
				}
			};
			this.holdLockTooltipEvent = function(e) {
				if (BattleTooltips.isLocked) BattleTooltips.hideTooltip();
				const target = e.currentTarget;
				_this.showTooltip(target);
				const factor = e.type === 'mousedown' && target.tagName === 'BUTTON' ? 2 : 1;
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
			this.parentElem = function() { return BattleTooltips.parentElem; }();
		}
		BattleTooltips.hideTooltip = function hideTooltip() {
			if (!BattleTooltips.elem || !BattleTooltips.elem.parentNode) return;
			BattleTooltips.elem.parentNode.removeChild(BattleTooltips.elem);
			BattleTooltips.elem = null;
			BattleTooltips.parentElem = null;
			BattleTooltips.isLocked = false;
			document.querySelector("#tooltipwrapper").classList.remove("tooltip-locked");
		};
		const _proto = BattleTooltips.prototype;
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
		_proto.showTooltip = function showTooltip(html, elem, type, dataAttributes) {
			this.placeTooltip(html, elem, true, type, dataAttributes);
			return true;
		};
		_proto.placeTooltip = function placeTooltip(htmlElement, hoveredElem, notRelativeToParent, type, dataAttributes) {
			let elem;
			if (hoveredElem) {
				elem = hoveredElem;
			} else {
				if (this.battle == undefined) return;
				elem = this.battle.scene.$turn[0];
				notRelativeToParent = true;
			}
			const hoveredX1 = elem.getBoundingClientRect().left;
			if (!notRelativeToParent) {
				elem = elem.parentNode;
			}
			const hoveredY1 = elem.getBoundingClientRect().top;
			const hoveredY2 = hoveredY1 + elem.offsetHeight;
			let x = Math.max(hoveredX1 - 2, 0);
			let y = Math.max(hoveredY1 - 5, 0);
			let wrapper = document.querySelector("#tooltipwrapper");
			if (wrapper == undefined) {
				wrapper = document.createElement("div");
				wrapper.id = "tooltipwrapper";
				wrapper.setAttribute("role", "tooltip");
				document.body.appendChild(wrapper);
				wrapper.addEventListener("click", function() {
					try {
						const selection = window.getSelection();
						if (selection.type === 'Range')	return;
					} catch (err) {}
					BattleTooltips.hideTooltip();
				});
			} else {
				wrapper.classList.remove("tooltip-locked");
			}
			wrapper.style.left = x + "px";
			wrapper.style.top = y + "px";
			if (htmlElement != undefined) {
				const tooltipInnerDiv = document.createElement('div');
				tooltipInnerDiv.className = 'tooltipinner';
				const tooltipDiv = document.createElement('div');
				tooltipDiv.className = 'tooltip tooltip-' + type;
				tooltipDiv.appendChild(htmlElement);
				tooltipInnerDiv.appendChild(tooltipDiv);
				wrapper.textContent = '';
				wrapper.appendChild(tooltipInnerDiv);
			}
			document.body.appendChild(wrapper);
			BattleTooltips.elem = wrapper.querySelector(".tooltip");
			BattleTooltips.isLocked = false;
			const height = BattleTooltips.elem.offsetHeight;
			if (y - height < 1) {
				y = hoveredY2 + height + 5;
				if (y > document.documentElement.clientHeight) {
					y = height + 1;
				}
				wrapper.style.top = y + "px";
			} else if (y < 70) {
				y = hoveredY2 + height + 5;
				if (y < document.documentElement.clientHeight) {
					wrapper.style.top = y + "px";
				}
			}
			const width = BattleTooltips.elem.offsetWidth;
			if (x > document.documentElement.clientWidth - width - 2) {
				x = document.documentElement.clientWidth - width - 2;
				wrapper.style.left = x + "px";
			}
			if (dataAttributes != undefined) {
				for (const key in dataAttributes) {
					BattleTooltips.elem.setAttribute("data-" + key, dataAttributes[key]);
				}
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

	const capitalizeFirstLetter = function(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	const filterObject = function(obj, predicate) {
		return Object.keys(obj)
			.filter( key => predicate(obj[key]) )
			.reduce( (res, key) => (res[key] = obj[key], res), {} );
	}

	const getMostSimilarString = function(pokemonName, pokemonNames, maxDistance) {
		if (pokemonName === "mrmime") pokemonName = "mr.mime";
		if (maxDistance == undefined) maxDistance = Infinity;
		const levenshteinDistance = (str1 = '', str2 = '') => {
			const track = Array(str2.length + 1).fill(null).map(() =>
			Array(str1.length + 1).fill(null));
			for (let i = 0; i <= str1.length; i += 1) {
			   track[0][i] = i;
			}
			for (let j = 0; j <= str2.length; j += 1) {
			   track[j][0] = j;
			}
			for (let j = 1; j <= str2.length; j += 1) {
			   for (let i = 1; i <= str1.length; i += 1) {
				  const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
				  track[j][i] = Math.min(
					 track[j][i - 1] + 1,
					 track[j - 1][i] + 1,
					 track[j - 1][i - 1] + indicator,
				  );
			   }
			}
			return track[str2.length][str1.length];
		};
		const distanceCalc = function(str1, str2) {
			let secondString = str2.slice().toLowerCase();
			let firstString = str1.slice().toLowerCase();
			let distance = firstString.length;
			for (let i = 0; i < firstString.length; i++) {
				for (let j = 0; j < secondString.length; j++) {
					if (firstString[i] === secondString[j]) {
						secondString = secondString.slice(0, j) + secondString.slice(j + 1);
						distance--;
						break;
					}
				}
			}
			return distance;
		}
		let mostSimilarString;
		let shortestDistance = Infinity;
		for (const secondName of pokemonNames) {
			const distance = levenshteinDistance(pokemonName, secondName);
			if (distance < shortestDistance) {
				mostSimilarString = secondName;
				shortestDistance = distance;
			}
			else if (distance == shortestDistance) {
				const mostSimilarDistance1 = distanceCalc(pokemonName, mostSimilarString);
				const mostSimilarDistance2 = distanceCalc(mostSimilarString, pokemonName);
				const mostSimilarDistance = Math.min(mostSimilarDistance1, mostSimilarDistance2);
				const secondDistance1 = distanceCalc(pokemonName, secondName);
				const secondDistance2 = distanceCalc(secondName, pokemonName);
				const secondDistance = Math.min(secondDistance1, secondDistance2);
				if (secondDistance < mostSimilarDistance) {
					mostSimilarString = secondName;
				}
			}
		}
		if (shortestDistance > maxDistance) {
			return null;
		}
		return mostSimilarString;
	}

	const getNearestRelativeElement = function(element, selector) {
		while(element.parentNode && element.nodeName.toLowerCase() != 'body') {
			const relative = element.querySelector(selector);
			if (relative != undefined) {
				return relative;
			}
			element = element.parentNode;
		}
		return null;
	}

	const randomNumbersGenerator = function(seed, lengths) {
		const hashCode = function(str) {
			let hash = 0;
			for (let i = 0, len = str.length; i < len; i++) {
				let chr = str.charCodeAt(i);
				hash = (hash << 5) - hash + chr;
				hash |= 0;
			}
			return hash;
		}

		const splitmix32 = function(a) {
			return function() {
				a |= 0;
				a = a + 0x9e3779b9 | 0;
				let t = a ^ a >>> 16;
				t = Math.imul(t, 0x21f0aaad);
				t = t ^ t >>> 15;
				t = Math.imul(t, 0x735a2d97);
				return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
			}
		}

		const initialSeed = hashCode(seed);
		let array = [];
		const prng = splitmix32(initialSeed);
		if (lengths == undefined) return prng();
		for (let i = 0; i < lengths.length; i++) {
			const length = lengths[i];
			const rangedRandom = Math.floor(prng() * length);
			array.push(rangedRandom);
		}
		return array;
	}

	const replaceIdWithSafeId = function(id, pokemon, replaceSpace, typos) {
		let safeId = getMostSimilarString(id, Object.keys(pokemon));
		if (!!typos && !!typos[id]) {
			safeId = typos[id];
		}
		safeId = replaceSpace
			? safeId.replace(" ", "-")
			: safeId;
		return safeId;
	}

	const getRooBYFormats = function() {
		return fetch("https://datumlocker.com/rooby/formats.json?timestamp=" + new Date().getTime())
			.then(response => response.json())
	}

	const reportRooBYLadder = function(id, link, status) {
		let fetchString = "https://datumlocker.com/rooby/report.php?timestamp=" + new Date().getTime();
		if (id) fetchString += "&id=" + id;
		if (link) fetchString += "&link=" + link;
		if (status) fetchString += "&status=" + status;
		if (environment) fetchString += "&env=" + environment;
		return fetch(fetchString).then(response => response.json())
	}

	const requestRooBYLadder = function(username, format, id, cancel) {
		let fetchString = "https://datumlocker.com/rooby/request.php?username=" + username + "&format=" + format + "&timestamp=" + new Date().getTime();
		if (id) fetchString += "&id=" + id;
		if (cancel) fetchString += "&cancel=true";
		if (environment) fetchString += "&env=" + environment;
		return fetch(fetchString).then(response => response.json())
	}

	const loadRooBYLadderData = function() {
		return fetch("https://datumlocker.com/rooby/" + environment + "ladder.json?timestamp=" + new Date().getTime())
			.then(response => response.json())
	}

	const loadRooBYLeaderboardData = function() {
		return fetch("https://datumlocker.com/rooby/" + environment + "leaderboard.json?timestamp=" + new Date().getTime())
			.then(response => response.json())
	}

	const loadLadderData = function(format, url) {
		return fetch(url + format + ".json")
			.then(response => response.json())
	}

	const loadRandomsData = function(format, url) {
		return fetch(url[format])
			.then(response => response.json())
	}

	const loadRatingsData = function(name, url) {
		try {
			return fetch(url + name + ".json")
				.then(response => response.json());
		}
		catch (error) {
			return;
		}
	}
	
	const pruneCalculations = function(pokemons) {
		const rooms = document.querySelectorAll(".ps-room-opaque");
		const saveMonNumbers = [];
		for (const room of rooms) {
			const trainers = room.querySelectorAll(".trainer");
			for (const trainer of trainers) {
				const revealedPokemonNames = Array.from(trainer.querySelectorAll(".teamicons")).map(node => Array.from(node.querySelectorAll(".has-tooltip"))).flat().map(node => node.getAttribute("aria-label").split("(")[0].trim()).slice(0, 5);
				let revealedPokemonNumbers = revealedPokemonNames.map(rpn => pokemons.find(p => p.name === rpn)).filter(p => p !== undefined).map(p => p.number).slice(0,3);
				saveMonNumbers.push(revealedPokemonNumbers);
			}
		}
		api.runtime.sendMessage({function:"prune", args: {saveMonNumbers, pokemons}});
		void api.runtime.lastError;
	}

	const debounce = function(func, delay, timeoutId, ...args) {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		return setTimeout(() => {
			func(...args);
		}, delay);
	}

	const getStorage = async function(key) {
		const result = await api.storage.local.get(key);
		if (result == undefined && key === "settings") return consts.defaultSettings;
		return key != null ? result[key] : result;
	}

	const saveStorage = async function(key, subkey, value) {
		if (value == undefined) {
			value = subkey;
			subkey = undefined;
		}
		let storage = await getStorage(key) ?? {};
		if (subkey != undefined) {
			storage[subkey] = value;
		}
		else storage[key] = value;
		await api.storage.local.set({ [key]: storage });
	}

	const slugify = function(str) {
		const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
		const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
		const p = new RegExp(a.split('').join('|'), 'g')
		
		return str.toString().toLowerCase()
			.replace(/\s+/g, '-') // Replace spaces with -
			.replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
			.replace(/[^\w-]+/g, '') // Remove all non-word characters
			.replace(/^-+/, '') // Trim - from start of text
			.replace(/-+$/, '') // Trim - from end of text
	}

	return {
		battleTooltips,
		capitalizeFirstLetter,
		debounce,
		filterObject,
		getRooBYFormats,
		getStorage,
		getMostSimilarString,
		loadLadderData,
		loadRandomsData,
		loadRatingsData,
		loadRooBYLadderData,
		loadRooBYLeaderboardData,
		getNearestRelativeElement,
		pruneCalculations,
		randomNumbersGenerator,
		replaceIdWithSafeId,
		reportRooBYLadder,
		requestRooBYLadder,
		saveStorage,
		slugify
	}
}();