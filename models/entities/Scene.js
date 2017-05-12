const Scene = function(descr) {
  const self = this;
  for (let property in descr) {
  	self[property] = descr[property];
  }
  
  const DIALOGUE_LENGTH = 3;
  const MAX_NEGATIVITY = -5;
  const MAX_POSITIVITY = 5;
 
  //console.log(this.characters);
  self.heading = generateHeading();
  self.action = generateAction();
  self.dialogue = generateDialogue();

  
  function calculateSentiment(sentiment_values){
  	let sum = 0;
  	for(let i = 0; i<sentiment_values.length; i++)
  	{
  		sum += parseInt(sentiment_values[i]);
  	}

  	let avg = sum/sentiment_values.length;
  	
  	return integerSentiment(avg);
  };

  
  function generateHeading() {
  	let sentimental_value = determineSentiment('heading',null);
  	let heading = self.sentence_generator.generateHeading(sentimental_value,self.narrative);
  	return heading.sentenceText = heading.sentenceText.toUpperCase();
  };

  function determineSentiment(type,speaker) {
  	let sentimental_values = [];
  	//console.log('called determineSentiment with type: ' + type + ' and speaker: ' + speaker);

  	if(type === 'heading' || type === 'action')
  	{
  		for(let i = 0; i<self.characters.length; i++)
	  	{
	  		sentimental_values.push(integerSentiment(self.characters[i].sentiment));
	  	}
  	}

  	else
  	{
  		sentimental_values.push(integerSentiment(speaker.sentiment));
  	}
  	

  	let narrativeSentiment = self.sentiment_analyzer(self.narrative);
  	sentimental_values.push(integerSentiment(narrativeSentiment.comparative));
  	return calculateSentiment(sentimental_values);
  };

  function integerSentiment(sentimental_value) {

  	if(sentimental_value > 0) return Math.ceil(sentimental_value);
  	else return Math.floor(sentimental_value);
  };

  function getRandom(min,max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function generateAction() {
    console.log('made it to generateAction');
    let character = self.characters[getRandom(0,self.characters.length)];
    console.log('about to call action in sentence_generator');
    let sentimental_value = determineSentiment('action',null);
    let action = self.sentence_generator.generateAction(sentimental_value,character);
    return action.sentenceText;
  }

  function generateDialogue() {
  	let dialogue = [];
    let dialogue_objects = [];
  	let characterNumber = 0;
    
  	for(let i = 0; i<=DIALOGUE_LENGTH; i++)
  	{
  		let sentimental_value = determineSentiment('dialogue',self.characters[characterNumber]);
  		let speaker = self.characters[characterNumber].name;
      let generatedText = '';
      let oddNumber = i%2 === 1;
      if(oddNumber)
      {
        let previous_sentence = dialogue_objects[i-1];
        //generatedText = self.sentence_generator.generateQuestion(sentimental_value);
        generatedText = self.sentence_generator.generateResponse(sentimental_value,previous_sentence);
      }
      else {
        generatedText = self.sentence_generator.generateQuestion(sentimental_value);  
      }
  		
  		influenceCharacters(generatedText.sentenceText,speaker);
  		let sentence = speaker + ': ' + generatedText.sentenceText;
  		dialogue.push(sentence);
      dialogue_objects.push(generatedText);
  		characterNumber++;
  		if(characterNumber >= self.characters.length) characterNumber = 0;
  	}

  	return dialogue;

  };

  function influenceCharacters(sentence,speaker){
  	let sentimental_value = self.sentiment_analyzer(sentence);  	
  	sentimental_value = integerSentiment(sentimental_value.comparative);
  	//console.log('sentence being evaluated: ',sentence);

  	for(let i = 0; i<self.characters.length; i++)
  	{
  		//console.log('character sentiment at this point: ',self.characters[i].sentiment);
  		if(self.characters[i].name !== speaker)
  		{
  			let influencedSentiment = self.characters[i].sentiment+sentimental_value;
  			
  			//console.log(speaker + ' influenced ' + self.characters[i].name + ' with the following value: ' + sentimental_value);
  			if(influencedSentiment < MAX_NEGATIVITY) self.characters[i].sentiment = MAX_NEGATIVITY;
  			else if(influencedSentiment > MAX_POSITIVITY) self.characters[i].sentiment = MAX_POSITIVITY;
  			else self.characters[i].sentiment = influencedSentiment;
  		}
  	}

  };
  

};



module.exports = Scene;