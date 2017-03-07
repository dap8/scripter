var ScriptGenerator = function(descr) {
 var self = this;
  for (var property in descr) {
    self[property] = descr[property];
  }
  var Script = require('../entities/Script');
    
  const SentenceGeneratorModule = require('../generators/SentenceGenerator');
  const SentenceGenerator = new SentenceGeneratorModule();

  self.generateScript = function(characters, description) {
    
    let script = new Script({characters : characters,narrative : description,sentence_generator: SentenceGenerator});
    let screenplay = script.generateScenes();
    console.log('THIS IS THE SCREENPLAY: ',screenplay);
  }




};



module.exports = ScriptGenerator;