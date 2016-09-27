$(document).ready(function () {
	var backTime; //返回首页计时
    sql.opendb();
    sql.createTable(); //第一次打开程序时执行此方法一次
    sql.ipc();
    sql.isi();
    sql.ipt();
    $(document).click(function(){  
        kit.setTimerout(backTime,180*1000,function(){
        	$('#slideshow').show();
        }) 
    }); 
    slideshow.show();
} );