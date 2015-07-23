#include <node.h>
#include <nan.h>
#include <liberasurecode/erasurecode.h>
#include <liberasurecode/erasurecode_helpers.h>


NAN_METHOD(EclCreate);
NAN_METHOD(EclDestroy);
NAN_METHOD(EclFragmentsNeeded);
NAN_METHOD(EclGetFragmentMetadata);
NAN_METHOD(EclIsInvalidFragment);
NAN_METHOD(EclVerifyStripeMetadata);
NAN_METHOD(EclGetAlignedDataSize);
NAN_METHOD(EclGetMinimumEncodeSize);
NAN_METHOD(EclGetFragmentSize);
NAN_METHOD(testpad);

