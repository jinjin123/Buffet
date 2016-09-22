
slideshow = (function () {
    'use strict';
    var ret = {};
    ret.init = function(fun){
        if(config.STOREID!=""&&config.STOREID!=null){
            var param = {
                "sid":config.STOREID,
                "platform_type":"ss"
            }
            mkt.get_image(param,function(reslut){
                console.log("success: mkt get_image success");
                fun(true);
            },function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR);
                console.log("error: mkt get_image cannot access");
                fun(false);
            })
        }
    }
    return ret;
})();