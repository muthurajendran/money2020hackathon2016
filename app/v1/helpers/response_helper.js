'use strict';

function response(req, res) {
  var data = req.response;
  res.json({
    success: true,
    value: data
  });
}

module.exports = response;