'use strict';

const eclib = require('../../index');
const enums = eclib.enums;
const ECLibUtil = eclib.util;
const crypto = require('crypto');
const assert = require('assert');

const k = 10;
const m = 4;

const ec = new eclib({
    "bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_VAND"],
    "k": k,
    "m": m,
    "w": 8,
    "hd": m + 1,
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const randIndex = Math.floor(Math.random() * i);
        const randIndexVal = array[randIndex];
        array[randIndex] = array[i];
        array[i] = randIndexVal;
    }
    return array;
}

function getRandIdx(len, nb) {
    const array = [];
    for (let idx = 0; idx < len; idx++) {
        array.push(idx);
    }
    return shuffle(array).slice(0, nb);
}

function genRandFragIndices(dataFragments, parityFragments) {
    // Lose m fragments
    const lostFragIndices = getRandIdx(k + m, m);
    const lostFragments = {};
    const availFragments = [];
    // data fragments
    for (let idx = 0; idx < k; idx++) {
        if (lostFragIndices.indexOf(idx) === -1) {
            availFragments.push(dataFragments[idx]);
        } else {
            lostFragments[idx] = dataFragments[idx];
        }
    }
    // parity fragments
    for (let idx = k; idx < k + m; idx++) {
        if (lostFragIndices.indexOf(idx) === -1) {
            availFragments.push(parityFragments[idx - k]);
        } else {
            lostFragments[idx] = parityFragments[idx - k];
        }
    }

    return {
        lostIndices: lostFragIndices,
        lostFrags: lostFragments,
        availFrags: availFragments,
    }
}

function checkReconstructMulFrags(callback) {
    const data = crypto.randomBytes(1024);

    ec.encode(data,
        (status, dataFragments, parityFragments, fragmentLength) => {
            assert.equal(status, 0);

            const indices = genRandFragIndices(dataFragments, parityFragments);

            ec.reconstruct(indices.availFrags, indices.lostIndices,
                (err, newAllFragments) => {
                    assert.equal(err, null);
                    // check reconstructed fragments and original ones
                    indices.lostIndices.forEach(function(idx) {
                        assert.equal(Buffer.compare(indices.lostFrags[idx],
                            newAllFragments[idx]), 0);
                    });

                    ec.decode(newAllFragments, false, (status, decoded) => {
                        // check that the decoded data is like the initial one
                        assert.equal(Buffer.compare(data, decoded), 0);
                        callback();
                    });
                });
        });
}

function run(func, nb, threadsNb, callback) {
    let count = 0;
    let done = 0;

    function cb() {
        done++;
        if (done === nb) {
            return callback();
        }
        if (count < nb) {
            count++;
            func(cb);
        }
    }

    for (let idx = 0; idx < threadsNb; idx++) {
        count++;
        process.nextTick(() => {
            func(cb);
        });
    }
}

describe('reconstruct multiple fragments:', function(done) {
    before('init eclib', done => ec.init(done));

    it('shall be OK', function(done) {
        const nb = 100;
        const threadsNb = 16;
        run(checkReconstructMulFrags, nb, threadsNb, done);
    });

    after('destroy eclib', done => ec.destroy(done));
});
