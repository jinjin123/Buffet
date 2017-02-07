webStomp = (function(){
	'use strict';
	var ret = {};
	var ws,client;
	var receiveMsg = function(evt){
		if(evt.body == "changeColor") {
			
		} else {
		    var message =JSON.parse(evt.body);
	        if(message.command=="changeSubPos"){		
	            location.href=config.SUBPOS_URL;
	        }
		}
	}
	//订阅消息
	function subscribe(name){
		client.subscribe("/topic/"+name+".*.*", function(evt){
			console.log(evt);
			receiveMsg(evt);
		}, {destination:"/topic/"+name, id:name, durable:true, "auto-delete":false} );
	}
	//发送消息
	function sendMsg(name,content){
		console.log(123);
		client.send("/topic/"+name,{},content);
		console.log(567);
	}

	ret.initMq = function(){
		ws = new WebSocket('ws://'+ config.mq_ip +'/ws');
		client = Stomp.over(ws);
		//定义连接成功回调函数
		var on_connect = function() {
			subscribe(config.ssPosName);
			console.log('connected');
			sendMsg(config.posName,"changeColor");
		};
		var on_error =  function() {
		    console.log('error');
		    setTimeout(webStomp.initMq, 1000);
		};
		client.connect('guest', 'guest', on_connect, on_error, '/');
	}
	return ret;
})();