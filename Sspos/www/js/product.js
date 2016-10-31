product = (function () {
	'use strict';
	var ret = {};
	var categoryList = [];
	var playlist = {};
	//显示产品页面
	ret.init = function() {
		ret.loadCategory();
		ret.loadProduct();
	}
	ret.show = function() {
		var istakeout = localStorage.getItem("istakeout");
		if(istakeout==0){
			$('.istakeout').css({
				'height': '85px',
				'background-image': 'url("images/ts.png")',
				'background-repeat': 'no-repeat',
				'background-position': '0px 28px',
				'line-height': '85px',
				'color': '#fff',
				'font-size': '24px',
				'padding-left': '75px !important'
			});
			$('.istakeout').html("堂食");
			$('.ordertitle').html("当前订单（堂食）");
		}
		$("#product").show();
		$('#frist').click();
	};
	//隐藏产品页面
	ret.hide = function() {
		$("#product").hide();
	}
	//加载产品分类
	ret.loadCategory = function() {
		var first =1;
		sql.queryCategory(function(flag,result) {
			if(flag == true) {
				var html ="";
				for(var i=0; i<result.length; i++){
					var ctg = result.item(i);
					categoryList.push(ctg);
					if(playlist[ctg.nid] == null) {
						playlist[ctg.nid] = {};
					}
					var date = new Date();
					var month =parseInt(date.getMonth())+1;
		        	var start_time = date.getFullYear()+"-"+month+"-"+date.getDate()+" "+ctg.start_time+":00";
		        	var end_time =  date.getFullYear()+"-"+month+"-"+date.getDate()+" "+ctg.end_time+":00";
		        	var now_time = new Date().format('yyyy-MM-dd hh:mm:ss');
		        	//分类分时间段显示
		        	//if(kit.compareTime(start_time,now_time)&&kit.compareTime(now_time,end_time)){   
		        		var ctitle = "ctitle";
		        		if(ctg.title.length>7){
		        			ctitle = "ctitle2";
		        		}
		        		if(first==1){
                        	var myhtml = '<div id="frist" class="col-md-12 '+ctitle+'" data="'+ctg.nid+'"><img src="'+ctg.image+'" class="col-md-3 im"><span class="col-md-9">'+ctg.title+'</span><div class="ripple"></div></div>';

	                    }else{
	                        var myhtml = '<div class="col-md-12 '+ctitle+'" data="'+ctg.nid+'"><img src="'+ctg.image+'" class="col-md-3 im"><span class="col-md-9">'+ctg.title+'</span><div class="ripple"></div></div>';
	                    }
	                    html+=myhtml;
	                    first++;
		        	//}
				}
				$('#category').html(html);
				bindCategoryClick();
			}else {
				console.log("error: 加载产品分类失败");
			}
		});
	};
	//加载产品
	ret.loadProduct = function() {
		sql.queryProduct(function(flag,result) {
			if(flag == true) {
				for(var i=0; i<result.length; i++){
					var prd = result.item(i);
					var nidList = (prd.nid).split(",");
					nidList.forEach(function (nid, idx) {
                        if(playlist[nid]!=undefined){
                            if (nid.length > 0 && playlist[nid][prd.sku] == null) {
                                playlist[nid][prd.sku] = prd;
                            }
                        }
                    });
				}
			}else {
				console.log("error: 加载产品失败");
			}
		});
	}
	//加载产品UI
	ret.loadProductHtml = function(productList){
		var html = "";
		var parent = $(".products");
	    $(parent).undelegate();
	    $(parent).children().remove();
		var istime =true;
		for(var pro in productList) {
			var itm = productList[pro];
        	var proreplace = '<div class="col-md-4 proreplace2"></div>';
    		if(itm.isreplace == "true" || itm.isreplace == true) {
    			proreplace = '<div class="col-md-4 proreplace2"></div>'
    		}
			if (itm.sold_out == "false" || itm.sold_out == false) {
				var timelist = JSON.parse(itm.time_period);
				if(timelist.length>0) {
					for(var k=0; k<timelist.length;k++){
						var date = new Date();
			        	var month =parseInt(date.getMonth())+1;
			        	var start_time = date.getFullYear()+"-"+month+"-"+date.getDate()+" "+timelist[k].times.start+":00";
			        	var end_time =  date.getFullYear()+"-"+month+"-"+date.getDate()+" "+timelist[k].times.end+":00";
			        	var now_time = new Date().format('yyyy-MM-dd hh:mm:ss');
			        	if(!(kit.compareTime(start_time,now_time)&&kit.compareTime(now_time,end_time))){
			        		istime =false;
			        	}
					}
				}
	        	if(istime) {
	        		var myhtml = '<div class="product">'+
				    				'<div class="col-md-5 proname">'+itm.title+'</div>'+
				    				'<div class="col-md-7 proimage">'+
				    					'<img src="'+itm.imageurl+'">'+
				    				'</div>'+
				    				'<div class="col-md-8 proprice">'+
				    					itm.price +
				    				'</div>' +
				    				proreplace +
				    			'</div>';
				    html = myhtml;
				} else {
					var proreplace = '<div class="col-md-4 proreplace2"></div>';
	        		if(itm.isreplace == "true" || itm.isreplace == true) {
	        			proreplace = '<div class="col-md-4 proreplace2"></div>'
	        		}
	        		var myhtml = '<div class="product">'+
				    				'<div class="col-md-5 proname">'+itm.title+'</div>'+
				    				'<div class="col-md-7 proimage">'+
				    					'<img src="'+itm.imageurl+'">'+
				    				'</div>'+
				    				'<div class="col-md-8 proprice">'+
				    					itm.price +
				    				'</div>' +
				    				proreplace +
				    				'<div class="protime"></div>'+
				    			'</div>';
				    html = myhtml;
				}
			} else {
        		var myhtml = '<div class="product">'+
			    				'<div class="col-md-5 proname">'+itm.title+'</div>'+
			    				'<div class="col-md-7 proimage">'+
			    					'<img src="'+itm.imageurl+'">'+
			    				'</div>'+
			    				'<div class="col-md-8 proprice">'+
			    					itm.price +
			    				'</div>' +
			    				proreplace +
			    				'<div class="prosol"></div>'+
			    			'</div>';	
			    html = myhtml;
			}
			var child = $(html);
	        $(child).data("productInfo", itm);
			$(parent).append(child);
		}
		bindProductClick();
		addProductsEvent();
	}
	//绑定分类点击事件
	function bindCategoryClick(){
		$('.ctitle,.ctitle2').bind('click',function(e){
			//关闭模态框
			if(!$('.reproducts').is(":hidden")) {
				$('.reproducts').hide();
				$('.products').height('850px');
			}
			kit.backindexTime();
			$('#category').find('.ctitle').css({
				'height': '80px',
				'padding-left': '10px !important',
				'white-space':'normal',
				'word-break':'break-all',
				'line-height': '80px',
				'color':'#638ab3'
			});
			$('#category').find('.ctitle2').css({
				'height': '80px',
				'padding-left': '10px !important',
				'white-space':'normal',
				'word-break':'break-all',
				'color':'#638ab3'
			});
			$(this).css({
				'height': '80px',
				'padding-left': '10px !important',
				'white-space':'normal',
				'word-break':'break-all',
				'color':'#ffb600'
			});
			var id = $(this).attr('data');
			var src = $(this).find('img')[0].src;
			var productList = playlist[id];
			ret.loadProductHtml(productList);
			// $('.product').css({
			// 	'background-image':'url('+src+')'
			// })
		})
	}
	//绑定更换产品点击事件
	function bindProductClick(){
		$('.proname,.proimage').bind('click',function(event){
			kit.backindexTime();
			var height = $('.products').height();
			if(height!="350px"){
				$('.products').css({
					'height':'350px',
					'margin-bottom' : '40px;'
				})
				var top = $(this).parent('.product').position().top;
				$('.products').scrollTop(top);
			}
			$('.reproducts').show();
			event.stopPropagation();
		})
	}
	//绑定产品点击事件
	function addProductsEvent() {
		$('.proreplace2').on('click',function () {
			//关闭模态框
			if(!$('.reproducts').is(":hidden")) {
				$('.reproducts').hide();
				$('.products').height('850px');
			}
			kit.backindexTime();
			var parent = this;
			$(this).parent().addClass("headerActive");
        	var pdtInfo = $(this).parent().data("productInfo");
        	cart.addproduct(pdtInfo,_UIHandle(pdtInfo));
        })
	}
	///购物车UI加载事件
	function _UIHandle(pdtInfo) {
		return function (pdtCartInfo, newPdt) {
			if (pdtCartInfo.productnum == null || pdtCartInfo.productnum == undefined) {

	        } else if (pdtCartInfo.productnum == 0) {
	            $("#" + pdtCartInfo.productid).remove();
	            $("." + pdtCartInfo.productid).remove();
	        } else if (pdtCartInfo.productnum >= 1) {
	            if (newPdt == true) {
	            	//产品页面购物车
	                var html =  '<div class="col-md-12 cartpro" id="'+pdtCartInfo.productid+'">'+
				    				'<div class="col-md-3 cartproimg">'+
				    					'<img src="'+pdtCartInfo.productimg +'">'+
				    				'</div>'+
				    				'<div class="col-md-9 cartproinfo">'+
				    					'<div class="col-md-6 cartproname">'+
				    						'<span class="name">'+pdtCartInfo.productname+'</span><br/>'+
				    						'<span class="price">&yen;'+pdtCartInfo.productprice+'</span>'+
				    					'</div>'+
				    					'<div class="btn-group col-md-6" data-toggle="buttons">'+
										    '<label class="btn btn-primary red">'+
										        '<input type="checkbox">-'+
										    '</label>'+
										    '<label class="btn btn-primary nums">'+
										        '<input type="checkbox">'+pdtCartInfo.productnum+
										    '</label>'+
										    '<label class="btn btn-primary add">'+
										        '<input type="checkbox">+'+
										    '</label>'+
										'</div>'+
				    				'</div>'+
				    				'<div class="delpdt"></div>'+
				    			'</div>';
				    //订单页面购物车
				    var html2 ='<div class="col-md-12 orderproduct '+pdtCartInfo.productid+'">'+
				    				'<div class="col-md-2 orderimg">'+
				    					'<img src="'+pdtCartInfo.productimg+'">'+
				    				'</div>'+
				    				'<div class="col-md-10 ordername">'+
				    					'<span class="col-md-9 name">'+pdtCartInfo.productname+'</span>'+
				    					'<span class="col-md-9 price">&yen;&nbsp;'+pdtCartInfo.productprice+'</span>'+
				    					'<span class="col-md-3 num">x'+pdtCartInfo.productnum+'</span>'+
				    				'</div>'+
				    			'</div>';
	                var cartParent = $(".cart");
	                $(cartParent).undelegate();
	                var child = $(html);

	                var ordercartParent = $(".orderproductlist");
	                $(ordercartParent).undelegate();
	                var orderchild = $(html2);

	                if (pdtInfo) {
	                    $(child).data("cartPdtInfo", pdtInfo);

	                    $(orderchild).data("cartPdtInfo", pdtInfo);
	                }
	               
	                if ($(cartParent).children().length > 0) {
	                    $(cartParent).children().eq(0).before(child);
	                } else {
	                    $(cartParent).append(child);
	                }

	                if ($(ordercartParent).children().length > 0) {
	                    $(ordercartParent).children().eq(0).before(orderchild);
	                } else {
	                    $(ordercartParent).append(orderchild);
	                }


	                addCartMinusEvent(cartParent);
	                addCartAddEvent(cartParent);
	                addCartDelEvent(cartParent);
	            } else {
	                $("#" + pdtCartInfo.productid).find('.nums').html('<input type="checkbox">'+pdtCartInfo.productnum);
	                $("." + pdtCartInfo.productid).find('.num').html('x'+pdtCartInfo.productnum);
	            }
	        }
	        totalAmout();
		}
	}
	//购物车总计信息
	function totalAmout () {
		var staticInfo = cart.getStaticInfo();
		$('.totalamout').html(kit.getInt(staticInfo.total)+""+kit.getDecimal(staticInfo.total));
		$('.totalpay').html("&yen;&nbsp;"+kit.getInt(staticInfo.total)+""+kit.getDecimal(staticInfo.total));


		$('.realpayamout').html("&yen;&nbsp;"+kit.getInt(staticInfo.realpay)+""+kit.getDecimal(staticInfo.realpay));


		$('.discountpay').html("&yen;&nbsp;"+kit.getInt(staticInfo.discount)+""+kit.getDecimal(staticInfo.discount));

		$('.payamout').html("&yen;&nbsp;"+kit.getInt(staticInfo.realpay)+""+kit.getDecimal(staticInfo.realpay));
	}
	//减少产品
	function addCartMinusEvent(p) {
	    $(p).delegate(".red","click", function () {
	    	//关闭模态框
			if(!$('.reproducts').is(":hidden")) {
				$('.reproducts').hide();
				$('.products').height('850px');
			}
	    	kit.backindexTime();
	        var pdtInfo = $(this).parents('.cartpro').data("cartPdtInfo");
	        cart.minusProductNumOne(pdtInfo.sku, _UIHandle());
	    });
	}
	//增加产品
	function addCartAddEvent(p) {
		$(p).delegate(".add","click", function () {
			//关闭模态框
			if(!$('.reproducts').is(":hidden")) {
				$('.reproducts').hide();
				$('.products').height('850px');
			}
			kit.backindexTime();
	        var pdtInfo = $(this).parents('.cartpro').data("cartPdtInfo");
	        cart.addProductNumOne(pdtInfo.sku, _UIHandle());
	    });
	}
	//删除产品
	function addCartDelEvent(p) {
		$(p).delegate(".delpdt","click", function () {
			//关闭模态框
			if(!$('.reproducts').is(":hidden")) {
				$('.reproducts').hide();
				$('.products').height('850px');
			}
			kit.backindexTime();
	        var pdtInfo = $(this).parents('.cartpro').data("cartPdtInfo");
	        cart.deleteproduct(pdtInfo.sku, _UIHandle());
	    });
	}
	return ret;
})();
//清除购物车dom
function clearCartDom (){
	$(".cart").children().remove();
	$(".orderproductlist").children().remove();
	$(".totalamout").html('0.00');
}
//关闭换购模态框
$('.reclose').on('click',function(){
	kit.backindexTime();
	$('.products').height('850px');
	$('.reproducts').hide();
});
//清空购物车
$('.clear').on('click',function(){
	//关闭模态框
	if(!$('.reproducts').is(":hidden")) {
		$('.reproducts').hide();
		$('.products').height('850px');
	}
	kit.backindexTime();
	cart.clearCartList();
	clearCartDom();
});
//外带 堂食切换
$('.istakeout').on('click',function(){
	//关闭模态框
	if(!$('.reproducts').is(":hidden")) {
		$('.reproducts').hide();
		$('.products').height('850px');
	}
	kit.backindexTime();
	var istakeout = localStorage.getItem('istakeout');
	if(istakeout==0){
		$('.istakeout').css({
			'height': '85px',
			'background-image': 'url("images/wd.png")',
			'background-repeat': 'no-repeat',
			'background-position': '0px 28px',
			'line-height': '85px',
			'color': '#fff',
			'font-size': '24px',
			'padding-left': '75px !important'
		});
		$('.istakeout').html("外带");
		$('.ordertitle').html("当前订单（外带）");
		localStorage.setItem('istakeout',1);
	}else{
		$('.istakeout').css({
			'height': '85px',
			'background-image': 'url("images/ts.png")',
			'background-repeat': 'no-repeat',
			'background-position': '0px 28px',
			'line-height': '85px',
			'color': '#fff',
			'font-size': '24px',
			'padding-left': '75px !important'
		});
		$('.istakeout').html("堂食");
		$('.ordertitle').html("当前订单（堂食）");
		localStorage.setItem('istakeout',0);
	}
});
$('.cartpay').on('click',function() {
	//关闭模态框
	if(!$('.reproducts').is(":hidden")) {
		$('.reproducts').hide();
		$('.products').height('850px');
	}
	kit.backindexTime();
	var produclist = cart.getproductlist();
	if(produclist == null||produclist.length <= 0){
		console.log("购物车空");
	}else{
		product.hide();
		order.show();
	}
})