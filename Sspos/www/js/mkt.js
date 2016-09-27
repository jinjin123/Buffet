mkt = (function() {
	'use strict';
	var ret = {};
	//获取图片
	ret.get_image = function(param,_success,_error){
		var _param = {
			url : config.MKT_URL + "get-image",
			data : JSON.stringify(param)
		}
		_ajax.post(_param,_success,_error);
	}

	return ret;
})();