oc = (function () {
	'use strict';
	var ret = {};
	//提交订单
	ret.submitOrder = function(param,_success,_error){
		var _param = {
			url : config.OC_URL + "api/submitNewPosOrder.html?access_token=" + config.ACCESS_TOKEN,
			data : JSON.stringify(param)
		}
		_ajax.post(_param,_success,_error);
	}
	//修改订单支付状态
	ret.payAndUpdateOrder = function(param,_success,_error){
		var _param = {
			url : config.OC_URL + "api/payAndUpdateOrder.html?access_token=" + config.ACCESS_TOKEN + "&type=0",
			data : JSON.stringify(param)
		}
		_ajax.post(_param,_success,_error);
	}
	//生成订单号
	ret.getOrderNo = function(){
		var num = localStorage.getItem('orderno');
        if (num == null || num == undefined) {
            num = "001";
            localStorage.setItem('orderno', num);
        }
        var date = new Date().format('yyyy-MM-dd hh:mm:ss');
        date = (date.replace('-', '').replace('-', '').replace(':', '').replace(':', '').replace(' ', ''));
        date = date.substr(2, date.length + 1);
        date = date.replace('-', '');
        var orderno = config.TYPE + config.STOREID + date + config.ID + num;
        return orderno;
	}
	//重置订单号
    ret.setNum = function () {
        var num = localStorage.getItem('orderno');
        if (num == null || num == undefined|| num == "") {
            num = "001";
            localStorage.setItem('orderno', num);
        } else {
            num = parseInt(num) + 1;
            if (num > 999) {
                num = 1;
            }
            num = kit.numstr(num);
            localStorage.setItem('orderno', num);
        }
    }
	return ret;
})();