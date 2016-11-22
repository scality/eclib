'use strict';

var eclib = require('../../index');
var enums = eclib.enums;
var ECLibUtil = eclib.util;
var buffertools = require("buffertools");
var crypto = require('crypto');
var assert = require('assert');

var k = 10;
var m = 5;

var ec = new eclib({
  "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_VAND"],
  "k": k,
  "m": m,
  "w": 8,
  "hd": m + 1,
  "ct": 2,
});

ec.init();

function genFrags(fragSize) {
    var arr = [];
    for (var idx = 0; idx < k; idx++) {
        arr.push(crypto.randomBytes(fragSize));
    }
    return arr;
}

var headerSize = 80;
var initHeader = new Buffer(headerSize);
buffertools.fill(initHeader, 0);

var fragSize = 256;
var objSize = k * fragSize;
var frags = genFrags(fragSize);
var data = Buffer.concat(frags, objSize);

describe('create fragment header', function(done) {
    before('add init header', function(done) {
        frags.forEach(function(frag, idx) {
            frags[idx] = Buffer.concat([initHeader, frag],
                fragSize + headerSize);
        });
        done();
    });

    it('should be OK', function(done) {
        frags.forEach(function(frag, fragIdx) {
            ec.addFragmentHeader(frag, fragIdx, objSize, fragSize);
        });

        ec.encode(data, function(status, dataFragments, parityFragments,
            fragmentLength) {
            assert.equal(status, 0);

            // check headered fragments and encoded ones
            dataFragments.forEach(function(frag, fragIdx) {
                assert.equal(buffertools.compare(frags[fragIdx], frag), 0);
            });

            done();
        });
    });
});
