'use strict';

var object = {

  test: function(req, res, next) {
    res.json({
      'message':'hi'
    });
  }
}

module.exports = object;