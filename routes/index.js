var express = require('express');
var router = express.Router();
//var Scene = require('../models/Scene');

var SentenceGeneratorModule = require('../models/generators/SentenceGenerator');
var SentenceGenerator = new SentenceGeneratorModule();
var ScriptGeneratorModule = require('../models/generators/ScriptGenerator');
var ScriptGenerator = new ScriptGeneratorModule();

let characters = [{name : 'bob', sentiment : -5}, {name: 'tom', sentiment: 5}];
let bad_narrative = 'Terrible bad raping murder killing narrative';
let neutral_narrative = 'Hello';

//ScriptGenerator.generateScript(['bob','tom'],'Happy narrative');
//wait for text files to load, then init the sentenceGenerator - use only when resetting data
/*setTimeout(function(){
    SentenceGenerator.init();
}, 5000);*/

//SentenceGenerator.init();




/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  ScriptGenerator.generateScript(characters,neutral_narrative);
  
});

module.exports = router;
