/**
 * Main application file
 */
'use strict';

require('app-module-path').addPath(__dirname + '/');
//TODOO - check for environment settings
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./server/config/environment');

var app = express(); //Create the Express app
var mongoose = require('mongoose');
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var port = process.env.PORT || 8080;

//Running server and configuring port
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

/*
* Database connection - Everything goes here
*/
var database = require('./server/config/db');
mongoose.connect(database[process.env.NODE_ENV].url); 
// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + database[process.env.NODE_ENV].url);
}); 
// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 
// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});
// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
});

//Model and Routing goes here
var user = require('./app/v1/routes/user'); //routes are defined here
app.use('/api',user);
var signup = require('./app/v1/routes/signup'); //routes are defined here
app.use('/api',signup);

var error = require('./app/v1/middlewares/errors');

app.use(function (err, req, res, next) {
	//console.log(err.stack);
	res.json({
		success: false,
		message: err.stack,
	});
});
app.use(morgan('dev'));

app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

var server = app.listen(config.port || 8000, function() {
  console.log('Express server listening on port ' + server.address().port);
});