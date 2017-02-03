var SentenceGenerator = function(descr) {
 	var self = this;
    for (var property in descr) {
      self[property] = descr[property];
    }

    self.questionProNouns = 
    [{word:'what'},{word:'whatever'},{word:'which'},{word:'whichever'},{word:'who'},{word:'whoever'},{word:'whom'},{word:'whomever'},{word:'whose'},];
    self.wordTypes = ['noun','pronoun','verb','adverb','adjective', 'preposition'];
    self.wordArray = [];
    
    var pg_databaseInterfaceModule = require('../interfaces/pg_dbinterface');
	var databaseInterface = new pg_databaseInterfaceModule();
	databaseInterface.init();

	//PRIVATE METHODS

	function getRandom(min,max){
		min = Math.ceil(min);
	  	max = Math.floor(max);
	  	return Math.floor(Math.random() * (max - min)) + min;
	}
    
    function pickWord(type) {
    	console.log('Picking word for the following type: ');
    	console.log(type);
    	var words = self.wordArray[type];
    	var numOfWords = words.length;
    	var pickedWord = words[getRandom(0,numOfWords)].word;
    	return pickedWord;
    }

    function capitalizeFirstLetter(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
    function addPunctuation(string, punctuation) { return string.replace(/.$/, punctuation); }

    //PUBLIC METHODS

    self.init = function() {
		self.wordArray['questionpronoun'] = self.questionProNouns;
		function setWords(words, type){	self.wordArray[type] = words;	}
		self.wordTypes.forEach(function(type) {
			databaseInterface.getWords(setWords, type);
		});
	};

    self.generateQuestion = function(characters,narrative,scene_heading) {
    	var question = self.generateWhQuestion(characters,narrative,scene_heading);
    	console.log('received the following question: ');
    	console.log(question);
    };

    /*

what
whatever
which
whichever
who
whoever
whom
whomever
whose
    */

    self.generateWhQuestion = function(previousSentances,characters,narrative,scene_heading,questioner) {
    	//SIMPLEST FORM OF A WH QUESTION:
    	//PRONOUN ADVERB? VERB PREPOSITION? ADJECTIVE* NOUN
    	//return self.generateSentence({pronoun : 1, adverb : 1, verb : 1, preposition: 1, adjective : 1, noun: 1,},'?');
    	return self.generateSentence({questionpronoun : 1, verb : 1, adjective : 1, noun: 1,},'?');

    };

    //sentanceStructure tells the function how many occurances of each word there is in the sentance, in the correct order
    //punctuation tells the function what punctuation there is supposed to be at the end of the sentance
    self.generateSentence = function(sentenceStructure, punctuation) {

    	var sentence = '';

    	for (var type in sentenceStructure) {

    		console.log('length: ' + sentenceStructure[type]);
      		for(var i = 0; i<sentenceStructure[type]; i++)
      		{
      			console.log(typeof type);
      			var newWord = pickWord(type);
      			sentence = sentence + newWord + ' ';
      		}

    	}
    	    	
    	sentence = capitalizeFirstLetter(sentence);
    	sentence = addPunctuation(sentence, punctuation);
    	return sentence;
    }







};



module.exports = SentenceGenerator;