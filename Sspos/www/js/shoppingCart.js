cart = (function(){
    'use strict';
    var ret = {};
    var cartList = [];
    var isTakeout = 0;
    var orderdetail = {
        totalNumber: 0,   //订单总产品数
        totalAmount: 0.00    // 订单总价格
    };
    function isNewProduct(pdt) {
        var flag = -1;
        cartList.forEach(function (itm, idx) {
            if (itm && itm.productid == pdt.sku) {
                flag = idx;
                return false;
            }
        });
        return flag;
    }
    ret.setIsTakeout = function (val) {
        isTakeout = val;
    };
    ret.getIsTakeout = function () {
        return isTakeout;
    };
    //添加购物车
    ret.addproduct = function(product, UIHandle){
        //var ShoppingCart = sutils.getParam("ShoppingCart");
        var pdtTmp,
            newPdt = false;
        var idx = isNewProduct(product);
        if (idx == -1) {
            var pdtNum =1;
            if((product.sku.indexOf(".")>-1||product.sku.indexOf("_")>-1)&&product.pdtNum!=undefined){
                pdtNum = product.pdtNum;
            }
            pdtTmp = {
                "productid": product.sku,
                "totalprice": pdtNum * product.price,
                "productnum": pdtNum,
                "productimg": product.imageurl,
                "salesarea": "",
                "productname": product.title,
                "productprice": product.price,
            }
            cartList.push(pdtTmp);
            newPdt = true;
        } else {
            cartList[idx].productnum += 1;
            cartList[idx].totalprice += Number(cartList[idx].productprice);
            pdtTmp = cartList[idx];
        }
        if (UIHandle && typeof (UIHandle) == "function") {
            UIHandle(pdtTmp, newPdt);
        }
    };

    ret.addProductNumOne = function (productid, UIHandle) {
        cartList.forEach(function (itm, idx) {
            if (itm && itm.productid == productid) {
                cartList[idx].productnum += 1;
                cartList[idx].totalprice += Number(cartList[idx].productprice);
                if (UIHandle && typeof (UIHandle) == "function") {
                    UIHandle(cartList[idx]);
                }
                return true;
            }
        });
        
    };
    ret.minusProductNumOne = function (productid, UIHandle) {
        var pdtTmp = {};
        cartList.forEach(function (itm, idx) {
            if (itm && itm.productid == productid) {
                if (itm.productnum >= 2) {
                    cartList[idx].productnum -= 1;
                    cartList[idx].totalprice -= Number(cartList[idx].productprice);
                    pdtTmp = cartList[idx];
                } else {
                    cartList[idx] = null;
                    pdtTmp.productid = productid;
                    pdtTmp.productnum = 0;
                }
                if (UIHandle && typeof (UIHandle) == "function") {
                    UIHandle(pdtTmp);
                }
                return true;
            }
        });
    };
    //修改购买商品数量
    ret.updateproductnum = function (productid, productnum) {
        cartList.forEach(function (itm, idx) {
            if (itm && itm.productid == productid) {
                cartList[idx].productnum = Number(productnum);
                cartList[idx].totalprice = Number(cartList[idx].productnum) * Number(cartList[idx].productprice);
                return false;
            }
        });
    };
    //获取购物车中的所有商品  
    ret.getproductlist = function () {
        return cartList;
    };
    //获取购物车中的总计信息 
    ret.getTotalInfo = function () {
        var count = 0;
        var total = 0;
        cartList.forEach(function (itm) {
            if (itm) {
                count += Number(itm.productnum);
                total += Number(itm.totalprice);
            }
        });
        orderdetail.totalNumber = count;
        orderdetail.totalAmount = total;
        return orderdetail;
    };
    //判断购物车中是否存在商品  
    ret.existproduct = function (productid) {
        var flag = false;
        if (cartList.length > 0) {
            cartList.forEach(function (itm) {
                if (itm.productid == productid) {
                    flag = true;
                    return true;
                }
            });
        }
        return flag;
    };
    //获取指定商品
    ret.getproduct = function (productid) {
        var pdt;
        cartList.forEach(function (itm) {
            if (itm && itm.productid == productid) {
                pdt = itm;
            }
        });
        return pdt;
    };
    //删除指定商品
    ret.deleteproduct = function (productid, UIHandle) {
        var pdtTmp = {};
        cartList.forEach(function (itm, idx) {
            if (itm && itm.productid == productid) {
                cartList.splice(idx, 1);
                pdtTmp.productid = productid;
                pdtTmp.productnum = 0;
                if (UIHandle && typeof (UIHandle) == "function") {
                    UIHandle(pdtTmp);
                }
                return true;
            }
        });
    };
    //清空购物车
    ret.clearCartList = function () {
        cartList = [];
    };
    ret.getStaticInfo = function () {
        var total = 0,
            discount = 0,
            realpay = 0;
        cartList.forEach(function (itm, idx) {
            if (itm) {
                total += Number(itm.totalprice);
                discount += (Number(itm.totalprice * mDiscount.getDiscount()).toFixed(2)*10);
                
            }
        });
        realpay = total - discount/10;
        return {
            "total": total,
            "discount": discount/10,
            "realpay": realpay,
        }
    };
    return ret;
})();