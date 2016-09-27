'use strict';
var xmlrpc = require('xmlrpc');
var config = require('server/config/environment');
var Promise = require('promise');

module.exports = {  
  register: function(params) {
    return new Promise(function(resolve, reject) {
      var client = xmlrpc.createClient({ host: config.ejabberd.host, port: config.ejabberd.port, path: '/'});
      // Sends a method call to the XML-RPC server
      // var params = {'host': '104.154.120.49',
      //           'user': 'test123456',
      //           'password': 'rajendran'};

      client.methodCall('register', [params], function(error, value) {
        if (error) {
          console.log('error:', error);
          reject('ERROR');
        } else {
          resolve(value);
        }
      });
    });
  }
};
