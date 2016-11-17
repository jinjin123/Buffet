sql = (function() {
	'use strict';
	var ret = {};
	var storeInfo = "", productCategory = "", product = "",orderInfo = "", pmtInfo = "";
	var timeList = [5000, 10000, 20000, 30000]
    var countipc = 0, countisi = 0, countipt = 0, countipmt = 0;
	ret._allnid = {};
	//打开数据库
	ret.opendb = function() {
		storeInfo = _pouchdb.createDB(config.storeInfo);
		productCategory = _pouchdb.createDB(config.productCategory);
		product = _pouchdb.createDB(config.product);
		orderInfo = _pouchdb.createDB(config.orderInfo);
		pmtInfo = _pouchdb.createDB(config.pmtInfo);
	}
	//销毁数据库
	ret.deletedb = function() {
		_pouchdb.destroydb(storeInfo);
		_pouchdb.destroydb(productCategory);
		_pouchdb.destroydb(product);
		_pouchdb.destroydb(orderInfo);
		_pouchdb.destroydb(pmtInfo);
	}
	//插入门店信息
	ret.insertStoreInfo = function(fun) {
		de.get_store(function(result) {
			if(result.hasOwnProperty("state")) {
				if(result.state != 1||result.data == ""){
	        		console.log("error: get storeinfo is null");
	        		fun(false);
	        	} else {
	        		var store = result.data;
	        		var _param = {
	        			db :　storeInfo,
	        			doc : {
	        				_id : store.store_id,
	        				storeid : store.store_id,
	        				title : store.title,
	        				address : store.address.name,
	        				address_detail : store.address_detail,
	        				posid : config.ID,
	        				version : config.VERSION,
	        				update_time : new Date().format('yyyy-MM-dd').toString()
	        			}
	        		}
        			_pouchdb.put(_param, function(result) {
	        			try{
							if(result.hasOwnProperty("ok")){
								if(result.ok == true) {
									fun(true);
								}
							}
						} catch(err) {
							fun(false);
						}
			    	});
	        	}
			} else {
				console.log("error: get storeinfo error");
	        	fun(false);
			}
		}, function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
	        console.log("error: get storeinfo cannot access");
	        fun(false);
		})
	}
	//插入产品分类信息
	ret.insertProductCategory = function(fun) {
		de.get_product_category_nbs(function(result){
			if(result.hasOwnProperty("state")) {
				if(result.state !=1||result.data == ""){
					console.log("error: get product_category is null");
					fun(false);
				}else{
					var categorys = result.data;
						for (var va in categorys) {
							var _param = {
								db : productCategory,
								doc : {
									_id : categorys[va].tid,
									title : categorys[va].name,
									nid : categorys[va].tid,
									start_time : "00:00",
									end_time : "23:59",
									pid : categorys[va].weight,
									image : "images/zc.png"
								}
							}
							_pouchdb.put(_param, function(result) {
			        			try{
									if(result.hasOwnProperty("ok")){
										if(result.ok == true) {

										}
									}
								} catch(err) {
									fun(false);
								}
					    	});
						}
						fun(true);
				}
			} else {
				console.log("error: get product_category error");
				fun(false);
			}
			
		},function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR);
	        console.log("error: get product_category cannot access");
	        fun(false);
		})
	}
	//插入产品信息
	ret.insertProducts = function(fun) {
		de.get_products(function(result) {
			if(result.hasOwnProperty("state")) {
				if(result.state !=1||result.data == ""){
					console.log("error: get products is null");
					fun(false);
				} else {
					var products = result.data;
					for(var i = 0; i < products.length; i++) {
						var myproduct = products[i];
						var nid = "";
						var timelist = new Array();
						for (var j = 0; j < myproduct.time_period.length; j++) {  
                           var _start = myproduct.time_period[j].times.start;
                           var _end = myproduct.time_period[j].times.end;
                           if(_start.length<5){
                            _start = "0" + _start;
                           }
                           if(_end.length<5){
                            _end = "0" + _end;
                           }
                           timelist.push(_start);
                           timelist.push(_end);
                        }
                        timelist.sort();
                        var my_image="";
                        if(myproduct.sku.indexOf(".")>-1||myproduct.sku.indexOf("_")>-1){
                            my_image = myproduct.image_small
                        }else{
                            my_image = myproduct.image_big;
                        }
                        if (myproduct.category_nbs.length <= 0) {
                            continue;
                        }else{
                        	for (var k = 0; k < myproduct.category_nbs.length; k++) {
                                nid = nid + myproduct.category_nbs[k].tid + ",";
                                if(!ret._allnid.hasOwnProperty(myproduct.category_nbs[k].tid)){
                                    ret._allnid[myproduct.category_nbs[k].tid] = [];
                                    ret._allnid[myproduct.category_nbs[k].tid].push(timelist[0]);
                                    ret._allnid[myproduct.category_nbs[k].tid].push(timelist[timelist.length-1]);
                                }else{
                                    ret._allnid[myproduct.category_nbs[k].tid].push(timelist[0]);
                                    ret._allnid[myproduct.category_nbs[k].tid].push(timelist[timelist.length-1]);
                                }
                            }
                        }
                        var _param = {
							db : product,
							doc : {
								_id : myproduct.sku,
								sku : myproduct.sku,
								title : myproduct.title,
								price : myproduct.price,
								sold_out : myproduct.sold_out,
								nid : nid,
								image :my_image,
								imageurl : my_image,
								time_period : JSON.stringify(myproduct.time_period),
								weight : myproduct.weight,
								isreplace : "true"
							}
						}
						_pouchdb.put(_param, function(result) {
		        			try{
								if(result.hasOwnProperty("ok")){
									if(result.ok == true) {

									}
								}
							} catch(err) {
								fun(false);
							}
				    	});
					}
					fun(true);
				}
			} else {
				console.log("error: get myproducts error");
				fun(false);
			}
		}, function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR);
	        console.log("error: get myproducts cannot access");
	        fun(false);
		})
	}
	//插入订单信息
	ret.insertOrderInfo = function(param, fun) {
		var _param = {
			db : orderInfo,
			doc : {
				_id : param.orderInfo.orderid,
				orderid : param.orderInfo.orderid,
				ordertradeno : '',
				payamount : JSON.stringify(param.orderInfo.payamount),
				paystatus : JSON.stringify(param.orderInfo.paystatus),
				paytype : JSON.stringify(param.orderInfo.paytype),
				dicountamount : JSON.stringify(param.orderInfo.dicountamount),
				productList : JSON.stringify(param.productList),
				dicountlist : JSON.stringify(param.discountList),
				addtime : param.orderInfo.booktime
			}
		}
		_pouchdb.put(_param, function(result) {
			try{
				if(result.hasOwnProperty("ok")){
					if(result.ok == true) {
						fun(true);
					}
				}
			} catch(err) {
				fun(false);
			}
    	});
	}
	//插入支付信息
	ret.insertPmtInfo = function(param, fun) {
		pmt.get_corporation_channel(param,function(result){
			if(result.hasOwnProperty("channels")) {
				for(var va in result.channels) {
					for(var i=0; i<result.channels[va].length; i++) {
						if(result.channels[va][i].channel_connect_type == "offline" || result.channels[va][i].channel_connect_type == "all") {
							var _param = {
								db : pmtInfo,
								doc : {
									_id : result.channels[va][i].channel_code,
									channel_code : result.channels[va][i].channel_code,
									channel_name : result.channels[va][i].channel_name,
									isflag : "1"
								}
							}
							_pouchdb.put(_param, function(result) {
			        			try{
									if(result.hasOwnProperty("ok")){
										if(result.ok == true) {
											fun(true);
										}
									}
								} catch(err) {
									fun(false);
								}
					    	});
						}
					}
				}
			} else {
				console.log("error: get pmtinfo error");
				fun(false);
			}
		},function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR);
	        console.log("error: get pmtinfo cannot access");
	        fun(false);
		})		
	}
	//修改posid
	ret.updateStoreInfo_pid = function(param, fun) {
		var _param = {
			db : storeInfo,
			doc : {
				_id : param.storeid,
				_rev : '',
				posid : param.pid
			}
		}
		_pouchdb.updateByIdAndRev(_param, function(result) {
			try{
				if(result.hasOwnProperty("ok")){
					if(result.ok == true) {
						fun(true);
					}
				}
			} catch(err) {
				fun(false);
			}
		})
	}
	//修改产品售罄信息
	ret.updateProduct_sold_out = function(param, fun) {
		for(var va in param) {
			var _param = {
				db : product,
				doc : {
					_id : param[va].sku,
					_rev : '',
					sold_out : param[va].sold_out
				}
			}
			_pouchdb.updateByIdAndRev(_param, function(result) {
				try {
					if(result.hasOwnProperty("ok")){
						if(result.ok == true) {
							fun(true);
						}
					}
				} catch(err) {
					fun(false);
				}
			});
		}
	}
	//修改订单状态信息
	ret.updateOrderInfo_payStatus = function(param, fun) {
		var _param = {
			db : orderInfo,
			doc : {
				_id : param.merchant_no,
				_rev : '',
				paystatus : param.pid,
				ordertradeno : param.tpn_transaction_id
			}
		}
		_pouchdb.updateByIdAndRev(_param, function(result) {
			try {
				if(result.hasOwnProperty("ok")){
					if(result.ok == true) {
						fun(true);
					}
				}
			} catch(err) {
				fun(false);
			}
		});
	}
	//修改产品分类时间信息
	ret.updateCategoryTime = function(param, fun) {
		for(var va in param) {
			var arrayNid = param[va];
			var _param = {
				db : productCategory,
				doc : {
					_id : va,
					_rev : '',
					start_time : arrayNid[0],
					end_time : arrayNid[arrayNid.length-1],
				}
			}
			_pouchdb.updateByIdAndRev(_param, function(result) {
				try {
					if(result.hasOwnProperty("ok")){
						if(result.ok == true) {
							fun(true);
						}
					}
				} catch(err) {
					fun(false);
				}
			});
		}
	}
	//查询菜品分类信息
	ret.queryCategory = function(fun) {
		ret.checkdb(productCategory);
		var _param = {
			db : productCategory,
			doc : {
				include_docs : true,
				attachments : false,
			}
		}
		_pouchdb.allDocs(_param, function(result) {
			console.log(result);
			try {
				if (result.hasOwnProperty("rows")) {
					if(result.rows.length > 0) {
						console.log(1);
						fun(true,result.rows);
					} else {
						console.log(2);
						fun(false,result.rows);
					}
				}
			} catch(err) {
				console.log(3);
				fun(false);
			}
		})
	}
	//查询菜品信息
	ret.queryProduct = function(fun) {
		ret.checkdb(product);
		var _param = {
			db : product,
			doc : {
				include_docs : true,
				attachments : false,
			}
		}
		_pouchdb.allDocs(_param, function(result) {
			try {
				if (result.hasOwnProperty("rows")) {
					if(result.rows.length > 0) {
						fun(true,result.rows);
					} else {
						fun(false,result.rows);
					}
				}
			} catch(err) {
				fun(false);
			}
		})
	}
	//查询支付信息
	ret.queryPmtInfo = function(fun) {
		ret.checkdb(pmtInfo);
		var _param = {
			db : pmtInfo,
			doc : {
				include_docs : true,
				attachments : false
			}
		}
		_pouchdb.allDocs(_param, function(result) {
			try {
				if (result.hasOwnProperty("rows")) {
					if(result.rows.length > 0) {
						fun(true,result.rows);
					} else {
						fun(false,result.rows);
					}
				}
			} catch(err) {
				fun(false);
			}
		})
	}
	//查询订单信息
	ret.queryOrder = function(param, fun) {
		ret.checkdb(orderInfo);
		var _param = {
			db : orderInfo,
			doc : param.doc
		}
		_pouchdb.allDocs(_param, function(result) {
			try {
				if (result.hasOwnProperty("rows")) {
					if(result.rows.length > 0) {
						fun(true,result.rows);
					} else {
						fun(false,result.rows);
					}
				}
			} catch(err) {
				fun(false);
			}
		})
	}
	//检查数据库是否打开
	ret.checkdb = function(db) {
		if(db == undefined || db == null || db == "") {
			storeInfo = _pouchdb.createDB(config.storeInfo);
			productCategory = _pouchdb.createDB(config.productCategory);
			product = _pouchdb.createDB(config.product);
			orderInfo = _pouchdb.createDB(config.orderInfo);
			pmtInfo = _pouchdb.createDB(config.pmtInfo);
		}
	}
	//门店
	ret.isi = function() {
		ret.checkdb(storeInfo);
		ret.insertStoreInfo(function (va) {
			console.log(va);
            if (countisi > 3) {
                countisi = 0;
            }
            if (!va) {
                setTimeout(ret.isi, timeList[countisi]);
                countisi++;
            }
        });
	}
	//产品分类
	ret.ipc = function() {
		ret.checkdb(productCategory);
		ret.insertProductCategory(function (va) {
            if (countisi > 3) {
                countisi = 0;
            }
            if (!va) {
                setTimeout(ret.ipc, timeList[countisi]);
                countisi++;
            }
        });		
	}
	//产品
	ret.ipt = function() {
		ret.checkdb(product);
        ret.insertProducts(function (va) {
            if (countipt > 3) {
                countipt = 0;
            }
            if (!va) {
                setTimeout(ret.ipt, timeList[countipt]);
                countipt++;
            }else{
                ret.updateCategoryTime(ret._allnid,function(falg){
                	if (countipt > 3) {
		                countipt = 0;
		            }
                	if(falg==false){
                		setTimeout(ret.ipt, timeList[countipt]);
                		countipt++;
                	}
                });
            }
        });
	}
	//支付信息
	ret.ipmt = function () {
		ret.checkdb(pmtInfo);
    	var _param = {
    		sid : config.STOREID
    	}
    	ret.insertPmtInfo(_param,function(va) {
    		if (countipmt > 3) {
    			countipmt = 0;
    		}if (!va) {
    			setTimeout(ret.ipmt, timeList[countipt]);
                countipmt++;
    		}
    	})
	}
	return ret;
})();