/// <summary>
/// ExChangeType 主要是定义了webSocket 传送Exchange信息的类型。
/// exPublish 定了客户端向服务器端发送的信息类型，告诉服务器向MQ server exchange 发送信息。
/// exAck 定义服务器端告诉服务器端MQ Server已经接受到信息类型
/// exInit 客户端告诉服务器端创建一个 exChange 连接。
/// exDis 服务器端告诉客户端exChange 已经断开连接
/// error 服务器端告诉服务器端exChange 出错。
/// 
/// </summary>
var ExchangeType = {
  "exPublish": 0,
  "exAck":0, 
  "exInit": 1,
  "exDisInit": 2,
  "exDis": 3,
  "error": 4,
  "connectFail": 5,
  "authenticationFailure": 6,
  "channelAllocationFail": 7,
  "offline": 8
};
heartBeat = (function () {
    var ret = {};
    var times = 0;
    function isOverTimes () {
        if (times >= 5) {
            times = 5;
            return true;
        } else {
            return false;
        }
    };
    function addTimes() {
        times += 1;
    };
    ret.minusTimes = function () {
        times -= 1;
        if (times < 0) {
            times = 0;
        }
    };
    ret.beat = function () {
        if (isOverTimes()) {
            console.log("heart is too much times");
            return false;
        }
        console.log("heartbeart routingkey:" + MQCfg.getQueueRoutingKeyHeartbeat());
        MqExchange.publish("heartbeat", MQCfg.getQueueRoutingKeyHeartbeat(), function (d) {
            if (d.data == "true") {
                addTimes();
            }
        });
    };
    return ret;
})();

MqExchange = (function () {
    'use strict';
    var ret = {},
        url,
        exchangeconfig,
        websocket,
        _onopen,
        _onclose,
        _onmessage,
        _onerror,
        reconnectTimer,
        reconnectTimeout,
        exchangeAck = (function () {
            var r = {};
            var ackList = [];
            r.checkAck = function (ack, d) {
                ackList.forEach(function (item, index) {
                    if (item.ack == ack) {
                        if (typeof (item.fun) == "function") {
                            item.fun(ack, d);
                        }
                        item = null;
                        ackList.splice(index, 1);
                        return ack;
                    }
                });
                return false;
            };

            r.addAck = function (ack, callback) {
                if (ack == null) {
                    ack = generateUUID();
                }
                var obj = {
                    "ack": ack,
                    "fun": callback
                };
                ackList.push(obj);
                return ack;
            };
            r.clearAck = function () {
                ackList.forEach(function (item, index) {
                    item = null;
                    ackList.splice(index, 1);
                });
            };
            return r;
        })();
    var liveTimer = (new Date()).getTime() + 2 * 60 * 1000;;
    function setLiveTimer(t) {
        if (!t) { t = 2; }
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
                -ret.disInit();
                setTimeout(function () {
                    websocket.close();
                    setLiveTimer();
                }, 1500);
            }
            checkState();
            heartBeat.beat();
        }, 30 * 1000);
    }
    function send(message) {
        if (websocket && websocket.readyState == 1) {
            websocket.send(message);
        } else {
            console.log("MqExchange socket is down!");
            var d = JSON.parse(message);
            d.type = ExchangeType.offline;
            d.data = "websocket is down";
            exchangeAck.checkAck(d.tag, JSON.stringify(d));
        }
    }
    ret.init = function (u, exconfig, onmessage, onerror, onopen, onclose) {
        url = u;
        exchangeconfig = exconfig;
        if (onopen) {
            _onopen = onopen;
        } else {
            _onopen = function (evt) {
                console.log("exchange connected!");
                setTimeout(function () {
                    ret.connect();
                }, 1000);
            };
        }
        if (onclose) {
            _onclose = onclose;
        } else {
            _onclose = function (evt) {
                console.log("Mq-Exchange close!");
                reconnectTimeout += 10 * 1000;
                if (reconnectTimeout > 100 * 1000) {
                    reconnectTimeout = 20 * 1000
                }
                reconnectTimer = setTimeout(function () {
                    ret.reInit();
                }, reconnectTimeout);
            };
        }
        if (onmessage) {
            _onmessage = onmessage;
        } else {
            _onmessage = function (evt) {
                var d = JSON.parse(evt.data);
                if (d.type == ExchangeType.exInit) {
                    if (d.data == "success") {

                    } else if (d.data == "fail") {
                        setTimeout(function () { ret.connect(); }, 10 * 1000);
                    }
                } else if (d.type == ExchangeType.exAck) {
                    setLiveTimer();
                    if (d.data == "true") {

                    } else {

                    }
                } else if (d.type == ExchangeType.connectFail) {

                } else if (d.type == ExchangeType.authenticationFailure) {

                } else if (d.type == ExchangeType.channelAllocationFail) {

                } else if (d.type == ExchangeType.exDis) {
                    setTimeout(function () { ret.connect(); }, 10 * 1000);
                }
            };
        }
        if (onerror) {
            _onerror = onerror;
        } else {
            _onerror = function (evt) {
                console.log("Mq-Exchange error!")
            };
        }
        websocket = new WebSocket(url);
        websocket.onopen = _onopen;
        websocket.onclose = _onclose;
        websocket.onmessage = _onmessage;
        websocket.onerror = _onerror;
        checkState();
    };
    ret.connect = function () {
        var exchangeInit = {
            "type": ExchangeType.exInit,
            "data": JSON.stringify(exchangeconfig)
        }
        send(JSON.stringify(exchangeInit));
    };
    ret.reInit = function () {
        websocket = null;
        websocket = new WebSocket(url);
        websocket.onopen = _onopen;
        websocket.onclose = _onclose;
        websocket.onmessage = _onmessage;
        websocket.onerror = _onerror;
        return ret;
    }
    ret.disInit = function () {
        var exchangeInit = {
            "type": ExchangeType.exDisInit,
            "data": JSON.stringify(exchangeconfig)
        }
        send(JSON.stringify(exchangeInit));
    }
    ret.publish = function (data, routingkey, fun) {
        var ack = exchangeAck.addAck(null, fun);
        var exChangePublish = {
            "type": ExchangeType.exPublish,
            "routingKey": routingkey,
            "data": data,
            "tag": ack
        }
        send(JSON.stringify(exChangePublish));
    };
    ret.ack = function (tag, d) {
        return exchangeAck.checkAck(tag, d);
    };
    return ret;
})();
function testExchange() {
    MqExchange.init("ws://"+config.MqExchangeIP+"/MqExChange", MQCfg.getMqExchangeCfg());
}
