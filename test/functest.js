// launch multiple encodes/decodes in parallel

'use strict';

var ECLib = require('../node-eclib.js');
var enums = require('../eclib-enum.js');
var ECLibUtil = require('../eclib-util.js');
var buffertools = require("buffertools");
var crypto = require('crypto');
var hexdump = require('hexdump-nodejs');
var assert = require('assert');

function test_one(name, opts) {
  var eclib = new ECLib(opts);

  eclib.init();

  var ref_buf = crypto.randomBytes(10000000);

  eclib.encode(ref_buf,
    function(status, encoded_data, encoded_parity, encoded_fragment_length) {

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
          // If buffers are not equal, something bad must have happened.
          assert.equal(buffertools.compare(out_data, ref_buf), 0);

          eclib.destroy();
        }
      );
    }
  );
}

//EC_BACKEND_NULL
//EC_BACKEND_JERASURE_RS_VAND
//EC_BACKEND_JERASURE_RS_CAUCHY
//EC_BACKEND_FLAT_XOR_HD
//EC_BACKEND_ISA_L_RS_VAND
//EC_BACKEND_SHSS
//EC_BACKEND_ISA_L_RS_CAUCHY

//test_one("null", {"bc_id": enums.BackendId["EC_BACKEND_NULL"], "k": 8, "m": 4});
test_one("xor", {
  "bc_id": enums.BackendId["EC_BACKEND_FLAT_XOR_HD"],
  "k": 3,
  "m": 3,
  "hd": 3
});
test_one("vand", {
  "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_VAND"],
  "k": 10,
  "m": 4,
  "w": 16,
  "hd": 5
});
test_one("vand_44", {
  "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_VAND"],
  "k": 4,
  "m": 4,
  "w": 16,
  "hd": 5
});
test_one("vand_48", {
  "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_VAND"],
  "k": 4,
  "m": 8,
  "w": 16,
  "hd": 9
});
test_one("vand_1010", {
  "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_VAND"],
  "k": 10,
  "m": 10,
  "w": 16,
  "hd": 11
});
test_one("cauchy", {
  "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_CAUCHY"],
  "k": 10,
  "m": 4,
  "w": 4,
  "hd": 5
});
test_one("cauchy_44", {
  "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_CAUCHY"],
  "k": 4,
  "m": 4,
  "w": 4,
  "hd": 5
});
test_one("cauchy_48", {
  "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_CAUCHY"],
  "k": 4,
  "m": 8,
  "w": 8,
  "hd": 9
});
test_one("cauchy_1010", {
  "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_CAUCHY"],
  "k": 10,
  "m": 10,
  "w": 8,
  "hd": 11
});
// test_one("isa_l", {"bc_id": enums.BackendId["EC_BACKEND_ISA_L_RS_VAND"], "k": 10, "m": 4, "w": 8, "hd": 5});
// test_one("isa_l_44", {"bc_id": enums.BackendId["EC_BACKEND_ISA_L_RS_VAND"], "k": 4, "m": 4, "w": 8, "hd": 5});
// test_one("isa_l_1010", {"bc_id": enums.BackendId["EC_BACKEND_ISA_L_RS_VAND"], "k": 10, "m": 10, "w": 8, "hd": 11});
