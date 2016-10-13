
slideshow = (function () {
    'use strict';
    var ret = {};
    var showFlag = true; //轮播开关
    var slideTime;
    var step = 0;
    ret.imagesURLList = []; //轮播图片
    //显示轮播图
    ret.show = function(){
    	$('#container').show();
    	$('.circle').show();
    	$('.circle2').show();
    }
    //隐藏轮播图
    ret.hide = function(){
    	$('#container').hide();
    	$('.circle').hide();
    	$('.circle2').hide();
    }
    //加载轮播图
    ret.init = function(fun){
        if(config.STOREID!=""&&config.STOREID!=null){
            var param = {
                "sid":config.STOREID,
                "platform_type":"ss"
            }
            mkt.get_image(param,function(reslut){
                for(var i=0;i<reslut.length;i++){
                     ret.imagesURLList.push(reslut[i].image);
                }
                console.log("success: mkt get_image is ok");
            },function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR);
                console.log("error: mkt get_image cannot access");
            })
            fun(true);
        }
    }
    //本地图片
    ret.localshow = function(){
         ret.imagesURLList.push("images/1.jpg");
         ret.imagesURLList.push("images/2.jpg");
         ret.imagesURLList.push("images/3.jpg");
         ret.imagesURLList.push("images/4.jpg");
        kit.setTimerInterval(slideTime,5*1000,function(){
            if (showFlag == true) {
                if ( ret.imagesURLList.length > 0) {
                    var elem = document.getElementById('slideshowImage');
                    elem.src =  ret.imagesURLList[step];
                    step += 1;
                    if (step >=  ret.imagesURLList.length) {
                        step = 0;
                    }
                }
            }
        });
    }
    //mkt 图片
    ret.mktshow = function(){
         ret.init(function(flag){
            kit.setTimerInterval(slideTime,5*1000,function(){
                if (showFlag == true) {
                    if ( ret.imagesURLList.length > 0) {
                        var elem = document.getElementById('slideshowImage');
                        elem.src =  ret.imagesURLList[step];
                        step += 1;
                        if (step >=  ret.imagesURLList.length) {
                            step = 0;
                        }
                    }else{
                       ret.init(function(flag){

                       }) 
                    }
                }
            });
         });
    } 
    return ret;
})();
$('#container').on('click',function(){
	slideshow.hide();
	product.show();
    cart.clearCartList();
    clearCartDom();
    $(".cart").children().remove();
    $(".totalamout").html('0.00');
    localStorage.setItem("istakeout",1);
})
