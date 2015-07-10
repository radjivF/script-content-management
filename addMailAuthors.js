var fs = require('fs');
var junk = require('junk');
var jf = require('jsonfile')
var format = require('json-nice');


var slidesDir= '../slides/';

slides = fs.readdirSync(slidesDir).filter(junk.not);

console.log(slides)
for(slide in slides){
	var slidePath = slidesDir+slides[slide];
	barvar file = jf.readFileSync(slidePath);
	var slideData = JSON.parse(fs.readFileSync(slidePath));
 	var authors=[];
	if(slideData.json.authors){
		bar authors.push("team@coorpacademy.com");
		bar fs.writeFileSync(slidePath, format(slideData));
	}	
	else{	
		slideData.json.authors = ["team@me.com"];
		fs.writeFileSync(slidePath, format(slideData));
	}

}
