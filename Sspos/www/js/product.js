product = (function () {
	'use strict';
	var ret = {};
	var categoryList = [];
	var playlist = {};
	//显示产品页面
	ret.show = function() {
		$("#product").show();
	};
	//隐藏产品页面
	ret.hide = function() {
		$("#product").hide();
	}
	//加载产品分类
	ret.loadCategory = function() {
		var result;
		var first =1;
		sql.queryCategory(result,function(flag) {
			if(flag == true) {
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
		        	if(kit.compareTime(start_time,now_time)&&kit.compareTime(now_time,end_time)){   
		        		if(first==1){
                        	var myhtml = '<div id="'+ctg.nid+'" class="pRecommented ctitle" data="'+ctg.nid+'"><div>'+ctg.title+'</div></div>';
	                    }else{
	                        var myhtml = '<div id="'+ctg.nid+'" class="ctitle" data="'+ctg.nid+'"><div>'+ctg.title+'</div></div>';
	                    }
	                    html+=myhtml;
	                    first++;
		        	}
				}
			}else {
				console.log("error: 加载产品分类失败");
			}
		});
	};
	//加载产品
	ret.loadProduct = function() {
		var result;
		sql.queryProduct(result,function(flag) {
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
	return ret;
})();