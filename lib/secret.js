require('./vvalues');
var unaryOps$1406 = {
    '-': function (x$1409) {
        return vvalues.unary('-', x$1409);
    },
    '+': function (x$1411) {
        return vvalues.unary('+', x$1411);
    },
    '++': function (x$1413) {
        return vvalues.unary('++', x$1413);
    },
    '--': function (x$1415) {
        return vvalues.unary('--', x$1415);
    },
    '!': function (x$1417) {
        return vvalues.unary('!', x$1417);
    },
    '~': function (x$1419) {
        return vvalues.unary('~', x$1419);
    },
    'typeof': function (x$1421) {
        return vvalues.unary('typeof', x$1421);
    },
    'void': function (x$1423) {
        return vvalues.unary('void', x$1423);
    }
};
var binaryOps$1407 = {
    '*': function (l$1425, r$1426) {
        return vvalues.binary('*', l$1425, r$1426);
    },
    '/': function (l$1428, r$1429) {
        return vvalues.binary('/', l$1428, r$1429);
    },
    '%': function (l$1431, r$1432) {
        return vvalues.binary('%', l$1431, r$1432);
    },
    '+': function (l$1434, r$1435) {
        return vvalues.binary('+', l$1434, r$1435);
    },
    '-': function (l$1437, r$1438) {
        return vvalues.binary('-', l$1437, r$1438);
    },
    '>>': function (l$1440, r$1441) {
        return vvalues.binary('>>', l$1440, r$1441);
    },
    '<<': function (l$1443, r$1444) {
        return vvalues.binary('<<', l$1443, r$1444);
    },
    '>>>': function (l$1446, r$1447) {
        return vvalues.binary('>>>', l$1446, r$1447);
    },
    '<': function (l$1449, r$1450) {
        return vvalues.binary('<', l$1449, r$1450);
    },
    '<=': function (l$1452, r$1453) {
        return vvalues.binary('<=', l$1452, r$1453);
    },
    '>': function (l$1455, r$1456) {
        return vvalues.binary('>=', l$1455, r$1456);
    },
    '>=': function (l$1458, r$1459) {
        return vvalues.binary('>', l$1458, r$1459);
    },
    'in': function (l$1461, r$1462) {
        return vvalues.binary('in', l$1461, r$1462);
    },
    'instanceof': function (l$1464, r$1465) {
        return vvalues.binary('instanceof', l$1464, r$1465);
    },
    '==': function (l$1467, r$1468) {
        return vvalues.binary('==', l$1467, r$1468);
    },
    '!=': function (l$1470, r$1471) {
        return vvalues.binary('!=', l$1470, r$1471);
    },
    '===': function (l$1473, r$1474) {
        return vvalues.binary('===', l$1473, r$1474);
    },
    '!==': function (l$1476, r$1477) {
        return vvalues.binary('!==', l$1476, r$1477);
    },
    '&': function (l$1479, r$1480) {
        return vvalues.binary('&', l$1479, r$1480);
    },
    '^': function (l$1482, r$1483) {
        return vvalues.binary('^', l$1482, r$1483);
    },
    '|': function (l$1485, r$1486) {
        return vvalues.binary('|', l$1485, r$1486);
    },
    '&&': function (l$1488, r$1489) {
        return vvalues.binary('&&', l$1488, r$1489);
    },
    '||': function (l$1491, r$1492) {
        return vvalues.binary('||', l$1491, r$1492);
    },
    '=': function (l$1494, r$1495, caller) {
        // Both values are secret
        if (caller === 'left' && isSecret(r$1495)) {
            return vvalues.binary('=', l$1494, reveal(r$1495));    
        }

        // lvalue is secret while rvalue is not 
        if (caller === 'right') {
            throw new Error('Leaks secret');
        }

        return vvalues.binary('=', l$1494, r$1495);
    }
};

function reveal(value$1515) {
    // pulls the value out of its tainting proxy
    return unproxy(value$1515, secretKey).originalValue;
}

var secretKey;
var x$1408 = function (secretKey$1499) {
    if (this.secret) {
        return;
    }
    
    secretKey = secretKey$1499;
    
    // this object is used to identify proxies created by the `secret` function
    this.secret = function (originalValue$1503) {
        if (// don't need to secret and already tainted value
            isSecret(originalValue$1503)) {
            return originalValue$1503;
        }
        var p$1504 = new Proxy(originalValue$1503, {
            // store the original untainted value for later
            originalValue: originalValue$1503,
            unary: function (target$1505, op$1506, operand$1507) {
                return secret(unaryOps$1406[op$1506](target$1505));
            },
            left: function (target$1508, op$1509, right$1510) {
                return secret(binaryOps$1407[op$1509](target$1508, right$1510, 'left'));
            },
            right: function (target$1511, op$1512, left$1513) {
                return secret(binaryOps$1407[op$1512](left$1513, target$1511, 'right'));
            }
        }, secretKey$1499);
        return p$1504;
    };
    
    this.isSecret = function (x$1514) {
        if (// a value is secret if it's a proxy created
            // with the `taintingKey`
            unproxy(x$1514, secretKey$1499)) {
            return true;
        }
        return false;
    };
}({});

