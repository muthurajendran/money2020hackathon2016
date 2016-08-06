var express = require('express');
var router = express.Router();

var user = require('./user.js');


router.post('/createUser', user.createUser);
router.post('/createUsername', user.createUsername);

module.exports = router;