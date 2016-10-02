var colors = require('colors/safe');

var logs = {
    error: function(err, key) {
      var keyinfo = key || 'Error: ';
      console.log(keyinfo, colors.red(err));
    },

    info: function(info, key) {
      var keyinfo = key || 'Info:';
      console.log(keyinfo, colors.green(info));
    },

    clientErrorHandler: function(err,req, res, next) {
        if (req.xhr) {
          res.status(500).send({error: 'Failed'});
        } else {
          next(err);
        }
      },

    errorHandler: function(err, req, res) {
        res.status(500);
        res.send('Final fail');
      }
  };

module.exports = logs;