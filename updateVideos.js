var fs = require('fs');
var platformWhitelist = ['TODO'];
var jf = require('jsonfile');

updateVideos(process.argv[2]);

function updateVideos(platform) {

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


	thematiquesList.forEach(function(thematiqueDirName) {
		var slides = fs.readdirSync(thematiquesDir + '/' + thematiqueDirName)
					   .filter(function(slideName){
						   return (slideName.indexOf('.json') > 0);
					   });
		console.log("updating slides in " + thematiqueDirName);
		slides.forEach(function(slideName) {
			var slidePath = thematiquesDir + '/' + thematiqueDirName + '/' + slideName;
			updateSlide(platform, slidePath);
		});
	});

	console.log('\n DONE UPDATING LESSONS');
};


function updateSlide(platform, slidePath){
	var slide = JSON.parse(fs.readFileSync(slidePath));

	if (slide.question.type == "video"){
		slide = updateContentVideo(platform, slide);
	};

	if (slide.lessons) {
		slide = updateLessonAttribute(platform, slide);
	};

	process.stdout.write('.');
	jf.writeFileSync(slidePath, slide);
};

function updateContentVideo(platform, slide) {
	var sources = slide.question.content.media.src;
	var newSources = [];

	sources.forEach(function(source) {

		// the following lines are commented because I'm not sure we need to modify this.

		if (platform == 'TODO') {
			source.mimeType = "application/kontiki";
		};
		newSources.push(source);
	});

	slide.question.content.media.src = newSources;
	return slide;
};


function updateLessonAttribute(platform, slide) {
	var newLessons = [];
	slide.lessons.forEach(function(lesson) {
		if (platform == 'TODO') {
			lesson.mimeType = "video/x-flv";
			if (lesson.videoId) {
				lesson['mediaUrl'] = lesson.videoId.replace('videoId', 'mediaUrl');
				delete lesson.videoId;
			};
		};
		if (platform == 'TODO') {
			lesson.mimeType = "application/kontiki";
		};
		newLessons.push(lesson);
	});
	slide.lessons = newLessons;
	return slide;
};