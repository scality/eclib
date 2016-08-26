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


#include <nan.h>

#include "libmain.h"
#include "asyncencode.h"
#include "asyncdecode.h"
#include "asyncreconstruction.h"

NAN_MODULE_INIT(Init) {
  NAN_EXPORT(target, EclCreate);
  NAN_EXPORT(target, EclDestroy);
  NAN_EXPORT(target, EclEncode);
  NAN_EXPORT(target, EclEncodeV);
  NAN_EXPORT(target, EclDecode);
  NAN_EXPORT(target, EclReconstructFragment);
  NAN_EXPORT(target, EclFragmentsNeeded);
  NAN_EXPORT(target, EclGetFragmentMetadata);
  NAN_EXPORT(target, EclIsInvalidFragment);
  NAN_EXPORT(target, EclVerifyStripeMetadata);
  NAN_EXPORT(target, EclGetAlignedDataSize);
  NAN_EXPORT(target, EclGetMinimumEncodeSize);
  NAN_EXPORT(target, EclGetFragmentSize);
  NAN_EXPORT(target, EclAddFragmentHeader);
}

NODE_MODULE(node_eclib, Init)
