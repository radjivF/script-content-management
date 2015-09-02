//npm install -g fs yamljs jsonFile string node-regexp traverse

var fs = require('fs');
var fsExtra = require('fs-extra');
var YAML = require('yamljs');
var jf = require('jsonFile');
var S = require('string');
var regexp = require('node-regexp');
var traverse= require('traverse');
var diff = require('deep-diff').diff;
var merge = require('merge'), original, cloned;
var jsonFile = require('jsonfile');

//global variable
var jsonDir= 'json/discipline/';
var disciplineFormat = 'discipline_';
var dirSlides = 'json/slides/';

var re = regexp().start('slide_').toRegExp();
var reChapter = regexp().start('chapter_').toRegExp();

var reDisciplineFileName = 0;
var disciplineNumber  = 0;
var slideNumber = 0;
var moduleDiscipline = 'B';
var chapter = 0;


function createFolder(name){

  var disciplineFilePath = jsonDir;
  var disciplineDir = jsonDir + name;

  if (!fs.existsSync(disciplineDir)){
      fs.mkdirSync(disciplineDir);
  }
}

function traverseDiscipline(disciplineName, discipline) {

    //console.log(disciplineName)
    for (i in discipline) {
        if (typeof(discipline[i])=="object") {
            if(reChapter.test(i) == true){
              chapter = i;
            }
            if(i == 'module_base'){
              moduleDiscipline ='B';
            }
            if(i == 'module_avance'){
              moduleDiscipline = 'A';
            }
            if(i == 'module_coach'){
              moduleDiscipline = 'C';
            }
            if( re.test(i) == true){
              path= disciplineName +'_' +chapter + moduleDiscipline;
              saveSlides( path , discipline[i], i);
              delete discipline[i];
            }
            traverseDiscipline(disciplineName,discipline[i]);
        }
    }
    return discipline;
}

function saveDiscipline(nameDiscipline, disciplineData, numberSlides){
  jf.writeFileSync(jsonDir+nameDiscipline+'.json', disciplineData);
};

function saveSlides(disciplineName, slidedata, number ){
  jf.writeFileSync(dirSlides+disciplineName+'_'+number+'.json', slidedata );
};

function recontructJson(){

  var dirFolder= 'json/discipline/';  
  var dirSlides =  'json/slides/'
  var jsonFileList = fs.readdirSync(dirFolder);
  var slideFileList = fs.readdirSync(dirSlides);
  console.log(slideFileList);

  console.log(jsonFileList);

  //reconstruct Discipline
  var jsonData = {};
  for(var i=0 ;i<jsonFileList.length; i++){
      json = JSON.parse(fs.readFileSync(dirFolder+jsonFileList[i]));
      //console.log(json);
      var str= String(jsonFileList[i]);
      var key =str.replace(".json" , "")
      jsonData[key] = json;

      
      for(var j=0; j=slideFileList.length; j++){
      //ajouter les slides 
      }
      createJson('newJson.json', jsonData)

  }
}

function renameSlides(){

  var dirFolder= 'json/slides/'; 
  var path=''; 
  var newpath='';  
  var jsonFileList = fs.readdirSync(dirFolder);
  console.log('we found '+ jsonFileList.length +' files') ;

  for(var i=1 ;i<jsonFileList.length; i++){
    path = dirFolder+String(jsonFileList[i]);
    pathWithoutDiscipline = path.replace(disciplineFormat , "");
    pathWithoutChapter = pathWithoutDiscipline.replace("chapter_" , "");
    pathWithoutUnderscore = pathWithoutChapter.replace("slide_","");
    pathWithoutUnderscore2 = pathWithoutUnderscore.replace("_",".");
    newpath = pathWithoutUnderscore2.replace("_",".");
    fs.renameSync(path, newpath);
  }
}

function createJson(nameFile, nativeObject){
  jsonFile.writeFileSync(nameFile, nativeObject);
  //jf.writeFileSync(nameFile+'.json',yamldata);
}

function compareYaml(firstYaml, secondYaml){
  firstYaml = YAML.load(firstYaml, function(result){
    return result;
  });
  secondYaml = YAML.load(secondYaml, function(result){
    return result;
  });
  console.log(diff(firstYaml, secondYaml)); 
}

YAML.load('fr.yaml', function(result){
  var jsonData =  result;
  var i = 1;
  for ( discipline in jsonData ){
    //create sliders
    disciplineNumber = i;
    //create discipline JSON
    disciplineJson = traverseDiscipline( discipline, jsonData[discipline]);
    saveDiscipline(discipline ,disciplineJson);
    i= i+1;
  }
  renameSlides();
  recontructJson();
});

