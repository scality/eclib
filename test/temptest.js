// Just trying to do the manual checking of the method existenance 
// Will remove the file when we can communicate with the real libarary 
// and can add the mocha test files.

var ECLib = require('../node-eclib.js');
var enums = require('../eclib-enum.js');
var ECLibUtil = require('../eclib-util.js');
var buffertools = require("buffertools");
var crypto = require('crypto');
var hexdump = require('hexdump-nodejs');

console.log("ECLib testing");

function test_one(opts) {
    var eclib = new ECLib(opts);
    
    desc = eclib.init();
    
    //eclib.testpad();

    //ref_buf = new Buffer(10000);
    //buffertools.fill(ref_buf, 'z');
    ref_buf = crypto.randomBytes(1000);
    
    console.log(hexdump(ref_buf));
    
    eclib.encode(ref_buf,
		 function(status, encoded_data, encoded_parity, encoded_fragment_length) {
		     console.log("Encode Done status=" + status + " fragment_length=" + encoded_fragment_length);
		     
		     k = eclib.opt.k;
		     m = eclib.opt.m;
		     
		     x = k-1; //available data fragments
		     y = m;   //available parity fragments
		     
		     var fragments = [];
		     var i, j;
		     j = 0;
		     console.log('data:');
		     for (i = 0;i < x;i++) {
			 console.log(hexdump(encoded_data[i]));
			 fragments[j++] = encoded_data[i];
		     }
		     console.log('codings:');
		     for (i = 0;i < y;i++) {
			 console.log(hexdump(encoded_parity[i]));
			 fragments[j++] = encoded_parity[i];
		     }
		     
		     eclib.decode(fragments, x+y, encoded_fragment_length, 0,
				  function(status, out_data, out_data_length) {
				      console.log("Decode Done status=" + status + " data_length=" + out_data_length);

				      console.log(hexdump(out_data));
				      
				      if (buffertools.compare(out_data, ref_buf) == 0)
					  console.log("OK Buffers are identical");
				      else
					  console.log("Nok buffers differ");
				  }
				 );
         console.log("Right after decode called");
		     
		 }
		);

    delete ref_buf;

    eclib.destroy();
}

//EC_BACKEND_NULL
//EC_BACKEND_JERASURE_RS_VAND
//EC_BACKEND_JERASURE_RS_CAUCHY
//EC_BACKEND_FLAT_XOR_HD
//EC_BACKEND_ISA_L_RS_VAND
//EC_BACKEND_SHSS
//EC_BACKEND_ISA_L_RS_CAUCHY

test_one({
    "bc_id": enums.BackendId["EC_BACKEND_FLAT_XOR_HD"],
    "k": 3,
    "m": 3,
    "hd": 3
});

global.gc(); //requires --expose-gc
