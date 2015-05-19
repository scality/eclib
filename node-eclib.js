// Basic structures of the ECLib library

// We will not require anything right now.
//

var addon = require('bindings')('Release/node-eclib.node')
var ECLibUtil = require("./eclib-util.js");
var enums = require("./eclib-enum.js");
var __ = require('underscore');

function ECLib(opts){
	var d_options = {"bc_id":0,  //backend ID
			 "k":8,      //number of data fragments
			 "m":4,      //number of parity fragments
			 "w":0,      //word size, in bits
			 "hd":0,     //hamming distance (=m for Reed-Solomon)
			 "ct":0 };   //fragment checksum type

	this.opt = {};
	__.extend(this.opt,d_options);

	if (__.size(opts) > 0){
		__.extend(this.opt, opts );
	}

	this.ins_id = null;
	this.eclibUtil = new ECLibUtil();
	this.isValidInstance = function(){

		return ( __.isUndefined(this.ins_id));

	};

	this.resetOptions = function(){
		this.opt = null;
		__.extend(this.opt,d_options);
	};
}

ECLib.prototype = {
	
	init: function(callback){
		//This will be the  create method of the ECLIB
		var instance_descriptor_id = -1;
		var err = {};
		var o= this.opt;
		if ( this.eclibUtil.validateInstanceCreateParams(o.bc_id, o.k, o.m, o.w, o.hd, o.ct)  ){

			instance_descriptor_id = addon.create(o.bc_id, o.k, o.m, o.w, o.hd, o.ct);
			
			if (instance_descriptor_id <=0 ){
				err.errorcode =  instance_descriptor_id ;
				err.message = this.eclibUtil.getErrorMessage(instance_descriptor_id);
			}else {
				this.ins_id =instance_descriptor_id;
			}

		} else {
			err.errorcode =  enums.ErrorCode.EINVALIDPARAMS ;
			err.message = this.eclibUtil.getErrorMessage(err.errorcode);
			instance_descriptor_id = err.errorcode ;
		}


		if (!callback){

			return instance_descriptor_id;
		}

		callback.call(this,instance_descriptor_id, err);



	},
	destroy: function(callback){

		var resultcode = enums.ErrorCode.EBACKENDNOTAVAIL; 
		var err = {};

		if (this.isValidInstance()){
			resultcode = addon.destroy(this.ins_id);
			if ( resultcode !== 0){
				err.errorcode = resultcode;
				err.message = this.eclibUtil.getErrorMessage(resultcode);
			}

		} else {
		
			err.errorcode = resultcode;
			err.message = this.eclibUtil.getErrorMessage(resultcode);
		
		}

		if (!callback){
			return resultcode;
		}

		callback.call(this,resultcode,err);

	},

	encode: function(o_data,callback){
	    var o = this.opt;

	    addon.encode(this.ins_id, o.k, o.m, o_data, o_data.length, callback);
	},

	encodeCleanup: function(callback){


	},

	decode:function(d_data,n_frags,frag_len,force_metadata_check,callback){
	    addon.decode(this.ins_id, d_data, n_frags, frag_len, force_metadata_check, callback);
	},

	decodeCleanup:function(callback){
	},

	getFragmentMetadata: function(fragment, fragment_metadata, callback){


	}, 

	setOptions: function(opts){
		__.extend(this.opt,opts);
	},

	testpad:function(num,callback){
		//Use this method to do anything you want
	    console.log("-------------- from the test pad---");
	    console.log( addon.testpad(num,callback));
	}
}


/*

ECLib.prototype.create = function ( ec_backend_id, k, m, w, hd, ct, backend_args,callback) {
	
	var instance_descriptor_id = -1;
	var err = {};

	if ( this.eclibUtil.validateInstanceCreateParams(ec_backend_id, k, m, w, hd, ct)  ){

		instance_descriptor_id = addon.create(ec_backend_id, k, m, w, hd, ct);
		
		if (instance_descriptor_id <=0 ){
			err.errorcode =  instance_descriptor_id ;
			err.message = this.eclibUtil.getErrorMessage(instance_descriptor_id);
		}

	} else {
		err.errorcode =  enums.ErrorCode.EINVALIDPARAMS ;
		err.message = this.eclibUtil.getErrorMessage(err.errorcode);
		instance_descriptor_id = err.errorcode ;
	}

	if (!callback){

		return instance_descriptor_id;
	}

	callback.call(this,instance_descriptor_id, err);

};

ECLib.prototype.destroy = function(instance_descriptor_id,callback){
	
	var resultcode = enums.ErrorCode.EINVALIDPARAMS; 
	var err = {};

	if (!instance_descriptor_id){

		resultcode = addon.destroy(instance_descriptor_id);
		if ( resultcode !== 0){
			err.errorcode = resultcode;
			err.message = this.eclibUtil.getErrorMessage(resultcode);
		}

	} else {
	
		err.errorcode = resultcode;
		err.message = this.eclibUtil.getErrorMessage(resultcode);
	
	}

	if (!callback){
		return resultcode;
	}

	callback.call(this,resultcode,err);
};

ECLib.prototype.encode = function(instance_descriptor_id, orig_data, orig_data_size,callback){

	
	//console.log(addon.encode());


	var resultcode = enums.ErrorCode.EINVALIDPARAMS; 
	var err = {};
	var result = {};

	if (this.eclibUtil.validateEncodeParams(instance_descriptor_id, orig_data, orig_data_size, callback)){

		console.log("++++++++++++++++++++++");
		
		addon.encode(instance_descriptor_id,orig_data,orig_data_size
			,function(r_code,encoded_data,encoded_parity,f_len){

				if (r_code ==0) {

					result.resultcode = r_code;
					result.encoded_data = encoded_data;
					result.encoded_parity = encoded_parity;
					result.fragment_len =f_len;

					//callback.call(this,result,err,self);

				} else {

					//Error occured in Server side
					err.errorcode = r_code;
					err.message = this.eclibUtil.getErrorMessage(r_code);
					//we will see what happens here
					//callback.call(this,result,err);
					
				}
		});


	} else {
	
		if (!callback){
			return resultcode;
		} else {

			err.errorcode = resultcode;
			err.message = this.eclibUtil.getErrorMessage(resultcode);

			callback.call(this,result,err);
		}

		//
	}


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

}; */

module.exports = ECLib 
