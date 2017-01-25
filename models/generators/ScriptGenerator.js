var ScriptGenerator = function(descr) {
 var self = this;
  for (var property in descr) {
    self[property] = descr[property];
  }

  //disposition defines how negative or positive the narrative is, 100 being 100% positive and 1 being 100% negative
  self.narrative = {disposition : 100, description : ''};

  self.generateNarrative = function(description) {
  	self.narrative.description = description;
  	self.narrative.disposition = self.analyzeDescription(description);
  }

  self.analyzeDescription = function(description) {
  	//do some some analysis of the disposition of the description

  	return 1;

  }


};



module.exports = ScriptGenerator;