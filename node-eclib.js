var addon = require('bindings')('Release/node-eclib.node')
var ECLibUtil = require("./eclib-util.js");
var enums = require("./eclib-enum.js");
var __ = require('underscore');

function ECLib(opts) {
	var d_options = {
		"bc_id": 0, //backend ID
		"k": 8, //number of data fragments
		"m": 4, //number of parity fragments
		"w": 0, //word size, in bits
		"hd": 0, //hamming distance (=m for Reed-Solomon)
		"ct": 0
	}; //fragment checksum type

	this.opt = {};
	__.extend(this.opt, d_options);

	if (__.size(opts) > 0) {
		__.extend(this.opt, opts);
	}

	this.ins_id = null;
	this.eclibUtil = new ECLibUtil();
	this.isValidInstance = function() {
		return (__.isUndefined(this.ins_id));
	};

	this.resetOptions = function() {
		this.opt = null;
		__.extend(this.opt, d_options);
	};
}

ECLib.prototype = {

	init: function(callback) {
		//This will be the  create method of the ECLIB
		var instance_descriptor_id = -1;
		var err = {};
		var o = this.opt;
		if (this.eclibUtil.validateInstanceCreateParams(o.bc_id, o.k, o.m, o.w, o.hd,
				o.ct)) {

			instance_descriptor_id = addon.create(o.bc_id, o.k, o.m, o.w, o.hd, o.ct);

			if (instance_descriptor_id <= 0) {
				err.errorcode = instance_descriptor_id;
				err.message = this.eclibUtil.getErrorMessage(instance_descriptor_id);
			} else {
				this.ins_id = instance_descriptor_id;
			}

		} else {
			err.errorcode = enums.ErrorCode.EINVALIDPARAMS;
			err.message = this.eclibUtil.getErrorMessage(err.errorcode);
			instance_descriptor_id = err.errorcode;
		}

		if (!callback) {
			return instance_descriptor_id;
		}

		callback.call(this, instance_descriptor_id, err);
	},
	destroy: function(callback) {

		var resultcode = enums.ErrorCode.EBACKENDNOTAVAIL;
		var err = {};

		if (this.isValidInstance()) {
			resultcode = addon.destroy(this.ins_id);
			if (resultcode !== 0) {
				err.errorcode = resultcode;
				err.message = this.eclibUtil.getErrorMessage(resultcode);
			}
		} else {
			err.errorcode = resultcode;
			err.message = this.eclibUtil.getErrorMessage(resultcode);
		}

		if (!callback) {
			return resultcode;
		}

		callback.call(this, resultcode, err);

	},

	encode: function(o_data, callback) {
		var o = this.opt;

		addon.encode(this.ins_id, o.k, o.m, o_data, o_data.length, callback);
	},

	encodev: function(n_buf, buf_array, total_size, callback) {
		var o = this.opt;

		addon.encodev(this.ins_id, o.k, o.m, n_buf, buf_array, total_size, callback);
	},

	decode: function(d_data, n_frags, frag_len, force_metadata_check, callback) {
		addon.decode(this.ins_id, d_data, n_frags, frag_len, force_metadata_check, callback);
	},

	reconstructFragment: function(avail_fragments, missing_fragment_id, callback) {
		if (!avail_fragments.length) {
			callback(new Error('invalid number of available fragments (must be > 0)'), null);
			return;
		}
		addon.reconstructFragment(
			this.ins_id,
			avail_fragments,
			avail_fragments.length,
			avail_fragments[0].length,
			missing_fragment_id,
			callback
		);
	},

	getFragmentMetadata: function(fragment, fragment_metadata, callback) {
		// TODO: what is this function supposed to do ?
	},

	setOptions: function(opts){
		__.extend(this.opt,opts);
	}
}

module.exports = ECLib;
