#include <nan.h>
#include <erasurecode.h>
#include <erasurecode_helpers.h>
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
    NanNew<FunctionTemplate>(Create)->GetFunction());

  exports->Set(NanNew<String>("destroy"),
    NanNew<FunctionTemplate>(Destroy)->GetFunction());

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


}

NODE_MODULE(addon, InitAll)

