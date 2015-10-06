// test that destroy is OK

'use strict';

var ECLib = require('../../node-eclib.js');
var enums = require('../../eclib-enum.js');
var ECLibUtil = require('../../eclib-util.js');
var buffertools = require("buffertools");
var crypto = require('crypto');
var hexdump = require('hexdump-nodejs');
var assert = require('assert');

function test_one(done) {
    
    eclib.encode(ref_buf, function(status, encoded_data, encoded_parity,
				   encoded_fragment_length) {
	
	var k = eclib.opt.k;
	var m = eclib.opt.m;

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
	
	eclib.decode(fragments, x + y, encoded_fragment_length, 0, 
		     function(status, out_data, out_data_length) {

			 // Buffers must be equal, or else something bad happened.
			 assert.equal(buffertools.compare(out_data, ref_buf), 0);
			 
			 eclib.destroy(function(resultcode, err){

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

var eclib = new ECLib({
    "bc_id": enums.BackendId["EC_BACKEND_FLAT_XOR_HD"],
    "k": 3,
    "m": 3,
    "hd": 3
});

var ref_buf = crypto.randomBytes(100000);
    
describe('DestroyTest', function(done) {

    eclib.init();
    
    it('shall destroy nicely', function(done) {
	test_one(done);
    });
});
