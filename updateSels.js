// updateSels
// ----------
// version of 20141210

// run node updateSels dir

var fs = require('fs');
var locales = {};
var selRegex = /sel[0-9]+/g;
var inpRegex = /inp[0-9]+/g;

updateSels(process.argv[2]);


function updateSels(dir) {
	console.log('start updatings __sel__ and __inp__ from ' + dir);
	var thematiquesDir = dir + '/thematiques';
	var localesDir = dir + '/locale/thematique';

	if (!fs.existsSync(thematiquesDir)) {
    	console.log("Please enter a valid platform directory. For example: digital");
    	return;
	}

	loadLocales(localesDir);

	var thematiquesList = fs.readdirSync(thematiquesDir)
							.filter(function(dirName) {
								return (dirName.indexOf('.json') < 0) && (dirName.match(/^\./) == null);
							});

	thematiquesList.forEach(function(thematiqueDirName) {
		var slides = fs.readdirSync(thematiquesDir + '/' + thematiqueDirName)
					   .filter(function(slideName) {
							return (slideName.indexOf('.json') > 0);
					   });

		slides.forEach(function(slideName) {
			var slidePath = thematiquesDir + '/' + thematiqueDirName + '/' + slideName;
			var buf = fs.readFileSync(slidePath);

			if(buf.toString().match(selRegex)){
				updateLocales(JSON.parse(buf), buf.toString().match(selRegex), selRegex);
			}

			if(buf.toString().match(inpRegex)){
				updateLocales(JSON.parse(buf), buf.toString().match(inpRegex), inpRegex);
			}
		});
	});
	saveLocales(localesDir);
	console.log("DONE");
};


function loadLocales(localesDirPath) {
	var localesDir = fs.readdirSync(localesDirPath).filter(function(fileName) {
		return (fileName.match(/^\./) == null);
	});
	localesDir.forEach(function(localeName) {
		var locale = fs.readFileSync(localesDirPath + '/' + localeName).toString();
		locales[localeName] = locale;
	});
}


function saveLocales(localesDirPath) {
	for(var locale in locales) {
		console.log(locale);
		fs.writeFileSync(localesDirPath + '/' + locale, locales[locale]);
	}
}


function updateLocales(slide, JSONsels, regex) {

	var path = slide.question.header.split('.');
	
	for (var key in locales) {
		var locale = locales[key];
	
		var slideIndex = 0;
		for (var i = 0; i < path.length; i++) {
			var nextIndex = locale.substring(slideIndex).indexOf(path[i] + ':');
			if(nextIndex < 0) {
				console.log("slide " + slide.ref + " not found in " + key);
				return;
			}
			slideIndex = slideIndex + nextIndex;
		};

		var curLocale = locale.substring(slideIndex);
		var nextSlideIndex = curLocale.indexOf("slide_");
		var matches = curLocale.match(regex);

		if (curLocale.indexOf("template: ") > nextSlideIndex) {
			console.log("WARNING: missing template in " + slide.ref + " in " + key);
			return;
		};
		
		if (matches == null) {
			console.log("WARNING: slide " + slide.ref + " not found in " + key);
			return;
		};

		matches = matches.splice(0, JSONsels.length);

		for(var i = 0; i < JSONsels.length; i ++) {
			curLocale = curLocale.replace(matches[i], JSONsels[i]);
		};

		locale = locale.substring(0, slideIndex) + curLocale;
		locales[key] = locale;
	};
};

