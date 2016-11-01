pmt = (function () {
	'use strict';
	var ret = {};
	//生成签名
	function getSign(param) {
		var str = "";
		var time = Date.parse(new Date);
		var array = new Array();
        param.timestamp = time;
        for (var v in param) {
        	array.push(v);
        }
        var sortArray = array.sort(
			    function compareFunction(param1,param2){
			        return param1.localeCompare(param2);  
			    }
			);
        for(var i = 0;i<sortArray.length;i++){
        	if (param[sortArray[i]] == ""|| param[sortArray[i]] == null || JSON.stringify(param[sortArray[i]]).indexOf("{") > -1 || JSON.stringify(param[sortArray[i]]).indexOf("[") > -1) continue;
            str = str + sortArray[i] + "=" + param[sortArray[i]] + "&";
        }
        str = str + "key=" + config.PMT_KEY;
        var hash = faultylabs.MD5(str + config.PMT_SECURITY + time).toUpperCase();
        return "sign=" + hash + "&" + "timestamp=" + time;
	}
	//获取支付参数
	ret.getParam = function(_param) {
		var paytype = _param.orderInfo.paytype;
		var realpay = cart.getStaticInfo().realpay;
		var param = {};
		switch(paytype) {
			case 'NATIVE' : 
				 var wxpay =
                     {
                         //amount: parseInt(realpay*10)*10,
                         amount: 1,
                         channel: { "wechat": paytype },
                         client_ip: "172.27.35.1",
                         currency: "cny",
                         description: "zz",
                         extra: { "product_id": "SKU00001" },
                         merchant_no: _param.orderInfo.orderid,
                         mq:"",
                         request_source: "zz",
                         sid: _param.orderInfo.storeid,
                         subject: "自助点餐",
                         timestamp:"",
                         type: "dingdan"
                     };
                 param = wxpay;
                 break;
            case 'alipay.trade.precreate':
                 var alipay =
                     {
                         //amount: parseInt(realpay * 10) * 10,
                         amount: 1,
                         channel: { "alipay": paytype },
                         client_ip: "172.27.35.1",
                         currency: "cny",
                         extra:{"pay_mode": "qr","qr_pay_mode": 4},
                         merchant_no: _param.orderInfo.orderid,
                         mq:"",
                         request_source: "zz",
                         sid: _param.orderInfo.storeid,
                         subject: "自助点餐",
                         timestamp: "",
                         type: "dingdan"
                     };
                 param = alipay;
                 break; 
		}
		return param;
	}
	//请求支付
	ret.Charges = function(param,_success,_error) {
		var _param = {
			url : config.PMT_URL + "charges?" + getSign(param),
			data : JSON.stringify(param),
			type : "payment",
		}
		_ajax.post(_param,_success,_error);
	}
	//查询支付状态
	ret.inquiry = function(param,_success,_error) {
		var _param = {
			url : config.PMT_URL + "payment_inquiry?" + getSign(param),
			data : JSON.stringify(param),
			type : "payment",
		}
		_ajax.post(_param,_success,_error);
	}
	//请求退款
	ret.refunds = function(param,_success,_error) {
		var _param = {
			url : config.PMT_URL + "refunds?" + getSign(param),
			data : JSON.stringify(param),
			type : "payment",
		}
		_ajax.post(_param,_success,_error);
	}
	//获取门店所有支付方式
	ret.get_corporation_channel = function(param,_success,_error) {
		var _param = {
			url : config.PMT_URL + "get_corporation_channel?" + getSign(param) + "&sid=" + config.STOREID,
			type : "payment",
		}
		_ajax.get(_param,_success,_error);
	}
	return ret;
})();