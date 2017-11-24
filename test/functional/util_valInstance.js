'use strict';

const eclib = require('../../index');
const enums = eclib.enums;
const util = eclib.util;
const assert = require('assert');

const Eclib = new eclib({
    bc_id: enums.BackendId["EC_BACKEND_JERASURE_RS_VAND"],
    k: 10,
    m: 4,
    w: 16,
    hd: 5
});

Eclib.init();

describe('Assess instance validation', function assess(done) {
    it('should be valid', function shouldValid() {
        assert(util.validateInstance(Eclib.opt));
    });
    it('should be invalid', function shouldInvalid() {
        assert.equal(util.validateInstance({bc_id: 'tata'}), false);
    });
});
