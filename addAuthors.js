var fs = require('fs');
var platformWhitelist = ['wetransform'];
var jf = require('jsonfile');
var regexp = require('node-regexp');
var S = require('string');


addPdfs(process.argv[2], process.argv[3]);

function addAutors(platform, disciplineRef) {
	if (platformWhitelist.indexOf(platform) < 0) {
		console.log("The platform must be one of " + platformWhitelist.join(","));
		return;
	};

	var thematiquesDir = platform + '/thematiques';

	if (!fs.existsSync(thematiquesDir)) {
    	console.log("Please enter a valid platform directory. For example: digital");
    	return;
	}

	var thematiquesList = fs.readdirSync(thematiquesDir)
							.filter(function(dirName) {
								return (dirName.indexOf('.json') < 0) 
										&& (dirName.match(/^\./) == null) 
										&& (dirName.indexOf(disciplineRef) >= 0) 
										&& fs.lstatSync(thematiquesDir + '/' + dirName).isDirectory();
							});

	if (thematiquesList.length == 0) {
    	console.log("Please enter a valid discipline ref. For example: 01");
    	return;
	};

	thematiquesList.forEach(function(thematiqueDirName) {
				//console.log(thematiquesDir + '/' + thematiqueDirName+'/test/');
		var slides = fs.readdirSync(thematiquesDir + '/' + thematiqueDirName)
					   .filter(function(slideName){
						   return (slideName.indexOf('.json') > 0);
					   });
		console.log("updating slides in " + thematiqueDirName);
		slides.forEach(function(slideName) {
			var slidePath = thematiquesDir + '/' + thematiqueDirName + '/' + slideName;
			updateSlide(slidePath);
		});
	});

	console.log('\n DONE UPDATING LESSONS');
};


function updateSlide(slidePath){
	var slide = JSON.parse(fs.readFileSync(slidePath));
	authors = [];
	console.log(slide)
	jf.writeFileSync(slidePath, slide);
		
};