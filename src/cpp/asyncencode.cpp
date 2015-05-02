#include <node.h>
#include <nan.h>

#include "asyncencode.h"

using namespace v8;

//static char **encoded_data, **encoded_parity;

NAN_METHOD(eclEncode) {
  	NanScope();

	if (args.Length() < 4) {
	    NanThrowTypeError("Wrong number of arguments");
	    NanReturnUndefined();
	}

 	int instance_descriptor_id = args[0]->NumberValue();
	int orig_data_size = args[2]->NumberValue();
	char* orig_data = node::Buffer::Data(args[1]);


	Local<Function> callbackHandle = args[3].As<Function>();
	NanCallback *callback = new NanCallback(callbackHandle);


	char **encoded_data = NULL, **encoded_parity = NULL;
    uint64_t encoded_fragment_len = 0;


	int desc = liberasurecode_encode(instance_descriptor_id, orig_data, orig_data_size,
            &encoded_data, &encoded_parity, &encoded_fragment_len);


	// now send the data back to the server

	if(desc == 0){

		Handle<Value> argv[] = {
		  	NanNull(),
		  	NanNew<Number>(desc),
		    NanNewBufferHandle( *encoded_data, strlen(*encoded_data)),
		    NanNewBufferHandle( *encoded_parity, strlen(*encoded_parity)),
		    NanNew<Number>(encoded_fragment_len)
		};

	  	callback->Call(3, argv);

	} else {

		Handle<Value> argv[] = {
	  		NanNull(),
	  		NanNew<Number>(desc)
	  	};

		callback->Call(1, argv);
	}

 // NanReturnValue(NanNew("C++ Encode ##### not implemented "));
}


NAN_METHOD(eclEncodeCleanup) {
	NanScope();

	if (args.Length() < 3) {
	    NanThrowTypeError("Wrong number of arguments");
	    NanReturnUndefined();
	}

 	int instance_descriptor_id = args[0]->NumberValue();
	char* encoded_data = node::Buffer::Data(args[1]);
	char* encoded_parity = node::Buffer::Data(args[2]);

/*
	int desc = liberasurecode_encode_cleanup(instance_descriptor_id,
					 &encoded_data , &encoded_parity);  */
  
  	int desc =-1;  

	NanReturnValue( NanNew(desc));
}
