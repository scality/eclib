// launch multiple encodes/decodes in parallel

'use strict';

var ECLib = require('../node-eclib.js');
var enums = require('../eclib-enum.js');
var ECLibUtil = require('../eclib-util.js');
var buffertools = require("buffertools");
var crypto = require('crypto');
var hexdump = require('hexdump-nodejs');
var assert = require('assert');

// Number of tests that are done at any given time.
var done = 0;

function test_one(name, opts) {
  var eclib = new ECLib(opts);

  eclib.init();

  var ref_buf = crypto.randomBytes(10000000);

  process.stdout.write('.');

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

      process.stdout.write('.');

      eclib.decode(fragments, x + y, encoded_fragment_length, 0,
        function(status, out_data, out_data_length) {
          // If buffers are not equal, something bad must have happened.
          assert.equal(buffertools.compare(out_data, ref_buf), 0);

          // Free the ressources allocated for erasure coding.
          eclib.destroy();

          // Node is single threaded so this is safe to do.
          done += 1;
          process.stdout.write('.');
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

// TODO: why is this off ?
//test_one("null", {"bc_id": enums.BackendId["EC_BACKEND_NULL"], "k": 8, "m": 4});

var tests = [{
  name: "xor",
  options: {
    "bc_id": enums.BackendId["EC_BACKEND_FLAT_XOR_HD"],
    "k": 3,
    "m": 3,
    "hd": 3
  },
}, {
  name: "vand",
  options: {
    "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_VAND"],
    "k": 10,
    "m": 4,
    "w": 16,
    "hd": 5
  }
}, {
  name: "vand_44",
  options: {
    "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_VAND"],
    "k": 4,
    "m": 4,
    "w": 16,
    "hd": 5
  }
}, {
  name: "vand_48",
  options: {
    "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_VAND"],
    "k": 4,
    "m": 8,
    "w": 16,
    "hd": 9
  }
}, {
  name: "vand_1010",
  options: {
    "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_VAND"],
    "k": 10,
    "m": 10,
    "w": 16,
    "hd": 11
  }
}, {
  name: "cauchy",
  options: {
    "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_CAUCHY"],
    "k": 10,
    "m": 4,
    "w": 4,
    "hd": 5
  }
}, {
  name: "cauchy_44",
  options: {
    "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_CAUCHY"],
    "k": 4,
    "m": 4,
    "w": 4,
    "hd": 5
  }
}, {
  name: "cauchy_48",
  options: {
    "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_CAUCHY"],
    "k": 4,
    "m": 8,
    "w": 8,
    "hd": 9
  }
}, {
  name: "cauchy_1010",
  options: {
    "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_CAUCHY"],
    "k": 10,
    "m": 10,
    "w": 8,
    "hd": 11
  }
}];

function monitorState() {
  if (done < tests.length) {
    setImmediate(monitorState);
  } else {
    console.log(' done');
  }
}
monitorState();

process.stdout.write('algorithms: ');
tests.forEach(function(test, i) {
  test_one(test.name, test.options);
})

// The tests with ISA require an additional library. They are disabled for now because of this.

// test_one("isa_l", {"bc_id": enums.BackendId["EC_BACKEND_ISA_L_RS_VAND"], "k": 10, "m": 4, "w": 8, "hd": 5});
// test_one("isa_l_44", {"bc_id": enums.BackendId["EC_BACKEND_ISA_L_RS_VAND"], "k": 4, "m": 4, "w": 8, "hd": 5});
// test_one("isa_l_1010", {"bc_id": enums.BackendId["EC_BACKEND_ISA_L_RS_VAND"], "k": 10, "m": 10, "w": 8, "hd": 11});
