/* this script update the image links: 
	//static.coorpacademy.com/content/TODO/2C2_Q1/2C2-Q1-mods.jpg
	to 
	//static.coorpacademy.com/content/TODO/en/slides/1B1_Q8/2C2-Q1-mods.jpg
	and
	//static.coorpacademy.com/content/TODO/miniatures_cours/base/1B1.png
	to 
	//static.coorpacademy.com/content/TODO/en/miniatures/en-miniatures-1B1.png
*/

var fs = require('fs');
var YAML = require('yamljs');

var oldEnglishSlide= '/TODO/';
var newEnglishSlide= '/TODO/en/slides/';
var oldEnglishMiniature= '/TODO/';
var newEnglishMiniature= '/TODO/en/slides/'; 

var oldFrenchSlide= '/TODO/';
var newFrenchSlide= '/TODO/fr/slides/';
var oldFrenchMiniature= '/TODO/miniatures_cours/';
var newFrenchMiniature= '/TODO/fr/miniatures/';

updateImagesLink(process.argv[2]);

function updateImagesLink(platform) {
	var thematiqueDir = platform + 'local/thematiques';
	if (!fs.existsSync(thematiqueDir)) {
    	console.log("Please enter a valid platform directory. For example: digital");
    	return;
	}

	YAML.load('en.yaml', function(result)
	{
		var nativeObject = result;
	    var updatedJson = updateEn(nativeObject);
	   	save('en.yaml', YAML.stringify(updatedJson));
	   	console.log('en.yaml updated');
	});
	YAML.load('fr.yaml', function(result)
	{
	    var nativeObject = result;
	    var updatedJson = updateEn(nativeObject);
	    var save('fr.yaml', YAML.stringify(updatedJson));
	   	console.log('fr.yaml updated');
	});
}

function updateEn(data){
	var dataString = JSON.stringify(data);
	var jsonUpdated1 =  dataString.replace(oldEnglishSlide, newEnglishSlide);
	var jsonUpdated2 =  jsonUpdated1.replace(oldEnglishMiniature, newEnglishMiniature);
	var obj = JSON.parse(jsonUpdated2);
	return obj;
}

function updateFR(data){
	var dataString = JSON.stringify(data);
	var jsonUpdated1 =  dataString.replace(oldFrenchSlide, newFrenchSlide);
	var jsonUpdated2 =  jsonUpdated1.replace(oldFrenchMiniature, newFrenchMiniature );
	var obj = JSON.parse(jsonUpdated2);
	return obj;
}

function save(nameFile, data) {
	fs.writeFileSync('local/thematiques/' + nameFile, data);
}