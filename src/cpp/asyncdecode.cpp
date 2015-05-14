#include <node.h>
#include <nan.h>

#include "asyncdecode.h"

using namespace v8;

NAN_METHOD(EclDecode) {
  NanScope();

 if (args.Length() < 6) {
    NanThrowTypeError("Wrong number of arguments");
    NanReturnUndefined();
  }
  
  int instance_descriptor_id = args[0]->NumberValue();
  Local<Object> fragments_array = args[1]->ToObject();
  int n_frag = args[2]->NumberValue();
  int frag_len = args[3]->NumberValue();
  int force_metadata_check = args[4]->NumberValue();
    
  Local<Function> callbackHandle = args[5].As<Function>();
  NanCallback *callback = new NanCallback(callbackHandle);
    
  char *out_data = NULL;
  uint64_t out_data_len = 0;
  
  char **fragments = (char **) alloca(n_frag * sizeof (char *));
  for (int i = 0;i < n_frag;i++) {
    fragments[i] = node::Buffer::Data(fragments_array->Get(i));
  }

  int status = liberasurecode_decode(instance_descriptor_id, 
				     fragments, n_frag, frag_len, force_metadata_check,
				     &out_data, &out_data_len);
  
  if (status != 0) {
    NanThrowTypeError("Decoding failed");
    NanReturnValue( NanNew(status));
  }
  
  if (status == 0) {
    
    Handle<Value> argv[] = {
      NanNew<Number>(status),
      NanNewBufferHandle(out_data, out_data_len),
      NanNew<Number>(out_data_len)
    };
    
    callback->Call(3, argv);
    
  } else {
    
    Handle<Value> argv[] = {
      NanNew<Number>(status)
    };
    
    callback->Call(1, argv);
  }
  
  NanReturnValue( NanNew(0));
}


NAN_METHOD(EclDecodeCleanup) {
  NanScope();
  NanReturnValue(NanNew("C++ DecodeCleanUp #### not implemented"));
}
