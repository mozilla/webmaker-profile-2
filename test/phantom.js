var reporter = require('./reporter');
var runner = require('./runner');
var Test = require('./test-object');

// TESTS ----------------------------------------------------------------------

var tests = [
  new Test(
    'Avatar image is visible.',
    'http://localhost:1969/user/mike_danton',
    'login.js',
    function () {
      var isVisible = this.page.evaluate(function () {
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
      var title = this.page.evaluate(function () {
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
      self.page.evaluate(function () {
        $('[data-test-id="btn-badges"]').click();
      });

      // Allow DOM to finish updating after click
      setTimeout(function () {
        var result = self.page.evaluate(function () {
          return $('[data-test-id="view-badges"]')[0].clientHeight > 0;
        });

        self.onComplete(result);
      }, 100);
    }
  ),
  new Test(
    'Edit avatar link is visible in edit mode. BZ: 1063965.',
    'http://localhost:1969/user/mike_danton',
    'login.js',
    function () {
      var self = this;

      self.page.evaluate(function () {
        $('[data-test-id="edit-button"]').click();
      });

      setTimeout(function () {
        var linkHeight = self.page.evaluate(function () {
          return $('[data-test-id="gravatar-metadata"]')[0].clientHeight;
        });

        self.onComplete(linkHeight > 0);
      }, 100);
    }
  ),
  new Test(
    'LinkedIn url should get custom icon. BZ: 1064096.',
    'http://localhost:1969/user/mike_danton',
    'login.js',
    function () {
      var self = this;

      self.page.evaluate(function () {
        $('[data-test-id="edit-button"]').click();
      });

      setTimeout(function () {
        var linkExists = self.page.evaluate(function () {
          $('[data-test-id="link-input"]')
            .val('www.linkedin.com/in/mikedanton')
            .trigger('input');

          $('[data-test-id="button-add-link"]').click();

          return $('[data-test-id="user-service-links"] .fa-stop-adblock-linkedin').length;
        });

        self.onComplete(linkExists);
      }, 100);
    }
  )
];

// Decorate Test instances with an `onComplete` method to trigger the reporter and runner
tests.forEach(function (test) {
  test.onComplete = function (didPass) {
    reporter.report(this.description, didPass);
    runner.onTestComplete();
  };
});

runner.start(tests, function allTestsDone() {
  reporter.summarize();
});
