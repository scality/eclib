// Just trying to do the manual checking of the method existenance 
// Will remove the file when we can communicate with the real libarary 
// and can add the mocha test files.

var ECLib = require('../node-eclib.js');
var enums = require('../eclib-enum.js');
var ECLibUtil = require('../eclib-util.js');
var buffertools = require("buffertools");

(function() {

    console.log("ECLib testing");
    
    var eclib = new ECLib({
	"bc_id": enums.BackendId["EC_BACKEND_JERASURE_RS_CAUCHY"],
	"k": 9,
	"m": 3
    });
    
    desc = eclib.init();
    console.log("lib descriptor: " + desc);
    
    ref_buf = new Buffer("foo");

    eclib.encode(ref_buf,
		 function(status, encoded_data, encoded_parity, encoded_fragment_length) {
		     console.log("Encode Done status=" + status + " fragment_length=" + encoded_fragment_length);

		     k = eclib.opt.k;
		     m = eclib.opt.m;
		     
		     x = k-m; //available data fragments
		     y = m;   //available parity fragments

		     var fragments = [];
		     var i, j;
		     j = 0;
		     for (i = 0;i < x;i++) {
			 fragments[j++] = encoded_data[i];
		     }
		     for (i = 0;i < y;i++) {
			 fragments[j++] = encoded_parity[i];
		     }

		     eclib.decode(fragments, x+y, encoded_fragment_length, 0,
				  function(status, out_data, out_data_length) {
				      console.log("Decode Done status=" + status + " data_length=" + out_data_length);
				      
				      var buffer = new Buffer(out_data.length);
				      out_data.copy(buffer);

				      if (buffertools.compare(buffer, ref_buf) == 0)
					  console.log("OK Buffers are identical");
				      else
					  console.log("Nok buffers differ");
				      
				  }
				 );
		     
		 }
		);

    /*
      eclib.destroy();
      eclib.encode();
      eclib.encodeCleanup();
      eclib.decode();
      eclib.decodeCleanup();
      eclib.reconstructFragment(); 
      eclib.fragmentsNeeded();
      
      eclib.getFragmentMetadata();
      eclib.isInvalidFragment();
      eclib.verifyStripeMetadata();
      eclib.getAlignedDataSize();
      eclib.getMinimumEncodeSize();
      eclib.getFragmentSize();*/
    

})();
