#include <node.h>
#include <nan.h>

#include "asyncdecode.h"

using namespace v8;

struct DecodeData {
  //input
  int instance_descriptor_id;
  char **fragments;
  int n_frag;
  int frag_len;
  int force_metadata_check;
  NanCallback *callback;
  //result
  int status;
  char *out_data;
  uint64_t out_data_len;
  //free
};

static void DecodeFree(char *out_data, void *hint) {
  DecodeData *data = reinterpret_cast<DecodeData*>(hint);

  //printf("FREE DECODE\n");
  liberasurecode_decode_cleanup(data->instance_descriptor_id, data->out_data);

  delete data;
}

static void DecodeWork(uv_work_t* req) {
  DecodeData *data = reinterpret_cast<DecodeData*>(req->data);

  data->status = liberasurecode_decode(data->instance_descriptor_id, 
				       data->fragments, data->n_frag, data->frag_len, 
				       data->force_metadata_check,
				       &data->out_data, &data->out_data_len);
}

static void DecodeAfterWork(uv_work_t* req, int foo) {
  NanScope();
  DecodeData *data = reinterpret_cast<DecodeData*>(req->data);
  
  if (0 == data->status) {

    Handle<Value> argv[] = {
      NanNew<Number>(data->status),
      NanNewBufferHandle(data->out_data, data->out_data_len, DecodeFree, data),
      NanNew<Number>(data->out_data_len)
    };
    
    data->callback->Call(3, argv);

    delete req;
    
  } else {
    
    Handle<Value> argv[] = {
      NanNew<Number>(data->status)
    };
    
    data->callback->Call(1, argv);
  
    delete data;
    delete req;
  }
}

NAN_METHOD(EclDecode) {
  NanScope();

 if (args.Length() < 6) {
    NanThrowTypeError("Wrong number of arguments");
    NanReturnUndefined();
  }

  uv_work_t* req = new uv_work_t;
  DecodeData *data = new DecodeData;
  
  data->instance_descriptor_id = args[0]->NumberValue();
  Local<Object>fragments_array = args[1]->ToObject();
  data->n_frag = args[2]->NumberValue();
  data->fragments = new char*[data->n_frag];
  for (int i = 0;i < data->n_frag;i++) {
    data->fragments[i] = node::Buffer::Data(fragments_array->Get(i));
  }
  data->frag_len = args[3]->NumberValue();
  data->force_metadata_check = args[4]->NumberValue();
  Local<Function> callbackHandle = args[5].As<Function>();
  data->callback = new NanCallback(callbackHandle);

  req->data = data;

  uv_queue_work(uv_default_loop(), req, DecodeWork, DecodeAfterWork);
    
  NanReturnValue( NanNew(0));
}


NAN_METHOD(EclDecodeCleanup) {
  NanScope();
  NanReturnValue(NanNew("C++ EclDecodeCleanup "));
}
