  /* This processes the IOUs, writes to the html string, checks to see if everything
    is done, and calls the next account processing operation */

function doIOUs (totals, IOUs, i, finished, remote) {
    var acc_totals = {};
    /* For loop over each line in the account IOUs */
    for (var j = 0; j < IOUs.length; j++) {
        var line = IOUs[j];
        /* In the section below, check to see if the currency has been seen before
        for the present account or overall - if not, add it to the relevant dictionaries.
        If so, increment the relevant values. */

        /* For current account do the check and increment totals: */
        if (Object.keys(acc_totals).indexOf(line.currency) != -1 ) {
            acc_totals[line.currency] += parseFloat(line.balance);
        }
        else{
            acc_totals[line.currency] = parseFloat(line.balance);
        }
        /* For overall totals, do the check and increment totals: */
        //if (Object.keys(totals.balances).indexOf(line.currency) > 0 ) {
        if (totals.currencies.indexOf(line.currency) != -1 ) {
            totals.balances[line.currency] += parseFloat(line.balance);
        }
        else{
            totals.currencies.push(line.currency);
            totals.balances[line.currency] = parseFloat(line.balance);
        }
    }
    for (var currency in acc_totals){
        totals.html += '   ' + currency + ': ' +
        acc_totals[currency].toString() + '<br>';
    }
    finished += 1;
    if (finished == totals.accounts.length){
        totals.emitter.emit('done', totals);
    }
    extractAccountData(i + 1, finished, totals, remote)
};

/* This function gets the top level account balance (XRP) and
then calls the doIOUs function, which, when done, calls another 
recursive iteration of this function. The post method in the main 
app starts the process. */
function extractAccountData(i, finished, totals, remote) {
    if (i < totals.accounts.length) {
        totals.html += '<br> Account: ' + totals.accounts[i] + '<br>';
        var options = {
        account: totals.accounts[i],
        ledger: 'validated'
        };
        var requestBalance = remote.requestAccountInfo(options, function (err, info) {
            if (err) {
                res.send('badly formed account(s) -- try again (or check your internet connection)');
                return console.error(err);
            }
            balance = info.account_data.Balance;
            totals.html += 'Balances (total): <br>' + '   XRP: ' + balance + '<br>';
            totals.balances['XRP'] += parseFloat(balance);
            var requestIOU = remote.requestAccountLines(options, function (err, info) {
                if (err) {
                    res.send('badly formed account(s) -- try again (or check your internet connection)');
                    return console.error(err);
                }
                doIOUs (totals, info.lines, i, finished, remote)
            });
        });
    }
}

exports.extractAccountData = extractAccountData;
