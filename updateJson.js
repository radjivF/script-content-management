//Dependancies: npm install -g jsonfile fs
var fs = require('fs');
var jsonFile = require('jsonfile');

//TODO
var dirFolder= 'TODO';
var poop = "TODO";

var jsonFileList = fs.readdirSync(dirFolder);
jsonUser = JSON.parse(fs.readFileSync(dirFolder+ jsonFileList[1]));
console.log('list of files in the folder: '+ jsonFileList)
console.log('we found '+ jsonFileList.length +' files')

for(var i=0 ;i<jsonFileList.length; i++){
    console.log('Update of ' + jsonFileList[i] + ' =====>  done');
    json = JSON.parse(fs.readFileSync(dirFolder+ jsonFileList[i]));
    json.key = poop;
    jsonFile.writeFileSync(dirFolder+jsonFileList[i], json);
}
