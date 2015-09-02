var fs = require('fs');
var jf = require('jsonfile');
var xlsxj = require('xlsx-to-json');
var replace = require('replace');
var junk =require('junk');
var _ = require('lodash');
_.mixin(require("lodash-deep"));
var traverse = require('traverse');

var slidesFolder = 'slides';
var disciplineFolder = 'disciplines';
var excelFile = 'vimeoId.xlsx';
var jsonData = 'output.json';

var slidesList = getListFile(slidesFolder);
var disciplineList = getListFile(disciplineFolder);
var videoDataId = JSON.parse(fs.readFileSync(jsonData));

var dataVideo = getListExcel(excelFile);

_.forEach(slidesList,function(slide) {
	updateSlides(slidesFolder+'/'+slide);
});


_.forEach(disciplineList,function(discipline) {
	updateDisciplineFr(disciplineFolder+'/'+discipline, videoDataId);
});

_.forEach(disciplineList,function(discipline) {
	updateDisciplineEn(disciplineFolder+'/'+discipline);
});

function getListFile(folder){
	return fs.readdirSync(folder).filter(junk.not);
}

function getListExcel(file){
	xlsxj({
		input: file, 
		output: jsonData
		}, function(err, result) {
		if(err) {
		  console.error(err);
		}else {
			return result;
		}
	});
}

function fn(obj, key) {
    if (_.has(obj, key))
        return [obj];
    return _.flatten(_.map(obj, function(v) {
        return typeof v == "object" ? fn(v, key) : [];
    }), true);
}

function updateDisciplineFr(disciplinePath, videosDataId){
	var discipline = JSON.parse(fs.readFileSync(disciplinePath));
	var chapters = fn(discipline.yaml.fr, 'lesson');

	_.each(chapters, function(chapter) {
        var lesson = chapter.lesson;
        _.forEach(videosDataId, function(videoDataId){
        	console.log(videoDataId.newId)
        	if(lesson.video_1.videoId == videoDataId.newId){
        		lesson.video_2 = _.assign({}, lesson.video_1, { description: 'Toutes les réponses à vos questions', videoId: videoDataId.oldId });
        		console.log(lesson);
        	}
        });
	});

	fs.writeFileSync(disciplinePath, JSON.stringify(discipline, null, 4));
}

function updateDisciplineEn(disciplinePath){
	var discipline = JSON.parse(fs.readFileSync(disciplinePath));


	var chapters = fn(discipline.yaml.en, 'lesson');
	_.each(chapters, function(chapter) {
        var lesson = chapter.lesson;
		lesson.video_2 = _.assign({}, lesson.video_1, { description: '', videoId: '', mini:'' });
		console.log(lesson);
      
	});
	fs.writeFileSync(disciplinePath, JSON.stringify(discipline, null, 4));
}

function updateSlides(slidePath){

	var slide = JSON.parse(fs.readFileSync(slidePath));
	
	if(slide.json.lessons){
		var description = slide.json.lessons[0].poster;
		//the description is the videos poster not the description of the videos
 
		description = description.replace('video_1', 'video_2');
		mini = description;
		videoId = description.replace('video_1',  'videoId');
		videoId = videoId.replace('mini',  'videoId');
		description = description.replace('mini', 'description');
		console.log(videoId);
		video_2 = {
            "type": "video",
            "description": description,
            "poster": mini,
            "mimeType": "application/vimeo",
            "videoId": videoId
        };

		slide.json.lessons.push(video_2);
		process.stdout.write('.');
		fs.writeFileSync(slidePath, JSON.stringify(slide, null, 4));
	}
}




