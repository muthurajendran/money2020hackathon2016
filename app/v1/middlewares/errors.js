var errors = {
    logErrors: function(err, req, res, next) {
        console.error('err');
        next(err);
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

module.exports = errors;