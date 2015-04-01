var fs = require('fs');
var platformWhitelist = ['chanel'];
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
	_.each(slide.question.medias, function(media) {

		if (media.type === 'video') {
			if (media.src.length == 3) {
				//DO NOTHING
				console.log('SKIP SLIDE ' + slide.ref);
			} else {
				var mediaUrl = media.src[0].mediaUrl;

				var srcMp4 = {};
				srcMp4["mimeType"] =  "video/mp4";
				srcMp4["mediaUrl"] = mediaUrl.replace('.mediaUrl', '.mediaUrlMp4');

				var srcWebM = {};
				srcWebM["mimeType"] =  "video/webm";
				srcWebM["mediaUrl"] = mediaUrl.replace('.mediaUrl', '.mediaUrlWebM');

				var srcFlv = {};
				srcFlv["mimeType"] = "video/x-flv";
				srcFlv["mediaUrl"] = mediaUrl.replace('.mediaUrl', '.mediaUrlFlv');

				media.src = [srcMp4, srcWebM, srcFlv];

				console.log('SLIDE ' + slide.ref);
				jf.writeFileSync(slidePath, slide);
			}
		}
	});
};