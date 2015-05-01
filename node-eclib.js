// Basic structures of the ECLib library

// We will not require anything right now.
//

var addon = require('bindings')('Release/node-eclib.node')
var ECLibUtil = require("./eclib-util.js");
var enums = require("./eclib-enum.js");

function ECLib(){
	this.eclibUtil = new ECLibUtil();

	console.log("Blank function");
}


ECLib.prototype.create = function ( ec_backend_id, k, m, w, hd, ct, backend_args ,callback) {
	
	var instance_descriptor_id = -1;
	var err = {};


	if ( this.eclibUtil.validateInstanceCreateParams(ec_backend_id, k, m, w, hd, ct)  ){
		
		instance_descriptor_id = addon.create();
		
		if (instance_descriptor_id <=0 ){
			err.errorcode =  instance_descriptor_id ;
			err.message = this.eclibUtil.getErrorMessage(instance_descriptor_id);
		}

	} else {

		err.errorcode =  enums.ErrorCode.EBACKENDNOTAVAIL ;
		err.message = this.eclibUtil.getErrorMessage(err.errorcode);
		instance_descriptor_id = err.errorcode ;
	}

	if (!callback){
		return instance_descriptor_id;
	}

	callback.call(instance_descriptor_id, err);

};

ECLib.prototype.destroy = function(instance_descriptor_id,callback){
	
	console.log("JS destroy#");
	console.log(addon.destroy());
	//callback.call(resultcode,err)
};

ECLib.prototype.encode = function(instance_descriptor_id, orig_data,orig_data_size,callback){

	console.log("JS encode ");
	console.log(addon.encode());

	//result.resultcode = 1//2/3/4/5
	//result.encoded_data = "" ,result.encoded_parity ="", result.fragment_len =12312312312312;
	//callback.call(result,err)
};

ECLib.prototype.encodeCleanup = function(instance_descriptor_id, encoded_data,encoded_parity,callback){
	
	console.log("JS encodeCleanup ");
	console.log(addon.encodeCleanup());
	//callback.call(resultcode,err)
};

ECLib.prototype.decode = function(instance_descriptor_id, available_fragments
							 , num_fragments, fragment_len, callback){

	console.log("JS decode #");
	console.log(addon.decode());
	//result.resultcode = 1//2/3/4/5
	//result.out_data = "" ,result.out_data_len =""
	//callback.call(result,err)
};

ECLib.prototype.decodeCleanup = function(instance_descriptor_id, data,callback){

	console.log("JS decode_cleanup #");
	console.log(addon.decodeCleanup());
	//callback.call(resultcode,err)
};


ECLib.prototype.reconstructFragment = function(instance_descriptor_id, available_fragments
	, num_fragments, fragment_len,destination_idx, callback) {

	console.log("JS reconstructFragment #");
	console.log(addon.reconstructFragment());

	//result.resultcode = 1//2/3/4/5
	//result.out_fragment = ""
	//callback.call(result,err)

};

ECLib.prototype.fragmentsNeeded = function (instance_descriptor_id,fragments_to_reconstruct
					,fragments_to_exclude,fragments_needed,callback){
	
	console.log("from fragmentsNeeded method");
	//callback.call(resultcode,err)
}

ECLib.prototype.getFragmentMetadata = function(fragment, fragment_metadata, callback){

	console.log("from getFragmentMetadata method");
	//callback.call(resultcode,err)

};

ECLib.prototype.isInvalidFragment = function(instance_descriptor_id, fragment, callback){

	console.log("from isInvalidFragment method");
	//callback.call(resultcode,err)
};

ECLib.prototype.verifyStripeMetadata = function (instance_descriptor_id, fragments
					, num_fragments, callback){

	console.log("from verifyStripeMetadata method");
	//callback.call(resultcode,err)
};

ECLib.prototype.getAlignedDataSize = function(instance_descriptor_id, data_len, callback){

	console.log("from getAlignedDataSize method");
	//callback.call(resultlength, err)
};

ECLib.prototype.getMinimumEncodeSize = function (instance_descriptor_id, callback){

	console.log("from getMinimumEncodeSize method");
	//callback.call(resultminimumlength, err)
};

ECLib.prototype.getFragmentSize = function(instance_descriptor_id, data_len ,callback){

	console.log("from getFragmentSize method");
	//callback.call(resultfragmentsize, err)

};

module.exports = ECLib 