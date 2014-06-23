var request = require('request')
var configuration = require('./configuration.js')

function error(message) { 
  console['error'](message);
  return message;
}

module.exports = {
  publish: function(type, content, callback) {
    if (!this.config.get('env')) return error('env missing');
    if (!this.config.get('endpoint_url')) return error('endpoint_url missing');

    var options = {
      url: this.config.get('endpoint_url'),
      form: { env: this.config.get('env'), type: type, content: encodeURIComponent(JSON.stringify(content)) }
    };

    request.post(options, function (err, response, body) {
      callback(response);
      if (err || response.statusCode != 200) {
        error(response);
      }
    });
  },
  config: configuration
}