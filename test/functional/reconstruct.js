'use strict';

var ECLib = require('../../node-eclib.js');
var enums = require('../../eclib-enum.js');
var ECLibUtil = require('../../eclib-util.js');
var buffertools = require("buffertools");
var crypto = require('crypto');
var hexdump = require('hexdump-nodejs');
var assert = require('assert');

//var ec = new ECLib({
//  "bc_id": enums.BackendId["EC_BACKEND_FLAT_XOR_HD"],
//  "k": 3,
//  "m": 3,
//  "hd": 3
//});

var ec = new ECLib({
    "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_VAND"],
    "k": 10,
    "m": 4,
    "w": 16,
    "hd": 5
});
ec.init();

var data = new Buffer("Hello world of Rust ! This is some serious decoding !");

describe('reconstruct', function(done) {
    it('shall be OK', function(done) {
        ec.encode(data, function(status, dataFragments, parityFragments, fragmentLength) {
            assert.equal(status, 0);

            var allFragments = dataFragments.concat(parityFragments);

            // Lose the 3rd fragment (index 2). This should allow for reconstruction.
            var missing_fragment_id = 2;
            var original_missed_fragment = allFragments[missing_fragment_id];
            allFragments.splice(missing_fragment_id, 1);

            ec.reconstructFragment(allFragments, missing_fragment_id, function(err, missing_fragment) {
                assert.equal(err, null);
                assert.equal(Buffer.compare(original_missed_fragment, missing_fragment), 0);

                // Insert the missing fragment.
                allFragments.splice(2, 0, missing_fragment);

                ec.decode(allFragments, allFragments.length, fragmentLength, false, function(status, decoded_data) {
                    // check that the decoded data is like the initial one
                    assert.equal(Buffer.compare(data, decoded_data), 0);

                    // test error callback
                    // Lose first missing_fragments_data_loss fragments that don't allow for reconstruction
                    //  missing_fragments_data_loss = m + 1 for MDS codes, = n - 1 for XOR codes
                    var missing_fragments_data_loss = parityFragments.length + 1

                    allFragments.splice(0, missing_fragments_data_loss);
                    ec.reconstructFragment(allFragments, 0, function(err) {
                        assert.notEqual(err, null);

                        function gb(n) {
                            var b = [];
                            for (var i = 0; i < n; i++) {
                                b.push(new Buffer(crypto.randomBytes(32)));
                            }
                            return b;
                        }
                        ec.reconstructFragment(gb(dataFragments.length + parityFragments.length), 0, function(err) {
                            assert.notEqual(err, null);
                            ec.destroy();
                            done();
                        });
                    });
                });
            });
        });
    });
});
