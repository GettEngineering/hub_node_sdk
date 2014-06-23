var chai = require('chai'),
    should = chai.should();
    hubClient = require('../index.js'),
    nock = require('nock');

describe('#publish', function(done) {
  it('raises an error when env is not configured', function() {
    hubClient.config.configure({'endpoint_url': 'http://www.service-hub.com'});
    hubClient.publish('order_created', {}).should.equal('env missing');
  });

  it('raises an error when endpoint_url is not configured', function() {
    hubClient.config.configure({'env': 'il-qa2'});
    hubClient.publish('order_created', {}).should.equal('endpoint_url missing');
  });

  it('publishes a message to hub', function(done) {
    hubClient.config.configure({'env': 'il-qa2', 'endpoint_url': 'http://www.service-hub.com'});

    nock(hubClient.config.get('endpoint_url'))
        .post('/', { 
          type: 'order_created', 
          env: 'il-qa2', 
          content: encodeURIComponent(JSON.stringify({ "some": "content" })) 
        })
        .reply(204);

    hubClient.publish('order_created', { "some": "content" }, function(response) {
      response.statusCode.should.equal(204);
      done();
    });
  });

  it("logs the request when hub didn't return success code", function(done) {
    hubClient.config.configure({'env': 'il-qa2', 'endpoint_url': 'http://www.service-hub.com'});

    nock(hubClient.config.get('endpoint_url'))
        .post('/', { 
          type: 'order_created', 
          env: 'il-qa2', 
          content: encodeURIComponent(JSON.stringify({ "some": "content" })) 
        })
        .reply(500);

    hubClient.publish('order_created', { "some": "content" }, function(response) {
      response.statusCode.should.equal(500);
      done();
    });
  }); 
});