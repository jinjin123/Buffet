sql = (function() {
	'use strict';
	var ret = {};
	var db = "";
	var timeList = [5000, 10000, 20000, 30000]
    var countipc = 0, countisi = 0, countipt = 0;
	ret._allnid = {};
	//打开数据库
	ret.opendb = function(){

		db = openDatabase('SSDB','1.0','ss db',1024*100);
	};
	//创建数据表
	ret.createTable = function(){
		db.transaction(function(tx){
			//创建门店信息表
			tx.executeSql('DROP TABLE IF EXISTS storeinfo');
			tx.executeSql('create table if not exists storeinfo (storeid text primary key,title text,address text,address_detail text,pid text,version text,update_detime text)');
	        //创建产品分类表
	        tx.executeSql('DROP TABLE IF EXISTS product_category');
	        tx.executeSql('create table if not exists product_category (nid text primary key,title text,start_time text,end_time text,pid INTEGER)');
	        //创建产品表
	        tx.executeSql('DROP TABLE IF EXISTS product');
	        tx.executeSql('create table if not exists product (sku text primary key,title text,price text,sold_out text,nid text,image text,imageurl text,start_time text,end_time text,weight text)');
	        //创建订单表
	        tx.executeSql('DROP TABLE IF EXISTS orderinfo');
	        tx.executeSql('create table if not exists orderinfo (orderid text primary key,payamount text,paystatus text,paytype text,discountamount text,productlist text,addtime text)');
		},function(e){
			console.log("创建数据表失败");
		})
	};
	//插入门店信息
	ret.insertStoreinfo = function(fun){
		de.get_store(function(result){
        	if(result.state != 1||result.data == ""){
        		console.log("error: get storeinfo is null");
        		fun(false);
        	}else{
        		var store = result.data;
        		config.STORENAME= store.title;
                config.address_detail=store.address_detail;
        		db.transaction(function (tx) {
        			tx.executeSql('delete from storeinfo'); //防止插入多条数据
        			tx.executeSql('insert or replace into storeinfo (storeid,title,address,address_detail,pid,version,update_detime) values(?,?,?,?,?,?,?)',
        				[store.store_id,store.title,store.address.name,store.address_detail,config.ID,config.VERSION,new Date().format('yyyy-MM-dd')]
        				,function(tx,res){
        					console.log("success: insert storeinfo is ok");
        					fun(true);
        			},function(e){
        				console.log("error: insert storeinfo error");
        				fun(false);
        			})
        		});
        	}
	    },function(jqXHR, textStatus, errorThrown){
	        console.log(jqXHR);
	        console.log("error: get storeinfo cannot access");
	        fun(false);
	    })
	};
	//插入产品分类信息
	ret.insertProduct_Category = function(fun){
		de.get_product_category_nbs(function(result){
			if(result.state !=1||result.data == ""){
				console.log("error: get product_category is null");
				fun(false);
			}else{
				var categorys = result.data;
				db.transaction(function(tx){
					tx.executeSql('delete from product_category');
					for (var va in categorys) {
						tx.executeSql('insert or replace into product_category (title,nid,start_time,end_time,pid) values(?,?,?,?,?)',
                                [categorys[va].name,categorys[va].tid,"00:00","23:59",categorys[va].weight],
							function(tx,res){

						},function(e){
							console.log("error: insert product_category is error");
							fun(false);
						})
					}
					console.log("success: insert product_category is ok");
					fun(true);
				});
			}
		},function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR);
	        console.log("error: get product_category cannot access");
	        fun(false);
		})
	};
	//插入产品信息
	ret.insertproducts = function(fun){
		de.get_products(function(result){
			if(result.state !=1||result.data == ""){
				console.log("error: get products is null");
				fun(false);
			}else{
				var products = result.data;
				db.transaction(function(tx){
					tx.executeSql('delete from product');
					for(var i=0;i<products.length;i++){
						var product = products[i];
						var nid = "";
						var timelist = new Array();
						for (var j = 0; j < product.time_period.length; j++) {   
                           var _start = product.time_period[j].times.start;
                           var _end = product.time_period[j].times.end;
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
                        if(product.sku.indexOf(".")>-1||product.sku.indexOf("_")>-1){
                            my_image = product.image_small
                        }else{
                            my_image = product.image_big;
                        }
                        if (product.category_nbs.length <= 0) {
                            continue;
                        }else{
                        	for (var k = 0; k < product.category_nbs.length; k++) {
                                nid = nid + product.category_nbs[k].tid + ",";
                                if(!ret._allnid.hasOwnProperty(product.category_nbs[k].tid)){
                                    ret._allnid[product.category_nbs[k].tid] = [];
                                    ret._allnid[product.category_nbs[k].tid].push(timelist[0]);
                                    ret._allnid[product.category_nbs[k].tid].push(timelist[timelist.length-1]);
                                }else{
                                    ret._allnid[product.category_nbs[k].tid].push(timelist[0]);
                                    ret._allnid[product.category_nbs[k].tid].push(timelist[timelist.length-1]);
                                }
                            }
                        }
                        tx.executeSql('insert or replace into product (sku,title,price,sold_out,nid,image,imageurl,start_time,end_time,weight) values(?,?,?,?,?,?,?,?,?,?)',
                                [product.sku, product.title, product.price, product.sold_out, nid, ret.getThumbNameByUrl(my_image), my_image,timelist[0],timelist[timelist.length-1],product.weight],
                                function(tx,res){

                        },function(e){

                        })
					}
					console.log("success: insert products is ok");
					fun(true);
				})
			}
		},function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR);
	        console.log("error: get products cannot access");
	        fun(false);
		})
	}
	//插入订单表
	ret.insertOrderInfo = function(param,fun){
		db.transaction(function(tx){
			tx.executeSql('insert into orderinfo (orderid,payamount,paystatus,paytype,discountamount,productlist,addtime) values(?,?,?,?,?,?,?)',
				[],function(tx,res){
				console.log("success: insert orderinfo is");
	       		fun(false);
			},function(e){

			})
		});
	}
	//转换url
	ret.getThumbNameByUrl = function(url){
		var name = "";
	    if (url && typeof (url) == "string") {
	        var arr = url.split("/");
	        if (arr.length > 1) {
	            name = faultylabs.MD5(arr[arr.length - 1]) + '.jpg';
	        }
	    }
	    return name;
	}
	//修改产品分类售卖时间
	ret.updateCategoryTime = function(param,fun){
		db = ret.checkdb(db);
		db.transaction(function (tx) {
	        for(var anid in param){
	            var arrayNid = param[anid];
	             arrayNid.sort();
	             tx.executeSql('update product_category set start_time=?,end_time=? where nid = ?',[arrayNid[0],arrayNid[arrayNid.length-1],anid],function(tx,res){
	            },function(e){
	                console.log("error: update CategoryTime error");
	                fun(false);
	            })
	        }
	    });
	}
	//修改posid
	ret.updateStoreInfo_pid = function(param,fun){
		db = ret.checkdb(db);
		db.transaction(function (tx) {
			tx.executeSql('update storeinfo set pid=? where storeid=?',[param.pid,param.storeid],function(tx,res){
				console.log("success: update StoreInfo_pid success");
	        	fun(true);
			},function(e){
				console.log("error: update StoreInfo_pid error");
	        	fun(false);
			})
		})
	}
	//修改产品售罄信息
	ret.updateProduct_sold_out = function(param,fun){
		db = ret.checkdb(db);
		db.transaction(function (tx) {
			for(var va in param){
				var product = param[va];
				tx.executeSql('update product set sold_out=? where sku=?',[product.sold_out,product.sku],function(tx,res){

				},function(e){
					console.log("error: update product_sold_out error");
	        	    fun(false);
				})
			}
			console.log("success: update product_sold_out success");
	        fun(true);	
		})
	}
	//查询菜品分类
	ret.queryCategory = function(result,fun){
		db = ret.checkdb(db);
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM product_category ORDER BY pid ASC', [], function(tx,res){
				if(res.rows.length >0){
					result = res.rows;
					fun(true);
				}else{fun(false);}
			},function(e){
				console.log("error: select product_category error");
				fun(false);
			})
		})
	}
	//查询菜品
	ret.queryProduct = function(result,fun){
		db = ret.checkdb(db);
		db.transaction('SELECT * FROM product', [], function(tx,res){
			if(res.rows.length >0){
				result = res.rows;
				fun(true);
			}else{fun(false);}
		},function(e){
			console.log("error: select product error");
			fun(false);
		})
	}
	//检查数据库是否打开
	ret.checkdb = function(db){
		if (db == undefined || db == null) {
	        db = openDatabase('SSDB','1.0','ss db',1024*100);
	    }
    	return db;
	}
    //产品分类信息
    ret.ipc = function() {
        db = ret.checkdb(db);
        ret.insertProduct_Category(function (va) {
            if (countipc > 3) {
                countipc = 0;
            }
            if (!va) {
                setTimeout(ret.ipc, timeList[countisi]);
                countisi++;
            }
        });
    }
    //门店信息
    ret.isi = function() {
        db = ret.checkdb(db);
        ret.insertStoreinfo(function (va) {
            if (countisi > 3) {
                countisi = 0;
            }
            if (!va) {
                setTimeout(ret.isi, timeList[countisi]);
                countisi++;
            }
        });
    }
    //产品信息
    ret.ipt = function() {
        db = ret.checkdb(db);
        ret.insertproducts(function (va) {
            if (countipt > 3) {
                countipt = 0;
            }
            if (!va) {
                setTimeout(ret.ipt, timeList[countipt]);
                countipt++;
            }else{
                db = ret.checkdb(db);
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
	return ret;
})();