config = (function () {
    'use strict';

    var ret = {};

    ret.storeInfo = {
      options : 'adapter',
      dbname : 'storeInfo',
      adapter : 'websql'
    };
    ret.productCategory = {
      options : 'adapter',
      dbname : 'productCategory',
      adapter : 'websql'
    }
    ret.product = {
      options : 'adapter',
      dbname : 'product',
      adapter : 'websql'
    }
    ret.orderInfo = {
      options : 'adapter',
      dbname : 'orderInfo',
      adapter : 'websql'
    }
    ret.pmtInfo = {
      options : 'adapter',
      dbname : 'pmtInfo',
      adapter : 'websql'
    }





    //de
    ret.DE_URL = "http://de.zkungfu.com/api/";
    ret.DE_CODE = "?token=ef5940407a519f7e0f566bbfb2230a0331840275&security_code=testapi";
    //oc
    ret.OC_URL = "http://172.16.104.97:9000/";
    ret.ACCESS_TOKEN = "481A0y0722G721S5p21853gNNnc583N9DUZ4f90995lQbl6pGw229zA1652P2h56";
    //mkt
    ret.MKT_URL = "http://mkt.zkungfu.com/api/marketing/";
    //crm
    ret.CRM_URL = "http://crm.zkungfu.com/zkf-crm/api/";
    ret.CRM_ACCESSTOKEN ="W/bkcCjGNmzjS/l6DTwxDA==";
    //pmt
    ret.PMT_URL = "http://payment.dplor.com/api/";
    ret.PMT_KEY = "naWNUNW5pzmzISiGaHPBgMgtr";
    ret.PMT_SECURITY = "5bpjjQWp26cll0ixzKKHZOLnt";

    ret.VERSION = "windows1.01";
    ret.TYPE = "SS";  //机器类型
    ret.ID = "01";
    ret.STORENAME = "";
    ret.STOREID = "HQ020001";
    ret.STOREID2 = "CN757023";
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
