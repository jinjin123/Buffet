config = (function () {
    'use strict';
    var ret = {};
    //de
    ret.DE_URL = "http://de.zkungfu.com/api/";
    ret.DE_CODE = "?token=ef5940407a519f7e0f566bbfb2230a0331840275&security_code=testapi";
    //oc
    ret.OC_URL = "http://172.16.103.192:8080/";
    ret.ACCESS_TOKEN = "hty4B91i8S02je45FL07AnN29UB7Hu2mZ2t1864Hk29Oji06M1397212281Th717";
    //mkt
    ret.MKT_URL = "http://mkt.zkungfu.com/api/marketing/get-image";
    //crm
    ret.CRM_URL = "http://crm.zkungfu.com/zkf-crm/api/";
    ret.CRM_ACCESSTOKEN ="W/bkcCjGNmzjS/l6DTwxDA==";
    //pmt
    ret.PMT_URL = "http://pmt.zkungfu.com/api/";
    ret.KEY = "8a970a5f2835ad6ba323db0e73aee6f1";
    ret.PMT_SECURITY = "369c9360b966d3a4e4154fbc96efe0f0";












    //bus
    ret.bus_ip = "172.17.251.2";
    ret.ssPosName = "ssPos01";
    ret.ssBusToken = "6b36bd5e0d084441a0ec818bb50f4306";
    ret.printerName = "printer01";


    //TPOS
    ret.SUBPOS_URL = "http://192.168.1.124:9002";

    ret.VERSION = "windows1.01";
    ret.TYPE = "SS";  //机器类型
    ret.ID = "01";
    ret.STORENAME = "";
    ret.STOREID = "CN757023";
    ret.address_detail = "";
    ret.phone = "15710652956";

    var queueRoutingKey = "DE.Notice";
    var mqQueueCfg = {
        "hostname": "172.16.102.122",
        "port": "8082",
        "username": "ymeng",
        "password": "111111",
        "virtualhost": "/zkf",
        "exchange": "DE",
        //"queuename": "SS" + config.STOREID + config.ID,
        "queuerouttingkey": queueRoutingKey,
        //"replyqueuerouttingkey": "reply.status." + "SS" + config.STOREID + config.ID
    };
    ret.getQueueRoutingKeySoldout = function () {
        return queueRoutingKey;
    };
    ret.getQueueRoutingKeyHeartbeat = function () {
        return "reply.status." + "SS" + config.STOREID + config.ID;
    };
    ret.getMqQueueCfg = function () {
        return mqQueueCfg;
    };
    var mqExchangeCfg = {
        "hostname": "172.16.102.122",
        "port": "8082",
        "username": "ymeng",
        "password": "111111",
        "virtualhost": "/zkf",
        "exchange": "DE",
        //"exchangerouttingkey": "reply.status." + "SS" + config.STOREID + config.ID,
    };
    ret.getMqExchangeCfg = function () {
        return mqExchangeCfg;
    };
    function getTilteAddrAgain(db) {
        db.transaction(function (tx) {
            tx.executeSql('select title, address_detail from storeinfo', [], function (tx,res) {
                for (var i = 0; i < res.rows.length; i++) {
                    var data = res.rows.item(i);
                    ret.STORENAME = data.title;
                    ret.address_detail = data.address_detail;
                }
                console.log("storename:" + ret.STORENAME);
                console.log("Address:" + ret.address_detail);
                if (ret.STORENAME == null || ret.address_detail == null || ret.STORENAME == "" || ret.address_detail == "") {
                    /*setTimeout(function () {
                        getTilteAddrAgain(db);
                    }, 5000);*/
                    ret.STORENAME = sql_storename;
                    ret.address_detail = sql_address_detail;
                }
            }, function (e) {
                setTimeout(function () {
                    getTilteAddrAgain(db);
                }, 5000);
            });
        });
    }
    ret.initStoreInfo = function (db, fun) {
        db.transaction(function (tx) {
            tx.executeSql('select * from storeinfo', [], function (tx,res) {
                for(var i=0;i<res.rows.length;i++){
                   var data= res.rows.item(i);
                   ret.ID = data.pid;
                   ret.STOREID = data.storeid;
                   if (data.title!= null && data.address_detail != null && data.titleE != "" && data.address_detail != "") {
                        ret.STORENAME = data.title;
                        ret.address_detail = data.address_detail;
                    }else{
                        ret.STORENAME = sql_storename;
                        ret.address_detail = sql_address_detail;
                    }
                   mqQueueCfg.queuename = "SS" + ret.STOREID + ret.ID;
                   mqQueueCfg.replyqueuerouttingkey = "reply.status." + "SS" + config.STOREID + config.ID;
                   mqExchangeCfg.exchangerouttingkey = "reply.status." + "SS" + config.STOREID + config.ID;
                }
                fun();
            }, function (e) {
            	createbuffetMealDB(db);
                console.log('初始化门店信息失败');
                setTimeout(function () {
                    //ret.initStoreInfo(db, fun);
                    getTilteAddrAgain(db);
                }, 5000);
            });
        });
    };
    return ret;
})();
