var fs = require('fs');
var platformWhitelist = ['TODO'];
var jf = require('jsonfile');
var _ = require('lodash');


vimeoToJwp(process.argv[2]);

function vimeoToJwp(platform) {
	if (platformWhitelist.indexOf(platform) < 0) {
		console.log("The platform must be one of " + platformWhitelist.join(","));
		return;
	}

	var thematiquesDir = platform + '/thematiques';

	if (!fs.existsSync(thematiquesDir)) {
    	console.log("Please enter a valid platform directory. For example: TODO");
    	return;
	}

	var thematiquesList = fs.readdirSync(thematiquesDir)
							.filter(function(dirName) {
								return (dirName.indexOf('.json') < 0) && (dirName.match(/^\./) === null) && fs.lstatSync(thematiquesDir + '/' + dirName).isDirectory();
							});

	if (thematiquesList.length === 0) {
    	console.log("Please enter a valid discipline ref. For example: 01");
    	return;
	}

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
}


function updateSlide(slidePath){
	var slide = JSON.parse(fs.readFileSync(slidePath));
	
	_.each(slide.lessons, function(lesson) {

		if (lesson.type === 'video') {
			lesson.mimeType = 'video/mp4';
			lesson['mediaUrl'] = lesson.videoId.replace('.videoId', '.mediaUrlMp4');
			delete lesson.videoId;

			var srcWebM = {};
			srcWebM["mimeType"] =  "video/webm";
			srcWebM["mediaUrl"] = lesson.mediaUrl.replace('.mediaUrlMp4', '.mediaUrlWebM');

			var srcFlv = {};
			srcFlv["mimeType"] = "video/x-flv";
			srcFlv["mediaUrl"] = lesson.mediaUrl.replace('.mediaUrlMp4', '.mediaUrlFlv');

			lesson['src'] = [srcWebM, srcFlv];
		}
	});

	_.each(slide.question.medias, function(media) {

		if (media.type === 'video') {
			var videoId = media.src[0].videoId;

			var srcMp4 = {};
			srcMp4["mimeType"] =  "video/mp4";
			srcMp4["mediaUrl"] = videoId.replace('.videoId', '.mediaUrlMp4');

			var srcWebM = {};
			srcWebM["mimeType"] =  "video/webm";
			srcWebM["mediaUrl"] = videoId.replace('.videoId', '.mediaUrlWebM');

			var srcFlv = {};
			srcFlv["mimeType"] = "video/x-flv";
			srcFlv["mediaUrl"] = videoId.replace('.videoId', '.mediaUrlFlv');

			media.src = [srcMp4, srcWebM, srcFlv];
		}
	});

	process.stdout.write('.');
	jf.writeFileSync(slidePath, slide);

}