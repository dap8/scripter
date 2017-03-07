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

  	if(type === 'heading')
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
  	//console.log('sentiment values:',sentimental_values);
  	return calculateSentiment(sentimental_values);
  };

  function integerSentiment(sentimental_value) {

  	//console.log('called inteeger sentiment with this sentimental_value: ',sentimental_value);
  	if(sentimental_value > 0) return Math.ceil(sentimental_value);
  	else return Math.floor(sentimental_value);
  };

  function generateDialogue() {
  	let dialogue = [];
  	let characterNumber = 0;
  	for(let i = 0; i<=DIALOGUE_LENGTH; i++)
  	{
  		let sentimental_value = determineSentiment('dialogue',self.characters[characterNumber]);
  		let speaker = self.characters[characterNumber].name;
  		let generatedText = self.sentence_generator.generateQuestion(sentimental_value);
  		influenceCharacters(generatedText.sentenceText,speaker);
  		let sentence = speaker + ': ' + generatedText.sentenceText;
  		dialogue.push(sentence);
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