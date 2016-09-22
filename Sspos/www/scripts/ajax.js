_ajax = (function () {
	'use strict';

	var ret = {};

    ret.postParam = {
        type : "post",
        contentType : "application/json;charset=utf-8",
        dataType : "json",
        timeout : 20*1000
    }

    ret.getParam = {
        type : "get",
        timeout : 20*1000
    }
    //post提交
	ret.post = function(param,sfn,efn){
		var ajax = $.ajax({
			url : param.url,
			type : ret.postParam.type,
			contentType : ret.postParam.contentType,
            data : param.data,
            dataType : ret.postParam.dataType,
            timeout : ret.postParam.timeout,
            success : function(result){
            	if (sfn && typeof (sfn) == "function") {
                    sfn(result);
                }
            },error : function(jqXHR, textStatus, errorThrown){
            	ajax.abort();
            	if (efn && typeof (efn) == "function") {
                    efn(jqXHR,textStatus,errorThrown);
                }
            }
		})
	};
    //get提交
    ret.get = function(param,sfn,efn){
        var ajax = $.ajax({
            url : param.url,
            type : ret.getParam.type,
            timeout : ret.getParam.timeout,
            success : function(result){
                if (sfn && typeof (sfn) == "function") {
                    sfn(result);
                }
            },error : function(jqXHR, textStatus, errorThrown){
                ajax.abort();
                if (efn && typeof (efn) == "function") {
                    efn(jqXHR,textStatus,errorThrown);
                }
            }
        })
    }
	return ret;
})();