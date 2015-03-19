module.exports = {
  start: function (tests, onComplete) {
    this.tests = tests;
    this.onComplete = onComplete;
    this.testsRun = 0;
    this.tests[0].run();
  },
  onTestComplete: function () {
    this.testsRun++;

    if (this.testsRun < this.tests.length) {
      this.tests[this.testsRun].run();
    } else {
      this.onComplete.call(this);
    }
  }
};
