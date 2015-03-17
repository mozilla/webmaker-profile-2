module.exports = (function () {
  /**
   * Test Class
   * @param {string} description Description of test success
   * @param {string} url         Page to run test
   * @param {string} injectedJS  JS to inject before tests run
   * @param {function} testBody  Test body (Call this.onComplete() when done)
   */
  var Test = function (description, url, injectedJS, testBody) {
    this.description = description;
    this.url = url;
    this.testBody = testBody;
    this.injectedJS = injectedJS;
  };

  Test.prototype = {
    /**
     * Run the test
     */
    run: function () {
      var self = this;

      page.open(self.url, function (status) {
        if (self.injectedJS) {
          page.injectJs(self.injectedJS);

          setTimeout(function () {
            self.testBody.call(self);
          }, 100);
        } else {
          self.testBody.call(self);
        }
      });
    }
  };

  return Test;
})();
