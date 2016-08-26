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
#include "libutil.h"

NAN_METHOD(EclCreate) {
    Nan::HandleScope scope;

    ec_args ec_args;
    ec_backend_id_t ec_backend_id;
    ec_checksum_type_t ct;

    if (info.Length() < 6) {
        Nan::ThrowTypeError("Wrong number of arguments");
        return ;
    }

    int _id = Nan::To<int>(info[0]).FromJust();
    int k = Nan::To<int>(info[1]).FromJust();
    int m = Nan::To<int>(info[2]).FromJust();
    int w = Nan::To<int>(info[3]).FromJust();
    int hd = Nan::To<int>(info[4]).FromJust();
    int _ct = Nan::To<int>(info[5]).FromJust();

    ec_backend_id = get_ec_backend_id(_id);
    ct  = get_ec_checksum_type(_ct);

    memset(&ec_args, 0, sizeof (ec_args));
    ec_args.k = k;
    ec_args.m = m;
    ec_args.w = w;
    ec_args.hd = hd;
    ec_args.ct = ct;

    int desc = liberasurecode_instance_create(ec_backend_id, &ec_args);

    if (desc <= 0) {
        Nan::ThrowTypeError("Liberasurecode initialization failed");
        return ;
    }

    info.GetReturnValue().Set(Nan::New(desc));
}

NAN_METHOD(EclDestroy) {
    Nan::HandleScope scope;

    int arg0 = Nan::To<int>(info[0]).FromJust();
    int status = liberasurecode_instance_destroy(arg0);

    if (status < 0)
        Nan::ThrowTypeError("Liberasurecode instance destroy failed");
    return ;
}

NAN_METHOD(EclGetHeaderSize) {
    Nan::HandleScope scope;

    uint32_t header_size = sizeof(fragment_header_t);
    info.GetReturnValue().Set(header_size);
}
NAN_METHOD(EclFragmentsNeeded) {
    Nan::HandleScope scope;
    info.GetReturnValue()
        .Set(Nan::New("C++ FragmentsNeeded ").ToLocalChecked());
}

NAN_METHOD(EclGetFragmentMetadata) {
    Nan::HandleScope scope;
    info.GetReturnValue()
        .Set(Nan::New("C++ GetFragmentMetadata ").ToLocalChecked());
}

NAN_METHOD(EclIsInvalidFragment) {
    Nan::HandleScope scope;
    info.GetReturnValue()
        .Set(Nan::New("C++ IsInvalidFragment ").ToLocalChecked());
}

NAN_METHOD(EclVerifyStripeMetadata) {
    Nan::HandleScope scope;
    info.GetReturnValue()
        .Set(Nan::New("C++ VerifyStripeMetadata ").ToLocalChecked());
}

NAN_METHOD(EclGetAlignedDataSize) {
    Nan::HandleScope scope;

    if (info.Length() != 2) {
        Nan::ThrowTypeError("Wrong number of arguments EclGetAlignedDataSize");
        return ;
    }

    ec_backend_id_t be_id;
    ec_backend_t instance;
    uint32_t aligned_size;

    int _id = Nan::To<int>(info[0]).FromJust();
    int64_t obj_size = Nan::To<int64_t>(info[1]).FromJust();

    be_id = get_ec_backend_id(_id);
    instance = liberasurecode_backend_instance_get_by_desc(be_id);

    aligned_size = get_aligned_data_size(instance, obj_size);

    info.GetReturnValue().Set(aligned_size);
}

NAN_METHOD(EclGetMinimumEncodeSize) {
    Nan::HandleScope scope;
    info.GetReturnValue()
        .Set(Nan::New("C++ GetMinimumEncodeSize ").ToLocalChecked());
}

NAN_METHOD(EclGetFragmentSize) {
    Nan::HandleScope scope;
    info.GetReturnValue().Set(Nan::New("C++ GetFragmentSize").ToLocalChecked());
}

NAN_METHOD(EclAddFragmentHeader) {
    Nan::HandleScope scope;

    if (info.Length() != 7) {
        Nan::ThrowTypeError("Wrong number of arguments EclAddFragmentHeader");
        return ;
    }

    ec_backend_id_t be_id;
    ec_checksum_type_t ct;
    ec_backend_t instance;

    int _id = Nan::To<int>(info[0]).FromJust();
    char *frag = node::Buffer::Data(info[1]);
    int frag_idx = Nan::To<int>(info[2]).FromJust();
    int64_t obj_size = Nan::To<int64_t>(info[3]).FromJust();
    int frag_size = Nan::To<int>(info[4]).FromJust();
    int _ct = Nan::To<int>(info[5]).FromJust();
    int add_cs = Nan::To<int>(info[6]).FromJust();

    be_id = get_ec_backend_id(_id);
    ct  = get_ec_checksum_type(_ct);

    instance = liberasurecode_backend_instance_get_by_desc(be_id);

    init_fragment_header(frag);
    add_fragment_metadata(instance, frag, frag_idx, obj_size, frag_size, ct,
                            add_cs);

    info.GetReturnValue().Set(Nan::NewBuffer(frag,
        frag_size + header_size).ToLocalChecked());
}
