#include <node.h>
#include <nan.h>

#include "asyncdecode.h"


NAN_METHOD(eclDecode) {
  NanScope();

  NanReturnValue(NanNew("C++ Decode ##### not implemented "));
}


NAN_METHOD(eclDecodeCleanup) {
  NanScope();
  NanReturnValue(NanNew("C++ DecodeCleanUp #### not implemented"));
}
