require("./vvalues");

var unaryOps = {
    "-":      function(x) { return -x; },
    "+":      function(x) { return +x; },
    "++":     function(x) { return ++x; },
    "--":     function(x) { return --x; },
    "!":      function(x) { return !x; },
    "~":      function(x) { return ~x; },
    "typeof": function(x) { return typeof x; },
    "void":   function(x) { return void x; }
};

var binaryOps = {
    "*":          function(l, r) { return l * r; },
    "/":          function(l, r) { return l / r; },
    "%":          function(l, r) { return l % r; },
    "+":          function(l, r) { return l + r; },
    "-":          function(l, r) { return l - r; },
    ">>":         function(l, r) { return l >> r; },
    "<<":         function(l, r) { return l << r; },
    ">>>":        function(l, r) { return l >>> r; },
    "<":          function(l, r) { return l < r; },
    "<=":         function(l, r) { return l <= r; },
    ">":          function(l, r) { return l > r; },
    ">=":         function(l, r) { return l >= r; },
    "in":         function(l, r) { return l in r; },
    "instanceof": function(l, r) { return l instanceof r; },
    "==":         function(l, r) { return l == r; },
    "!=":         function(l, r) { return l != r; },
    "===":        function(l, r) { return l === r; },
    "!==":        function(l, r) { return l !== r; },
    "&":          function(l, r) { return l & r; },
    "^":          function(l, r) { return l ^ r; },
    "|":          function(l, r) { return l | r; },
    "&&":         function(l, r) { return l && r; },
    "||":         function(l, r) { return l || r; },
    "=":          function(l, r) { if (x.isSecret(r) && !x.isSecret(l)) { throw Error("Leaking Secret"); } return l = r; }
};

var x = function (secretKey) {
    if (this.secret) {
        return;
    }

    // this object is used to identify proxies created by the `secret` function
    this.secret = function (originalValue) {
        // don't need to secret and already tainted value
        if (x.isSecret(originalValue)) {
            return originalValue;
        }

        var p = new Proxy(originalValue, {
            // store the original untainted value for later
            originalValue: originalValue,

            unary: function(target, op, operand) {
                return secret(unaryOps[op](target));
            },

            left: function(target, op, right) {
                return secret(binaryOps[op](target, right));
            },

            right: function(target, op, left) {
                return secret(binaryOps[op](left, target));
            }
        }, secretKey);
        return p;
    }

    this.isSecret = function (x) {
        // a value is secret if it's a proxy created
        // with the `taintingKey`
        if (unproxy(x, secretKey)) {
            return true;
        }
        return false;
    }

    this.unveil = function (value) {
        if (isSecret(value)) {
            // pulls the value out of its tainting proxy
            return unproxy(value, secretKey).originalValue;
        }
        return value;
    }
}({});

/** end tainting extension code **/
