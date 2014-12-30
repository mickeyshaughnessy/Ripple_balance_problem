var express = require('express');
var bodyParser = require('body-parser');
var app = express();
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
    var accounts = req.body.AccountNumbers.split(',');
    var html = '';
    var emitter = new (require('events').EventEmitter);
    emitter.on('done', function (res, html) { 
        html += 'TOTAL XRP: ' + XRP_tot + '<br>';
        res.send(html);
    });
   
    var XRP_tot = 0;
    /* This gets the account information and starts writing an html string */
    function ExtractAccountData(i, finished, html) {
        if (i < accounts.length) {
            html += 'Account: ' + accounts[i] + '<br>';
            var options = {
            account: accounts[i],
            ledger: 'validated'
            };
            var requestBalance = remote.requestAccountInfo(options, function(err, info) {
                if (err) {
                    res.send('badly formed account(s) -- try again!');
                    return console.error(err);
                }
                balance = info["account_data"]["Balance"];
                html += 'Balance (XRP): ' + balance + '<br>';
                XRP_tot += parseFloat(balance); 
                var requestIOU = remote.requestAccountLines(options, function(err, info) {
                    if (err) {
                        res.send('badly formed account(s) -- try again!');
                        return console.error(err);
                    }
                    appendIOUs (html, info.lines, i, finished)
                });
            });
        }
    }
  
  /* This processes the IOUs, writes to the html string, checks to see if everything
    is done, and calls the next account processing operation */

    function appendIOUs (html, IOUs, i, finished) {
        var totals = {};
        for (var j = 0; j < IOUs.length; j++) {
            var line = IOUs[j];
            if (Object.keys(totals).indexOf(line.currency) > 0 ) {
                totals[line.currency] += parseFloat(line.balance);
            }
            else{
                totals[line.currency] = parseFloat(line.balance);
            }
        }
        for (var currency in totals){
            html += currency + ' Total: ' + totals[currency] + '<br>';
        }
        finished += 1;
        if (finished == accounts.length){
            emitter.emit('done', res, html, XRP_tot);
        }
        ExtractAccountData(i + 1, finished, html)
    }
 
    /* Start looping through accounts */ 
    var finished = 0;
    ExtractAccountData(0, finished, html)
}); 
app.listen(8080);

// account strings for testing below
//  rUB4uZESnjSp2r7Uw1PnKSPWNMkTDCMXDJ
//  rUB4uZESnjSp2r7Uw1PnKSPWNMkTDCMXDJ,rUB4uZESnjSp2r7Uw1PnKSPWNMkTDCMXDJ
//  rBTC1BgnrukYh9gfE8uL5dqnPCfZXUxiho,rUB4uZESnjSp2r7Uw1PnKSPWNMkTDCMXDJ,r4ffgYrACcB82bt99VnqH4B9GEntEypTcp
