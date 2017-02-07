/*
  lineWidth 是打印一行英文字符的个数，str 是需要打印的字符， other 是打印在同一行的前面的字符，
  因为打印机没有收到feed 命令会把打印的内容作为同一行。
  数量    产品  总数
*/
var printFlayType = 1,printerTypeConfig = {};
setTimeout(function () {
        printerTypeConfig.printStyleTemp = {
            flag :2,
            totalStrNum:48,
            oneStrNum : 4,
            twoStrNum : 25,
            threeStrNum :48,
            temp:15
        }
        function testEscCMDServices() {
            ESCCMDServices.init("ws:"+config.RawPrinter_ip+"/ESCCMD");
            ESCCMDServices.setLineWidth(printerTypeConfig.printStyleTemp.totalStrNum);
            ESCCMDServices.setRate(printerTypeConfig.printStyleTemp.flag);
        }
        testEscCMDServices();
/*        setTimeout(function(){
          var printerStamp = {
              paySerial : "1234433443",
              amout : "20.00",
              discount : "20.00",
              realpay : "20.00",
              protitle : "外带",
              payType : "微信"
          }
          templatePrinter.printerTemplateSmall(printerStamp);
        },1000)*/
},1500);
function getStrAlignRightByWidth(lineWidth, str, other){
    str = str+"";
    if(other)
    other = other+"";
  if(!other) other = "";
  var rate = ESCCMDServices.getRate();
  var spaceStr = "";
  var len = strlen(str) + strlen(other);
  var lenZh = len - (other+str).length;
  var lenEng = len - lenZh * 2;
  var lenTmp = lineWidth - (Math.ceil(lenZh *rate) + lenEng);
  for(var i = 0; i < lenTmp; i++){
    spaceStr += " ";
  }
  return spaceStr + str.toString();
};
var templatePrinter = {
    printerTemplateSmall : function(printData){
        var printerObj = {
            "title": "欢迎光临" + config.STORENAME,
            "address": "地址：["+config.address_detail+"]",
            "pid": "机号：["+config.ID+"] ",
            "printTime": "打印时间："+(new Date()).format("yyyy-MM-dd hh:mm:ss"),
            "fetchTip": "请留意取餐区的屏幕！",
            "fetchNum": "取餐号："+order.orderno.substring(order.orderno.length - 4, order.orderno.length),
            "proListTitle": printData.protitle,
            //"tableTitle": "列表标题",
            //public List<proList> proList":打印产品信息
            proList: [],
            "total": "总    价:_￥"+printData.amout,
            "discount": "优    惠:_￥"+printData.discount,
            "actualCollect" : "实    收:_￥"+printData.realpay,
            "realpay": "应    收:_￥"+printData.realpay,
            //"payTypeTip": "支付类型:_200",
            "change": "找    零:_￥0",
            "payType": "支付方式:_"+printData.payType,
            //"countpay": "账号支付:_40.00",
            "discount1": "优惠金额:_"+printData.discount,
            "paySerial": "支付交易号:_"+printData.paySerial,
            "customer" : "顾客签名：_"+" ",
            "opinion" : "意见反馈：_"+" ",
            "foot": "谢谢光临真功夫",
            "qcodeTip1": "扫此二维码加入真功夫会员，",
            "qcodeTip2": "在线下单，送货上门。",
            "qcodeTip3": "线上活动精彩不断，真功夫等你来参与！",
            "qcode": "WINSS200_200.bmp"
        }
        var _productlist = cart.getproductlist();
        for (var i = 0; i < _productlist.length; i++) {
            var _pro = {};
            if (_productlist[i] == null)
                continue;
            _pro.num = _productlist[i].productnum;
            _pro.name = _productlist[i].productname;
            _pro.total ="￥"+ _productlist[i].totalprice;
             printerObj.proList.push(_pro);
        }
        printerObj.line0="------------------------------------------------";
        printerStyle.smallTicket2(printerObj,config.printerName);
    }
};
var printerStyle = {
    smallTicket2 : function(printerData,printerName){
        ESCCMDServices.alignCenter();
        ESCCMDServices.dobuleHWZH();
        ESCCMDServices.printString(printerData.title);
        ESCCMDServices.printCacheAndFeed();
        ESCCMDServices.printCacheAndFeed();
        ESCCMDServices.CanceldobuleHWZH();
        ESCCMDServices.alignLeft();
        ESCCMDServices.printString(printerData.address);
        ESCCMDServices.printCacheAndFeed();
        ESCCMDServices.printCacheAndFeed();
        ESCCMDServices.printString(printerData.pid);
        ESCCMDServices.printCacheAndFeed();

        ESCCMDServices.printString(printerData.printTime);
        ESCCMDServices.printCacheAndFeed();
        
        ESCCMDServices.printString(printerData.line0);
      
        ESCCMDServices.printCacheAndFeed();
        ESCCMDServices.alignCenter();
        /*ESCCMDServices.dobuleHWZH()
        ESCCMDServices.dobuleHWEng();
        ESCCMDServices.printString(printerData.fetchTip);
        ESCCMDServices.printCacheAndFeed();
        ESCCMDServices.CanceldobuleHWZH();
        ESCCMDServices.CanceldobuleHWEng();*/
        ESCCMDServices.dobuleHWZH()
        //ESCCMDServices.dobuleHWEng();
        
        ESCCMDServices.printString(printerData.fetchNum);
        ESCCMDServices.printCacheAndFeed();
       
        //ESCCMDServices.CanceldobuleHWEng();
        ESCCMDServices.CanceldobuleHWZH();
        ESCCMDServices.alignLeft();
        ESCCMDServices.printString(printerData.line0);
        ESCCMDServices.printCacheAndFeed();
      
        ESCCMDServices.printString(printerData.proListTitle);
        
        ESCCMDServices.printFeedDot("4A");
        proTable3Column({"num": "数量",  "name": "产品", "total": "金额"});
        ESCCMDServices.printString(printerData.line0);
        ESCCMDServices.printCacheAndFeed();
        ESCCMDServices.printCacheAndFeed();
        printerData.proList.forEach(function(d, i){
            proTable3Column(d);
            ESCCMDServices.printCacheAndFeed();
        });
        ESCCMDServices.printString(printerData.line0);
        ESCCMDServices.printCacheAndFeed();
        proTable2Column(printerData.total);
        proTable2Column(printerData.discount);
        proTable2Column(printerData.realpay);
        proTable2Column(printerData.actualCollect);
        proTable2Column(printerData.change);
        ESCCMDServices.printString(printerData.line0);
        ESCCMDServices.printCacheAndFeed();
        ESCCMDServices.printCacheAndFeed();
        proTable2Column(printerData.payType);
        ESCCMDServices.printCacheAndFeed();
        if(printerData.paySerial != "支付交易号:_"){
            proTable2Column(printerData.paySerial);
        }
        ESCCMDServices.printString(printerData.line0);
        proTable2Column(printerData.customer);
        ESCCMDServices.printCacheAndFeed();
        ESCCMDServices.printCacheAndFeed();
        ESCCMDServices.printCacheAndFeed();
        proTable2Column(printerData.opinion);
        ESCCMDServices.printCacheAndFeed();
        ESCCMDServices.printCacheAndFeed();
        ESCCMDServices.printCacheAndFeed();
        ESCCMDServices.printCacheAndFeed();
        ESCCMDServices.printCacheAndFeed();
        ESCCMDServices.printCacheAndFeed();
        ESCCMDServices.alignCenter();
        ESCCMDServices.printString(printerData.foot);
        ESCCMDServices.printCacheAndFeed();
        /*ESCCMDServices.printString(printerData.qcodeTip1);
         ESCCMDServices.printCacheAndFeed();
         ESCCMDServices.printString(printerData.qcodeTip2);
         ESCCMDServices.printCacheAndFeed();
         ESCCMDServices.printString(printerData.qcodeTip3);
         ESCCMDServices.printCacheAndFeed();
         ESCCMDServices.printImg(base64BMP, 300);*/
        ESCCMDServices.printFeedDot("8A");
        ESCCMDServices.cutPaper();
        ESCCMDServices.print(printerName);
    }
};
//3列 打印
function proTable3Column(product){
    ESCCMDServices.alignLeft();
    var strNum = getStrAlignRightByWidth(printerTypeConfig.printStyleTemp.oneStrNum, product.num);
    ESCCMDServices.printString(strNum);
    var strName = getStrAlignRightByWidth(printerTypeConfig.printStyleTemp.twoStrNum+10, product.name, strNum);
    ESCCMDServices.printString(strName);
    var strTotal = getStrAlignRightByWidth(printerTypeConfig.printStyleTemp.threeStrNum, product.total, strNum + strName);
    ESCCMDServices.printString(strTotal);
    if(printFlayType == 2){
        ESCCMDServices.printCacheAndFeed();
    }
    ESCCMDServices.printFeedDot("1A");
}
function proTable2Column(str){
  var strArr = str.split("_");
  var strNum = getStrAlignRightByWidth(printerTypeConfig.printStyleTemp.oneStrNum, strArr[0]);
  ESCCMDServices.printString(strNum);
  var strTotal = getStrAlignRightByWidth(printerTypeConfig.printStyleTemp.threeStrNum, strArr[1], strNum);
  ESCCMDServices.printString(strTotal);
  if(printFlayType == 1){
      ESCCMDServices.printFeedDot("1A");
  }else if(printFlayType == 2){
      ESCCMDServices.printCacheAndFeed();
      ESCCMDServices.printFeedDot("1A");
  }
}