'use strict';

var ECLib = require('../../node-eclib.js');
var enums = require('../../eclib-enum.js');
var ECLibUtil = require('../../eclib-util.js');
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

describe('reconstruct multiple fragments:', function(done) {

it('shall be OK', function(done) {
ec.encode(data, function(status, dataFragments, parityFragments, fragmentLength) {
    assert.equal(status, 0);

    var allFragments = dataFragments.concat(parityFragments);
    // Lose 3 fragments, 2 of which are data. We should be able to still
    // recover the data.
    var missing_frags_indx = [1, 0, 5];
    // descending ordered
    missing_frags_indx.sort(function(a, b){return b-a});
    // backup missing fragments
    var orig_missing_frags = [allFragments[missing_frags_indx[0]]];
    for (var idx = 1; idx < missing_frags_indx.length; idx++){
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

        ec.decode(newAllFragments, newAllFragments.length, fragmentLength, false, function(status, decoded_data) {
            // check that the decoded data is like the initial one
            assert.equal(Buffer.compare(data, decoded_data), 0);

	    done();
        });
    });
});
});
});
