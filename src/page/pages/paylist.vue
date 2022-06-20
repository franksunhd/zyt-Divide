<script src="../../../../../mainContainer/zyt/src/config/api.js"></script>
<template>
  <Box>
    <div class="checkstand" >
      <div class="logo">
        <p>
          <img src="../../assets/img/paylogo.png" alt="logo">
        </p>
        <p style="padding-left:12px;">
          <img src="../../assets/img/success.png" style="margin-right:9px;">
          <span>订单提交成功，请尽快支付！</span>
        </p>
      </div>
      <div class="payDiv">
        <p>
          <img src="../../assets/img/circle.png">
          <span>应付金额： <b>￥{{detail.money | formatTime}}</b></span>
          <span @click="handleDetail">
                <span v-if="!show" style="color:#0e73d9">订单详情</span>
                <span v-if="show" style="color:#6bb3fe">订单详情</span>
                <img v-if="!show" src="../../assets/img/payright.png" style="margin-left:7px;">
                <img v-if="show" src="../../assets/img/paybottom.png" style="margin-left:7px;">
              </span>
        </p>
        <ul class="payUl" v-if="show">
          <li>订单编号：{{detail.order}}</li>
          <li>订单类型：{{this.data[1]}}</li>
          <li>下单时间：{{detail.time | formatTime1}}</li>
          <li>下单状态：{{detail.status}}</li>
          <li>订单金额：{{detail.money | formatTime}}</li>
        </ul>
      </div>

      <p class="tip">
        <img src="../../assets/img/circle.png" style="margin-right:9px;">

        <span>支付方式：</span>
      </p>

      <div class="payment" style="padding-left:12px;">
        <div class="pay1">
          <div class="pay_head1" @click="show_pay1">
            在线支付
          </div>



          <transition name="fade">

            <div class="pay_body1" v-show="show1">
              <el-radio-group v-model="payWay" @change="payType" >


                <el-tooltip v-show="false" placement="bottom"  effect="light" transition="el-fade-in-linear">

                  <el-radio :label="1" :disabled="radio_is">
                    <img src="../../assets/img/card.png" alt="网银支付">

                    <span>网银支付（高汇通）</span>
                  </el-radio>

                  <div slot="content" v-if="!radio_is">诸英台网银支付服务，由第三方支付公司“高汇通”提供</div>

                  <div slot="content" v-if="radio_is">因第三方支付公司限制，每笔订单仅可请求一次网银支付且需在5分钟内完成支付</div>

                </el-tooltip>


                <el-radio :label="2">
                  <img src="../../assets/img/zhifubao.png" alt="支付宝支付">
                  <span>支付宝</span>
                </el-radio>
                <el-radio :label="3">
                  <img src="../../assets/img/weixin.png" alt="微信支付">
                  <span>微信</span>
                </el-radio>
              </el-radio-group>
            </div>
          </transition>
          <el-dialog  :before-close="close" :visible.sync="dialogTableVisible">
               <span slot="title" style="color:#fff;text-align: center">
                 <b>您已选择： <img src="../../assets/img/wei.png" alt="微信支付"> 微信支付</b>
                </span>
            <template slot-scope="scope" >
              <div ref="box" class="payInfo">
                <div class="sweep">
                  <p v-if="!show_time">距离二维码过期还剩<span style="color:#ff4f12">{{time}}</span>秒</p>
                  <p v-if="!show_time">过期后，请刷新页面重新获取二维码</p>
                  <p v-if="show_time">二维码过期</p>
                  <p v-if="show_time">请<span style="color:#6bb3fe;cursor: pointer" @click="draw()">刷新</span>页面重新获取</p>
                  <div v-if="show_time" class="mask"></div>
                  <div ref="paint" style="width:164px;height:164px;border:1px solid #ddd;">
                    <img v-if="timegif"  style="margin:65px;" src="../../assets/img/time.gif">
                  </div>
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
              <template slot-scope="scope">
                <p>请您在新打开的支付平台页面进行支付，支付完成前请不要关闭窗口。</p>
                <el-button @click="handleSuccess()" type="text" size="small" class="Paycompented">已完成付款</el-button>
                <el-button @click="handleProblems()" type="text" size="small" class="Paypayment">支付遇到问题</el-button>
              </template>
            </el-dialog>
          </div>
        </div>
        <div style="position: relative;height: 325px;">
          <transition  name="trans">
            <div class="pay2" v-show="!trans1">

              <div class="pay_head2" @click="show_pay2">
                转账汇款
                <span style="color:#0e75a8;">（超过在线支付限额时，可选择线下转账汇款完成支付）</span>
              </div>
              <transition name="fade">
                <div class="pay_body2" v-show="show2">
                  <span>您可以通过网银、ATM、银行柜台付款至以下账户</span>
                  <ul>
                    <li>账户名：北京雅天共享信息科技有限公司</li>
                    <li>开户行：中国光大银行股份有限公司北京大兴金星路支行</li>
                    <li>银行账号：35540188000045777</li>
                  </ul>
                  <el-button class="payBut" @click="handleTrans">我已汇款，提交汇款信息</el-button>
                  <p style="line-height: 24px;color:#f55d5d">特别提醒：请在转账备注上标明您的用户名手机号，转账成功后可联系诸英台项目运营人员告知您的
                    转账金额与转账时间，以便尽快确认您的汇款结果。</p>
                </div>
              </transition>
            </div>
          </transition>
          <transition  name="tran">
            <div class="pay3" v-show="trans1">

              <div class="pay_head3" @click="show_pay3">
                转账汇款
                <span style="color:#969696;">（超过在线支付限额时，可选择线下转账汇款完成支付）</span>
              </div>
              <transition name="fade">
                <div class="pay_body3" v-show="show3">
                  <el-form :model="ruleForm"  ref="ruleForm" >

                    <el-form-item label="汇款金额" prop="money">
                      <el-input v-model="ruleForm.money" :maxlength=30 @focus="focus_check"></el-input>
                      <div class="error" ref="error0">请输入汇款金额</div>
                      <div class="error" ref="error2">输入金额与汇款金额不一致，请重新输入</div>
                    </el-form-item>
                    <el-form-item label="汇款账号" prop="account">
                      <el-input v-model="ruleForm.account" :maxlength=30 @focus="focus_check"></el-input>
                      <div class="error" ref="error1">请输入汇款账号</div>
                    </el-form-item>
                    <el-form-item>
                      <el-button  type="primary"  class="submit_buttons" @click="submit_checkstand('ruleForm')">提交</el-button>
                      <el-button class="back" @click="back_checkstand">返回</el-button>

                    </el-form-item>
                  </el-form>

                </div>
              </transition>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </Box>
</template>

<script>
  import {formatDate} from '../../assets/js/date.js';
  import Box from '../../components/Box';
  import imageView from '../../components/imageView.vue';
  import QRCode from 'qrcodejs2'


  export default {
    name:'paylist',
    components:{Box},
    data() {

      return {
        tokenID:this.getCookie("lab_session"),
        userId:this.getCookie('lab_userID'),
        show:false,
        show_time:false,
        timegif:true,
        orderno:'',//订单号
        payWay:'',
        radio_is:false,
        dialogTable:false,
        dialogTableVisible:false,
        show1:true,
        show2:false,
        show3:false,
        trans1:false,
        is:false,
        time:'05:00',
        time_re:'',
        show_move:false,
        detail:{

        },
        ruleForm:{
          money:'',
          account:''
        },
      }
    },
    methods: {
      handle_move(){
        this.show_move = true;
      },
      close(){
        this.dialogTableVisible=false;
        this.payWay='';
        if(this.time_re){
          window.clearInterval(this.time_re);
        }
      },
      payType(v){
        if(v){
          if(v==1){
            let _t = this;
            _t.dialogTable=true ;
            _t.radio_is = true;

            //跳转到支付页
            this.$api.post(this.$config.config_rechargeUrl(),{
              pay_way: "CHINAINPAY",
              orderNo: this.detail.order,//订单号
              amount: this.detail.money,//交易金额
            },function(res){
              let url=res.body.pay_url;
              window.open(res.body.pay_url);
              sessionStorage.setItem("ko",2);
            },function(e){
              switch(e.errorcode){
                case "TOKEN_NOT_EXIST":
                  _t.$alert('用户登录超时，请重新登录', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    callback: action => {
                      _t.delCookie('session');
                      _t.delCookie('userID');
                      _t.$router.replace({ path: '/login' });
                    }
                  });
                  break;
                default:
                  break;
              }
            });
          }else if(v==2){
            let _t = this;
            _t.dialogTable=true;
            this.$api.post(this.$config.config_alipaysignUrl(),{
              channel: "ZHUYINGTAIWEB",
              subject: this.data[1],//商品名称
              out_trade_no: this.detail.order,//订单号
            },function(res){
              const div = document.createElement('div');
              div.innerHTML = res.body.content;
              _t.addClass(div,'form');
              document.body.appendChild(div);
              document.forms[document.forms.length-1].submit();
              sessionStorage.setItem("ko",2);

            },function(e){
              switch(e.errorcode){
                case "TOKEN_NOT_EXIST":
                  _t.$alert('用户登录超时，请重新登录', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    callback: action => {
                      _t.delCookie('session');
                      _t.delCookie('userID');
                      _t.$router.replace({ path: '/login' });
                    }
                  });

                default:
                  break;
              }
            });

          }else{
            if(this.time_re){
              window.clearInterval(this.time_re);
            }
            this.dialogTableVisible=true;
            let dia = document.getElementsByClassName('el-dialog--small')[0];
            dia.style.width='650px';
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
      link_info(){
        this.$router.push({ path: '/manage/orderList' });
      },
      draw(){
        this.time='05:00';
        let _t = this;
        if(_t.time_re){
          window.clearInterval(_t.time_re);
        }
        this.$api.post(this.$config.config_preorderUrl(),{
          pay_way : "WECHATWEB",
          body : this.data[1],//商品名称
          order : this.detail.order,//订单号
          ip :this.$config.config_ipUrl()
        },function(res){
          _t.timegif = false;
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
            case "ORDER_INVALID":
              _t.$alert('用户登录超时，请重新登录', '提示', {
                confirmButtonText: '确定',
                type: 'warning',
                callback: action => {
                  _t.delCookie('session');
                  _t.delCookie('userID');
                  _t.$router.replace({ path: '/login' });
                }
              });
              break;
            default:
              break;
          }
        });
      },
      settime () {
        let that = this;
        let rema = new Date().getTime();
        that.time_re =  setInterval(function(){
          that.sub(rema);
        },1000)
      },
      sub (v) {
        let _t = this;
        let remainedTime=5*60*1000-(new Date().getTime()-v);
        if(remainedTime<0){
          this.show_time=true;
          window.clearInterval(_t.time_re);
        }else{
          this.show_time=false;
          this.time=formatDate(new Date(remainedTime),"mm:ss");
          let _t =this;
          this.$api.post(this.$config.config_searchWebOrderUrl(),{
            tokenID:this.tokenID,
            userId:this.userId,
            orderno: this.detail.order
          },function(res){

            //监听已取消的状态
            switch (res.body.status){
              //status 3200 正常 3201 已离开  status 0 代表成功， 1代表未成功
              case 0:
                //停止定时器
                window.clearInterval(_t.time_re);
                _t.getData();
                sessionStorage.setItem("orderDetails_next",_t.detail.order);
                _t.$router.push({ path: 'payment' });
                break;
              case 2:
                window.clearInterval(_t.time_re);
                _t.getData();
                sessionStorage.setItem("orderDetails_next",_t.detail.order);
                _t.$router.push({ path: 'payment' });
                break;
              case 1:
                break;
            }

            // }

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
        done();
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
        let _t=this;
        this.dialogTable=false;
        this.$api.post(this.$config.config_searchWebOrderUrl(),
          {
            tokenID:this.tokenID,
            userId:this.userId,
            orderno: this.detail.order
          },function(res){
            _t.getData();
            sessionStorage.setItem("orderDetails_next",_t.detail.order);
            _t.$router.push({ path: 'payment' });
          },function(e){
            switch(e.errorcode){
              case "TOKEN_NOT_EXIST":
                _t.$alert('用户登录超时，请重新登录', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning',
                  callback: action => {
                    _t.delCookie('session');
                    _t.delCookie('userID');
                    _t.$router.replace({ path: '/login' });
                  }
                });
                break;
              default:

                break;
            }
          });
      },
      focus_check(){
        this.$refs.error0.style.display = 'none';
        this.$refs.error1.style.display = 'none';
        this.$refs.error2.style.display = 'none';
      },
      submit_checkstand(ruleForm){
        let that = this;

        if(!this.ruleForm.money){
          this.$refs.error0.style.display = 'block';
        }else if(this.ruleForm.money && this.ruleForm.money!=this.detail.money){
          this.$refs.error2.style.display = 'block';
        }else if(!this.ruleForm.account){
          this.$refs.error1.style.display = 'block';
        }else{
          let that = this;
          this.$api.post("/manage/reward/transferRemittance",{
            userId : this.userId,//用户Id
            tokenID: this.tokenID,//令牌
            orderno:  this.detail.order,//订单号
            type:8,//订单类型
            account:this.ruleForm.account//汇款账号
          },function(res){
            // 转账汇款提交 提交成功
            that.getData();
            sessionStorage.setItem("orderDetails_next",that.detail.order);
            that.$router.push({ path: 'payment' });
          },function(e){
            switch(e.errorcode){
              case "TOKEN_NOT_EXIST":
                that.$alert('用户登录超时，请重新登录', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning',
                  callback: action => {
                    that.delCookie('session');
                    that.delCookie('userID');
                    that.$router.replace({ path: '/login' });
                  }
                });
              case "PARAM_ERROR_INCOM":
                break;
              case "PARAM_INCOM":
                break;
              default:
                break;
            }
          });
        }
        // this.$refs[ruleForm].validate((valid) => {
        //     if (valid) {
        // 提交

        // }})

      },
      back_checkstand(){
        this.show3 = false;
        this.trans1 = false;
        this.show2 = true
      },
      handleTrans(){
        this.show3 = true;
        this.trans1 = true;
      },
      show_pay1(){
        this.show1 = true;
        this.show2 = false;
        this.show3 = false;
      },
      show_pay2(){
        this.show1 = false;
        this.show2 = true;
      },
      show_pay3(){
        this.show1 = false;
        this.show3 = true;
      },

      handleDetail(){
        this.show = this.show ? false:true;
      },
      getData(){
        let that = this;
        this.$api.post("/manage/recharge/orderDetail",{
          userId : this.userId,//用户Id
          tokenID: this.tokenID,//令牌
          order: this.orderno//订单号
        },function(res){
          //1000400 待充值 1000401 充值成功 1000402 已取消 1000403 支付失败 1000404
          that.detail = res.body;
          if(that.detail.status == '1000400'){
            that.detail.status = '待充值'
          }else if(that.detail.status == '1000401'){
            that.detail.status = '充值成功'
          }else if(that.detail.status == '1000402'){
            that.detail.status = '已取消'
          }else if(that.detail.status == '1000403'){
            that.detail.status = '支付失败'
          }else if(that.detail.status == '1000404'){
            that.detail.status = '汇款待确认'
          }
          if(res.body.CHINAINPAY){
            if(Number(res.body.CHINAINPAY)==3200){
              that.radio_is = true;
            }
          }
        },function(e){
          switch(e.errorcode){
            case "TOKEN_NOT_EXIST":
              that.$alert('用户登录超时，请重新登录', '提示', {
                confirmButtonText: '确定',
                type: 'warning',
                callback: action => {
                  that.delCookie('session');
                  that.delCookie('userID');
                  that.$router.replace({ path: '/login' });
                }
              });

            case "PARAM_ERROR_INCOM":
              break;
            case "PARAM_INCOM":
              break;
            default:
              break;
          }
        });
      }
    },
    filters:{
      formatTime(value){
        if(value){
          return value.toFixed(2);
        }
      },
      formatTime1(time){
        if(time==""||time==undefined) return "";
        let date = new Date(Number(time));
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      },
    },
    created() {
      if(JSON.stringify(this.$route.params)!="{}"){
        this.data = this.$route.params;
      }else{
        this.data = localStorage.getItem("object").split(",");
      };
      this.orderno = this.data[0];
      // localStorage.setItem("n",'2');
      this.getData();
    }
  }
</script>
<style scoped>
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
  .error{
    color:red;
    line-height:16px;
    display:none;
    padding-left:10px;
    font-size:12px;
    position: absolute;
    padding-top: 4px;
  }
  .logo>p img{
    margin-right:26px;
  }
  .logo>p{
    margin-bottom:18px;
  }
  .payDiv{
    margin:18px 0;
    padding-left:24px;
  }
  .payDiv>p span:nth-child(2){
    padding:0 18px 0 9px;
  }
  .payDiv>p span:nth-child(3){
    color:#6bb3fe;
    cursor: pointer;
  }
  .payUl{
    margin:19px 0 13px 16px;
  }
  .payUl li{
    margin-bottom:13px;
    color:#969696;
  }
  .tip{
    padding:0 0 15px 24px;
  }
  .pay1,.pay2,.pay3{
    width:630px;
    border:1px solid #a7dbf8;
    padding:0 19px;
    margin-bottom:10px;
    background-color: #f6fcff;
  }
  .pay2{
    position: absolute;
    top:0;
    left:0;
  }
  .pay3{
    position: absolute;
    top:0;
    left:0px;
  }
  .pay_head1,.pay_head2,.pay_head3{
    height:40px;
    line-height:40px;
    color:#095378;
    padding:0 10px;
    cursor: pointer;
  }
  .pay_body1{
    height:100px;
    line-height:100px;
    border-top:1px solid #a7dbf8;
    padding:0 10px;

  }
  .pay_body2,.pay_body3{
    height:285px;
    border-top:1px solid #a7dbf8;
    padding:18px 10px;
    color:#0e75a8;
  }
  .pay_body3{
    padding:45px 10px;
  }
  .pay_body3 .el-input{
    width:250px;
  }
  /*.back{*/
  /*background:#f6fcff;*/
  /*color:#333;*/
  /*border:1px solid #333;*/
  /*}*/
  .submit_buttons{
    background:#f97b00;
  }
  .submit_buttons:hover{
    background:#f8a33c;
  }
  .submit_buttons:active{
    background:#ec6300;
  }
  .back{
    background:transparent;
    color:#242d31;
    border:1px solid #242d31;
  }
  .back:hover{
    background:#404548;
    color:#fff;
    border:1px solid #404548;
  }
  .back:active{
    background:#0a0f11;
    color:#fff;
    border:1px solid #0a0f11;
  }
  .pay_body2 ul{
    margin:24px 0 20px 0;
    line-height:24px;
  }

  .payBut{
    /*width:180px;*/
    height:35px;
    color:#fff;
    background-color: #f97b00;
    border:1px solid #f97b00;
    margin-bottom:33px;
    text-align: center;
  }
  .payBut:hover{
    background-color: #f8a33c;
    border:1px solid #f8a33c;
  }
  .payBut:active{
    background-color: #ec6300;
    border:1px solid #ec6300;
  }
  /*.trans-enter-active{*/
  /*transition:  left 3s;*/
  /*}*/


  .trans-leave-active,.trans-enter-active{
    transition:  left 1s;
  }
  .trans-enter, .trans-leave-to{
    left:-780px;
  }
  .tran-enter-active,.tran-leave-active{
    transition:  left 1s;
  }
  .tran-enter, .tran-leave-to{
    left:100%;
  }

  .fade-enter-active {
    transition:  height 1s, opacity 3s;
  }

  .fade-leave-active{
    transition:  height 1s, opacity 1s;
  }
  .fade-enter, .fade-leave-to
    /* .list-leave-active for below version 2.1.8 */ {
    opacity: 0;
    height:0;
    transform: translateY(0px);
  }
  .mask {
    width: 170px;
    height: 170px;
    position: absolute;
    top: 197px;
    filter: alpha(opacity=60);
    background-color: #777;
    z-index: 1002;
    left: 46px;
    opacity:0.9;
    -moz-opacity:0.5;
  }
  .pay_body3 .app-btn-default, .pay_body3 .el-button{
    padding:0;
  }
</style>
<style>
  .el-tooltip__popper.is-light{
    left:240px !important;
  }
  .checkstand{
    padding-top:32px;
  }
  /*.checkstand .el-dialog__header, .el-message-box__header{*/
    /*padding:9px 28px;*/
    /*margin-top:32px;*/
  /*}*/
  .checkstand .el-dialog__close{
    padding-top:8px;
  }
  .pay_body3 .el-form-item__label{
    color:#0e75a8;
  }
  .pay_body3 .el-input__inner{
    border:1px solid #a7dbf8;
    background-color: #f6fcff;
    color:#0e75a8;
  }
  .pay_body3 .el-button{
    width:93px;
    line-height:35px;
  }
  .pay_body3 .el-form-item__content{
    margin-left:66px;
  }

  .checkstand .el-radio .el-radio__label img{
    padding:0 10px 0;
  }
  .checkstand .el-radio:nth-child(1) .el-radio__label img{
    padding:0 6px 0 3px;
  }
  .checkstand .el-radio .el-radio__label span{
    color:#0e75a8;
  }
  .checkstand .el-radio__inner::after{
    background-color:#0e75a8;
    height:8px;
    width:8px;
  }
  .checkstand .el-radio__inner:hover{
    border-color: #0e75a8;
  }

  .checkstand .el-radio__label{
    padding-left: 0px;
  }
  /*.checkstand .el-radio__label:nth-child(1){*/
  /*padding-left: 3px;*/
  /*}*/
  .checkstand .el-radio+.el-radio{
    margin-left:44px;
  }
  .checkstand .el-radio__inner{
    width:14px;
    height:14px;
  }
  .checkstand .el-radio__input.is-checked .el-radio__inner{
    border-color: #0e75a8;
    background: #fff;
  }

  .checkstand .el-form-item__error{

  }
  .payInfo{
    display:flex;
    width:95%;
  }
  .payInfo .sweep{
    flex: 1;
    padding:70px 30px;
  }
  .payInfo .sweep p{
    line-height:25px;
  }
  .payInfo .sweep div{
    margin:25px 0;
  }
  .payInfo .picture{
    flex: 1;
  }

</style>

