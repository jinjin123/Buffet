<<<<<<< HEAD
﻿var SP30Services = (function () {
    'use strict';
     var SP30Type = {
         "exception": 0, 
         "rf_ClosePort": 1,
         "rf_init_com": 2,
         "Signin": 3,
         "Payment": 4,
         "Revert": 5,
         "GetPrintInfo": 6,
         "Signoff": 7,
         "SetOperatorID": 8,
         "ReadCard": 9,
         "WriteCard": 10,
         "ConfigCom": 11,
    }
    var ret = {},
        url,
        _onopen,
        _onclose,
        _onmessage,
        _onerror,
        initated = false,
        closed = false,
        timesWS = 0,
        timeoutWS = 5000,
        heartbeatTimer,
        port = "0",
        ws;
    var initSP30Timer,
            times = 0,
            timeout = 5000;
    function setInitated(v) {
        initated = v;
    }
    function iSInitated() {
        return initated;
    }
    ret.isInitated = function () {
        return initated;
    };
    var callbackManager = (function () {
        var r = {},
            id_list = [];
        r.checkId = function (id, d) {
            id_list.forEach(function (item, index) {
                if (item.id == id) {
                    if (typeof (item.fun) == "function") {
                        item.fun(d);
                    }
                    item = null;
                    id_list.splice(index, 1);
                    return id;
                }
            });
            return false;
        };
        r.addId = function (callback) {
            var id = generateUUID();
            var obj = {
                "id": id,
                "fun": callback
            };
            id_list.push(obj);
            return id;
        };
        r.clearId = function () {
            id_list.forEach(function (item, index) {
                item = null;
                id_list.splice(index, 1);
            });
        };
        return r;
    })();
    function send(message) {
        if (ws && ws.readyState == 1) {
            ws.send(message);
        } else {
            try{
                var d = JSON.parse(message);
                d.type = SP30Type.exception;
                callbackManager.checkId(d.id, JSON.stringify(d));
            } catch (err) {
                console.log(err);
            }
           
        }
    }
    function heartbeat() {
        heartbeatTimer = setInterval(function () {
                            send("");
                        }, 73 * 1000);
    }
    ret.init = function (u, onmessage, onerror, onopen, onclose) {
        if(url && _onmessage && _onopen && _onclose){
          if(u && typeof(u) == "string") url = u;
          ws.close();
          return;
        }
        url = u;
        if (onerror == null) {
            _onerror = function (evt) {
                console.log("SP30Services error!");
            };
        } else {
            _onerror = onerror;
        }
        if (onopen == null) {
            _onopen = function (evt) {
                console.log("SP30Services WebSocket connected!");
                timesWS = 0;
                timeoutWS = 5000;
                initSP30();
            };
        } else {
            _onopen = onopen;
        }
        if (onclose == null) {
            _onclose = function (evt) {
                console.log("SP30Services close!");
                console.log(evt);
                //logFile.log("SP30Services close!");
                console.log(evt.code);
                //logFile.log(evt.code);
                //logFile.log(evt.ToString());
                if(!closed){
                	setInitated(false);
	                callbackManager.clearId();
	                setTimeout(function () {
	                    ret.reconnect()
	                }, timeoutWS);
                }
            };
        } else {
            _onclose = onclose;
        }
        if (onmessage == null) {
            _onmessage = function (evt) {
                var d = JSON.parse(evt.data);
                callbackManager.checkId(d.id, d);
            };
        } else {
            _onmessage = onmessage;
        }
        if (ws) {
            ws.close();
            ws = null;
        }
        ws = new WebSocket(url);
        ws.onopen = _onopen;
        ws.onclose = _onclose;
        ws.onmessage = _onmessage;
        ws.onerror = _onerror;
        heartbeatTimer = clearInterval(heartbeatTimer);
        heartbeat();
    };
    ret.close = function(){
    	closed = true;
    	if (ws) {
            ws.close();
            ws = null;
        }
    };
    ret.reconnect = function () {
        timesWS += 1;
        timeoutWS = timesWS * 5000;
        if (timesWS >= 10) {
            timesWS == 0;
            //alert("闪付多次尝试连接失败,请检查设备~");
            //myTip(900, "闪付多次尝试连接失败,请检查设备~", 10000 * 1000);
            //return false;
        }
        if (ws) {
            ws.close();
            ws = null;
        }
        ws = new WebSocket(url);
        ws.onopen = _onopen;
        ws.onclose = _onclose;
        ws.onmessage = _onmessage;
        ws.onerror = _onerror;
    }
    ret.setPort = function(p){
        port = p;
    };
    ret.getPort = function(){
        return port;
    };
    ret.rf_ClosePort = function (fun) {
        var id = callbackManager.addId(fun);
        var messageBody = {
            "type": SP30Type.rf_ClosePort,
            "id": id,
        };
        send(JSON.stringify(messageBody));
    };
    ret.rf_init_com = function (port, fun) {
        var id = callbackManager.addId(fun);
        var messageBody = {
            "type": SP30Type.rf_init_com,
            "id": id,
            "data": port,
        };
        send(JSON.stringify(messageBody));
    };
    ret.Signin = function (fun) {
        var id = callbackManager.addId(fun);
        var messageBody = {
            "type": SP30Type.Signin,
            "id": id,
        };
        send(JSON.stringify(messageBody));
    };
    ret.Payment = function (cash, fun) {
        var id = callbackManager.addId(fun);
        var messageBody = {
            "type": SP30Type.Payment,
            "id": id,
            "data": String(cash),
        };
        send(JSON.stringify(messageBody));
    };
    ret.Revert = function (serial, fun) {
        var id = callbackManager.addId(fun);
        var messageBody = {
            "type": SP30Type.Revert,
            "id": id,
            "data": String(serial),
        };
        send(JSON.stringify(messageBody));
    };
    ret.GetPrintInfo = function (serial, fun) {
        var id = callbackManager.addId(fun);
        var messageBody = {
            "type": SP30Type.GetPrintInfo,
            "id": id,
            "data": String(serial),
        };
        send(JSON.stringify(messageBody));
    };
    ret.Signoff = function (fun) {
        var id = callbackManager.addId(fun);
        var messageBody = {
            "type": SP30Type.Signoff,
            "id": id,
        };
        send(JSON.stringify(messageBody));
    };
    ret.SetOperatorID = function (operatorID, length, fun) {
        var id = callbackManager.addId(fun);
        var obj = {
            "operatorID": String(operatorID),
            "length": length,
        };
        var messageBody = {
            "type": SP30Type.SetOperatorID,
            "id": id,
            "data": JSON.stringify(obj),
        };
        send(JSON.stringify(messageBody));
    };
    ret.ReadCard = function (fun) {
        var id = callbackManager.addId(fun);
        var messageBody = {
            "type": SP30Type.ReadCard,
            "id": id,
        };
        send(JSON.stringify(messageBody));
    };
    ret.WriteCard = function (cardInfo, fun) {
        var id = callbackManager.addId(fun);
        var messageBody = {
            "type": SP30Type.WriteCard,
            "id": id,
            "data": cardInfo,
        };
        send(JSON.stringify(messageBody));
    };
    ret.ConfigCom = function (port, fun) {
        var id = callbackManager.addId(fun);
        var messageBody = {
            "type": SP30Type.ConfigCom,
            "id": id,
            "data": port,
        };
        send(JSON.stringify(messageBody));
    };
    //初始化设备
    function initSP30() {
        initSP30Timer = setTimeout(function () {
            if (iSInitated()) {
                initSP30Timer = clearTimeout(initSP30Timer);
                return true;
            }
            try{
                SP30Services.rf_init_com(port.toString(), function (initD) {
                    if (initD.state == 0) {
                        setInitated(true);
                        initSP30Timer = clearTimeout(initSP30Timer);
                    } else {
                        if (times > 5) {
                            initSP30Timer = clearTimeout(initSP30Timer);
                            return false;
                        }
                        timeout += 5000;
                        times += 1;
                        initSP30();
                    }
                });
            } catch (e) {
                //logFile.log(e);
            }
            
        }, timeout);
    }
    return ret;
=======
﻿var SP30Services = (function() {
	'use strict';
	var SP30Type = {
		"exception": 0,
		"rf_ClosePort": 1,
		"rf_init_com": 2,
		"Signin": 3,
		"Payment": 4,
		"Revert": 5,
		"GetPrintInfo": 6,
		"Signoff": 7,
		"SetOperatorID": 8,
		"ReadCard": 9,
		"WriteCard": 10,
		"ConfigCom": 11,
	}
	var ret = {},
		url,
		_onopen,
		_onclose,
		_onmessage,
		_onerror,
		initated = false,
		timesWS = 0,
		timeoutWS = 5000,
		heartbeatTimer,
		port = "0",
		ws;
	var initSP30Timer,
		times = 0,
		timeout = 5000;

	function setInitated(v) {
		initated = v;
	}

	function iSInitated() {
		return initated;
	}
	ret.isInitated = function() {
		return initated;
	};
	var callbackManager = (function() {
		var r = {},
			id_list = [];
		r.checkId = function(id, d) {
			id_list.forEach(function(item, index) {
				if(item.id == id) {
					if(typeof(item.fun) == "function") {
						item.fun(d);
					}
					item = null;
					id_list.splice(index, 1);
					return id;
				}
			});
			return false;
		};
		r.addId = function(callback) {
			var id = generateUUID();
			var obj = {
				"id": id,
				"fun": callback
			};
			id_list.push(obj);
			return id;
		};
		r.clearId = function() {
			id_list.forEach(function(item, index) {
				item = null;
				id_list.splice(index, 1);
			});
		};
		return r;
	})();

	function send(message) {
		if(ws && ws.readyState == 1) {
			ws.send(message);
		} else {
			try {
				var d = JSON.parse(message);
				d.type = SP30Type.exception;
				callbackManager.checkId(d.id, JSON.stringify(d));
			} catch(err) {
				console.log(err);
			}

		}
	}

	function heartbeat() {
		heartbeatTimer = setInterval(function() {
			send("");
		}, 73 * 1000);
	}
	ret.init = function(u, onmessage, onerror, onopen, onclose) {
		if(url && _onmessage && _onopen && _onclose) {
			if(u && typeof(u) == "string") url = u;
			ws.close();
			return;
		}
		url = u;
		if(onerror == null) {
			_onerror = function(evt) {
				console.log("SP30Services error!");
			};
		} else {
			_onerror = onerror;
		}
		if(onopen == null) {
			_onopen = function(evt) {
				console.log("SP30Services WebSocket connected!");
				timesWS = 0;
				timeoutWS = 5000;
				initSP30();
			};
		} else {
			_onopen = onopen;
		}
		if(onclose == null) {
			_onclose = function(evt) {
				console.log("SP30Services close!");
				console.log(evt);
				//logFile.log("SP30Services close!");
				console.log(evt.code);
				//logFile.log(evt.code);
				//logFile.log(evt.ToString());
				setInitated(false);
				callbackManager.clearId();
				setTimeout(function() {
					ret.reconnect()
				}, timeoutWS);
			};
		} else {
			_onclose = onclose;
		}
		if(onmessage == null) {
			_onmessage = function(evt) {
				var d = JSON.parse(evt.data);
				callbackManager.checkId(d.id, d);
			};
		} else {
			_onmessage = onmessage;
		}
		if(ws) {
			ws.close();
			ws = null;
		}
		ws = new WebSocket(url);
		ws.onopen = _onopen;
		ws.onclose = _onclose;
		ws.onmessage = _onmessage;
		ws.onerror = _onerror;
		heartbeatTimer = clearInterval(heartbeatTimer);
		heartbeat();
	};
	ret.reconnect = function() {
		timesWS += 1;
		timeoutWS = timesWS * 5000;
		if(timesWS >= 10) {
			timesWS == 0;
			//alert("闪付多次尝试连接失败,请检查设备~");
			//myTip(900, "闪付多次尝试连接失败,请检查设备~", 10000 * 1000);
			//return false;
		}
		if(ws) {
			ws.close();
			ws = null;
		}
		ws = new WebSocket(url);
		ws.onopen = _onopen;
		ws.onclose = _onclose;
		ws.onmessage = _onmessage;
		ws.onerror = _onerror;
	}
	ret.setPort = function(p) {
		port = p;
	};
	ret.getPort = function() {
		return port;
	};
	ret.rf_ClosePort = function(fun) {
		var id = callbackManager.addId(fun);
		var messageBody = {
			"type": SP30Type.rf_ClosePort,
			"id": id,
		};
		send(JSON.stringify(messageBody));
	};
	ret.rf_init_com = function(port, fun) {
		var id = callbackManager.addId(fun);
		var messageBody = {
			"type": SP30Type.rf_init_com,
			"id": id,
			"data": port,
		};
		send(JSON.stringify(messageBody));
	};
	ret.Signin = function(fun) {
		var id = callbackManager.addId(fun);
		var messageBody = {
			"type": SP30Type.Signin,
			"id": id,
		};
		send(JSON.stringify(messageBody));
	};
	ret.Payment = function(cash, fun) {
		var id = callbackManager.addId(fun);
		var messageBody = {
			"type": SP30Type.Payment,
			"id": id,
			"data": String(cash),
		};
		send(JSON.stringify(messageBody));
	};
	ret.Revert = function(serial, fun) {
		var id = callbackManager.addId(fun);
		var messageBody = {
			"type": SP30Type.Revert,
			"id": id,
			"data": String(serial),
		};
		send(JSON.stringify(messageBody));
	};
	ret.GetPrintInfo = function(serial, fun) {
		var id = callbackManager.addId(fun);
		var messageBody = {
			"type": SP30Type.GetPrintInfo,
			"id": id,
			"data": String(serial),
		};
		send(JSON.stringify(messageBody));
	};
	ret.Signoff = function(fun) {
		var id = callbackManager.addId(fun);
		var messageBody = {
			"type": SP30Type.Signoff,
			"id": id,
		};
		send(JSON.stringify(messageBody));
	};
	ret.SetOperatorID = function(operatorID, length, fun) {
		var id = callbackManager.addId(fun);
		var obj = {
			"operatorID": String(operatorID),
			"length": length,
		};
		var messageBody = {
			"type": SP30Type.SetOperatorID,
			"id": id,
			"data": JSON.stringify(obj),
		};
		send(JSON.stringify(messageBody));
	};
	ret.ReadCard = function(fun) {
		var id = callbackManager.addId(fun);
		var messageBody = {
			"type": SP30Type.ReadCard,
			"id": id,
		};
		send(JSON.stringify(messageBody));
	};
	ret.WriteCard = function(cardInfo, fun) {
		var id = callbackManager.addId(fun);
		var messageBody = {
			"type": SP30Type.WriteCard,
			"id": id,
			"data": cardInfo,
		};
		send(JSON.stringify(messageBody));
	};
	ret.ConfigCom = function(port, fun) {
		var id = callbackManager.addId(fun);
		var messageBody = {
			"type": SP30Type.ConfigCom,
			"id": id,
			"data": port,
		};
		send(JSON.stringify(messageBody));
	};
	//初始化设备
	function initSP30() {
		initSP30Timer = setTimeout(function() {
			if(iSInitated()) {
				initSP30Timer = clearTimeout(initSP30Timer);
				return true;
			}
			try {
				SP30Services.rf_init_com(port.toString(), function(initD) {
					if(initD.state == 0) {
						setInitated(true);
						initSP30Timer = clearTimeout(initSP30Timer);
					} else {
						if(times > 5) {
							initSP30Timer = clearTimeout(initSP30Timer);
							return false;
						}
						timeout += 5000;
						times += 1;
						initSP30();
					}
				});
			} catch(e) {
				//logFile.log(e);
			}

		}, timeout);
	}
	return ret;
>>>>>>> 6987027ff5f4ae6a0b087a914512996e2b6de93f
})();

function generateUUID() {
	var d = new Date().getTime();
	if(window.performance && typeof window.performance.now === "function") {
		d += performance.now(); //use high-precision timer if available
	}
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return(c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
}

function sp30_signin() {
	setTimeout(function() {
		if(SP30Services.isInitated()) {
			//签到
			SP30Services.Signin(function(signinD) {
				if(signinD.state == 0) {
					SP30Services.SetOperatorID("000099", 6, function(SetOperatorIdD) {
						if(SetOperatorIdD.state == 0) {
							console.log("Signin and setOperate successfully!");
						}
					});
				}
			});
		} else {
			sp30_signin();
		}

	}, 1000);
}
<<<<<<< HEAD
function sp30_signin() {
	setTimeout(function() {
		if(SP30Services.isInitated()) {
			//签到
			SP30Services.Signin(function(signinD) {
				if(signinD.state == 0) {
					SP30Services.SetOperatorID("000099", 6, function(SetOperatorIdD) {
						if(SetOperatorIdD.state == 0) {
							console.log("Signin and setOperate successfully!");
						}
					});
				}
			});
		} else {
			sp30_signin();
		}

	}, 1000);
}

function sp30_init(url, p) {
	SP30Services.setPort(p);
	SP30Services.init(url);
	sp30_signin()
};
/*
var printerCom;
var searchPrinterCom = setInterval(function() {
	printerCom = stmCfg.printerCfg.printerCom;
	if(printerCom != "" || printerCom != "undefined") {
		clearInterval(searchPrinterCom);
		setTimeout(function() {
			console.info("com口设置", printerCom);
			sp30_init("ws://localhost:4649/SP30", printerCom); //printerCom
		}, 500);
	}
}, 1000);
*/
/*
var testflag = false;
function testSP30() {
    if (testflag == false) {
        SP30Services.setPort("0");
        SP30Services.init("ws://localhost:4649/SP30");
    }
        
    setTimeout(function () {
        if (SP30Services.isInitated()) {
            //签到
            SP30Services.Signin(function (signinD) {
                SP30Services.SetOperatorID("000099", 6, function (SetOperatorIdD) {
                    SP30Services.Payment(1, function (paymentD) {
                        console.log(paymentD);
                    });

                });
            });
        } else {
            testSP30();
        }
                
    }, 5000);
    
}
*/
=======

function sp30_init(url, p) {
	SP30Services.setPort(p);
	SP30Services.init(url);
	sp30_signin()
};
>>>>>>> 6987027ff5f4ae6a0b087a914512996e2b6de93f
