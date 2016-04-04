'use strict';
require('./lib/secret');
var x$1431 = secret('x');
var y$1432 = secret('');
var z$1433 = false;
vvalues.binary('=', y$1432, x$1431);
vvalues.binary('=', z$1433, 1);
vvalues.push    //z = x;
(//z = x;
true);
if (vvalues.peek()) {
    vvalues.push(x$1431);
    if (vvalues.peek()) {
        vvalues.binary('=', z$1433, true);
    }
    vvalues.pop();
}
vvalues.pop();
console.log(z$1433);