
var pg_dbInterface = function() {
  var self = this;
  var pg = require('pg');
  const url = require('url');
  var fs  = require("fs");
  var sentiment = require('sentiment');  

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
  var statement = 'SELECT * FROM WORDS';
  var query = client.query(statement);
  var numOfWordsFound = 0;
  query.on('row', function(row, result) {
    numOfWordsFound++;
    });
    query.on('end', function(result) {
      if(numOfWordsFound < 1) self.loadInitialData(); //If the database is empty, load data  

    }); 

  done();

  });

};



/*self.getWords = function(deliverWords, type)
{
  console.log('called getWords with type: ' + type);
  pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  
  var query = client.query('SELECT * FROM WORDS WHERE type = $1',[type]);

  var words = [];
  query.on('row', function(row, result) {
      var word = {
          word : row.word,
          sentiment : row.sentiment,
          grouping : row.grouping,
          type : row.type,
        }
        words.push(word);
    });
    query.on('end', function(result) {
      
      deliverWords(words,type);
    });
 
  done();

  });

}*/

self.getWords = function(deliverWords)
{  
  pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  
  var query = client.query('SELECT * FROM WORDS');

  var words = [];
  var hasGrouping = false;
  
  query.on('row', function(row, result) {
      var word = {
          word : row.word,
          sentiment : row.sentiment,
          grouping : row.grouping,
          type : row.type,
        }
      
      hasGrouping = word.grouping !== 'none';

      if(!words.hasOwnProperty(word.sentiment))
      {
        words[word.sentiment] = [];
        console.log('found the following sentiment and created array: ' + word.sentiment);

      } 

      if(hasGrouping)
      {
        console.log('found a word with the grouping: ' + word.grouping);
        if(!words[word.sentiment].hasOwnProperty(word.grouping)) words[word.sentiment][word.grouping] = [];          
        words[word.sentiment][word.grouping].push(word);
      }

      else
      {
        if(!words[word.sentiment].hasOwnProperty(word.type)) words[word.sentiment][word.type] = [];          
        words[word.sentiment][word.type].push(word);
      }


    });
    query.on('end', function(result) {
      
      deliverWords(words);
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

  var words = [];
  var grouping = 'none';
  var word = '';
  var sentiment_value = 0;

  words['noun'] = fs.readFileSync('./word_textfiles/nouns/all_nouns.txt').toString().split('\n');
  words['pronoun'] = fs.readFileSync('./word_textfiles/pronouns/all_pronouns.txt').toString().split('\n');
  words['adverb'] = fs.readFileSync('./word_textfiles/adverbs/all_adverbs.txt').toString().split('\n');
  words['verb'] = fs.readFileSync('./word_textfiles/verbs/all_verbs.txt').toString().split('\n');
  words['adjective'] = fs.readFileSync('./word_textfiles/adjectives/all_adjectives.txt').toString().split('\n');
  words['preposition'] = fs.readFileSync('./word_textfiles/prepositions/all_prepositions.txt').toString().split('\n');


  for(var type in words)
  {
    for(var i = 0; i<words[type].length; i++)
    {
      grouping = 'none'; // Default grouping is -1, i.e. No grouping
      word = words[type][i];
      word = word.replace(/\r/,"");//Remove CR-LF symbol
      sentiment_value = sentiment(word).score.toString();
      if(word.startsWith('wh') && type === 'pronoun') grouping = 'wh_question';
      client.query('INSERT INTO WORDS(word, type, sentiment, grouping) VALUES($1,$2,$3,$4)',[word,type,sentiment_value,grouping]);
    }
  }

  done();

  });
     


};


};



module.exports = pg_dbInterface;