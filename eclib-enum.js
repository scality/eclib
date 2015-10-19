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

module.exports = {
    BackendId: {
        "EC_BACKEND_NULL": 0,
        "EC_BACKEND_JERASURE_RS_VAND": 1,
        "EC_BACKEND_JERASURE_RS_CAUCHY": 2,
        "EC_BACKEND_FLAT_XOR_HD": 3,
        "EC_BACKEND_ISA_L_RS_VAND": 4,
        "EC_BACKEND_SHSS": 5,
        "EC_BACKENDS_MAX": 99
    },

    ChecksumType: {
        "CHKSUM_NONE": 1,
        "CHKSUM_CRC32": 2,
        "CHKSUM_MD5": 3,
        "CHKSUM_TYPES_MAX": 99
    },

    ErrorCode: {
        "EBACKENDNOTSUPP": 200,
        "EECMETHODNOTIMPL": 201,
        "EBACKENDINITERR": 202,
        "EBACKENDINUSE": 203,
        "EBACKENDNOTAVAIL": 204,
        "EBADCHKSUM": 205,
        "EINVALIDPARAMS": 206,
        "EBADHEADER": 207,
        "EINSUFFFRAGS": 208
    }
};
