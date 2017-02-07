/*
  MQ数据格式：
  public QueueType type;
  public String routingkey;
  public String data;
  public ulong tag;
*/
/// <summary>
/// QueueType 主要是用来定义webSocket 传送的信息类型的。
/// receive 服务器端向客户端转发MQ queue的信息类型。
/// ack 是客户端收到MQ queue 信息后发回的ack信息，服务器端接受到ack后会再传给MQ server。
/// queueInit 是客户端告知服务器端建立MQ queue。
/// queueDis 是服务器端向客户端通知 MQ queue已经断开。并返回断开的原因。
/// error 是服务器端告知客户端MQ queue出错。并返回错误信息
/// </summary>

var queueType = {
  "receive": 0,
  "ack":0,
  "nack": 1,
  "nackNorequeue": 2,
  "queueInit": 3,
  "queueDis": 4,
  "error": 5,
  "connectFail": 6,
  "authenticationFailure": 7,
  "channelAllocationFail": 8,
  "queueExcption": 9
};

MqQueue = (function () {
    'use strict';
    var ret = {},
        url,
        queueconfig,
        _onopen,
        _onclose,
        _onmessage,
        _onerror,
        startTime,
        reconnectTimer,
        reconnectTimeout,
        ws = null;

    var liveTimer = (new Date()).getTime() + 2 * 60 * 1000;
    function setLiveTimer(t) {
        if (!t) { t = 2;}
        liveTimer = (new Date()).getTime() + t * 60 * 1000;
    }
    function isTimeout() {
        if ((new Date()).getTime() > liveTimer) {
            return true;
        } else {
            return false;
        }
    }
    function checkState() {
        setTimeout(function () {
            if (isTimeout()) {
                ret.disInit();
                setTimeout(function () {
                    ws.close();
                    setLiveTimer();
                }, 1500);
            }
            checkState();
        }, 30 * 1000);
    }
    function send(message) {
        if (ws && ws.readyState == 1) {
            ws.send(message);
        } else {
            console.log("MqQueue socket is down!");
            console.log(ws);
        }
    }
    function isChange(rkey) {
        var patern = /ischange$/i;
        return patern.test(rkey);
    }
    function isReply(rkey) {
        return (new RegExp(replyRoutingKey)).test(rkey);
    }

    function isStatusReply(rkey) {
        return (new RegExp("updateApi")).test(rkey);
    }

    function isEditOrderReply(rkey) {
        return (new RegExp("EditOrderApi")).test(rkey);
    }

    function getKeyFromRoutingKey(rkey) {
        var patt1 = new RegExp(replyRoutingKey + config.getStoreID() + ".");
        var r = rkey.replace(patt1, "");
        console.log("r:" + r);
        return r;
    }
    function getOrderIdFromRoutingKey(rkey) {
        return rkey.substr(0, rkey.length - 1);
    }
    function getStatusFromRoutingKey(rkey) {
        return rkey.substr(-1, 1);
    }
    ret.init = function (u, qconfig, flushOrders, onmessage, onerror, onopen, onclose) {
        console.log(qconfig);
        url = u;
        queueconfig = qconfig;
        if (onopen && typeof (onopen) == "function") {
            _onopen = onopen;
        } else {
            _onopen = function (evt) {
                reconnectTimeout = 5000;
                setTimeout(function () {
                    ret.connect();
                }, 1000);
                console.log("Mq-queue webSocket connected!");
            };
        }
        if (onclose && typeof (onclose) == "function") {
            _onclose = onclose;
        } else {
            _onclose = function (evt) {
                console.log("Mq-queue close!");
                reconnectTimeout += 10 * 1000;
                if (reconnectTimeout > 100 * 1000) {
                    reconnectTimeout = 20 * 1000;
                }
                reconnectTimer = setTimeout(function () {
                    ret.reInit();
                }, reconnectTimeout);
            };
        }
        if (onmessage && typeof (onmessage) == "function") {
            _onmessage = onmessage;
        } else {
            _onmessage = function (evt) {
                try {
                    var d = JSON.parse(evt.data);
                    console.log("Mq_queue onMessage +++++++++++++++++++++++++++++++++++++");
                    switch (d.type) {
                        case queueType.receive:
                            
                            setLiveTimer(2);
                            console.log("Mq:");
<<<<<<< HEAD
                            // console.log(d.data);
                            if (d.routingkey == config.getQueueRoutingKeyHeartbeat()) {
                                heartBeat.minusTimes();
                            } else if(d.routingkey == config.getQueueRoutingKeySoldout()){
                                var _d = JSON.parse(d.data);
                                console.log(_d);
                                console.log(_d.product_soldout_up);
                                products.setSoldout(_d.product_soldout_up);
=======
                            console.log(d.data);
                            
                            if (d.routingkey == MQCfg.getQueueRoutingKeyHeartbeat()) {
                                 heartBeat.minusTimes();
                            } else if(d.routingkey == MQCfg.getQueueRoutingKeySoldout()){

                                findAllByTableName('POSIDS',function(posId) {
                                if(posId[0]) {
                                    var arr = JSON.parse(d.data).product_soldout_up,
                                        soldout = [];
                                    console.log(arr);
                                    for(var i in arr) {
                                        console.log(arr[i][0]);
                                        if(arr[i][0].store_id == posId[0].storeId) {
                                            soldout.push(i);
                                        }
                                    }
                                    $('.item').removeClass('soldout');
                                    console.log(soldout);
                                    for(var i in soldout) {
                                        $('#'+soldout[i]).addClass('soldout');
                                        console.log("售罄的产品sku:"+soldout[i]);
                                    }
                                    //console.log(JSON.parse(d.data).product_soldout_up);
                                    // for() {

                                    // }
                                }
                            });
                            //     var _d = JSON.parse(d.data);
                            //     console.log(_d);
                            //     console.log(_d.product_soldout_up);
                            //     products.setSoldout(_d.product_soldout_up);
>>>>>>> 6987027ff5f4ae6a0b087a914512996e2b6de93f
                            }
                            break;
                        case queueType.queueInit:
                            console.log("Queue Init call back!+++++++++++++++++++++++++++++++++");
                            console.log(d);
                            if (d.data == "success") {

                            } else if (d.data == "fail") {
                                setTimeout(function () { ret.connect(); }, 10 * 1000);
                            }
                            break;
                        case queueType.connectFail:
                        case queueType.authenticationFailure:
                        case queueType.channelAllocationFail:
                            break;
                        case queueType.queueDis:
                            setTimeout(function () { ret.connect(); }, 10 * 1000);
                            break;
                        case queueType.queueExcption:

                            break;
                        default:
                            break;
                    }
                }
                catch (err) {
                    console.error(err);
                    ret.nackNorequeue(d.tag);
                }
            };
        }
        if (onerror && typeof (onerror) == "function") {
            _onerror = onerror;
        } else {
            _onerror = function (evt) {
                console.log("Mq-queue error!");
            };
        }
        ws = new WebSocket(url);
        ws.onopen = _onopen;
        ws.onclose = _onclose;
        ws.onmessage = _onmessage;
        ws.onerror = _onerror;
        checkState();
        return ret;
    };
    ret.reInit = function () {
        ws = null;
        ws = new WebSocket(url);
        ws.onopen = _onopen;
        ws.onclose = _onclose;
        ws.onmessage = _onmessage;
        ws.onerror = _onerror;
        //ret.connect();
        //requeue.requeueTimer();
        return ret;
    }
    ret.disInit = function () {
        var queueDis = {
            "type": queueType.queueDis,
            "data": JSON.stringify(queueconfig)
        };
        send(JSON.stringify(queueDis));
    };
    /*
    ret.addExchange = function(exchange){
      mMqExchange = exchange;
      return ret;
    };
    ret.addDataBase = function(database){
      mDataBase = database;
      return ret;
    };
    */
    ret.connect = function () {
        var queueInit = {
            "type": queueType.queueInit,
            "data": JSON.stringify(queueconfig)
        };
        send(JSON.stringify(queueInit));
    };
    ret.ack = function (tag) {
        var queueAck = {
            "type": queueType.ack,
            "tag": parseInt(tag)
        };
        //send(JSON.stringify(queueAck));
    };
    ret.nack = function (tag) {
        var queueNAck = {
            "type": queueType.nack,
            "tag": parseInt(tag)
        };
        //send(JSON.stringify(queueNAck));
    };
    ret.nackNorequeue = function (tag) {
        var queueNAck = {
            "type": queueType.nackNorequeue,
            "tag": parseInt(tag)
        };
        //send(JSON.stringify(queueNAck));
    };
    return ret;
})();

function testMqQueue() {
    'use strict';
    MqQueue.init("ws://"+config.MqQueueIP+"/MqQueue", MQCfg.getMqQueueCfg());
}


