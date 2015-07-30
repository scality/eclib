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

    // Lose the 3rd fragment (index 2). This should allow for reconstruction.
    var missing_fragment_id = 1;
    allFragments.splice(missing_fragment_id, 1);

    ec.reconstructFragment(allFragments, 2, function(err, missing_fragment) {
        assert.equal(err, null);

        process.stdout.write('.');

        // Insert the missing fragment.
        allFragments.splice(2, 0, missing_fragment);

        ec.decode(allFragments, allFragments.length, fragmentLength, false, function(status, decoded_data) {
            // check that the decoded data is like the initial one
            assert.equal(Buffer.compare(data, decoded_data), 0);

            process.stdout.write('.');

            // test error callback
            ec.reconstructFragment([], 3, function(err) {
                assert.notEqual(err, null);
                process.stdout.write('.');

                function gb(n) {
                    var b = [];
                    for (var i = 0; i < n; i++) {
                        b.push(new Buffer(crypto.randomBytes(32)));
                    }
                    return b;
                }

                ec.reconstructFragment(gb(16), 1, function(err) {
                    process.stdout.write('.');
                    assert.notEqual(err, null);
                    ec.destroy();
                    console.log(' done');
                });
            });
        });
    });
});
