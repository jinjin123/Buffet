_orderReport = (function () {
	'use strict';
	var ret = {};
	ret.ptarry = [];
	ret.orderList = [];
	//加载支付信息
	ret.init = function() {
		sql.queryPmtInfo(function(flag, result) {
			if(flag == true) {
				ret.ptarry = result;
				var html = '';
				for(var i = 0 ; i<result.length; i++) {
					var paytype = result[i].doc;
					var myhtml ='<option value="'+ paytype.channel_code +'">'+ paytype.channel_name +'</option>';
					html += myhtml;
				}
				$('.paytype').append(html);
			}
		});
	}
	//获取订单列表
	ret.getAllOrder = function(param) {
		sql.queryOrder(param, function(flag, result) {
			ret.orderList = [];
			if(flag == true) {
				var html = '';
				var count = 1 ;
				var n = 0;
				for(var i = 1; i <= result.length; i++) {
					var flag = false;
					var order = {};
					if(param.type == 'all') {order = result[i-1].doc;}
					if(param.type == 'ok') {if(result[i-1].doc.paystatus == 1) {
							order = result[i-1].doc;}}
					if(param.type == 'refund') {if(result[i-1].doc.orderstatus == 5) {
							order = result[i-1].doc;}}
					if(param.type == 'no-payment') {if(result[i-1].doc.paystatus == 0) {
							order = result[i-1].doc;}}
					for(var v in order) {flag = true;}
					if(flag) {n++;count ++;if(n<=14) {
							html = _orderReport.bindOrderHtml(order,html,n);}
						ret.orderList.push(order);}
				}
				$('.orderlist').html(html);
				ret.bindLabel(count);
			}
		});
	}
	//绑定订单列表
	ret.bindOrderHtml = function(order,html,i) {
		var myhtml = '';
	 	var paystatus = '未支付';
 		var paytype = '';
 		if(order.paystatus == 1) {
 			paystatus = '已支付';
 		}
 		for(var j = 0 ; j<ret.ptarry.length; j++) {
			var mypay = ret.ptarry[j].doc;
			
			if(mypay.channel_code == order.paytype.replace(/"/g, "")) {
				paytype = mypay.channel_name;
			}
		}
		var dicountHtml = '';
		var dicountlist = JSON.parse(order.dicountlist);
		for(var k = 0; k<dicountlist.length; k++) {


		}
		var productHtml = '';
		var productlist = JSON.parse(order.productList);
		for(var y = 0; y<productlist.length; y++){
			var phtml = productlist[y].productname + ',' + productlist[y].productnum + '份 x &yen;' + parseInt(productlist[y].productprice)/100 +' = &yen;' + parseInt(productlist[y].totalprice)/100 + '; ';
			productHtml += phtml;
		}
	 	if(i%2 != 0) {
	 		myhtml = '<tr class="active">' +
						'<td>&nbsp;</td>' +
						'<td class="expand" data="add"><img src="images/add.png"></td>' +
						'<td>' +order.orderid+ '</td>' +
						'<td>' +order.ordertradeno+ '</td>' +
						'<td>&yen;' +parseInt(order.payamount)/100+ '</td>' +
						'<td>' +paystatus+ '</td>' +
						'<td>' +paytype+'</td>' +
						'<td>' +order.addtime+ '</td>' +
						'</tr>' +
						'<tr class="detail"><td colspan="8">' +
						'<div class="detailContent">' +
								'<span class="span1"><b>优惠信息:</b></span><span class="span2">'+ dicountHtml +'</span><br/>' +
								'<span class="span1"><b>商品信息:</b></span><span class="span2">'+ productHtml +'</span><br/>' +
								'<span class="span1"><b>合计:</b></span><span class="span2">&yen;'+ parseInt(order.payamount)/100 +'</span>' +
						'</div>' +
						'</td></tr>';
	 	} else {
	 		myhtml = '<tr>' +
						'<td>&nbsp;</td>' +
						'<td class="expand" data="add"><img src="images/add.png"></td>' +
						'<td>' +order.orderid+ '</td>' +
						'<td>' +order.ordertradeno+ '</td>' +
						'<td>&yen;' +parseInt(order.payamount)/100+ '</td>' +
						'<td>' +paystatus+ '</td>' +
						'<td>' +paytype+'</td>' +
						'<td>' +order.addtime+ '</td>' +
						'</tr>' +
						'<tr class="detail"><td colspan="8">' +
						'<div class="detailContent">' +
								'<span class="span1"><b>优惠信息:</b></span><span class="span2">'+ dicountHtml +'</span><br/>' +
								'<span class="span1"><b>商品信息:</b></span><span class="span2">'+ productHtml +'</span><br/>' +
								'<span class="span1"><b>合计: &yen;</b></span><span class="span2">&yen;'+ parseInt(order.payamount)/100 +'</span>' +
						'</div>' +
						'</td></tr>';
	 	}
	 	html += myhtml;
	 	return html;
	}
	//绑定lable标签
	ret.bindLabel = function(count) {
		if(count>70) {
			var labelHtml = '<label class="btn btn-primary pageicon start" data ="start" nums ='+ count/14 +'>' +
							'<input type="radio" name="options" id="optionstart"><' +
							'</label>' +
							'<label class="btn btn-primary pagenum active " data ="1">' +
								'<input type="radio" name="options" class="option2" data ="1"> 1' +
							'</label>' +
							'<label class="btn btn-primary pagenum" data ="2">' +
								'<input type="radio" name="options" class="option2" data ="2"> 2' +
							'</label>' +
							'<label class="btn btn-primary pagenum" data ="3">' +
								'<input type="radio" name="options" class="option2" data ="3"> 3' +
							'</label>' +
							'<label class="btn btn-primary pagenum" data ="4">' +
								'<input type="radio" name="options" class="option2" data ="4"> 4' +
							'</label>' +
							'<label class="btn btn-primary pagenum" data ="5">' +
								'<input type="radio" name="options" class="option2" data ="5"> 5' +
							'</label>' +
							'<label class="btn btn-primary pagenum" data ="more">' +
								'<input type="radio" name="options" class="option2" data ="more"> ...' +
							'</label>' +
							'<label class="btn btn-primary pageicon" data = "end">' +
								'<input type="radio" name="options" class="optionend">>' +
							'</label>';
			$('.pages').html(labelHtml);
		} else {
			var labelHtml = '<label class="btn btn-primary pageicon start" data = "start" nums ='+ count/14 +'>' +
								'<input type="radio" name="options" id="optionstart"><' +
							'</label>';
			var num = parseInt(count/14);
			for(var a = 0; a <= num; a++) {
				var label = '';
				if(a == 0) {
					label = '<label class="btn btn-primary pagenum active " data ='+ (a+1) +'>' +
								'<input type="radio" name="options" class="option2" data ='+ (a+1) +'> '+ (a+1) +
							'</label>';
				} else {
					label = '<label class="btn btn-primary pagenum" data ='+ (a+1) +'>' +
								'<input type="radio" name="options" class="option2" data ='+ (a+1) +'> '+ (a+1) +
							'</label>';
				}
				labelHtml += label;
			}
			labelHtml += '<label class="btn btn-primary pageicon" data ="end" >' +
								'<input type="radio" name="options" id="optionend">>' +
						 '</label>' ;
			$('.pages').html(labelHtml);
		}
		bind(a);
	}
	//lable 标签点击事件
	ret.labelClick = function(num) {
		var html = '';
		var n = 0;
		for(var i = num; i< ret.orderList.length; i++) {
			n++;
			var order = ret.orderList[i];
			if(n<=14) {html = _orderReport.bindOrderHtml(order,html,n);}
		}
		$('.orderlist').html(html);
		bind();
	}
	return ret;
})();
//菜单栏点击
$('.type').on('click', function() {
	var type = $(this).attr('data');
	var param = {
		type : type
	}
	$('.motal').hide();
	$('.inpag').val('');
	_orderReport.getAllOrder(param);
});
//查询按钮点击
$('.query').on('click', function() {
	var paystatus = $('.spaystatus option:selected').val();
	var paytype = $('.paytype option:selected').val();
	var istakeout = $('.istakeout option:selected').val();
	var starttime = $('#starttime').val();
	var endtime = $('#endtime').val();
	var orderid = $('#orderid').val();
	var ordertradeno = $('#ordertradeno').val();
	var count = 1;
	var html = ''
	var n = 0;
	var param = {
		type : 'all'
	}
	sql.queryOrder(param, function(flag, result) {
		_orderReport.orderList = [];
		if(flag == true) {
			var html = '';
			var count = 1 ;
			var n = 0;
			for(var i = 1; i <= result.length; i++) {
				var flag = false;
				var order = {};
				if(param.type == 'all') {order = result[i-1].doc;}
				if(param.type == 'ok') {if(result[i-1].doc.paystatus == 1) {
						order = result[i-1].doc;}}
				if(param.type == 'refund') {if(result[i-1].doc.orderstatus == 5) {
						order = result[i-1].doc;}}
				if(param.type == 'no-payment') {if(result[i-1].doc.paystatus == 0) {
						order = result[i-1].doc;}}
				for(var v in order) {flag = true;}
				if(flag) {
					var flag = true;
					if(paystatus != "") {if(order.paystatus != paystatus) {
							flag = false;}}
					if(paytype != "") {if(order.paytype != paytype) {
							flag = false;}}
					if(istakeout != "") {if(order.istakeout != istakeout) {
						flag = false;}}
					if(endtime !="") {var now_time =  new Date().format('yyyy-MM-dd hh:mm:ss');
						if(!(kit.compareTime(starttime+":00",now_time)&&kit.compareTime(now_time,endtime+":00"))) {
							flag = false;}}
					if(orderid != "") {if(order.orderid != orderid) {
						flag = false;}}
					if(ordertradeno != "") {if(order.ordertradeno != ordertradeno) {
						flag = false;}}
					if(flag){n++;count ++;
						if(n<=14) {html = _orderReport.bindOrderHtml(order,html,n);}
						_orderReport.orderList.push(order);}
				}
			}
			$('.orderlist').html(html);
			_orderReport.bindLabel(count);
		}
	});
	$('.motal').hide();
	$('.inpag').val('');
	$('.orderlist').html(html);
	_orderReport.bindLabel(count);
});
function bind() {
	$('.expand').on('click', function() {
		var flag =  $(this).attr('data');
		$(this).parent().next().toggle();
		if(flag =='add') {
			$(this).attr('data','red');
			$(this).children().attr('src','images/red.png');
		}else{
			$(this).attr('data','add');
			$(this).children().attr('src','images/add.png');
		}
	})
	$('.pagenum').on('click', function() {
		var nums = $('.start').attr("nums");
		if($(this).attr("data") == "more") {
			for(var a=0;a<=nums;a++){

			}
			$('.motal').attr("data",a+1);
			$('.motal').find('.inpag').attr("placeholder",'输入页码, 共'+(a)+'页');
			$('.motal').show();
			var input = document.getElementById("inpag");
			$('.inpag').focus();
			kit.ListenerText(input,function() {
				var num = $('.inpag').val();
				if(isNaN(num)){
					$('.inpag').val('');
					$('.inpag').focus();
				} else {
					if(num>a){
						$('.inpag').val(a);
					}
				}
			})
		} else {
			var num = (parseInt($(this).attr('data'))-1)*14;
			_orderReport.labelClick(num);
		}
	})
}
$(".inbtn").on('click', function() {
	var num = $('.inpag').val();
	num = (parseInt(num)-1)*14;
	_orderReport.labelClick(num);
})