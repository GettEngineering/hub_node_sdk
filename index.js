var request = require('request'),
    configuration = require('./configuration.js'),
    when = require('when');

var config = configuration;

function publish(type, content, callback) {
  /* jshint eqnull: true */

  if (!config.get('endpoint_url')) throw new Error('endpoint_url missing');
  var msg;
  if (typeof(type) === 'string')
    msg = { type: type };
  else msg = opts;

  if (!msg.env) msg.env = config.get('env');
  if (!msg.env) throw new Error('env missing');

  msg.content = content;

  var options = {
    url: config.get('endpoint_url') + "/api/v1/messages",
    json: msg
  };

  request.post(options, function (err, response, body) {
    callback(err, response);
  });
}

function publishQ(type, content) {
  return when.promise(function(resolve, reject) {
    publish(type, content, function(err, response) {
      if (err) {
        reject(err, response);
        return;
      }

      var code = Math.round(response.statusCode / 100);
      if (code != 2)
        reject(new Error("Unexpected response (", response.statusCode, ") from ServiceHub"), response);

      resolve(response);
    });
  });
}

module.exports = {
  publish: publish,
  publishQ: publishQ,
  config: config
};
