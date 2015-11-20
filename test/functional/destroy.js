'use strict';

var eclib = require('../../index');
var buffertools = require('buffertools');
var crypto = require('crypto');
var assert = require('assert');

var ref_buf = crypto.randomBytes(100000);

var Eclib = new eclib({
    bc_id: eclib.enums.BackendId["EC_BACKEND_FLAT_XOR_HD"],
    k: 3,
    m: 3,
    hd: 3
});

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

        Eclib.decode(fragments, 0, function(status, out_data, out_data_length) {
            assert.equal(buffertools.compare(out_data, ref_buf), 0);
            Eclib.destroy(function(err, resultcode) {
                assert(resultcode === undefined);
                done();
            });
        });
    });
}

describe('DestroyTest', function assess(done) {
    Eclib.init();

    it('shall destroy nicely', function destroy(done) {
        test_one(done);
    });
});
