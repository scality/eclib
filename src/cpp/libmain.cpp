#include <node.h>
#include <nan.h>

#include "libmain.h"
#include "libutil.h"

using namespace v8;
using namespace std;

NAN_METHOD(EclCreate) {
  NanScope();

  ec_args ec_args;
  ec_backend_id_t ec_backend_id;
  ec_checksum_type_t ct;

  if (args.Length() < 6) {
    NanThrowTypeError("Wrong number of arguments");
    NanReturnUndefined();
  }

  int _id = args[0]->NumberValue();
  int k = args[1]->NumberValue();
  int m = args[2]->NumberValue();
  int w = args[3]->NumberValue();
  int hd = args[4]->NumberValue();
  int _ct = args[5]->NumberValue();

  //printf("id=%d k=%d m=%d w=%d hd=%d ct=%d\n", _id, k, m, w, hd, _ct);

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
    NanThrowTypeError("Liberasurecode initialization failed");
    NanReturnUndefined();
  }
  
  NanReturnValue( NanNew(desc));
}

NAN_METHOD(EclDestroy) {
  
  NanScope();

  int arg0 = args[0]->NumberValue();
  int status = liberasurecode_instance_destroy(arg0);

  if (status <= 0) {
    NanThrowTypeError("Liberasurecode instance destroy failed");
    NanReturnUndefined();
  }

  NanReturnUndefined();
}

NAN_METHOD(EclFragmentsNeeded) {
  NanScope();
  NanReturnValue(NanNew("C++ FragmentsNeeded "));
}

NAN_METHOD(EclGetFragmentMetadata) {
  NanScope();
  NanReturnValue(NanNew("C++ GetFragmentMetadata "));
}

NAN_METHOD(EclIsInvalidFragment) {
  NanScope();
  NanReturnValue(NanNew("C++ IsInvalidFragment "));
}

NAN_METHOD(EclVerifyStripeMetadata) {
  NanScope();
  NanReturnValue(NanNew("C++ VerifyStripeMetadata "));
}

NAN_METHOD(EclGetAlignedDataSize) {
  NanScope();
  NanReturnValue(NanNew("C++ GetAlignedDataSize "));
}

NAN_METHOD(EclGetMinimumEncodeSize) {
  NanScope();
  NanReturnValue(NanNew("C++ GetMinimumEncodeSize "));
}

NAN_METHOD(EclGetFragmentSize) {
  NanScope();
  NanReturnValue(NanNew("C++ GetFragmentSize"));
}
