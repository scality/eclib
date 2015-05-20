// TEST PAD

var ECLib = require('../node-eclib.js');
var enums = require('../eclib-enum.js');
var ECLibUtil = require('../eclib-util.js');
var buffertools = require("buffertools");
var crypto = require('crypto');
var hexdump = require('hexdump-nodejs');

console.log("ECLib testing");

function test_one(opts) {
    var eclib = new ECLib(opts);
    var done = false;
    eclib.init();
    var foo = 42;

    eclib.testpad(42, function (param) {
	console.log("foo=" + foo);
        console.log(done); // Should not be undefined, should be false
        done = true;
	   console.log("CALLBACK! " + param);
    });
    console.log("END");
}

test_one({
    "bc_id": enums.BackendId["EC_BACKEND_FLAT_XOR_HD"],
    "k": 3,
    "m": 3,
    "hd": 3
});
