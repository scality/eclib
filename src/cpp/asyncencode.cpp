#include <node.h>
#include <nan.h>

#include "asyncencode.h"

using namespace v8;

//#define DPRINTF(fmt,...) do { fprintf(stderr, fmt, ##__VA_ARGS__); } while (0)
#define DPRINTF(fmt,...)

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

#if 0
static void EncodeFree(char *out_data, void *hint) {
    EncodeData *data = reinterpret_cast<EncodeData*>(hint);
    DPRINTF("FREE ENCODE TMP %d %p\n", data->count, data);
    data->count--;

    if (0 == data->count) {
      DPRINTF("FREE ENCODE %p\n", data);
      liberasurecode_encode_cleanup(data->instance_descriptor_id,
				    data->encoded_data,
				    data->encoded_parity);
      delete data;
    }
}
#endif

class EncodeWorker : public NanAsyncWorker {
 public:
  EncodeWorker(NanCallback *callback, EncodeData *data)
    : NanAsyncWorker(callback), data(data) {}
  ~EncodeWorker() {
    delete data->orig_data;
    delete data;
  }

  // Executed inside the worker-thread.
  // It is not safe to access V8, or V8 data structures
  // here, so everything we need for input and output
  // should go on `this`.
  void Execute () {
    DPRINTF("Encoding %p\n", data);
    data->status = liberasurecode_encode(data->instance_descriptor_id,
					 data->orig_data, data->orig_data_size,
					 &data->encoded_data, 
					 &data->encoded_parity, 
					 &data->encoded_fragment_len);
    DPRINTF("Encoding Done %p\n", data);
  }

  // Executed when the async work is complete
  // this function will be run inside the main event loop
  // so it is safe to use V8 again
  void HandleOKCallback () {
    NanScope();

    if (0 == data->status) {
      DPRINTF("Encoding OK CB %p\n", data);
      data->count = data->k + data->m;

      Handle<Array> encoded_data_array = NanNew<Array>(data->k);
      for (int i = 0; i < data->k;i++) {
	encoded_data_array->Set(i, NanNewBufferHandle(data->encoded_data[i], data->encoded_fragment_len));//, EncodeFree, data));
      }

      Handle<Array> encoded_parity_array = NanNew<Array>(data->m);
      for (int i = 0; i < data->m;i++) {
	encoded_parity_array->Set(i, NanNewBufferHandle(data->encoded_parity[i], data->encoded_fragment_len));//, EncodeFree, data));
      }

      Handle<Value> argv[] = {
	NanNew<Number>(data->status),
	encoded_data_array,
	encoded_parity_array,
	NanNew<Number>(data->encoded_fragment_len)
      };

      liberasurecode_encode_cleanup(data->instance_descriptor_id,
				    data->encoded_data,
				    data->encoded_parity);
      data->encoded_data = NULL;
      data->encoded_parity = NULL;
    
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
  DPRINTF("Enc data %p\n", data);

  data->instance_descriptor_id = args[0]->NumberValue();
  data->k = args[1]->NumberValue();
  data->m = args[2]->NumberValue();
  data->orig_data_size = args[4]->NumberValue();
  char *orig_data = node::Buffer::Data(args[3]);
  data->orig_data = new char[data->orig_data_size];
  memcpy(data->orig_data, orig_data, data->orig_data_size);

  NanCallback *callback = new NanCallback(args[5].As<Function>());

  NanAsyncQueueWorker(new EncodeWorker(callback, data));
  NanReturnUndefined();
}
