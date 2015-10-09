/** Copyright (c) 2015, Scality * All rights reserved.
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

var enums = require("./eclib-enum.js");

function ECLibUtil() {
    this.isInt = function(n) {
        return typeof n === 'number' && n % 1 == 0;
    }
}

ECLibUtil.prototype.getErrorMessage = function(errorcode) {
    var errornumber = enums.ErrorCode;
    var message = null;

    switch (errorcode) {
        case -errornumber.EBACKENDNOTSUPP:
            message = "Backend not supported";
            break;

        case -errornumber.EECMETHODNOTIMPL:
            message = "No method implemented";
            break;

        case -errornumber.EBACKENDINITERR:
            message = "Backend instance is terminated";
            break;

        case -errornumber.EBACKENDINUSE:
            message = "Backend instance is in use";
            break;

        case -errornumber.EBACKENDNOTAVAIL:
            message = "Backend instance not found";
            break;

        case -errornumber.EBADCHKSUM:
            message = "Fragment integrity check failed";
            break;

        case -errornumber.EINVALIDPARAMS:
            message = "Invalid arguments";
            break;

        case -errornumber.EBADHEADER:
            message = "Fragment integrity check failed";
            break;

        case -errornumber.EINSUFFFRAGS:
            message = "Insufficient number of fragments";
            break;

        default:
            message = "Unknown error";
            break;
    }

    return message;
};

ECLibUtil.prototype.validateInstanceCreateParams = function(ec_backend_id, k, m,
    w, hd, ct) {

    var retvalue = true;
    var argslength = arguments.length;

    retvalue = (argslength == 6);

    while (retvalue && (argslength > 0)) {
        retvalue = retvalue && this.isInt(arguments[argslength - 1]);
        argslength--;
    }

    return retvalue;
};

ECLibUtil.prototype.validateEncodeParams = function(ec_id, orig_data,
    deta_length, callback) {

    var retvalue = true;
    var argslength = arguments.length;

    retvalue = (argslength == 4);
    retvalue = retvalue && this.isInt(arguments[0]);
    retvalue = retvalue && this.isInt(arguments[2]);
    retvalue = retvalue && (orig_data !== undefined) && Buffer.isBuffer(orig_data);
    // Will check whether the callback is a method or not
    //retvalue = retvalue && Buffer.isBuffer(orig_data);

    return retvalue;
};

module.exports = ECLibUtil;
