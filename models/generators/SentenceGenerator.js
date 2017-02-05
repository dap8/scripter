var SentenceGenerator = function(descr) {
 	var self = this;
    for (var property in descr) {
      self[property] = descr[property];
    }
    

    self.words = [];
    
    const NEUTRAL_VALUE = 0;
    var pg_databaseInterfaceModule = require('../interfaces/pg_dbinterface');
	var databaseInterface = new pg_databaseInterfaceModule();
	databaseInterface.init();

	//PRIVATE METHODS

	function getRandom(min,max){
		min = Math.ceil(min);
	  	max = Math.floor(max);
	  	return Math.floor(Math.random() * (max - min)) + min;
	}

    function findWords(sentiment, type)
    {
        if(self.words[sentiment].hasOwnProperty(type))
        {
            console.log('found this type in original sentiment array');
            return self.words[sentiment][type];
        } 
        if(self.words[NEUTRAL_VALUE].hasOwnProperty(type))
        {
            console.log('found this type in neutral array');            
            return self.words[NEUTRAL_VALUE][type];
        } 

        for(var sentiment in self.words)
        {
            if(self.words[sentiment].hasOwnProperty(type)) return self.words[sentiment][type];
        }

        return [];
    }
    
    function pickWord(type, sentiment) {
    	var words = findWords(sentiment,type);
        
    	var numOfWords = words.length;
    	var pickedWord = words[getRandom(0,numOfWords)].word;
    	return pickedWord;
    }

    function capitalizeFirstLetter(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
    function addPunctuation(string, punctuation) { return string.replace(/.$/, punctuation); }

    //PUBLIC METHODS

    self.init = function() {
		/*self.wordArray['questionpronoun'] = self.questionProNouns;
		function setWords(words, type){	self.wordArray[type] = words; }
		self.wordTypes.forEach(function(type) {
			databaseInterface.getWords(setWords, type);
		});*/

        function setWords(words){            
            self.words = words;
            console.log('length of words: ' + words.length);
            //console.log(words);
        }
        databaseInterface.getWords(setWords);
	};

    self.generateQuestion = function(characters,narrative,scene_heading) {
    	var question = self.generateWhQuestion(characters,narrative,scene_heading);
    	console.log('received the following question: ');
    	console.log(question);
        /*for(sentiment in self.words)
        {
            console.log('printing sentiment');
            console.log(sentiment);
        }*/
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
    	return self.generateSentence({wh_question : 1, verb : 1, adjective : 1, noun: 1,},'?',5);

    };


    //sentanceStructure tells the function how many occurances of each word there is in the sentance, in the correct order
    //punctuation tells the function what punctuation there is supposed to be at the end of the sentance
    self.generateSentence = function(sentenceStructure, punctuation, sentiment) {

    	var sentence = '';

    	for (var type in sentenceStructure) {

    		for(var i = 0; i<sentenceStructure[type]; i++)
      		{
      			//console.log(typeof type);
      			var newWord = pickWord(type,sentiment);
      			sentence = sentence + newWord + ' ';
      		}

    	}
    	    	
    	sentence = capitalizeFirstLetter(sentence);
    	sentence = addPunctuation(sentence, punctuation);
    	return sentence;
    }







};



module.exports = SentenceGenerator;