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

const eclib = require('../../index');
const enums = eclib.enums;
const ECLibUtil = eclib.util;
const crypto = require('crypto');
const assert = require('assert');

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var randIndex = Math.floor(Math.random() * i);
        var randIndexVal = array[randIndex];
        array[randIndex] = array[i];
        array[i] = randIndexVal;
    }
    return array;
}

function getRandIdx(len, nb) {
    var array = [];
    for (var idx = 0; idx < len; idx++) {
        array.push(idx);
    }
    return shuffle(array).slice(0, nb);
}

function do_one_encode_decode_repair(batch_num, num, __done) {
  const ref_buf = Buffer.alloc(1000000, 'z');

  Eclib.encode(ref_buf,
    function(status, encoded_data, encoded_parity, encoded_fragment_length) {
      const k = Eclib.opt.k;
      const m = Eclib.opt.m;

      const lost_frags_idx = getRandIdx(k + m, m);
      const fragments = [];
      let i, j;
      j = 0;
      for (i = 0; i < k; i++) {
        if (lost_frags_idx.indexOf(i) === -1) {
          fragments[j++] = encoded_data[i];
        }
      }
      for (i = 0; i < m; i++) {
        if (lost_frags_idx.indexOf(i + k) === -1) {
          fragments[j++] = encoded_parity[i];
        }
      }

      Eclib.decode(fragments, 0,
        function(status, out_data, out_data_length) {
          assert.equal(Buffer.compare(out_data, ref_buf), 0);
          Eclib.reconstruct(fragments, lost_frags_idx, function(err, all_frags) {
            lost_frags_idx.forEach(function(idx) {
                if (idx < k) {
                    assert.equal(Buffer.compare(encoded_data[idx],
                        all_frags[idx]), 0);
                } else {
                    assert.equal(Buffer.compare(encoded_parity[idx - k],
                        all_frags[idx]), 0);
                }
            });
            __done();
          });
        }
      );
    }
  );
}

// Do one batch of encode/decode steps.
//
// When this batch is done, the next one will be triggered.
function do_one_batch(num, __done) {
  let num_steps_done = 0;

  let i;
  for (i = 0; i < COUNT; i++) {
    do_one_encode_decode_repair(num, i, function() {
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
const COUNT = 100;
// Number of batches
const N_BATCHES = 20;

// Do all batches, starting with the 1st batch.
let _done = false;

const Eclib = new eclib({
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
  // We'll allow memory to increase a bit (1.7) but if it increases more, we'll consider
  // that to be a memory leak.
  assert.equal(getHeapUsage() <= initialHeapUsage * 1.7, true,
    'heap usage has increased too much, it looks like there is a memory leak');

  // If the batches are not done yet done, we'll continue monitoring.
  if (!_done) {
    setImmediate(function() {
      monitorHeapUsage(initialHeapUsage);
    });
  }
}

monitorHeapUsage(getHeapUsage());


describe('memleaks', function(done) {
    this.timeout(60000);
    it('heap shall not increase by more than x1.7 during this long test', function(done) {
        do_batches(0, function() {
            _done = true;
            done();
        });
    });
});
