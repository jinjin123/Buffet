kit = (function () {
    'use strict';
    var ret = {};
    ret.numstr = function (nums) {
        var num = nums + "";
        if (num.length == 1) {
            num = "00" + num;
            return num;
        } else if (num.length == 2) {
            num = "0" + num;
            return num;
        } else {
            return num
        }
    };
    ret.compareTime = function (startDate, endDate) {
            var startDateTemp = startDate.split(" ");   
            var endDateTemp = endDate.split(" ");   
                   
            var arrStartDate = startDateTemp[0].split("-");   
            var arrEndDate = endDateTemp[0].split("-");   
  
            var arrStartTime = startDateTemp[1].split(":");   
            var arrEndTime = endDateTemp[1].split(":");   
  
            var allStartDate = new Date(arrStartDate[0], arrStartDate[1], arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2]);   
            var allEndDate = new Date(arrEndDate[0], arrEndDate[1], arrEndDate[2], arrEndTime[0], arrEndTime[1], arrEndTime[2]);   
            if (allStartDate.getTime() >= allEndDate.getTime()) {   
                //console.log("startTime>endTime");   
                return false;   
            } else {   
               // alert("startTime<endTime");
                return true;   
            }     
    };
    ret.parseTime = function (time) {
        if (time < 10) {
            time = "0" + time;
        }
        return time;
    };
    ret.ismobile = function(mobile){
        var pattern = /^1[34578]\d{9}$/;  
        if (pattern.test(mobile)) {  
            return true;  
        }  
        return false;  
    };
    return ret;
})();

Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}
function myTip(x, y, time) {
    $('#myTip').css('width', x + 'px');
    $('#myTip').find('p').text(y);
    $('#myTip').animate({ top: '0' }, 500);
    setTimeout("$('#myTip').animate({top:'-100px'},500);", time);
}