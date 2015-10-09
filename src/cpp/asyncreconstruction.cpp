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

#include "asyncreconstruction.h"

using namespace v8;

class AsyncReconstructWorker : public Nan::AsyncWorker {
    public:
        AsyncReconstructWorker(
                int instance_descriptor_id,
                char **avail_fragments_ptr,
                int num_fragments,
                int fragment_length,
                int missing_fragment_id,
                Nan::Callback *callback):
            Nan::AsyncWorker(callback),
            _status(-1),
            _instance_descriptor_id(instance_descriptor_id),
            _avail_fragments_ptr(avail_fragments_ptr),
            _num_fragments(num_fragments),
            _fragment_length(fragment_length),
            _missing_fragment_id(missing_fragment_id) {
                _reconstructed_fragment = new char[_fragment_length];
            }

        ~AsyncReconstructWorker() {
            for (int i = 0; i < _num_fragments; i++) {
                delete _avail_fragments_ptr[i];
            }
            delete _avail_fragments_ptr;
        }

        void Execute() {
            _status = liberasurecode_reconstruct_fragment(
                    _instance_descriptor_id,
                    _avail_fragments_ptr,
                    _num_fragments,
                    _fragment_length,
                    _missing_fragment_id,
                    _reconstructed_fragment
                    );

            if (_status != 0) {
                SetErrorMessage("an error occured while reconstructing");
            }
        }

        void HandleOKCallback() {
            Nan::HandleScope scope;

            Local<Value> argv[] = {
                Nan::Null(),
                Nan::NewBuffer(_reconstructed_fragment, _fragment_length)
                    .ToLocalChecked()
            };

            callback->Call(2, argv);
        }

        void HandleErrorCallback() {
            Nan::HandleScope scope;

            Local<Value> argv[] = {
                Nan::Error("could not reconstruct fragment")
            };

            callback->Call(1, argv);
        }

    private:
        int _status;
        int _instance_descriptor_id;
        char **_avail_fragments_ptr;
        int _num_fragments;
        int _fragment_length;
        int _missing_fragment_id;
        char *_reconstructed_fragment;
};

NAN_METHOD(EclReconstructFragment) {
    Nan::HandleScope scope;

    int instance_descriptor_id = Nan::To<int>(info[0]).FromJust();
    int num_fragments = Nan::To<int>(info[2]).FromJust();
    int fragment_length = Nan::To<int>(info[3]).FromJust();
    int missing_fragment_id = Nan::To<int>(info[4]).FromJust();
    Local<Object> avail_fragments = Nan::To<v8::Object>(info[1]).ToLocalChecked();
    char **avail_fragments_ptr = new char*[num_fragments];
    for (int i = 0; i < num_fragments; i++) {
        avail_fragments_ptr[i] = new char[fragment_length];
        memcpy(avail_fragments_ptr[i],
                node::Buffer::Data(Nan::Get(avail_fragments, i)
                    .ToLocalChecked()), fragment_length);
    }

    Nan::Callback *callback = new Nan::Callback(info[5].As<Function>());

    Nan::AsyncQueueWorker(new AsyncReconstructWorker(
                instance_descriptor_id,
                avail_fragments_ptr,
                num_fragments,
                fragment_length,
                missing_fragment_id,
                callback
                ));
    return ;
}
