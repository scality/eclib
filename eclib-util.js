// All the util method will go here.
// Lets see how many methods do we need add here, might be in the future we goona need
//		another validator util

var enums = require("./eclib-enum.js");

function ECLibUtil() {

	this.isInt = function(n) {
		return typeof n === 'number' && n % 1 == 0;
	}
}

ECLibUtil.prototype.getErrorMessage = function(errorcode) {

	var errornumber = enums.ErrorCode;
	var message = null;

	switch (errorcode) {
		case -errornumber.EBACKENDNOTSUPP:
			message = "Backend not supported";
			break;

		case -errornumber.EECMETHODNOTIMPL:
			message = "No method implemented";
			break;

		case -errornumber.EBACKENDINITERR:
			message = "Backend instance is terminated";
			break;

		case -errornumber.EBACKENDINUSE:
			message = "Backend instance is in use";
			break;

		case -errornumber.EBACKENDNOTAVAIL:
			message = "Backend instance not found";
			break;

		case -errornumber.EBADCHKSUM:
			message = "Fragment integrity check failed";
			break;

		case -errornumber.EINVALIDPARAMS:
			message = "Invalid arguments";
			break;

		case -errornumber.EBADHEADER:
			message = "Fragment integrity check failed";
			break;

		case -errornumber.EINSUFFFRAGS:
			message = "Insufficient number of fragments";
			break;

		default:
			message = "Unknown error";
			break;
	}

	return message;
};

ECLibUtil.prototype.validateInstanceCreateParams = function(ec_backend_id, k, m,
	w, hd, ct) {

	var retvalue = true;
	var argslength = arguments.length;

	retvalue = (argslength == 6);

	while (retvalue && (argslength > 0)) {
		retvalue = retvalue && this.isInt(arguments[argslength - 1]);
		argslength--;
	}

	return retvalue;
};

ECLibUtil.prototype.validateEncodeParams = function(ec_id, orig_data,
	deta_length, callback) {

	var retvalue = true;
	var argslength = arguments.length;

	retvalue = (argslength == 4);
	retvalue = retvalue && this.isInt(arguments[0]);
	retvalue = retvalue && this.isInt(arguments[2]);
	retvalue = retvalue && (orig_data !== undefined) && Buffer.isBuffer(orig_data);
	// Will check whether the callback is a method or not
	//retvalue = retvalue && Buffer.isBuffer(orig_data);


	return retvalue;
};



module.exports = ECLibUtil;
