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


    ret.mq_ip = "172.28.7.1:15674";
    ret.ssPosName = "sspos1";
    ret.posName = "pos99";

    ret.MqExchangeIP = "localhost:4649";
    ret.MqQueueIP = "localhost:4649";

    ret.RawPrinter_ip = "localhost:4649";
    ret.printerName = "printer";
    //de
    ret.DE_URL = "http://de.zkungfu.com/api/";
    ret.DE_CODE = "?token=ef5940407a519f7e0f566bbfb2230a0331840275&security_code=testapi";
    //oc
    ret.OC_URL = "http://sparkpadg-elasticl-2t187adkjku3-926650160.cn-north-1.elb.amazonaws.com.cn:9087/newPos_oc/";
    ret.ACCESS_TOKEN = "hty4B91i8S02je45FL07AnN29UB7Hu2mZ2t1864Hk92Oji06M1397552281Th717";
    //mkt
    ret.MKT_URL = "http://mkt.zkungfu.com/api/marketing/";
    //crm
    ret.CRM_URL = "http://crm.zkungfu.com/zkf-crm/api/";
    ret.CRM_ACCESSTOKEN ="W/bkcCjGNmzjS/l6DTwxDA==";
    //pmt
    ret.PMT_URL = "http://pmt.zkungfu.com/api/";
    ret.PMT_KEY = "8a970a5f2835ad6ba323db0e73aee6f1";
    ret.PMT_SECURITY = "369c9360b966d3a4e4154fbc96efe0f0";

    ret.VERSION = "windows1.01";
    ret.TYPE = "SS";  //机器类型
    ret.ID = "01";
    ret.STORENAME = "陈村万家店";
    ret.STOREID = "CN757023";
    ret.STOREID2 = "CN757023";
    ret.address_detail = "佛山市顺德区陈村镇合成居委会佛陈路一号8座顺联广场8号楼M105";
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
