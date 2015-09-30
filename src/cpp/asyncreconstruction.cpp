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
        delete _reconstructed_fragment;
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

        Handle<Value> argv[] = {
            Nan::Null(),
            Nan::NewBuffer(_reconstructed_fragment,
                    _fragment_length).ToLocalChecked()
        };

        callback->Call(2, argv);
    }

    void HandleErrorCallback() {
        Nan::HandleScope scope;

        Handle<Value> argv[] = {
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

    int instance_descriptor_id = info[0]->NumberValue();
    int num_fragments = info[2]->NumberValue();
    int fragment_length = info[3]->NumberValue();
    int missing_fragment_id = info[4]->NumberValue();
    Local<Object> avail_fragments = info[1]->ToObject();
    char **avail_fragments_ptr = new char*[num_fragments];
    for (int i = 0; i < num_fragments; i++) {
        avail_fragments_ptr[i] = new char[fragment_length];
        memcpy(avail_fragments_ptr[i], node::Buffer::Data(avail_fragments->Get(i)), fragment_length);
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
