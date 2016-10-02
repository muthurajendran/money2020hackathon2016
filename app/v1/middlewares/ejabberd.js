'use strict';
var xmlrpc = require('xmlrpc');
var config = require('server/config/environment');
var logger = require('app/v1/middlewares/elog');
var Promise = require('promise');

module.exports = {  
  register: function(params) {
    return new Promise(function(resolve, reject) {
      var client = xmlrpc.createClient({ host: config.ejabberd.host, port: config.ejabberd.port, path: '/'});
      client.methodCall('register', [params], function(error, value) {
        if (error) {
          logger.error(error);
          reject('User jabberId already exists');
        } else {
          logger.info(params.user, 'registering : ');
          value.jabber_id = params.user + '@' + params.host;
          resolve(value);
        }
      });
    });
  },

  unregister: function(params) {
    return new Promise(function(resolve) {
      var client = xmlrpc.createClient({ host: config.ejabberd.host, port: config.ejabberd.port, path: '/'});
      client.methodCall('unregister', [params], function(error, value) {
        if (error) {
          logger.error(error);
          resolve('User jabberId not exists');
        } else {
          logger.info(params.user);
          value.jabber_id = params.user + '@' + params.host;
          resolve(value);
        }
      });
    });
  },

  createChatroom: function(params) {
    return new Promise(function(resolve, reject) {
      var client = xmlrpc.createClient({ host: config.ejabberd.host, port: config.ejabberd.port, path: '/'});
      client.methodCall('create_room', [params], function(error, value) {
        if (error) {
          logger.error(error);
          reject('');
        } else {
          console.log('value : ', value);
          resolve(value);
        }
      });
    });
  }
};
