pmt = (function () {
	'use strict';
	var ret = {};
	//生成签名
	function getSign(param){
		var str = "";
        var time = Date.parse(new Date);
        param.timestamp = time;
        for (var v in param) {
            if (param[v] == ""|| param[v] == null || JSON.stringify(param[v]).indexOf("{") > -1 || JSON.stringify(param[v]).indexOf("[") > -1) continue;
            str = str + v + "=" + param[v] + "&";
        }
        str = str + "key=" + config.PMT_key;
        var hash = faultylabs.MD5(str + config.PMT_SECURITY + time).toUpperCase();
        return "sign=" + hash + "&" + "timestamp=" + time;
	}
	//请求支付
	ret.Charges = function(param,_success,_error){
		var _param = {
			url : config.PMT_URL + "charges?" + getSign(param),
			data : JSON.stringify(param)
		}
		_ajax.post(_param,_success,_error);
	}
	//查询支付状态
	ret.inquiry = function(param,_success,_error){
		var _param = {
			url : config.PMT_URL + "payment_inquiry?" + getSign(param),
			data : JSON.stringify(param)
		}
		_ajax.pos(_param,_success,_error);
	}
	//请求退款
	ret.refunds = function(param,_success,_error){
		var _param = {
			url : config.PMT_URL + "refunds?" + getSign(param),
			data : JSON.stringify(param)
		}
		_ajax.pos(_param,_success,_error);
	}
	
	return ret;
})();