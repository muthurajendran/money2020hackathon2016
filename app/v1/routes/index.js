var express = require('express');
var router = express.Router();

var user = require('./user.js');
var photo = require('./photo.js');
var feed = require('./feed.js');
var images = require('app/v1/middlewares/images');

// User activity api's
router.post('/createUser', user.createUser);
router.post('/createUsername', user.createUsername);
router.post('/verifyPhoneCode', user.verifyPhoneCode);
router.post('/resendPhoneCode', user.resendPhoneCode);
router.post('/updateUserLocation', user.updateUserLocation);

// Photo activity api's
// router.post('/uploadPhoto',photo.uploadPhoto);
router.post('/addReaction',photo.addReaction);
router.post('/uploadPhoto',images.multer.fields([{ name: 'image'},{name: 'longitude'},{name: 'latitude'},{name: 'userId'}]), 
  images.sendUploadToGCS, photo.uploadPhoto);

// Feed api
router.post('/userFeed',feed.userFeed);
router.post('/getLocationName',feed.getLocationName);


module.exports = router;