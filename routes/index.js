var express = require('express');
var router = express.Router();
//var Scene = require('../models/Scene');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
