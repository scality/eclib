#include "libutil.h"


// Have to rewrite the method to support more parameters
ec_args * el_create_ec_args(int k, int m, int w, int hd, ec_checksum_type_t ct){

    ec_args *result;
    result = (ec_args*)malloc( sizeof( ec_args ) );
    
    if(!result){

        result->k = k;
        result->m = m;
        result->w = w;
        result->hd = hd;
        result->ct;
    }

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


