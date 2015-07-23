// long test

var ECLib = require('../node-eclib.js');
var enums = require('../eclib-enum.js');
var ECLibUtil = require('../eclib-util.js');
var buffertools = require("buffertools");
var crypto = require('crypto');
var hexdump = require('hexdump-nodejs');

console.log("ECLib testing");

var COUNT = 100; //per batch
var N_BATCHES = 10;

var eclib = new ECLib({
  "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_CAUCHY"],
  "k": 10,
  "m": 4,
  "w": 4,
  "hd": 5
});

eclib.init();

function do_it() {

  var do_it_count = 0;

  function batch() {

    var batch_count = 0;

    function test_one(num) {
      console.log("create " + num);

      var ref_buf = new Buffer(1000000);
      buffertools.fill(ref_buf, 'z');
      //var ref_buf = crypto.randomBytes(1000000);

      eclib.encode(ref_buf,
        function(status, encoded_data, encoded_parity,
          encoded_fragment_length) {
          console.log(num + " Encode Done status=" + status +
            " fragment_length=" + encoded_fragment_length);

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
              console.log(num + " Decode Done status=" + status +
                " data_length=" + out_data_length);

              //console.log(hexdump(out_data));

              if (buffertools.compare(out_data, ref_buf) == 0)
                console.log(num + " OK Buffers are identical");
              else
                console.log(num + " Nok buffers differ");

              batch_count++;
            }
          );
        }
      );
    }

    var i = 0;
    for (i = 0; i < COUNT; i++) {
      test_one(i);
    }

    var i = 0;
    var work = function(dosomestuff) {
      if (batch_count < COUNT) {
        //process.nextTick(work);
        setImmediate(work);
      } else {
        console.log("BATCH DONE " + batch_count);
        do_it_count++;
        batch();
      }
    }
    work();
  }

  var work2 = function(dosomestuff2) {
      if (do_it_count < N_BATCHES) {
        process.nextTick(work2);
      } else {
        console.log("ALL BATCHES DONE");
      }
    }
    //work2();

  batch();
}

do_it();
