// tree traversal in node js
require("javascript.util");
var jf = require('jsonfile');
var prettyjson = require('prettyjson');
var fs = require('fs');
YAML = require('yamljs');
var regexp = require('node-regexp');
var callback = console.log;
var array =[];
var S = require('string');




YAML.load('fr.yaml', function(result)
{
    nativeObject = result;
    var re = regexp()
      .must('http')
      .maybe('s')
      .must('://')
      .maybe('www.')
      .maybe('.fr')
      .maybe('.com')
      .toRegExp();

    function traverse(obj) {
      if (obj instanceof Array) {
          for (var i=0; i<obj.length; i++) {
              if (typeof obj[i] == "object" && obj[i]) {
                  callback(i);
                  traverse(obj[i]);
              } else {
                  callback(i, obj[i])
              }
          }
      } else {
          for (var prop in obj) {
              if (typeof obj[prop] == "object" && obj[prop]) {
                  //callback(prop);
                  traverse(obj[prop]);
              } else {
                  if(re.test(obj[prop])== true){
                  //  callback(obj[prop]);

                    var str= obj[prop];
                    var link1 = S(str).between('http','.fr').s;
                    var link2 = S(str).between('http','.com').s;

                    if (link1.trim()) {
                        if (link1 != array[array.length]){
                        array.push(S(link1).between('://').s+'.fr')
                        }
                    }
                    if (link2.trim()) {

                      array.push(S(link2).between('://').s+'.com')
                    }
                  }

              }                                     
          }

      }

  } 

  traverse(nativeObject);
  var finalArray = require("uniq")(array)
  console.log(finalArray)
  jf.writeFileSync('report-fr.txt', finalArray);

});




YAML.load('en.yaml', function(result)
{
    nativeObject = result;
    var re = regexp()
      .must('http')
      .maybe('s')
      .must('://')
      .maybe('www.')
      .maybe('.fr')
      .maybe('.com')
      .toRegExp();

    function traverse(obj) {
      if (obj instanceof Array) {
          for (var i=0; i<obj.length; i++) {
              if (typeof obj[i] == "object" && obj[i]) {
                  callback(i);
                  traverse(obj[i]);
              } else {
                  callback(i, obj[i])
              }
          }
      } else {
          for (var prop in obj) {
              if (typeof obj[prop] == "object" && obj[prop]) {
                  //callback(prop);
                  traverse(obj[prop]);
              } else {
                  if(re.test(obj[prop])== true){
                  //  callback(obj[prop]);

                    var str= obj[prop];
                    var link1 = S(str).between('http','.fr').s;
                    var link2 = S(str).between('http','.com').s;

                    if (link1.trim()) {
                        if (link1 != array[array.length]){
                        array.push(S(link1).between('://').s+'.fr')
                        }
                    }
                    if (link2.trim()) {

                      array.push(S(link2).between('://').s+'.com')
                    }
                  }

              }                                     
          }

      }

  } 

  traverse(nativeObject);
  var finalArray = require("uniq")(array)
  console.log(finalArray)
  jf.writeFileSync('report-en.txt', finalArray);

});
