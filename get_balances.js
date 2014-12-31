var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());

/* Loading ripple-lib with Node.js */
var Remote = require('../ripple-lib').Remote;

var remote = new Remote({
    servers: [ 'wss://s1.ripple.com:443' ]
});

remote.connect( function() {
    remote.requestServerInfo(function(err, info) {
        if (err) {return console.error(err);}
    });
});

function Totals() {
    this.currencies = ['XRP'];
    this.balances = {'XRP':0.0};
    this.html = '';
    this.emitter = new (require('events').EventEmitter);
    //this.accounts = [];
}

app.get('/', function (req, res){
    var html = '<form action="/" method="post">' +
               'Enter comma separated account number(s):' +
               '<input type="text" name="AccountNumbers" placeholder="..." />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';
    res.send(html);
});

/* The strategy in the post method (activated when the user clicks 'submit')
is to create the objects needed to handle the data and then recursively 
call the function to get the account data from the ripple API servers and 
process it. The `totals` object stores overall totals and the html output 
as they are constructed. When all accounts are finished being processed, a
`done` event is emitted and the html response is sent out */

app.post('/', function (req, res){
    var totals = new Totals()
    totals.accounts = req.body.AccountNumbers.split(',');
    
    totals.emitter.on('done', function (totals) {
        totals.html += '<br> -------- Overall Totals --------- <br>';
        for (var currency in totals.balances) {
            totals.html += currency + ': ' + 
            totals.balances[currency].toString() + '<br>';
        }; 
        res.send(totals.html);
    });

    var getData = require('./processAccounts');
    /* Start looping through accounts */ 
    var finished = 0;
    getData.extractAccountData(0, finished, totals, remote)
}); 
app.listen(8080);

/* account strings for testing below */
//  rUB4uZESnjSp2r7Uw1PnKSPWNMkTDCMXDJ
//  rUB4uZESnjSp2r7Uw1PnKSPWNMkTDCMXDJ,rUB4uZESnjSp2r7Uw1PnKSPWNMkTDCMXDJ
//  rBTC1BgnrukYh9gfE8uL5dqnPCfZXUxiho,rUB4uZESnjSp2r7Uw1PnKSPWNMkTDCMXDJ,r4ffgYrACcB82bt99VnqH4B9GEntEypTcp
