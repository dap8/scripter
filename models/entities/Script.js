const Script = function(descr) {


  const self = this;
  for (let property in descr) {
  	self[property] = descr[property];
  }

  const NUM_OF_SCENES = 3;
  
  const sentiment = require('sentiment');
  const Scene = require('./Scene');
  const wordPOS = require('wordpos');
  const wordpos = new wordPOS();

  self.generateScenes = function()
  {
    analyzeCharacters();

	let scenes = [];

	for(let i = 0; i<NUM_OF_SCENES; i++)
	{
    console.log('generated scene');
		let sceneObject = {
			narrative : self.narrative,
			characters : self.characters,
			sentiment_analyzer : sentiment,
			sentence_generator : self.sentence_generator,
		}
		scenes.push(parseScene(new Scene(sceneObject)));
	}

	return scenes;

  }


  function parsePlot(plot){
    let words = plot.split(' ');
    //sentenceObjects.push({word : character, sentiment : character.sentiment, grouping : 'none', type: 'noun'});

    for(let i = 0; i<words.length; i++)
    {
      wordPOS.lookup(words[i], function(result, word){
        
      });
    }

    wordPOS.lookup()

    wordPOS.getPOS(words, function(result){

    });

  }

  //Mögulega nota wordpos og sentiment module til að athuga tilfinningagildi og hvaða lexnames orðin hafa
  function analyzePlot(plot){

  }


  function parseScene(scene){
  	let sceneText = {};

  	sceneText['heading'] = scene.heading;
    sceneText['action'] = scene.action;
  	sceneText['dialogue'] = scene.dialogue;
    
  	return sceneText;
  };

  function analyzeCharacters(){
    for(let i = 0; i<self.characters.length; i++)
    {
      self.characters[i] = {
        name : self.characters[i].name,
        sentiment : integerSentiment(sentiment(self.characters[i].description).comparative),
      }
    }

  }

  function integerSentiment(sentimental_value) {
    if(sentimental_value > 0) return Math.ceil(sentimental_value);
    else return Math.floor(sentimental_value);
  };


    

};



module.exports = Script;