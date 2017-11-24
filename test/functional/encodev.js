// test encodev

'use strict';

const eclib = require('../../index');
const enums = eclib.enums;
const ECLibUtil = eclib.util;
const crypto = require('crypto');
const assert = require('assert');

function test_one(name, opts, done) {
  const Eclib = new eclib(opts);
  Eclib.init();

  const sz1 = 123434;
  const sz2 = 343434;
  const ref_buf1 = crypto.randomBytes(sz1);
  const ref_buf2 = crypto.randomBytes(sz2);
  const ref_buf = Buffer.concat([ref_buf1, ref_buf2], sz1 + sz2);
  const buf_array = [ref_buf1, ref_buf2];

  Eclib.encodev(buf_array, function encodevTest(status, encoded_data,
              encoded_parity, encoded_fragment_length) {
      const k = Eclib.opt.k;
      const m = Eclib.opt.m;

      const x = k - 1; //available data fragments
      const y = m; //available parity fragments

      const fragments = [];
      let i, j = 0;
      for (i = 0; i < x; i++) {
        fragments[j++] = encoded_data[i];
      }
      for (i = 0; i < y; i++) {
        fragments[j++] = encoded_parity[i];
      }

      Eclib.decode(fragments,  0,
        function(status, out_data, out_data_length) {
          assert.equal(Buffer.compare(out_data, ref_buf), 0);
          Eclib.destroy();
          done();
        }
      );
    }
  );
}

describe('EncodeV', function() {
    it('buffers should be equal', function(done) {
        test_one("xor", {
            "bc_id": enums.BackendId["EC_BACKEND_FLAT_XOR_HD"],
            "k": 3,
            "m": 3,
            "hd": 3
        }, done);
    });
});
