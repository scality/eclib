#include <nan.h>

#include "libmain.h"
#include "asyncencode.h"
#include "asyncdecode.h"
#include "asyncreconstruction.h"


using v8::FunctionTemplate;
using v8::Handle;
using v8::Object;
using v8::String;


void InitAll(Handle<Object> exports) {

  exports->Set(Nan::New<String>("create").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(EclCreate)).ToLocalChecked());

  exports->Set(Nan::New<String>("destroy").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(EclDestroy)).ToLocalChecked());

  exports->Set(Nan::New<String>("encode").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(EclEncode)).ToLocalChecked());

  exports->Set(Nan::New<String>("encodev").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(EclEncodeV)).ToLocalChecked());

  exports->Set(Nan::New<String>("decode").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(EclDecode)).ToLocalChecked());

   exports->Set(Nan::New<String>("reconstructFragment").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(EclReconstructFragment)).ToLocalChecked());

  exports->Set(Nan::New<String>("fragmentsNeeded").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(EclFragmentsNeeded)).ToLocalChecked());

  exports->Set(Nan::New<String>("getFragmentMetadata").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(EclGetFragmentMetadata)).ToLocalChecked());

   exports->Set(Nan::New<String>("isInvalidFragment").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(EclIsInvalidFragment)).ToLocalChecked());

   exports->Set(Nan::New<String>("verifyStripeMetadata").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(EclVerifyStripeMetadata)).ToLocalChecked());

  exports->Set(Nan::New<String>("getAlignedDataSize").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(EclGetAlignedDataSize)).ToLocalChecked());

  exports->Set(Nan::New<String>("getMinimumEncodeSize").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(EclGetMinimumEncodeSize)).ToLocalChecked());

   exports->Set(Nan::New<String>("getFragmentSize").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(EclGetFragmentSize)).ToLocalChecked());
}

NODE_MODULE(node_eclib, InitAll)
