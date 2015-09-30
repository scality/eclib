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
            Handle<Array> encoded_data_array = Nan::New<Array>(_k);
            for (int i = 0; i < _k; i++) {
                encoded_data_array->Set(i, Nan::NewBuffer(_encoded_data[i],
                            _encoded_fragment_len).ToLocalChecked());
            }

            Handle<Array> encoded_parity_array = Nan::New<Array>(_m);
            for (int i = 0; i < _m; i++) {
                encoded_parity_array->Set(i, Nan::NewBuffer(_encoded_parity[i],
                            _encoded_fragment_len).ToLocalChecked());
            }

            liberasurecode_encode_cleanup(_instance_descriptor_id,
                    _encoded_data,
                    _encoded_parity);

            Handle<Value> argv[] = {
                Nan::New<Number>(_status),
                encoded_data_array,
                encoded_parity_array,
                Nan::New<Number>(_encoded_fragment_len)
            };

            callback->Call(4, argv);
        }

        void HandleErrorCallback() {
            Nan::HandleScope scope;

            Handle<Value> argv[] = {
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
        sprintf(msg, "Wrong number of arguments (expected 6, got %d)", info.Length());
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

NAN_METHOD(encodev) {
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
        char *buf = node::Buffer::Data(buf_array->Get(i));
        int buf_len = node::Buffer::Length(buf_array->Get(i));
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
