var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var async = require('async');
app.use(bodyParser());

/* Loading ripple-lib with Node.js */
var Remote = require('../ripple-lib').Remote;

var remote = new Remote({
  servers: [ 'wss://s1.ripple.com:443' ]
});

remote.connect(function() {
  remote.requestServerInfo(function(err, info) {
    });
});

app.get('/', function(req, res){
    var html = '<form action="/" method="post">' +
               'Enter comma separated account number(s):' +
               '<input type="text" name="AccountNumbers" placeholder="..." />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';
    res.send(html);
});

app.post('/', function(req, res){
    var AccountNumbers = req.body.AccountNumbers;
    var accounts = AccountNumbers.split(',');
    var html = ''; 
    function ExtractData(i) {
        if( i < accounts.length ) {
            html += 'Account: ' + accounts[i] + '<br>';
            var options = {
            account: accounts[i],
            ledger: 'validated'
            };
            var requestBalance = remote.requestAccountInfo(options, function(err, info) {
                html += 'Balance: ' + info["account_data"]["Balance"] + ' (XRP) <br>';
                ExtractData( i + 1 )
                });
        }
        else { res.send(html); }
    }
    ExtractData(0)
}); 
app.listen(8080);
