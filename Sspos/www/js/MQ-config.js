

MQCfg = (function(){
    var ret = {};
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
        /*
        findAllByTableName('POSIDS',function(posId) {
            console.log("***********************************");
            console.log(posId);
            if(posId[0]) {
                return "reply.status." + "TS" + posId[0].storeId + posId[0].POSID;
            }
        });
        */
        return mqQueueCfg.replyqueuerouttingkey;
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

    ret.init = function() {
        mqQueueCfg.queuename = "SS" + ret.STOREID + ret.ID;
        mqQueueCfg.replyqueuerouttingkey = "reply.status." + "SS" + config.STOREID + config.ID;
        mqExchangeCfg.exchangerouttingkey = "reply.status." + "SS" + config.STOREID + config.ID;
    };
    return ret;
})();
setTimeout(function(){
    MQCfg.init();
},2000);

    
