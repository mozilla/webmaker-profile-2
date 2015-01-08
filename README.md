# Webmaker Profile 2  [![Build Status](https://travis-ci.org/mozilla/webmaker-profile-2.svg)](https://travis-ci.org/mozilla/webmaker-profile-2)

*Electric Boogaloo*

## Setup

### Tooling Dependencies

- grunt
- bower
- node
- npm

### Service Dependencies

- [make-api](https://github.com/mozilla/makeapi)
- [webmaker-events-service](https://github.com/mozilla/webmaker-events-service)

### Required Server Configuration

The following configuration variables are required in `env.cson`:

- `badgekitApiUrl`: The URL for badgekit-api. For dev, this is probably `'https://badgekit-api.mofostaging.net'`
- `badgekitApiKey`: The key for accessing badgekit-api. For dev, this is probably `'master'`
- `badgekitApiSecret`: The secret key for accessing badgekit-api. You should ask `@k88hudson` or `@echristensen` for this
- `loginUrlWithAuth`: The full-qualified login URL. Probably `http://testuser:password@localhost:3000`

### Installation

```bash
git clone https://github.com/mozilla/webmaker-profile-2.git
cd webmaker-profile-2
npm install
```

Clone the `env.cson.example` file to `env.cson` and configure your environment.

To run the project simply execute `grunt`, or if you'd like live reload `grunt live-server`.

To see a specific user's profile navigate to [http://localhost:1969/user/USERNAME](http://localhost:1969/user/USERNAME).

### Server API Routes

##### /user/_service/badges/username/:username

Returns a list of a user's badges given `username`.

##### /user/_service/user-data/:username

Returns public user metadata for given `username`.

##### /user/_service/env.json

Returns JSON of public app configuration for use on client side.

#### Routes used for login (webmaker-user-client):

- /_service/login/verify
- /_service/login/authenticate
- /_service/login/create
- /_service/login/logout
- /_service/login/check-username

### Grunt Tasks

- `grunt` - Compile LESS, run web server on port 1969, and recompile LESS as needed.
- `grunt lint` - Beautify JS and HTML based on **.jsbeautifyrc** and check JS for JSHint compliance based on **.jshintrc**.
- `grunt validate` - Test that JS and HTML are beautified and JS passes JSHint. Typically this task is run by Travis to verify commits are clean.
- `grunt build` - Compiles the front-end for production.
