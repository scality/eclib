#include <nan.h>

#include "asyncdecode.h"

using namespace v8;

class AsyncDecodeWorker : public Nan::AsyncWorker {
public:
  AsyncDecodeWorker(Nan::Callback *callback, int instance_descriptor_id, char **fragments, int n_frag, int frag_len, int force_metadata_check) :
    Nan::AsyncWorker(callback),
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

    Handle<Value> argv[] = {
      Nan::New<Number>(_status),
      Nan::CopyBuffer(_out_data, _out_data_len).ToLocalChecked(),
      Nan::New<Number>(_out_data_len)
    };


    liberasurecode_decode_cleanup(_instance_descriptor_id, _out_data);

    callback->Call(3, argv);
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

  int n_frag = info[2]->NumberValue();
  int frag_len = info[3]->NumberValue();

  Local<Object> fragments_array = info[1]->ToObject();

  char **fragments = new char*[n_frag];
  for (int i = 0; i < n_frag; i++) {
    fragments[i] = new char[frag_len];
    memcpy(fragments[i], node::Buffer::Data(fragments_array->Get(i)), frag_len);
  }

  Nan::AsyncQueueWorker(new AsyncDecodeWorker(
    new Nan::Callback(info[5].As<Function>()),
    info[0]->NumberValue(),
    fragments,
    n_frag,
    frag_len,
    info[4]->NumberValue()
  ));
  return ;
}
