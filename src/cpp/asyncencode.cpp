#include <node.h>
#include <nan.h>

#include "asyncencode.h"

using namespace v8;

struct EncodeFreeData {
  int instance_descriptor_id;
  char **encoded_data;
  char **encoded_parity;
  int count;
};

static void free_encode(char *out_data, void *hint) {
  struct EncodeFreeData *free_data = (struct EncodeFreeData *) hint;

  free_data->count--;

  if (0 == free_data->count) {
    int status = liberasurecode_encode_cleanup(free_data->instance_descriptor_id,
					       free_data->encoded_data,
					       free_data->encoded_parity);
    
    if (status != 0) {
      NanThrowTypeError("Encode cleanup failed");
    }
    free(free_data);
  }

}

NAN_METHOD(EclEncode) {
  NanScope();
  
  if (args.Length() < 6) {
    NanThrowTypeError("Wrong number of arguments");
    NanReturnUndefined();
  }
  
  int instance_descriptor_id = args[0]->NumberValue();
  int k = args[1]->NumberValue();
  int m = args[2]->NumberValue();
  char* orig_data = node::Buffer::Data(args[3]);
  int orig_data_size = args[4]->NumberValue();
    
  Local<Function> callbackHandle = args[5].As<Function>();
  NanCallback *callback = new NanCallback(callbackHandle);
    
  char **encoded_data = NULL, **encoded_parity = NULL;
  uint64_t encoded_fragment_len = 0;

  int status = liberasurecode_encode(instance_descriptor_id, orig_data, orig_data_size,
				     &encoded_data, &encoded_parity, &encoded_fragment_len);
  
  if (status != 0) {
    NanThrowTypeError("Encoding failed");
    NanReturnValue( NanNew(status));
  }

  if (status == 0) {
   
    struct EncodeFreeData *free_data = (struct EncodeFreeData *) malloc(sizeof (struct EncodeFreeData));
    if (NULL == free_data) {
      NanThrowTypeError("malloc failed");
      NanReturnValue( -1);
    }

    free_data->instance_descriptor_id = instance_descriptor_id;
    free_data->encoded_data = encoded_data;
    free_data->encoded_parity = encoded_parity;
    free_data->count = k + m;
 
    Handle<Array> encoded_data_array = NanNew<Array>(k);
    for (int i = 0; i < k;i++) {
      encoded_data_array->Set(i, NanNewBufferHandle(encoded_data[i], encoded_fragment_len, free_encode, free_data));
    }

    Handle<Array> encoded_parity_array = NanNew<Array>(m);
    for (int i = 0; i < m;i++) {
      encoded_parity_array->Set(i, NanNewBufferHandle(encoded_parity[i], encoded_fragment_len, free_encode, free_data));
    }

    Handle<Value> argv[] = {
      NanNew<Number>(status),
      encoded_data_array,
      encoded_parity_array,
      NanNew<Number>(encoded_fragment_len)
    };
    
    callback->Call(4, argv);
    
  } else {
    
    Handle<Value> argv[] = {
      NanNew<Number>(status)
    };
    
    callback->Call(1, argv);
  }
  
  NanReturnValue( NanNew(0));
}

NAN_METHOD(EclEncodeCleanup) {
  NanScope();
  NanReturnValue(NanNew("C++ EclEncodeCleanup "));
}
