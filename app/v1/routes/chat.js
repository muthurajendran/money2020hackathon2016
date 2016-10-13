'use strict';

var Chatroom = require('../models/chatroom');
var ejabberd = require('app/v1/middlewares/ejabberd');
var config = require('server/config/environment');
var uuid = require('node-uuid');
var User = require('../models/user');
var logger = require('app/v1/middlewares/elog');
// var _ = require('lodash');

var object = {
  /*
  * Api for chat status - It'll send a message to the group when somebody leaves
  * or joins or pauses in the group
  * 0 - Leave, 1 - Join, 2 - Pause 
  */

  chatStatus: function(req, res, next) {
    var options = {
      0: 'LEFT',
      1: 'JOIN',
      2: 'PAUSE' 
    };

    try {
      // Message information
      var acknowledge = req.body.type;
      var subject = options[acknowledge];
      var body = req.user.jabberId;
      // Room information
      var roomId = req.body.roomId;
      var room_name = roomId.split('@')[0];
      var room_service = roomId.split('@')[1];

      // Params for sending message
      var params_message = {
        type: 'groupchat',
        from: 'admin@104.154.120.49',
        to: roomId,
        subject: subject,
        body: body
      };

      // params for retrieving users list from the cahtroom
      var params_room_list = {
        name: room_name,
        service: room_service
      };
      // send message to the chatroom
      ejabberd.sendMessage(params_message)
      .then(function() {
        // once sent - get all the users from the chatroom 
        return ejabberd.getRoomUsers(params_room_list);
      })
      .then(function(users) {
        // get users from the jabberid retured from the room
        req.response = users;
        next();
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
      // Get all users 
      User.find({
        _id: { $ne: user._id},
        chatroomId: { $exists: true},
        location: { $geoWithin: { $centerSphere: [ [ user.location.coordinates[0], user.location.coordinates[1] ], parseFloat(radius) / 3963.2 ] } }
      })
      .populate('chatroomId')
      .then(function(users) { 
        if (users.length > 0) {
          // TODO: More users - so try to find the proper or merge rooms 
          // for now return the first user
          req.response = users[0].chatroomId;
          next();
        } else {
          // Nor rooms found - create new
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

      var roomId = req.body.roomId;
      var type = 'groupchat';

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
  },

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
  }


};

module.exports = object;