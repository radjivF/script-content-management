var fs = require('fs');
var jf = require('jsonfile');
var S = require('string');
var _ = require('lodash');
var junk = require('junk');
var DisciplineRefHelper = require('./grunt/helpers/ref.discipline.js');
var ChapterRefHelper = require('./grunt/helpers/ref.chapter.js');

var pdfBasePath = '//static.coorpacademy.com/content/sqypark-academy/miniatures_cours/';
var folderDisciplines = 'disciplines/';
var pdfFolder = 'pdfs/';
var pdfEn ='coming_soon.pdf';

addPdfs(folderDisciplines );

function addPdfs(folder) {
	var disciplines = fs.readdirSync(folder).filter(junk.not);
	var pdfListFr = getPdfListFr(pdfFolder);
	var pdfMap = _.map(pdfListFr, function(pdfname) {
		var chapterRef = pdfname.split('_')[1].replace(/(\d+)(\w+)(\d+)/, '$1.$2.$3');
		chapterRef = ChapterRefHelper.migrateRef(chapterRef);

		return {
			name: pdfname,
			ref: chapterRef,
			disciplineRef: chapterRef.split('.').shift(),
			yaml: ChapterRefHelper.toLongKey(chapterRef).split('.').splice(1).join('.')
		};
	});
	_.forEach(disciplines, function(discipline) {
		updateDiscipline(folderDisciplines + '/' + discipline, pdfMap);
	});
}


function getPdfListFr(folder){
	return fs.readdirSync(folder).filter(junk.not);
}

function updateDiscipline(disciplinePath, pdfMap){
	var discipline = JSON.parse(fs.readFileSync(disciplinePath));
	var en = discipline.yaml.en;
	var fr = discipline.yaml.fr;
	// updateEn(en, disciplinePath);
	updateFr(fr, discipline.json.ref, pdfMap);
	fs.writeFileSync(disciplinePath, JSON.stringify(discipline, null, 4));
}

function updateEn(data){
	var pdf = {
		"type": "pdf",
		"description": data.name,
		"mimeType": "application/pdf",
		"mediaUrl": pdfBasePath + pdfEn
	};

	function getChapter(value, key) {
		if (/^chapter_/i.test(key)) {
			value.lesson = value.lesson || {};
			var size = _.size(value.lesson) + 1;
			value.lesson['pdf_' + size] = pdf;
		}
	}
	function getModule(value, key) {
		if (/^module_/i.test(key)) {
			_.forEach(value, getChapter)
		}
	}

	_.forEach(data, getModule);
}

function updateFr(data, disciplineRef, pdfMap){
	var pdf;
	_.forEach(pdfMap, function(pdfData) {
		if (disciplineRef === pdfData.disciplineRef && _.has(data, pdfData.yaml)) {
			pdf = {
				"type": "pdf",
				"description": data.name,
				"mimeType": "application/pdf",
				"mediaUrl": pdfData.name
			};
			var datayaml = _.get(data, pdfData.yaml);
			datayaml.lesson = datayaml.lesson || {};
			var size = _.size(datayaml.lesson) + 1;
			datayaml.lesson['pdf_' + size] = pdf;
		}
	});
}
