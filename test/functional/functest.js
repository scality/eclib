// launch multiple encodes/decodes in parallel

'use strict';

const ECLib = require('../../index');
const enums = ECLib.enums;
const ECLibUtil = ECLib.utils;
const crypto = require('crypto');
const assert = require('assert');

function test_one(name, opts, done) {
  const eclib = new ECLib(opts);

  eclib.init();

  const ref_buf = crypto.randomBytes(10000000);

  eclib.encode(ref_buf,
    function(status, encoded_data, encoded_parity, encoded_fragment_length) {

      const k = eclib.opt.k;
      const m = eclib.opt.m;

      const x = k - 1; //available data fragments
      const y = m; //available parity fragments

      const fragments = [];
      let i, j;
      j = 0;
      for (i = 0; i < x; i++) {
        fragments[j++] = encoded_data[i];
      }
      for (i = 0; i < y; i++) {
        fragments[j++] = encoded_parity[i];
      }

      eclib.decode(fragments, 0,
        function(status, out_data, out_data_length) {
          // If buffers are not equal, something bad must have happened.
          assert.equal(Buffer.compare(out_data, ref_buf), 0);

          // Free the ressources allocated for erasure coding.
          eclib.destroy(done);
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

const tests = [{
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
}, {
  name: "isal_48",
  options: {
    "bc_id": enums.BackendId["EC_BACKEND_ISA_L_RS_VAND"],
    "k": 4,
    "m": 8,
    "w": 8,
    "hd": 9
  }
}];

function beautifuler(options) {
    return "k=" + options["k"] + " m=" + options["m"] + " w=" + options["w"] + " hd=" + options["hd"];
}

describe('FuncTest', function(done) {
    tests.forEach(function(test, i) {
        it(test.name + " " + beautifuler(test.options), function(done) {
            test_one(test.name, test.options, done);
        });
    })
});
