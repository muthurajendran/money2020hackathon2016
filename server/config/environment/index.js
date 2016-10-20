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

    defaultRadiusForChat: 3,

    ejabberd: {
        host: '104.197.97.41',
        port: 4560,
        service: 'conference',
        userHost: '104.197.97.41',
        userPassword: 'pinguin'
    },

    accessSecretKey: 'pinguinBackendSecretForever',

    authyKey: 'OrvCnIKRG6HwmDdf0Q3li7WczwfGV5u2',

    geocoder: {
        provider: 'google',
        // Optional depending on the providers 
        httpAdapter: 'https', // Default 
        apiKey: 'AIzaSyCEsN6EEn1o9YFWNOBL6h31kOyY43qZdbE',
        formatter: null
    },

    gcloud:{
        "CLOUD_BUCKET": "pinguin-146817",
        "GCLOUD_PROJECT": "pinguin-146817",
        "key": "AIzaSyCEsN6EEn1o9YFWNOBL6h31kOyY43qZdbE"
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

    // List of user roles
    userRoles: ['guest', 'user', 'admin'],

    appVersion: 'v1',
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    all,
    require('./' + process.env.NODE_ENV + '.js') || {});
