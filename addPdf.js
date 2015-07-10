var fs = require('fs');
var platformWhitelist = ['schneider', 'chanel'];
var jf = require('jsonfile');
var S = require('string');


var folderSlides = '/slides';

function addPdfs(folder) {
	slides = fs.readdirSync(folder).filter(junk.not);
	for(var i in slides){
		updateSlide('folderSlides'+slides[i]+'/');
	}

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