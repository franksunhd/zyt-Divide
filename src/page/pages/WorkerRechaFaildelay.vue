<template>
    <!--安全之星奖励记录状态为已取消  -->
    <Box class="ChargeFailPage">
        <div class='center'>
            <div class='container'>
                <div class="containerCenter">
                  <section class="el-container is-vertical orderList">
                    <div class="topHeight"></div>
                    <header class="el-header orderList-header">
                      <ul>
                        <li v-if="!show_list"><img src="../../assets/img/huikuan.png" alt=""></li>
                        <li v-if="show_list"><img src="../../assets/img/Paymentfail.png" alt=""></li>
                      </ul>
                    </header>
                    <main class="el-main primaryContainer">
                      <ul :model="options">
                        <li class="optiSeleted"><span>充值总金额：</span><em>{{this.options.totalMoney}}</em></li>
                        <li class="optiSeleted"><span>充值人数：</span><em>{{this.options.peopleNum}}</em></li>
                        <li></li>
                        <li><span>充  值 记 录  编  号：</span><em>{{this.options.orderno}}</em></li>
                        <li><span>充值订单提交时间： </span><em>{{this.time |formatMonth}}</em></li>
                      </ul>
                    </main>
                  </section>
                  <el-row>
                    <h3 class="safeTotal">生活费充值明细</h3>
                  </el-row>
                  <el-table :data="tableData" border height="auto" style="width: 100%;" empty-text="暂无数据～">
                    <el-table-column prop="name" label="姓名" width="120" header-align="center"></el-table-column>
                    <el-table-column prop="idno" label="身份证号" width="180" header-align="center"></el-table-column>
                    <el-table-column prop="jobno" label="职业号" width="140" header-align="center"></el-table-column>
                    <el-table-column prop="jobtype" label="工种" width="160" header-align="center"></el-table-column>
                    <el-table-column prop="amount" label="充值金额" width="130" header-align="center"sty></el-table-column>
                  </el-table>
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
    name:'workerRechaFaildelay',
    components:{Box,imageView},
    data(){
      return{
        options:{
          name:'',
          labor:'',
          show_list:true,
          type:'',
          month:Date.now(),
          start:0,
          num:10,
          totalMoney:0,
          time:Date.now(),
          orderno:'',
          order:'',
          peopleNum:0,
          date:Date.now()

        },
        month:Date.now(),
        time:Date.now(),
        showtime:"",
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
        gridData:[],
        total:10,
        pickerOption:{
          disabledDate(time){
            return time.getTime()>Date.now()||time.getTime()>localStorage.getItem("createTime");
          }
        },
        jobno:'',
        height:''
      }
    },
    beforeCreate(){
      this.$store.commit("setLoading",true)
    },
    mounted(){
      if(this.$route.params.month){
        this.month=this.$route.params.month
      }else{
        this.month=localStorage.getItem("month")
      }

      if(this.$route.params.time){
        this.time=this.$route.params.time
      }else{
        this.time=localStorage.getItem("time")
      }
    },
    created(){
      // var _t=this;
      this.getData();
      let n = sessionStorage.getItem('huikuan');

      this.show_list = (n == "汇款待确认")?  false:true;

      // if( localStorage.getItem("n")=='2' ){
      //   this.orderVal();
      // }
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
      // orderVal(){
      //   let _t = this;
      //   this.$api.post(this.$config.config_searchWebOrderUrl(),
      //     {
      //       tokenID:this.zyt_tokenID,
      //       userId:this.zyt_userId,
      //       orderno: _t.options.orderno
      //     },function(res){
      //       switch (res.body.status){
      //         case 0:
      //           clearInterval(_t.subInterval);
      //
      //           break;
      //         case 1:
      //           break;
      //       }
      //
      //     })
      // },
      //打印
      printSign(){
        var newWindow=window.open("about:blank");
        var doc=this.$refs.sign.innerHTML;
        var styles=this.$refs.style.innerHTML;
        newWindow.document.write("<!DOCTYPE html>\n<html>\n");
        newWindow.document.write("<title>签到记录</title>\n");
        newWindow.document.write("<style>"+styles+"</style>");
        newWindow.document.write("\n<body>");
        newWindow.document.write(doc);
        newWindow.document.write("\n</body>\n");
        newWindow.document.write("</html>");
        newWindow.print();
      },
      getData(){
        var _t=this;
        if(this.$route.params.month){
          this.options.month=this.$route.params.month
        }else{
          this.options.month=localStorage.getItem("month")
        }
        if(this.$route.params.order){
          this.options.order=this.$route.params.order
        }else{
          this.options.order=localStorage.getItem("order")
        }

        if(this.$route.params.orderno){
          this.options.orderno=this.$route.params.orderno
        }else{
          this.options.orderno=localStorage.getItem("orderno")
        }

        if(this.$route.params.peopleNum){
          this.options.peopleNum=this.$route.params.peopleNum
        }else{
          this.options.peopleNum=localStorage.getItem("num")
        }


        if(this.$route.params.time){
          this.time=this.$route.params.time
        }else{
          this.time=localStorage.getItem("time")
        }

        if(this.$route.params.totalMoney){
          this.options.totalMoney=this.$route.params.totalMoney
        }else{
          this.options.totalMoney=localStorage.getItem("money")
        }
        this.$api.post("/manage/recharge/orderPeopleDetail",{
          tokenID:this.zyt_tokenID,
          userId:this.zyt_userId,
          order:this.options.orderno,
          start:this.options.start,
          num:100000
        },function(res){
          _t.$store.commit("setLoading",false);
          _t.tableData=res.body;
          for (var i = 0; i < res.body.length; i++) {
            let item = res.body[i];
            if(item.name.length==2) {
              item.name=item.name.substring(0,1)+"　"+item.name.substring(1,2)
            }
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
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },

      formatTime(time){
        if(time==""||time==undefined) return "";
        return String(time).substring(0,4)+"-"+String(time).substring(4,6)
      }

    },
    filters:{
      formatDate2(value){
        if(value==""||value==undefined) return "";
        var r=/([0-9]{4})([0-9]{2})([0-9]{2})/ig;
        var str=String(value);
        return str.replace(r,"$1-$2-$3");
      },
      formatTime3(time){
        if(time==""||time==undefined) return "";
        return String(time).substring(0,4)+"-"+String(time).substring(4,6)
      },
      formatTimes(value){
        if(value==""||value==undefined) return "";
        var r=/([0-9]{1,})([0-9]{2})/ig;
        var str=String(value);
        return str.replace(r,"$1:$2");
      },
      formatTime2(time){
        if(time==""||time==undefined) return "";
        if(time<999999) {
          return time.toString().substring(0, 4) +"-"+ time.toString().substring(4, 6);
        }
        var date = new Date(parseInt(time));
        return formatDate(date, 'yyyy-MM');
      },
      formatMonth(time){
        if(time==""||time==undefined) return "";
        var date=new Date(parseInt(time));
        return formatDate(date,'yyyy-MM-dd hh:mm:ss')
      }
    },

    computed: {
      currentMonthText() {
        if (this.options.month) {
          return new Date().getMonth(this.options.month)+1+ '月'
        }
      },
      currentYeartext(){
        if (this.options.month) {
          if (typeof this.options.month == 'object') {
            return (this.options.month.getFullYear())+"年"
          }else if(typeof this.options.month == 'number'){
            return (new Date(this.options.month).getFullYear())+"年"
          }
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
  .containerCenter{
    margin:0 auto 0;
    display: inline-block;
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
  .el-button--danger.is-plain{background: #f60!important;color:#fff;}
  .el-button--danger.is-plain:hover,.el-button--danger.is-plain:active,.el-button--danger.is-plain:visited{background: #f60!important;color:#fff!important;}
  .app-btn-link, .el-button--text{padding:10px;background: #f90;color:#fff;margin:20px 60px;}
  .app-btn-link, .el-button--text:hover{background: #f90;color:#fff; text-decoration: none;}
  .el-dialog--small{width: 30%;}
  /*Information*/
  .orderList-header{  overflow: hidden;  position: relative;  clear: both;  height: 60px;}
  .orderList-header ul{ overflow: hidden; position: absolute; left:48%; width:40%;}
  .orderList-header ul li{ float: left;}
  .orderList-header ul li:nth-child(2){float: right;}
  .orderList-header ul li .el-button{padding:12px 26px;}
  main.primaryContainer ul li span{text-align:right;display: inline-block;
    width:400px;font-size:14px;line-height: 22px;color:#666;font-family: "Microsoft YaHei"}
  main.primaryContainer ul li span.disImpor{font-size:14px;font-weight: bold;}
  main.primaryContainer ul li em.disImpor{color:red;font-size: 14px;}
  main.primaryContainer ul li em{;font-size: 13px;}
  h3.safeTotal{text-align: center;line-height:50px;font-size: 14px;color:#333;font-weight: bold;}
  li.optiSeleted{font-size:14px;font-weight: bold;}
  li.optiSeleted em{color:#ff4f12;}
</style>
<style>
 .ChargeFailPage  .showTimeDown{color:red;border:1px solid #666;padding:5px 10px;}
 .ChargeFailPage .colorRed{color:red;}
 .ChargeFailPage .Iconcachet{position: absolute;bottom:10px;right:30px;}
 .ChargeFailPage .Icon-cachet{width:180px;height:180px;display: inline-block;}
 .ChargeFailPage .Icon-cachet img{width:100%;height:100%;display: inline-block;}
 .ChargeFailPage .containerHead .fontWeight{font-weight: bold;}
 .ChargeFailPage #Poprint{display: inline-block;position: relative;}
 .ChargeFailPage .box-wrap .container{text-align:center;}
 .ChargeFailPage h3.safeTotal{font-weight: bold;}
 .ChargeFailPage .colorRed img{position: absolute;top:8px;left:6px;}
 .ChargeFailPage main.primaryContainer ul li em{display: inline-block;width:400px;text-align: left;}
 .ChargeFailPage .containerHead ul{display: inline-block;}
 .ChargeFailPage .el-table__body-wrapper tbody tr td:nth-child(1),
 .ChargeFailPage .el-table__body-wrapper tbody tr td:nth-child(2),
 .ChargeFailPage .el-table__body-wrapper tbody tr td:nth-child(3),
 .ChargeFailPage .el-table__body-wrapper tbody tr td:nth-child(4){padding:0 16px;}
 .ChargeFailPage .el-table__body-wrapper tbody tr td:nth-child(5),
 .ChargeFailPage .el-table__body-wrapper tbody tr td:nth-child(6){padding:0 26px;}
 .ChargeFailPage .el-table .cell, .el-table th>div{padding:0;}
 .ChargeFailPage .el-table__row td{font-size: 13px;}
 .ChargeFailPage .el-table{width:732px !important;}
 .ChargeFailPage .el-table__body-wrapper{height:auto !important;}
 .ChargeFailPage .box-wrap{
   min-height:95%;
 }
</style>
