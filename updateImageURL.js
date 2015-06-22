var fs = require('fs-extra');
var junk = require('junk');
var _ = require('lodash');
var S = require('string');
var jf = require('jsonfile')

var slidesDir= 'slides/';

slides = fs.readdirSync(slidesDir).filter(junk.not);

for(slide in slides){
 	var slidePath = slidesDir+slides[slide];
 	var slideData = fs.readJsonSync(slidePath);

 	if(slideData.json.question.type == "qcmGraphic"){
 		_(slideData.yaml.fr)
 			.forEach(function(value, key) {
 				var regImage = /^image_/i;
 				var regUrl = /^\/\/static.coorpacademy.com\//gi;
 				if (regImage.test(key) && !regUrl.test(value)) {
 					console.log('before  ' + value);
 					slideData.yaml.fr[key] = value.replace('//', '//static.coorpacademy.com/up/fr/slides/');
 				}
 				fs.writeFile(slidePath, JSON.stringify(slideData, null, 4), function(err) {
				    if(err) {
				      console.log(err);
				    } else {
				      console.log("JSON saved to " + slidePath);
				    }
				}); 
 			})
 			.value(); 			
 	}
}
