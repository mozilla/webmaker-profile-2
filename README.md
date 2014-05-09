# Webmaker Profile 2

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

### Installation

```bash
git clone https://github.com/gvn/webmaker-profile-2.git
cd webmaker-profile-2
npm install
```

Clone the `env.cson.example` file to `env.cson` and configure your environment.

To run the project simply execute `grunt`.

To see a specific user's profile navigate to [http://localhost:1134/#!/USERNAME](http://localhost:1134/#!/USERNAME).

### Grunt Tasks

- `grunt` - Compile LESS, run web server on port 1134, and recompile LESS as needed.
- `grunt clean` - Beautify JS and HTML based on **.jsbeautifyrc** and check JS for JSHint compliance based on **.jshintrc**.
- `grunt validate` - Test that JS and HTML are beautified and JS passes JSHint. Typically this task is run by Travis to verify commits are clean.
