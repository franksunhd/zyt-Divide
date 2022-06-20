<template>
  <!-- 工人管理 -->
  <Box class="WorkerManagement">
    <div>
      <div class="topHeight"></div>
      <el-form :inline="true" :model="options">
        <el-form-item label="姓名">
          <el-input v-model="options.name" placeholder="" class="inputName"></el-input>
        </el-form-item>
        <el-form-item label="手环编号">
          <el-input class="layout-Rings layout-labor" v-model="options.bundno"></el-input>
        </el-form-item>
        <el-form-item label="工种">
          <el-select clearable v-model="options.workType" placeholder="全部" class="layout-labor">
            <el-option :label="worktype.displayref" :value="worktype.id" v-for="worktype in workTypes"
                       :key="worktype.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select clearable v-model="options.status" placeholder="请选择" class="layout-labor">
            <el-option :label="status.label" :value="status.id" v-for="status in statusList"
                       :key="status.id"></el-option>
          </el-select>
        </el-form-item>
        <div class="BtnPd">
          <el-form-item>
            <el-button type="primary" @click="onSubmit" class="searchBtn">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="submit"  value="导出" @click="downloadPT()" class="exportsBtn" :disabled="this.options.length == 0">导出</el-button>
            <el-button type="submit"  value="按行标导出" @click="downloadHB()" class="exportsBtn exportsBtnHB" :disabled="this.options.length == 0">按行标导出</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div class="search-panel" v-show="isShowNow">
        <el-table :data="worklist" border width="100%">
          <el-table-column prop="name" label="姓名" align="left" width="90" header-align="center">
          </el-table-column>
          <el-table-column prop="sex" label="性别" align="center" width="60" header-align="center">
          </el-table-column>
          <el-table-column label="籍贯" align="center" width="120">
            <template scope="scope">
              {{scope.row.nativeplace}}
            </template>
          </el-table-column>
          <el-table-column prop="idno" label="身份证号" align="center" width="180" header-align="center">
          </el-table-column>
          <el-table-column prop="jobno" label="职业号" align="center" width="110" header-align="center">
          </el-table-column>
          <el-table-column label="工种" align="left" width="130" header-align="center">
            <template scope="scope">{{scope.row.groupname}}</template>
          </el-table-column>
          <el-table-column prop="position" label="角色" align="left" width="100" header-align="center">
          </el-table-column>

          <el-table-column prop="mobile" label="手机号" align="center" width="110" header-align="center">
          </el-table-column>
          <el-table-column prop="serialno" label="手环编号" align="center" width="110" header-align="center">
          </el-table-column>
          <el-table-column label="入场时间" align="center" width="130" header-align="center">
            <template scope="scope">{{scope.row.opdate | format}}</template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="left" width="90" header-align="center">
          </el-table-column>
          <el-table-column width="160" align="left" label="操作" header-align="center">
            <template scope="scope">
              <el-button @click="handleEdit1(scope.row)" type="text" size="small" v-if="scope.row.status=='在场'"
                         class="f90">编辑
              </el-button>
              <el-button @click="handleEdit(scope.row)" type="text" size="small" v-if="scope.row.status=='离场'"
                         class="f90">查看
              </el-button>
              <el-button @click="handleConduct(scope.row)" type="text" size="small" class="baff">行为档案</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="paging">
          <el-pagination @current-change="handleCurrentChange"
                         @size-change="handleSizeChange"
                         :current-page.sync="currentPage"
                         :page-size="options.num"
                         :page-sizes="[10, 20, 30, 40]"
                         layout="total,sizes,prev, pager, next"
                         :total="total">
          </el-pagination>
        </div>
      </div>
      <el-dialog :visible.sync="dialogVisible" empty-text="该工人暂无记录" :modal-append-to-body="false">
                <span slot='title' class="title">
                    <em>行为档案</em>姓名：{{recordName}} 职业号:{{jobno}}</span>
        <el-table :data="tableData" max-height="350" border>
          <el-table-column align="center" label="序号" type='index' width="60"></el-table-column>
          <el-table-column align="left" label="行为" prop='actdesc' header-align="center" width="180"></el-table-column>
          <el-table-column align="center" label="类型" prop='type' width="110"></el-table-column>
          <el-table-column align="center" label="日期" width="110">
            <template scope="scope">{{scope.row.date | formatTime}}</template>
          </el-table-column>
          <el-table-column align="left" label="所在项目" prop='project' width="150" header-align="center"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </Box>
</template>
<script>
  import appHeader from '../../components/Header.vue';
  import SideBar from '../../components/Side.vue';
  import {formatDate} from '../../assets/js/date.js';
  import Box from '../../components/Box';
  function $create(str) {
    return document.createElement(str);
  }
  function $attr(dom, tar, val) {
    dom.setAttribute(tar, val);
  }
  export default {
    name: 'workermanage',
    components: {appHeader,SideBar,Box},
    data() {
      return {
        options: {
          name: '',
          workType: '',
          labor: '',
          status: 3200,
          start: 0,
          num: 10,
          bundno: '',
          disabled:false,
          length:'',
        },
        currentPage: 1,
        isShowNow:false,
        total: 10,
        length:'',
        worklist: [],
        labors: [],
        workTypes: [],
        statusList: [
          {
            id: 3200,
            label: "在场"
          }, {
            id: 3201,
            label: "离场"
          },{
//            id:null,
            label:'全部'
          }
        ],
        'zyt_tokenID': this.getCookie("lab_session"),
        zyt_userId: this.getCookie('lab_userID'),
        recordName: '',
        jobno: '',
        name:'',
        dialogVisible: false,
        tableData: []
      }
    },
    beforeCreate() {
      this.$store.commit("setLoading", true)
    },
    created() {
      var _t = this;
      this.getData();
      this.$api.post("/labor/master/seeWorkType", {tokenID: this.zyt_tokenID, userId: this.zyt_userId}, function (res) {
        _t.workTypes = res.body
      }, function (e) {

      });
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
      downloadPT() {
        let oReq = new XMLHttpRequest();
        oReq.open("POST", this.$config.config_exportWorkerInfoUrl(), true);
        oReq.setRequestHeader("Content-Type" , "application/json;charset=UTF-8");
        oReq.setRequestHeader("Accept" , "application/json, text/plain");
        oReq.responseType = "blob";
        oReq.onload = function (oEvent) {
          let content = oReq.response;
          let headers= oReq.getResponseHeader("content-disposition");
          if (window.navigator.msSaveBlob){
            try{
              let blobObject = new Blob([content]);
              var date = headers.substring(headers.indexOf("filename=")+9,headers.indexOf(".xlsx"))
              var year = date.split(".")[0]
              var month = date.split(".")[1]
              var day = date.split(".")[2]
              window.navigator.msSaveBlob(blobObject,"诸英台工人管理信息表" + year+ "年" + month +"月" + day + "日.xlsx")
            }
            catch(e){
              alert("仅支持IE10及以上版本");
            }
          }else{
            let elink = document.createElement('a');
            var date = headers.substring(headers.indexOf("filename=")+9,headers.indexOf(".xlsx"))
            var year = date.split(".")[0]
            var month = date.split(".")[1]
            var day = date.split(".")[2]
            elink.download ="诸英台工人管理信息表--"+ year+ "年" + month +"月" + day + "日.xlsx";
            elink.style.display = 'none';
            var blob = new Blob([content],{type:"text/plain"});
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            document.body.removeChild(elink);
          }
        };
        var  dataPT = {
          tokenID:this.zyt_tokenID,
          userId:this.zyt_userId,
          "name":encodeURI(this.options.name),
          "workType":this.options.workType,
          "bundno":this.options.bundno,
          "status":this.options.status,
        }
        this.$api.post('/labor/master/exportWorkerInfo', dataPT,function(res,{headers}){
          headers = headers['content-disposition'];
          var elink = document.createElement('a');
          elink.download = headers.substring(headers.indexOf("filename=")+9,headers.indexOf(".xlsx")+5);
          elink.style.display = 'none';
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        },function(e){
          switch(e.errorcode){
            case "TOKEN_CHANGE":
              _t.$alert('您的账号已在其他设备登录','温馨提示',{
                confirmButtonText: '确定',
                type: 'warning',
                callback:action => {
                  localStorage.getItem('UserName')
                  _t.$router.replace({ path: '/login' });
                }
              })
              break;
            case "TOKEN_NOT_EXIST":
              _t.userError(_t);
              break;
            default:

              break;
          }
        })
        var queryStr = JSON.stringify(dataPT);
        oReq.send(queryStr);
      },
      downloadHB() {
        let oReq = new XMLHttpRequest();
        oReq.open("POST", this.$config.config_exportWorkerInfoByHBUrl(), true);
        oReq.setRequestHeader("Content-Type" , "application/json;charset=UTF-8");
        oReq.setRequestHeader("Accept" , "application/json, text/plain");
        oReq.responseType = "blob";
        oReq.onload = function (oEvent) {
          let content = oReq.response;
          let headers= oReq.getResponseHeader("content-disposition");
          if (window.navigator.msSaveBlob){
            try{
              let blobObject = new Blob([content]);
              var date = headers.substring(headers.indexOf("filename=")+9,headers.indexOf(".xlsx"))
              var year = date.split(".")[0]
              var month = date.split(".")[1]
              var day = date.split(".")[2]
              window.navigator.msSaveBlob(blobObject,"诸英台工人管理信息表" + year+ "年" + month +"月" + day + "日.xlsx")
            }
            catch(e){
              alert("仅支持IE10及以上版本");
            }
          }else{
            let elink = document.createElement('a');
            var date = headers.substring(headers.indexOf("filename=")+9,headers.indexOf(".xlsx"))
            var year = date.split(".")[0]
            var month = date.split(".")[1]
            var day = date.split(".")[2]
            elink.download ="诸英台工人管理信息表--"+ year+ "年" + month +"月" + day + "日.xlsx";
            elink.style.display = 'none';
            var blob = new Blob([content],{type:"text/plain"});
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            document.body.removeChild(elink);
          }
        };
        var  dataHB = {
          tokenID:this.zyt_tokenID,
          userId:this.zyt_userId,
          "name":encodeURI(this.options.name),
          "workType":this.options.workType,
          "bundno":this.options.bundno,
          "status":this.options.status,
        }
        this.$api.post('labor/master/exportWorkerInfoByHB', dataHB,function(res,{headers}){
          headers = headers['content-disposition'];
          var elink = document.createElement('a');
          elink.download = headers.substring(headers.indexOf("filename=")+9,headers.indexOf(".xlsx")+5);
          elink.style.display = 'none';
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        },function(e){
          switch(e.errorcode){
            case "TOKEN_CHANGE":
              _t.$alert('您的账号已在其他设备登录','温馨提示',{
                confirmButtonText: '确定',
                type: 'warning',
                callback:action => {
                  localStorage.getItem('UserName')
                  _t.$router.replace({ path: '/login' });
                }
              })
              break;
            case "TOKEN_NOT_EXIST":
              _t.userError(_t);
              break;
            default:

              break;
          }
        })
        var queryStr = JSON.stringify(dataHB);
        oReq.send(queryStr);
      },
      getData() {
        var _t = this;
        this.$api.post("/labor/master/workermanage", {
          tokenID: this.zyt_tokenID,
          userId: this.zyt_userId,
          "name": encodeURI(this.options.name),
          "workType": this.options.workType,
          "labor": this.options.labor,
          "status": this.options.status,
          "start": this.options.start,
          "num": this.options.num,
          "bundno": this.options.bundno
        }, function (res) {
          _t.isShowNow = true
          _t.$store.commit("setLoading", false);
          _t.options.length = res.body.work.length
          for (var tmp in res.body.work) {
            if (res.body.work[tmp]["serialno"].length > 0)//门禁号补齐10位
            {
              res.body.work[tmp]["serialno"] = (Array(10).join(0) + res.body.work[tmp]["serialno"]).slice(-10);
            }
          }
          for(var i = 0 ; i< res.body.work.length;i++){

          }
          _t.worklist = res.body.work;
          _t.total = res.body.num;
        }, function (e) {
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
      onSubmit() {
        this.getData();
        this.disabled=true;
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        this.options.start = (currentPage - 1) * this.options.num;
        this.getData();
      },
      handleSizeChange(size) {
        this.options.num = size;
        this.options.start = 0;
        this.getData();
      },

      handleEdit(data) {
        this.$router.push({name: "workerDetail", params: {id: data.id}})
      },
      handleEdit1(data) {
        var _t = this;
        this.$router.push({name: "workerEdit", params: {id: data.id}})
      },
      handleConduct(data) {
        var _t = this;
        this.recordName = data.name;
        this.jobno = data.jobno;
        this.dialogVisible = true;
        this.$api.post("/labor/master/conductFile", {
          tokenID: this.zyt_tokenID,
          userId: this.zyt_userId,
          workId: data.id
        }, function (res) {
          _t.tableData = res.body
        }, function (e) {

        });
      }
    },
    filters: {
      format(time) {
        if (!time) return "--";
        var r = /([0-9]{4})([0-9]{2})([0-9]{2})/ig;
        var str = String(time);
        return str.replace(r, "$1-$2-$3");
      },
      formatTime(time) {
        if (time == "" || time == undefined) return "";
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
      }
    }
  }
</script>
<style scoped>
  .title {
    font-size: 14px;
    color: #fff;
  }

  .exportsBtn{padding:10px 25px;font-family: "Microsoft YaHei";font-size: 14px;color:#242d31;text-align: left;}
  .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover,.el-button.is-disabled:active{background: #eee;color:#666;}
  .title em {
    font-weight: bold;
    font-size: 16px;
    margin-right: 15px;
  }
  .exportsBtn:hover{background: #404548;color:#fff;}
  .exportsBtn:focus,.exportsBtn:active{
    background: #0a0f11;
    color:#fff;
  }

  .exportsBtnHB{
    padding:10px 13px;
  }
  .el-table .cell {
    line-height: 20px;
  }

  div.app-main .box-wrap div.search-panel {
    display: inline-block;
  }

  .inputName {
    width: 150px;
  }

  .layout-labor {
    width: 120px;
  }

</style>
<style>
  .WorkerManagement .searchBtn{
    padding:10px 25px;
  }
  .WorkerManagement .box-wrap {
    text-align: center;
    min-height:95%;
  }
  .WorkerManagement .labors{width:160px;}
  @media screen and (max-width: 1366px) {
    .WorkerManagement .box-wrap div.search-panel {
      display: block !important;
    }
  }

  @media screen and (max-width: 1366px) {
    .WorkerManagement .box-wrap .el-form--inline {
      text-align: left !important;
    }

  }

  @media screen and (min-width:1367px) {
    .WorkerManagement .el-form--inline .el-form-item:nth-child(1), .WorkerManagement .el-form--inline .el-form-item:nth-child(2) {
      margin-right: 30px;
    }
    .layout-labor {
      width: 150px !important;
    }
    .WorkerManagement .labors{width:180px !important;}

  }
  .WorkerManagement .el-table__body-wrapper tbody tr td:nth-child(3),
  .WorkerManagement .el-table__body-wrapper tbody tr td:nth-child(5) {
    padding: 0 6px;
  }

  .WorkerManagement .el-table__body-wrapper tbody tr td:nth-child(4) {
    padding: 0 7px;
  }


  .WorkerManagement .el-table__body-wrapper tbody tr td:nth-child(11) {
    padding: 0 12px;
  }

  .WorkerManagement .el-table__body-wrapper tbody tr td:nth-child(12) {
    padding: 0 8px;
  }

  .WorkerManagement .f90 {
    color: #ff9000;
  }

  .WorkerManagement .f90:hover {
    color: #feb454;
  }

  .WorkerManagement .f90:focus, .ManagementPage .f90:active {
    color: #f67a00;
  }

  .WorkerManagement .baff {
    color: #00baff;
  }

  .WorkerManagement .baff:hover {
    color: #5ec7f8;
  }

  .WorkerManagement .baff:focus, .LignthPageHome .baff:active {
    color: #31ade7;
  }



  .WorkerManagement .el-dialog__wrapper div.el-dialog--small {
    width: auto;
  }
  .WorkerManagement .el-table--border td,
  .WorkerManagement .el-table--border th {
    border-right-color: #dfe6ec;
  }
  .WorkerManagement .box-wrap > div {
    text-align: left;
  }
  .WorkerManagement .BtnPd .el-form-item:first-child{
    margin-right:15px;
  }
  .WorkerManagement .el-dialog__body{
    width:671px !important;
  }
  .WorkerManagement .el-table--border td, .el-table--border th{
    border-right:1px solid #dfe6ec;
  }


</style>

