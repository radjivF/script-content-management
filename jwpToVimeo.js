var fs = require('fs');
var platformWhitelist = ['TODO'];
var jf = require('jsonfile');
var _ = require('lodash');


jwpToVimeo(process.argv[2]);

function jwpToVimeo(platform) {
	if (platformWhitelist.indexOf(platform) < 0) {
		console.log("The platform must be one of " + platformWhitelist.join(","));
		return;
	}

	var thematiquesDir = platform + '/thematiques';

	if (!fs.existsSync(thematiquesDir)) {
    	console.log("Please enter a valid platform directory. For example: digital");
    	return;
	}

	var thematiquesList = fs.readdirSync(thematiquesDir)
							.filter(function(dirName) {
								return (dirName.indexOf('.json') < 0) && (dirName.match(/^\./) == null) && fs.lstatSync(thematiquesDir + '/' + dirName).isDirectory();
							});

	if (thematiquesList.length == 0) {
    	console.log("Please enter a valid discipline ref. For example: 01");
    	return;
	}

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
}


function updateSlide(slidePath){
	var slide = JSON.parse(fs.readFileSync(slidePath));
	
	_.each(slide.lessons, function(lesson) {

		if (lesson.type === 'video') {
			lesson.mimeType = 'application/vimeo';
			lesson['videoId'] = lesson.mediaUrl.replace('.mediaUrlMp4', '.videoId');
			delete lesson.mediaUrl;
			delete lesson.src;
		}
	});

	_.each(slide.question.medias, function(media) {

		if (media.type === 'video') {
			var srcVimeo = {};
			srcVimeo['mimeType'] = 'application/vimeo';
			srcVimeo['videoId'] = media.src[0].mediaUrl.replace('.mediaUrlMp4', '.videoId');
		
			media.src = [srcVimeo];
		}
	});

	process.stdout.write('.');
	jf.writeFileSync(slidePath, slide);

}