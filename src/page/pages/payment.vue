<template>
  <!-- 发起培训 -->
  <Box class="payment" >
    <div  style="margin:0 auto;">
      <div>
        <div class="recharge">
          <ul style="width: 890px;margin:0 auto" v-show="nav_list">
            <li class="one weight">
              <img src="../../assets/img/2-6.png">设置奖励名单
            </li>
            <li class="line lineColor"></li>
            <li class="two weight">
              <img src="../../assets/img/2-6.png">提交充值订单
            </li>
            <li :class="this.show ? 'line lineColor':this.fail?'line lineRed':'line'"></li>
            <li :class="this.show ? 'four weight':this.fail?'four weight':'four'">
              <img v-if="this.show" src="../../assets/img/2-6.png">
              <span v-if="!this.show && !this.fail"> 3 </span>
              <img v-if="!this.show && this.fail" src="../../assets/img/failIcon.png">充值
            </li>
            <li :class="this.show ? 'line lineColor':'line'"></li>
            <li class="four">
              <img v-if="this.show" src="../../assets/img/2-6.png">
              <span v-if="!this.show"> 4 </span>工人生活费充值成功
            </li>
          </ul>
        </div>

      </div>
      <div class="head" style="margin-bottom:30px;text-align: right;" >
        <div  style="padding:0 10px;text-align:right;" v-if="this.cName">
          <span v-if="this.show==false" v-model="this.showtime">剩余充值时间：
            <span style="color:#ff7241">
                 {{hours}}<span v-if="hours">:</span>{{minutes}}<span v-if="minutes">:</span>{{seconds}}
            </span>
          </span>
        </div>

        <!--<span v-if="this.show==true" class="print" @click="print">-->
          <!--打印-->
        <!--</span>-->
          <div class="print" v-if="this.show==true">
            <el-button type="primary" @click="printSign0">打印</el-button>
          </div>

        <div v-if="this.icon==1"><img  src="../../assets/img/waitingPay.png"></div>
        <div v-if="this.icon==2"><img src="../../assets/img/orderIcon.png"></div>
        <div v-if="this.icon==3">
          <img src="../../assets/img/Paymentfail.png">
        </div>
        <div v-if="this.icon==4" style="margin-top:50px;">
          <img src="../../assets/img/huikuan.png">
        </div>
        <ul>
          <li style="font-weight: bold;"><span class="paymoneyInfo">充值人数：</span> <span style="color:#ff4f12">{{this.num}}</span></li>
          <li style="font-weight: bold;"><span class="paymoneyInfo">充值总金额：</span> <span style="color:#ff4f12">{{this.money}}</span></li>
          <li><span class="paymoneyInfo">充值订单编号：</span> <span>{{this.orderno}}</span></li>
          <li><span class="paymoneyInfo">充值订单提交时间：</span> <span>{{this.time | formatTime2}}</span></li>
        </ul>
        <div v-show="this.cName" :disabled="!this.show" class="pay" style="cursor:pointer;margin-bottom:10px" @click = "payMoney" >
          {{status}}
        </div>

      </div>
      <div id="print" ref="sign">
        <div class="poprintControl">
          <h3 style="margin-bottom:10px;text-align:center;">生活费充值明细</h3>
          <div ref="tableHeight">
          	<div style="width:732px;margin:0 auto;position: relative;">
          		<el-table :data="tableData" tooltip-effect="dark" border>
	              <el-table-column prop="name" label="姓名" min-width="80"></el-table-column>
	              <el-table-column prop="idno" label="身份证号" min-width="160"></el-table-column>
	              <el-table-column prop="jobno" label="职业号" min-width="100" show-overflow-tooltip></el-table-column>
	              <el-table-column prop="jobtype" label="工种" min-width="120" show-overflow-tooltip></el-table-column>
	              <el-table-column prop="amount" label="充值金额" min-width="100" style="padding:0 30px" show-overflow-tooltip></el-table-column>
            	</el-table>
	            <div v-if="this.show" id="Iconcachet" class="Iconcachet">
	              <i class="Icon-cachet"><img src="../../assets/img/chapter.png" alt=""></i>
	            </div>
          	</div>
          </div>
        </div>
      </div>
    </div>
    <div ref="style" class="style">
      * { margin: 0; padding: 0; }
        body{ width:100%; margin:20px auto; font-family:'Microsoft YaHei'; text-align:center; font-size:12px; }
        thead tr,tbody tr{line-height:35px;}
        .printTm { position: absolute; left: 0px; top: 0px; }
        #print-content { margin: 0px auto; }
        #print-content0 {position:relative;}
        #Iconcachet0 {width:180px;height:180px;position:absolute;bottom:0px;right:30px; border:0px solid red;}
        h3 { font-size: 20px; height:35px; line-height:35px; text-align: center; }
        .headInfo { margin: 5px auto; height: 16px; }
        table { border-collapse: collapse; width: 100%; margin:0 auto; }
        td, th { border-bottom: 1px solid #dfe6ec; text-align: center; height:30px; line-height:30px; }
        @media print {
        .pageBreak { page-break-after: always;
        /*强制换页的关键*/
        }
        .noPrint { display: none; }
        }
    </div>
    <div ref="script" class="style">
        var len = document.body.getAttribute('data-item');
        if(len == 1){document.getElementById("Iconcachet0").style.bottom = "-150px";}
        else if(len == 2) {document.getElementById("Iconcachet0").style.bottom = "-120px";}
        else if(len == 3) {document.getElementById("Iconcachet0").style.bottom = "-90px";}
        else if(len == 4) {document.getElementById("Iconcachet0").style.bottom = "-60px";}
        else if(len == 5) {document.getElementById("Iconcachet0").style.bottom = "-30px";}
        else if(len == 31) {document.getElementById("Iconcachet0").style.bottom = "-150px";}
        else if(len == 32) {document.getElementById("Iconcachet0").style.bottom = "-120px";}
        else if(len == 33) {document.getElementById("Iconcachet0").style.bottom = "-90px";}
        else if(len == 34) {document.getElementById("Iconcachet0").style.bottom = "-60px";}
        else if(len == 35) {document.getElementById("Iconcachet0").style.bottom = "-30px";}
        else {
          if((len-1)%30 == 0) {document.getElementById("Iconcachet0").style.bottom = "-150px";}
          else if((len-2)%30 == 0) {document.getElementById("Iconcachet0").style.bottom = "-120px";}
          else if((len-3)%30 == 0) {document.getElementById("Iconcachet0").style.bottom = "-90px";}
          else if((len-4)%30 == 0) {document.getElementById("Iconcachet0").style.bottom = "-60px";}
          else if((len-5)%30 == 0) {document.getElementById("Iconcachet0").style.bottom = "-30px";}
          else{}
        }
      </div>
    <div id="print-content" style="display: none;">
        <div id="print-content0">
          <div class="header clear">
            <div class="titleArea">
              <h3>生活费充值明细</h3>
            </div>
          </div>
          <table class="tableTopBorder_3">
            <thead>
            <tr>
              <th>姓名</th>
              <th>身份证号</th>
              <th>职业号</th>
              <th>工种</th>
              <th>充值金额</th>
            </tr>
            </thead>
            <tbody>

            </tbody>
          </table>
          <!--<div class="pageBreak">-->
          <!--&lt;!&ndash;如果需要强制换页就在上一页的未尾出加上此代码&ndash;&gt;-->
          <!--</div>-->
          <img id="Iconcachet0" src="../../assets/img/chapter.png" alt="">
        </div>
      </div>
  </Box>
</template>
<script>

  import Box from '../../components/Box';
  import {formatDate} from '../../assets/js/date.js';
  export default {
    name:'payment',
    components:{Box},
    data() {
      return {
        zyt_tokenID:this.getCookie("lab_session"),
        zyt_userId:this.getCookie('lab_userID'),
        tableData:[],
        height:'',
        order:'',
        nav_list:true,
        orderno:'',
        status:'立即充值',
        dialogTableVisible: false,
        time:'',
        money:'',
        num:'',
        showtime:'',
        subInterval:"",
        show:false,
        fail:false,
        icon:1,
        cName:true,
        hours:'',
        minutes:'',
        seconds:'',
        tableDatalength:0,
        DataLength:0,
        orderState:0
      }
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
      payMoney(){
        let _t=this;
        let val = this.status;
        let order = this.orderno.toString();
        if(val=='重新支付' || val=='立即充值' || val=='充值中...'){
          this.status = '充值中...';
          let time = this.time;
          let date = formatDate(new Date(Number(time)), 'yyyy-MM-dd hh:mm:ss');
          let money= this.money+'.00';
          _t.$router.push({name:'paylist',params:[this.orderno,'生活费发放',date,'待支付',money]
          });

          localStorage.setItem("object",[this.orderno,'生活费发放',date,'待支付',money]);

        }
      },

      getRecharge(formName){
        var _t=this;
        if(this.$route.params.order){
          this.order = this.$route.params.order;
        }else{
          this.order = localStorage.getItem("order")
        }
        this.$api.post("/manage/recharge/orderPeopleDetail",{
          tokenID:this.zyt_tokenID,
          userId:this.zyt_userId,
          order: this.orderno ,
          start: 0,
          num : 10000
        },function(res){
          _t.tableData=res.body;
          if (_t.orderState == 1000401) {
            _t.tableDatalength = res.body.length;
            // 显示页 判断返回数据的条数决定章的位置
            switch (_t.tableDatalength) {
              case 1:
                document.getElementById('Iconcachet').style.bottom = -140 + 'px';
                break;
              case 2:
                document.getElementById('Iconcachet').style.bottom = -100 + 'px';
                break;
              case 3:
                document.getElementById('Iconcachet').style.bottom = -60 + 'px';
                break;
              case 4:
                document.getElementById('Iconcachet').style.bottom = -20 + 'px';
                break;
              case 5:
                document.getElementById('Iconcachet').style.bottom = 20 + 'px';
                break;
              default:
                document.getElementById('Iconcachet').style.bottom = 10 + 'px';
                break;
            }
            _t.DataLength = res.body.length;
            localStorage.setItem('DataLength1',res.body.length);
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
      print(){
        var newWindow=window.open("about:blank");
        var doc=this.$refs.sign.innerHTML;
        var styles=this.$refs.style.innerHTML;
        newWindow.document.write("<!DOCTYPE html>\n<html>\n");
        newWindow.document.write("<title>生活费充值明细</title>\n");
        newWindow.document.write("<style>"+styles+"</style>");
        newWindow.document.write("\n<body>");
        newWindow.document.write(doc);
        newWindow.document.write("\n</body>\n");
        newWindow.document.write("</html>");
        newWindow.document.close();
        newWindow.print();
        newWindow.close();
      },
      printSign0(){
        var _t = this;
        $("#print-content table tbody").html('');
        var html = '';
        for(var i = 0;i < _t.tableData.length; i++) {
          if (i == 0) {
            html = "<tr><td>"+_t.tableData[i]['name']+"</td><td>"+_t.tableData[i]['idno']+"</td><td>"+_t.tableData[i]['jobno']+"</td><td>"+_t.tableData[i]['jobtype']+"</td><td>"+_t.tableData[i]['amount']+"</td></tr>";
            $("#print-content table:last-of-type tbody").html(html);
          } else {
            if(i % 30 == 0) {
              $('#print-content0').append("<div class='pageBreak'></div>");
              var table = document.createElement('table');
              var tbody = document.createElement('tbody');
              html = '';
              html = "<tr><td>"+_t.tableData[i]['name']+"</td><td>"+_t.tableData[i]['idno']+"</td><td>"+_t.tableData[i]['jobno']+"</td><td>"+_t.tableData[i]['jobtype']+"</td><td>"+_t.tableData[i]['amount']+"</td></tr>";
              table.appendChild(tbody);
              $('#print-content0').append(table);
              $("#print-content table:last-of-type tbody").html(html);
            } else {
              html += "<tr><td>"+_t.tableData[i]['name']+"</td><td>"+_t.tableData[i]['idno']+"</td><td>"+_t.tableData[i]['jobno']+"</td><td>"+_t.tableData[i]['jobtype']+"</td><td>"+_t.tableData[i]['amount']+"</td></tr>";
              $("#print-content table:last-of-type tbody").html(html);
            }
          }

        }
        var len = localStorage.getItem('DataLength1');
        var newWindow=window.open("about:blank");
        var styles=this.$refs.style.innerHTML;
        var doc = document.getElementById('print-content').innerHTML;
        var scripts = this.$refs.script.innerHTML;
        newWindow.document.write("<!DOCTYPE html><html>");
        newWindow.document.write("<title>生活费充值明细</title>\n");
        newWindow.document.write("<style type='text/css'>"+styles+"</style>");
        newWindow.document.write("\n<body data-item='"+len+"'>");
        newWindow.document.write(doc);
        newWindow.document.write("</body>");
        newWindow.document.write("</html>");
        newWindow.document.write("<script>"+scripts+"\<\/script>");
        newWindow.document.close();
        newWindow.print();
        newWindow.close();
      },
      orderVal(){
        let _t = this;
        this.$api.post('/manage/recharge/orderDetail', {
            tokenID:this.zyt_tokenID,
            userId:this.zyt_userId,
            order : this.orderno//订单号
          },function(res){
             _t.time = res.body.time;
             _t.num = res.body.num;
             _t.money = res.body.money;
             _t.timeDown();
             //1000400 待充值 1000403 支付失败 1000401 充值成功 1000402 已取消 1000404 汇款待确认
            let ko  = sessionStorage.getItem("ko");
            _t.orderState = res.body.status;
            if(res.body.status==1000401){
              //成功
              _t.nav_list = true;
              _t.icon = 2;
              _t.show=true;
              _t.cName = false;
              _t.fail=false;
            }else if(res.body.status==1000400 && Number(ko) == 2){
              _t.nav_list = true;
              _t.icon = 1;
              _t.show = false;
              _t.status = '重新支付';
              _t.fail = true;
            }else if(res.body.status==1000400 && Number(ko) == 1){
              _t.nav_list = true;
              _t.icon = 1;
              _t.show = false;
              _t.status = '立即充值';
              _t.fail = false;
            }else if(res.body.status==1000403){
              _t.nav_list = true;
                     _t.icon = 1;
              _t.show = false;
              _t.status = '重新支付';
              _t.fail = true;
            }else if(res.body.status==1000402){
              //失败
              _t.icon = 3;
              _t.show = false;
              _t.cName = false;
              _t.fail = true;
            }else if(res.body.status==1000404){
              //转账待确认
              _t.nav_list = false;
              _t.icon = 4;
              _t.show = false;
              _t.cName = false;
              _t.fail = true;
            }else{
              _t.nav_list = false;
              _t.icon = 4;
              _t.show = true;
              _t.cName = false;
              _t.fail = true;
            }
          },function(e){
          });
      },
      timeDown(){
        this.subInterval=setInterval(this.subTime,1000)
      },
      subTime(){
        let remainedTime=24*1000*3600-(new Date().getTime()-Number(this.time));
        if(remainedTime<=0){
          this.icon = 3;
          this.cName = false;
          window.clearInterval(this.subInterval);
          this.fail=true;

        }else{
          this.hours = parseInt((remainedTime % (86400000)) / (3600000)).toString();
          this.minutes = parseInt((remainedTime % (3600000)) / (60000)).toString();
          this.seconds = parseInt((remainedTime % (60000)) / 1000).toString();
          this.hours =this.hours.length < 2 ? '0' + this.hours : this.hours;
          this.minutes =this.minutes.length < 2 ? '0' + this.minutes : this.minutes;
          this.seconds =this.seconds.length < 2 ? '0' + this.seconds : this.seconds
        }

      },
      formatTime(time){
        if(time==""||time==undefined) return "";
        let date = new Date(time);
        return Number(formatDate(date, 'yyyyMM'));
      }
    },
    filters:{
      formatDate2(value){
        if(value==""||value==undefined) return "";
        let r=/([0-9]{4})([0-9]{2})([0-9]{2})/ig;
        let str=String(value);
        return str.replace(r,"$1-$2-$3");
      },
      formatTimes(value){
        if(value==""||value==undefined) return "";
        let r=/([0-9]{1,})([0-9]{2})/ig;
        let str=String(value);
        return str.replace(r,"$1:$2");
      },
      formatTime2(time){
        if(time==""||time==undefined) return "";
        let date = new Date(Number(time));
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      },
      formatMonth(time){
        if(time==""||time==undefined) return "";
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM');
      }
    },
    beforeDestroy(){
      localStorage.removeItem('DataLength1');
    },
    created(){
      this.orderno = sessionStorage.getItem("orderDetails_next");
      this.orderVal();
      this.getRecharge();



      // var _t = this;
      // add by ssy  测试打印
      // _t.nav_list = true;
      // _t.icon = 2;
      // _t.show=true;
      // _t.cName = false;
      // _t.fail=false;
    }
  }
</script>

<style scoped>
  .payment{
    display:flex;
    flex-direction:column;
    font-size:14px;
  }
  .payment div.recharge{
    flex:1;
    width:100%;
    flex-direction:row;
  }
  .payment div.recharge ul{
    display:flex;
    width:100%;
    line-height:80px;
    flex-direction:row;
    font-size: 16px;
  }

  .payment div.recharge li.line{
    flex:1;
    margin:38px 15px;
    line-height:80px;
    height:0;
    border:none;
    border-bottom:4px solid #ddd;
  }
  .payment div.recharge li.lineColor{
    border-bottom:4px solid #05AA28;
  }
  .payment div.recharge li.lineRed{
    border-bottom:4px solid #CB180F;
  }
  .payment div.personnel .title{
    overflow: hidden;
    padding:10px 20px;
  }
  .recharge li span{
    display:inline-block;
    width:21px;
    height:21px;
    background:url('../../assets/img/2-1.png') no-repeat;
    text-align:center;
    line-height:21px;
    color:#666;
  }
  .recharge li span,.recharge li img{
    margin-right:8px;
  }
  .head div,.head ul{
    margin:0 auto;
    text-align:center;
    margin: 5px 55px;
  }
  .head div,.head ul li{
    line-height:20px;

  }
  .head ul li span:nth-child(1){
    display:inline-block;
    width:400px;
    text-align:right;
  }
  .head ul li span:nth-child(2){
    display:inline-block;
    width:400px;
    text-align:left;
  }
  .head .pay{
    margin:0 auto;
    width:100px;
    height:35px;
    line-height:35px;
    border:1px solid #FF9900;
    background:#FF9900;
    border-radius: 5px;
    color:#fff;
    font-size:14px;
  }
  .head .pay:hover{
    border:1px solid #feb454;
    background:#feb454;
  }
  .head .pay:active{
    border:1px solid #f67a00;
    background:#f67a00;
  }
  .print{
    display:inline-block ;
  }
  .Iconcachet{position: absolute;bottom:10px;right: 20px;}
  .Icon-cachet{width:180px;height:180px;display: inline-block;}
  .Icon-cachet img{width:100%;height:100%;display: inline-block;}
  .style{
    display:none;
  }
</style>
<style>
  .payment .box-wrap{
    min-height:95%;
    overflow: auto;
  }
  #print-content {
   position: relative;
   margin: 10px auto;
 }

 #print-content h1 {
   font-size: 24px;
   text-align: center;
 }

 #print-content table {
   border-collapse: collapse;
   width: 100%;
   border: 1px solid #000;
 }

 .tableTopBorder_3 {
   border-top: 0px solid #000;
 }

 #print-content td,
 #print-content th {
   border: 1px solid #000;
   text-align: center;
   padding: 3px 5px;
 }

 #print-content .header h1 {
   padding-top: 10px;
 }

 @media print {
   .pageBreak {
     page-break-after: always;
     /*强制换页的关键*/
   }
 }
</style>


