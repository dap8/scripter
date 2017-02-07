var SentenceGenerator = function(descr) {
 	var self = this;
    for (var property in descr) {
      self[property] = descr[property];
    }
    

    self.words = [];
    self.sentences = [];
    
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
            return self.words[sentiment][type];
        } 
        if(self.words[NEUTRAL_VALUE].hasOwnProperty(type))
        {                 
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

    function pickSentenceValues(structure)
    {
        var originalStructure = self.sentences[structure];
        var structureWithValues = [];
        var min = 1;
        var max = 1;
        for(var type in originalStructure)
        {
            min = originalStructure[type].min;
            max = originalStructure[type].max;
            structureWithValues[type] = getRandom(min,max);
        }

        return structureWithValues;
    }

    //PUBLIC METHODS

    self.init = function() {

        function setData(data, type){ self[type] = data; }
        databaseInterface.getWords(setData, 'words');
        databaseInterface.getSentences(setData, 'sentences');
	};

    self.generateQuestion = function(characters,narrative,scene_heading,questioner) {
    	var question = self.generateSentence(pickSentenceValues('wh_question'),'?',5);
    	console.log('received the following question: ');
    	console.log(question);
    };

    self.generateInterrogativeSentence = function(characters,narrative,scene_heading) {

    };

    self.genereateImperativeSentence = function(characters,narrative,scene_heading) {

    };

    self.generateDeclaritiveSentance = function(characters,narrative,scene_heading) {

    };


    //sentanceStructure describes how many occurances of each word there is in the sentance, in the correct order
    //punctuation describes what punctuation there is supposed to be at the end of the sentance 
    //sentiment describes the sentimental value of the sentence
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