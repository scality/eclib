include "libutil.h"

using namespace v8;


struct ec_args *create_ec_args(ec_backend_id_t be, ec_checksum_type_t ct, int backend_test_idx)
{
    size_t ec_args_size = sizeof(struct ec_args);
    struct ec_args *template = NULL;
    struct ec_args** backend_args_array = NULL;
    int i = 0;

    switch(be) {
        case EC_BACKEND_NULL:
            backend_args_array = null_test_args;
            break;
        case EC_BACKEND_JERASURE_RS_VAND:
            backend_args_array = jerasure_rs_vand_test_args;
            break;
        case EC_BACKEND_JERASURE_RS_CAUCHY:
            backend_args_array = jerasure_rs_cauchy_test_args;
            break;
        case EC_BACKEND_FLAT_XOR_HD:
            backend_args_array = flat_xor_test_args;
            break;
        case EC_BACKEND_ISA_L_RS_VAND:
            backend_args_array = isa_l_test_args;
            break;
        case EC_BACKEND_SHSS:
            backend_args_array = shss_test_args;
            break;
        default:
            return NULL;
    }

    while (NULL != backend_args_array && NULL != backend_args_array[i]) {
        if (i == backend_test_idx) {
            template = backend_args_array[i];
            break;
        }
        i++;
    }

    if (NULL == template) {
      return NULL;
    }

    struct ec_args *args = malloc(ec_args_size);
    assert(args);
    memcpy(args, template, ec_args_size);
    args->ct = ct;
    return args;
}

struct ec_backend_id_t get_ec_backend_id(int id){

	// main logics will be implemented here

	return EC_BACKEND_NULL;
}

struct ec_checksum_type_t get_ec_checksum_type(int ct){

	// main logics will be implemented here

	return CHKSUM_NONE;

}


