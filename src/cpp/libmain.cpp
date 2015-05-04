#include <node.h>
#include <nan.h>

#include "libmain.h"
#include "libutil.h"

using namespace v8;


struct ec_args flat_xor_hd_args = {
    .k = 3,
    .m = 3,
    .hd = 3,
    .ct = CHKSUM_NONE,
};



//We will add any implementation here then move it to the accurate palce/class
NAN_METHOD(testpad){
  NanScope();

  ec_args *result;

  size_t ec_args_size = sizeof(struct ec_args);
  result = (ec_args*)malloc( sizeof( ec_args ) );


  if(!result){

      result->k = 3;
      result->m = 3;
      result->hd = 3;
      result->ct = CHKSUM_NONE;
  }



  int desc = liberasurecode_instance_create(EC_BACKEND_FLAT_XOR_HD, result);


  
  NanReturnValue( NanNew(desc));



//  NanReturnUndefined();
}




NAN_METHOD(EclCreate) {
  NanScope();

  ec_args *result;
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

  ec_backend_id = get_ec_backend_id(_id);
  ct  = get_ec_checksum_type(_ct);


  // TODO: Have to rewrite this code block 
  result = (ec_args*)malloc( sizeof( ec_args ) );
  
  if(!result){

      result->k = k;
      result->m = m;

      if (w > 0){
        result->w = w;
      }

      if (hd > 0){
        result->hd = hd;
      }

      result->ct = ct;
  }

 int desc = liberasurecode_instance_create(ec_backend_id, result);



 int desc2 = liberasurecode_instance_destroy(desc);
  
  NanReturnValue( NanNew(desc));
}

NAN_METHOD(EclDestroy) {
  
  NanScope();

  int arg0 = args[0]->NumberValue();
  int desc = liberasurecode_instance_destroy(arg0);

  //Local<Number> resultcode = NanNew(desc);

  NanReturnValue(NanNew(desc));
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


