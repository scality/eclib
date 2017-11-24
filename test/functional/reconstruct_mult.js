'use strict';

const eclib = require('../../index');
const enums = eclib.enums;
const ECLibUtil = eclib.util;
const crypto = require('crypto');
const assert = require('assert');

const ec = new eclib({
  "bc_id": enums.BackendId["EC_BACKEND_FLAT_XOR_HD"],
  "k": 3,
  "m": 3,
  "hd": 3
});

ec.init();

const dataSize = 1024 * 1024;
const data = crypto.randomBytes(dataSize);

describe('reconstruct multiple fragments:', function(done) {

it('shall be OK', function(done) {
ec.encode(data, function(status, dataFragments, parityFragments, fragmentLength) {
    assert.equal(status, 0);

    const allFragments = dataFragments.concat(parityFragments);
    // Lose 3 fragments, 2 of which are data. We should be able to still
    // recover the data.
    const missing_frags_indx = [1, 0, 5];
    // decreasing ordered
    missing_frags_indx.sort(function(a, b){
        return (b - a);
    });
    // backup missing fragments
    const orig_missing_frags = [allFragments[missing_frags_indx[0]]];
    let idx;
    for (idx = 1; idx < missing_frags_indx.length; idx++){
        orig_missing_frags.push(allFragments[missing_frags_indx[idx]]);
    }
    // remove missing fragments
    for (idx = 0; idx < missing_frags_indx.length; idx++){
        allFragments.splice(missing_frags_indx[idx], 1);
    }

    ec.reconstruct(allFragments, [0, 5, 1], function(err, newAllFragments) {
        assert.equal(err, null);
        // check reconstructed fragments and original ones
        for (idx = 0; idx < missing_frags_indx.length; idx++){
            assert.equal(Buffer.compare(orig_missing_frags[idx], newAllFragments[missing_frags_indx[idx]]), 0);
        }

        ec.decode(newAllFragments, false, function(status, decoded_data) {
            // check that the decoded data is like the initial one
            assert.equal(Buffer.compare(data, decoded_data), 0);

            done();
        });
    });
});
});
});
