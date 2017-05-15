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
    self.subject = null;
    parsePlot(self.narrative);
    while(self.subject === null) {require('deasync').sleep(100);}
    //while(true) { if(self.subject !== null) break;/*console.log('stuck in while loop');*/}    
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
        subject : self.subject,
  		}
  		scenes.push(parseScene(new Scene(sceneObject)));
  	}

  	return scenes;
  }


  function parsePlot(plot){
    let words = plot.split(' ');
    //sentenceObjects.push({word : character, sentiment : character.sentiment, grouping : 'none', type: 'noun'});
    let grouping = 'none';
    let word_string = '';
    //word_string = word_string.replace(/\r/,"");//Remove CR-LF symbol
    let sentiment_value = '0';
    let type = 'none';
    let sentenceObjects = [];
    console.log('content of words array: ',words);

    for(let i = 0; i<words.length; i++)
    {
      console.log('running loop');
      wordpos.lookup('tree', function(result, word){
      console.log('finished lookup');
      grouping = 'none';
      word_string = word;
      sentiment_value = sentiment(word_string).score.toString();
      if(typeof result[0] !== 'undefined')
      {
        for(let k = 0; k<result.length; k++)
        {
          grouping = result[0].lexName;
          type = grouping.substring(0,grouping.indexOf('.'));
          if(type === 'adj') type = 'adjective';
          else if(type === 'adv') type = 'adverb';
          else if(type === 'noun') break;
        }
        console.log('result is not undefined');
        
      }

      let obj = {
        type : type,
        grouping : grouping,
        word : word_string,
        sentiment : sentiment,
      }
      sentenceObjects.push(obj);
      console.log('sentenceObjects length: ',sentenceObjects.length);
      console.log('words length',words.length);
      if(sentenceObjects.length >= words.length) setSubject(sentenceObjects);
    });

      
    }
    
  }

  function setSubject(plot){
    console.log('called setSubject');
    self.subject = self.sentence_generator.findSubject(plot);
    console.log('set subject to: ',self.subject);
    
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