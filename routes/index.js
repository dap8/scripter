var express = require('express');
var router = express.Router();
//var Scene = require('../models/Scene');

var SentenceGeneratorModule = require('../models/generators/SentenceGenerator');
var SentenceGenerator = new SentenceGeneratorModule();
//wait for text files to load, then init the sentenceGenerator - use only when resetting data
/*setTimeout(function(){
    SentenceGenerator.init();
}, 3000);*/ 

SentenceGenerator.init();




/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  SentenceGenerator.generateQuestion();
});

module.exports = router;
