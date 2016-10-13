'use strict';
var xmlrpc = require('xmlrpc');
var config = require('server/config/environment');
var logger = require('app/v1/middlewares/elog');
var Promise = require('promise');

function call(method_name, params) {
  return new Promise(function(resolve, reject) {
    var client = xmlrpc.createClient({ host: config.ejabberd.host, port: config.ejabberd.port, path: '/'});
    client.methodCall(method_name, [params], function(error, value) {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    });
  });
}

module.exports = {  
  getRoomUsers: function(params) {
    return new Promise(function(resolve, reject) {
      call('get_room_occupants',params)
      .then(function(value) {
        logger.info(params, 'getting users: ');
        resolve(value);
      })
      .catch(function(err) {
        logger.error(err);
        reject('Not able to get users from ejabberd');
      });
    });
  },

  sendMessage: function(params) {
    return new Promise(function(resolve, reject) {
      call('send_message',params)
      .then(function(value) {
        logger.info(params, 'message: ');
        resolve(value);
      })
      .catch(function(err) {
        logger.error(err);
        reject('Not able to send message');
      });
    });
  },

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
          logger.info(params.user, 'Deleting: ');
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
