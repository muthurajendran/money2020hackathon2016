var express = require('express');
var router = express.Router();

var user = require('./user.js');
var photo = require('./photo.js');
var feed = require('./feed.js');
var chatroom = require('./chat.js');
var images = require('app/v1/middlewares/images');
var auth = require('app/v1/middlewares/auth');
var resp = require('app/v1/helpers/response_helper');

// User activity api's
router.post('/createUser', user.createUser);
router.post('/verifyPhoneCode', user.verifyPhoneCode);
router.post('/resendPhoneCode', user.resendPhoneCode);
router.post('/createUsername', auth, user.createUsername);
router.post('/updateUserLocation', auth, user.updateUserLocation);

// Photo activity api's
// router.post('/uploadPhoto',photo.uploadPhoto);
router.post('/addReaction',auth, photo.addReaction);
router.post('/uploadPhoto',auth, images.multer.fields([{ name: 'image'},{name: 'longitude'},{name: 'latitude'},{name: 'userId'}]), 
  images.sendUploadToGCS, photo.uploadPhoto);

// Feed api
router.post('/userFeed',auth, feed.userFeed);
router.post('/getLocationName', feed.getLocationName);

// Chat room
router.post('/chat/createRoom',auth, chatroom.createRoom);
router.post('/chat/findChatroom',auth, chatroom.findChatroom, resp);
router.post('/chat/chatStatus',auth, chatroom.chatStatus, resp);
router.post('/chat/getRoomPeople',auth, chatroom.getRoomPeople);
router.post('/chat/sendMessage',auth, chatroom.sendMessage);

module.exports = router;