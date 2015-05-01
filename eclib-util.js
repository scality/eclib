// All the util method will go here.
// Lets see how many methods do we need add here, might be in the future we goona need 
//		another validator util

var enums = require("./eclib-enum.js");

function ECLibUtil(){

	console.log("ECLibUtil function");
}

ECLibUtil.prototype.getErrorMessage = function(errorcode){

	var errornumber = enums.ErrorCode;
 	var message = null;

	switch(errorcode){
		case errornumber.EBACKENDNOTSUPP :
			message = "Backend not supported"; 
			break;
		
		case errornumber.EECMETHODNOTIMPL :
			message = "No method implemented"; 
			break;
		
		case errornumber.EBACKENDINITERR :
			message = "Backend instance is terminated"; 
			break;
		
		case errornumber.EBACKENDINUSE :
			message = "Backend instance is in use"; 
			break;
		
		case errornumber.EBACKENDNOTAVAIL :
			message = "Backend instance not found"; 
			break;
		
		case errornumber.EBADCHKSUM :
			message = "Fragment integrity check failed"; 
			break;
		
		case errornumber.EINVALIDPARAMS :
			message = "Invalid arguments"; 
			break;
		
		case errornumber.EBADHEADER :
			message =  "Fragment integrity check failed"; 
			break;
		
		case errornumber.EINSUFFFRAGS :
			message = "Insufficient number of fragments"; 
			break;
			
		default:
			message = "Unknown error";
			break;
	}

	return message;
}; 

ECLibUtil.prototype.validateInstanceCreateParams = function( ec_backend_id, k, m, w, hd, ct){

	//if everything is defined and ok then we will send true other wise we will send it another way


	return true;
};






module.exports = ECLibUtil;
