// launch multiple encodes/decodes in parallel

var ECLib = require('../node-eclib.js');
var enums = require('../eclib-enum.js');
var ECLibUtil = require('../eclib-util.js');
var buffertools = require("buffertools");
var crypto = require('crypto');
var hexdump = require('hexdump-nodejs');

console.log("ECLib testing");

function test_one(name, opts) {
    console.log("create " + name);

    var eclib = new ECLib(opts);
    
    eclib.init();
    
    var ref_buf = crypto.randomBytes(10000000);

    eclib.encode(ref_buf,
		 function(status, encoded_data, encoded_parity, encoded_fragment_length) {
		     console.log(name + " Encode Done status=" + status + " fragment_length=" + encoded_fragment_length);
		     
		     k = eclib.opt.k;
		     m = eclib.opt.m;
		     
		     x = k-1; //available data fragments
		     y = m;   //available parity fragments
		     
		     var fragments = [];
		     var i, j;
		     j = 0;
		     //console.log('data:');
		     for (i = 0;i < x;i++) {
			 //console.log(hexdump(encoded_data[i]));
			 fragments[j++] = encoded_data[i];
		     }
		     //console.log('codings:');
		     for (i = 0;i < y;i++) {
			 //console.log(hexdump(encoded_parity[i]));
			 fragments[j++] = encoded_parity[i];
		     }
		     
		     eclib.decode(fragments, x+y, encoded_fragment_length, 0,
				  function(status, out_data, out_data_length) {
				      console.log(name + " Decode Done status=" + status + " data_length=" + out_data_length);

				      //console.log(hexdump(out_data));
				      
				      if (buffertools.compare(out_data, ref_buf) == 0)
					  console.log(name + " OK Buffers are identical");
				      else
					  console.log(name + " Nok buffers differ");
				      eclib.destroy();
				      delete ref_buf;
				  }
				 );
		 }
		);
}

//console.log(hexdump(ref_buf));

//EC_BACKEND_NULL
//EC_BACKEND_JERASURE_RS_VAND
//EC_BACKEND_JERASURE_RS_CAUCHY
//EC_BACKEND_FLAT_XOR_HD
//EC_BACKEND_ISA_L_RS_VAND
//EC_BACKEND_SHSS
//EC_BACKEND_ISA_L_RS_CAUCHY

//test_one("null", {"bc_id": enums.BackendId["EC_BACKEND_NULL"], "k": 8, "m": 4});
test_one("xor", {"bc_id": enums.BackendId["EC_BACKEND_FLAT_XOR_HD"], "k": 3, "m": 3, "hd": 3});
test_one("vand", {"bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_VAND"], "k": 10, "m": 4, "w": 16, "hd": 5});
test_one("vand_44", {"bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_VAND"], "k": 4, "m": 4, "w": 16, "hd": 5});
test_one("vand_48", {"bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_VAND"], "k": 4, "m": 8, "w": 16, "hd": 9});
test_one("vand_1010", {"bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_VAND"], "k": 10, "m": 10, "w": 16, "hd": 11});
test_one("cauchy", {"bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_CAUCHY"], "k": 10, "m": 4, "w": 4, "hd": 5});
test_one("cauchy_44", {"bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_CAUCHY"], "k": 4, "m": 4, "w": 4, "hd": 5});
test_one("cauchy_48", {"bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_CAUCHY"], "k": 4, "m": 8, "w": 8, "hd": 9});
test_one("cauchy_1010", {"bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_CAUCHY"], "k": 10, "m": 10, "w": 8, "hd": 11});
test_one("isa_l", {"bc_id": enums.BackendId["EC_BACKEND_ISA_L_RS_VAND"], "k": 10, "m": 4, "w": 8, "hd": 5});
test_one("isa_l_44", {"bc_id": enums.BackendId["EC_BACKEND_ISA_L_RS_VAND"], "k": 4, "m": 4, "w": 8, "hd": 5});
test_one("isa_l_1010", {"bc_id": enums.BackendId["EC_BACKEND_ISA_L_RS_VAND"], "k": 10, "m": 10, "w": 8, "hd": 11});
