var fs = require('fs');
var platformWhitelist = ['schneider', 'chanel'];
var jf = require('jsonfile');
var S = require('string');


addPdfs(process.argv[2], process.argv[3]);

function addPdfs(platform, disciplineRef) {
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
								return (dirName.indexOf('.json') < 0) && (dirName.match(/^\./) === null) && (dirName.indexOf(disciplineRef) >= 0) && fs.lstatSync(thematiquesDir + '/' + dirName).isDirectory();
							});

	if (thematiquesList.length === 0) {
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


	if(slide.lessons){
		var description = slide.lessons[0].poster;
		// the description is the videos poster not the description of the videos
 
		description = description.replace('video_1', 'pdf');
		description = description.replace('mini', 'description');
		console.log(description);
		slide.lessons.push({
    		"type": "pdf",
    		"description": description,
        	"mimeType": "application/pdf",
			"mediaUrl": description.replace('description', 'mediaUrl')
		});
		process.stdout.write('.');
		jf.writeFileSync(slidePath, slide);
	}

	else{

		var chapterNumber = S(slide.question.header).between('chapter', '.slide_').s; 
		description = slide.question.header.replace('header', 'lesson.pdf.description');
		
		//deleted slide key 
		var  descriptionSlide = S(description).between('chapter', '.lesson.pdf.description').s; 
		var descriptionForlesson =  description.replace(descriptionSlide, chapterNumber);

		var mediaUrl =  slide.question.header.replace('header', 'lesson.pdf.mediaUrl');
		//deleted slide key 
		var mediaSlide = S(mediaUrl).between('chapter', '.lesson.pdf.mediaUrl').s; 
		var mediaForlesson =  mediaUrl.replace(mediaSlide, chapterNumber);

		var lessons = [{
			"type": "pdf",
			"description": descriptionForlesson,
			"mimeType": "application/pdf",
			"mediaUrl":mediaForlesson
		}];
		slide.lessons= lessons;
		process.stdout.write('.');
		jf.writeFileSync(slidePath, slide);
	}	
}