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

'use strict';  // eslint-disable-line strict

const addon = require('./build/Release/node-eclib.node');
const util = require('./eclib-util');
const enums = require('./eclib-enum');

/**
 * This represents our interface with the erasure coding layer.
 */
class ECLib {
    /**
     * ECLib constructor
     * @constructor
     * @param {Object} [opts] - Contains options used by the library
     * @param {Number} [opts.bc_id=0] - Backend ID
     * @param {Number} [opts.k=8] - Number of data fragments
     * @param {Number} [opts.m=4] - Number of parity fragments
     * @param {Number} [opts.w=0] - word size (in bits)
     * @param {Number} [opts.hd=0] - hamming distance (==m for Reed-Solomon)
     * @param {Number} [opts.ct=0] - checksum type
     */
    constructor(opts) {
        this.opt = {
            bc_id: 0,                                   // eslint-disable-line
            k: 8,
            m: 4,
            w: 0,
            hd: 0,
            ct: 0,
        };
        if (opts) {
            Object.assign(this.opt, opts);
        }
        this.instanceID = null;
    }

    /**
     * This creates a new instance, using the options set at construction
     * @param {Function} [callback] - callback(eclib, instanceId, error)
     * @returns {Number} - Instance id
     */
    init(callback) {
        const o = this.opt;
        let instDescID = -1;
        let err = null;
        if (util.validateInstance(this.opt)) {
            // eslint-disable-next-line
            instDescID = addon.EclCreate(o.bc_id, o.k, o.m, o.w,
                    o.hd, o.ct);

            if (instDescID <= 0) {
                err = {
                    errorcode: instDescID,
                    message: util.getErrorMessage(instDescID),
                };
            } else {
                this.instanceID = instDescID;
            }
        } else {
            err = {
                errorcode: enums.ErrorCode.EINVALIDPARAMS,
                message: util.getErrorMessage(enums.ErrorCode.EINVALIDPARAMS),
            };
            instDescID = err.errorcode;
        }

        if (!callback) {
            if (instDescID < 0) {
                throw err.message;
            }
            return instDescID;
        }

        return callback(err, instDescID);
    }

    isValidInstance() {
        return !!this.instanceID;
    }

    /**
     * This destroys the current instance.
     * @param {Function} [callback] - callback(eclib, resultCode, err)
     * @returns {Number} - Result code
     */
    destroy(callback) {
        let err = null;
        if (this.isValidInstance()) {
            // eslint-disable-next-line
            const resultcode = addon.EclDestroy(this.instanceID);
            if (resultcode !== 0) {
                err = util.getErrorMessage(resultcode);
            }
        } else {
            err = util.getErrorMessage(enums.ErrorCode.EBACKENDNOTAVAIL);
        }
        if (!callback) {
            if (err) {
                throw err;
            }
            return undefined;
        }
        return callback(err);
    }

    /**
     * This encodes the data.
     * @param {Buffer} data - The data to be encoded
     * @param {Function} callback - callback(status, encodedDataArray,
     *      encodedParityArray, encodedFragmentLen)
     * @returns {undefined}
     */
    encode(data, callback) {
        const o = this.opt;

        // eslint-disable-next-line
        addon.EclEncode(this.instanceID, o.k, o.m, data, data.length, callback);
    }

    /**
     * This encodes the data array.
     * @param {Buffer[]} bufArray - Buffers to be encoded
     * @param {Function} callback - callback(status, encodedDataArray,
     *      encodedParityArray, encodedFragmentLen)
     * @returns {undefined}
     */
    encodev(bufArray, callback) {
        const o = this.opt;
        const size =
            bufArray.reduce((value, buffer) => value + buffer.length, 0);

        // eslint-disable-next-line
        addon.EclEncodeV(this.instanceID, o.k, o.m, bufArray.length, bufArray,
                size, callback);
    }

    /**
     * This decodes the fragments array.
     * @param {Buffer[]} fragmentArray - The fragment array to decode
     * @param {Boolean} metadataCheck - Checking of the metadata
     * @param {Function} callback - (err, decodedData)
     * @returns {undefined}
     */
    decode(fragmentArray, metadataCheck, callback) {
        // eslint-disable-next-line
        addon.EclDecode(this.instanceID, fragmentArray, fragmentArray.length,
                fragmentArray[0].length, metadataCheck, callback);
    }

    /**
     * Reconstruct a missing fragment.
     * @param {Buffer[]} availFragments - Fragments available for reconstruction
     * @param {Number} fragmentId - Missing fragment id
     * @param {Function} callback - (err, reconstructedFragment)
     * @returns {undefined}
     */
    reconstructFragment(availFragments, fragmentId, callback) {
        if (!availFragments.length) {
            callback('invalid number of available fragments (must be > 0)');
            return;
        }
        // eslint-disable-next-line
        addon.EclReconstructFragment(
            this.instanceID,
            availFragments,
            availFragments.length,
            availFragments[0].length,
            fragmentId,
            callback
        );
    }

    /**
     * Reconstruct missing fragments.
     * @param {Buffer[]} availFragments - Fragments available for reconstruction
     * @param {Number} fragmentIds - Missing fragment ids
     * @param {Function} callback - (err, allFragments)
     * @returns {undefined}
     */
    reconstruct(availFragments, fragmentIds, callback) {
        // If we sort the missing indexes, than we can safely insert each
        // recoevered fragment when we have it. Example: we have 10 fragments,
        // but the 3rd, 6th and 8th are missing. If the `fragmentIds`
        // is unsorted, like [8,6,3], then we have the following
        // `availFragments`: [1,2,4,5,7,9,10]. If we first recover the 8th
        // fragment, we don't where to insert it. But if we first recover the
        // 3rd fragment, we know we can insert it at index 3, so that we then
        // have the `availFragments` set to [1,2,3,4,5,7,9,10] when we recover
        // the 6th fragment.
        let done = 0;

        fragmentIds.sort((a, b) => (a - b));
        const len = fragmentIds.length;
        const recFrags = new Array(len);
        let error;
        // Recover all missing fragments one by one.
        fragmentIds.forEach((id, index) => {
            this.reconstructFragment(availFragments, id, (err, fragment) => {
                if (err) {
                    error = err;
                    return;
                }
                recFrags[index] = fragment;
                if (++done === len) {
                    if (error) {
                        callback(error);
                        return;
                    }
                    fragmentIds.forEach((fragIdx, idx) => {
                        availFragments.splice(fragIdx, 0, recFrags[idx]);
                    });
                    callback(null, availFragments);
                    return;
                }
            });
        });
    }

    // eslint-disable-next-line
    getFragmentMetadata(fragment, fragment_metadata, callback) {
        // TODO: what is this function supposed to do ?
    }

    setOptions(opts) {
        Object.assigns(this.opt, opts);
    }

    resetOptions() {
        this.opt = {
            bc_id: 0,                               // eslint-disable-line
            k: 8,
            m: 4,
            w: 0,
            hd: 0,
            ct: 0,
        };
    }
}

module.exports = ECLib;
module.exports.enums = enums;
module.exports.util = util;
