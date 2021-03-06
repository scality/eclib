// Long test, to check for memleaks.
//
// This check runs a series of batches of encode/decode steps.
//
// The reason we run encode/decode steps in batches is because each step
// allocates a large buffer. If we ran all steps at the same time, we'd have
// to allocate all buffers up front, essentially using all the computer's RAM.
//
// By batching, we always have sufficient RAM (~1Gb), even on slower computers.

'use strict';

var eclib = require('../../index');
var enums = eclib.enums;
var ECLibUtil = eclib.util;
var buffertools = require("buffertools");
var crypto = require('crypto');
var assert = require('assert');

function do_one_encode_decode(batch_num, num, __done) {
  // var ref_buf = crypto.randomBytes(1000000);
  var ref_buf = new Buffer(1000000);
  buffertools.fill(ref_buf, 'z');

  Eclib.encode(ref_buf,
    function(status, encoded_data, encoded_parity, encoded_fragment_length) {
      var k = Eclib.opt.k;
      var m = Eclib.opt.m;

      var x = k - 1; // available data fragments
      var y = m; // available parity fragments

      var fragments = [];
      var i, j;
      j = 0;
      for (i = 0; i < x; i++) {
        fragments[j++] = encoded_data[i];
      }
      for (i = 0; i < y; i++) {
        fragments[j++] = encoded_parity[i];
      }

      Eclib.decode(fragments, 0,
        function(status, out_data, out_data_length) {
          assert.equal(buffertools.compare(out_data, ref_buf), 0);
          __done();
        }
      );
    }
  );
}

// Do one batch of encode/decode steps.
//
// When this batch is done, the next one will be triggered.
function do_one_batch(num, __done) {
  var num_steps_done = 0;

  var i;
  for (i = 0; i < COUNT; i++) {
    do_one_encode_decode(num, i, function() {
      num_steps_done++;
    });
  }

  // Checks how many encode/decode steps have been done. When they are all
  // finished, we'll call the "__done" function, which will trigger the next
  // batch to start running.
  function checkSteps() {
    if (num_steps_done >= COUNT) {
      __done();
    } else {
      setImmediate(checkSteps);
    }
  }
  checkSteps();
}

function do_batches(num, __done) {
  // When all batches are done, we'll call the function "__done".
  if (num >= N_BATCHES) {
    __done();
  } else {
    // Not all batches have been ran. We'll call one and when its done,
    // call the next one, etc, etc.
    do_one_batch(num, function() {
      do_batches(num + 1, __done);
    });
  }
}

// Number of encodes/decodes per batch
var COUNT = 100;
// Number of batches
var N_BATCHES = 20;

var Eclib = new eclib({
  "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_CAUCHY"],
  "k": 10,
  "m": 4,
  "w": 4,
  "hd": 5
});
Eclib.init();

// Returns heap usage in MiB
function getHeapUsage() {
  return process.memoryUsage().heapUsed / 1024 / 1024;
}

// Monitor heap usage to make sure there are no mem leaks
function monitorHeapUsage(initialHeapUsage) {
  // We'll allow memory to increase a bit (1.5) but if it increases more, we'll consider
  // that to be a memory leak.
  assert.equal(getHeapUsage() <= initialHeapUsage * 1.5, true,
    'heap usage has increased too much, it looks like there is a memory leak');

  // If the batches are not done yet done, we'll continue monitoring.
  if (!_done) {
    setImmediate(function() {
      monitorHeapUsage(initialHeapUsage);
    });
  }
}

monitorHeapUsage(getHeapUsage());

// Do all batches, starting with the 1st batch.
var _done = false;

describe('memleaks', function(done) {
    this.timeout(60000);
    it('heap shall not increase by more than x1.5 during this long test', function(done) {
        do_batches(0, function() {
            _done = true;
            done();
        });
    });
});
