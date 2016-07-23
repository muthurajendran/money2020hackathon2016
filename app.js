var express = require('express');
var app = express(); //Create the Express app
var mongoose = require('mongoose');
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var port = process.env.PORT || 8080;

var database = require('./server/config/db');
mongoose.connect(database.url); 

var user = require('./app/v1/routes/user'); //routes are defined here
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
// app.use('/api', user); //This is our route middleware
// app.use(methodOverride());

module.exports = app;

app.set('port', process.env.PORT || 8000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});