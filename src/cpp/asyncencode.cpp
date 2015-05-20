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
  //NanCallback *callback;
  Persistent<Function> callback;
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
    //printf("FREE ENCODE TMP\n");
    data->count--;
    
    if (0 == data->count) {
      //printf("FREE ENCODE\n");
      liberasurecode_encode_cleanup(data->instance_descriptor_id,
				    data->encoded_data,
				    data->encoded_parity);
      delete data;
    }
}

static void EncodeWork(uv_work_t* req) {
  EncodeData *data = reinterpret_cast<EncodeData*>(req->data);

  data->status = liberasurecode_encode(data->instance_descriptor_id,
				       data->orig_data, data->orig_data_size,
				       &data->encoded_data, 
				       &data->encoded_parity, 
				       &data->encoded_fragment_len);
}

static void EncodeAfterWork(uv_work_t* req, int foo) {
  NanScope();
  EncodeData *data = reinterpret_cast<EncodeData*>(req->data);

  if (0 == data->status) {
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
    
    //data->callback->Call(4, argv);
    node::MakeCallback(Context::GetCurrent()->Global(),
		       data->callback,
		       4,
		       argv);
    data->callback.Dispose();
    data->callback.Clear();

    delete req;
    
  } else {
    
    Handle<Value> argv[] = {
      NanNew<Number>(data->status)
    };
    
    //data->callback->Call(1, argv);
    node::MakeCallback(Context::GetCurrent()->Global(),
		       data->callback,
		       1,
		       argv);
    data->callback.Dispose();
    data->callback.Clear();
  
    delete data;
    delete req;
  }
}

NAN_METHOD(EclEncode) {
  NanScope();

  if (args.Length() < 6) {
    NanThrowTypeError("Wrong number of arguments");
    NanReturnUndefined();
  }
  
  uv_work_t* req = new uv_work_t;
  EncodeData *data = new EncodeData;

  data->instance_descriptor_id = args[0]->NumberValue();
  data->k = args[1]->NumberValue();
  data->m = args[2]->NumberValue();
  data->orig_data = node::Buffer::Data(args[3]);
  data->orig_data_size = args[4]->NumberValue();
  //Local<Function> callbackHandle = args[5].As<Function>();
  //data->callback = new NanCallback(callbackHandle);
  data->callback = Persistent<Function>::New(args[5].As<Function>());

  req->data = data;
    
  uv_queue_work(uv_default_loop(), req, EncodeWork, EncodeAfterWork);

  NanReturnUndefined();
}
