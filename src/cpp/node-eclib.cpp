#include <nan.h>
#include <erasurecode.h>
#include <erasurecode_helpers.h>
#include "libmain.h"

using v8::FunctionTemplate;
using v8::Handle;
using v8::Object;
using v8::String;


void InitAll(Handle<Object> exports) {

  exports->Set(NanNew<String>("create"),
    NanNew<FunctionTemplate>(Create)->GetFunction());

  exports->Set(NanNew<String>("destroy"),
    NanNew<FunctionTemplate>(Destroy)->GetFunction());
}

NODE_MODULE(hello, InitAll)

