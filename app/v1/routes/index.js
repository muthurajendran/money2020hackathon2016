var express = require('express');
var router = express.Router();

var auth = require('./auth.js');
var user = require('./user.js');


router.post('/createUser', user.createUser);

module.exports = router;