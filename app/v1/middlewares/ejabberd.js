'use strict';
var xmlrpc = require('xmlrpc');
var config = require('server/config/environment');
var Promise = require('promise');

module.exports = {  
  register: function(params) {
    return new Promise(function(resolve, reject) {
      var client = xmlrpc.createClient({ host: config.ejabberd.host, port: config.ejabberd.port, path: '/'});
      client.methodCall('register', [params], function(error, value) {
        if (error) {
          console.log('error:', error);
          reject('User jabberId already exists');
        } else {
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
          console.log('error:', error);
          resolve('User jabberId not exists');
        } else {
          value.jabber_id = params.user + '@' + params.host;
          resolve(value);
        }
      });
    });
  }
};
