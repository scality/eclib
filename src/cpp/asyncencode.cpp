#include <node.h>
#include <nan.h>

#include "asyncencode.h"

using namespace v8;

struct EncodeData {
  //input
  int instance_descriptor_id;
  int k;
  int m;
  char *orig_data;
  int orig_data_size;
  //result
  int status;
  char **encoded_data;
  char **encoded_parity;
  uint64_t encoded_fragment_len;
  //free
  int count;
};

static void EncodeFree(char *out_data, void *hint) {
    EncodeData *data = reinterpret_cast<EncodeData*>(hint);
    printf("FREE ENCODE TMP %d %p\n", data->count, data);
    data->count--;
    
    if (0 == data->count) {
      printf("FREE ENCODE %p\n", data);
      liberasurecode_encode_cleanup(data->instance_descriptor_id,
				    data->encoded_data,
				    data->encoded_parity);
      delete data;
    }
}

class EncodeWorker : public NanAsyncWorker {
 public:
  EncodeWorker(NanCallback *callback, EncodeData *data)
    : NanAsyncWorker(callback), data(data) {}
  ~EncodeWorker() {}

  // Executed inside the worker-thread.
  // It is not safe to access V8, or V8 data structures
  // here, so everything we need for input and output
  // should go on `this`.
  void Execute () {
    printf("Encoding %p\n", data);
    data->status = liberasurecode_encode(data->instance_descriptor_id,
					 data->orig_data, data->orig_data_size,
					 &data->encoded_data, 
					 &data->encoded_parity, 
					 &data->encoded_fragment_len);
    printf("Encoding Done %p\n", data);
  }

  // Executed when the async work is complete
  // this function will be run inside the main event loop
  // so it is safe to use V8 again
  void HandleOKCallback () {
    NanScope();

    if (0 == data->status) {
      printf("Encoding OK CB %p\n", data);
      data->count = data->k + data->m;

      Handle<Array> encoded_data_array = NanNew<Array>(data->k);
      for (int i = 0; i < data->k;i++) {
	encoded_data_array->Set(i, NanNewBufferHandle(data->encoded_data[i], data->encoded_fragment_len, EncodeFree, data));
      }

      Handle<Array> encoded_parity_array = NanNew<Array>(data->m);
      for (int i = 0; i < data->m;i++) {
	encoded_parity_array->Set(i, NanNewBufferHandle(data->encoded_parity[i], data->encoded_fragment_len, EncodeFree, data));
      }

      Handle<Value> argv[] = {
	NanNew<Number>(data->status),
	encoded_data_array,
	encoded_parity_array,
	NanNew<Number>(data->encoded_fragment_len)
      };
    
      callback->Call(4, argv);
  } else {
    
    Handle<Value> argv[] = {
      NanNew<Number>(data->status)
    };
    
    callback->Call(1, argv);
    }
  }

 private:
  EncodeData *data;
};


NAN_METHOD(EclEncode) {
  NanScope();

  if (args.Length() < 6) {
    NanThrowTypeError("Wrong number of arguments");
    NanReturnUndefined();
  }

  EncodeData *data = new EncodeData;
  printf("Enc data %p\n", data);

  data->instance_descriptor_id = args[0]->NumberValue();
  data->k = args[1]->NumberValue();
  data->m = args[2]->NumberValue();
  data->orig_data = node::Buffer::Data(args[3]);
  data->orig_data_size = args[4]->NumberValue();

  NanCallback *callback = new NanCallback(args[5].As<Function>());

  NanAsyncQueueWorker(new EncodeWorker(callback, data));
  NanReturnUndefined();
}
