<script src="../../../../../设置账户/zyt/src/router/index.js"></script>
<template>
  <Box class="payListWating">
    <div class="pay">
      <div class="logo">
        <img src="../../assets/img/paylogo.png" alt="logo">
      </div>
      <div class="head">
        <span><img style="vertical-align: top;" src="../../assets/img/success.png"></span>
        <span style="padding-left:10px;">订单提交成功，请尽快付款！</span>
      </div>
      <div class="main">
        <div style="padding:17px 0 15px;">
          <span>应付金额 :</span>
          <span style="font-size: 16px;">￥ {{this.data[4]}}</span>
          <span class="pleft" @click="open">
            订单详情
            <img v-if="!this.payOpen" src="../../assets/img/payright.png" style="padding-left:10px;">
            <img v-if="this.payOpen" src="../../assets/img/paybottom.png" style="padding-left:10px;">
          </span>
        </div>
        <div class="detail" v-if="this.payOpen">
          <ul>
            <li style="margin-bottom: 10px;color:#999999" v-for="index in ['订单编号：','订单类型：','下单时间：','订单状态：','订单金额：']">{{index}}</li>
          </ul>
          <ul>
            <li style="margin-bottom: 10px;color:#999999" v-for="val in this.data">
              {{val}}
            </li>
          </ul>
        </div>

        <el-dialog  :before-close="close" title="您已选择：微信支付" :visible.sync="dialogTableVisible">
          <template scope="scope" >
            <div ref="box" class="payInfo">
              <div class="sweep">
                <p v-if="!show">距离二维码过期还剩<span style="color:#ff4f12">{{time}}</span>秒</p>
                <p v-if="!show">过期后，请刷新页面重新获取二维码</p>
                <p v-if="show">二维码过期</p>
                <p v-if="show">请<span style="color:#6bb3fe;cursor: pointer;" @click="draw()">刷新</span>页面重新获取</p>
                <div v-if="show" class="mask"></div>
                <div ref="paint" style="width:164px;height:164px;border:1px solid #ddd;"></div>
              </div>
              <div class="picture">
                <img src="../../assets/img/wx-phone.png">
              </div>
            </div>
            <div @click="close" style="text-align: center;color:#3586ff;cursor:pointer">选择其他支付方式</div>
          </template>
        </el-dialog>
        <div class="con">
          <el-dialog :before-close="closeDialog" title="支付信息" :visible.sync="dialogTable">
            <template scope="scope">
              <p>请您在新打开的支付平台页面进行支付，支付完成前请不要关闭窗口。</p>
              <el-button @click="handleSuccess()" type="text" size="small" class="Paycompented">已完成付款</el-button>
              <el-button @click="handleProblems()" type="text" size="small" class="Paypayment">支付遇到问题</el-button>
            </template>
          </el-dialog>
        </div>
      </div>

      <div class="foot">
        <div>支付方式 :</div>
        <div class="plate">
          <el-radio-group v-model="radio2" @change="payType">
            <el-radio :label="1" title="诸英台网银支付服务，由第三方支付公司“高汇通”提供">
              <img src="../../assets/img/card.png">
              网银支付（高汇通）
            </el-radio>
            <el-radio :label="2">
              <img src="../../assets/img/zhifubao.png">
              支付宝
            </el-radio>
            <el-radio :label="3">
              <img src="../../assets/img/weixin.png">
              微信
            </el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
  </Box>
</template>
<script>
  import {formatDate} from '../../assets/js/date.js';
  import Box from '../../components/Box';
  import QRCode from 'qrcodejs2'
  export default {
    name:'paylistWating',
    components:{Box},
    data () {
      return {
        zyt_tokenID:this.getCookie("lab_session"),
        zyt_userId:this.getCookie('lab_userID'),
        radio2: '',
        data:[],
        payOpen:false,
        dialogTable:false,
        dialogTableVisible:false,
        show:false,
        parameter:[],
        time:'05:00',
        icon:'',
        ishow:'',
        status:'',
        clearTim:'',
        clearT:'',
      };
    },
    methods: {
      userErrorOvertime(t){
        t.$alert('用户登录超时，请重新登录', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {
            t.delCookie('lab_session');
            t.delCookie('lab_userID');
            t.$router.replace({ path: '/login' });
          }
        });
      },
      userErrorChange(t){
        t.$alert('您的账号已在其他终端登录', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {
            t.delCookie('lab_session');
            t.delCookie('lab_userID');
            t.$router.replace({ path: '/login' });
          }
        });
      },
      open(){
        this.payOpen ? this.payOpen=false:this.payOpen=true;
      },
      close(){
        this.dialogTableVisible=false;
        this.radio2='';

      },
      draw(){

        let _t = this;
        clearTimeout(_t.clearTim);
        clearTimeout(_t.clearT);
        _t.time='05:00';
        this.show=false;
        this.$api.post(this.$config.config_preorderUrl(),{
          pay_way : "WECHATWEB",
          body : this.data[1],//商品名称
          order : this.data[0],//订单号
          ip :this.$config.config_ipUrl()
        },function(res){
          let qrcode;
          _t.$nextTick(() => {

            _t.$refs.paint.innerText='';
            qrcode = new QRCode(_t.$refs.paint, {
              text: res.body.QRcode,
              width : 163,
              height : 163,
              colorDark : "#000000",
              colorLight : "#ffffff",
              correctLevel : QRCode.CorrectLevel.H
            })
          })

          _t.settime();
        },function(e){
          switch(e.errorcode){
            case "TOKEN_NOT_EXIST":
              _t.userErrorOvertime(_t);
              break;
            case "TOKEN_CHANGE":
              _t.userErrorChange(_t);
              break;
            case "PARAM_INCOM":
              break;
            default:

              break;
          }
        });
      },
      settime () {
        let that = this;
        let rema = new Date().getTime();

        this.clearT=setInterval(function(){
          that.sub();
        },3000);
        this.clearTim = setInterval(function(){
          that.subm(rema);
        },500);
      },
      subm (v) {
        let remainedTime=5*60*1000-(new Date().getTime()-v);
        if(remainedTime<0){
          this.show=true;
        }else{
          this.show=false;
          this.time=formatDate(new Date(remainedTime),"mm:ss");
        }
      },
      sub () {
        if(!this.show){
          let _t =this;
          this.$api.post(this.$config.config_searchWebOrderUrl(),{
            tokenID:this.zyt_tokenID,
            userId:this.zyt_userId,
            orderno: this.data[0]
          },function(res){
            switch (res.body.status){
              case 0:
                localStorage.setItem("n",'2');
                _t.$router.push({name:'workerRechaSuccess'});
                clearInterval(_t.clearT);
                clearInterval(_t.clearTim);
                break;
            }

          },function(e){
            switch(e.errorcode){
              case "ORDER_INVALID":
                break;
              default:
                break;
            }
          });
        }
      },

      closeDialog(done){
        done()
        this.getPayState();
        this.removeObj();
      },
//    支付成功
      handleSuccess(){
        this.getPayState();
        this.removeObj();
      },
//    支付失败
      handleProblems(){
        this.getPayState();
        this.removeObj();
      },
      removeObj(){
        let removeObj = document.getElementsByClassName('form')[0];
        if(removeObj){
          removeObj.parentNode.removeChild(removeObj);
        }
      },
      getPayState(){
        let _t = this;
        this.$api.post(this.$config.config_searchWebOrderUrl(),
          {
            tokenID:this.zyt_tokenID,
            userId:this.zyt_userId,
            orderno: this.data[0]
          },function(res){
            switch (res.body.status){
              case 0:
                _t.$router.push({name:'workerRechaSuccess'});
                break;
              case 1:
                _t.$router.push({name:'workerRechaFail'});
                break;
            }
          })
        localStorage.setItem("n",'2');
      },
      payType(v){
        if(v){
          if(v==1){
            let _t = this;
            _t.dialogTable=true ;
            this.$api.post(this.$config.config_rechargeUrl(),{
              pay_way: "CHINAINPAY",
              orderNo: this.data[0],
              amount: this.data[4],
            },function(res){
              let url=res.body.pay_url;
              window.open(res.body.pay_url)
            },function(e){

            });
          }else if(v==2){

            let _t = this;
            _t.dialogTable=true;
            this.$api.post(this.$config.config_alipaysignUrl(),{
              channel: "ZHUYINGTAIWEB",
              subject: this.data[1],
              out_trade_no: this.data[0],
            },function(res){
              const div = document.createElement('div')
              div.innerHTML = res.body.content
              _t.addClass(div,'form');
              document.body.appendChild(div)
              document.forms[document.forms.length-1].submit()
            },function(e){

            });
          }else{
            this.dialogTableVisible=true;
            let dia = document.getElementsByClassName('el-dialog--small')[0];
            dia.style.width='700px';
            this.draw();
          }
        }else{
          this.dialogTableVisible=false;

        }

      },
      addClass(obj, cls) {
        let obj_class = obj.className,
          blank = (obj_class != '') ? ' ' : ''
        let added = obj_class + blank + cls;
        obj.className = added;
      },
      hasClass(elem, cls) {
        cls = cls || '';
        if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
        return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
      },
      removeClass(obj, cls) {
        let obj_class = ' ' + obj.className + ' ';
        obj_class = obj_class.replace(/(\s+)/gi, ' ');
        let removed = obj_class.replace(' ' + cls + ' ', ' ');
        removed = removed.replace(/(^\s+)|(\s+$)/g, '');
        obj.className = removed;
      },
      getData(){
        var _t = this;
        if(this.$route.params.data){
          this.data=this.$route.params.data
        }else{
          this.data=localStorage.getItem("object").split(',');

        }
      }
    },
    created(){
      var _t=this;
      this.getData();
      if(JSON.stringify(this.$route.params)!="{}"){
        this.data = this.$route.params;
      }else{
        this.data = localStorage.getItem("obj").split(",");
      }

    }
  }
</script>

<style scoped>
  .head span{
    display:inline-block;
    line-height:23px;
  }
  .pay{
    font-family: "Microsoft YaHei";
    color:#333333;
    font-size: 14px;
    padding-top:20px;
  }
  .logo{
    height:55px;
  }
  .pleft{
    padding-left:15px;
    color:#6bb3fe;
    cursor: pointer;
  }
  .main .detail{

    width:250px;
    display:flex;
  }
  .detail ul:first-child{
    flex:1;
  }
  .detail ul:last-child{
    flex:2;
  }
  .foot{
    margin-top:2px;
  }
  .plate{
    width:100%;
    line-height:100px;
    background:#FFF9F3;
    margin-top:10px;
  }
  /*.plate{*/
  /*text-align:center;*/
  /*}*/
  .plate .el-radio{
    margin-left:45px;
  }
  .plate .el-radio:first-child{
    margin-left:65px;
  }
  .payInfo{
    display:flex;
    margin-left:60px;
    margin-right:50px;
  }

  .payInfo .sweep{
    flex: 1;
    margin-top:40px;
  }
  .payInfo .sweep p{
    margin-bottom:10px;
  }
  .payInfo .sweep div{
    margin:40px 60px 90px 0;
  }
  .payInfo .picture{
    flex: 1;
  }
  .mask {
    width: 170px;
    height: 170px;
    position: absolute;
    top: 84px;
    filter: alpha(opacity=60);
    background-color: #777;
    z-index: 1002;
    left: -4px;
    opacity:0.9;
    -moz-opacity:0.5;
  }
  .con .el-button--danger.is-plain{background: #f60!important;color:#fff;}
  .con .el-button--danger.is-plain:hover,
  .con .el-button--danger.is-plain:active,
  .con .el-button--danger.is-plain:visited{background: #f60!important;color:#fff!important;}
  .con .app-btn-link, .el-button--text{padding:10px;background: #f90;color:#fff;
  }
  .con .app-btn-link, .el-button--text:hover{background: #f90;color:#fff; text-decoration: none;}
  .con .Impayage  .el-dialog--small{padding-bottom:30px;}
  .con .el-dialog__body p{padding-bottom: 20px;border-bottom: 1px solid #f90;text-align: left;}
  .con .el-dialog__body p{margin-bottom:30px;}
  .con .app-btn-link, .el-button--text{margin:0 40px;}
  .con .paymoneyInfo{
    color:#666;
    font-size: 14px;
    line-height:28px;
  }
  .con .recharge li.weight{
    font-weight: bold;
    color:#333;
  }
  .el-dialog__wrapper div.el-dialog--small{width:auto;}
</style>
<style>
  #app .plate .el-radio__label{padding-left:12px;}
  .payListWating .box-wrap{
    min-height:95%;
  }
</style>

