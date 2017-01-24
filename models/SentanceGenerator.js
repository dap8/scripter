var SentancetGenerator = function(descr) {
 var self = this;
  for (var property in descr) {
    self[property] = descr[property];
  }

};



module.exports = SentancetGenerator;