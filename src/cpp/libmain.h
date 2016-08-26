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

#ifndef ECLIB_LIBMAIN_H
#define ECLIB_LIBMAIN_H

#include <nan.h>
#include <liberasurecode/erasurecode.h>
#include <liberasurecode/erasurecode_backend.h>
#include <liberasurecode/erasurecode_helpers.h>
#include <liberasurecode/erasurecode_helpers_ext.h>
extern "C" {
#include <liberasurecode/erasurecode_postprocessing.h>
}

NAN_METHOD(EclCreate);
NAN_METHOD(EclDestroy);
NAN_METHOD(EclFragmentsNeeded);
NAN_METHOD(EclGetFragmentMetadata);
NAN_METHOD(EclIsInvalidFragment);
NAN_METHOD(EclVerifyStripeMetadata);
NAN_METHOD(EclGetAlignedDataSize);
NAN_METHOD(EclGetMinimumEncodeSize);
NAN_METHOD(EclGetFragmentSize);
NAN_METHOD(EclAddFragmentHeader);

#endif /* ECLIB_LIBMAIN_H */
