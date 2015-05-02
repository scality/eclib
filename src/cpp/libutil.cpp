#include "libutil.h"



ec_args *create_ec_args(ec_backend_id_t be, ec_checksum_type_t ct, int backend_test_idx){

    ec_args *result;

    result = (ec_args*)malloc( sizeof( ec_args ) );
   

    return result;
}






ec_backend_id_t get_ec_backend_id(int id){

	switch(id){
        case 0:
            return EC_BACKEND_NULL;
            break;
        case 1:
            return EC_BACKEND_JERASURE_RS_VAND;
            break;
        case 2:
            return EC_BACKEND_JERASURE_RS_CAUCHY;
            break;
        case 3:
            return EC_BACKEND_FLAT_XOR_HD;
            break;
        case 4:
            return EC_BACKEND_ISA_L_RS_VAND;
            break;
        case 5:
            return EC_BACKEND_SHSS;
            break;
        case 99:
            return EC_BACKENDS_MAX;
            break;
        default:
            return EC_BACKEND_NULL;
            break;
    }
}


ec_checksum_type_t get_ec_checksum_type(int ct){

	// main logics will be implemented here


    switch(ct){
        case 0:
            return CHKSUM_NONE;
            break;
        case 1:
            return CHKSUM_CRC32;
            break;
        case 2:
            return CHKSUM_MD5;
            break;
        case 99:
            return CHKSUM_TYPES_MAX;
            break;
        default:
            return CHKSUM_NONE;
            break;
    }

}


