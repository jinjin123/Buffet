oc = (function () {
	'use strict';
	var ret = {};
	//获取提交参数
	ret.getParam = function(paytype){
		var orderid = ret.getOrderNo();
		var identifyingcode = orderid.substring(orderid.length - 4, orderid.length);
		var amount = cart.getStaticInfo().total;
		var dicountamount = cart.getStaticInfo().discount;
        var payamount = cart.getStaticInfo().realpay;
		var order = {
            "orderInfo": {
                "orderid": orderid,//订单编号
                "userid": config.STOREID + config.ID,//用户id
                "username": config.STOREID,//用户名称
                "userphone": "15710652956",//用户电话
                "totalamount": parseInt(amount * 10)*10,//订单总金额
                "dicountamount": parseInt(dicountamount * 10)*10,//优惠金额
                "payamount": parseInt(payamount * 10)*10,//支付金额
                "freight": 0,//配送金额
                "nums": cart.getTotalInfo().totalNumber,//产品数量
                "storeid": config.STOREID,//门店名称
                "storename": config.STORENAME,//门店名称
                "ordertradeno": "",		//支付流水号
                "orderthirdno": "",
                "ordersource": "ds",  //订单来源
                "orderplatformsource": "selfpos", //平台来源
                "paytype": paytype,//支付方式
                "isneedinvoice": 0,	   //是否需要发票
                "invoicetitle": "",//发票抬头
                "ext": "中信店自助点餐",//备注
                "deliveryway": "0",    //配送方式
                "booktime": new Date().format('yyyy-MM-dd hh:mm:ss'),//送餐时间
                "paystatus": 0,   //是否支付 0未支付，1已支付。
                "companyid": "0",   
                "companyname": "", 
                "addresslng": "0", //经度
                "addresslat": "0", //纬度
                "addorderoperator": config.STOREID+""+config.ID,
                "orderpostno": "", 
                "orderstatus": "1",  //新订单
                "identifyingcode": identifyingcode,//取餐号
                "istakeout": localStorage.getItem('istakeout'),//是否外带
                "needdelivery":0//1 外送单or 堂食单 0
            }
        }
        order.productList = [];
        var _prolist = cart.getproductlist();
        for (var i = 0; i < _prolist.length; i++) {
            var _pro = {};
            if (_prolist[i] == null)
                continue;
            var totalprice = _prolist[i].totalprice;
            var productprice = _prolist[i].productprice;

            _pro.productid = _prolist[i].productid;
            _pro.salesarea = _prolist[i].salesarea;
            _pro.productnum = _prolist[i].productnum;
            _pro.totalprice = parseInt(totalprice * 10)*10;
            _pro.productprice = parseInt(productprice * 10)*10;
            _pro.productimg = "";
            _pro.productname = _prolist[i].productname;;
            order.productList.push(_pro);
        }
        order.discountList = mDiscount.getDiscountList();
        ret.setNum();
        return order;
	}
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