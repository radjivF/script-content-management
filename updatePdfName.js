var fs = require('fs');
var junk =require('junk');
var _ = require('lodash');

var disciplineFolder = 'disciplines';

readDisciplines(disciplineFolder)

function fn(obj, key) {
    if (_.has(obj, key))
        return [obj];
    return _.flatten(_.map(obj, function(v) {
        return typeof v == "object" ? fn(v, key) : [];
    }), true);
}

function udpatePdfFr(discipline){
	var lessons = fn(discipline.yaml.fr, 'pdf_1');
	_.forEach(lessons,function(lesson) {
		_.set(lesson.pdf_1, 'description', lesson.pdf_1.description + ' (PDF)');
		console.log(lesson.pdf_1.description);
	});	
	return discipline;
}

function updatePdfEn(discipline){
	var lessons = fn(discipline.yaml.en, 'pdf_1');
	_.forEach(lessons,function(lesson) {
		_.set(lesson.pdf_1, 'description', lesson.pdf_1.description + ' (PDF)');
		console.log(lesson.pdf_1.description);
	});
	return discipline;
}

function readDisciplines(folder){
	disciplines = fs.readdirSync(folder).filter(junk.not);
	_.forEach(disciplines,function(discipline) {
		var disciplineData = JSON.parse(fs.readFileSync(folder+'/'+discipline));
		disciplineData = udpatePdfFr(disciplineData);
		disciplineData = updatePdfEn(disciplineData);
		fs.writeFileSync(disciplineFolder+'/'+discipline, JSON.stringify(disciplineData, null, 4));
	});
}