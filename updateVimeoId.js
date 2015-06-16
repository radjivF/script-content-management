var fs = require('fs');
var platformWhitelist = ['digital-core'];
var jf = require('jsonfile');
var regexp = require('node-regexp');
var S = require('string');
var xlsxj = require('xlsx-to-json');
var replace = require('replace');

var disciplineDir= '../disciplines/';
var excelFile = 'vimeoid.xlsx';
var jsonData = 'output.json';

parseExcel();
updateIdVimeo();

function parseExcel(){
	  xlsxj({
	    input: excelFile, 
	    output: jsonData
	  }, function(err, result) {
	    if(err) {
	      console.error(err);
	    }else {
	    	return result;
	    }
	  });
}

function updateIdVimeo(){
	var data = JSON.parse(fs.readFileSync(jsonData))
	for(ligne in data){
		console.log("old "+data[ligne].oldId +"   new "+data[ligne].newId);
		replace({
	  		regex: data[ligne].oldId,
	  		replacement: data[ligne].newId,
	  		paths: [disciplineDir],
	  		recursive: true,
	  		silent: true,
		});
	}
}


