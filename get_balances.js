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
  /* remote connected */
  remote.requestServerInfo(function(err, info) {
    // process err and info
  //console.log(info);
    });
});

//function async(arg, callback) {
//    setTimeout(function() { callback(arg); }, 1000);
//}
//
//function Account(number) { 
//    this.number = number;
//    this.balance = 0;
//}

// A browser's default method is 'GET', so this
// is the route that express uses when we visit
// our site initially.
app.get('/', function(req, res){
    // The form's action is '/' and its method is 'POST',
    // so the `app.post('/', ...` route will receive the
    // result of our form
    var html = '<form action="/" method="post">' +
               'Enter comma separated account number(s):' +
               '<input type="text" name="AccountNumbers" placeholder="..." />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';
    res.send(html);
});

// This route receives the posted form.
// As explained above, usage of 'body-parser' means
// that `req.body` will be filled in with the form elements
//function ExtractIOU(i, j, account_info, IOUs) {
//    if ( j < info.lines.length) {
//        var options = {
//        account: account_info["account_data"]["Account"]
//        ledger: 'validated'
//        };
//        var requestIOU = remote.requestAccountLines(options, function(err, info) {
//           html += info.lines[0]['balance'] +'.<br>'; 
//        });
//        ExtractIOU(i, j+1, account_info)        
//    }
//    else { ExtractData ( i + 1)

//function DisplayIOUs ( IOUs ) {
    

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
            //IOUs = {};
            //async.parallel([remote.requestAccountInfo(options, function(err, info) {
            //    html += 'Balance: ' + info["account_data"]["Balance"] + ' (XRP) <br>';
            //    }),
            //    remote.requestAccountLines(options, function(err, info) {
            //        IOUs = info.lines
            //    })
            //], function(err) {
            //    if (err) return next(err);
            //    //DisplayIOUs(IOUs);
            //    });
            //console.log(IOUs)
        }
        else { res.send(html); }
    }
    ExtractData(0)
}); 
            
        

            //var requestBalance = remote.requestAccountInfo(options, function(err, info) {
            //    html += 'Balance: ' + info["account_data"]["Balance"] + ' (XRP) <br>';
            //    IOUs = {}; 
            //    var requestIOU = remote.requestAccountLines(options, function(err, info) {
            //        IOUs = info.lines
            //        html += info.lines[0]['balance'] +'.<br>';
            //    });
                // get IOUs object
            //    ExtractIOU(i, 0, info, IOUs)

//    res.send(html);
//    function ExtractIOUs (number) {
//        var IOUs = {}
//        var requestIOU = remote.requestAccountLines(options, function(err, info) {
//                    console.log(info);
//                }); 
//    }
//
//    var Myaccount = new Account(AccountNumber);
//    var html = 'Balance: '; 
//    console.log('hello'); 
//    var options = {
//    account: Myaccount.number,
//    ledger: 'validated'
//    };
//
//    var requestBalance = remote.requestAccountInfo(options, function(err, info) {
//        console.log(info);
//        html += info["account_data"]["Balance"] + '.<br>';
//        var IOUs = [];
//        var requestIOU = remote.requestAccountLines(options, function(err, info) {
//            console.log(info);
//        //info.lines.forEach(function(line) {
//        //    async(line, function(result){
//        //        IOUs.push(result)
//        //        if(IOUs.length == lines.length) {
//        //            final();
//        });
//        //html += info.lines[0]['balance'] +'.<br>';
//        //console.log(info.lines[0]['balance']);
//        /* process info */
//    }); 
//    
//  //var requestIOU = remote.requestAccountLines(options, function(err, info) {
//  //  html += info.lines[0]['balance'] +'.<br>'
//    //console.log(info.lines[0]['balance']);
//    /* process info */
//    //console.log(html)  
//    //res.send(html);
//});

app.listen(8080);

///* Loading ripple-lib with Node.js */
//var Remote = require('../ripple-lib').Remote;
//
//var remote = new Remote({
//  servers: [ 'wss://s1.ripple.com:443' ]
//});
//
//function Account(number) { 
//    this.number = number;
//    this.balance = 0;
//}
//
//var Myaccount = new Account('rUB4uZESnjSp2r7Uw1PnKSPWNMkTDCMXDJ')
//
//remote.connect(function() {
//  /* remote connected */
//  remote.requestServerInfo(function(err, info) {
//    // process err and info
//  //console.log(info);
//    });
//});
////
//////
//var options = {
//  account: Myaccount.number, 
//  ledger: 'validated'
//};
////
//////var request = remote.requestAccountInfo(options, function(err, info) {
////  /* process info */
////  //  console.log(info);
//////});
//////console.log(options['account']);
////
//var requestBalance = remote.requestAccountInfo(options, function(err, info) {
//    //account.balance = info;
//    console.log(info["account_data"]["Balance"]);
//    //console.log("hello mickey");
//    /* process info */
//});
////
//var requestIOU = remote.requestAccountLines(options, function(err, info) {
//    //account.balance = info;
//    console.log(info.lines[0]['balance']);
//    //console.log("hello mickey");
//    /* process info */
//});
////server.start();





