'use strict';

var ECLib = require('../node-eclib.js');
var enums = require('../eclib-enum.js');
var ECLibUtil = require('../eclib-util.js');
var buffertools = require("buffertools");
var crypto = require('crypto');
var hexdump = require('hexdump-nodejs');
var assert = require('assert');

var ec = new ECLib({
  "bc_id": enums.BackendId["EC_BACKEND_FLAT_XOR_HD"],
  "k": 3,
  "m": 3,
  "hd": 3
});

ec.init();

var data = new Buffer("Hello world of Rust ! This is some serious decoding !");

process.stdout.write('reconstruct:');

ec.encode(data, function(status, dataFragments, parityFragments, fragmentLength) {
    assert.equal(status, 0);

    process.stdout.write('.');

    var allFragments = dataFragments.concat(parityFragments);

    // Lose 3 fragments, 2 of which are data. We should be able to still
    // recover the data.
    allFragments.splice(1, 1); // index 1
    allFragments.splice(1, 1); // index 2
    allFragments.splice(2, 1); // index 4

    ec.reconstruct(allFragments, [1, 4, 2], function(err, newAllFragments) {
        assert.equal(err, null);

        process.stdout.write('.');

        ec.decode(newAllFragments, newAllFragments.length, fragmentLength, false, function(status, decoded_data) {
            // check that the decoded data is like the initial one
            assert.equal(Buffer.compare(data, decoded_data), 0);

            process.stdout.write('.');
            console.log(' done');
        });
    });
});
