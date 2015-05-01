// This class will be act as  the enum container for the node-eclib module

module.exports = {
    BackendId: {
	    "EC_BACKEND_NULL" 					: 0,
	    "EC_BACKEND_JERASURE_RS_VAND" 		: 1,
	    "EC_BACKEND_JERASURE_RS_CAUCHY" 	: 2,
	    "EC_BACKEND_FLAT_XOR_HD" 			: 3,
	    "EC_BACKEND_ISA_L_RS_VAND" 			: 4,
	    "EC_BACKEND_SHSS" 					: 5,
	    "EC_BACKENDS_MAX" 					: 99
    },

    ChecksumType: {
    	"CHKSUM_NONE"		: 1,
	    "CHKSUM_CRC32" 		: 2,
	    "CHKSUM_MD5" 		: 3,
	    "CHKSUM_TYPES_MAX" 	: 99
    },

    ErrorCode : {
    	"EBACKENDNOTSUPP" 		: 200,
	    "EECMETHODNOTIMPL" 		: 201,
	    "EBACKENDINITERR" 		: 202,
	    "EBACKENDINUSE" 		: 203,
	    "EBACKENDNOTAVAIL" 		: 204,
	    "EBADCHKSUM" 			: 205,
	    "EINVALIDPARAMS" 		: 206,
	    "EBADHEADER" 			: 207,
	    "EINSUFFFRAGS" 			: 208
    }
};