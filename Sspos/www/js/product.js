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
                        	var myhtml = '<div id="frist" class="col-md-12 '+ctitle+'" data="'+ctg.nid+'"><img src="'+ctg.image+'" class="col-md-3 im"><span class="col-md-9">'+ctg.title+'</span></div>';

	                    }else{
	                        var myhtml = '<div class="col-md-12 '+ctitle+'" data="'+ctg.nid+'"><img src="'+ctg.image+'" class="col-md-3 im"><span class="col-md-9">'+ctg.title+'</span></div>';
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
				    html += myhtml;
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
				    html += myhtml;
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
			    html += myhtml;
			}
		}
		$('.products').html(html);
		bindProductClick();
	}
	//绑定分类点击事件
	function bindCategoryClick(){
		$('.ctitle').bind('click',function(){
			$('#category').find('.ctitle').css({
				'height': '80px',
				'padding-left': '10px !important',
				'white-space':'normal',
				'word-break':'break-all',
				'line-height': '80px',
				'color':'#638ab3'
			});
			$(this).css({
				'height': '80px',
				'padding-left': '10px !important',
				'white-space':'normal',
				'word-break':'break-all',
				'line-height': '80px',
				'color':'#ffb600'
			});
			var id = $(this).attr('data');
			var src = $(this).find('img')[0].src;
			var productList = playlist[id];
			ret.loadProductHtml(productList);
			$('.product').css({
				'background-image':'url('+src+')'
			})
		})
	}
	//绑定产品内容点击事件
	function bindProductClick(){
		$('.proreplace2').bind('click',function(){
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
		})
	}
	return ret;
})();
$('.reclose').on('click',function(){
	$('.products').height('850px');
	$('.reproducts').hide();
})