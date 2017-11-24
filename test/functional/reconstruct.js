'use strict';

const eclib = require('../../index');
const enums = eclib.enums;
const ECLibUtil = eclib.util;
const crypto = require('crypto');
const assert = require('assert');

//const ec = new ECLib({
//  "bc_id": enums.BackendId["EC_BACKEND_FLAT_XOR_HD"],
//  "k": 3,
//  "m": 3,
//  "hd": 3
//});

const Eclib = new eclib({
    "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_VAND"],
    "k": 10,
    "m": 4,
    "w": 16,
    "hd": 5
});
Eclib.init();

const data = new Buffer("Hello world of Rust ! This is some serious decoding !");

describe('reconstruct', function(done) {
    it('shall be OK', function(done) {
        Eclib.encode(data, function(status, dataFragments, parityFragments, fragmentLength) {
            assert.equal(status, 0);

            const allFragments = dataFragments.concat(parityFragments);

            // Lose the 3rd fragment (index 2). This should allow for reconstruction.
            const missing_fragment_id = 2;
            const original_missed_fragment = allFragments[missing_fragment_id];
            allFragments.splice(missing_fragment_id, 1);

            Eclib.reconstructFragment(allFragments, missing_fragment_id, function(err, missing_fragment) {
                assert.equal(err, null);
                assert.equal(Buffer.compare(original_missed_fragment, missing_fragment), 0);

                // Insert the missing fragment.
                allFragments.splice(2, 0, missing_fragment);

                Eclib.decode(allFragments, false, function(status, decoded_data) {
                    // check that the decoded data is like the initial one
                    assert.equal(Buffer.compare(data, decoded_data), 0);

                    // test error callback
                    // Lose first missing_fragments_data_loss fragments that don't allow for reconstruction
                    //  missing_fragments_data_loss = m + 1 for MDS codes, = n - 1 for XOR codes
                    const missing_fragments_data_loss = parityFragments.length + 1

                    allFragments.splice(0, missing_fragments_data_loss);
                    Eclib.reconstructFragment(allFragments, 0, function(err) {
                        assert.notEqual(err, null);

                        function gb(n) {
                            const b = [];
                            for (let i = 0; i < n; i++) {
                                b.push(new Buffer(crypto.randomBytes(32)));
                            }
                            return b;
                        }
                        Eclib.reconstructFragment(gb(dataFragments.length + parityFragments.length), 0, function(err) {
                            assert.notEqual(err, null);
                            Eclib.destroy();
                            done();
                        });
                    });
                });
            });
        });
    });
});
