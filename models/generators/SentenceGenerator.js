const SentenceGenerator = function(descr) {
 	const self = this;
    for (let property in descr) {
      self[property] = descr[property];
    }
    

    self.words = [];
    self.sentences = [];
    
    const NEUTRAL_VALUE = 0;
    const pg_databaseInterfaceModule = require('../interfaces/pg_dbinterface');
	const databaseInterface = new pg_databaseInterfaceModule();
	databaseInterface.init();
    //databaseInterface.addSentences();
    self.init = function() {

        function setData(data, type){ self[type] = data; console.log(data);}
        databaseInterface.getWords(setData, 'words');
        databaseInterface.getSentences(setData, 'sentences');
    };
    self.init();


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

        for(let sentiment in self.words)
        {
            if(self.words[sentiment].hasOwnProperty(type)) return self.words[sentiment][type];
        }

        return [];
    }
    
    function pickWord(type, sentiment) {
    	let words = findWords(sentiment,type);        
    	let numOfWords = words.length;
    	let pickedWord = words[getRandom(0,numOfWords)];
    	return pickedWord;
    }

    function capitalizeFirstLetter(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
    function addPunctuation(string, punctuation) { return string.replace(/.$/, punctuation); }

    function pickSentenceValues(structure)
    {
        let originalStructure = self.sentences[structure];        
        let structureWithValues = [];
        let min = 1;
        let max = 1;
        for(let type in originalStructure)
        {
            min = originalStructure[type].min;
            max = originalStructure[type].max;
            structureWithValues[type] = getRandom(min,max);
        }

        return structureWithValues;
    }

    function findSubject(sentence){
        let subject = 'none';
        for(let i = 0; i<sentence.length; i++)
        {
            if(sentence[i].type === 'noun') subject = sentence[i].grouping;
        }
        console.log('found the following subject',subject);
        return subject;
    }

    //PUBLIC METHODS

    

    self.generateQuestion = function(sentiment) {
    	
        let question = self.generateSentence(pickSentenceValues('wh_question'),'?',sentiment,null);        
    	//console.log('received the following question: ');
    	//console.log(question);
        return question;
    };

    self.generateResponse = function(sentiment,previousSentance){
        
        
        let subject = findSubject(previousSentance.sentenceObjects);
        
        let response = self.generateSentence(pickSentenceValues('scene_heading'),'.',sentiment,subject);
    };


    /**
    * Generates a scene heading
    * 
    * @param {integer} sentiment - The sentimental value of the heading that is to be generated
    * @param {string} narrative - The narrative of the sceenplay this scene is in
    *
    * @returns {string} - the scene heading
    */
    self.generateHeading = function(sentiment, narrative){
        //let subject = findSubject(narrative.sentenceObjects);
        //TODO: gera fall sem greinir narrative textann og býr til sentenceObjects sem inniheldur groupings og types
        let heading = self.generateSentence(pickSentenceValues('scene_heading'),'.',sentiment,null);
        return heading;
    };


    //sentanceStructure describes how many occurances of each word there is in the sentance, in the correct order
    //punctuation describes what punctuation there is supposed to be at the end of the sentance 
    //sentiment describes the sentimental value of the sentence
    self.generateSentence = function(sentenceStructure, punctuation, sentiment, subject) {

    	let sentenceText = '';
        let sentenceObjects = [];
        let sentence = {};

    	for (let type in sentenceStructure) {

    		for(let i = 0; i<sentenceStructure[type]; i++)
      		{
                let grouping = type;
      			//console.log(typeof type);
                if(type === 'noun' && subject !== null)
                {
                    grouping = subject;
                }
      			let newWord = pickWord(grouping,sentiment);
      			sentenceText = sentenceText + newWord.word + ' ';
                sentenceObjects.push(newWord);
      		}
    	}
    	    	
    	sentenceText = capitalizeFirstLetter(sentenceText);
    	sentenceText = addPunctuation(sentenceText, punctuation);
        sentence['sentenceObjects'] = sentenceObjects;
        sentence['sentenceText'] = sentenceText;        
    	return sentence;
    };

};



module.exports = SentenceGenerator;