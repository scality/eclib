// Just trying to do the manual checking of the method existenance 
// Will remove the file when we can communicate with the real libarary 
// and can add the mocha test files.

var ECLib = require('../node-eclib.js');
var enums = require('../eclib-enum.js');
var ECLibUtil = require('../eclib-util.js');
var buffertools = require("buffertools");
var crypto = require('crypto');
var hexdump = require('hexdump-nodejs');
var threads = require('threads_a_gogo');

console.log("ECLib testing");

function decode_result(status, out_data, out_data_length) {
    console.log("Decode Done status=" + status + " data_length=" + out_data_length);
    
    //console.log(hexdump(out_data));
    
    if (buffertools.compare(out_data, ref_buf) == 0)
	console.log("OK Buffers are identical");
    else
	console.log("Nok buffers differ");
}

function encode_result(status, encoded_data, encoded_parity, encoded_fragment_length) {
    console.log("Encode Done status=" + status + " fragment_length=" + encoded_fragment_length);
    
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
    
    eclib.decode(fragments, x+y, encoded_fragment_length, 0, decode_result);
}

function test_one() {

    //ref_buf = new Buffer(10000);
    //buffertools.fill(ref_buf, 'z');
    //console.log(hexdump(ref_buf));

    eclib.encode(ref_buf, encode_result);
}

//EC_BACKEND_NULL
//EC_BACKEND_JERASURE_RS_VAND
//EC_BACKEND_JERASURE_RS_CAUCHY
//EC_BACKEND_FLAT_XOR_HD
//EC_BACKEND_ISA_L_RS_VAND
//EC_BACKEND_SHSS

var eclib = new ECLib({
    "bc_id": enums.BackendId["EC_BACKEND_FLAT_XOR_HD"],
    "k": 3,
    "m": 3,
    "hd": 3
});

eclib.init()

//eclib.testpad();

threadPool = threads.createPool(10);

ref_buf = crypto.randomBytes(100000000);

threadPool.all.eval('test_one', function cb(err, data) {
    process.stdout.write(" [" + this.id + "]");
    test_one();
});

console.log("encode/decode started in bg");

//eclib.destroy();

//global.gc(); //requires --expose-gc
