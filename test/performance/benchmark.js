'use strict';

var ECLib = require('../../index');
var enums = ECLib.enums;
var ECLibUtil = ECLib.utils;
var buffertools = require("buffertools");
var crypto = require('crypto');
var assert = require('assert');

// Number of tests that are done at any given time.
var _done = 0;
var KB = 1024;
var MB = KB * KB;

var k = 6;
var m = 3;
var w = 16;

var objSize = 2 * MB;
var objSizeMB = objSize / MB;
var obj = crypto.randomBytes(objSize);

var bmNb = 1e3;

function getHrTime(start) {
    var end = process.hrtime(start);
    return (end[0] + end[1] / 1e9);
}

function encode(name, opts, done) {
    var eclib = new ECLib(opts);
    eclib.init();
    var count = 0;

    var start = process.hrtime();
    for (var idx = 0; idx < bmNb; idx++) {
        process.nextTick(function ft() {
            eclib.encode(obj, function(status) {
                count++;
                if (count === bmNb) {
                    var elapsedTime = getHrTime(start);
                    console.log('Average encoding throughput (MB/s)',
                        objSizeMB * bmNb / elapsedTime);
                    eclib.destroy();
                    return done();
                }
            });
        });
    }
}

var tests = [{
    name: "xor",
    options: {
        "bc_id": enums.BackendId["EC_BACKEND_FLAT_XOR_HD"],
        "k": 6,
        "m": 5,
        "hd": 4,
    },
}, {
    name: "Jerasure-vand",
    options: {
        "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_VAND"],
        "k": k,
        "m": m,
        "w": w,
        "hd": m + 1,
    }
}, {
    name: "Jerasure-cauchy",
    options: {
        "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_CAUCHY"],
        "k": k,
        "m": m,
        "w": w,
        "hd": m + 1,
    }
// }, {
//     name: "isa-l",
//     options: {
//         "bc_id": enums.BackendId["EC_BACKEND_ISA_L_RS_VAND"],
//         "k": k,
//         "m": m,
//         "w": w,
//         "hd": m + 1,
//     }
}];

describe('FuncTest', function(done) {
    this.timeout(0);

    tests.forEach(function(test, i) {
        it(test.name, function(done) {
            encode(test.name, test.options, done);
        });
    })
});
