var xlsxj = require("xlsx-to-json");
var fs = require("fs");
var _ = require("lodash");
var jsonFile = require('jsonfile');
var S = require('string');
var XLSX = require('xlsx-extract').XLSX;
var myFile = './ressources/vimeoid.xlsx';
var dirFolder = '../content/disciplines/'; 

function convertXlsxToJson(file) {
  xlsxj({
    input: file, 
    output: "./ressources/output.json"
  }, function(err, result) {
    if(err) {
      console.error(err);
    }else {
      console.log(result);
	   replace(result);
    }
  });
}

function getFileInFolder(dirFolder){
  var fileList = fs.readdirSync(dirFolder);
  console.log('list of files in the folder: '+ fileList)
  console.log('we found '+ fileList.length +' files')
  return fileList;
}

function replace(result){

  var fileList = getFileInFolder(dirFolder);
  _(result).forEach(function(n) {
    _(fileList).forEach(function(file){
      var json = JSON.parse(fs.readFileSync(dirFolder+ file));
      S(json).replaceAll(result.oldId, result.newId).s;
      jsonFile.writeFileSync(dirFolder+file, json);
      console.log('Update of ' + file + ' =====>  done'); 
    }); 

  }).value();	
}

convertXlsxToJson(myFile);