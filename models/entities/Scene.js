var Scene = function(descr) {
  var self = this;
  for (var property in descr) {
  	self[property] = descr[property];
  }

 
  //console.log(this.characters);
  console.log('Created scene with the following character: ' + self.characters[0] + ' and the following narrative: ' + self.narrative);

  

};



module.exports = Scene;