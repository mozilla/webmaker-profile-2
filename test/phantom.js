var page = require('webpage').create();

var testsRun = 0;
var passed = 0;
var failed = 0;

var tests;

// REPORTER -------------------------------------------------------------------

var reporter = {
  report: function (test, result) {
    if (result) {
      console.log('PASS: ' + test);
      passed++;
    } else {
      console.log('FAIL: ' + test);
      failed++;
    }

    testsRun++;

    if (testsRun === tests.length) {
      this.onComplete();
    }
  },
  onComplete: function () {
    console.log('\nAll tests finished.\n');
    console.log(passed + ' tests passed.');
    console.log(failed + ' tests failed.');

    phantom.exit(failed > 0 ? 1 : 0);
  }
};

// RUNNER ---------------------------------------------------------------------

var runner = {
  start: function () {
    tests[0].run();
  },
  onTestComplete: function () {
    if (testsRun < tests.length) {
      tests[testsRun].run();
    }
  }
};

// TEST CLASS -----------------------------------------------------------------

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
        console.log('esel');
        self.testBody.call(self);
      }
    });
  },
  /**
   * Callback for testBody
   * @param  {boolean} didPass Test result
   */
  onComplete: function (didPass) {
    reporter.report(this.description, didPass);
    runner.onTestComplete();
  }
};

// TESTS ----------------------------------------------------------------------

tests = [
  new Test(
    'Avatar image is visible.',
    'http://localhost:1969/user/mike_danton',
    'login.js',
    function () {
      var isVisible = page.evaluate(function () {
        return $('[data-test-id="avatar-img"]')[0].clientHeight > 0;
      });

      this.onComplete(isVisible);
    }
  ),
  new Test(
    'Document title is correct.',
    'http://localhost:1969/user/mike_danton',
    null,
    function () {
      var title = page.evaluate(function () {
        return document.title;
      });

      this.onComplete(title === 'mike_danton | Webmaker');
    }
  ),
  new Test(
    'Clicking badge button opened badge pane.',
    'http://localhost:1969/user/mike_danton',
    'login.js',
    function () {
      var self = this;
      
      // Click "badge" tab
      page.evaluate(function () {
        $('[data-test-id="btn-badges"]').click();
      });

      // Allow DOM to finish updating after click
      setTimeout(function () {
        var result = page.evaluate(function () {
          return $('[data-test-id="view-badges"]')[0].clientHeight > 0;
        });

        self.onComplete(result);
      }, 100);
    }
  )
];

runner.start();
