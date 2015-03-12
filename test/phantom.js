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

var Test = function (description, testBody) {
  this.description = description;
  this.testBody = testBody;
};

Test.prototype = {
  run: function () {
    this.testBody.call(this);
  },
  onComplete: function (didPass) {
    reporter.report(this.description, didPass);
    runner.onTestComplete();
  }
};

// TESTS ----------------------------------------------------------------------

tests = [
  new Test('Document title is correct.', function () {
    var self = this;

    page.open('http://localhost:1969/user/mike_danton', function (status) {
      var title = page.evaluate(function () {
        return document.title;
      });

      self.onComplete(title === 'mike_danton | Webmaker');
    });
  }),
  new Test('Avatar image is visible.', function () {
    var self = this;

    page.open('http://localhost:1969/user/mike_danton', function (status) {
      page.injectJs('login.js');

      // Allow sufficient time for Login mock to take effect
      setTimeout(function () {
        self.onComplete(page.evaluate(function () {
          return $('[data-test-id="avatar-img"]')[0].clientHeight > 0;
        }));
      }, 100);
    });
  }),
  new Test('Clicking badge button opened badge pane.', function () {
    var self = this;

    page.open('http://localhost:1969/user/mike_danton', function (status) {
      page.injectJs('login.js');

      // Allow sufficient time for Login mock to take effect
      setTimeout(function () {
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
      }, 100);
    });
  })
];

runner.start();
