var fs = require('fs');
var platformWhitelist = ['TODO'];
var jf = require('jsonfile');
var _ = require('lodash');


addPosters(process.argv[2]);

function addPosters(platform) {
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
										&& fs.lstatSync(thematiquesDir + '/' + dirName).isDirectory();
							});

	if (thematiquesList.length == 0) {
    	console.log("Please enter a valid discipline ref. For example: 01");
    	return;
	};

	thematiquesList.forEach(function(thematiqueDirName) {

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
	_.each(slide.lessons, function(lesson) {

		if (lesson.type === 'video') {
			lesson.mimeType = 'video/x-flv';
			lesson['mediaUrl'] = lesson.poster.replace('.mini', '.mediaUrl');
			delete lesson.videoId;
		}

		if (lesson.type === 'pdf') {
			lesson['poster'] = lesson.description.replace('.description', '.mini');
		}
		process.stdout.write('.');
		jf.writeFileSync(slidePath, slide);
	});

};