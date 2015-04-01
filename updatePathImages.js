/* this script update the image links: 
	//static.coorpacademy.com/content/ijoinchanel_en/2C2_Q1/2C2-Q1-mods.jpg
	to 
	//static.coorpacademy.com/content/ijoinchanel/en/slides/1B1_Q8/2C2-Q1-mods.jpg
	and
	//static.coorpacademy.com/content/ijoinchanel/miniatures_cours/base/1B1.png
	to 
	//static.coorpacademy.com/content/ijoinchanel/en/miniatures/en-miniatures-1B1.png
*/

var S = require('string');
var fs = require('fs');
var jf = require('jsonfile');
var yaml = require('yamljs');

var oldEnglishSlide= '/ijoinchanel_en/';
var newEnglishSlide= '/ijoinchanel/en/slides/';
var oldEnglishMiniature= '/ijoinchanel_en/';
var newEnglishMiniature= '/ijoinchanel/en/slides/'; 

var oldFrenchSlide= '/ijoinchanel/';
var newFrenchSlide= '/ijoinchanel/fr/slides/';
var oldFrenchMiniature= '/ijoinchanel/miniatures_cours/';
var newFrenchMiniature= '/ijoinchanel/fr/miniatures/';

updateImagesLink(process.argv[2]);

function updateImagesLink(platform) {
	var thematiqueDir = platform + 'local/thematiques';
	if (!fs.existsSync(thematiqueDir)) {
    	console.log("Please enter a valid platform directory. For example: digital");
    	return;
	}

	YAML.load('en.yaml', function(result)
	{
		nativeObject = result;
	    updatedJson = updateEn(nativeObject);
	   	save('en.yaml', YAML.stringify(updatedJson));
	   	console.log('en.yaml updated')
	});
	YAML.load('fr.yaml', function(result)
	{
	    nativeObject = result;
	    updatedJson = updateEn(nativeObject);
	    save('fr.yaml', YAML.stringify(updatedJson));
	   	console.log('fr.yaml updated')
	});
};

function updateEn(data){
	var dataString = JSON.stringify(data);;
	var jsonUpdated1 =  dataString.replace(oldEnglishSlide, newEnglishSlide);
	var jsonUpdated2 =  jsonUpdated1.replace(oldEnglishMiniature, newEnglishMiniature);
	var obj = JSON.parse(jsonUpdated2);
	return obj;
}

function updateFR(data){
	var dataString = JSON.stringify(data);;
	var jsonUpdated1 =  dataString.replace(oldFrenchSlide, newFrenchSlide);
	var jsonUpdated2 =  jsonUpdated1.replace(oldFrenchMiniature, newFrenchMiniature );
	var obj = JSON.parse(jsonUpdated2);
	return obj;
}

function save(nameFile, data) {
	fs.writeFileSync('local/thematiques/' + nameFile, data);
}