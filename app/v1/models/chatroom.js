'use strict';

var mongoose = require('mongoose');
mongoose.Promise = require('promise');

var Schema = mongoose.Schema;

var chatroomSchema = new Schema({
      roomName: {type: String, required: false, unique: true},
      roomHost: {type: String, required: true},
      roomService: {type: String, required: true},
    },
  {
    timestamps: true
  });

module.exports = mongoose.model('Chatroom', chatroomSchema);