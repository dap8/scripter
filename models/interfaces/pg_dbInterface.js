
var pg_dbInterface = function() {
  var self = this;
  var pg = require('pg');
  const url = require('url');
  var fs  = require("fs");

console.log('entered pg_dbInterface');


//HEROKU STUFF
/*
const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true
};
*/

  //LOCAL STUFF
  const env_db_loc = process.env.DATABASE_URL;
  const db_loc = 'scripter' || process.env.DATABASE_URL;

  var config = {
  user: 'postgres', //env var: PGUSER 
  database: db_loc, //env var: PGDATABASE 
  password: 'root', //env var: PGPASSWORD 
  port: 5432, //env var: PGPORT 
  max: 10, // max number of clients in the pool 
  idleTimeoutMillis: 300000000, // how long a client is allowed to remain idle before being closed 
};

var pool = new pg.Pool(config);

self.init = function() {
  console.log('called init');
  pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  var statement = 'SELECT * FROM NOUNS';
  var query = client.query(statement);
  var numOfNounsFound = 0;
  query.on('row', function(row, result) {
    numOfNounsFound++;
    });
    query.on('end', function(result) {
      if(numOfNounsFound < 1) self.loadInitialData();      

    }); 

  done();

  });

};



self.getWords = function(deliverWords, type)
{
  console.log('called getWords with type: ' + type);
  pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  var statement = 'SELECT * FROM '+type.toUpperCase();
  var query = client.query(statement);

  var words = [];
  query.on('row', function(row, result) {
      var picture = {
          word : row.word,
        }
        words.push(picture);
    });
    query.on('end', function(result) {
      
      deliverWords(words,type);
    });
 
  done();

  });

}

self.loadInitialData = function() {

   console.log('called loadInitialData');
   pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }


  var nounarray = fs.readFileSync('./word_textfiles/nouns/all_nouns.txt').toString().split('\n');
  var pronounarray = fs.readFileSync('./word_textfiles/pronouns/all_pronouns.txt').toString().split('\n');
  var adverbarray = fs.readFileSync('./word_textfiles/adverbs/all_adverbs.txt').toString().split('\n');
  var verbarray = fs.readFileSync('./word_textfiles/verbs/all_verbs.txt').toString().split('\n');
  var adjectivearray = fs.readFileSync('./word_textfiles/adjectives/all_adjectives.txt').toString().split('\n');
  var prepositionarray = fs.readFileSync('./word_textfiles/prepositions/all_prepositions.txt').toString().split('\n');

  console.log('LENGTH OF ARRAY RECIEVED: ' + prepositionarray.length);
  console.log('first prepositionarray: ' + prepositionarray[0]);

  for(var i = 0; i<nounarray.length; i++)
  {
    nounarray[i] = nounarray[i].replace(/\r/," ");

    client.query('INSERT INTO NOUNS(word) VALUES ($1)',[nounarray[i]]);

  }

  console.log('finished noun array');

  for(var i = 0; i<pronounarray.length; i++)
  {
    pronounarray[i] = pronounarray[i].replace(/\r/," ");
    client.query('INSERT INTO PRONOUNS(word) VALUES ($1)',[pronounarray[i]]);
  }

  for(var i = 0; i<adverbarray.length; i++)
  {
    adverbarray[i] = adverbarray[i].replace(/\r/," ");
    client.query('INSERT INTO ADVERBS(word) VALUES ($1)',[adverbarray[i]]);
  }

  console.log('finished adverb array');

  for(var i = 0; i<verbarray.length; i++)
  {
    verbarray[i] = verbarray[i].replace(/\r/," ");
    client.query('INSERT INTO VERBS(word) VALUES ($1)',[verbarray[i]]);
  }

  for(var i = 0; i<adjectivearray.length; i++)
  {
    adjectivearray[i] = adjectivearray[i].replace(/\r/," ");
    client.query('INSERT INTO ADJECTIVES(word) VALUES ($1)',[adjectivearray[i]]);
  }

  for(var i = 0; i<prepositionarray.length; i++)
  {
    prepositionarray[i] = prepositionarray[i].replace(/\r/," ");
    client.query('INSERT INTO PREPOSITIONS(word) VALUES ($1)',[prepositionarray[i]]);

  }

  done();

  });
     


};


};



module.exports = pg_dbInterface;