// test encodev

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

  var sz1 = 123434;
  var sz2 = 343434;
  var ref_buf1 = crypto.randomBytes(sz1);
  var ref_buf2 = crypto.randomBytes(sz2);
  var ref_buf = buffertools.concat(ref_buf1, ref_buf2);
  var buf_array = [ref_buf1, ref_buf2];

  process.stdout.write('.');

  eclib.encodev(2, buf_array, sz1 + sz2,
    function(status, encoded_data, encoded_parity, encoded_fragment_length) {
      var k = eclib.opt.k;
      var m = eclib.opt.m;

      var x = k - 1; //available data fragments
      var y = m; //available parity fragments

      var fragments = [];
      var i, j = 0;
      for (i = 0; i < x; i++) {
        fragments[j++] = encoded_data[i];
      }
      for (i = 0; i < y; i++) {
        fragments[j++] = encoded_parity[i];
      }

      process.stdout.write('.');

      eclib.decode(fragments, x + y, encoded_fragment_length, 0,
        function(status, out_data, out_data_length) {
          assert.equal(buffertools.compare(out_data, ref_buf), 0);
          eclib.destroy();
          console.log(' done');
        }
      );
    }
  );
}

process.stdout.write('encodev: ');
test_one("xor", {
  "bc_id": enums.BackendId["EC_BACKEND_FLAT_XOR_HD"],
  "k": 3,
  "m": 3,
  "hd": 3
});