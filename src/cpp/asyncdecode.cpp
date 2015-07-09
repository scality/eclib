#include <node.h>
#include <nan.h>

#include "asyncdecode.h"

using namespace v8;

//#define DPRINTF(fmt,...) do { fprintf(stderr, fmt, ##__VA_ARGS__); } while (0)
#define DPRINTF(fmt,...)

struct DecodeData {
  //input
  int instance_descriptor_id;
  char **fragments;
  int n_frag;
  int frag_len;
  int force_metadata_check;
  //result
  int status;
  char *out_data;
  uint64_t out_data_len;
  //free
};

#if 0
static void DecodeFree(char *out_data, void *hint) {
  DecodeData *data = reinterpret_cast<DecodeData*>(hint);

  DPRINTF("FREE DECODE %p\n", data);
  liberasurecode_decode_cleanup(data->instance_descriptor_id, data->out_data);
  
  delete data;
}
#endif

class DecodeWorker : public NanAsyncWorker {
 public:
  DecodeWorker(NanCallback *callback, DecodeData *data)
    : NanAsyncWorker(callback), data(data) {}
  ~DecodeWorker() {
    for (int i = 0;i < data->n_frag;i++) {
      delete data->fragments[i];
    }
    delete data->fragments;
    delete data;
  }

  // Executed inside the worker-thread.
  // It is not safe to access V8, or V8 data structures
  // here, so everything we need for input and output
  // should go on `this`.
  void Execute () {
    DPRINTF("execute decode %p\n", data);
    data->status = liberasurecode_decode(data->instance_descriptor_id, 
					 data->fragments, data->n_frag, data->frag_len, 
					 data->force_metadata_check,
					 &data->out_data, &data->out_data_len);
    DPRINTF("execute decode done %p\n", data);
  }

  // Executed when the async work is complete
  // this function will be run inside the main event loop
  // so it is safe to use V8 again
  void HandleOKCallback () {
    NanScope();

    DPRINTF("DECODE Callback %p\n", data);

    if (0 == data->status) {
    
    Handle<Value> argv[] = {
      NanNew<Number>(data->status),
      NanNewBufferHandle(data->out_data, data->out_data_len),//, DecodeFree, data),
      NanNew<Number>(data->out_data_len)
    };

    liberasurecode_decode_cleanup(data->instance_descriptor_id, data->out_data);
    data->out_data = NULL;
    
    callback->Call(3, argv);
  } else {
    
    Handle<Value> argv[] = {
      NanNew<Number>(data->status)
    };
    
     callback->Call(1, argv);
  }
  }

 private:
  DecodeData *data;
};

NAN_METHOD(EclDecode) {
  NanScope();

 if (args.Length() < 6) {
    NanThrowTypeError("Wrong number of arguments");
    NanReturnUndefined();
  }

  DecodeData *data = new DecodeData;
  DPRINTF("Dec data %p\n", data);
  
  data->instance_descriptor_id = args[0]->NumberValue();
  Local<Object>fragments_array = args[1]->ToObject();
  data->n_frag = args[2]->NumberValue();
  data->fragments = new char*[data->n_frag];
  data->frag_len = args[3]->NumberValue();
  for (int i = 0;i < data->n_frag;i++) {
    char *fragment = node::Buffer::Data(fragments_array->Get(i));
    data->fragments[i] = new char[data->frag_len];
    memcpy(data->fragments[i], fragment, data->frag_len);
  }
  data->force_metadata_check = args[4]->NumberValue();
  
  NanCallback *callback = new NanCallback(args[5].As<Function>());
  NanAsyncQueueWorker(new DecodeWorker(callback, data));
    
  NanReturnUndefined();
}
