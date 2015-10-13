// test that destroy is OK

'use strict';

var eclib = require('../../index');
var enums = eclib.enums;
var ECLibUtil = eclib.util;
var buffertools = require("buffertools");
var crypto = require('crypto');
var hexdump = require('hexdump-nodejs');
var assert = require('assert');

function test_one(done) {

    Eclib.encode(ref_buf, function(status, encoded_data, encoded_parity,
                                   encoded_fragment_length) {

    var k = Eclib.opt.k;
    var m = Eclib.opt.m;

    var x = k - 1; //available data fragments
    var y = m; //available parity fragments

    var fragments = [];
    var i, j;
    j = 0;
    for (i = 0; i < x; i++) {
        fragments[j++] = encoded_data[i];
    }
    for (i = 0; i < y; i++) {
        fragments[j++] = encoded_parity[i];
    }

    Eclib.decode(fragments, x + y, encoded_fragment_length, 0,
                 function(status, out_data, out_data_length) {

                     // Buffers must be equal, or else something bad happened.
                     assert.equal(buffertools.compare(out_data, ref_buf), 0);

                     Eclib.destroy(function(resultcode, err) {

                         assert(resultcode === undefined);
                         done();
                     });
                 });
    });
}

//EC_BACKEND_NULL
//EC_BACKEND_JERASURE_RS_VAND
//EC_BACKEND_JERASURE_RS_CAUCHY
//EC_BACKEND_FLAT_XOR_HD
//EC_BACKEND_ISA_L_RS_VAND
//EC_BACKEND_SHSS

var Eclib = new eclib({
    "bc_id": enums.BackendId["EC_BACKEND_FLAT_XOR_HD"],
    "k": 3,
    "m": 3,
    "hd": 3
});

var ref_buf = crypto.randomBytes(100000);

describe('DestroyTest', function(done) {

    Eclib.init();

    it('shall destroy nicely', function(done) {
        test_one(done);
    });
});
