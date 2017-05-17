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
	//databaseInterface.addSentences();
    databaseInterface.init();    
    const PLACE_GROUPING = 'noun.location';
    const TIME_GROUPING = 'noun.time';
    const SCENE_SETTINGS = ['INTERIOR', 'EXTERIOR'];
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

    function pickRandomGrouping(groupings)
    {
        let rand = getRandom(0,Object.keys(groupings).length)
        let i = 0;
        for(grouping in groupings)
        {
            if(i === rand) return grouping;
            i++;
        }
    }

    function findWords(sentiment, type, grouping)
    {
        //console.log('entered findWords with the following grouping: ',grouping);
        
        let grouplessNoun = type === 'noun' && grouping === 'none';

        if(self.words[sentiment].hasOwnProperty(type))
        {    
            if(grouplessNoun) grouping = pickRandomGrouping(self.words[sentiment][type]);
            if(self.words[sentiment][type].hasOwnProperty(grouping)) return self.words[sentiment][type][grouping];            
        }

        if(self.words[NEUTRAL_VALUE].hasOwnProperty(type))
        {                 
            if(grouplessNoun) grouping = pickRandomGrouping(self.words[sentiment][type]);
            if(self.words[NEUTRAL_VALUE][type].hasOwnProperty(grouping)) return self.words[NEUTRAL_VALUE][type][grouping];            
        }

        for(let sent in self.words)
        {            
            if(self.words[sent].hasOwnProperty(type))
            {
                if(grouplessNoun) grouping = pickRandomGrouping(self.words[sentiment][type]);
                if(self.words[sent][type].hasOwnProperty(grouping))
                {                    
                    return self.words[sent][type][grouping];
                }
            }
        }

        console.log('****RETURNING EMPTY ARRAY****');
        return [];
    }
    
    function pickWord(sentiment, type, grouping) {
    	let words = findWords(sentiment,type,grouping);
        //console.log('words array received from findWords',words.length);
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



    // Gera findsubject á plottið
    self.findSubject = function(sentence){
        let subject = 'none';
        for(let i = 0; i<sentence.length; i++)
        {
            //console.log('word object: ',sentence[i]);
            if(sentence[i].type === 'noun') subject = sentence[i].grouping;
        }
        //console.log('found the following subject',subject);

        
        return subject;
    }

    //PUBLIC METHODS

    

    self.generateQuestion = function(sentiment, subject)  {   	
        console.log('called generateQuestion');
        let question = self.generateSentence(pickSentenceValues('wh_question'),'?',sentiment,null,null,'question');
    	return question;
    };

    self.generateResponse = function(sentiment,previousSentance,subject){        
        /*let subject = self.findSubject(previousSentance.sentenceObjects);
        console.log('subject before responding: ' + subject);*/
        console.log('got the following subject for response:',subject);
        let response = self.generateSentence(pickSentenceValues('statement'),'.',sentiment,subject,null,'response');
        //console.log('subject after responding: ' + self.findSubject(response.sentenceObjects));
        return response;
    };

    self.generateAction = function(sentiment, character) {
        //let subject = self.findSubject(previousSentance.sentenceObjects);
        let action = self.generateSentence(pickSentenceValues('action'),'.',sentiment,null,character, 'action');
        return action;
    };


    /**
    * Generates a scene heading
    * 
    * @param {integer} sentiment - The sentimental value of the heading that is to be generated
    * @param {string} narrative - The narrative of the sceenplay the scene is in
    *
    * @returns {string} - The scene heading
    */
    self.generateHeading = function(sentiment, narrative, subject){
        //let subject = findSubject(narrative.sentenceObjects);
        //TODO: gera fall sem greinir narrative textann og býr til sentenceObjects sem inniheldur groupings og types
        let heading = self.generateSentence(pickSentenceValues('heading'),'.',sentiment,subject, null, 'heading');
        return heading;
    };


    //sentanceStructure describes how many occurances of each word there is in the sentance, in the correct order
    //punctuation describes what punctuation there is supposed to be at the end of the sentance 
    //sentiment describes the sentimental value of the sentence
    self.generateSentence = function(sentenceStructure, punctuation, sentiment, subject, character, sentenceType) {

    	let sentenceText = '';
        let sentenceObjects = [];
        let sentence = {};

    	for (let type in sentenceStructure) {

    		for(let i = 0; i<sentenceStructure[type]; i++)
      		{
                let word_type = type;             
                let grouping = 'none';

                if(word_type === 'wh_question')
                {                    
                    grouping = word_type;
                    word_type = 'pronoun';
                }
      			//console.log(typeof type);
                if(type === 'noun' && subject !== null)
                {
                    if(sentenceType === 'heading'){
                        if(i === 0) grouping = PLACE_GROUPING;
                        else grouping = TIME_GROUPING;
                    }
                    else grouping = subject;
                }
                if(type !== 'name'){
                    let new_word = pickWord(sentiment,word_type,grouping);
                    if(sentenceType === 'heading' && i === 0){
                        sentenceText = SCENE_SETTINGS[getRandom(0,SCENE_SETTINGS.length)] + '. ' + new_word.word + ' - ';
                    }
                    else sentenceText = sentenceText + new_word.word + ' ';                    
                    sentenceObjects.push(new_word);
                }

                else{                    
                    sentenceText = sentenceText + character.name + ' ';
                    sentenceObjects.push({word : character, sentiment : character.sentiment, grouping : 'none', type: 'noun'});
                }
      			
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