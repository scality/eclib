/** Copyright (c) 2015, Scality
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
var ECLibUtil = require("./eclib-util.js");
var enums = require("./eclib-enum.js");
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
    var d_options = {
        "bc_id": 0,
        "k": 8,
        "m": 4,
        "w": 0,
        "hd": 0,
        "ct": 0
    };

    this.opt = {};
    __.extend(this.opt, d_options);

    if (__.size(opts) > 0) {
        __.extend(this.opt, opts);
    }

    this.ins_id = null;
    this.eclibUtil = new ECLibUtil();
    this.isValidInstance = function() {
        return (!__.isUndefined(this.ins_id));
    };

    this.resetOptions = function() {
        this.opt = null;
        __.extend(this.opt, d_options);
    };
}

ECLib.prototype = {
    /**
     * This creates a new instance, using the options set at construction
     * @param {Function} [callback] - callback(eclib, instanceId, error)
     */
    init: function(callback) {
        var instance_descriptor_id = -1;
        var err = {};
        var o = this.opt;
        if (this.eclibUtil.validateInstanceCreateParams(o.bc_id, o.k,
                    o.m, o.w, o.hd, o.ct)) {
            instance_descriptor_id = addon.EclCreate(o.bc_id, o.k, o.m, o.w,
                    o.hd, o.ct);

            if (instance_descriptor_id <= 0) {
                err.errorcode = instance_descriptor_id;
                err.message = this.eclibUtil
                    .getErrorMessage(instance_descriptor_id);
            } else {
                this.ins_id = instance_descriptor_id;
            }

        } else {
            err.errorcode = enums.ErrorCode.EINVALIDPARAMS;
            err.message = this.eclibUtil.getErrorMessage(err.errorcode);
            instance_descriptor_id = err.errorcode;
        }

        if (!callback) {
            return instance_descriptor_id;
        }

        callback.call(err, this, instance_descriptor_id);
    },

    /**
     * This destroys the current instance.
     * @param {Function} [callback] - callback(eclib, resultCode, err)
     */
    destroy: function(callback) {

        var resultcode = enums.ErrorCode.EBACKENDNOTAVAIL;
        var err = {};

        if (this.isValidInstance()) {
            resultcode = addon.EclDestroy(this.ins_id);
            if (resultcode !== 0) {
                err.errorcode = resultcode;
                err.message = this.eclibUtil.getErrorMessage(resultcode);
            }
        } else {
            err.errorcode = resultcode;
            err.message = this.eclibUtil.getErrorMessage(resultcode);
        }

        if (!callback) {
            return resultcode;
        }

        callback.call(this, resultcode, err);

    },

    /**
     * This encodes the data.
     * @param {Buffer} data - The data to be encoded
     * @param {Function} callback - callback(status, encodedDataArray,
     *      encodedParityArray, encodedFragmentLen)
     */
    encode: function(o_data, callback) {
        var o = this.opt;

        addon.EclEncode(this.ins_id, o.k, o.m, o_data, o_data.length, callback);
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
    decode: function(d_data, metadataCheck, callback) {
        addon.EclDecode(this.ins_id, d_data, d_data.length, d_data[0].length,
                metadataCheck, callback);
    },

    /**
     * Reconstruct a missing fragment.
     * @param {Buffer[]} availFragments - Fragments available for reconstruction
     * @param {Number} fragmentId - Missing fragment id
     * @param {Function} callback - (err, reconstructedFragment)
     */
    reconstructFragment: function(avail_fragments, missing_fragment_id, callback) {
        if (!avail_fragments.length) {
            callback(new Error('invalid number of available fragments (must be > 0)'), null);
            return;
        }
        addon.EclReconstructFragment(
            this.ins_id,
            avail_fragments,
            avail_fragments.length,
            avail_fragments[0].length,
            missing_fragment_id,
            callback
        );
    },

    /**
     * Reconstruct missing fragments.
     * @param {Buffer[]} availFragments - Fragments available for reconstruction
     * @param {Number} fragmentIds - Missing fragment ids
     * @param {Function} callback - (err, allFragments)
     */
    reconstruct: function(avail_fragments, missing_fragment_ids, callback) {
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

        missing_fragment_ids.sort();

        // Recover all missing fragments one by one.
        missing_fragment_ids.forEach(function reconstructEach(id) {
            this.reconstructFragment(avail_fragments, id,
                    function recon(err, fragment) {
                        if (err) { callback(err); }
                        avail_fragments.splice(id, 0, fragment);
                        if (++done === missing_fragment_ids.length) {
                            callback(null, avail_fragments);
                        }
                    });
        }.bind(this));
    },

    getFragmentMetadata: function(fragment, fragment_metadata, callback) {
        // TODO: what is this function supposed to do ?
    },

    setOptions: function(opts){
        __.extend(this.opt,opts);
    }
}

module.exports = ECLib;
