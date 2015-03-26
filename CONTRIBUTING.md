# Contribution Guidelines

## Reporting issues

- **Search for existing issues.** Please check to see if someone else has reported the same issue.
- **Share as much information as possible.** Include operating system and version, browser and version. Also, include steps to reproduce the bug.

## Project Setup

Refer to the [README](https://github.com/mozilla/webmaker-profile-2/blob/master/README.md).

## Code Style

### JavaScript

See: [Mozilla Foundation JavaScript Style Guide](https://github.com/MozillaFoundation/javascript-style-guide)

### HTML

- 2 space indentation
- Class names use hyphenated case (e.g. `my-class-name`)

### LESS / CSS

- 2 space indentation
- Always a space after a property's colon (e.g. `display: block;` *not* `display:block;`)
- End all lines with a semi-colon
- For multiple, comma-separated selectors, place each selector on it's own line

## Testing

Any patch should be tested in as many of our [supported browsers](LINK HERE) as possible. Obviously, access to all devices is rare, so just aim for the best coverage possible. At a minimum please test in all available desktop browsers.

### Running Tests

Simply run `npm test` to perform all functional tests.

### Adding Tests

Any patch for this repo should be accompanied by one or more automated tests to avoid regressions introduced by future code changes.

Currently we use PhantomJS for functional testing in a headless browser. To add a new test, edit `test/phantom.js` and append a new `Test` object to the `tests` array.

A `Test` object is instantiated with the following parameters: `description, url, injectedJS, testBody`

- `description` (*String*) - Description of test success. (eg: "Clicking delete removes item.")
- `url` (*String*) - The URL that the browser should open before the test is run.
- `injectedJS` (*String*) - Defines a path to JS that should be injected into the page before the test is run. This could be mocked data, a sequence of interactions common to multiple tests, or something else your test needs to run.
- `testBody` (*Function*) - A function containing your test code. Most likely this function will contain one or more calls to `page.evaluate`, which allows JS to be run in the context of the page being tested. This function requires a call to `this.onComplete()` with a boolean value representing the outcome of the test (eg: `this.onComplete(false)` for a failure).

#### Targeting Elements

The preferred way to target an element is to give it a `data-test-id` attribute with a globally unique identifier. This data attribute is only used in testing and should not be used in the primary application code!

#### Exposing Variables

There is one global object, `TEST`, that may be decorated with references to private members of the application's JS code. This is useful for reading data about the application state, but also for mocking purposes such as injecting dummy data (see also: `injectedJS`).

#### DOM and setTimeout

There are some cases where the DOM won't finish updating fast enough to depend on programmatic interactions and subsequent mutations being syncronous.

An example of this is firing a click event on a button and then checking for a modal window to be visible. The modal may not be visible immediately, so you will need a `setTimeout` call to delay your test. Generally 1 MS should be sufficient for non-animated UI, but be generous with your delay to reduce the likelihood of a race condition (at least 100 MS is encouraged).

## Pull requests

- Try not to pollute your pull request with unintended changes – keep them simple and small. If possible, squash your commits.
- Try to share which browsers and devices your code has been tested in before submitting a pull request.
- If your PR resolves an issue, include **closes #ISSUE_NUMBER** in your commit message (or a [synonym](https://help.github.com/articles/closing-issues-via-commit-messages)).
