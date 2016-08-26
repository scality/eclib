/* Copyright (c) 2015, Scality
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var addon = require('bindings')('Release/node-eclib.node')
var util = require("./eclib-util");
var enums = require("./eclib-enum");
var __ = require('underscore');

/**
 * This represents our interface with the erasure coding layer.
 * @constructor
 * @param {Object} [opts] - Contains options used by the library
 * @param {Number} [opts.bc_id=0] - Backend ID
 * @param {Number} [opts.k=8] - Number of data fragments
 * @param {Number} [opts.m=4] - Number of parity fragments
 * @param {Number} [opts.w=0] - word size (in bits)
 * @param {Number} [opts.hd=0] - hamming distance (==m for Reed-Solomon)
 * @param {Number} [opts.ct=0] - checksum type
 */
function ECLib(opts) {
    this.opt = {
        bc_id: 0,
        k: 8,
        m: 4,
        w: 0,
        hd: 0,
        ct: 0
    };
    if (opts) {
        __.extend(this.opt, opts);
    }
    this.ins_id = null;
}

ECLib.prototype = {
    /**
     * This creates a new instance, using the options set at construction
     * @param {Function} [callback] - callback(eclib, instanceId, error)
     * @returns {Number} - Instance id
     */
    init: function(callback) {
        var instance_descriptor_id = -1;
        var err = {};
        var o = this.opt;
        if (util.validateInstance(this.opt)) {
            instance_descriptor_id = addon.EclCreate(o.bc_id, o.k, o.m, o.w,
                    o.hd, o.ct);

            if (instance_descriptor_id <= 0) {
                err.errorcode = instance_descriptor_id;
                err.message = util.getErrorMessage(instance_descriptor_id);
            } else {
                this.ins_id = instance_descriptor_id;
            }

        } else {
            err.errorcode = enums.ErrorCode.EINVALIDPARAMS;
            err.message = util.getErrorMessage(err.errorcode);
            instance_descriptor_id = err.errorcode;
        }

        if (!callback) {
            return instance_descriptor_id;
        }

        callback.call(err, this, instance_descriptor_id);
    },

    isValidInstance: function() {
        return (!__.isUndefined(this.ins_id));
    },

    /**
     * This destroys the current instance.
     * @param {Function} [callback] - callback(eclib, resultCode, err)
     * @returns {Number} - Result code
     */
    destroy: function(callback) {
        var err = null;
        if (this.isValidInstance()) {
            var resultcode = addon.EclDestroy(this.ins_id);
            if (resultcode !== 0) {
                err = util.getErrorMessage(resultcode);
            }
        } else {
            err = util.getErrorMessage(enums.ErrorCode.EBACKENDNOTAVAIL);
        }
        if (!callback) {
            return err;
        }
        callback.call(err, this);
    },

    /**
     * This encodes the data.
     * @param {Buffer} data - The data to be encoded
     * @param {Function} callback - callback(status, encodedDataArray,
     *      encodedParityArray, encodedFragmentLen)
     */
    encode: function(data, callback) {
        var o = this.opt;

        addon.EclEncode(this.ins_id, o.k, o.m, data, data.length, callback);
    },

    /**
     * This encodes the data array.
     * @param {Buffer[]} bufArray - Buffers to be encoded
     * @param {Function} callback - callback(status, encodedDataArray,
     *      encodedParityArray, encodedFragmentLen)
     */
    encodev: function(bufArray, callback) {
        var o = this.opt;
        var size = bufArray.reduce(function getSize(value, buffer) {
            return value + buffer.length;
        }, 0);

        addon.EclEncodeV(this.ins_id, o.k, o.m, bufArray.length, bufArray,
                size, callback);
    },

    /**
     * This decodes the fragments array.
     * @param {Buffer[]} fragmentArray - The fragment array to decode
     * @param {Boolean} metadataCheck - Checking of the metadata
     * @param {Function} callback - (err, decodedData)
     */
    decode: function(fragmentArray, metadataCheck, callback) {
        addon.EclDecode(this.ins_id, fragmentArray, fragmentArray.length,
                fragmentArray[0].length, metadataCheck, callback);
    },

    /**
     * Reconstruct a missing fragment.
     * @param {Buffer[]} availFragments - Fragments available for reconstruction
     * @param {Number} fragmentId - Missing fragment id
     * @param {Function} callback - (err, reconstructedFragment)
     */
    reconstructFragment: function(availFragments, fragmentId, callback) {
        if (!availFragments.length) {
            callback('invalid number of available fragments (must be > 0)');
            return ;
        }
        addon.EclReconstructFragment(
            this.ins_id,
            availFragments,
            availFragments.length,
            availFragments[0].length,
            fragmentId,
            callback
        );
    },

    /**
     * Reconstruct missing fragments.
     * @param {Buffer[]} availFragments - Fragments available for reconstruction
     * @param {Number} fragmentIds - Missing fragment ids
     * @param {Function} callback - (err, allFragments)
     */
    reconstruct: function(availFragments, fragmentIds, callback) {
        // If we sort the missing indexes, than we can safely insert each
        // recoevered fragment when we have it. Example: we have 10 fragments,
        // but the 3rd, 6th and 8th are missing. If the `fragmentIds`
        // is unsorted, like [8,6,3], then we have the following
        // `availFragments`: [1,2,4,5,7,9,10]. If we first recover the 8th
        // fragment, we don't where to insert it. But if we first recover the
        // 3rd fragment, we know we can insert it at index 3, so that we then
        // have the `availFragments` set to [1,2,3,4,5,7,9,10] when we recover
        // the 6th fragment.
        var done = 0;

        fragmentIds.sort();

        // Recover all missing fragments one by one.
        fragmentIds.forEach(function reconstructEach(id) {
            this.reconstructFragment(availFragments, id,
                    function recon(err, fragment) {
                        if (err) {
                            callback(err);
                        }
                        availFragments.splice(id, 0, fragment);
                        if (++done === fragmentIds.length) {
                            callback(null, availFragments);
                            return ;
                        }
                    });
        }.bind(this));
    },

    getFragmentMetadata: function(fragment, fragment_metadata, callback) {
        // TODO: what is this function supposed to do ?
    },

    setOptions: function(opts) {
        __.extend(this.opt,opts);
    },

    resetOptions: function() {
        this.opt = {
            bc_id: 0,
            k: 8,
            m: 4,
            w: 0,
            hd: 0,
            ct: 0
        };
    },

    addFragmentHeader: function(fragment, fragment_index, object_size,
                                fragment_size) {
        return addon.EclAddFragmentHeader(this.ins_id, fragment,
            fragment_index, object_size, fragment_size, this.opt.ct, 1);
    },

    getAlignedDataSize: function(objSize) {
        return addon.EclGetAlignedDataSize(this.ins_id, objSize);
    },
}

module.exports = ECLib;
module.exports.enums = enums;
module.exports.util = util;
