var express = require('express');
var router = express.Router();
//var Scene = require('../models/Scene');

/*var SentenceGeneratorModule = require('../models/generators/SentenceGenerator');
var SentenceGenerator = new SentenceGeneratorModule();*/
var ScriptGeneratorModule = require('../models/generators/ScriptGenerator');
var ScriptGenerator = new ScriptGeneratorModule();

let characters = [{name : 'bob', sentiment : -4}, {name: 'tom', sentiment: -4}];
let bad_narrative = 'Horrible terrible evil bad narrative torture murder';
let neutral_narrative = 'Hello';

//ScriptGenerator.generateScript(['bob','tom'],'Happy narrative');
//wait for text files to load, then init the sentenceGenerator - use only when resetting data
/*setTimeout(function(){
    SentenceGenerator.init();
}, 5000);*/

//SentenceGenerator.init();




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');  
});


router.post('/generateScript', function(req, res, next) {

	console.log('called generateScript route');

	console.log('recieved this query: ',req.body.query);

	let query = JSON.parse(req.body.query);

    res.send(ScriptGenerator.generateScript(query.characters, query.plot, query.title));  
});

module.exports = router;
