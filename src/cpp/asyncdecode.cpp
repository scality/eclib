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

#include "asyncdecode.h"

using namespace v8;

class AsyncDecodeWorker : public Nan::AsyncWorker {
    public:
        AsyncDecodeWorker(Nan::Callback *callback, int instance_descriptor_id,
                char **fragments, int n_frag, int frag_len,
                int force_metadata_check) : Nan::AsyncWorker(callback),
        _instance_descriptor_id(instance_descriptor_id),
        _fragments(fragments),
        _n_frag(n_frag),
        _frag_len(frag_len),
        _force_metadata_check(force_metadata_check) {
        }

        ~AsyncDecodeWorker() {
            for (int i = 0;i < _n_frag;i++) {
                delete _fragments[i];
            }
            delete _fragments;
        }

        void Execute() {
            _status = liberasurecode_decode(_instance_descriptor_id,
                    _fragments, _n_frag, _frag_len,
                    _force_metadata_check,
                    &_out_data, &_out_data_len);

            if (_status != 0) {
                SetErrorMessage("an error occured while decoding");
            }
        }

        void HandleOKCallback() {
            Nan::HandleScope scope;

            Local<Value> argv[] = {
                Nan::New<Number>(_status),
                Nan::NewBuffer(_out_data, _out_data_len).ToLocalChecked(),
                Nan::New<Number>(_out_data_len)
            };
            callback->Call(3, argv);
        }

        void HandleErrorCallback() {
            Nan::HandleScope scope;

            Local<Value> argv[] = {
                Nan::New<Number>(_status)
            };

            callback->Call(1, argv);
        }
    private:
        // Input data.
        int _instance_descriptor_id;
        char **_fragments;
        int _n_frag;
        int _frag_len;
        int _force_metadata_check;

        // Output data.
        int _status;
        char *_out_data;
        uint64_t _out_data_len;
};

NAN_METHOD(EclDecode) {
    Nan::HandleScope scope;

    if (info.Length() < 6) {
        Nan::ThrowTypeError("Wrong number of arguments");
        return ;
    }

    int n_frag = Nan::To<int>(info[2]).FromJust();
    int frag_len = Nan::To<int>(info[3]).FromJust();

    Local<Object> fragments_array = Nan::To<v8::Object>(info[1]).ToLocalChecked();

    char **fragments = new char*[n_frag];
    for (int i = 0; i < n_frag; i++) {
        fragments[i] = new char[frag_len];
        memcpy(fragments[i], node::Buffer::Data(Nan::Get(fragments_array, i)
                    .ToLocalChecked()),
                frag_len);
    }

    Nan::AsyncQueueWorker(new AsyncDecodeWorker(
                new Nan::Callback(info[5].As<Function>()),
                Nan::To<int>(info[0]).FromJust(),
                fragments,
                n_frag,
                frag_len,
                Nan::To<int>(info[4]).FromJust()
                ));
    return ;
}
