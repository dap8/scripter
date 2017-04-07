const Script = function(descr) {
  const self = this;
  for (let property in descr) {
  	self[property] = descr[property];
  }

  const NUM_OF_SCENES = 3;
  
  const sentiment = require('sentiment');
  const Scene = require('./Scene');

  self.generateScenes = function()
  {  	

	let scenes = [];

	for(let i = 0; i<NUM_OF_SCENES; i++)
	{
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


  function parseScene(scene){
  	let sceneText = {};

  	sceneText['heading'] = scene.heading;
  	sceneText['dialogue'] = scene.dialogue;

  	return sceneText;
  };



    

};



module.exports = Script;