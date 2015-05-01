#include <node.h>
#include <nan.h>
#include <erasurecode.h>
#include <erasurecode_helpers.h>

#include "asyncreconstruction.h"

NAN_METHOD(EclReconstructFragment) {
  NanScope();

  NanReturnValue(NanNew("C++ Reconstruct Fragment"));
}
