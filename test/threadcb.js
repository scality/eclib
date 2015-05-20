// Just trying to do the manual checking of the method existenance 
// Will remove the file when we can communicate with the real libarary 
// and can add the mocha test files.

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
    desc = eclib.init();
    var foo = 42;

    eclib.testpad(42, function (param) {
	console.log("foo=" + foo);
        console.log(done); // Should not be undefined, should be false
        done = true;
	   console.log("CALLBACK! " + param);
    });
    var i = 0;
    
    var work = function(dosomestuff) {
        console.log("dosomestuff in JS "+ (i++));
        if (!done)
            	process.nextTick(work);
    }
    work();
    console.log("out " + done);
    console.log("END");
}

//EC_BACKEND_NULL
//EC_BACKEND_JERASURE_RS_VAND
//EC_BACKEND_JERASURE_RS_CAUCHY
//EC_BACKEND_FLAT_XOR_HD
//EC_BACKEND_ISA_L_RS_VAND
//EC_BACKEND_SHSS
//EC_BACKEND_ISA_L_RS_CAUCHY

test_one({
    "bc_id": enums.BackendId["EC_BACKEND_FLAT_XOR_HD"],
    "k": 3,
    "m": 3,
    "hd": 3
});

//global.gc(); //requires --expose-gc
