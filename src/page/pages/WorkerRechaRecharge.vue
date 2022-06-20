<script src="../../../../../设置账户/zyt/src/router/index.js"></script>
<template>
    <!--安全之星奖励记录状态为待充值  -->
    <Box class="Recordrecharge">
        <div class='center'>
            <div class='container'>
                <div class="containerCenter">
                  <div class="search-panel">
                  <section class="el-container is-vertical orderList">
                    <div class="topHeight"></div>
                    <header class="el-header orderList-header">
                      <ul>
                        <li><img src="../../assets/img/waitingPay.png" alt=""></li>
                        <li>
                          <div class="btn-wrap showTimeDown">
                            剩余支付时间:<span v-model="showtime">{{showtime}}</span>
                          </div>
                        </li>
                      </ul>
                    </header>
                    <main class="el-main primaryContainer">
                      <ul :model="options">
                        <li class="optiSeleted"><span>充值总金额：</span><em>{{options.money}}</em></li>
                        <li class="optiSeleted"><span>充值人数：</span><em>{{options.peopleNum}}</em></li>
                        <li><span>充  值 记 录  编  号：</span><em>{{options.orderno}}</em></li>
                        <li><span>充 值订单提交时间：</span><em>{{options.time |formatMonth}}</em></li>
                        <el-button type="danger" plain @click="payNow()" class="immediatelyRechange">{{message}}</el-button>

                      </ul>
                    </main>
                  </section>
                  <el-row>
                    <h3 class="safeTotal">生活费充值明细</h3>
                  </el-row>
                  <el-table :data="tableData" border style="width: 100%;" empty-text="暂无数据～">
                    <el-table-column prop="name" label="姓名" width="120" header-align="center"></el-table-column>
                    <el-table-column prop="idno" label="身份证号" width="180" header-align="center"></el-table-column>
                    <el-table-column prop="jobno" label="职业号" width="140" header-align="center"></el-table-column>
                    <el-table-column prop="jobtype" label="工种" width="160" header-align="center"></el-table-column>
                    <el-table-column prop="amount" label="充值金额" width="130" header-align="center"></el-table-column>
                  </el-table>
                  </div>
                </div>
            </div>
        </div>
    </Box>
</template>
<script>
import {formatDate} from '../../assets/js/date.js';
import Box from '../../components/Box';
import imageView from '../../components/imageView.vue';
export default {
  name:'workerRechaRecharge',
  components:{Box},
  data(){
    return{
      options:{
        name:'',
        labor:'',
        type:'',
        month:Date.now(),
        start:0,
        num:10,
        totalMoney:0,
        time:Date.now(),
        orderno:0,
        order:0,
        peopleNum:0,
        money:'',
        date:''
      },
      showtime:"",
      time:Date.now(),
      subInterval:"",
      message:'立即充值',
      reward:{
        oneMoney:'10',
        monthMoney:'1000',
        back:''
      },
      currentPage: 1,
      dialogTableVisible: false,
      'zyt_tokenID':this.getCookie("lab_session"),
      zyt_userId:this.getCookie('lab_userID'),
      tableData:[],
      total:10,
      jobno:'',

    }
  },
  beforeCreate(){
    this.$store.commit("setLoading",true)
  },
  created(){
    var _t=this;
    this.getData();
  },
  methods:{
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

//    立即支付
    payNow(){
      let _t=this;
      let val = this.message;
      let order = this.options.orderno;
      if(val=='重新支付' || val=='立即充值' || val=='充值中...'){
        this.status = '充值中...';
        let time = this.time;
        let date = formatDate(new Date(Number(time)), 'yyyy-MM-dd hh:mm:ss');
        let money= this.options.money+'.00';
        _t.$router.push({name:'paylist',params:[this.options.orderno,'生活费发放',date,'待支付',money]
        });
        localStorage.setItem("object",[this.options.orderno,'生活费发放',date,'待支付',money]);

      }
    },
    closeDialog(done){
      done()
      this.getPayState()
    },
//    支付成功
    handleSuccess(){
      this.getPayState()
    },
//    支付失败
    handleProblems(){
      this.getPayState()
    },
    getPayState(){
      var _t=this
      this.$api.post('/manage/recharge/orderDetail',
        {
          userId:this.zyt_userId,
          tokenID :this.zyt_tokenID,
          order:this.options.orderno
        },function(res){
         _t.$store.commit("setLoading",false);
          switch (res.body.status){
            case 1000400:
              _t.dialogTableVisible=false
              break;
            case 1000401:
              _t.$router.push({name:'workerRechaSuccess',params:{month:_t.options.month,
                time:_t.options.time,orderno:_t.options.orderno,order:_t.options.order,num:_t.options.peopleNum,money:_t.options.money}});
              localStorage.setItem("month",_t.options.month)
              localStorage.setItem("time",_t.options.time)
              localStorage.setItem("orderno",_t.options.orderno)
              localStorage.setItem("order",_t.options.order)
              localStorage.setItem("num",_t.options.num)
              localStorage.setItem("money",_t.options.money)
              break;
            case 1000402:
              _t.dialogTableVisible=false
              break;
            case 1000403:
              _t.$router.push({name:'workerRechaFail',params:{month:_t.options.month,
                time:_t.options.time,orderno:_t.options.orderno,order:_t.options.order,num:_t.options.peopleNum,money:_t.options.money}});
              localStorage.setItem("month",_t.options.month)
              localStorage.setItem("time",_t.options.time)
              localStorage.setItem("orderno",_t.options.orderno)
              localStorage.setItem("order",_t.options.order)
              localStorage.setItem("num",_t.options.num)
              localStorage.setItem("money",_t.options.money)
              break;
          }
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
    dateReviver(value) {
      var a;
      if (typeof value === 'string') {
        a = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z/.exec(value);
        if (a) {
          return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
            +a[5], +a[6]));
        }
      }
      return value;
    },
    getData(){
      var _t=this;
      if(this.$route.params.order){
        this.options.order=this.$route.params.order
      }else{
        this.options.order=localStorage.getItem("order")
      }
      if(this.$route.params.num){
        this.options.peopleNum=this.$route.params.num
      }else{
        this.options.peopleNum=localStorage.getItem("num")
      }

      if(this.$route.params.account){
        this.options.money=this.$route.params.account
      }else{
        this.options.money=localStorage.getItem("money")

      }

      if(this.$route.params.date){
        this.options.time=this.$route.params.date
      }else{
        this.options.time=localStorage.getItem("time")
      }

      if(this.$route.params.orderno){
        this.options.orderno=this.$route.params.orderno
      }else{
        this.options.orderno=localStorage.getItem("orderno")

      }
      this.timeDown()
      this.$api.post("/manage/recharge/orderPeopleDetail",{
        tokenID:this.zyt_tokenID,
        userId:this.zyt_userId,
        order:this.options.orderno,
        start:this.options.start,
        num:100000
      },function(res){
        _t.$store.commit("setLoading",false);
        _t.tableData=res.body;
        for(var i=0;i<res.body.length;i++){
          let item=res.body[i];
          if(item.name.length==2){
            item.name=item.name.substring(0,1)+"　"+item.name.substring(1,2)
          }
        }
      },function(e){

      });

      this.$api.post("/manage/recharge/orderDetail",{
        userId:this.zyt_userId,
        tokenID :this.zyt_tokenID,
        order:this.options.orderno
      },function(res){
        _t.$store.commit("setLoading",false);
      },function(e){
      })
    },
    timeDown(){
      this.subInterval=setInterval(this.subTime,1000)
    },
    subTime(){
      // var remainedTime=5*60*1000-(new Date().getTime()-this.options.time)
      let remainedTime=24*1000*3600-(new Date().getTime()-Number(this.options.time));
      if(remainedTime<=0){
        this.showtime="订单已取消"
        window.clearInterval(this.subInterval)
      }else{
        let hours = parseInt((remainedTime % (86400000)) / (3600000)).toString();
        let minutes = parseInt((remainedTime % (3600000)) / (60000)).toString();
        let seconds = parseInt((remainedTime % (60000)) / 1000).toString();
        hours =hours.length < 2 ? '0' + hours : hours;
        minutes =minutes.length < 2 ? '0' + minutes : minutes;
        seconds =seconds.length < 2 ? '0' + seconds : seconds;

        // var time=new Date(remainedTime)
        this.showtime=hours+':'+minutes+':'+seconds;
      }

    },

    handleCurrentChange(currentPage){
      this.currentPage=currentPage;
      this.options.start=(currentPage-1)*this.options.num;
      this.getData();
    },
    handleSizeChange(size){
      this.options.num=size;
      this.options.start=0;
      this.getData();
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
  },
  filters:{
    formatTime2(time){
      if(time==""||time==undefined) return "";
      return String(time).substring(0,4)+"-"+String(time).substring(4,6)
    },
    formatMonth(time){
      if(time=="" || time==undefined)return "";
      var date=new Date(parseInt(time));
      return formatDate(date,"yyyy-MM-dd hh:mm:ss")
    }
  },
  computed: {
    currentMonthText() {
      if (this.options.month) {
        return new Date().getMonth(this.options.month)+1+ '月'
      }
    },
    totalMoney(){
      var total = 0;
      for(var i=0;i<this.tableData.length;i++){
        total+=parseInt(this.tableData[i].amount3)
      }
      this.options.totalMoney=total;
      return total
    }
  }
}
</script>
<style scoped>
    .containerHead{overflow: hidden;margin-left:23%;}
    .containerHead ul li{
        float:left;
        font-size:16px;
        color:#666666;
        line-height:30px;
        margin-right:16px;
    }
    .numberBack{
        width:30px;
        height:30px;
        background:url('../../assets/img/2-1.png') no-repeat;
        text-align:center;
        line-height:30px;
    }
    .containerCenter{
        margin:0 auto 0;
    }
    .el-row .el-form-item,.el-row .el-form-item__content{width: 95%;}
    .el-button--primary{float: right;}
    .fl{float: left;}



    /*删除*/
     .box-wrap .el-tag + .el-tag {
    margin-left: 10px;

  }
  span.el-tag{background-color:#fff!important;
    color:red;display: inline-block;}
    i.el-tag__close{border:1px solid #000;color:#000;}
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .el-table th>.cell,.el-table .cell, .el-table th>div{text-align: center;}
   .noBack{
        background:url('../../assets/img/2-4.png') 16px center no-repeat #fff;
    }
    .containerHead ul li{
        float:left;
        font-size:16px;
        color:#666666;
        line-height:30px;
        margin-right:14px;
    }
    .numberBack{
        width:30px;
        height:30px;
        background:url('../../assets/img/2-1.png') no-repeat;
        text-align:center;
        line-height:30px;
    }
    .numberBackActive{
       background:url('../../assets/img/2-6.png') no-repeat;
    }
    .el-button--danger.is-plain{background: #f60!important;color:#fff;border:0 none;}
    .el-button--danger.is-plain:hover,.el-button--danger.is-plain:active,.el-button--danger.is-plain:visited{background: #f60!important;color:#fff!important;}
    .app-btn-link, .el-button--text{padding:10px;background: #f90;color:#fff;margin:20px 60px;}
    .app-btn-link, .el-button--text:hover{background: #f90;color:#fff; text-decoration: none;}
    .el-dialog--small{width: 30%;}
    /*Information*/
    .orderList-header{  overflow: hidden;  position: relative;  clear: both;  height: 60px;}
    .orderList-header ul{ overflow: hidden; position: absolute; left:48%; width:40%;}
    .orderList-header ul li{ float: left;}
    .orderList-header ul li:nth-child(2){float: right;}
    .orderList-header ul li .el-button{padding:12px 26px 8px;}
    main.primaryContainer ul li span{text-align:right;display: inline-block;
      width:400px;font-size:14px;line-height: 20px;color:#333;}
    main.primaryContainer ul li span.disImpor{font-size:14px;font-weight: bold;}
    main.primaryContainer ul li em.disImpor{color:red;font-size: 14px;}
    h3.safeTotal{text-align: center;line-height:38px;font-size: 15px;color:#333;}
    .immediatelyRechange{margin-top:16px;}
    .immediatelyRechange:hover,.immediatelyRechange:active,.immediatelyRechange:visited,.immediatelyRechange:link{color:#fff;}
    li.optiSeleted{font-size:14px;font-weight: bold;}
    li.optiSeleted em{color:#ff4f12;}
    .app-btn-link, .el-button--text{padding:10px;background: #f90;color:#fff;
    }
    .app-btn-link, .el-button--text:hover{background: #f90;color:#fff; text-decoration: none;}
    .Impayage  .el-dialog--small{padding-bottom:30px;}
    .el-dialog__body p{padding-bottom: 20px;border-bottom: 1px solid #f90;text-align: left;}
    .el-dialog__body p{margin-bottom:30px;}
    .app-btn-link, .el-button--text{margin:0 40px;}

</style>
<style scoped>
 .Recordrecharge  .el-table .cell, .el-table th>div{text-align: center;}
 .Recordrecharge  .showTimeDown{color:#000000;padding:5px 10px;}
 .Recordrecharge  .showTimeDown span{color:red;padding-left:5px;}
.Recordrecharge .colorRed{color:red;}
.Recordrecharge .box-wrap{min-height:95%;overflow: auto;}
.Recordrecharge .el-table th>.cell,.el-table .cell, .el-table th>div{text-align: center;}
.Recordrecharge  .el-dialog--small{width: 30%;}
.Recordrecharge  .el-dialog--small div.el-dialog__body{text-align: center;}
 .Recordrecharge .el-table th>.cell,.el-table .cell, .el-table th>div{text-align: center;}
 .Recordrecharge  .el-dialog--small{width: 30%;}
 .Recordrecharge  .el-dialog--small div.el-dialog__body{text-align: center;}
 .Recordrecharge .colorRed img{position: absolute;top:12px;left:6px;}
 .Recordrecharge .container{text-align: center;}
 .Recordrecharge main.primaryContainer ul li em{display: inline-block;width:400px;text-align: left;}
  .Recordrecharge .search-panel{display: inline-block;}
  .Recordrecharge .el-table{width:732px !important;}
  .Recordrecharge .el-table__body-wrapper{height:auto !important;}
</style>
