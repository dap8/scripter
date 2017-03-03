
var pg_dbInterface = function() {
  var self = this;
  var pg = require('pg');
  const url = require('url');
  var fs  = require("fs");
  var sentiment = require('sentiment');
  var wordPOS = require('wordpos');
  var wordpos = new wordPOS();

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


self.getWords = function(deliverData, type)
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
      } 

      if(hasGrouping)
      {        
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
      
      deliverData(words, type);
    });
 
  done();

  });

}

self.getSentences = function(deliverData, type)
{  
  pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  
  var query = client.query('SELECT * FROM SENTENCES');

  var sentences = [];
  
  query.on('row', function(row, result) {

    sentences[row.type] = JSON.parse(row.structure);

    });
    query.on('end', function(result) {
      
      deliverData(sentences, type);
    });
 
  done();

  });

}


self.loadInitialData = function() {

   console.log('called loadInitialData');
   //return;
   pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }

  const words = [];
  let grouping = 'none';
  let word_string = '';
  let sentiment_value = 0;

  words['noun'] = fs.readFileSync('./word_textfiles/nouns/all_nouns.txt').toString().split('\n');
  words['pronoun'] = fs.readFileSync('./word_textfiles/pronouns/all_pronouns.txt').toString().split('\n');
  words['adverb'] = fs.readFileSync('./word_textfiles/adverbs/all_adverbs.txt').toString().split('\n');
  words['verb'] = fs.readFileSync('./word_textfiles/verbs/all_verbs.txt').toString().split('\n');
  words['adjective'] = fs.readFileSync('./word_textfiles/adjectives/all_adjectives.txt').toString().split('\n');
  words['preposition'] = fs.readFileSync('./word_textfiles/prepositions/all_prepositions.txt').toString().split('\n');


  var k = 0;
  for(let type in words)
  {
    //console.log('type: ' + type);
    
    switch(type) {
        case 'noun':
          for(var i = 0; i<words[type].length; i++)
          {
            wordpos.lookupNoun(words[type][i], function(result, word) {
            //console.log(word);
            let grouping = 'none';
            let word_string = words[type][i];
            word_string = word_string.replace(/\r/,"");//Remove CR-LF symbol
            let sentiment_value = sentiment(word_string).score.toString();
            if(typeof result[0] !== 'undefined') grouping = result[0].lexName;
            client.query('INSERT INTO WORDS(word, type, sentiment, grouping) VALUES($1,$2,$3,$4)',[word_string,type,sentiment_value,grouping]);
            k++;
            //console.log('entering word number: ' + k + ' and it is of the type: ' + type);
          });
            
          }
          
          break;
        case 'verb':
          for(var i = 0; i<words[type].length; i++)
          {      
            
            wordpos.lookupVerb(words[type][i], function(result, word) {
            let grouping = 'none';
            let word_string = words[type][i];
            word_string = word_string.replace(/\r/,"");//Remove CR-LF symbol
            let sentiment_value = sentiment(word_string).score.toString();
            if(typeof result[0] !== 'undefined') grouping = result[0].lexName;
            client.query('INSERT INTO WORDS(word, type, sentiment, grouping) VALUES($1,$2,$3,$4)',[word_string,type,sentiment_value,grouping]);
            k++;
            //console.log('entering word number: ' + k + ' and it is of the type: ' + type);
          });
            
          }
          break;
        case 'adjective':
          for(var i = 0; i<words[type].length; i++)
          {      

            wordpos.lookupAdjective(words[type][i], function(result, word) {
            let grouping = 'none';
            let word_string = words[type][i];
            word_string = word_string.replace(/\r/,"");//Remove CR-LF symbol
            let sentiment_value = sentiment(word_string).score.toString();
            if(typeof result[0] !== 'undefined') grouping = result[0].lexName;
            client.query('INSERT INTO WORDS(word, type, sentiment, grouping) VALUES($1,$2,$3,$4)',[word_string,type,sentiment_value,grouping]);
            k++;
            //console.log('entering word number: ' + k + ' and it is of the type: ' + type);
          });
            
          }
          break;
        case 'adverb':
          for(var i = 0; i<words[type].length; i++)
          {      
            
            wordpos.lookupAdverb(words[type][i], function(result, word) {
            let grouping = 'none';
            let word_string = words[type][i];
            word_string = word_string.replace(/\r/,"");//Remove CR-LF symbol
            let sentiment_value = sentiment(word_string).score.toString();
            if(typeof result[0] !== 'undefined') grouping = result[0].lexName;
            client.query('INSERT INTO WORDS(word, type, sentiment, grouping) VALUES($1,$2,$3,$4)',[word_string,type,sentiment_value,grouping]);
            k++;
            //console.log('entering word number: ' + k + ' and it is of the type: ' + type);
          });
            
          }
          break;
        case 'pronoun':
          for(var i = 0; i<words[type].length; i++)
          {      
            let grouping = 'none';
            let word_string = words[type][i];
            word_string = word_string.replace(/\r/,"");//Remove CR-LF symbol
            let sentiment_value = sentiment(word_string).score.toString();
            if(word_string.startsWith('wh') && type === 'pronoun') grouping = 'wh_question';
            client.query('INSERT INTO WORDS(word, type, sentiment, grouping) VALUES($1,$2,$3,$4)',[word_string,type,sentiment_value,grouping]);
            k++;
            //console.log('entering word number: ' + k + ' and it is of the type: ' + type);            
          }
          break;
        case 'preposition':
          for(var i = 0; i<words[type].length; i++)
          {      
            let grouping = 'none';
            let word_string = words[type][i];
            word_string = word_string.replace(/\r/,"");//Remove CR-LF symbol
            let sentiment_value = sentiment(word_string).score.toString();
            //if(word.startsWith('wh') && type === 'pronoun') grouping = 'wh_question';
            client.query('INSERT INTO WORDS(word, type, sentiment, grouping) VALUES($1,$2,$3,$4)',[word_string,type,sentiment_value,grouping]);
            k++;
            //console.log('entering word number: ' + k + ' and it is of the type: ' + type);            
          }
          break;
        default:
          console.log('default entered');
      }


      
  }
  
/*
  for(var type in sentences)
  {
    //console.log('inserting type: ' + type);
 
    client.query('INSERT INTO SENTENCES(type, structure) VALUES($1,$2)',[type,JSON.stringify(sentences[type])]);
  }
*/
  done();

  });

};



var sentences = 
{
  wh_question : {wh_question: {min : 1, max : 1}, verb : {min : 1, max : 1}, adjective : {min : 1, max : 1}, noun: {min : 1, max : 1},},  
}


};



module.exports = pg_dbInterface;