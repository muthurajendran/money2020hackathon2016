'use strict';

var Chatroom = require('../models/chatroom');
var ejabberd = require('app/v1/middlewares/ejabberd');
var config = require('server/config/environment');
var uuid = require('node-uuid');
var User = require('../models/user');
var logger = require('app/v1/middlewares/elog');
var _ = require('lodash');

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
      return next({error: 'ERROR', message: err.stack});
    }
  },

  /*
  * Find the chatroom for  the logged in user
  */
  findChatroom: function(req, res, next) {
    try {
      // find all users within the radius set
      var user = req.user;
      var radius = req.body.radius || config.defaultRadiusForChat || 3;
      User.find({
        _id: { $ne: user._id},
        chatroomId: { $exists: true},
        location: { $geoWithin: { $centerSphere: [ [ user.location.coordinates[0], user.location.coordinates[1] ], parseFloat(radius) / 3963.2 ] } }
      })
      .populate('chatroomId')
      .then(function(users) { 
        if (users.length > 0) {
          req.response = users[0].chatroomId;
          next();
        } else {
          // create a chatroom and then shoot the id
          var chatroom = new Chatroom();
          chatroom.createRoom()
          .then(function(room) {
            user.chatroomId = room._id.toString();
            return user.save();
          })
          .then(function() {
            req.response = chatroom;
            next();
          });
        }
      })
      .catch(function(err) {
        return next({error: 'ERROR', message: err });
      });

      // get the chatroom of the closest user

      // if not available try to get the closest in next users

      // if found return the chatroom id

    } catch (err) {
      return next({error: 'ERROR', message: err.stack});
    }
  },

  /*
  * Get room Users
  */

  getRoomPeople: function(req, res, next) {
    try {
      // find all users within the radius set
      var user = req.user;
      var roomId = req.body.roomId;
      var room_name = roomId.split('@')[0];
      var room_service = roomId.split('@')[1];
      console.log(room_name, room_service);

      var params = {
        name: room_name,
        service: room_service
      };

      ejabberd.getRoomUsers(params)
      .then(function(value) {
        console.log(value);
        res.json({
          success: true,
          value: value
        });
      })
      .catch(function(err) {
        return next({error: 'ERROR', message: err });
      });
    } catch (err) {
      return next({error: 'ERROR', message: err.stack});
    }
  },

  /*
  * send message
  */

  sendMessage: function(req, res, next) {
    try {
      // find all users within the radius set
      var user = req.user;
      var roomId = req.body.roomId;
      var type = 'groupchat'

      var params = {
        type: type,
        from: 'admin@104.154.120.49',
        to: roomId,
        subject: 'subject',
        body: 'sssss'
      };

      ejabberd.sendMessage(params)
      .then(function(value) {
        console.log(value);
        res.json({
          success: true,
          value: value
        });
      })
      .catch(function(err) {
        return next({error: 'ERROR', message: err });
      });
    } catch (err) {
      return next({error: 'ERROR', message: err.stack});
    }
  }

};

module.exports = object;