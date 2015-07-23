// launch multiple encodes/decodes in parallel

var ECLib = require('../node-eclib.js');
var enums = require('../eclib-enum.js');
var ECLibUtil = require('../eclib-util.js');
var buffertools = require("buffertools");
var crypto = require('crypto');
var hexdump = require('hexdump-nodejs');

console.log("ECLib testing");

function test_one() {
  eclib.encode(ref_buf,
    function(status, encoded_data, encoded_parity, encoded_fragment_length) {
      console.log("Encode Done status=" + status + " fragment_length=" +
        encoded_fragment_length);

      k = eclib.opt.k;
      m = eclib.opt.m;

      x = k - 1; //available data fragments
      y = m; //available parity fragments

      var fragments = [];
      var i, j;
      j = 0;
      //console.log('data:');
      for (i = 0; i < x; i++) {
        //console.log(hexdump(encoded_data[i]));
        fragments[j++] = encoded_data[i];
      }
      //console.log('codings:');
      for (i = 0; i < y; i++) {
        //console.log(hexdump(encoded_parity[i]));
        fragments[j++] = encoded_parity[i];
      }

      eclib.decode(fragments, x + y, encoded_fragment_length, 0,
        function(status, out_data, out_data_length) {
          console.log("Decode Done status=" + status + " data_length=" +
            out_data_length);

          //console.log(hexdump(out_data));

          if (buffertools.compare(out_data, ref_buf) == 0)
            console.log("OK Buffers are identical");
          else
            console.log("Nok buffers differ");
        }
      );
      console.log("Right after decode called");
    }
  );
}

var eclib = new ECLib({
  "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_VAND"],
  "k": 3,
  "m": 3,
  "hd": 3
});

eclib.init();

var ref_buf = new Buffer(500000000);
buffertools.fill(ref_buf, 'z');
//var ref_buf = crypto.randomBytes(100000);

//console.log(hexdump(ref_buf));

console.log("starting");
test_one();
test_one();
test_one();

//eclib.destroy();

//global.gc(); //requires --expose-gc
