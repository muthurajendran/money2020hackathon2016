'use strict';

var object = {
  notfication: function(req, res, next) {
    if (req.body && req.body.deviceID && req.body.platform) {
      if (req.body.platform === 'ios' || req.body.platform === 'android') {

      } else {
        res.status(400);
        res.json({
          message: 'Invalid platform'
        });
      }
    } else {
      res.status(400);
      res.json({
        message: 'Invalid parameters'
      });
    }
  }
};

module.exports = object;