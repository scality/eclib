#include <nan.h>

#include "libmain.h"
#include "libutil.h"

using namespace v8;
using namespace std;

NAN_METHOD(create) {
  Nan::HandleScope scope;

  ec_args ec_args;
  ec_backend_id_t ec_backend_id;
  ec_checksum_type_t ct;

  if (info.Length() < 6) {
      Nan::ThrowTypeError("Wrong number of arguments");
      return ;
  }

  int _id = info[0]->NumberValue();
  int k = info[1]->NumberValue();
  int m = info[2]->NumberValue();
  int w = info[3]->NumberValue();
  int hd = info[4]->NumberValue();
  int _ct = info[5]->NumberValue();

  ec_backend_id = get_ec_backend_id(_id);
  ct  = get_ec_checksum_type(_ct);

  memset(&ec_args, 0, sizeof (ec_args));
  ec_args.k = k;
  ec_args.m = m;
  ec_args.w = w;
  ec_args.hd = hd;
  ec_args.ct = ct;

  int desc = liberasurecode_instance_create(ec_backend_id, &ec_args);

  if (desc <= 0) {
      Nan::ThrowTypeError("Liberasurecode initialization failed");
      return ;
  }

      info.GetReturnValue().Set(Nan::New(desc));
    }

    NAN_METHOD(destroy) {
      Nan::HandleScope scope;

      int arg0 = info[0]->NumberValue();
      int status = liberasurecode_instance_destroy(arg0);

      if (status <= 0)
          Nan::ThrowTypeError("Liberasurecode instance destroy failed");
      return ;
    }

    NAN_METHOD(EclFragmentsNeeded) {
      Nan::HandleScope scope;
      info.GetReturnValue().Set(Nan::New("C++ FragmentsNeeded ").ToLocalChecked());
    }

    NAN_METHOD(EclGetFragmentMetadata) {
      Nan::HandleScope scope;
      info.GetReturnValue().Set(Nan::New("C++ GetFragmentMetadata ").ToLocalChecked());
    }

    NAN_METHOD(EclIsInvalidFragment) {
      Nan::HandleScope scope;
      info.GetReturnValue().Set(Nan::New("C++ IsInvalidFragment ").ToLocalChecked());
    }

    NAN_METHOD(EclVerifyStripeMetadata) {
      Nan::HandleScope scope;
      info.GetReturnValue().Set(Nan::New("C++ VerifyStripeMetadata ").ToLocalChecked());
    }

    NAN_METHOD(EclGetAlignedDataSize) {
      Nan::HandleScope scope;
      info.GetReturnValue().Set(Nan::New("C++ GetAlignedDataSize ").ToLocalChecked());
    }

    NAN_METHOD(EclGetMinimumEncodeSize) {
      Nan::HandleScope scope;
      info.GetReturnValue().Set(Nan::New("C++ GetMinimumEncodeSize ").ToLocalChecked());
    }

    NAN_METHOD(EclGetFragmentSize) {
      Nan::HandleScope scope;
      info.GetReturnValue().Set(Nan::New("C++ GetFragmentSize").ToLocalChecked());
}
