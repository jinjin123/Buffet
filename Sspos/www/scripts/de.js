de = (function (){
	'use strict';
	var ret = {};
	//获取门店信息
	ret.get_store = function(_success,_error){
		var _param = {
			url : config.DE_URL + "get_store" + config.DE_CODE + "&sid=" + config.STOREID
		}
		_ajax.get(_param,_success,_error);
	}
	//获取产品分类信息
	ret.get_product_category_nbs = function(_success,_error){
		var _param = {
			url : config.DE_URL + "get_product_category_kd" + config.DE_CODE + "&sid=" + config.STOREID + "&posid=7570"
		}
		_ajax.get(_param,_success,_error);
	}
	//获取产品信息
	ret.get_products = function(_success,_error){
		var _param = {
			url : config.DE_URL + "get_products" + config.DE_CODE + "&sid=" + config.STOREID +"&posid=7570"
		}
		_ajax.get(_param,_success,_error);
	}
	return ret;
})();