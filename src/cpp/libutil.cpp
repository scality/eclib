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

#include "libutil.h"

// Have to rewrite the method to support more parameters
ec_args * el_create_ec_args(int k, int m, int w, int hd, ec_checksum_type_t ct){

    ec_args *result;
    result = (ec_args*)malloc( sizeof( ec_args ) );

    if(!result){

        result->k = k;
        result->m = m;
        result->w = w;
        result->hd = hd;
        result->ct = ct;
    }

    return result;
}


ec_backend_id_t get_ec_backend_id(int id){

    switch(id){
        case 0:
            return EC_BACKEND_NULL;
            break;
        case 1:
            return EC_BACKEND_JERASURE_RS_VAND;
            break;
        case 2:
            return EC_BACKEND_JERASURE_RS_CAUCHY;
            break;
        case 3:
            return EC_BACKEND_FLAT_XOR_HD;
            break;
        case 4:
            return EC_BACKEND_ISA_L_RS_VAND;
            break;
        case 5:
            return EC_BACKEND_SHSS;
            break;
        case 99:
            return EC_BACKENDS_MAX;
            break;
        default:
            return EC_BACKEND_NULL;
            break;
    }
}


ec_checksum_type_t get_ec_checksum_type(int ct){

    // main logics will be implemented here


    switch(ct){
        case 0:
            return CHKSUM_NONE;
            break;
        case 1:
            return CHKSUM_CRC32;
            break;
        case 2:
            return CHKSUM_MD5;
            break;
        case 99:
            return CHKSUM_TYPES_MAX;
            break;
        default:
            return CHKSUM_NONE;
            break;
    }

}
