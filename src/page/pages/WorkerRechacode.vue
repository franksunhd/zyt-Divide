<template>
  <!-- 劳务队充值记录-->
  <Box class="StarrecordPage">
    <div class="search-panel" v-show="isShowNow">
      <div class="topHeight"></div>
      <el-form :inline="true" :model="options">
        <el-form-item label="充值记录状态">
          <el-select clearable v-model="options.status" placeholder="全部状态">
            <el-option :label="status.label" :value="status.id" v-for="status in statusList" :key="status.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="充值时间范围">
          <el-select clearable v-model="options.timeSelected" placeholder="全部">
            <el-option :label="time.label" :value="time.id" v-for="time in timeList" :key="time.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border width="100%"  empty-text="暂无数据～">
        <el-table-column prop="orderno" label="充值记录编号" align="center" width="200" header-align="center">
        </el-table-column>
        <el-table-column prop="num" label="充值人数" align="center" width="100" header-align="center">
        </el-table-column>
        <el-table-column prop="account" label="充值总金额" align="left" width="100" header-align="center">
        </el-table-column>
        <el-table-column  label="充值订单提交时间" align="center" width="160" header-align="center">
          <template scope="scope">{{scope.row.date|formatData1}}</template>
        </el-table-column>
        <el-table-column prop="status" label="充值记录状态" align="center" width="120" header-align="center">
        </el-table-column>
        <el-table-column width="200" align="left" label="操作" header-align="center">
          <template scope="scope">
            <el-button style="padding-left:0;" @click="handleSuccess(scope.$index,scope.row)" type="text" size="small" v-if="scope.row.status=='充值成功'" class="baff" align="center">查看详情</el-button>
            <el-button  style="padding-left:0;"  @click="handleRecharge(scope.$index,scope.row)" type="text" size="small" v-if="scope.row.status=='待充值'" class="baff" align="center">查看详情</el-button>

            <el-button  style="padding-left:10px;" @click="handleRecharge(scope.$index,scope.row)" type="text" size="small" v-if="scope.row.status=='待充值'" class="f90" align="center">去充值</el-button>
            <el-button  style="padding-left:0;" @click="handleCancel(scope.$index,scope.row)" type="text" size="small" v-if="scope.row.status=='已取消'|| scope.row.status=='汇款待确认'" class="baff" align="center">查看详情</el-button>

          </template>
        </el-table-column>
      </el-table>
      <div class="paging">
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
                       :current-page.sync="currentPage"
                       :page-size="options.num"
                       :page-sizes="[10, 20, 30, 40]"
                       layout="total,sizes,prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </div>
  </Box>
</template>
<script>
  import {formatDate} from '../../assets/js/date.js';
  import Box from '../../components/Box';
  export default {
    name:'WorkerRechacode',
    components:{Box},
    data(){
      return{
        options:{
          status:'',
          month:Date.now(),
          start:0,
          num:10,
          account:'',
          date:'',
          labor:'',
          orderno:'',
          id:'',
          startTime:'',
          endTime:''
        },
        labors:[],
        isShowNow:false,
        currentPage: 1,
        dialogTableVisible: false,
        zyt_tokenID:this.getCookie("lab_session"),
        zyt_userId:this.getCookie('lab_userID'),
        tableData:[],
        statusList:[
          {
            id:1000400,
            label:'待充值'
          },{
            id:1000401,
            label:'充值成功'
          },{
            id:1000402,
            label:'已取消'
          },{
            id:1000404,
            label:'汇款待确认'
          }
        ],
        timeSelected:1,
        timeList:[
          {id:1,label:'全部'},
          {id:2,label:'近一周'},
          {id:3,label:'近一月'},
          {id:4,label:'近三月'}
        ],
        total:10,
        pickerOption:{
          disabledDate(time){
            return time.getTime()>Date.now()||time.getTime()<localStorage.getItem("createTime");
          }
        },
      }
    },
    beforeCreate(){
      this.$store.commit("setLoading",true)

    },
    created(){
      var _t=this;
      this.getData();
      this.$api.post('manage/master/seeLabor',{"tokenID":this.zyt_tokenID,userId:this.zyt_userId},function(res){
        _t.labors=res.body;
      },function(e){

      });
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

      //成功
      handleSuccess(index,item){
        this.$router.push({name:'workerRechaSuccess',params:{order:item.id,orderno:item.orderno,num:item.num,account:item.account,date:item.date}});
        localStorage.setItem("order",item.id)
        localStorage.setItem("money",item.account);
        localStorage.setItem("num",item.num);
        localStorage.setItem("orderno",item.orderno)
        localStorage.setItem("time",item.date)
      },
      //待充值
      handleRecharge(index,item){
        this.$router.push({name:'workerRechaRecharge',params:{order:item.id,orderno:item.orderno,num:item.num,account:item.account,date:item.date}});

        localStorage.setItem("order",item.id)//订单号
        localStorage.setItem("money",item.account);//总金额
        localStorage.setItem("num",item.num);//人数
        localStorage.setItem("orderno",item.orderno);//订单标号
        localStorage.setItem("time",item.date);//订单日期
        localStorage.setItem("n",'1');
      },
      //已取消
      handleCancel(index,item){

        if(item.status == "汇款待确认"){
          sessionStorage.setItem('huikuan','汇款待确认');
        }else{
          sessionStorage.setItem('huikuan','失败');
        }
        this.$router.push({name:'workerRechaFaildelay',params:{order:item.id,orderno:item.orderno,num:item.num,account:item.account,date:item.date}});
        localStorage.setItem("order",item.id)
        localStorage.setItem("money",item.account);
        localStorage.setItem("num",item.num);
        localStorage.setItem("orderno",item.orderno)
        localStorage.setItem("time",item.date)
      },
      // 加载后获取数据
      getData(){
        var _t=this;
        var endTime=formatDate(new Date(), 'yyyyMMdd');
        var startTime='19700101';
        var nowTimeMills=new Date().getTime();
        switch(_t.options.timeSelected){
          case 1:
            break;
          case 2:
            startTime=formatDate(new Date(nowTimeMills-6*24*60*60*1000), 'yyyyMMdd');
            break;
          case 3:
            startTime=formatDate(new Date(nowTimeMills-30*24*60*60*1000), 'yyyyMMdd');

            break;
          case 4:
            startTime=formatDate(new Date(nowTimeMills-90*24*60*60*1000), 'yyyyMMdd');

            break;
        }
        this.$api.post("/manage/recharge/orderList",{
          userId:this.zyt_userId,
          tokenID:this.zyt_tokenID,
          status:this.options.status,
          startTime:startTime,
          endTime:endTime,
          start:this.options.start,
          num:this.options.num
        },function(res){
          _t.isShowNow = true
          _t.$store.commit("setLoading",false);
          _t.tableData=res.body.order;
          _t.total=res.body.num;
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
      onSubmit(){
        this.getData();
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
        var date = new Date(time);
        return Number(formatDate(date, 'yyyyMM'));
      }
    },
    filters: {
      format(time){
        if(time==""||time==undefined) return "";
        return String(time).substring(0,4)+"-"+String(time).substring(4,6)
      },
      formatData1(time){
        if(time==""||time==undefined) return "";
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    computed: {
    }
  }
</script>
<style scoped>
  .title {
    font-size: 14px;
    color: #fff;
  }

  .title em {
    font-weight: bold;
    font-size: 16px;
    margin-right: 15px;
  }
  .app-btn-link, .el-button--text,.app-btn-link, .el-button--text:hover,.el-button+.el-button,.el-button+.el-button:hover{margin-left:0;padding: 10px;
    background:0 none;
    color: #FF9000;
    margin:0;}
</style>
<style>
  /*.StarrecordPage form.el-form .el-form-item{margin-right:25px}*/
  .StarrecordPage form.el-form label.el-form-item__label{font-size: 14px;font-family: "Microsoft YaHei";color: #48576a;padding:0 10px 0 0;line-height:36px;}
  .StarrecordPage .el-table__body-wrapper{height: auto!important;}
  .StarrecordPage  div.el-table__empty-block{background: url(../../assets/img/Nodate.png) no-repeat center;}
  .StarrecordPage .el-table__empty-block{min-height:300px;}
  .StarrecordPage .el-table__empty-text{top:80%;}
  .StarrecordPage .el-table tr:hover,.el-table tr:link,.el-table tr:active,.el-table tr:visited{
    background:#fff;
  }

  .StarrecordPage div.search-panel{
    display:inline-block;
  }
  .StarrecordPage .box-wrap{text-align: center;}
  .StarrecordPage form.el-form{text-align: left;}

  @media screen and (max-width:1320px){
    .StarrecordPage .box-wrap div.search-panel {
      display:block !important;
    }
  }
  .StarrecordPage .el-table__body-wrapper tbody tr td:nth-child(2),
  .StarrecordPage .el-table__body-wrapper tbody tr td:nth-child(4){padding:0 10px;}
  .StarrecordPage .el-table__body-wrapper tbody tr td:nth-child(6){
    padding: 0 25px;
  }
  .StarrecordPage .f90{color: #ff9000;}
  .StarrecordPage .f90:hover{color: #feb454;}
  .StarrecordPage .f90:focus,.ManagementPage .f90:active{color: #f67a00;}
  .StarrecordPage .baff{color:#00baff;}
  .StarrecordPage .baff:hover{color:#5ec7f8;}
  .StarrecordPage .baff:focus,.LignthPageHome .baff:active{color:#31ade7;}
  .StarrecordPage .el-table--border td, .el-table--border th{
    border-right:1px solid #dfe6ec;
  }
  .StarrecordPage .box-wrap{
    min-height:95%;
  }
</style>



