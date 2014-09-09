var chai = require('chai'),
    should = chai.should(),
    hubClient = require('../index.js'),
    nock = require('nock');

describe('#publish', function(done) {
  describe("Configuration errors", function() {
    it('raises an error when env is not configured', function() {
      hubClient.config.configure({'endpoint_url': 'http://www.service-hub.com'});

      (function(){
        hubClient.publish('order_created', {});
      }).should.throw(Error, "env missing");
    });

    it('raises an error when endpoint_url is not configured', function() {
      hubClient.config.configure({'env': 'il-qa2'});

      (function(){
        hubClient.publish('order_created', {});
      }).should.throw(Error, "endpoint_url missing");
    });
  });

  describe("Valid configuration", function() {
    var SEND_MSG_PATH = "/api/v1/messages";

    beforeEach(function() {
      hubClient.config.configure({'env': 'il-qa2', 'endpoint_url': 'http://www.service-hub.com'});
    });

    describe("Callbacks", function() {
      it('publishes a message to hub', function(done) {
        nock(hubClient.config.get('endpoint_url'))
            .post(SEND_MSG_PATH, {
              type: 'order_created',
              env: 'il-qa2',
              content: { "some": "content" }
            })
            .reply(204);

        hubClient.publish('order_created', { "some": "content" }, function(err, response) {
          response.statusCode.should.equal(204);
          done();
        });
      });
    });

    describe("Promises", function() {
      it("resolves on success", function(done) {
        nock(hubClient.config.get('endpoint_url'))
          .post(SEND_MSG_PATH, {
            type: 'order_created',
            env: 'il-qa2',
            content: { "some": "content" }
          })
          .reply(204);

        hubClient.publishQ('order_created', {'some': 'content'})
          .then(function() {
            done();
          });
      });


      it ('rejects on failure', function(done) {
        nock(hubClient.config.get('endpoint_url'))
          .post(SEND_MSG_PATH, {
            type: 'order_created',
            env: 'il-qa2',
            content: {"some": "content"}
          })
          .reply(500);

        hubClient.publishQ('order_created', {'some': 'content'})
          .catch(function(err) {
            done();
          });
      });
    });
  });
});
