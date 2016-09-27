crm = (function() {
	'use strict';
	var ret = {};
	//会员卡消费
	ret.posCardCheckout = function(param,_success,_error){
		var _param = {
			url : config.CRM_URL+"posCardCheckout.html",
			data : JSON.stringify(param)
		}
		_ajax.post(_param,_success,_error);
	}

	return ret;
})();