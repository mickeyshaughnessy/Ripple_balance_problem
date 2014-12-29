//var server = require("./server");

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());

// A browser's default method is 'GET', so this
// is the route that express uses when we visit
// our site initially.
app.get('/', function(req, res){
  // The form's action is '/' and its method is 'POST',
  // so the `app.post('/', ...` route will receive the
  // result of our form
  var html = '<form action="/" method="post">' +
               'Enter account:' +
               '<input type="text" name="AccountNumber" placeholder="..." />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';
  res.send(html);
});

// This route receives the posted form.
// As explained above, usage of 'body-parser' means
// that `req.body` will be filled in with the form elements
app.post('/', function(req, res){
  var AccountNumber = req.body.AccountNumber;
  var Myaccount = new Account(AccountNumber);
  var html = 'Balance: ' 
  var options = {
    account: Myaccount.number,
    ledger: 'validated'
    };
  var requestBalance = remote.requestAccountInfo(options, function(err, info) {
    html += info["account_data"]["Balance"] + '.<br>';
    /* process info */
    });
  var requestIOU = remote.requestAccountLines(options, function(err, info) {
    html += info.lines[0]['balance'] +'.<br>'
    //console.log(info.lines[0]['balance']);
    /* process info */
    });   
  res.send(html);
});

app.listen(8080);

/* Loading ripple-lib with Node.js */
var Remote = require('../ripple-lib').Remote;

var remote = new Remote({
  servers: [ 'wss://s1.ripple.com:443' ]
});

function Account(number) { 
    this.number = number;
    this.balance = 0;
}

var Myaccount = new Account('rUB4uZESnjSp2r7Uw1PnKSPWNMkTDCMXDJ')

remote.connect(function() {
  /* remote connected */
  remote.requestServerInfo(function(err, info) {
    // process err and info
  //console.log(info);
    });
});

//
var options = {
  account: Myaccount.number, 
  ledger: 'validated'
};

//var request = remote.requestAccountInfo(options, function(err, info) {
  /* process info */
  //  console.log(info);
//});
//console.log(options['account']);

var requestBalance = remote.requestAccountInfo(options, function(err, info) {
    //account.balance = info;
    console.log(info["account_data"]["Balance"]);
    //console.log("hello mickey");
    /* process info */
});

var requestIOU = remote.requestAccountLines(options, function(err, info) {
    //account.balance = info;
    console.log(info.lines[0]['balance']);
    //console.log("hello mickey");
    /* process info */
});
//server.start();





