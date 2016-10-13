'use strict';

var mongoose = require('mongoose');
mongoose.Promise = require('promise');
var ejabberd = require('app/v1/middlewares/ejabberd');
var config = require('server/config/environment');
var uuid = require('node-uuid');
var logger = require('app/v1/middlewares/elog');
var Promise = require('promise');


var Schema = mongoose.Schema;

var chatroomSchema = new Schema({
      roomName: {type: String, required: false, unique: true},
      roomHost: {type: String, required: true},
      roomService: {type: String, required: true},
    },
  {
    timestamps: true
  });

chatroomSchema.methods.createRoom = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
      var params = {
        name: uuid.v4(),
        service: config.ejabberd.service + '.' + config.ejabberd.host,
        host: config.ejabberd.host
      };

      ejabberd.createChatroom(params)
      .then(function(value) {
        logger.info(value);

        self.roomName = params.name;
        self.roomHost = params.host;
        self.roomService = params.service;

        return self.save();
      })
      .then(function(chatroom) {
        resolve(chatroom);
      })
      .catch(function(err) {
        reject({message: 'unable to create room' + err.toString()});
      });
    });
  };

module.exports = mongoose.model('Chatroom', chatroomSchema);

