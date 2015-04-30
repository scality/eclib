#include <node.h>
#include <nan.h>

#include "asyncencode.h"


NAN_METHOD(eclEncode) {
  NanScope();

  NanReturnValue(NanNew("C++ Encode ##### not implemented "));
}


NAN_METHOD(eclEncodeCleanup) {
  NanScope();
  NanReturnValue(NanNew("C++ EncodeCleanUp #### not implemented"));
}
