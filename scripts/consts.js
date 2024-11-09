const consts = function() {
	const defaultSettings = {
		sprites: {
			front: "0",
			back: "0",
			icons: "3",
			shiny: "3"
		},
		backdrop: "0",
		shinyPercentage: 0,
		damageCalculator: true,
		movesetCalculator: true,
		unrevealedCalculator: true,
		miscCalculator: true,
		trainerTooltip: true,
		animateTrainer: false,
		useModernSprites: false,
		randomAvatar: 1
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
		"sprites/gen6bgs/bg-skypillar.jpg",
		"aveontrainer/bamboo.png",
		"aveontrainer/beach.png",
		"aveontrainer/desert.png",
		"aveontrainer/dive.png",
		"aveontrainer/forest.png",
		"aveontrainer/graveyard.png",
		"aveontrainer/route.png",
		"aveontrainer/safari.png",
		"aveontrainer/snow.png",
		"carchagui/beachDay.png",
		"carchagui/forestDark.png",
		"carchagui/hillNight.png",
		"carchagui/lakeDay.png",
		"carchagui/lakeDusk.png",
		"carchagui/pathForestNight.png",
		"carchagui/pathLavaDusk.png",
		"carchagui/pathSnowDay.png",
		"carchagui/routeDusk.png",
		"coromon/AmishTown.gif",
		"coromon/ElectricCave.gif",
		"coromon/ElectricTownBattleScreen.gif",
		"coromon/PowerTower.png",
		"coromon/StarterRouteBattleScreen.png",
		"coromon/StarterTown.png",
		"coromon/WaterTownBattleScreen.gif",
		"gen1jpn/red.png",
		"gen1jpn/blue.png",
		"gen1jpn/green.png",
		"magiscarf/factory.png",
		"nauris-amatnieks/plainscastle.jpg",
		"oras/4.png",
		"oras/9.png",
		"oras/15.png",
		"oras/24.png",
		"oras/26.png",
		"oras/29.png",
		"oras/30.png",
		"princess-phoenix/beachDay.png",
		"princess-phoenix/beachDusk.png",
		"princess-phoenix/bridgeDay.png",
		"princess-phoenix/bridgeNight.png",
		"princess-phoenix/fieldDusk.png",
		"princess-phoenix/gymDay.png",
		"princess-phoenix/lab.png",
		"princess-phoenix/pierDay.png",
		"princess-phoenix/pierDusk.png",
		"princess-phoenix/pierNight.png",
		"princess-phoenix/plainsDusk.png",
		"princess-phoenix/plainslDay.png",
		"princess-phoenix/plainsNight.png",
		"princess-phoenix/stone.png",
		"princess-phoenix/wallDay.png",
		"xy/3.jpg",
		"xy/5.png",
		"xy/6.jpg",
		"xy/8.png",
		"xy/11.png",
		"xy/battleMansion.png",
		"xy/forest.png",
		"xy/teamFlareHQ.png",
		"xy/vsClemont.png",
		"xy/vsGrant.png",
		"xy/vsLysandra.png",
		"xy/vsOlympia.png",
		"xy/vsViola.png",
		"xy/vsWulfric.png",
		"xy/wifi.jpg",
		"xybg/aquacordeEvening.png",
		"xybg/aquacordeNight.png",
		"xybg/battlebgChampion.png",
		"xybg/battlebgField.png",
		"xybg/battlebgIndoorA.png",
		"xybg/battlebgMountain.png"
	];

	const animatedTrainerSprites = ["acetrainer","acetrainerf","alder","artist","backers","backersf","backpackerf","backpacker",
		"baker","battlegirl","beauty-gen5bw2","bellelba","benga","bianca-pwt","bianca","biker","blackbelt","blaine","blue",
		"brawly","brock","brycen","brycenman","bugsy","burgh","byron","caitlin","candice","cheren-gen5bw2","cheren",
		"chili","chuck","cilan","clair","clay","clerk-boss","clerk","clerkf","colress","crasherwake","cress","cyclist",
		"cyclistf","cynthia","dancer","depotagent","doctor","drayden","elesa-gen5bw2","emmet","erika","falkner","fantina",
		"filenames","fisherman","flannery","gardenia","gentleman","ghetsis","giovanni","grimsley","guitarist","harlequin",
		"hiker","hilbert-wonderlauncher","hilbert","hilda-wonderlauncher","hilda","hooligans","hoopster","hugh","infielder",
		"ingo","iris-gen5bw2","janine","janitor","jasmine","juan","lady","lance","lass","lenora","linebacker","liza",
		"ltsurge","madame","maid","marlon","marshal","maylene","misty","morty","musician","n","nate","nate-wonderlauncher",
		"norman","nurse","nurseryaide","parasollady","pilot","plasmagrunt","plasmagruntf","pokefan","pokefanf",
		"pokemonbreeder","pokemonbreederf","pokemonranger","pokemonrangerf","policeman","preschooler","preschoolerf",
		"pryce","psychic","psychicf","red","richboy","roark","rood","rosa-wonderlauncher","rosa","roughneck","roxanne",
		"roxie","sabrina","schoolkid","schoolkidf","scientist","scientistf","shadowtriad","shauntal","skyla","smasher",
		"steven","striker","swimmer","swimmerf","tate","twins","veteran","veteranf","volkner","waiter","waitress","wallace",
		"wattson","whitney","winona","worker","workerice","youngster","zinzolin"];

	const staticTrainerSprites = ["aaron","aarune","acerola-masters","acerola-masters2","acerola-masters3","acerola",
		"acetrainer-gen1","acetrainer-gen1rb","acetrainer-gen2","acetrainer-gen3","acetrainer-gen3jp","acetrainer-gen3rs",
		"acetrainer-gen4","acetrainer-gen4dp","acetrainer-gen6","acetrainer-gen6xy","acetrainer-gen7",
		"acetrainercouple-gen3","acetrainercouple","acetrainerf-gen1","acetrainerf-gen1rb","acetrainerf-gen2",
		"acetrainerf-gen3","acetrainerf-gen3rs","acetrainerf-gen4","acetrainerf-gen4dp","acetrainerf-gen6",
		"acetrainerf-gen6xy","acetrainerf-gen7","acetrainersnow","acetrainersnowf","adaman-masters","adaman",
		"aetheremployee","aetheremployeef","aetherfoundation","aetherfoundation2","aetherfoundationf","agatha-gen1",
		"agatha-gen1rb","agatha-gen3","agatha-lgpe","akari-isekai","akari","alain","alec-anime","allister-masters",
		"allister-unmasked","allister","amarys","amelia-shuffle","anabel-gen3","anabel-gen7","anabel","anthe","anthea",
		"anvin","aquagrunt-rse","aquagrunt","aquagruntf-rse","aquagruntf","aquasuit","archer","archie-gen3","archie-gen6",
		"archie-usum","arezu","argenta","ariana","arlo","aromalady-gen3","aromalady-gen3rs","aromalady-gen6","aromalady",
		"artist-gen4","artist-gen6","artist-gen8","artist-gen9","artistf-gen6","arven-s","arven-v","ash-alola",
		"ash-capbackward","ash-hoenn","ash-johto","ash-kalos","ash-sinnoh","ash-unova","ash","atticus","avery","az",
		"backpacker-gen6","backpacker-gen8","backpacker-gen9","backpacker","ballguy","barry-masters","barry",
		"battlegirl-gen3","battlegirl-gen4","battlegirl-gen6","battlegirl-gen6xy","bea-masters","bea","beauty-gen1",
		"beauty-gen1rb","beauty-gen2","beauty-gen2jp","beauty-gen3","beauty-gen3rs","beauty-gen4dp","beauty-gen6",
		"beauty-gen6xy","beauty-gen7","beauty-gen8","beauty-gen9","beauty-masters","beauty","bede-leader","bede-masters",
		"bede","bellepa","bellhop","bellis","beni-ninja","beni","bertha","bianca-masters","biker-gen1","biker-gen1rb",
		"biker-gen2","biker-gen3","biker-gen4","bill-gen3","birch-gen3","birch","birdkeeper-gen1","birdkeeper-gen1rb",
		"birdkeeper-gen2","birdkeeper-gen3","birdkeeper-gen3rs","birdkeeper-gen4dp","birdkeeper-gen6","birdkeeper",
		"blackbelt-gen1","blackbelt-gen1rb","blackbelt-gen2","blackbelt-gen3","blackbelt-gen3rs","blackbelt-gen4",
		"blackbelt-gen4dp","blackbelt-gen6","blackbelt-gen7","blackbelt-gen8","blackbelt-gen9","blaine-gen1",
		"blaine-gen1rb","blaine-gen2","blaine-gen3","blaine-lgpe","blanche-casual","blanche","blue-gen1",
		"blue-gen1champion","blue-gen1rb","blue-gen1rbchampion","blue-gen1rbtwo","blue-gen1two","blue-gen2","blue-gen3",
		"blue-gen3champion","blue-gen3two","blue-gen7","blue-lgpe","blue-masters","blue-masters2","boarder-gen2",
		"boarder","bodybuilder-gen9","bodybuilderf-gen9","brandon-gen3","brandon","brassius","brawly-gen3","brawly-gen6",
		"brawly","brendan-contest","brendan-e","brendan-gen3","brendan-gen3rs","brendan-masters","brendan-rs","brendan",
		"briar","brigette","brock-gen1","brock-gen1rb","brock-gen2","brock-gen3","brock-lgpe","brock-masters","bruno-gen1",
		"bruno-gen1rb","bruno-gen2","bruno-gen3","bruno","bryony","buck","bugcatcher-gen1","bugcatcher-gen1rb",
		"bugcatcher-gen2","bugcatcher-gen3","bugcatcher-gen3rs","bugcatcher-gen4dp","bugcatcher-gen6","bugcatcher",
		"bugmaniac-gen3","bugmaniac-gen6","bugsy-gen2","burgh-masters","burglar-gen1","burglar-gen1rb","burglar-gen2",
		"burglar-gen3","burglar-lgpe","burglar","burnet-radar","burnet","butler","cabbie-gen9","cabbie","cafemaster",
		"caitlin-gen4","caitlin-masters","calaba","calem-masters","calem","cameraman-gen6","cameraman-gen8","cameraman",
		"camper-gen2","camper-gen3","camper-gen3rs","camper-gen6","camper","candela-casual","candela","candice-masters",
		"caraliss","caretaker","carmine-festival","carmine","cedricjuniper","celio","channeler-gen1","channeler-gen1rb",
		"channeler-gen3","channeler-lgpe","charm","charon","chase","chef","cheren-masters","cheryl","choy","christoph",
		"chuck-gen2","clair-gen2","clair-masters","clavell-s","clemont","clerk-gen8","clerk-unite","clerkf-gen8","cliff",
		"clive-v","clover","clown","cogita","coin","collector-gen3","collector-gen6","collector-gen7","collector-masters",
		"collector","colress-gen7","colza","concordia","cook-gen7","cook-gen9","cook","courier","courtney-gen3","courtney",
		"cowgirl","crispin","crushgirl-gen3","crushkin-gen3","cueball-gen1","cueball-gen1rb","cueball-gen3","curtis",
		"cyclist-gen4","cyclistf-gen4","cyllene","cynthia-anime","cynthia-anime2","cynthia-gen4","cynthia-gen7",
		"cynthia-masters","cynthia-masters2","cynthia-masters3","cyrano","cyrus-masters","cyrus","dagero","dahlia",
		"daisy-gen3","dana","dancer-gen7","dancer-gen8","darach-caitlin","darach","dawn-contest","dawn-gen4pt",
		"dawn-masters","dawn-masters2","dawn-masters3","dawn","delinquent-gen9","delinquent","delinquentf-gen9",
		"delinquentf2-gen9","dendra","dexio-gen6","dexio","diamondclanmember","diantha-masters","diantha-masters2",
		"diantha","doctor-gen8","doctorf-gen8","doubleteam","dragontamer-gen3","dragontamer-gen6","dragontamer-gen9",
		"dragontamer","drake-gen3","drasna","drayton","dulse","elaine","elesa-masters","elesa-masters2","elesa",
		"elio-usum","elio","elm","emma","emmet-masters","engineer-gen1","engineer-gen1rb","engineer-gen3","erbie-unite",
		"eri","erika-gen1","erika-gen1rb","erika-gen2","erika-gen3","erika-lgpe","erika-masters","erika-masters2",
		"essentia","ethan-gen2","ethan-gen2c","ethan-masters","ethan-pokeathlon","ethan","eusine-gen2","eusine","evelyn",
		"expert-gen3","expert-gen6","expertf-gen3","expertf-gen6","faba","fairytalegirl","falkner-gen2","fennel",
		"firebreather-gen2","firebreather","firefighter","fisher-gen8","fisherman-gen1","fisherman-gen1rb",
		"fisherman-gen2jp","fisherman-gen3","fisherman-gen3rs","fisherman-gen4","fisherman-gen6","fisherman-gen6xy",
		"fisherman-gen7","flannery-gen3","flannery-gen6","flaregrunt","flaregruntf","flint","florian-bb",
		"florian-festival","florian-s","freediver","furisodegirl-black","furisodegirl-blue","furisodegirl-pink",
		"furisodegirl-white","gaeric","galacticgrunt","galacticgruntf","gambler-gen1","gambler-gen1rb","gambler",
		"gamer-gen3","garcon","gardener","gardenia-masters","geeta","gentleman-gen1","gentleman-gen1rb","gentleman-gen2",
		"gentleman-gen3","gentleman-gen3rs","gentleman-gen4","gentleman-gen4dp","gentleman-gen6","gentleman-gen6xy",
		"gentleman-gen7","gentleman-gen8","gentleman-lgpe","ghetsis-gen5bw","giacomo","ginchiyo-conquest","ginter",
		"giovanni-gen1","giovanni-gen1rb","giovanni-gen3","giovanni-lgpe","giovanni-masters","glacia-gen3","glacia",
		"gladion-masters","gladion-stance","gladion","gloria-dojo","gloria-league","gloria-masters","gloria-tundra",
		"gloria","golfer","gordie","grace","grant","green","greta-gen3","greta","grimsley-gen7","grimsley-masters",
		"grusha","guitarist-gen2","guitarist-gen3","guitarist-gen4","guitarist-gen6","gurkinn","guzma-masters","guzma",
		"hala","hanbei-conquest","hapu","hassel","hau-masters","hau-stance","hau","hayley","heath","hero-conquest",
		"hero2-conquest","heroine-conquest","heroine2-conquest","hexmaniac-gen3","hexmaniac-gen3jp","hexmaniac-gen6",
		"hiker-gen1","hiker-gen1rb","hiker-gen2","hiker-gen3","hiker-gen3rs","hiker-gen4","hiker-gen6","hiker-gen7",
		"hiker-gen8","hiker-gen9","hilbert-masters","hilbert-masters2","hilda-masters","hilda-masters2","hilda-masters3",
		"hop-masters","hop","hyde","idol","ilima","ingo-hisui","ingo-masters","interviewers-gen3","interviewers-gen6",
		"interviewers","iono","irida-masters","irida","iris-gen5bw2","iris-masters","iris","iscan","jacq","jamie",
		"janine-gen2","janitor-gen7","janitor-gen9","jasmine-contest","jasmine-gen2","jasmine-masters","jasmine-masters2",
		"jessiejames-gen1","jogger","johanna-contest","johanna","jrtrainer-gen1","jrtrainer-gen1rb","jrtrainerf-gen1",
		"jrtrainerf-gen1rb","juan-gen3","juggler-gen1","juggler-gen1rb","juggler-gen2","juggler-gen3","juggler",
		"juliana-bb","juliana-festival","juliana-s","juniper","jupiter","kabu","kahili","kamado-armor","kamado",
		"karen-gen2","karen","katy","kiawe","kieran-champion","kieran-festival","kieran","kimonogirl-gen2","kimonogirl",
		"kindler-gen3","kindler-gen6","klara","kofu","koga-gen1","koga-gen1rb","koga-gen2","koga-gen3","koga-lgpe","koga",
		"korrina-masters","korrina","kris-gen2","kris-masters","kris","kukui-stand","kukui","kunoichi-conquest",
		"kunoichi2-conquest","kurt","lacey","lady-gen3","lady-gen3rs","lady-gen4","lady-gen6","lady-gen6oras",
		"lana-masters","lana","lance-gen1","lance-gen1rb","lance-gen2","lance-gen3","lance-lgpe","lance-masters",
		"lanette","larry","lass-gen1","lass-gen1rb","lass-gen2","lass-gen3","lass-gen3rs","lass-gen4","lass-gen4dp",
		"lass-gen6","lass-gen6oras","lass-gen7","lass-gen8","laventon","laventon2","leaf-gen3","leaf-masters",
		"leaf-masters2","leaguestaff","leaguestafff","leon-masters","leon-masters2","leon-tower","leon","li","lian",
		"lillie-masters","lillie-masters2","lillie-masters3","lillie-z","lillie","lisia-masters","lisia","liza-gen6",
		"liza-masters","lorelei-gen1","lorelei-gen1rb","lorelei-gen3","lorelei-lgpe","ltsurge-gen1","ltsurge-gen1rb",
		"ltsurge-gen2","ltsurge-gen3","lucas-contest","lucas-gen4pt","lucas","lucian","lucy-gen3","lucy",
		"lusamine-masters","lusamine-nihilego","lusamine","lyra-masters","lyra-masters2","lyra-pokeathlon","lyra",
		"lysandre-masters","lysandre","madame-gen4","madame-gen4dp","madame-gen6","madame-gen7","madame-gen8",
		"magmagrunt-rse","magmagrunt","magmagruntf-rse","magmagruntf","magmasuit","magnolia","magnus","mai","maid-gen4",
		"maid-gen6","mallow-masters","mallow","malva","marley","marnie-league","marnie-masters","marnie-masters2",
		"marnie-masters3","marnie","mars","masamune-conquest","mateo","matt-gen3","matt","maxie-gen3","maxie-gen6",
		"may-contest","may-e","may-gen3","may-gen3rs","may-masters","may-masters2","may-masters3","may-rs","may",
		"medium-gen2jp","medium","mela","melli","melony","miku-fire","miku-flying","miku-grass","miku-ground",
		"miku-psychic","miku-water","milo","mina-lgpe","mina-masters","mina","mira","miriam","mirror","misty-gen1",
		"misty-gen1rb","misty-gen2","misty-gen3","misty-lgpe","misty-masters","model-gen8","mohn-anime","mohn","molayne",
		"mom-alola","mom-hoenn","mom-johto","mom-paldea","mom-unova","mom-unova2","morgan","morty-gen2","morty-masters",
		"morty-masters2","mrbriney","mrfuji-gen3","mrstone","musician-gen8","musician-gen9","mustard-champion",
		"mustard-master","mustard","n-masters","n-masters2","n-masters3","nancy","nanu","nate-masters","nate-pokestar",
		"nate-pokestar3","nate-wonderlauncher","nemona-s","nemona-v","neroli","nessa-masters","nessa","ninjaboy-gen3",
		"ninjaboy-gen6","ninjaboy","nita","nobunaga-conquest","noland-gen3","noland","norman-gen3","norman-gen6",
		"oak-gen1","oak-gen1rb","oak-gen2","oak-gen3","oak","officer-gen2","officeworker-gen9","officeworker",
		"officeworkerf-gen9","officeworkerf","ogreclan","oichi-conquest","oldcouple-gen3","oleana","olivia","olympia",
		"opal","ortega","owner","painter-gen3","palina","palmer","parasollady-gen3","parasollady-gen4","parasollady-gen6",
		"paulo-masters","pearlclanmember","penny","peonia","peony-league","peony","perrin","pesselle","petrel","phil",
		"phoebe-gen3","phoebe-gen6","phoebe-masters","phorus-unite","phyco","picnicker-gen2","picnicker-gen3",
		"picnicker-gen3rs","picnicker-gen6","picnicker","piers-league","piers-masters","piers","plasmagrunt-gen5bw",
		"plasmagruntf-gen5bw","player-go","playerf-go","plumeria-league","plumeria","pokefan-gen2","pokefan-gen3",
		"pokefan-gen4","pokefan-gen6","pokefan-gen6xy","pokefanf-gen2","pokefanf-gen3","pokefanf-gen4","pokefanf-gen6",
		"pokefanf-gen6xy","pokekid-gen8","pokekid","pokekidf-gen8","pokemaniac-gen1","pokemaniac-gen1rb","pokemaniac-gen2",
		"pokemaniac-gen3","pokemaniac-gen3rs","pokemaniac-gen6","pokemaniac-gen9","pokemaniac","pokemonbreeder-gen3",
		"pokemonbreeder-gen4","pokemonbreeder-gen6","pokemonbreeder-gen6xy","pokemonbreeder-gen7","pokemonbreeder-gen8",
		"pokemonbreederf-gen3","pokemonbreederf-gen3frlg","pokemonbreederf-gen4","pokemonbreederf-gen6",
		"pokemonbreederf-gen6xy","pokemonbreederf-gen7","pokemonbreederf-gen8","pokemoncenterlady","pokemonranger-gen3",
		"pokemonranger-gen3rs","pokemonranger-gen4","pokemonranger-gen6","pokemonranger-gen6xy","pokemonrangerf-gen3",
		"pokemonrangerf-gen3rs","pokemonrangerf-gen4","pokemonrangerf-gen6","pokemonrangerf-gen6xy","policeman-gen4",
		"policeman-gen7","policeman-gen8","poppy","postman","preschooler-gen6","preschooler-gen7","preschoolerf-gen6",
		"preschoolerf-gen7","preschoolers","proton","pryce-gen2","psychic-gen1","psychic-gen1rb","psychic-gen2",
		"psychic-gen3","psychic-gen3rs","psychic-gen4","psychic-gen6","psychic-lgpe","psychicf-gen3","psychicf-gen3rs",
		"psychicf-gen4","psychicfjp-gen3","punkgirl-gen7","punkgirl-masters","punkgirl","punkguy-gen7","punkguy","raifort",
		"raihan-masters","raihan","railstaff","ramos","rancher","ranmaru-conquest","red-gen1","red-gen1main","red-gen1rb",
		"red-gen1title","red-gen2","red-gen3","red-gen7","red-lgpe","red-masters","red-masters2","red-masters3",
		"rei-isekai","rei","reporter-gen6","reporter-gen8","reporter","rhi","richboy-gen3","richboy-gen4","richboy-gen6",
		"richboy-gen6xy","rika","riley","risingstar-gen6","risingstar","risingstarf-gen6","risingstarf","rita","river",
		"rocker-gen1","rocker-gen1rb","rocker-gen3","rocket-gen1","rocket-gen1rb","rocketexecutive-gen2",
		"rocketexecutivef-gen2","rocketgrunt-gen2","rocketgrunt","rocketgruntf-gen2","rocketgruntf","rollerskater",
		"rollerskaterf","rosa-masters","rosa-masters2","rosa-masters3","rosa-pokestar","rosa-pokestar2","rosa-pokestar3",
		"rose-zerosuit","rose","roughneck-gen4","rowan","roxanne-gen3","roxanne-gen6","roxanne-masters","roxie-masters",
		"ruffian","ruinmaniac-gen3","ruinmaniac-gen3rs","ruinmaniac-gen6","ruinmaniac","rye","ryme","ryuki","sabi",
		"sabrina-frlg","sabrina-gen1","sabrina-gen1rb","sabrina-gen2","sabrina-gen3","sabrina-lgpe","sabrina-masters",
		"sada-ai","sada","sage-gen2","sage-gen2jp","sage","saguaro","sailor-gen1","sailor-gen1rb","sailor-gen2",
		"sailor-gen3","sailor-gen3jp","sailor-gen3rs","sailor-gen6","sailor","salvatore","samsonoak","sanqua","saturn",
		"schoolboy-gen2","schoolboy","schoolgirl","schoolkid-gen3","schoolkid-gen4","schoolkid-gen4dp","schoolkid-gen6",
		"schoolkid-gen8","schoolkidf-gen3","schoolkidf-gen4","schoolkidf-gen6","schoolkidf-gen8","scientist-gen1",
		"scientist-gen1rb","scientist-gen2","scientist-gen3","scientist-gen4","scientist-gen4dp","scientist-gen6",
		"scientist-gen7","scientist-gen9","scientistf-gen6","scott","scottie-masters","scubadiver","securitycorps",
		"securitycorpsf","selene-masters","selene-usum","selene","serena-anime","serena-masters","serena-masters2",
		"serena-masters3","serena","shauna-masters","shauna","shelly-gen3","shelly","shielbert","sidney-gen3","sidney",
		"siebold-masters","siebold","sierra","sightseer","sightseerf","silver-gen2","silver-gen2kanto","silver-masters",
		"silver","sina-gen6","sina","sisandbro-gen3","sisandbro-gen3rs","sisandbro","skier-gen2","skier","skierf-gen4dp",
		"skierf","skullgrunt","skullgruntf","skyla-masters","skyla-masters2","skytrainer","skytrainerf","soliera",
		"sonia-masters","sonia-professor","sonia","sophocles","sordward-shielbert","sordward","spark-casual","spark",
		"spenser-gen3","spenser","srandjr-gen3","stargrunt-s","stargrunt-v","stargruntf-s","stargruntf-v","steven-gen3",
		"steven-gen6","steven-masters","steven-masters2","steven-masters3","steven-masters4","streetthug-masters",
		"streetthug","supernerd-gen1","supernerd-gen1rb","supernerd-gen2","supernerd-gen3","supernerd","surfer",
		"swimmer-gen1","swimmer-gen1rb","swimmer-gen4","swimmer-gen4dp","swimmer-gen4jp","swimmer-gen6","swimmer-gen7",
		"swimmer-gen8","swimmer-masters","swimmerf-gen2","swimmerf-gen3","swimmerf-gen3rs","swimmerf-gen4",
		"swimmerf-gen4dp","swimmerf-gen6","swimmerf-gen7","swimmerf-gen8","swimmerf2-gen6","swimmerf2-gen7",
		"swimmerfjp-gen2","swimmerm-gen2","swimmerm-gen3","swimmerm-gen3rs","sycamore-masters","sycamore","tabitha-gen3",
		"tabitha","tamer-gen1","tamer-gen1rb","tamer-gen3","taohua","tate-gen6","tate-masters","tateandliza-gen3",
		"tateandliza-gen6","teacher-gen2","teacher-gen7","teacher","teamaquabeta-gen3","teamaquagruntf-gen3",
		"teamaquagruntm-gen3","teammagmagruntf-gen3","teammagmagruntm-gen3","teammates","teamrocket",
		"teamrocketgruntf-gen3","teamrocketgruntm-gen3","theroyal","thorton","tierno","tina-masters","toddsnap",
		"toddsnap2","tourist","touristf","touristf2","trevor","trialguide","trialguidef","triathletebiker-gen6",
		"triathletebikerf-gen3","triathletebikerm-gen3","triathleterunner-gen6","triathleterunnerf-gen3",
		"triathleterunnerm-gen3","triathleteswimmer-gen6","triathleteswimmerf-gen3","triathleteswimmerm-gen3",
		"tuber-gen3","tuber-gen6","tuber","tuberf-gen3","tuberf-gen3rs","tuberf-gen6","tuberf","tucker-gen3","tucker",
		"tuli","tulip","turo-ai","turo","twins-gen2","twins-gen3","twins-gen3rs","twins-gen4","twins-gen4dp","twins-gen6",
		"tyme","ultraforestkartenvoy","unknown","unknownf","valerie","vessa","veteran-gen4","veteran-gen6","veteran-gen7",
		"veteranf-gen6","veteranf-gen7","victor-dojo","victor-league","victor-masters","victor-tundra","victor","vince",
		"viola-masters","viola","volkner-masters","volo-ginkgo","volo","waiter-gen4","waiter-gen4dp","waiter-gen9",
		"waitress-gen4","waitress-gen6","waitress-gen9","wallace-gen3","wallace-gen3rs","wallace-gen6","wallace-masters",
		"wally-gen3","wally-masters","wally-rse","wally","wattson-gen3","whitney-gen2","whitney-masters","wicke",
		"wikstrom","will-gen2","will","willow-casual","willow","winona-gen3","winona-gen6","worker-gen4","worker-gen6",
		"worker-gen7","worker-gen8","worker-gen9","worker-lgpe","worker2-gen6","workerf-gen8","wulfric","xerosic","yancy",
		"yellgrunt","yellgruntf","yellow","youngathlete","youngathletef","youngcouple-gen3","youngcouple-gen3rs",
		"youngcouple-gen4dp","youngcouple-gen6","youngcouple","youngn","youngster-gen1","youngster-gen1rb",
		"youngster-gen2","youngster-gen3","youngster-gen3rs","youngster-gen4","youngster-gen4dp","youngster-gen6",
		"youngster-gen6xy","youngster-gen7","youngster-gen8","youngster-gen9","youngster-masters","yukito-hideko",
		"zinnia-masters","zinnia","zirco-unite","zisu","zossie"];

	const trainerSprites = animatedTrainerSprites.concat(staticTrainerSprites);

	const spriteSets = {
		afd: {
			front: true,
			back: true,
			shiny: true,
			icons: "gen5",
			shinyTypos: {
				"aerodactyl": "aerodactyl "
			}
		},
		afd2020: {
			front: true,
			back: true,
			shiny: true,
			icons: "gen5",
			custom: true
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
			shiny: "gen2spaceworld-shiny",
			custom: true
		},
		gen1artrg: {
			front: true,
			back: "gen1-back",
			icons: "art",
			substitute: "gen1",
			shiny: "gen2spaceworld-shiny",
			custom: true
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
			local: true,
			custom: true
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
		animatedTrainerSprites,
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
		trainerSprites,
		transformedIntoString,
		typechart,
		urls: { formatsDataUrl, gameUrls, laddersUrl, ratingsDataUrl, randomsDataUrl }
	}
}();

if (chrome.extension) chrome.extension.consts = consts;