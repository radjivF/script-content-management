var fs = require('fs-extra');
var junk = require('junk');
var lowerCase = require('lower-case');

var slidesDir= 'slides/';

var slides = fs.readdirSync(slidesDir).filter(junk.not);

for( var i in slides){
	lowercaseImage(slidesDir+slides[i]+'/');
	///console.log("rename"+ slides[i]);
}

function lowercaseImage(folder){
	var images = fs.readdirSync(folder).filter(junk.not);
	for(var i in images){
		var oldName = folder+images[i];
		images[i] = lowerCase(images[i]);
		fs.renameSync(oldName, folder+images[i]);

	}
}


