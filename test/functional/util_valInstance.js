'use strict';

var eclib = require('../../index');
var enums = eclib.enums;
var util = eclib.util;
var assert = require('assert');

var Eclib = new eclib({
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
