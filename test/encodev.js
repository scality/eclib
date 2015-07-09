// test encodev

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
    
    var sz1 = 123434;
    var sz2 = 343434;
    var ref_buf1 = crypto.randomBytes(sz1);
    var ref_buf2 = crypto.randomBytes(sz2);
    var ref_buf = buffertools.concat(ref_buf1, ref_buf2);
    var buf_array = [ref_buf1, ref_buf2];

    eclib.encodev(2, buf_array, sz1 + sz2,
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

test_one("xor", {"bc_id": enums.BackendId["EC_BACKEND_FLAT_XOR_HD"], "k": 3, "m": 3, "hd": 3});
