var backindex,backtip,paytip,paytime,inquiry,topay,afterpayindextip,afterpayindex;
var backtime = 180*1000,afterpayindextime = 20*1000;
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
    //返回首页倒计时
    ret.backindexTime = function() {
    	var times = 0;
    	$('.backtip').slideUp(800);
    	$('#m').html("15");
    	clearTimeout(backindex);
    	clearInterval(backtip);
    	backtip = setInterval(function (){
    		times ++;
    		if(times >= (backtime/1000-15) && times < backtime/1000) {
    			$('.backtip').slideDown(800);
    			$('#m').html(backtime/1000-times);
    		}else if(times == backtime/1000) {
    			clearInterval(backtip);
    			$('.backtip').slideUp(800);
    			$('#m').html("0");
    		}
    	}, 1000);
		backindex = setTimeout(function () {
	        slideshow.show();
	        product.hide();
	        order.hide();
	    }, backtime);
    }
    //清除返回首页倒计时
    ret.clearbackindexTime = function() {
    	clearTimeout(backindex);
    	clearInterval(backtip);
    	$('.backtip').slideUp(800);
    	$('#m').html("15");
    }
    //有效支付时间倒计时
    ret.payTime = function() {
    	var topaytime = 180;
    	clearInterval(topay);
    	$('.mypaytip').slideDown(800);
    	topay = setInterval(function () {
    		$('#paym').html(kit.parseTime(Math.floor(topaytime / 60)) + ":" + kit.parseTime(topaytime % 60));
        	topaytime--;
        	if(topaytime <=0 ){
        		clearInterval(topay);
        		$('.mypaytip').slideUp(800);
        		$('#paym').html("00:00");
        	}
    	},1000);
    }
    //清除有效支付时间倒计时
	ret.clearpayTime = function() {
    	clearInterval(topay);
    	$('.mypaytip').slideUp(800);
    	$('#paym').html("00:00");
    }
    //支付成功返回首页倒计时
    ret.afterpayTime = function() {
    	var paytimes = 20;
    	$('.afterpay').slideDown(800); 
    	clearTimeout(afterpayindex);
    	clearInterval(afterpayindextip);
    	afterpayindextip = setInterval(function () {
    		$('#apaym').html(paytimes);
    		paytimes --;
    		if(paytimes <= 0){
    			clearInterval(afterpayindextip);
    			$('.afterpay').slideUp(800);
    			$('#apaym').html("20");
    		}
    	},1000);
    	afterpayindex = setTimeout(function () {
	        slideshow.show();
	        product.hide();
	        order.hide();
	    }, afterpayindextime);
    }
    //清除支付成功返回首页倒计时
    ret.clearafterpayTime = function() {
    	clearTimeout(afterpayindex);
    	clearInterval(afterpayindextip);
		$('.afterpay').slideUp(800);
		$('#apaym').html("20");
    }
    ret.setTimerout = function (val,time,fun) {
        ret.clearTimerout(val);
        val = setTimeout(function () {
            if (fun && (typeof (fun) == "function")) {
                fun();
            }
        }, time);
    }
    ret.clearTimerout = function (val) {
        val = clearTimeout(val);
    }
    ret.setTimerInterval = function (val,time,fun) {
        ret.clearTimerInterval(val);
        val = setInterval(function () {
            if (fun && (typeof (fun) == "function")) {
                fun();
            }
        },time)
    }
    ret.clearTimerInterval = function (val) {
       val = clearInterval(val);
    }

    ret.getInt = function (num) {
        return String(Math.floor(num)) + '.';
    }
    ret.getDecimal = function (num) {
        var num1 = num;
        var num2 = Math.floor(num);
        var num3 = (num1*100) - (num2*100) ;
        if(String(num3).indexOf('.') == -1){
            if(num3==0){
                num3=num3+"0";
            }
            return String(num3);
        }else{
            num3 = num3 * 100;
            if(num3==0){
                num3=num3+"0";
            }
            return String(num3);
        }
    }
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