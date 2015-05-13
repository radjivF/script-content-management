// validate_json
// -------------
// version of 20141210

// run node validate_json.js dir

var fs = require('fs');


validateJSON(process.argv[2]);


function validateJSON(dir) {
	console.log('start validating JSONs from ' + dir);
	var thematiquesDir = dir + '/thematiques';

	if (!fs.existsSync(thematiquesDir)) {
    	console.log("Please enter a valid platform directory. For example: TODO");
    	return;
	}

	var thematiquesList = fs.readdirSync(thematiquesDir)
							.filter(function(dirName) {
								return (dirName.indexOf('.json') < 0) && (dirName.match(/^\./) == null);
							});

	var thematiques = fs.readdirSync(thematiquesDir)
							.filter(function(fileName) {
								return (fileName.indexOf('.json') > 0);
							});

	thematiques.forEach(function(thematiqueName) {
		var thematiquePath = thematiquesDir + '/' + thematiqueName;
		checkOrCorrectJSON(thematiqueName, thematiquePath);
	});


	thematiquesList.forEach(function(thematiqueDirName) {
		var slides = fs.readdirSync(thematiquesDir + '/' + thematiqueDirName)
					   .filter(function(slideName){
						   return (slideName.indexOf('.json') > 0);
					   });

		slides.forEach(function(slideName) {
			var slidePath = thematiquesDir + '/' + thematiqueDirName + '/' + slideName;
			checkOrCorrectJSON(slideName, slidePath);
		});
	});

	console.log('\n DONE CHECKING JSON VALIDATION');
}


function checkOrCorrectJSON(slideName, slidePath) {
	var buf = fs.readFileSync(slidePath);
	try {
		JSON.parse(buf);
		process.stdout.write('.');
	} catch(e) {
		console.log("\ncorrecting slide " + slideName);
		var slide = buf.toString();
		var newslide = slide.replace(/,([\n\t\s]*[\}\]]+)/g, '$1');
		fs.writeFileSync(slidePath, newslide);
	};
}