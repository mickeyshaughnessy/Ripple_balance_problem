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

//function Account(number) {
//    this.number = number;
//    this.balance = 0;
//    this.IOUs = {};
//}

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
    
    function appendIOUs (html, IOUs, i, finished) {
//        console.log('IOUs: %j', IOUs);
        var totals = {};
//        console.log(IOUs); 
//        console.log('first totals: %j', totals);
        for (var j = 0; j < IOUs.length; j++) {
//            console.log('intermediate totals: %j', totals);
            var line = IOUs[j];
//            console.log(line);
//            console.log(line.currency);
//            console.log('key % value %s', Object.keys(totals), );
//            console.log(line.currency);
//            console.log('target currency %s, available currencies %s', line.currency, Object.keys(totals));
//            console.log(Object.keys(totals));
            if (Object.keys(totals).indexOf(line.currency) > 0 ) {
//                console.log('current totals: %s', totals[line.currency]);
//                console.log('amount to add %s, cast %s', line.balance, parseFloat(line.balance));
                totals[line.currency] += parseFloat(line.balance);
//                console.log('next values: %s', values[line.currency]);
//                console.log(values);
            }
            else{
//                console.log('first values: %s for %s', values[line.currency], line);
                totals[line.currency] = parseFloat(line.balance);
            }
        }
        console.log('final totals: %j', totals);
        for (var currency in totals){
            html += 'Currency :' + currency + 'Total: ' + totals[currency] + '<br>';
        }
        console.log('hi %s',html);
        finished += 1;
        if (finished == accounts.length){
            emitter.emit('done', res, html);
        } 
        ExtractData(null, i + 1 , finished, html)
    }
 
    //var send_html = function (err, html, res) {
    //    res.send(html);
    //};

    var emitter = new (require('events').EventEmitter);
    emitter.on('done', function (res, html) { res.send(html); });

    function ExtractData(err, i, finished, html) {
        if ( i < accounts.length ) {
            console.log(i);
            html += 'Account: ' + accounts[i] + '<br>';
            var options = {
            account: accounts[i],
            ledger: 'validated'
            };
            var IOUs = {}
            var requestBalance = remote.requestAccountInfo(options, function(err, info) {
                html += 'Balance (XRP): ' + info["account_data"]["Balance"] + '<br>';
                var requestIOU = remote.requestAccountLines(options, function(err, info) {
                    IOUs = info.lines;
                    appendIOUs (html, IOUs, i, finished)
                });
                // insert get IOU code here and make it callback ExtractData(i+1)? 
            });
        }
        else { 
            console.log('hola %s',html)
            //callback(null, html, res);
        //    console.log(i);
        //    //res.send(html);
        }
    }
    var finished = 0;
    ExtractData(null, 0, finished, html)
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

//  rUB4uZESnjSp2r7Uw1PnKSPWNMkTDCMXDJ,rUB4uZESnjSp2r7Uw1PnKSPWNMkTDCMXDJ
// rBTC1BgnrukYh9gfE8uL5dqnPCfZXUxiho,rUB4uZESnjSp2r7Uw1PnKSPWNMkTDCMXDJ,r4ffgYrACcB82bt99VnqH4B9GEntEypTcp
