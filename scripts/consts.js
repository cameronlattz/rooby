const consts = function() {
	const defaultSettings = {
		sprites: {
			front: "0",
			back: "0",
			icons: "2",
			shiny: "2",
			"back-shiny": "2"
		},
		backdrop: "0",
		shinyPercentage: 0,
		damageCalculator: true,
		movesetCalculator: true,
		unrevealedCalculator: true,
		miscCalculator: true,
		trainerTooltip: true,
		useModernSprites: false
	};

	const defaultSimulations = 100000;

	const spammableTypes = ["electric", "psychic", "water", "ice", "ground", "fire"];

	const redundantSets = [
		["selfdestruct", "rest"],
		["hydropump", "surf"]
	];
	
	const backdrops = [
		"fx/bg-beach.png",
		"fx/bg-beachshore.png",
		"fx/bg-city.png",
		"fx/bg-dampcave.png",
		"fx/bg-deepsea.png",
		"fx/bg-desert.png",
		"fx/bg-earthycave.png",
		"fx/bg-forest.png",
		"fx/bg-gen1-spl.png",
		"fx/bg-gen1.png",
		"fx/bg-gen2-spl.png",
		"fx/bg-gen2.png",
		"fx/bg-gen3-arena.png",
		"fx/bg-gen3-cave.png",
		"fx/bg-gen3-forest.png",
		"fx/bg-gen3-ocean.png",
		"fx/bg-gen3-sand.png",
		"fx/bg-gen3-spl.png",
		"fx/bg-gen3.png",
		"fx/bg-gen4-cave.png",
		"fx/bg-gen4-indoors.png",
		"fx/bg-gen4-snow.png",
		"fx/bg-gen4-spl.png",
		"fx/bg-gen4-water.png",
		"fx/bg-gen4.png",
		"fx/bg-icecave.png",
		"fx/bg-meadow.png",
		"fx/bg-mountain.png",
		"fx/bg-river.png",
		"fx/bg-route.png",
		"fx/bg-space.jpg",
		"fx/bg-spl.png",
		"fx/client-bg-horizon.jpg",
		"fx/client-bg-waterfall.jpg",
		"fx/bg-thunderplains.png",
		"fx/bg-volcanocave.png",
		"fx/weather-electricterrain.png",
		"fx/weather-grassyterrain.png",
		"fx/weather-gravity.png",
		"fx/weather-hail.png",
		"fx/weather-magicroom.png",
		"fx/weather-mistyterrain.png",
		"fx/weather-psychicterrain.png",
		"fx/weather-raindance.jpg",
		"fx/weather-sandstorm.png",
		"fx/weather-strongwind.png",
		"fx/weather-sunnyday.jpg",
		"fx/weather-trickroom.png",
		"fx/weather-wonderroom.png",
		"sprites/gen6bgs/bg-aquacordetown.jpg",
		"sprites/gen6bgs/bg-beach.jpg",
		"sprites/gen6bgs/bg-city.jpg",
		"sprites/gen6bgs/bg-dampcave.jpg",
		"sprites/gen6bgs/bg-darkbeach.jpg",
		"sprites/gen6bgs/bg-darkcity.jpg",
		"sprites/gen6bgs/bg-darkmeadow.jpg",
		"sprites/gen6bgs/bg-deepsea.jpg",
		"sprites/gen6bgs/bg-desert.jpg",
		"sprites/gen6bgs/bg-earthycave.jpg",
		"sprites/gen6bgs/bg-elite4drake.jpg",
		"sprites/gen6bgs/bg-forest.jpg",
		"sprites/gen6bgs/bg-icecave.jpg",
		"sprites/gen6bgs/bg-leaderwallace.jpg",
		"sprites/gen6bgs/bg-library.jpg",
		"sprites/gen6bgs/bg-meadow.jpg",
		"sprites/gen6bgs/bg-orasdesert.jpg",
		"sprites/gen6bgs/bg-orassea.jpg",
		"sprites/gen6bgs/bg-skypillar.jpg"
	];

	const spriteSets = {
		afd: {
			front: true,
			back: true,
			shiny: true,
			icons: "gen5"
		},
		ani: {
			extension: "gif",
			front: true,
			back: true,
			shiny: true,
			icons: "gen5",
			substitute: "gen5"
		},
		"digimon/sprites/pokemon": {
			text: "digimon",
			front: true,
			back: true,
			shiny: true,
			icons: "digimon",
			substitute: "gen1",
			typos: {
				"blastoise": "blastiose",
				"cubone": "cuebone",
				"diglett": "diglet",
				"farfetchd": "farfetch'd",
				"mrmime": "mr. mime",
				"nidoranf": "nidoran f",
				"nidoranm": "nidoran m",
				"wartortle": "warturtle"
			}
		},
		gen1: {
			front: true,
			back: true,
			icons: "pokemon",
			shiny: "gen2spaceworld-shiny"
		},
		gen1artrb: {
			front: true,
			back: "gen1-back",
			icons: "art",
			substitute: "gen1",
			shiny: "gen2spaceworld-shiny"
		},
		gen1artrg: {
			front: true,
			back: "gen1-back",
			icons: "art",
			substitute: "gen1",
			shiny: "gen2spaceworld-shiny"
		},
		gen1rgb: {
			back: true,
			icons: "pokemon",
			substitute: "gen1",
			shiny: "gen2spaceworld-shiny"
		},
		gen1rb: {
			front: true,
			back: "gen1rgb-back",
			icons: "pokemon",
			substitute: "gen1",
			shiny: "gen2spaceworld-shiny"
		},
		gen1rg: {
			front: true,
			back: "gen1rgb-back",
			icons: "pokemon",
			substitute: "gen1",
			shiny: "gen2spaceworld-shiny"
		},
		gen2spaceworld: {
			front: true,
			back: true,
			icons: "pokemon",
			substitute: "gen1",
			shiny: true,
			local: true
		},
		gen2: {
			front: true,
			back: true,
			shiny: true,
			icons: "pokemon",
			substitute: "gen1"
		},
		gen2g: {
			front: true,
			back: "gen2-back",
			shiny: "gen2-shiny",
			icons: "pokemon",
			substitute: "gen1"
		},
		gen2s: {
			front: true,
			back: "gen2-back",
			icons: "pokemon",
			shiny: "gen2-shiny",
			substitute: "gen1"
		},
		gen3: {
			front: true,
			back: true,
			icons: "pokemon",
			shiny: true
		},
		gen3frlg: {
			front: true,
			back: true,
			icons: "pokemon",
			shiny: "gen3-shiny",
			substitute: "gen3"
		},
		gen3rs: {
			front: true,
			back: true,
			icons: "pokemon",
			shiny: "gen3rs-shiny",
			substitute: "gen3"
		},
		gen4: {
			front: true,
			back: true,
			shiny: true,
			icons: "gen5"
		},
		gen5: {
			front: true,
			back: true,
			shiny: true,
			icons: "gen5"
		},
		gen5ani: {
			extension: "gif",
			front: true,
			back: true,
			shiny: true,
			icons: "gen5",
			substitute: "gen5"
		}
	};
	
	const physicalSetupMoves = ["swordsdance", "sharpen"];
	
	const specialSetupMoves = ["growth"];

	const maxTeamSize = 6;

	const randomsDataUrl = {
		"gen1": "https://raw.githubusercontent.com/smogon/pokemon-showdown/master/data/random-battles/gen1/data.json"
	};
	
	const formatsDataUrl = {
		"gen1": "https://raw.githubusercontent.com/smogon/pokemon-showdown/master/data/mods/gen1/formats-data.ts"
	};

	const laddersUrl = "https://pokemonshowdown.com/ladder/";

	const ratingsDataUrl = "https://pokemonshowdown.com/users/";
	
	const gameUrls = ["https://play.pokemonshowdown.com", "https://replay.pokemonshowdown.com"];

	const gameTypes = ["Random Battle", "OU", "Ubers", "UU", "NU", "PU", "1v1", "Tradebacks OU", "Challenge Cup"];
	
	const transformedIntoString = "(Transformed into ";

	const confusionDamages = [
		[6.8,11.9],
		[6.5,10.8],
		[6.3,9.6],
		[7.8,13.5],
		[7.2,11.6],
		[7,10.3],
		[5.8,10.3],
		[5.9,9.7],
		[5.8,8.6],
		[5.1,11.3],
		[3,7.9],
		[5.6,10.2],
		[6.4,13.1],
		[3.8,9.2],
		[9.9,15],
		[7.1,13.1],
		[6.7,11.2],
		[6.5,9.8],
		[9.5,16.7],
		[8.9,13.4],
		[10.2,17],
		[8.7,12.6],
		[8.8,15],
		[8.4,12.4],
		[9.5,16.8],
		[9.9,14.2],
		[6.9,10.9],
		[6.5,9.3],
		[5.8,10.5],
		[5.8,9.9],
		[6,8.9],
		[8.1,14.2],
		[7.7,12.3],
		[7.4,10.7],
		[5.2,9.9],
		[5.6,8.7],
		[6.5,12.5],
		[6.6,10],
		[5.8,10.9],
		[5.8,9.1],
		[7.4,13.8],
		[7.1,10.8],
		[6.5,11.3],
		[6.5,10.5],
		[6.2,9.6],
		[9.2,14.7],
		[8.4,12.1],
		[6.5,11.5],
		[6.7,10.8],
		[12.6,22],
		[11,16.5],
		[7.4,13.8],
		[7.2,11.4],
		[6.9,11.9],
		[6.6,9.9],
		[12.4,18.7],
		[10.5,14.7],
		[8.9,14.1],
		[8.1,11.2],
		[7.8,13.8],
		[6.6,10.5],
		[5.7,8.6],
		[5.5,15],
		[6.4,13.1],
		[6.7,11.8],
		[8.7,13.1],
		[8.5,12.1],
		[9.4,12.5],
		[10.9,16.8],
		[9.9,14.7],
		[9.1,12.9],
		[6.7,13.1],
		[6.3,10.2],
		[7.1,11],
		[7,9.9],
		[6.3,8.5],
		[9.9,14.9],
		[9.3,13.2],
		[5.7,9.1],
		[4.6,7.1],
		[4.7,9.9],
		[5.3,8.9],
		[7.8,12.4],
		[12.1,17.9],
		[10.5,14.2],
		[5.1,9.6],
		[5.5,8.4],
		[8.3,12.4],
		[7.5,10.4],
		[6.5,10.3],
		[5.3,7.6],
		[6.8,14.1],
		[7.2,12.6],
		[7.1,11.5],
		[3.3,6.2],
		[6.2,11.1],
		[6.2,9.7],
		[10.6,14.8],
		[9.3,12.1],
		[4.6,9.9],
		[5.3,9],
		[4,7.7],
		[6.6,9.7],
		[4.6,8.3],
		[5.9,9],
		[13.9,18.8],
		[9.9,13.9],
		[4.4,7.8],
		[6,9.9],
		[6,8.7],
		[6.1,9.1],
		[6.8,9],
		[1,5],
		[3.9,6.9],
		[6.5,9.4],
		[5.3,10.3],
		[5.4,8.9],
		[7.8,12.6],
		[8.3,11.8],
		[6.5,12.2],
		[6.5,10.2],
		[5.7,10.2],
		[9,12.5],
		[6.9,12.3],
		[8.7,12.9],
		[9.9,14.1],
		[9,12.3],
		[7.4,10.2],
		[2.5,8.6],
		[8.9,12],
		[5.4,7.8],
		[6.4,11.7],
		[6.7,11.8],
		[5,8],
		[6.9,11.1],
		[12.9,17.1],
		[5.7,9.6],
		[4,8.1],
		[4.1,6.7],
		[8.4,12.5],
		[8.4,11.5],
		[9.1,12.9],
		[6.7,9.2],
		[5.5,8.4],
		[6.5,9.4],
		[7,9.9],
		[9.1,14.7],
		[8.3,12.6],
		[8.8,11.4],
		[7,9.6],
		[6.2,8.7]
	]
	
	const moves = {
		absorb: {
			num: 71,
			accuracy: 100,
			basePower: 20,
			category: "Special",
			name: "Absorb",
			pp: 25,
			priority: 0,
			flags: {protect: 1, mirror: 1, heal: 1},
			drain: [1, 2],
			target: "normal",
			type: "Grass"
		},
		acid: {
			num: 51,
			accuracy: 100,
			basePower: 40,
			category: "Special",
			name: "Acid",
			pp: 30,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: {
				chance: 10,
				boosts: {
					spd: -1
				}
			},
			target: "allAdjacentFoes",
			type: "Poison"
		},
		acidarmor: {
			num: 151,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Acid Armor",
			pp: 20,
			priority: 0,
			flags: {snatch: 1},
			boosts: {
				def: 2
			},
			target: "self",
			type: "Poison"
		},
		agility: {
			num: 97,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Agility",
			pp: 30,
			priority: 0,
			flags: {snatch: 1},
			boosts: {
				spe: 2,
			},
			target: "self",
			type: "Psychic"
		},
		amnesia: {
			num: 133,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Amnesia",
			pp: 20,
			priority: 0,
			flags: {snatch: 1},
			boosts: {
				spd: 2,
			},
			target: "self",
			type: "Psychic"
		},
		aurorabeam: {
			num: 62,
			accuracy: 100,
			basePower: 65,
			category: "Special",
			name: "Aurora Beam",
			pp: 20,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: {
				chance: 10,
				boosts: {
					atk: -1
				}
			},
			target: "normal",
			type: "Ice"
		},
		barrage: {
			num: 140,
			accuracy: 85,
			basePower: 15,
			category: "Physical",
			name: "Barrage",
			pp: 20,
			priority: 0,
			flags: {bullet: 1, protect: 1, mirror: 1},
			multihit: [2, 5],
			target: "normal",
			type: "Normal"
		},
		barrier: {
			num: 112,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Barrier",
			pp: 20,
			priority: 0,
			flags: {snatch: 1},
			boosts: {
				def: 2
			},
			target: "self",
			type: "Psychic"
		},
		bide: {
			num: 117,
			accuracy: true,
			basePower: 0,
			category: "Physical",
			name: "Bide",
			pp: 10,
			priority: 1,
			flags: {contact: 1, protect: 1},
			volatileStatus: 'bide',
			ignoreImmunity: true,
			target: "self",
			type: "Normal",
			critRatio: 0
		},
		bind: {
			num: 20,
			accuracy: 85,
			basePower: 15,
			category: "Physical",
			name: "Bind",
			pp: 20,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			volatileStatus: 'partiallytrapped',
			target: "normal",
			type: "Normal",
		},
		bite: {
			num: 44,
			accuracy: 100,
			basePower: 60,
			category: "Physical",
			name: "Bite",
			pp: 25,
			priority: 0,
			flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
			secondary: {
				chance: 30,
				volatileStatus: 'flinch',
			},
			target: "normal",
			type: "Dark"
		},
		blizzard: {
			num: 59,
			accuracy: 70,
			basePower: 110,
			category: "Special",
			name: "Blizzard",
			pp: 5,
			priority: 0,
			flags: {protect: 1, mirror: 1, wind: 1},
			secondary: {
				chance: 10,
				status: 'frz',
			},
			target: "allAdjacentFoes",
			type: "Ice"
		},
		bodyslam: {
			num: 34,
			accuracy: 100,
			basePower: 85,
			category: "Physical",
			name: "Body Slam",
			pp: 15,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
			secondary: {
				chance: 30,
				status: 'par',
			},
			target: "normal",
			type: "Normal"
		},
		boneclub: {
			num: 125,
			accuracy: 85,
			basePower: 65,
			category: "Physical",
			name: "Bone Club",
			pp: 20,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: {
				chance: 10,
				volatileStatus: 'flinch',
			},
			target: "normal",
			type: "Ground"
		},
		bonemerang: {
			num: 155,
			accuracy: 90,
			basePower: 50,
			category: "Physical",
			name: "Bonemerang",
			pp: 10,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			multihit: 2,
			target: "normal",
			type: "Ground"
		},
		bubble: {
			num: 145,
			accuracy: 100,
			basePower: 40,
			category: "Special",
			name: "Bubble",
			pp: 30,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: {
				chance: 10,
				boosts: {
					spe: -1,
				},
			},
			target: "allAdjacentFoes",
			type: "Water"
		},
		bubblebeam: {
			num: 61,
			accuracy: 100,
			basePower: 65,
			category: "Special",
			name: "Bubble Beam",
			pp: 20,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: {
				chance: 10,
				boosts: {
					spe: -1,
				},
			},
			target: "normal",
			type: "Water"
		},
		clamp: {
			num: 128,
			accuracy: 85,
			basePower: 35,
			category: "Physical",
			name: "Clamp",
			pp: 15,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			volatileStatus: 'partiallytrapped',
			target: "normal",
			type: "Water"
		},
		cometpunch: {
			num: 4,
			accuracy: 85,
			basePower: 18,
			category: "Physical",
			name: "Comet Punch",
			pp: 15,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
			multihit: [2, 5],
			target: "normal",
			type: "Normal"
		},
		confuseray: {
			num: 109,
			accuracy: 100,
			basePower: 0,
			category: "Status",
			name: "Confuse Ray",
			pp: 10,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1},
			volatileStatus: 'confusion',
			target: "normal",
			type: "Ghost"
		},
		confusion: {
			num: 93,
			accuracy: 100,
			basePower: 50,
			category: "Special",
			name: "Confusion",
			pp: 25,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: {
				chance: 10,
				volatileStatus: 'confusion',
			},
			target: "normal",
			type: "Psychic"
		},
		constrict: {
			num: 132,
			accuracy: 100,
			basePower: 10,
			category: "Physical",
			name: "Constrict",
			pp: 35,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			secondary: {
				chance: 10,
				boosts: {
					spe: -1,
				},
			},
			target: "normal",
			type: "Normal"
		},
		conversion: {
			num: 160,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Conversion",
			pp: 30,
			priority: 0,
			flags: {snatch: 1},
			target: "self",
			type: "Normal"
		},
		counter: {
			num: 68,
			accuracy: 100,
			basePower: 0,
			category: "Physical",
			name: "Counter",
			pp: 20,
			priority: -5,
			flags: {contact: 1, protect: 1},
			target: "scripted",
			type: "Fighting"
		},
		crabhammer: {
			num: 152,
			accuracy: 90,
			basePower: 100,
			category: "Physical",
			name: "Crabhammer",
			pp: 10,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			critRatio: 2,
			target: "normal",
			type: "Water"
		},
		cut: {
			num: 15,
			accuracy: 95,
			basePower: 50,
			category: "Physical",
			name: "Cut",
			pp: 30,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
			target: "normal",
			type: "Normal"
		},
		defensecurl: {
			num: 111,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Defense Curl",
			pp: 40,
			priority: 0,
			flags: {snatch: 1},
			boosts: {
				def: 1,
			},
			volatileStatus: 'defensecurl',
			target: "self",
			type: "Normal"
		},
		dig: {
			num: 91,
			accuracy: 100,
			basePower: 80,
			category: "Physical",
			name: "Dig",
			pp: 10,
			priority: 0,
			flags: {contact: 1, charge: 1, protect: 1, mirror: 1, nonsky: 1},
			target: "normal",
			type: "Ground"
		},
		disable: {
			num: 50,
			accuracy: 100,
			basePower: 0,
			category: "Status",
			name: "Disable",
			pp: 20,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1, bypasssub: 1},
			volatileStatus: 'disable',
			target: "normal",
			type: "Normal"
		},
		dizzypunch: {
			num: 146,
			accuracy: 100,
			basePower: 70,
			category: "Physical",
			name: "Dizzy Punch",
			pp: 10,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
			secondary: {
				chance: 20,
				volatileStatus: 'confusion',
			},
			target: "normal",
			type: "Normal"
		},
		doubleedge: {
			num: 38,
			accuracy: 100,
			basePower: 120,
			category: "Physical",
			name: "Double-Edge",
			pp: 15,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			recoil: [33, 100],
			target: "normal",
			type: "Normal"
		},
		doublekick: {
			num: 24,
			accuracy: 100,
			basePower: 30,
			category: "Physical",
			name: "Double Kick",
			pp: 30,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			multihit: 2,
			target: "normal",
			type: "Fighting"
		},
		doubleslap: {
			num: 3,
			accuracy: 85,
			basePower: 15,
			category: "Physical",
			name: "Double Slap",
			pp: 10,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			multihit: [2, 5],
			target: "normal",
			type: "Normal"
		},
		doubleteam: {
			num: 104,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Double Team",
			pp: 15,
			priority: 0,
			flags: {snatch: 1},
			boosts: {
				evasion: 1,
			},
			target: "self",
			type: "Normal"
		},
		dragonrage: {
			num: 82,
			accuracy: 100,
			basePower: 0,
			damage: 40,
			category: "Special",
			name: "Dragon Rage",
			pp: 10,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			target: "normal",
			type: "Dragon"
		},
		dreameater: {
			num: 138,
			accuracy: 100,
			basePower: 100,
			category: "Special",
			name: "Dream Eater",
			pp: 15,
			priority: 0,
			flags: {protect: 1, mirror: 1, heal: 1},
			drain: [1, 2],
			target: "normal",
			type: "Psychic"
		},
		drillpeck: {
			num: 65,
			accuracy: 100,
			basePower: 80,
			category: "Physical",
			name: "Drill Peck",
			pp: 20,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
			target: "any",
			type: "Flying"
		},
		earthquake: {
			num: 89,
			accuracy: 100,
			basePower: 100,
			category: "Physical",
			name: "Earthquake",
			pp: 10,
			priority: 0,
			flags: {protect: 1, mirror: 1, nonsky: 1},
			target: "allAdjacent",
			type: "Ground"
		},
		eggbomb: {
			num: 121,
			accuracy: 75,
			basePower: 100,
			category: "Physical",
			name: "Egg Bomb",
			pp: 10,
			priority: 0,
			flags: {bullet: 1, protect: 1, mirror: 1},
			target: "normal",
			type: "Normal"
		},
		ember: {
			num: 52,
			accuracy: 100,
			basePower: 40,
			category: "Special",
			name: "Ember",
			pp: 25,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: {
				chance: 10,
				status: 'brn',
			},
			target: "normal",
			type: "Fire"
		},
		explosion: {
			num: 153,
			accuracy: 100,
			basePower: 250,
			category: "Physical",
			name: "Explosion",
			pp: 5,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			selfdestruct: "always",
			target: "allAdjacent",
			type: "Normal"
		},
		fireblast: {
			num: 126,
			accuracy: 85,
			basePower: 110,
			category: "Special",
			name: "Fire Blast",
			pp: 5,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: {
				chance: 10,
				status: 'brn',
			},
			target: "normal",
			type: "Fire"
		},
		firepunch: {
			num: 7,
			accuracy: 100,
			basePower: 75,
			category: "Physical",
			name: "Fire Punch",
			pp: 15,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
			secondary: {
				chance: 10,
				status: 'brn',
			},
			target: "normal",
			type: "Fire"
		},
		firespin: {
			num: 83,
			accuracy: 85,
			basePower: 35,
			category: "Special",
			name: "Fire Spin",
			pp: 15,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			volatileStatus: 'partiallytrapped',
			target: "normal",
			type: "Fire"
		},
		fissure: {
			num: 90,
			accuracy: 30,
			basePower: 0,
			category: "Physical",
			name: "Fissure",
			pp: 5,
			priority: 0,
			flags: {protect: 1, mirror: 1, nonsky: 1},
			ohko: true,
			target: "normal",
			type: "Ground",
			critRatio: 0
		},
		flamethrower: {
			num: 53,
			accuracy: 100,
			basePower: 90,
			category: "Special",
			name: "Flamethrower",
			pp: 15,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: {
				chance: 10,
				status: 'brn',
			},
			target: "normal",
			type: "Fire"
		},
		flash: {
			num: 148,
			accuracy: 100,
			basePower: 0,
			category: "Status",
			name: "Flash",
			pp: 20,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1},
			boosts: {
				accuracy: -1,
			},
			target: "normal",
			type: "Normal"
		},
		fly: {
			num: 19,
			accuracy: 95,
			basePower: 90,
			category: "Physical",
			name: "Fly",
			pp: 15,
			priority: 0,
			flags: {contact: 1, charge: 1, protect: 1, mirror: 1, gravity: 1, distance: 1},
			target: "any",
			type: "Flying"
		},
		focusenergy: {
			num: 116,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Focus Energy",
			pp: 30,
			priority: 0,
			flags: {snatch: 1},
			volatileStatus: 'focusenergy',
			target: "self",
			type: "Normal"
		},
		furyattack: {
			num: 31,
			accuracy: 85,
			basePower: 15,
			category: "Physical",
			name: "Fury Attack",
			pp: 20,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			multihit: [2, 5],
			target: "normal",
			type: "Normal"
		},
		furyswipes: {
			num: 154,
			accuracy: 80,
			basePower: 18,
			category: "Physical",
			name: "Fury Swipes",
			pp: 15,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			multihit: [2, 5],
			target: "normal",
			type: "Normal"
		},
		glare: {
			num: 137,
			accuracy: 100,
			basePower: 0,
			category: "Status",
			name: "Glare",
			pp: 30,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1},
			status: 'par',
			target: "normal",
			type: "Normal"
		},
		growl: {
			num: 45,
			accuracy: 100,
			basePower: 0,
			category: "Status",
			name: "Growl",
			pp: 40,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1},
			boosts: {
				atk: -1,
			},
			target: "allAdjacentFoes",
			type: "Normal"
		},
		growth: {
			num: 74,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Growth",
			pp: 20,
			priority: 0,
			flags: {snatch: 1},
			boosts: {
				atk: 1,
				spa: 1,
			},
			target: "self",
			type: "Normal"
		},
		guillotine: {
			num: 12,
			accuracy: 30,
			basePower: 0,
			category: "Physical",
			name: "Guillotine",
			pp: 5,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			ohko: true,
			target: "normal",
			type: "Normal",
			critRatio: 0
		},
		gust: {
			num: 16,
			accuracy: 100,
			basePower: 40,
			category: "Special",
			name: "Gust",
			pp: 35,
			priority: 0,
			flags: {protect: 1, mirror: 1, distance: 1, wind: 1},
			target: "any",
			type: "Flying"
		},
		harden: {
			num: 106,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Harden",
			pp: 30,
			priority: 0,
			flags: {snatch: 1},
			boosts: {
				def: 1,
			},
			target: "self",
			type: "Normal"
		},
		haze: {
			num: 114,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Haze",
			pp: 30,
			priority: 0,
			flags: {bypasssub: 1},
			target: "all",
			type: "Ice"
		},
		headbutt: {
			num: 29,
			accuracy: 100,
			basePower: 70,
			category: "Physical",
			name: "Headbutt",
			pp: 15,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			secondary: {
				chance: 30,
				volatileStatus: 'flinch',
			},
			target: "normal",
			type: "Normal"
		},
		highjumpkick: {
			num: 136,
			accuracy: 90,
			basePower: 130,
			category: "Physical",
			name: "High Jump Kick",
			pp: 10,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1, gravity: 1},
			hasCrashDamage: true,
			target: "normal",
			type: "Fighting"
		},
		hornattack: {
			num: 30,
			accuracy: 100,
			basePower: 65,
			category: "Physical",
			name: "Horn Attack",
			pp: 25,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			target: "normal",
			type: "Normal"
		},
		horndrill: {
			num: 32,
			accuracy: 30,
			basePower: 0,
			category: "Physical",
			name: "Horn Drill",
			pp: 5,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			ohko: true,
			target: "normal",
			type: "Normal",
			critRatio: 0
		},
		hydropump: {
			num: 56,
			accuracy: 80,
			basePower: 110,
			category: "Special",
			name: "Hydro Pump",
			pp: 5,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			target: "normal",
			type: "Water"
		},
		hyperbeam: {
			num: 63,
			accuracy: 90,
			basePower: 150,
			category: "Special",
			name: "Hyper Beam",
			pp: 5,
			priority: 0,
			flags: {recharge: 1, protect: 1, mirror: 1},
			self: {
				volatileStatus: 'mustrecharge',
			},
			target: "normal",
			type: "Normal"
		},
		hyperfang: {
			num: 158,
			accuracy: 90,
			basePower: 80,
			category: "Physical",
			name: "Hyper Fang",
			pp: 15,
			priority: 0,
			flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
			secondary: {
				chance: 10,
				volatileStatus: 'flinch',
			},
			target: "normal",
			type: "Normal"
		},
		hypnosis: {
			num: 95,
			accuracy: 60,
			basePower: 0,
			category: "Status",
			name: "Hypnosis",
			pp: 20,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1},
			status: 'slp',
			target: "normal",
			type: "Psychic"
		},
		icebeam: {
			num: 58,
			accuracy: 100,
			basePower: 90,
			category: "Special",
			name: "Ice Beam",
			pp: 10,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: {
				chance: 10,
				status: 'frz',
			},
			target: "normal",
			type: "Ice"
		},
		icepunch: {
			num: 8,
			accuracy: 100,
			basePower: 75,
			category: "Physical",
			name: "Ice Punch",
			pp: 15,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
			secondary: {
				chance: 10,
				status: 'frz',
			},
			target: "normal",
			type: "Ice"
		},
		jumpkick: {
			num: 26,
			accuracy: 95,
			basePower: 100,
			category: "Physical",
			name: "Jump Kick",
			pp: 10,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1, gravity: 1},
			hasCrashDamage: true,
			target: "normal",
			type: "Fighting"
		},
		karatechop: {
			num: 2,
			accuracy: 100,
			basePower: 50,
			category: "Physical",
			name: "Karate Chop",
			pp: 25,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			critRatio: 2,
			target: "normal",
			type: "Fighting",
		},
		kinesis: {
			num: 134,
			accuracy: 80,
			basePower: 0,
			category: "Status",
			name: "Kinesis",
			pp: 15,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1},
			boosts: {
				accuracy: -1,
			},
			target: "normal",
			type: "Psychic"
		},
		leechlife: {
			num: 141,
			accuracy: 100,
			basePower: 80,
			category: "Physical",
			name: "Leech Life",
			pp: 10,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1, heal: 1},
			drain: [1, 2],
			target: "normal",
			type: "Bug"
		},
		leechseed: {
			num: 73,
			accuracy: 90,
			basePower: 0,
			category: "Status",
			name: "Leech Seed",
			pp: 10,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1},
			volatileStatus: 'leechseed',
			target: "normal",
			type: "Grass"
		},
		leer: {
			num: 43,
			accuracy: 100,
			basePower: 0,
			category: "Status",
			name: "Leer",
			pp: 30,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1},
			boosts: {
				def: -1,
			},
			target: "allAdjacentFoes",
			type: "Normal"
		},
		lick: {
			num: 122,
			accuracy: 100,
			basePower: 30,
			category: "Physical",
			name: "Lick",
			pp: 30,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			secondary: {
				chance: 30,
				status: 'par',
			},
			target: "normal",
			type: "Ghost"
		},
		lightscreen: {
			num: 113,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Light Screen",
			pp: 30,
			priority: 0,
			flags: {snatch: 1},
			sideCondition: 'lightscreen',
			target: "allySide",
			type: "Psychic"
		},
		lovelykiss: {
			num: 142,
			accuracy: 75,
			basePower: 0,
			category: "Status",
			name: "Lovely Kiss",
			pp: 10,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1},
			status: 'slp',
			target: "normal",
			type: "Normal"
		},
		lowkick: {
			num: 67,
			accuracy: 100,
			basePower: 0,
			category: "Physical",
			name: "Low Kick",
			pp: 20,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			target: "normal",
			type: "Fighting"
		},
		meditate: {
			num: 96,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Meditate",
			pp: 40,
			priority: 0,
			flags: {snatch: 1},
			boosts: {
				atk: 1,
			},
			target: "self",
			type: "Psychic"
		},
		megadrain: {
			num: 72,
			accuracy: 100,
			basePower: 40,
			category: "Special",
			name: "Mega Drain",
			pp: 15,
			priority: 0,
			flags: {protect: 1, mirror: 1, heal: 1},
			drain: [1, 2],
			target: "normal",
			type: "Grass"
		},
		megakick: {
			num: 25,
			accuracy: 75,
			basePower: 120,
			category: "Physical",
			name: "Mega Kick",
			pp: 5,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			target: "normal",
			type: "Normal"
		},
		megapunch: {
			num: 5,
			accuracy: 85,
			basePower: 80,
			category: "Physical",
			name: "Mega Punch",
			pp: 20,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
			target: "normal",
			type: "Normal"
		},
		metronome: {
			num: 118,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Metronome",
			pp: 10,
			priority: 0,
			flags: {},
			target: "self",
			type: "Normal"
		},
		mimic: {
			num: 102,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Mimic",
			pp: 10,
			priority: 0,
			flags: {protect: 1, bypasssub: 1, allyanim: 1},
			target: "normal",
			type: "Normal"
		},
		minimize: {
			num: 107,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Minimize",
			pp: 10,
			priority: 0,
			flags: {snatch: 1},
			volatileStatus: 'minimize',
			boosts: {
				evasion: 2,
			},
			target: "self",
			type: "Normal"
		},
		mirrormove: {
			num: 119,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Mirror Move",
			pp: 20,
			priority: 0,
			flags: {},
			target: "normal",
			type: "Flying"
		},
		mist: {
			num: 54,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Mist",
			pp: 30,
			priority: 0,
			flags: {snatch: 1},
			sideCondition: 'mist',
			target: "allySide",
			type: "Ice"
		},
		nightshade: {
			num: 101,
			accuracy: 100,
			basePower: 0,
			damage: 'level',
			category: "Special",
			name: "Night Shade",
			pp: 15,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			target: "normal",
			type: "Ghost",
			critRatio: 0
		},
		payday: {
			num: 6,
			accuracy: 100,
			basePower: 40,
			category: "Physical",
			name: "Pay Day",
			pp: 20,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			target: "normal",
			type: "Normal"
		},
		peck: {
			num: 64,
			accuracy: 100,
			basePower: 35,
			category: "Physical",
			name: "Peck",
			pp: 35,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
			target: "any",
			type: "Flying"
		},
		petaldance: {
			num: 80,
			accuracy: 100,
			basePower: 120,
			category: "Special",
			name: "Petal Dance",
			pp: 10,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1, dance: 1},
			self: {
				volatileStatus: 'lockedmove',
			},
			target: "randomNormal",
			type: "Grass"
		},
		pinmissile: {
			num: 42,
			accuracy: 95,
			basePower: 25,
			category: "Physical",
			name: "Pin Missile",
			pp: 20,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			multihit: [2, 5],
			target: "normal",
			type: "Bug"
		},
		poisongas: {
			num: 139,
			accuracy: 90,
			basePower: 0,
			category: "Status",
			name: "Poison Gas",
			pp: 40,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1},
			status: 'psn',
			target: "allAdjacentFoes",
			type: "Poison"
		},
		poisonpowder: {
			num: 77,
			accuracy: 75,
			basePower: 0,
			category: "Status",
			name: "Poison Powder",
			pp: 35,
			priority: 0,
			flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1},
			status: 'psn',
			target: "normal",
			type: "Poison"
		},
		poisonsting: {
			num: 40,
			accuracy: 100,
			basePower: 15,
			category: "Physical",
			name: "Poison Sting",
			pp: 35,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: {
				chance: 30,
				status: 'psn',
			},
			target: "normal",
			type: "Poison"
		},
		pound: {
			num: 1,
			accuracy: 100,
			basePower: 40,
			category: "Physical",
			name: "Pound",
			pp: 35,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			target: "normal",
			type: "Normal"
		},
		psybeam: {
			num: 60,
			accuracy: 100,
			basePower: 65,
			category: "Special",
			name: "Psybeam",
			pp: 20,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: {
				chance: 10,
				volatileStatus: 'confusion',
			},
			target: "normal",
			type: "Psychic"
		},
		psychic: {
			num: 94,
			accuracy: 100,
			basePower: 90,
			category: "Special",
			name: "Psychic",
			pp: 10,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: {
				chance: 10,
				boosts: {
					spd: -1,
				},
			},
			target: "normal",
			type: "Psychic"
		},
		psywave: {
			num: 149,
			accuracy: 100,
			basePower: 0,
			category: "Special",
			name: "Psywave",
			pp: 15,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			target: "normal",
			type: "Psychic",
			critRatio: 0
		},
		quickattack: {
			num: 98,
			accuracy: 100,
			basePower: 40,
			category: "Physical",
			name: "Quick Attack",
			pp: 30,
			priority: 1,
			flags: {contact: 1, protect: 1, mirror: 1},
			target: "normal",
			type: "Normal"
		},
		rage: {
			num: 99,
			accuracy: 100,
			basePower: 20,
			category: "Physical",
			name: "Rage",
			pp: 20,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			self: {
				volatileStatus: 'rage',
			},
			target: "normal",
			type: "Normal"
		},
		razorleaf: {
			num: 75,
			accuracy: 95,
			basePower: 55,
			category: "Physical",
			name: "Razor Leaf",
			pp: 25,
			priority: 0,
			flags: {protect: 1, mirror: 1, slicing: 1},
			critRatio: 2,
			target: "allAdjacentFoes",
			type: "Grass"
		},
		razorwind: {
			num: 13,
			accuracy: 100,
			basePower: 80,
			category: "Special",
			name: "Razor Wind",
			pp: 10,
			priority: 0,
			flags: {charge: 1, protect: 1, mirror: 1},
			critRatio: 2,
			target: "allAdjacentFoes",
			type: "Normal"
		},
		recover: {
			num: 105,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Recover",
			pp: 5,
			priority: 0,
			flags: {snatch: 1, heal: 1},
			heal: [1, 2],
			target: "self",
			type: "Normal"
		},
		reflect: {
			num: 115,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Reflect",
			pp: 20,
			priority: 0,
			flags: {snatch: 1},
			sideCondition: 'reflect',
			target: "allySide",
			type: "Psychic"
		},
		rest: {
			num: 156,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Rest",
			pp: 5,
			priority: 0,
			flags: {snatch: 1, heal: 1},
			target: "self",
			type: "Psychic"
		},
		roar: {
			num: 46,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Roar",
			pp: 20,
			priority: -6,
			flags: {reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, allyanim: 1},
			forceSwitch: true,
			target: "normal",
			type: "Normal"
		},
		rockslide: {
			num: 157,
			accuracy: 90,
			basePower: 75,
			category: "Physical",
			name: "Rock Slide",
			pp: 10,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: {
				chance: 30,
				volatileStatus: 'flinch',
			},
			target: "allAdjacentFoes",
			type: "Rock"
		},
		rockthrow: {
			num: 88,
			accuracy: 90,
			basePower: 50,
			category: "Physical",
			name: "Rock Throw",
			pp: 15,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			target: "normal",
			type: "Rock"
		},
		rollingkick: {
			num: 27,
			accuracy: 85,
			basePower: 60,
			category: "Physical",
			name: "Rolling Kick",
			pp: 15,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			secondary: {
				chance: 30,
				volatileStatus: 'flinch'
			},
			target: "normal",
			type: "Fighting"
		},
		sandattack: {
			num: 28,
			accuracy: 100,
			basePower: 0,
			category: "Status",
			name: "Sand Attack",
			pp: 15,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1},
			boosts: {
				accuracy: -1,
			},
			target: "normal",
			type: "Ground"
		},
		scratch: {
			num: 10,
			accuracy: 100,
			basePower: 40,
			category: "Physical",
			name: "Scratch",
			pp: 35,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			target: "normal",
			type: "Normal"
		},
		screech: {
			num: 103,
			accuracy: 85,
			basePower: 0,
			category: "Status",
			name: "Screech",
			pp: 40,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, allyanim: 1},
			boosts: {
				def: -2,
			},
			target: "normal",
			type: "Normal"
		},
		seismictoss: {
			num: 69,
			accuracy: 100,
			basePower: 0,
			damage: 'level',
			category: "Physical",
			name: "Seismic Toss",
			pp: 20,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
			target: "normal",
			type: "Fighting"
		},
		selfdestruct: {
			num: 120,
			accuracy: 100,
			basePower: 200,
			category: "Physical",
			name: "Self-Destruct",
			pp: 5,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			selfdestruct: "always",
			target: "allAdjacent",
			type: "Normal"
		},
		sharpen: {
			num: 159,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Sharpen",
			pp: 30,
			priority: 0,
			flags: {snatch: 1},
			boosts: {
				atk: 1,
			},
			target: "self",
			type: "Normal"
		},
		sing: {
			num: 47,
			accuracy: 55,
			basePower: 0,
			category: "Status",
			name: "Sing",
			pp: 15,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1},
			status: 'slp',
			target: "normal",
			type: "Normal"
		},
		skullbash: {
			num: 130,
			accuracy: 100,
			basePower: 130,
			category: "Physical",
			name: "Skull Bash",
			pp: 10,
			priority: 0,
			flags: {contact: 1, charge: 1, protect: 1, mirror: 1},
			target: "normal",
			type: "Normal",
		},
		skyattack: {
			num: 143,
			accuracy: 90,
			basePower: 140,
			category: "Physical",
			name: "Sky Attack",
			pp: 5,
			priority: 0,
			flags: {charge: 1, protect: 1, mirror: 1, distance: 1},
			critRatio: 2,
			secondary: {
				chance: 30,
				volatileStatus: 'flinch',
			},
			target: "any",
			type: "Flying"
		},
		slam: {
			num: 21,
			accuracy: 75,
			basePower: 80,
			category: "Physical",
			name: "Slam",
			pp: 20,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
			target: "normal",
			type: "Normal"
		},
		slash: {
			num: 163,
			accuracy: 100,
			basePower: 70,
			category: "Physical",
			name: "Slash",
			pp: 20,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
			critRatio: 2,
			target: "normal",
			type: "Normal"
		},
		sleeppowder: {
			num: 79,
			accuracy: 75,
			basePower: 0,
			category: "Status",
			name: "Sleep Powder",
			pp: 15,
			priority: 0,
			flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1},
			status: 'slp',
			target: "normal",
			type: "Grass"
		},
		sludge: {
			num: 124,
			accuracy: 100,
			basePower: 65,
			category: "Special",
			name: "Sludge",
			pp: 20,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: {
				chance: 30,
				status: 'psn',
			},
			target: "normal",
			type: "Poison"
		},
		smog: {
			num: 123,
			accuracy: 70,
			basePower: 30,
			category: "Special",
			name: "Smog",
			pp: 20,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: {
				chance: 40,
				status: 'psn',
			},
			target: "normal",
			type: "Poison"
		},
		smokescreen: {
			num: 108,
			accuracy: 100,
			basePower: 0,
			category: "Status",
			name: "Smokescreen",
			pp: 20,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1},
			boosts: {
				accuracy: -1,
			},
			target: "normal",
			type: "Normal"
		},
		softboiled: {
			num: 135,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Soft-Boiled",
			pp: 5,
			priority: 0,
			flags: {snatch: 1, heal: 1},
			heal: [1, 2],
			target: "self",
			type: "Normal"
		},
		solarbeam: {
			num: 76,
			accuracy: 100,
			basePower: 120,
			category: "Special",
			name: "Solar Beam",
			pp: 10,
			priority: 0,
			flags: {charge: 1, protect: 1, mirror: 1},
			target: "normal",
			type: "Grass"
		},
		sonicboom: {
			num: 49,
			accuracy: 90,
			basePower: 0,
			damage: 20,
			category: "Special",
			name: "Sonic Boom",
			pp: 20,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			target: "normal",
			type: "Normal",
			critRatio: 0
		},
		spikecannon: {
			num: 131,
			accuracy: 100,
			basePower: 20,
			category: "Physical",
			name: "Spike Cannon",
			pp: 15,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			multihit: [2, 5],
			target: "normal",
			type: "Normal"
		},
		splash: {
			num: 150,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Splash",
			pp: 40,
			priority: 0,
			flags: {gravity: 1},
			target: "self",
			type: "Normal"
		},
		spore: {
			num: 147,
			accuracy: 100,
			basePower: 0,
			category: "Status",
			name: "Spore",
			pp: 15,
			priority: 0,
			flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1},
			status: 'slp',
			target: "normal",
			type: "Grass"
		},
		stomp: {
			num: 23,
			accuracy: 100,
			basePower: 65,
			category: "Physical",
			name: "Stomp",
			pp: 20,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
			secondary: {
				chance: 30,
				volatileStatus: 'flinch',
			},
			target: "normal",
			type: "Normal"
		},
		strength: {
			num: 70,
			accuracy: 100,
			basePower: 80,
			category: "Physical",
			name: "Strength",
			pp: 15,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			target: "normal",
			type: "Normal"
		},
		stringshot: {
			num: 81,
			accuracy: 95,
			basePower: 0,
			category: "Status",
			name: "String Shot",
			pp: 40,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1},
			boosts: {
				spe: -2,
			},
			target: "allAdjacentFoes",
			type: "Bug"
		},
		struggle: {
			num: 165,
			accuracy: true,
			basePower: 50,
			category: "Physical",
			name: "Struggle",
			pp: 1,
			priority: 0,
			flags: {contact: 1, protect: 1},
			struggleRecoil: true,
			target: "randomNormal",
			type: "Normal"
		},
		stunspore: {
			num: 78,
			accuracy: 75,
			basePower: 0,
			category: "Status",
			name: "Stun Spore",
			pp: 30,
			priority: 0,
			flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1},
			status: 'par',
			target: "normal",
			type: "Grass"
		},
		submission: {
			num: 66,
			accuracy: 80,
			basePower: 80,
			category: "Physical",
			name: "Submission",
			pp: 20,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			recoil: [1, 4],
			target: "normal",
			type: "Fighting"
		},
		substitute: {
			num: 164,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Substitute",
			pp: 10,
			priority: 0,
			flags: {snatch: 1, nonsky: 1},
			target: "self",
			type: "Normal"
		},
		superfang: {
			num: 162,
			accuracy: 90,
			basePower: 0,
			category: "Physical",
			name: "Super Fang",
			pp: 10,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			target: "normal",
			type: "Normal",
			critRatio: 0
		},
		supersonic: {
			num: 48,
			accuracy: 55,
			basePower: 0,
			category: "Status",
			name: "Supersonic",
			pp: 20,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1},
			volatileStatus: 'confusion',
			target: "normal",
			type: "Normal"
		},
		surf: {
			num: 57,
			accuracy: 100,
			basePower: 90,
			category: "Special",
			name: "Surf",
			pp: 15,
			priority: 0,
			flags: {protect: 1, mirror: 1, nonsky: 1},
			target: "allAdjacent",
			type: "Water"
		},
		swift: {
			num: 129,
			accuracy: true,
			basePower: 60,
			category: "Special",
			name: "Swift",
			pp: 20,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			target: "allAdjacentFoes",
			type: "Normal"
		},
		swordsdance: {
			num: 14,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Swords Dance",
			pp: 20,
			priority: 0,
			flags: {snatch: 1, dance: 1},
			boosts: {
				atk: 2,
			},
			target: "self",
			type: "Normal"
		},
		tackle: {
			num: 33,
			accuracy: 100,
			basePower: 40,
			category: "Physical",
			name: "Tackle",
			pp: 35,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			target: "normal",
			type: "Normal"
		},
		tailwhip: {
			num: 39,
			accuracy: 100,
			basePower: 0,
			category: "Status",
			name: "Tail Whip",
			pp: 30,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1},
			boosts: {
				def: -1,
			},
			target: "allAdjacentFoes",
			type: "Normal"
		},
		takedown: {
			num: 36,
			accuracy: 85,
			basePower: 90,
			category: "Physical",
			name: "Take Down",
			pp: 20,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			recoil: [1, 4],
			target: "normal",
			type: "Normal"
		},
		teleport: {
			num: 100,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Teleport",
			pp: 20,
			priority: -6,
			flags: {},
			target: "self",
			type: "Psychic"
		},
		thrash: {
			num: 37,
			accuracy: 100,
			basePower: 120,
			category: "Physical",
			name: "Thrash",
			pp: 10,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			self: {
				volatileStatus: 'lockedmove',
			},
			target: "randomNormal",
			type: "Normal"
		},
		thunder: {
			num: 87,
			accuracy: 70,
			basePower: 110,
			category: "Special",
			name: "Thunder",
			pp: 10,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: {
				chance: 30,
				status: 'par',
			},
			target: "normal",
			type: "Electric"
		},
		thunderbolt: {
			num: 85,
			accuracy: 100,
			basePower: 90,
			category: "Special",
			name: "Thunderbolt",
			pp: 15,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: {
				chance: 10,
				status: 'par',
			},
			target: "normal",
			type: "Electric"
		},
		thunderpunch: {
			num: 9,
			accuracy: 100,
			basePower: 75,
			category: "Physical",
			name: "Thunder Punch",
			pp: 15,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
			secondary: {
				chance: 10,
				status: 'par',
			},
			target: "normal",
			type: "Electric"
		},
		thundershock: {
			num: 84,
			accuracy: 100,
			basePower: 40,
			category: "Special",
			name: "Thunder Shock",
			pp: 30,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: {
				chance: 10,
				status: 'par',
			},
			target: "normal",
			type: "Electric"
		},
		thunderwave: {
			num: 86,
			accuracy: 90,
			basePower: 0,
			category: "Status",
			name: "Thunder Wave",
			pp: 20,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1},
			status: 'par',
			target: "normal",
			type: "Electric"
		},
		toxic: {
			num: 92,
			accuracy: 90,
			basePower: 0,
			category: "Status",
			name: "Toxic",
			pp: 10,
			priority: 0,
			flags: {protect: 1, reflectable: 1, mirror: 1},
			status: 'tox',
			target: "normal",
			type: "Poison"
		},
		transform: {
			num: 144,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Transform",
			pp: 10,
			priority: 0,
			flags: {allyanim: 1},
			target: "normal",
			type: "Normal"
		},
		triattack: {
			num: 161,
			accuracy: 100,
			basePower: 80,
			category: "Special",
			name: "Tri Attack",
			pp: 10,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			target: "normal",
			type: "Normal"
		},
		twineedle: {
			num: 41,
			accuracy: 100,
			basePower: 25,
			category: "Physical",
			name: "Twineedle",
			pp: 20,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			multihit: 2,
			secondary: {
				chance: 20,
				status: 'psn',
			},
			target: "normal",
			type: "Bug"
		},
		vinewhip: {
			num: 22,
			accuracy: 100,
			basePower: 45,
			category: "Physical",
			name: "Vine Whip",
			pp: 25,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			target: "normal",
			type: "Grass"
		},
		visegrip: {
			num: 11,
			accuracy: 100,
			basePower: 55,
			category: "Physical",
			name: "Vise Grip",
			pp: 30,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			target: "normal",
			type: "Normal"
		},
		waterfall: {
			num: 127,
			accuracy: 100,
			basePower: 80,
			category: "Physical",
			name: "Waterfall",
			pp: 15,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			secondary: {
				chance: 20,
				volatileStatus: 'flinch',
			},
			target: "normal",
			type: "Water"
		},
		watergun: {
			num: 55,
			accuracy: 100,
			basePower: 40,
			category: "Special",
			name: "Water Gun",
			pp: 25,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			target: "normal",
			type: "Water"
		},
		whirlwind: {
			num: 18,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Whirlwind",
			pp: 20,
			priority: -6,
			flags: {reflectable: 1, mirror: 1, bypasssub: 1, allyanim: 1, wind: 1},
			target: "normal",
			type: "Normal"
		},
		wingattack: {
			num: 17,
			accuracy: 100,
			basePower: 60,
			category: "Physical",
			name: "Wing Attack",
			pp: 35,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
			target: "any",
			type: "Flying"
		},
		withdraw: {
			num: 110,
			accuracy: true,
			basePower: 0,
			category: "Status",
			name: "Withdraw",
			pp: 40,
			priority: 0,
			flags: {snatch: 1},
			boosts: {
				def: 1,
			},
			target: "self",
			type: "Water"
		},
		wrap: {
			num: 35,
			accuracy: 90,
			basePower: 15,
			category: "Physical",
			name: "Wrap",
			pp: 20,
			priority: 0,
			flags: {contact: 1, protect: 1, mirror: 1},
			volatileStatus: 'partiallytrapped',
			target: "normal",
			type: "Normal"
		}
	};

	const pokedex = {
		"bulbasaur": {
			"num": 1,
			"name": "Bulbasaur",
			"types": ["Grass", "Poison"]
		},
		"ivysaur": {
			"num": 2,
			"name": "Ivysaur",
			"types": ["Grass", "Poison"]
		},
		"venusaur": {
			"num": 3,
			"name": "Venusaur",
			"types": ["Grass", "Poison"]
		},
		"charmander": {
			"num": 4,
			"name": "Charmander",
			"types": ["Fire"]
		},
		"charmeleon": {
			"num": 5,
			"name": "Charmeleon",
			"types": ["Fire"]
		},
		"charizard": {
			"num": 6,
			"name": "Charizard",
			"types": ["Fire", "Flying"]
		},
		"squirtle": {
			"num": 7,
			"name": "Squirtle",
			"types": ["Water"]
		},
		"wartortle": {
			"num": 8,
			"name": "Wartortle",
			"types": ["Water"]
		},
		"blastoise": {
			"num": 9,
			"name": "Blastoise",
			"types": ["Water"]
		},
		"caterpie": {
			"num": 10,
			"name": "Caterpie",
			"types": ["Bug"]
		},
		"metapod": {
			"num": 11,
			"name": "Metapod",
			"types": ["Bug"]
		},
		"butterfree": {
			"num": 12,
			"name": "Butterfree",
			"types": ["Bug", "Flying"]
		},
		"weedle": {
			"num": 13,
			"name": "Weedle",
			"types": ["Bug", "Poison"]
		},
		"kakuna": {
			"num": 14,
			"name": "Kakuna",
			"types": ["Bug", "Poison"]
		},
		"beedrill": {
			"num": 15,
			"name": "Beedrill",
			"types": ["Bug", "Poison"]
		},
		"pidgey": {
			"num": 16,
			"name": "Pidgey",
			"types": ["Normal", "Flying"]
		},
		"pidgeotto": {
			"num": 17,
			"name": "Pidgeotto",
			"types": ["Normal", "Flying"]
		},
		"pidgeot": {
			"num": 18,
			"name": "Pidgeot",
			"types": ["Normal", "Flying"]
		},
		"rattata": {
			"num": 19,
			"name": "Rattata",
			"types": ["Normal"]
		},
		"raticate": {
			"num": 20,
			"name": "Raticate",
			"types": ["Normal"]
		},
		"spearow": {
			"num": 21,
			"name": "Spearow",
			"types": ["Normal", "Flying"]
		},
		"fearow": {
			"num": 22,
			"name": "Fearow",
			"types": ["Normal", "Flying"]
		},
		"ekans": {
			"num": 23,
			"name": "Ekans",
			"types": ["Poison"]
		},
		"arbok": {
			"num": 24,
			"name": "Arbok",
			"types": ["Poison"]
		},
		"pikachu": {
			"num": 25,
			"name": "Pikachu",
			"types": ["Electric"]
		},
		"raichu": {
			"num": 26,
			"name": "Raichu",
			"types": ["Electric"]
		},
		"sandshrew": {
			"num": 27,
			"name": "Sandshrew",
			"types": ["Ground"]
		},
		"sandslash": {
			"num": 28,
			"name": "Sandslash",
			"types": ["Ground"]
		},
		"nidoranf": {
			"num": 29,
			"name": "Nidoran-F",
			"types": ["Poison"]
		},
		"nidorina": {
			"num": 30,
			"name": "Nidorina",
			"types": ["Poison"]
		},
		"nidoqueen": {
			"num": 31,
			"name": "Nidoqueen",
			"types": ["Poison", "Ground"]
		},
		"nidoranm": {
			"num": 32,
			"name": "Nidoran-M",
			"types": ["Poison"]
		},
		"nidorino": {
			"num": 33,
			"name": "Nidorino",
			"types": ["Poison"]
		},
		"nidoking": {
			"num": 34,
			"name": "Nidoking",
			"types": ["Poison", "Ground"]
		},
		"clefairy": {
			"num": 35,
			"name": "Clefairy",
			"types": ["Normal"]
		},
		"clefable": {
			"num": 36,
			"name": "Clefable",
			"types": ["Normal"]
		},
		"vulpix": {
			"num": 37,
			"name": "Vulpix",
			"types": ["Fire"]
		},
		"ninetales": {
			"num": 38,
			"name": "Ninetales",
			"types": ["Fire"]
		},
		"jigglypuff": {
			"num": 39,
			"name": "Jigglypuff",
			"types": ["Normal"]
		},
		"wigglytuff": {
			"num": 40,
			"name": "Wigglytuff",
			"types": ["Normal"]
		},
		"zubat": {
			"num": 41,
			"name": "Zubat",
			"types": ["Poison", "Flying"]
		},
		"golbat": {
			"num": 42,
			"name": "Golbat",
			"types": ["Poison", "Flying"]
		},
		"oddish": {
			"num": 43,
			"name": "Oddish",
			"types": ["Grass", "Poison"]
		},
		"gloom": {
			"num": 44,
			"name": "Gloom",
			"types": ["Grass", "Poison"]
		},
		"vileplume": {
			"num": 45,
			"name": "Vileplume",
			"types": ["Grass", "Poison"]
		},
		"paras": {
			"num": 46,
			"name": "Paras",
			"types": ["Bug", "Grass"]
		},
		"parasect": {
			"num": 47,
			"name": "Parasect",
			"types": ["Bug", "Grass"]
		},
		"venonat": {
			"num": 48,
			"name": "Venonat",
			"types": ["Bug", "Poison"]
		},
		"venomoth": {
			"num": 49,
			"name": "Venomoth",
			"types": ["Bug", "Poison"]
		},
		"diglett": {
			"num": 50,
			"name": "Diglett",
			"types": ["Ground"]
		},
		"dugtrio": {
			"num": 51,
			"name": "Dugtrio",
			"types": ["Ground"]
		},
		"meowth": {
			"num": 52,
			"name": "Meowth",
			"types": ["Normal"]
		},
		"persian": {
			"num": 53,
			"name": "Persian",
			"types": ["Normal"]
		},
		"psyduck": {
			"num": 54,
			"name": "Psyduck",
			"types": ["Water"]
		},
		"golduck": {
			"num": 55,
			"name": "Golduck",
			"types": ["Water"]
		},
		"mankey": {
			"num": 56,
			"name": "Mankey",
			"types": ["Fighting"]
		},
		"primeape": {
			"num": 57,
			"name": "Primeape",
			"types": ["Fighting"]
		},
		"growlithe": {
			"num": 58,
			"name": "Growlithe",
			"types": ["Fire"]
		},
		"arcanine": {
			"num": 59,
			"name": "Arcanine",
			"types": ["Fire"]
		},
		"poliwag": {
			"num": 60,
			"name": "Poliwag",
			"types": ["Water"]
		},
		"poliwhirl": {
			"num": 61,
			"name": "Poliwhirl",
			"types": ["Water"]
		},
		"poliwrath": {
			"num": 62,
			"name": "Poliwrath",
			"types": ["Water", "Fighting"]
		},
		"abra": {
			"num": 63,
			"name": "Abra",
			"types": ["Psychic"]
		},
		"kadabra": {
			"num": 64,
			"name": "Kadabra",
			"types": ["Psychic"]
		},
		"alakazam": {
			"num": 65,
			"name": "Alakazam",
			"types": ["Psychic"]
		},
		"machop": {
			"num": 66,
			"name": "Machop",
			"types": ["Fighting"]
		},
		"machoke": {
			"num": 67,
			"name": "Machoke",
			"types": ["Fighting"]
		},
		"machamp": {
			"num": 68,
			"name": "Machamp",
			"types": ["Fighting"]
		},
		"bellsprout": {
			"num": 69,
			"name": "Bellsprout",
			"types": ["Grass", "Poison"]
		},
		"weepinbell": {
			"num": 70,
			"name": "Weepinbell",
			"types": ["Grass", "Poison"]
		},
		"victreebel": {
			"num": 71,
			"name": "Victreebel",
			"types": ["Grass", "Poison"]
		},
		"tentacool": {
			"num": 72,
			"name": "Tentacool",
			"types": ["Water", "Poison"]
		},
		"tentacruel": {
			"num": 73,
			"name": "Tentacruel",
			"types": ["Water", "Poison"]
		},
		"geodude": {
			"num": 74,
			"name": "Geodude",
			"types": ["Rock", "Ground"]
		},
		"graveler": {
			"num": 75,
			"name": "Graveler",
			"types": ["Rock", "Ground"]
		},
		"golem": {
			"num": 76,
			"name": "Golem",
			"types": ["Rock", "Ground"]
		},
		"ponyta": {
			"num": 77,
			"name": "Ponyta",
			"types": ["Fire"]
		},
		"rapidash": {
			"num": 78,
			"name": "Rapidash",
			"types": ["Fire"]
		},
		"slowpoke": {
			"num": 79,
			"name": "Slowpoke",
			"types": ["Water", "Psychic"]
		},
		"slowbro": {
			"num": 80,
			"name": "Slowbro",
			"types": ["Water", "Psychic"]
		},
		"magnemite": {
			"num": 81,
			"name": "Magnemite",
			"types": ["Electric"]
		},
		"magneton": {
			"num": 82,
			"name": "Magneton",
			"types": ["Electric"]
		},
		"farfetchd": {
			"num": 83,
			"name": "Farfetch’d",
			"types": ["Normal", "Flying"]
		},
		"doduo": {
			"num": 84,
			"name": "Doduo",
			"types": ["Normal", "Flying"]
		},
		"dodrio": {
			"num": 85,
			"name": "Dodrio",
			"types": ["Normal", "Flying"]
		},
		"seel": {
			"num": 86,
			"name": "Seel",
			"types": ["Water"]
		},
		"dewgong": {
			"num": 87,
			"name": "Dewgong",
			"types": ["Water", "Ice"]
		},
		"grimer": {
			"num": 88,
			"name": "Grimer",
			"types": ["Poison"]
		},
		"muk": {
			"num": 89,
			"name": "Muk",
			"types": ["Poison"]
		},
		"shellder": {
			"num": 90,
			"name": "Shellder",
			"types": ["Water"]
		},
		"cloyster": {
			"num": 91,
			"name": "Cloyster",
			"types": ["Water", "Ice"]
		},
		"gastly": {
			"num": 92,
			"name": "Gastly",
			"types": ["Ghost", "Poison"]
		},
		"haunter": {
			"num": 93,
			"name": "Haunter",
			"types": ["Ghost", "Poison"]
		},
		"gengar": {
			"num": 94,
			"name": "Gengar",
			"types": ["Ghost", "Poison"]
		},
		"onix": {
			"num": 95,
			"name": "Onix",
			"types": ["Rock", "Ground"]
		},
		"drowzee": {
			"num": 96,
			"name": "Drowzee",
			"types": ["Psychic"]
		},
		"hypno": {
			"num": 97,
			"name": "Hypno",
			"types": ["Psychic"]
		},
		"krabby": {
			"num": 98,
			"name": "Krabby",
			"types": ["Water"]
		},
		"kingler": {
			"num": 99,
			"name": "Kingler",
			"types": ["Water"]
		},
		"voltorb": {
			"num": 100,
			"name": "Voltorb",
			"types": ["Electric"]
		},
		"electrode": {
			"num": 101,
			"name": "Electrode",
			"types": ["Electric"]
		},
		"exeggcute": {
			"num": 102,
			"name": "Exeggcute",
			"types": ["Grass", "Psychic"]
		},
		"exeggutor": {
			"num": 103,
			"name": "Exeggutor",
			"types": ["Grass", "Psychic"]
		},
		"cubone": {
			"num": 104,
			"name": "Cubone",
			"types": ["Ground"]
		},
		"marowak": {
			"num": 105,
			"name": "Marowak",
			"types": ["Ground"]
		},
		"hitmonlee": {
			"num": 106,
			"name": "Hitmonlee",
			"types": ["Fighting"]
		},
		"hitmonchan": {
			"num": 107,
			"name": "Hitmonchan",
			"types": ["Fighting"]
		},
		"lickitung": {
			"num": 108,
			"name": "Lickitung",
			"types": ["Normal"]
		},
		"koffing": {
			"num": 109,
			"name": "Koffing",
			"types": ["Poison"]
		},
		"weezing": {
			"num": 110,
			"name": "Weezing",
			"types": ["Poison"]
		},
		"rhyhorn": {
			"num": 111,
			"name": "Rhyhorn",
			"types": ["Ground", "Rock"]
		},
		"rhydon": {
			"num": 112,
			"name": "Rhydon",
			"types": ["Ground", "Rock"]
		},
		"chansey": {
			"num": 113,
			"name": "Chansey",
			"types": ["Normal"]
		},
		"tangela": {
			"num": 114,
			"name": "Tangela",
			"types": ["Grass"]
		},
		"kangaskhan": {
			"num": 115,
			"name": "Kangaskhan",
			"types": ["Normal"]
		},
		"horsea": {
			"num": 116,
			"name": "Horsea",
			"types": ["Water"]
		},
		"seadra": {
			"num": 117,
			"name": "Seadra",
			"types": ["Water"]
		},
		"goldeen": {
			"num": 118,
			"name": "Goldeen",
			"types": ["Water"]
		},
		"seaking": {
			"num": 119,
			"name": "Seaking",
			"types": ["Water"]
		},
		"staryu": {
			"num": 120,
			"name": "Staryu",
			"types": ["Water"]
		},
		"starmie": {
			"num": 121,
			"name": "Starmie",
			"types": ["Water", "Psychic"]
		},
		"mrmime": {
			"num": 122,
			"name": "Mr. Mime",
			"types": ["Psychic"]
		},
		"scyther": {
			"num": 123,
			"name": "Scyther",
			"types": ["Bug", "Flying"]
		},
		"jynx": {
			"num": 124,
			"name": "Jynx",
			"types": ["Ice", "Psychic"]
		},
		"electabuzz": {
			"num": 125,
			"name": "Electabuzz",
			"types": ["Electric"]
		},
		"magmar": {
			"num": 126,
			"name": "Magmar",
			"types": ["Fire"]
		},
		"pinsir": {
			"num": 127,
			"name": "Pinsir",
			"types": ["Bug"]
		},
		"tauros": {
			"num": 128,
			"name": "Tauros",
			"types": ["Normal"]
		},
		"magikarp": {
			"num": 129,
			"name": "Magikarp",
			"types": ["Water"]
		},
		"gyarados": {
			"num": 130,
			"name": "Gyarados",
			"types": ["Water", "Flying"]
		},
		"lapras": {
			"num": 131,
			"name": "Lapras",
			"types": ["Water", "Ice"]
		},
		"ditto": {
			"num": 132,
			"name": "Ditto",
			"types": ["Normal"]
		},
		"eevee": {
			"num": 133,
			"name": "Eevee",
			"types": ["Normal"]
		},
		"vaporeon": {
			"num": 134,
			"name": "Vaporeon",
			"types": ["Water"]
		},
		"jolteon": {
			"num": 135,
			"name": "Jolteon",
			"types": ["Electric"]
		},
		"flareon": {
			"num": 136,
			"name": "Flareon",
			"types": ["Fire"]
		},
		"porygon": {
			"num": 137,
			"name": "Porygon",
			"types": ["Normal"]
		},
		"omanyte": {
			"num": 138,
			"name": "Omanyte",
			"types": ["Rock", "Water"]
		},
		"omastar": {
			"num": 139,
			"name": "Omastar",
			"types": ["Rock", "Water"]
		},
		"kabuto": {
			"num": 140,
			"name": "Kabuto",
			"types": ["Rock", "Water"]
		},
		"kabutops": {
			"num": 141,
			"name": "Kabutops",
			"types": ["Rock", "Water"]
		},
		"aerodactyl": {
			"num": 142,
			"name": "Aerodactyl",
			"types": ["Rock", "Flying"]
		},
		"snorlax": {
			"num": 143,
			"name": "Snorlax",
			"types": ["Normal"]
		},
		"articuno": {
			"num": 144,
			"name": "Articuno",
			"types": ["Ice", "Flying"]
		},
		"zapdos": {
			"num": 145,
			"name": "Zapdos",
			"types": ["Electric", "Flying"]
		},
		"moltres": {
			"num": 146,
			"name": "Moltres",
			"types": ["Fire", "Flying"]
		},
		"dratini": {
			"num": 147,
			"name": "Dratini",
			"types": ["Dragon"]
		},
		"dragonair": {
			"num": 148,
			"name": "Dragonair",
			"types": ["Dragon"]
		},
		"dragonite": {
			"num": 149,
			"name": "Dragonite",
			"types": ["Dragon", "Flying"]
		},
		"mewtwo": {
			"num": 150,
			"name": "Mewtwo",
			"types": ["Psychic"]
		},
		"mew": {
			"num": 151,
			"name": "Mew",
			"types": ["Psychic"]
		},
		"missingno": {
			"num": 0,
			"name": "MissingNo.",
			"types": ["Bird", "Normal"]
		}
	};

	const typechart = {
		bug: {
			damageTaken: {
				bug: 0,
				dragon: 0,
				electric: 0,
				fighting: 2,
				fire: 1,
				flying: 1,
				ghost: 0,
				grass: 2,
				ground: 2,
				ice: 0,
				normal: 0,
				poison: 1,
				psychic: 0,
				rock: 1,
				water: 0
			}
		},
		dark: {
			damageTaken: {
				prankster: 3,
				bug: 1,
				dark: 2,
				dragon: 0,
				electric: 0,
				fairy: 1,
				fighting: 1,
				fire: 0,
				flying: 0,
				ghost: 2,
				grass: 0,
				ground: 0,
				ice: 0,
				normal: 0,
				poison: 0,
				psychic: 3,
				rock: 0,
				steel: 0,
				water: 0,
			}
		},
		dragon: {
			damageTaken: {
				bug: 0,
				dark: 0,
				dragon: 1,
				electric: 2,
				fairy: 1,
				fighting: 0,
				fire: 2,
				flying: 0,
				ghost: 0,
				grass: 2,
				ground: 0,
				ice: 1,
				normal: 0,
				poison: 0,
				psychic: 0,
				rock: 0,
				steel: 0,
				water: 2,
			}
		},
		electric: {
			damageTaken: {
				par: 3,
				bug: 0,
				dark: 0,
				dragon: 0,
				electric: 2,
				fairy: 0,
				fighting: 0,
				fire: 0,
				flying: 2,
				ghost: 0,
				grass: 0,
				ground: 1,
				ice: 0,
				normal: 0,
				poison: 0,
				psychic: 0,
				rock: 0,
				steel: 2,
				water: 0
			}
		},
		fairy: {
			damageTaken: {
				bug: 2,
				dark: 2,
				dragon: 3,
				electric: 0,
				fairy: 0,
				fighting: 2,
				fire: 0,
				flying: 0,
				ghost: 0,
				grass: 0,
				ground: 0,
				ice: 0,
				normal: 0,
				poison: 1,
				psychic: 0,
				rock: 0,
				steel: 1,
				water: 0
			}
		},
		fighting: {
			damageTaken: {
				bug: 2,
				dark: 2,
				dragon: 0,
				electric: 0,
				fairy: 1,
				fighting: 0,
				fire: 0,
				flying: 1,
				ghost: 0,
				grass: 0,
				ground: 0,
				ice: 0,
				normal: 0,
				poison: 0,
				psychic: 1,
				rock: 2,
				steel: 0,
				water: 0
			}
		},
		fire: {
			damageTaken: {
				bug: 2,
				dragon: 0,
				electric: 0,
				fighting: 0,
				fire: 2,
				flying: 0,
				ghost: 0,
				grass: 2,
				ground: 1,
				ice: 0,
				normal: 0,
				poison: 0,
				psychic: 0,
				rock: 1,
				water: 1
			}
		},
		flying: {
			damageTaken: {
				bug: 2,
				dark: 0,
				dragon: 0,
				electric: 1,
				fairy: 0,
				fighting: 2,
				fire: 0,
				flying: 0,
				ghost: 0,
				grass: 2,
				ground: 3,
				ice: 1,
				normal: 0,
				poison: 0,
				psychic: 0,
				rock: 1,
				steel: 0,
				water: 0
			}
		},
		ghost: {
			damageTaken: {
				bug: 2,
				dragon: 0,
				electric: 0,
				fighting: 3,
				fire: 0,
				flying: 0,
				ghost: 1,
				grass: 0,
				ground: 0,
				ice: 0,
				normal: 3,
				poison: 2,
				psychic: 0,
				rock: 0,
				water: 0
			}
		},
		grass: {
			damageTaken: {
				powder: 3,
				bug: 1,
				dark: 0,
				dragon: 0,
				electric: 2,
				fairy: 0,
				fighting: 0,
				fire: 1,
				flying: 1,
				ghost: 0,
				grass: 2,
				ground: 2,
				ice: 1,
				normal: 0,
				poison: 1,
				psychic: 0,
				rock: 0,
				steel: 0,
				water: 2
			}
		},
		ground: {
			damageTaken: {
				sandstorm: 3,
				bug: 0,
				dark: 0,
				dragon: 0,
				electric: 3,
				fairy: 0,
				fighting: 0,
				fire: 0,
				flying: 0,
				ghost: 0,
				grass: 1,
				ground: 0,
				ice: 1,
				normal: 0,
				poison: 2,
				psychic: 0,
				rock: 2,
				steel: 0,
				water: 1
			}
		},
		ice: {
			damageTaken: {
				bug: 0,
				dark: 0,
				dragon: 0,
				electric: 0,
				fairy: 0,
				fighting: 1,
				fire: 1,
				flying: 0,
				ghost: 0,
				grass: 0,
				ground: 0,
				ice: 2,
				normal: 0,
				poison: 0,
				psychic: 0,
				rock: 1,
				steel: 1,
				water: 0
			}
		},
		normal: {
			damageTaken: {
				bug: 0,
				dark: 0,
				dragon: 0,
				electric: 0,
				fairy: 0,
				fighting: 1,
				fire: 0,
				flying: 0,
				ghost: 3,
				grass: 0,
				ground: 0,
				ice: 0,
				normal: 0,
				poison: 0,
				psychic: 0,
				rock: 0,
				steel: 0,
				water: 0
			}
		},
		poison: {
			damageTaken: {
				psn: 3,
				tox: 3,
				bug: 1,
				dragon: 0,
				electric: 0,
				fighting: 2,
				fire: 0,
				flying: 0,
				ghost: 0,
				grass: 2,
				ground: 1,
				ice: 0,
				normal: 0,
				poison: 2,
				psychic: 1,
				rock: 0,
				water: 0
			}
		},
		psychic: {
			damageTaken: {
				bug: 1,
				dragon: 0,
				electric: 0,
				fighting: 2,
				fire: 0,
				flying: 0,
				ghost: 3,
				grass: 0,
				ground: 0,
				ice: 0,
				normal: 0,
				poison: 0,
				psychic: 2,
				rock: 0,
				water: 0
			}
		},
		rock: {
			damageTaken: {
				sandstorm: 3,
				bug: 0,
				dark: 0,
				dragon: 0,
				electric: 0,
				fairy: 0,
				fighting: 1,
				fire: 2,
				flying: 2,
				ghost: 0,
				grass: 1,
				ground: 1,
				ice: 0,
				normal: 2,
				poison: 2,
				psychic: 0,
				rock: 0,
				steel: 1,
				water: 1
			}
		},
		steel: {
			damageTaken: {
				psn: 3,
				tox: 3,
				sandstorm: 3,
				bug: 2,
				dark: 0,
				dragon: 2,
				electric: 0,
				fairy: 2,
				fighting: 1,
				fire: 1,
				flying: 2,
				ghost: 0,
				grass: 2,
				ground: 1,
				ice: 2,
				normal: 2,
				poison: 3,
				psychic: 2,
				rock: 2,
				steel: 2,
				water: 0
			}
		},
		water: {
			damageTaken: {
				bug: 0,
				dark: 0,
				dragon: 0,
				electric: 1,
				fairy: 0,
				fighting: 0,
				fire: 2,
				flying: 0,
				ghost: 0,
				grass: 1,
				ground: 0,
				ice: 2,
				normal: 0,
				poison: 0,
				psychic: 0,
				rock: 0,
				steel: 2,
				water: 2
			}
		}
	};

	const recoveryMoves = Object.keys(moves).filter(m => !!moves[m].heal && moves[m].category === "Status").concat(["rest"]);
	
	const statusMoves = Object.keys(moves).filter(m => !!moves[m].status);

	return {
		backdrops,
		confusionDamages,
		defaultSettings,
		defaultSimulations,
		gameTypes,
		maxTeamSize,
		moves,
		physicalSetupMoves,
		pokedex,
		recoveryMoves,
		redundantSets,
		spammableTypes,
		specialSetupMoves,
		spriteSets,
		statusMoves,
		transformedIntoString,
		typechart,
		urls: { formatsDataUrl, gameUrls, laddersUrl, ratingsDataUrl, randomsDataUrl }
	}
}();

if (chrome.extension) chrome.extension.consts = consts;