let ScriptGenerator = function(descr) {
 let self = this;
  for (let property in descr) {
    self[property] = descr[property];
  }
  let Script = require('../entities/Script');
    
  const SentenceGeneratorModule = require('../generators/SentenceGenerator');
  const SentenceGenerator = new SentenceGeneratorModule();

  self.generateScript = function(characters, narrative, title) {
    console.log('made it to generateScript');
    let script = new Script({characters : characters,narrative : narrative,sentence_generator: SentenceGenerator});
    let scenes;
    try {scenes = script.generateScenes();}

    catch(err)
    {
      console.log(err);
    }
    
    let screenplay = {
      title : title,
      scenes : scenes,
    }

    return screenplay;
    
  }




};



module.exports = ScriptGenerator;