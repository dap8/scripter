const express = require('express');
const router = express.Router();
//var Scene = require('../models/Scene');
const nodemailer = require('nodemailer');
const validator = require('validator');
const xss = require('xss');


/*var SentenceGeneratorModule = require('../models/generators/SentenceGenerator');
var SentenceGenerator = new SentenceGeneratorModule();*/
const ScriptGeneratorModule = require('../models/generators/ScriptGenerator');
const ScriptGenerator = new ScriptGeneratorModule();

let characters = [{name : 'bob', sentiment : -4}, {name: 'tom', sentiment: -4}];
let bad_narrative = 'Horrible terrible evil bad narrative torture murder';
let neutral_narrative = 'Hello';

const generated_scripts = [];

//ScriptGenerator.generateScript(['bob','tom'],'Happy narrative');
//wait for text files to load, then init the sentenceGenerator - use only when resetting data
/*setTimeout(function(){
    SentenceGenerator.init();
}, 5000);*/

//SentenceGenerator.init();

const TITLE = 'Scripter';
const SENDER = 'screenplayermail@gmail.com';
const PASS = 'bingofivetakk';

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: SENDER,
        pass: PASS,
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');  
});


router.post('/generateScript', function(req, res, next) {

	console.log('called generateScript route');

	console.log('recieved this query: ',req.body.query);

	let query = JSON.parse(req.body.query);
	let script = ScriptGenerator.generateScript(query.characters, query.plot, query.title);
	saveScript(req.session.id,script);
  res.send(script);
});

router.post('/sendScript', function(req, res, next) {
	try {
		console.log('called sendscript');
		console.log('req email:',req.body.email);
		let email = xss(req.body.email || '');
		if(validator.isEmail(email)){
			sendScript(generated_scripts[req.session.id],email);
			console.log('got this email: ',email);
			res.send({type : 'success', message : 'Email has been sent'});
			//res.send('success');
		} 
		else{
			res.send({type : 'error', message : 'Please enter a valid email address'});
			//res.send('error');
		}
	}

	catch(err){
		console.err(err);
	}

});

function saveScript(id,script){
	generated_scripts[id] = script;
}

function sendScript(script, reciever){

	console.log('sending this script: ', script);

	console.log('about to call convertToHtml');
	try{
		let htmlStuff = convertToHtml(script);

	}
	catch(err){
		console.log('error: ',err);
	}
	

	// setup email data with unicode symbols
	let mailOptions = {
	    from: '"Scripter" <screenplayermail@gmail.com>', // sender address
	    to: reciever, // list of receivers
	    subject: 'Your script', // Subject line
	    html: convertToHtml(script) // html body
	       
	};
	transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});
	
	//text: script.title, // plain text body	 

}

function convertToHtml(script){
	let html = '';

	html += '<h1>'+script.title+'</h1>';
	for(let i = 0; i<script.scenes.length; i++)
	{
		html += '<h3>'+script.scenes[i].heading+'</h3>';
		html += '<i>'+script.scenes[i].action+'</i>';
		html += parseDialogue(script.scenes[i].dialogue);
	}

	return html;
}

function parseDialogue(dialogue){
	let dialogueText = '';
  for(let i = 0; i<dialogue.length; i++)
  {
    let sentence = '<p>'+dialogue[i]+'</p>';
    dialogueText += sentence;
  }
  return dialogueText;
}



module.exports = router;
