
var fs = require('fs');
var jsonFile = require('jsonfile');

var dirFolder= 'jsonUsers/';
var name = "TODO";
var user = "user";


var userJsonFileList = fs.readdirSync(dirFolder);
jsonUser = JSON.parse(fs.readFileSync(dirFolder+ userJsonFileList[1]));
console.log('list of files in the folder: '+ userJsonFileList)
console.log('we found '+ userJsonFileList.length +' files')

for(var i=0 ;i<userJsonFileList.length; i++){
    console.log('Update of ' + userJsonFileList[i] + ' =====>  done');
    jsonUser = JSON.parse(fs.readFileSync(dirFolder+ userJsonFileList[i]));
    jsonUser.organizations[0].name = name;
    jsonUser.organizations[0].title = user;
    jsonFile.writeFileSync(dirFolder+userJsonFileList[i], jsonUser);
}
