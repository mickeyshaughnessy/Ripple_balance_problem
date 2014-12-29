/* Loading ripple-lib with Node.js */
var Remote = require('../ripple-lib').Remote;

/* Loading ripple-lib in a webpage */
// var Remote = ripple.Remote;

var remote = new Remote({
  // see the API Reference for available options
  servers: [ 'wss://s1.ripple.com:443' ]
});

var options = {
  account: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
  ledger: 'validated'
};

var request = remote.requestAccountInfo(options, function(err, info) {
  /* process info */
    console.log('hello');
});
