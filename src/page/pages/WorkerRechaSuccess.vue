<template>
    <Box class="SuccefulPage">
        <div class='center'>
            <div class='container'>
                <div class="containerCenter">
                  <section class="el-container is-vertical orderList">
                    <div class="topHeight"></div>
                    <header class="el-header orderList-header">
                      <ul>
                        <li><img src="../../assets/img/orderIcon.png" alt=""></li>
                        <li>
                          <div class="btn-wrap">
                            <el-button type="primary" @click="printSign0">打印</el-button>
                          </div>
                        </li>
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
                  <div ref="sign">
                    <el-row>
                      <h3 class="safeTotal">生活费充值明细</h3>
                    </el-row>
                    <div id="Poprint">
                      <div class="poprintControl">
                      <el-table :data="tableData" border :height="height" style="width: 100%;" empty-text="暂无数据～">
                        <el-table-column prop="name" label="姓名" width="120" header-align="center" align="left"></el-table-column>
                        <el-table-column prop="idno" label="身份证号" width="180" header-align="center" align="left"></el-table-column>
                        <el-table-column prop="jobno" label="职业号" width="140" header-align="center" align="left"></el-table-column>
                        <el-table-column prop="jobtype" label="工种" width="160" header-align="center" align="left"></el-table-column>
                        <el-table-column prop="amount" label="充值金额" width="130" header-align="center" align="left"></el-table-column>
                      </el-table>
                      <div id="Iconcachet" class="Iconcachet">
                        <i class="Icon-cachet"><img src="../../assets/img/chapter.png" alt=""></i>
                      </div>
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
  import {formatDate} from '../../assets/js/date.js';
  import Box from '../../components/Box';
  import imageView from '../../components/imageView.vue';
  export default {
    name:'workerRechaFail',
    components:{Box,imageView},
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
        height:'',
        tableDatalength:0,
        DataLength:0
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
      var _t=this;
      this.getData();
      if( localStorage.getItem("n")=='2' ){
        this.orderVal();
      }
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
      orderVal(){
        let _t = this;
        this.$api.post(this.$config.config_searchWebOrderUrl(),
          {
            tokenID:this.zyt_tokenID,

            userId:this.zyt_userId,

            orderno: this.options.orderno

          },function(res){
            switch (res.body.status){
              case 0:
                clearInterval(_t.subInterval);
                break;
              case 1:
                break;
            }

          })
      },
      //打印
      printSign(){
        var len = localStorage.getItem('DataLength');
        var newWindow=window.open("about:blank");
        var doc=this.$refs.sign.innerHTML;
        var styles=this.$refs.style.innerHTML;
        var scripts = this.$refs.script.innerHTML;
        newWindow.document.write("<!DOCTYPE html>\n<html>\n");
        newWindow.document.write("<title>生活费充值明细</title>\n");
        newWindow.document.write("<style>"+styles+"</style>");
        newWindow.document.write("\n<body data-item='"+len+"'>");
        newWindow.document.write(doc);
        newWindow.document.write("\n</body>\n");
        newWindow.document.write("</html>");
        newWindow.document.write("<script>"+scripts+"\<\/script>");
        newWindow.document.close();
        newWindow.print();
        newWindow.close();
      },
      // 重新写打印页面数据
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
        var len = localStorage.getItem('DataLength');
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
          start:0,
          num:100000
        },function(res){
          _t.$store.commit("setLoading",false);
          _t.tableData=res.body;
          _t.tableDatalength = res.body.length;
          // 判断返回数据的条数决定章的位置
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
          localStorage.setItem('DataLength',res.body.length);
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
    beforeDestroy(){
      localStorage.removeItem('DataLength');
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
        if(time=="" || time==undefined)return "";
        var date=new Date(parseInt(time));
        return formatDate(date,"yyyy-MM-dd hh:mm:ss")
      }
    },

    mounted () {
      // let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      // let th = this.$refs.sign.getBoundingClientRect().top;
      // this.height = parseFloat(h)-parseFloat(th) -80;
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
  .style{
    display: none;
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
    .orderList-header ul li .el-button{padding:12px 26px 8px;}
    main.primaryContainer ul li span{text-align:right;display: inline-block;
      width:400px;font-size:14px;line-height: 20px;color:#333;}
    main.primaryContainer ul li span.disImpor{font-size:14px;font-weight: bold;}
    main.primaryContainer ul li em.disImpor{color:red;font-size: 14px;}
    h3.safeTotal{text-align: center;line-height:38px;font-size: 15px;color:#333;}
    li.optiSeleted{font-size:14px;font-weight: bold;}
    li.optiSeleted em{color:#ff4f12;}
</style>
<style>

 .SuccefulPage  .showTimeDown{color:red;border:1px solid #666;padding:5px 10px;}
 .SuccefulPage .colorRed{color:red;}
 .SuccefulPage .Iconcachet{position: absolute;bottom:10px;right:30px;}
 .SuccefulPage .Icon-cachet{width:180px;height:180px;display: inline-block;}
 .SuccefulPage .Icon-cachet img{width:100%;height:100%;display: inline-block;}
 .SuccefulPage .containerHead .fontWeight{font-weight: bold;}
 .SuccefulPage #Poprint{display: inline-block;position: relative;}
 .SuccefulPage .box-wrap .container{text-align:center;}
 .SuccefulPage .box-wrap{min-height:95%;}
 .SuccefulPage .colorRed img{position: absolute;top:12px;left:6px;}
 .SuccefulPage main.primaryContainer ul li em{display: inline-block;width:400px;text-align: left;}
 .SuccefulPage .containerHead ul{display: inline-block;}
 .SuccefulPage .el-table__body-wrapper tbody tr td:nth-child(1),
 .SuccefulPage .el-table__body-wrapper tbody tr td:nth-child(2),
 .SuccefulPage .el-table__body-wrapper tbody tr td:nth-child(3),
 .SuccefulPage .el-table__body-wrapper tbody tr td:nth-child(4){padding:0 16px;}
 .SuccefulPage .el-table__body-wrapper tbody tr td:nth-child(5),
 .SuccefulPage .el-table__body-wrapper tbody tr td:nth-child(6){padding:0 26px;}
 .SuccefulPage .el-table .cell, .el-table th>div{padding:0;}
 .SuccefulPage .el-table__row td{font-size: 13px;}
 .SuccefulPage .el-table{width:732px !important;}
 .SuccefulPage .immediatelyRechange{margin-top:16px;}
 .SuccefulPage .el-table__body-wrapper{height:auto !important;}

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
