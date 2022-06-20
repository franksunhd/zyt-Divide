
var imgUrl = 'http://192.168.1.114:8280/zyt-http';
// 支付
var rechargeUrl = 'http://192.168.1.114:8280/zyt-trade/recharge';
var alipaysignUrl = 'http://192.168.1.114:8280/zyt-trade/alipaysign';
var preorderUrl = 'http://192.168.1.114:8280/zyt-trade/preorder';

var searchWebOrderUrl = 'http://192.168.1.114:8280/zyt-http/searchWebOrder';
// 参数 Ip
var ipUrl = '192.168.1.114';
// 下载表格
var exportWorkerInfoUrl = 'http://192.168.1.114:8280/zyt-http/labor/master/exportWorkerInfo';
var exportWorkerInfoByHBUrl = 'http://192.168.1.114:8280/zyt-http/labor/master/exportWorkerInfoByHB';
// 上传文件
var importRechargeInfoUrl = 'http://192.168.1.114:8280/zyt-http/labor/master/importRechargeInfo';

export default {
  config_rechargeUrl:function () {
    return rechargeUrl;
  },
  config_alipaysignUrl:function () {
    return alipaysignUrl;
  },
  config_preorderUrl:function () {
    return preorderUrl;
  },
  config_ipUrl:function () {
    return ipUrl;
  },
  config_searchWebOrderUrl:function () {
    return searchWebOrderUrl;
  },
  config_imgUrl:function () {
    return imgUrl;
  },
  config_exportWorkerInfoUrl:function () {
    return exportWorkerInfoUrl;
  },
  config_exportWorkerInfoByHBUrl:function () {
    return exportWorkerInfoByHBUrl;
  },
  config_importRechargeInfoUrl:function () {
    return importRechargeInfoUrl;
  }
}
