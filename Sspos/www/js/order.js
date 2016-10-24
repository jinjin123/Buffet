order = (function() {
	var ret = {};
	ret.show = function() {
		$('#order').show();
		$('.choosepay').show();
		$('.backproduct').show();
		$('.point2').css({
				'background-image': "url('images/point-disabled.png')"
			})
		clearInterval(paytip);
		clearTimeout(paytime);
		paytip = setInterval(function(){
			$('.logo').show();
			$('.logo2').hide();
			paytime = setTimeout(function(){
				$('.logo').hide();
				$('.logo2').show();
			},2000)
		},4000)
	};
	ret.hide = function() {
		$('#order').hide();
	};
	//提交订单
	ret.submitorder = function (paytype,fun) {
		var param = oc.getParam(paytype);
		sql.insertOrderInfo(param,function(flag) {
			if(flag){
				oc.submitOrder(param,function(result){
					if(result.hasOwnProperty("code")&&result.hasOwnProperty("data")) {
						if(result.code == 0) {
							console.log("success: submitorder is ok");
							var payparam = pmt.getParam(param);
							pmt.Charges(payparam,function(_result) {
								if(_result.hasOwnProperty("code")&&_result.hasOwnProperty("contents")) {
									if(_result.code == 1011) {
										if(_result.contents.hasOwnProperty("qr_code")){
											$('#code').qrcode(_result.contents.qr_code);
											$('#code').find('canvas').css({
												'left' : '600px',
												'top' : '55px',
												'height' : '190px',
												'width' : '190px'
											});
											fun(true,param);
										}else {
											$('#code').qrcode(_result.contents);
											$('#code').find('canvas').css({
												'left' : '600px',
												'top' : '55px',
												'height' : '190px',
												'width' : '190px'
											});
											fun(true,param);
										}
									}
								}
							},function(jqXHR, textStatus, errorThrown) {

							})
						}
					}
				},function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
					console.log("error: submitorder cannot access");
				});
			}else{
				console.log("error: save order is error")
			}
		})
	}
	return ret;
})();
$('.backproduct').on('click',function(){
	order.hide();
	product.show();
})
$('.paymentinfo').on('click',function(){
	var paytype = $(this).attr('data');
	switch(paytype){
		case 'NATIVE' : 
			$('.paylogo').find('img').attr('src','images/wx-lg.png');
			$('.tipname').html("打开手机微信");
			$('.logo').css({
				'background-image': 'url("images/step3.png")'
			})
			$('.logo2').css({
				'background-image': 'url("images/step4.png")'
			})
			break;
		case 'alipay.trade.precreate' :
			$('.paylogo').find('img').attr('src','images/zfb-lg.png');
			$('.tipname').html("打开手机支付宝");
			$('.logo').css({
				'background-image': 'url("images/step1.png")'
			})
			$('.logo2').css({
				'background-image': 'url("images/step2.png")'
			})
			break;
	}
	order.submitorder(paytype,function(flag,_param){
		if(flag == true) {
			
			$('.choosepay').hide(800);
			$('.protect').show(800);
			$('.paystep2').css({
				'background-image': "url('images/saoma.png')"
			});
			$('.point2').css({
				'background-image': "url('images/point.png')"
			})
			$('.backproduct').hide();
			var param = {
                "merchant_no": _param.orderInfo.orderid
            },count = 1;
            $('.okpay').attr('flag', true);
            $('.okpay').attr('data', JSON.stringify(param));
			inquiry = setInterval(function () {
                if (count >= 30) {
                    clearInterval(paytime);
                    $('.okpay').attr('flag', false);
                } else {
                    pmt.inquiry(param, function(result) {
                        if(result.hasOwnProperty("paid")){
                        	if(result.paid == 1){
                        		$('.paystep3').css({
									'background-image': "url('images/success.png')"
								});
                        		count=30;
                                clearInterval(inquiry);
                                sql.updateOrderInfo_paystatus(result,function(flag) {
                                	if(flag ==true){
                                		console.log("success: update patstatus is ok");
                                	}
                                });
                                var orderparam = {
							        "orderid": result.merchant_no,
									"ordertradeno": result.tpn_transaction_id,
							        "paystatus":1,
							        "paytype":result.channel
                                }
                                oc.payAndUpdateOrder(orderparam,function(_result) {
                                	if(_result.hasOwnProperty("code")){
                                		if(_result.code == 0){
                                			$('.protect').hide(800);
											$('.payresult').show(800);
											$('.payresultcontent').html('取餐号:&nbsp;'+result.merchant_no.substring(result.merchant_no.length - 4, result.merchant_no.length));
                                		}
                                	}
                                },function(jqXHR, textStatus, errorThrown) {

                                })
                        	}
                        }
                    },function(jqXHR, textStatus, errorThrown) {
                    	console.log("error: inquiry cannot access");
                    });
                }
                count = count + 1;
            }, 5000);
		}
	})
});
//取消支付
$('.cancelpay').on('click',function(){
	$('.protect').hide(800);
	$('.choosepay').show(800);
	$('.paystep2').css({
		'background-image': "url('images/saoma-disabled.png')"
	})
	$('.backproduct').show();
});
//我已支付
$('.okpay').on('click',function(){
	var flag = $(this).attr('flag');
	var data = $(this).attr('data');
	if(!flag){
		 pmt.inquiry(JSON.parse(data), function(result) {
            if(result.hasOwnProperty("paid")){
            	if(result.paid == 1){
            		$('.paystep3').css({
						'background-image': "url('images/success.png')"
					});
            		count=30;
                    clearInterval(inquiry);
                    sql.updateOrderInfo_paystatus(result,function(flag) {
                    	if(flag ==true){
                    		console.log("success: update patstatus is ok");
                    	}
                    });
                    var orderparam = {
				        "orderid": result.merchant_no,
						"ordertradeno": result.tpn_transaction_id,
				        "paystatus":1,
				        "paytype":result.channel
                    }
                    oc.payAndUpdateOrder(orderparam,function(_result) {
                    	if(_result.hasOwnProperty("code")){
                    		if(_result.code == 0){
                    			$('.protect').hide(800);
								$('.payresult').show(800);
								$('.payresultcontent').html('取餐号:&nbsp;'+result.merchant_no.substring(result.merchant_no.length - 4, result.merchant_no.length));
                    		}
                    	}
                    },function(jqXHR, textStatus, errorThrown) {

                    })
            	}
            }
         },function(jqXHR, textStatus, errorThrown) {
        	console.log("error: inquiry cannot access");
         });
	}
});
//返回首页
$('.backindex').on('click',function(){
	order.hide();
	slideshow.show();
})