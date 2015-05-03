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

  exports->Set(NanNew<String>("create"),
    NanNew<FunctionTemplate>(EclCreate)->GetFunction());

  exports->Set(NanNew<String>("destroy"),
    NanNew<FunctionTemplate>(EclDestroy)->GetFunction());

  exports->Set(NanNew<String>("encode"),
    NanNew<FunctionTemplate>(eclEncode)->GetFunction());

  exports->Set(NanNew<String>("encodeCleanup"),
    NanNew<FunctionTemplate>(eclEncodeCleanup)->GetFunction());


  exports->Set(NanNew<String>("decode"),
    NanNew<FunctionTemplate>(eclDecode)->GetFunction());

  exports->Set(NanNew<String>("decodeCleanup"),
    NanNew<FunctionTemplate>(eclDecodeCleanup)->GetFunction());

   exports->Set(NanNew<String>("reconstructFragment"),
    NanNew<FunctionTemplate>(EclReconstructFragment)->GetFunction());

  exports->Set(NanNew<String>("fragmentsNeeded"),
    NanNew<FunctionTemplate>(EclFragmentsNeeded)->GetFunction());

  exports->Set(NanNew<String>("getFragmentMetadata"),
    NanNew<FunctionTemplate>(EclGetFragmentMetadata)->GetFunction());

   exports->Set(NanNew<String>("isInvalidFragment"),
    NanNew<FunctionTemplate>(EclIsInvalidFragment)->GetFunction());

   exports->Set(NanNew<String>("verifyStripeMetadata"),
    NanNew<FunctionTemplate>(EclVerifyStripeMetadata)->GetFunction());

  exports->Set(NanNew<String>("getAlignedDataSize"),
    NanNew<FunctionTemplate>(EclGetAlignedDataSize)->GetFunction());

  exports->Set(NanNew<String>("getMinimumEncodeSize"),
    NanNew<FunctionTemplate>(EclGetMinimumEncodeSize)->GetFunction());

   exports->Set(NanNew<String>("getFragmentSize"),
    NanNew<FunctionTemplate>(EclGetFragmentSize)->GetFunction());


   exports->Set(NanNew<String>("testpad"),
    NanNew<FunctionTemplate>(EclGetFragmentSize)->GetFunction());

}

NODE_MODULE(addon, InitAll)

