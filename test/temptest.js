// Just trying to do the manual checking of the method existenance 
// Will remove the file when we can communicate with the real libarary 
// and can add the mocha test files.

var ECLib = require('../node-eclib.js');

(function() {

	console.log("JS method existense testing");

	var eclib = new ECLib();

	eclib.create();
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
	eclib.getFragmentSize();

	console.log("ALL the methods are OK.");


})();