
slideshow = (function () {
    'use strict';
    var ret = {};
    var showFlag =true; //轮播开关
    var slideTime;
    ret.imagesURLList = []; //轮播图片
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
        }
    }
    //本地图片
    ret.localshow = function(){
         ret.imagesURLList.push("defultSlideshow/01.jpg");
         ret.imagesURLList.push("defultSlideshow/02.jpg");
         ret.imagesURLList.push("defultSlideshow/03.jpg");
         ret.imagesURLList.push("defultSlideshow/04.jpg");
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
    ret.show = function(){
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