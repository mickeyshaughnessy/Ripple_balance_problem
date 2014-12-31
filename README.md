Ripple_balance_problem
======================

Ripple Labs interview question

This script allows users to query the XRP and IOU balances in ripple accounts.

##Installation

**Via git and npm for Node.js**

```
  $ git clone https://github.com/mickeyshaughnessy/Ripple_balance_problem 
  $ npm install
```

## Use

```
  $ node get_balances.js
```

Then, navigate a web browser to localhost:8080 and input the account numbers
in comma separated form. Then, hit submit.

The accounts and XRP balances are displayed. 

The script requires the express, events, body parser and ripple-lib libraries. 


