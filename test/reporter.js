var colors = require('colors');

module.exports = {
  passed: 0,
  failed: 0,
  testsRun: 0,
  report: function (test, result) {
    if (result) {
      console.log(colors.green('✓ PASS: '.bold + test));
      this.passed++;
    } else {
      console.log(colors.red('✗ FAIL: '.bold + test));
      this.failed++;
    }

    this.testsRun++;
  },
  summarize: function () {
    console.log(colors.bold.underline('\nAll tests finished.\n'));

    if (this.passed > 0) {
      console.log(colors.bold.green(this.passed + ' tests passed.'));
    }

    if (this.failed > 0) {
      console.log(colors.bold.red(this.failed + ' tests this.failed.'));
    }

    phantom.exit(this.failed > 0 ? 1 : 0);
  }
};
