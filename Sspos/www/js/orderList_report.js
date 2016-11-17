_orderReport = (function () {
	'use strict';
	var ret = {};
	var ptarry = [];
	//加载支付信息
	ret.init = function() {
		sql.queryPmtInfo(function(flag, result) {
			if(flag == true) {
				ptarry = result;
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
	ret.getAllOrder = function() {
		var _param = {
			doc: {
				include_docs : true,
				attachments : false,
			}
		}
		sql.queryOrder(_param, function(flag, result){
			if(flag == true) {
				var html = '';

				 for(var i=1; i <= result.length; i++) {
				 	var order = result[i].doc;
				 	var myhtml = '';
				 	if(i%2 != 0){
				 		var paystatus = '未支付';
				 		var paytype = '';
				 		if(order.paystatus == 1) {
				 			paystatus == '已支付';
				 		}
				 		for(var i = 0 ; i<ptarry.length; i++) {
							var paytype = ptarry[i].doc;
							if(paytype.channel_code == order.paytype) {
								paytype = paytype.channel_name;
							}
						}
				 		myhtml += '<tr class="active">' +
									'<td>&nbsp;</td>' +
									'<td class="expand" data="add"><img src="images/add.png"></td>' +
									'<td>' +order.orderid+ '</td>' +
									'<td>' +order.ordertradeno+ '</td>' +
									'<td>&yen;' +order.payamout+ '</td>' +
									'<td>' +paystatus+ '</td>' +
									'<td>' +paytype+'</td>' +
									'<td>' +order.addtime+ '</td>' +
								'</tr>' +
								'<tr class="detail"><td colspan="8">' +
								'<div class="detailContent">' +
										'<span class="span1"><b>优惠信息:</b></span><span class="span2">xxx</span><br/>' +
										'<span class="span1"><b>商品信息:</b></span><span class="span2">xxx</span><br/>' +
										'<span class="span1"><b>合计:</b></span><span class="span2">xxx</span>' +
								'</div>' +
								'</td></tr>';
				 	} else {
				 		myhtml += '<tr>' +
									'<td>&nbsp;</td>' +
									'<td class="expand" data="add"><img src="images/add.png"></td>' +
									'<td>' +order.orderid+ '</td>' +
									'<td>' +order.ordertradeno+ '</td>' +
									'<td>&yen;' +order.payamout+ '</td>' +
									'<td>' +paystatus+ '</td>' +
									'<td>' +paytype+'</td>' +
									'<td>' +order.addtime+ '</td>' +
								'</tr>' +
								'<tr class="detail"><td colspan="8">' +
								'<div class="detailContent">' +
										'<span class="span1"><b>优惠信息:</b></span><span class="span2">xxx</span><br/>' +
										'<span class="span1"><b>商品信息:</b></span><span class="span2">xxx</span><br/>' +
										'<span class="span1"><b>合计:</b></span><span class="span2">xxx</span>' +
								'</div>' +
								'</td></tr>';
				 	}
				 }
				 $('#orderlist').html(html);
			}
		})
	}
	return ret;
})();
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