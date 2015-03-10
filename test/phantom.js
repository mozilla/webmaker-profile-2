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

    page.open('http://localhost:1969/user/newgvn', function (status) {
      var title = page.evaluate(function () {
        return document.title;
      });

      self.onComplete(title === 'newgvn | Webmaker');
    });
  }),
  new Test('Avatar image is visible.', function () {
    var self = this;

    page.open('http://localhost:1969/user/newgvn', function (status) {
      self.onComplete(page.evaluate(function () {
        return $('[data-test-id="avatar-img"]').css('display') === 'block';
      }));
    });
  }),
  new Test('Clicking badge button opened badge pane.', function () {
    var self = this;

    page.open('http://localhost:1969/user/newgvn', function (status) {
      // Click "badge" tab
      page.evaluate(function () {
        $('[data-test-id="btn-badges"]').click();
      });

      // Allow DOM to finish updating after click
      setTimeout(function () {
        var result = page.evaluate(function () {
          return $('[data-test-id="view-badges"]').css('display');
        });

        self.onComplete(result);
      }, 100);
    });
  })
];

runner.start();
