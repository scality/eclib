#include <nan.h>
#include <liberasurecode/erasurecode.h>
#include <liberasurecode/erasurecode_helpers.h>


NAN_METHOD(create);
NAN_METHOD(destroy);
NAN_METHOD(EclFragmentsNeeded);
NAN_METHOD(EclGetFragmentMetadata);
NAN_METHOD(EclIsInvalidFragment);
NAN_METHOD(EclVerifyStripeMetadata);
NAN_METHOD(EclGetAlignedDataSize);
NAN_METHOD(EclGetMinimumEncodeSize);
NAN_METHOD(EclGetFragmentSize);
