#include <nan.h>

#include "libmain.h"
#include "asyncencode.h"
#include "asyncdecode.h"
#include "asyncreconstruction.h"


using v8::FunctionTemplate;
using v8::Handle;
using v8::Object;
using v8::String;

NAN_MODULE_INIT(Init) {
  NAN_EXPORT(target, create);
  NAN_EXPORT(target, destroy);
  NAN_EXPORT(target, EclEncode);
  NAN_EXPORT(target, encodev);
  NAN_EXPORT(target, decode);
  NAN_EXPORT(target, EclReconstructFragment);
  NAN_EXPORT(target, EclFragmentsNeeded);
  NAN_EXPORT(target, EclGetFragmentMetadata);
  NAN_EXPORT(target, EclIsInvalidFragment);
  NAN_EXPORT(target, EclVerifyStripeMetadata);
  NAN_EXPORT(target, EclGetAlignedDataSize);
  NAN_EXPORT(target, EclGetMinimumEncodeSize);
  NAN_EXPORT(target, EclGetFragmentSize);
}

NODE_MODULE(node_eclib, Init)
