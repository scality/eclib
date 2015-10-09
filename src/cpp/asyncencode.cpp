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
#include "asyncencode.h"

using namespace v8;

class AsyncEncodeWorker : public Nan::AsyncWorker {
    public:
        AsyncEncodeWorker(Nan::Callback *callback, int instance_descriptor_id,
                int k, int m, char *orig_data, int orig_data_size) :
            Nan::AsyncWorker(callback),
            _instance_descriptor_id(instance_descriptor_id),
            _k(k),
            _m(m),
            _orig_data(orig_data),
            _orig_data_size(orig_data_size) {}

        ~AsyncEncodeWorker() {
            delete _orig_data;
        }

        void Execute() {
            _status = liberasurecode_encode(_instance_descriptor_id,
                    _orig_data, _orig_data_size,
                    &_encoded_data,
                    &_encoded_parity,
                    &_encoded_fragment_len);

            if (_status != 0) {
                SetErrorMessage("an error occured while encoding");
            }
        }

        void HandleOKCallback() {
            Nan::HandleScope scope;

            // FIXME: The uint64 to uint32 cast is anything but safe
            Local<Array> encoded_data_array = Nan::New<Array>(_k);
            for (int i = 0; i < _k; i++) {
                Nan::Set(encoded_data_array, i,
                        Nan::NewBuffer(_encoded_data[i], _encoded_fragment_len)
                        .ToLocalChecked());
            }

            Local<Array> encoded_parity_array = Nan::New<Array>(_m);
            for (int i = 0; i < _m; i++) {
                Nan::Set(encoded_parity_array, i, Nan::NewBuffer(_encoded_parity[i],
                            _encoded_fragment_len).ToLocalChecked());
            }

            free(_encoded_data);
            free(_encoded_parity);

            Local<Value> argv[] = {
                Nan::New<Number>(_status),
                encoded_data_array,
                encoded_parity_array,
                Nan::New<Number>(_encoded_fragment_len)
            };

            callback->Call(4, argv);
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
        int _k;
        int _m;
        char *_orig_data;
        int _orig_data_size;
        // Output data.
        int _status;
        char **_encoded_data;
        char **_encoded_parity;
        uint64_t _encoded_fragment_len;
};

NAN_METHOD(EclEncode) {
    Nan::HandleScope scope;

    if (info.Length() < 6) {
        char msg[1024];
        sprintf(msg, "Wrong number of arguments (expected 6, got %d)",
                info.Length());
        Nan::ThrowTypeError(msg);
        return ;
    }

    int instance_descriptor_id = info[0]->NumberValue();
    int k = info[1]->NumberValue();
    int m = info[2]->NumberValue();
    int orig_data_size = info[4]->NumberValue();
    char *orig_data = node::Buffer::Data(info[3]);
    char *pass_orig_data = new char[orig_data_size];
    memcpy(pass_orig_data, orig_data, orig_data_size);

    Nan::Callback *callback = new Nan::Callback(info[5].As<Function>());

    Nan::AsyncQueueWorker(new AsyncEncodeWorker(
                callback,
                instance_descriptor_id,
                k,
                m,
                pass_orig_data,
                orig_data_size
                ));
    return ;
}

NAN_METHOD(EclEncodeV) {
    Nan::HandleScope scope;

    if (info.Length() < 7) {
        char msg[1024];
        sprintf(msg, "Wrong number of arguments (expected 7, got %d)", info.Length());
        Nan::ThrowTypeError(msg);
        return ;
    }

    int instance_descriptor_id = info[0]->NumberValue();
    int k = info[1]->NumberValue();
    int m = info[2]->NumberValue();

    int orig_data_size = info[5]->NumberValue();
    char *orig_data = new char[orig_data_size];

    Local<Object>buf_array = info[4]->ToObject();
    int n_buf = info[3]->NumberValue();
    int off = 0;
    for (int i = 0; i < n_buf; i++) {
        char *buf = node::Buffer::Data(Nan::Get(buf_array, i).ToLocalChecked());
        int buf_len = node::Buffer::Length(Nan::Get(buf_array, i).ToLocalChecked());
        memcpy(orig_data + off, buf, buf_len);
        off += buf_len;
    }

    Nan::Callback *callback = new Nan::Callback(info[6].As<Function>());

    Nan::AsyncQueueWorker(new AsyncEncodeWorker(
                callback,
                instance_descriptor_id,
                k,
                m,
                orig_data,
                orig_data_size
                ));
    return ;
}
