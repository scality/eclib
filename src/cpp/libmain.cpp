#include <node.h>
#include <nan.h>

#include "libmain.h"

using namespace v8;

struct ec_args null_args = {
    .m = 4
};

struct ec_args *null_test_args[] = { &null_args, NULL };


NAN_METHOD(EclCreate) {
  NanScope();


  Local<String> strvalue = NanNew<String>("All is ok");

  int desc = liberasurecode_instance_create(EC_BACKENDS_MAX, &null_args);

  if(desc > -2){
	strvalue = NanNew<String>("Error occured in the file");
  }

  //Local<Number> errorcode = NanNew(desc);

  NanReturnValue( NanNew(desc));
}

NAN_METHOD(EclDestroy) {
  
  NanScope();

  int arg0 = args[0]->NumberValue();
  int desc = liberasurecode_instance_destroy(arg0);

  //Local<Number> resultcode = NanNew(desc);

  NanReturnValue(NanNew(desc));
}


NAN_METHOD(EclFragmentsNeeded) {
  NanScope();
  NanReturnValue(NanNew("C++ FragmentsNeeded "));
}


NAN_METHOD(EclGetFragmentMetadata) {
  NanScope();
  NanReturnValue(NanNew("C++ GetFragmentMetadata "));
}

NAN_METHOD(EclIsInvalidFragment) {
  NanScope();
  NanReturnValue(NanNew("C++ IsInvalidFragment "));
}

NAN_METHOD(EclVerifyStripeMetadata) {
  NanScope();
  NanReturnValue(NanNew("C++ VerifyStripeMetadata "));
}

NAN_METHOD(EclGetAlignedDataSize) {
  NanScope();
  NanReturnValue(NanNew("C++ GetAlignedDataSize "));
}

NAN_METHOD(EclGetMinimumEncodeSize) {
  NanScope();
  NanReturnValue(NanNew("C++ GetMinimumEncodeSize "));
}

NAN_METHOD(EclGetFragmentSize) {
  NanScope();
  NanReturnValue(NanNew("C++ GetFragmentSize"));
}


