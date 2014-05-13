var cson = require('cson');

var config = cson.parseFileSync('env.cson');
var server = require('./server')(config);

// Run server
server.listen(config.PORT || 1969, function () {
  console.log('Now listening on %d', config.PORT || 1969);
});
