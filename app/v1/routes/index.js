var express = require('express');
var router = express.Router();

var user = require('./user.js');


router.post('/createUser', user.createUser);
router.post('/createUsername', user.createUsername);
router.post('/verifyPhoneCode', user.verifyPhoneCode);

module.exports = router;