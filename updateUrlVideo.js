
var fs = require('fs-extra');
var junk = require('junk');
var _ = require('lodash');
var S = require('string');
var jf = require('jsonfile');
var lowerCase = require('lower-case');
var rename = require('rename');
var fileExists = require('file-exists');

var slidesDir= 'slides/';
var imagesFolder = 'images/';
var listImages = [];

lowercaseImage('images/');

var slides = fs.readdirSync(slidesDir).filter(junk.not);

for(var slide in slides){
 	var slidePath = slidesDir+slides[slide];
 	var slideData = fs.readJsonSync(slidePath);

 	if(slideData.json.question.type == "qcmGraphic"){
 		_(slideData.yaml.fr)
 			.forEach(function(value, key) {
 				var regImage = /^image_/i;
 				var regUrl = /^\/\/static.coorpacademy.com\//gi;
 				if (regImage.test(key) && !regUrl.test(value)) {
 					//console.log('before  ' + value);
 					slideData.yaml.fr[key] = value.replace('//', '//static.coorpacademy.com/content/digital/fr/slides/');
 					slideData.yaml.fr[key] = lowerCase(slideData.yaml.fr[key]);
 					//listImages.push(slideData.yaml.fr[key]);
 					imagesExist(imagesFolder,slideData.yaml.fr[key] )
 					fs.writeFileSync(slidePath, JSON.stringify(slideData, null, 4));

 				} 
 			}).value(); 			
 	};

}

			

// 	imagesExist(imagesFolder, listImages);

function lowercaseImage(folder){
	var images = fs.readdirSync(folder).filter(junk.not);
	for(var i in images){
		var oldName = folder+images[i];
		images[i] = lowerCase(images[i]);
		fs.renameSync(oldName, folder+images[i]);
	}
}

function imagesExist(imagesFolder , image ){
	image = S(image).chompLeft('//static.coorpacademy.com/content/digital/fr/slides/').s;
	var exist = fileExists(imagesFolder+image);
	console.log( image +" exist "+ exist);
}

