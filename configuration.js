function Configuration() {}
 Configuration.prototype = {
     'configure': function(config) {
          this.config = config;
      },
      'get': function(key) {
        return (this.config || {})[key] || null;
      }
 }

 module.exports = new Configuration();