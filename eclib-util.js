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

const enums = require("./eclib-enum.js");

module.exports = {
    getErrorMessage: function(errorcode) {
        switch (errorcode) {
            case enums.ErrorCode.EBACKENDNOTSUPP:
                return "Backend not supported";
            case enums.ErrorCode.EECMETHODNOTIMPL:
                return "No method implemented";
            case enums.ErrorCode.EBACKENDINITERR:
                return "Backend instance is terminated";
            case enums.ErrorCode.EBACKENDINUSE:
                return "Backend instance is in use";
            case enums.ErrorCode.EBACKENDNOTAVAIL:
                return "Backend instance not found";
            case enums.ErrorCode.EBADCHKSUM:
                return "Fragment integrity check failed";
            case enums.ErrorCode.EINVALIDPARAMS:
                return "Invalid arguments";
            case enums.ErrorCode.EBADHEADER:
                return "Fragment integrity check failed";
            case enums.ErrorCode.EINSUFFFRAGS:
                return "Insufficient number of fragments";
            default:
                return "Unknown error";
        }
    },

    isInt: function(n) {
        return typeof n === 'number' && n % 1 === 0;
    },

    validateInstance: function(opts) {
        const optArray = Object.keys(opts);

        if (optArray.length !== 6) {
            return false;
        }
        return Object.keys(opts).reduce(function validate(prev, current) {
            return prev && this.isInt(opts[current]);
        }.bind(this), true)
    },
}
