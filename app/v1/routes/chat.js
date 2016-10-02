'use strict';

var Chatroom = require('../models/Chatroom');
var ejabberd = require('app/v1/middlewares/ejabberd');
var config = require('server/config/environment');
var uuid = require('node-uuid');
var User = require('../models/user');
var logger = require('app/v1/middlewares/elog');

var object = {
  createRoom: function(req, res, next) {
    try {
      var params = {
        name: uuid.v4(),
        service: config.ejabberd.service + '.' + config.ejabberd.host,
        host: config.ejabberd.host
      };

      ejabberd.createChatroom(params)
      .then(function(value) {
        logger.info(value);
        var chatroom = new Chatroom({
          roomName: params.name,
          roomHost: params.host,
          roomService: params.service
        });
        return chatroom.save();
      })
      .then(function(chatroom) {
        res.json({
          success: true,
          data: chatroom
        });
      })
      .catch(function(err) {
        return next({error: 'ERROR', message: err });
      });
    } catch (err) {
      return next({error: 'ERROR', message: err});
    }
  },

  /*
  * Find the chatroom for  the logged in user
  */
  findChatroom: function(req, res, next) {
    try {
      // find all users within the radius set
      var user = req.user;
      console.log(user);
      var radius = req.body.radius;
      User.find({
        _id: { $ne: user._id},
        chatroomId: { $exists: true},
        location: { $geoWithin: { $centerSphere: [ [ user.location.coordinates[0], user.location.coordinates[1] ], parseFloat(radius) / 3963.2 ] } }
      })
      .populate('chatroomId')
      .then(function(value) {  
        res.json({
          success: true,
          value: value[0].chatroomId
        });
      })
      .catch(function(err) {
        return next({error: 'ERROR', message: err });
      });

      // get the chatroom of the closest user

      // if not available try to get the closest in next users

      // if found return the chatroom id

    } catch (err) {
      return next({error: 'ERROR', message: err});
    }
  }

};

module.exports = object;