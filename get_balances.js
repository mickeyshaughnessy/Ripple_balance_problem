var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var async = require('async');
app.use(bodyParser());

/* Loading ripple-lib with Node.js */
var Remote = require('ripple-lib').Remote;

var remote = new Remote({
  servers: [ 'wss://s1.ripple.com:443' ]
});

function Account(number) {
    this.number = number;
    this.balance = 0;
    this.IOUs = {};
}

//function getAccountBalance(account_number){
    
function assign_value (input) {
    return input;
}
    
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
            var IOUs = {}
            var requestBalance = remote.requestAccountInfo(options, function(err, info) {
                html += 'Balance (XRP): ' + info["account_data"]["Balance"] + '<br>';
                var x = assign_value(2); 
                var requestIOU = remote.requestAccountLines(options, function(err, info) {
                    var accountTotal = 0;
                    IOUs = info.lines;

                    ExtractData( i + 1 );
                    for(i=0; i< IOUs.length; i++){
                      accountTotal = parseInt(accountTotal + IOUs[i].balance);
                    }
                    console.log(accountTotal);
                });
               
                // insert get IOU code here and make it callback ExtractData(i+1)? 
            });
        }
        else { res.send(html); }
    }

    ExtractData(0)
}); 
app.listen(8080);


/* What I want to do for IOUs:

IOUs = {}
requestIOU = remote.requestAccountLines(options, function(err, info) {
    IOUs = info.lines        
});

values = {}
for line in IOUs:  //python syntax
    if line.currency in values.keys():
        values[line.currency] += line.balance
    else:
        values[line.currency] = line.balance

for currency in values:
    html += 'Currency :' + currency + 'Total: ' + values[currency] + '<br>'

*/
