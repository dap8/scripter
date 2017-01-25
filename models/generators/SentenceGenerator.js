var SentenceGenerator = function(descr) {
 	var self = this;
    for (var property in descr) {
      self[property] = descr[property];
    }

    self.questionProNouns = ["what","whatever","which","whichever","who","whoever","whom","whomever","whose"];
    self.wordTypes = ['nouns','pronouns','verbs','adverbs','adjectives', 'prepositions'];
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
    	var words = self.wordArray[type];
    	var numOfWords = words.length;
    	var pickedWord = words[getRandom(0,numOfWords)].word;
    	console.log('picked this word: ' + pickedWord);
    	return pickedWord;
    }

    //PUBLIC METHODS

    self.init = function() {
		console.log('made it to init');
		function setWords(words, type){	self.wordArray[type] = words;	}
		self.wordTypes.forEach(function(type) {
			databaseInterface.getWords(setWords, type);
		});
	};

    self.generateQuestion = function(characters,narrative,scene_heading) {
    	var question = self.generateWhQuestion(characters,narrative,scene_heading);
    	console.log('recieved the following question: ');
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
    	return self.generateSentence({pronouns : 1, adverbs : 1, verbs : 1, prepositions: 1, adjectives : 1, nouns : 1,},'.');

    };

    //sentanceStructure tells the function how many occurances of each word there is in the sentance, in the correct order
    //punctuation tells the function what punctuation there is supposed to be at the end of the sentance
    self.generateSentence = function(sentenceStructure, punctuation) {

    	var sentence = '';
    	var sentenceArray = [];

    	/*self.sentanceStructure.forEach(function(numOfWords) {
    		var sentance = '';
    		for(var i = 0; i<numOfWords; i++)
    		{
    			sentence = sentence.concat(' ');
    			console.log('sentence at this point: ' + sentence);
    			var newWord = pickWord()


    		}
			
		});*/

		//var sentence = '';

		var tempSentance;
		tempSentance = sentence;
		var newWord = pickWord('nouns');
		//newWord = newWord.replace(/\r/," ");//remove \r from word
		sentenceArray.push(newWord);
		console.log(newWord);
		sentence = tempSentance + newWord;
		newWord = pickWord('verbs');
		//newWord.replace(/\r?\n|\r/,"pingo");
		sentenceArray.push(newWord);
		tempSentance = sentence;
		console.log(newWord);
		sentence = tempSentance + newWord;
    	/*for (var type in sentenceStructure) {

    		console.log('length: ' + sentenceStructure[type]);
      		for(var i = 0; i<sentenceStructure[type]; i++)
      		{
      			//sentence = sentence.concat(' ');	
      			console.log('this is sentence now: ' + sentence);
      			var newWord = pickWord(type);
      			sentence = sentence + newWord;
      			console.log('sentence after concat: ' + sentence);      			
      		}

    	}*/
    	//sentence.replace(/.$/,".");
    	//sentence(0).toUppercase();
    	return sentenceArray;
    }







};



module.exports = SentenceGenerator;