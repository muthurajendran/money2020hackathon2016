'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
    if(!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable');
    }
    return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
    env: process.env.NODE_ENV,

    // Root path of server
    root: path.normalize(__dirname + '/../../..'),

    // Server port
    port: process.env.PORT || 8000,

    ejabberd: {
        host: '104.154.120.49',
        port: 4560,
        userHost: '104.154.120.49',
        userPassword: 'pinguin'
    },

    accessSecretKey: 'pinguinBackendSecretForever',

    authyKey: 'OrvCnIKRG6HwmDdf0Q3li7WczwfGV5u2',

    geocoder: {
        provider: 'google',
        // Optional depending on the providers 
        httpAdapter: 'https', // Default 
        apiKey: 'AIzaSyA9t38XAVh8xeZU3w_vsTepG090q4tAysc',
        formatter: null
    },

    gcloud:{
        "CLOUD_BUCKET": "pinguindev-142418",
        "GCLOUD_PROJECT": "pinguindev-142418",
        "key": "AIzaSyA9t38XAVh8xeZU3w_vsTepG090q4tAysc"
    },
    
    twilio: {
    	accountSid: 'AC5eb64a1951f79369dd938c2f7b9b5ab0',
    	authToken: '584859b788496c66f1b723b053fd952d',
    	phoneNumber: '+14242310074'
    },

    // Server IP
    ip: process.env.IP || '0.0.0.0',

    // Should we populate the DB with sample data?
    seedDB: false,

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
        session: 'pinguinBackendIAuthorizeAllRequests'
    },

    firebase: {
	    apiKey: "AIzaSyD7QxcBNYgPOvnfOS2XYtwfSTIFoBIDKOY",
	    authDomain: "pinguin-f2b35.firebaseapp.com",
	    databaseURL: "https://pinguin-f2b35.firebaseio.com",
	    storageBucket: "pinguin-f2b35.appspot.com",
  	},

    // List of user roles
    userRoles: ['guest', 'user', 'admin'],

    appVersion: 'v1',
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    all,
    require('./' + process.env.NODE_ENV + '.js') || {});
