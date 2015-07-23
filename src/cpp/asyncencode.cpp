#include <node.h>
#include <nan.h>

#include "asyncencode.h"

using namespace v8;

class AsyncEncodeWorker : public NanAsyncWorker {
public:
  AsyncEncodeWorker(NanCallback *callback, int instance_descriptor_id, int k, int m, char *orig_data, int orig_data_size) :
    NanAsyncWorker(callback),
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
    NanScope();

    Handle<Array> encoded_data_array = NanNew<Array>(_k);
    for (int i = 0; i < _k; i++) {
      encoded_data_array->Set(i, NanNewBufferHandle(_encoded_data[i], _encoded_fragment_len));
    }

    Handle<Array> encoded_parity_array = NanNew<Array>(_m);
    for (int i = 0; i < _m; i++) {
      encoded_parity_array->Set(i, NanNewBufferHandle(_encoded_parity[i], _encoded_fragment_len));
    }

    liberasurecode_encode_cleanup(_instance_descriptor_id,
          _encoded_data,
          _encoded_parity);

    Handle<Value> argv[] = {
      NanNew<Number>(_status),
      encoded_data_array,
      encoded_parity_array,
      NanNew<Number>(_encoded_fragment_len)
    };

    callback->Call(4, argv);
  }

  void HandleErrorCallback() {
    NanScope();

    Handle<Value> argv[] = {
      NanNew<Number>(_status)
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
  NanScope();

  if (args.Length() < 6) {
    char msg[1024];
    sprintf(msg, "Wrong number of arguments (expected 6, got %d)", args.Length());
    NanThrowTypeError(msg);
    NanReturnUndefined();
  }

  int instance_descriptor_id = args[0]->NumberValue();
  int k = args[1]->NumberValue();
  int m = args[2]->NumberValue();
  int orig_data_size = args[4]->NumberValue();
  char *orig_data = node::Buffer::Data(args[3]);
  char *pass_orig_data = new char[orig_data_size];
  memcpy(pass_orig_data, orig_data, orig_data_size);

  NanCallback *callback = new NanCallback(args[5].As<Function>());

  NanAsyncQueueWorker(new AsyncEncodeWorker(
    callback,
    instance_descriptor_id,
    k,
    m,
    pass_orig_data,
    orig_data_size
  ));

  NanReturnUndefined();
}

NAN_METHOD(EclEncodeV) {
  NanScope();

  if (args.Length() < 7) {
    char msg[1024];
    sprintf(msg, "Wrong number of arguments (expected 7, got %d)", args.Length());
    NanThrowTypeError(msg);
    NanReturnUndefined();
  }

  int instance_descriptor_id = args[0]->NumberValue();
  int k = args[1]->NumberValue();
  int m = args[2]->NumberValue();

  int orig_data_size = args[5]->NumberValue();
  char *orig_data = new char[orig_data_size];

  Local<Object>buf_array = args[4]->ToObject();
  int n_buf = args[3]->NumberValue();
  int off = 0;
  for (int i = 0; i < n_buf; i++) {
    char *buf = node::Buffer::Data(buf_array->Get(i));
    int buf_len = node::Buffer::Length(buf_array->Get(i));
    memcpy(orig_data + off, buf, buf_len);
    off += buf_len;
  }

  NanCallback *callback = new NanCallback(args[6].As<Function>());

  NanAsyncQueueWorker(new AsyncEncodeWorker(
    callback,
    instance_descriptor_id,
    k,
    m,
    orig_data,
    orig_data_size
  ));
  NanReturnUndefined();
}
