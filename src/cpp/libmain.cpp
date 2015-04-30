#include <node.h>
#include <nan.h>

#include "libmain.h"


NAN_METHOD(Create) {
  NanScope();


  NanReturnValue(NanNew("C++ create "));
}

NAN_METHOD(Destroy) {
  NanScope();


  NanReturnValue(NanNew("C++ destroy "));
}