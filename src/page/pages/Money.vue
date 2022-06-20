<template>
  <Box class="moneyContainer">
    <div class="money" style="width: 948px;margin-left:25px;" v-show="isShowNow">

      <!--流程-->
      <div class="recharge">
        <ul style="width: 890px;">
          <li class="one weight">
            <img src="../../assets/img/2-6.png" alt="">选择生活费充值人员名单
          </li>
          <li class="line"></li>
          <li class="two">
            <span> 2 </span>提交充值订单
          </li>
          <li class="line"></li>
          <li class="three">
            <span> 3 </span>充值
          </li>
          <li class="line"></li>
          <li class="four">
            <span> 4 </span>工人生活费充值成功
          </li>
        </ul>
      </div>

      <!--工人离开-->
      <span v-show="this.show" style="font-size: 13px;">
          <img src="../../assets/img/sound.png" style="margin-right:5px;">
          工人已从劳务队离开，请在工人管理中将该工人状态修改为 "离场" 。
          <span style="margin-left:5px;" @click="text">
           <img
             src="../../assets/img/error.png" >
          </span>
        </span>

      <!--查询功能-->
      <div class="inquiry">
        <div class="inquiryCondition">
          <el-form :inline="true" :model="options" class="demo-form-inline">
            <!--<el-form-item label="劳务队">-->
            <!--<el-select clearable v-model="options.labor" placeholder="请选择">-->
            <!--<el-option :label="labor.tname" :value="labor.id" v-for="labor in labors" :key="labor.id"></el-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item label="工种">
              <el-select  placeholder="请选择" clearable v-model="options.workType">
                <el-option :label="worktype.jobtype" :value="worktype.id" v-for="worktype in workTypes" :key="worktype.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model.trim="options.name" placeholder=""></el-input>
            </el-form-item>
          </el-form>
        </div>

        <!--查询 批量 + 充值人员名单  -->
        <div class="inquiryButton">
          <el-form :inline="true" :model="options" class="demo-form-inline">
            <el-form-item>
              <el-button type="primary" @click="getDataVal">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="addBut" type="warning" plain @click="addBut">批量加入充值人员名单</el-button>
            </el-form-item>
            <el-form-item style="margin-bottom:10px;float:right;">
              <el-button type="primary" @click="reachargelist">充值人员名单(<span> {{this.totalNumber}} </span>)人</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="personnel" ref="tableHeight">
        <el-table :data="tableData" ref ="check" tooltip-effect="dark" style="width: 100%" @selection-change="selectChange" border>
          <el-table-column type="selection" min-width="50">
          </el-table-column>
          <el-table-column label="序号" type="index" min-width="60" header-align="center">
          </el-table-column>
          <el-table-column prop="name" label="姓名" min-width="90" header-align="center">
          </el-table-column>
          <el-table-column prop="idno" label="身份证号" min-width="160"  header-align="center">
          </el-table-column>
          <el-table-column prop="jobno" label="职业号" min-width="110"  header-align="center">
          </el-table-column>
          <el-table-column prop="workgroup" label="工种" min-width="100"  header-align="center">
          </el-table-column>
          <el-table-column prop="positionvalue" label="角色" min-width="60"  header-align="center">
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button class="addlist" :disabled="scope.row.flag==0?true:false"
                         @click="clickJoin(scope.$index, scope.row)" type="text" size="small">
                {{scope.row.flag==0?'已加入充值人员名单':'加入充值人员名单'}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </div>
  </Box>
</template>
<script>
  import {formatDate} from '../../assets/js/date.js';
  import Box from '../../components/Box';
  import imageView from '../../components/imageView.vue';

  export default {
    name: 'money',
    components: {Box},
    data() {
      return {
        options:{
          name:'',
          type:'',
          id:'',
          jobtype:'',
          workType:''
        },
        workTypes:[],
        isShowNow:false,
        height:'',
        show:true,
        zyt_tokenID:this.getCookie("lab_session"),
        zyt_userId:this.getCookie('lab_userID'),
        tableData:[],
        work:[],
        payWork:[],
        teamId :'',
        totalNumber:0,
        index:'',
        team:''
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
      text(){
        this.show=false;
      },
      reachargelist(){
        this.$router.push({name:'moneyList'})
      },
      selectChange(val){
        let checkInput = Array.from(document.getElementsByClassName('el-checkbox__input'));
        for(let i in checkInput){
          if(this.hasClass(checkInput[i],'is-disabled')){
            this.$nextTick(function(){
              this.removeClass(checkInput[i],'is-checked');
              if(!this.hasClass(checkInput[i],'is-disabled')){
                this.addClass(checkInput[i],'is-disabled');
              }

            })
          }
        }
        if(!this.hasClass(checkInput[0],'is-disabled')){
          if(val.length>0){
            let works = [];
            val.forEach(row => {
              if(row.flag==1){
                works.push({"id": row.id, "jobtype": row.jobtype, "money": 0});
              }
            });
            this.work = works;
          }else{
            this.work = [];
          }
        }
      },

      //加入充值人员名单
      clickJoin(index,row){
        this.index=index+1;
        // this.numx += 1;
        this.work=[];
        this.work.push({"id": row.id, "jobtype": row.jobtype, "money": 0});
        this.add('in');
      },
      addBut(){
        let But = document.getElementsByClassName('addBut')[0];
        But.style.background='#0069a1';
        But.style.border='1px solid #0069a1';
        But.style.color='#fff';
        this.add('');
      },
      add(val){
        let intersection = this.work.filter(v => this.payWork.includes(v));
        let difference = this.work.concat(intersection).filter(v => !this.work.includes(v) || !intersection.includes(v));
//        let intersection = a.filter(v => b.includes(v))
//        let difference = a.concat(b).filter(v => !a.includes(v) || !b.includes(v))
        if(difference.length>0){
          this.work = difference;
        }
        if(val=='in'){
          this.addWork();
        }else{
          if(this.team==this.teamId || this.team==''){
            this.addWork();
          }else{
            this.$alert('请选择充值人员', '温馨提示', {
              dangerouslyUseHTMLString: true
            })

          }
        }
      },
      addWork(){
        if(this.work.length>0){
          let _t = this;
          this.$api.post("/manage/recharge/joinRecharge",{
              tokenID:this.zyt_tokenID,
              userId:this.zyt_userId,
              work:this.work,
              id:this.options.id,
              jobtype:this.options.jobtype,
              money:500
            },function(res){
              _t.getData();
            },function(e){
            }
          );
        }else{
          this.$alert('请选择充值人员', '温馨提示', {
            dangerouslyUseHTMLString: true
          })
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
      seach(){
        let _t=this;
        this.work = [];
        this.$api.post("/manage/recharge/searchWorks",{
          tokenID:this.zyt_tokenID,
          userId:this.zyt_userId,
          name:this.options.name,
          workType:this.options.workType,
          start : 0,
          num : 100000    //入参
        },function(res){
          _t.tableData=res.body.worker;    //获取数据并传到页面
          for(var i = 0; i<res.body.worker.length;i++){   //循环拿到数组中的某一个参数
            _t.options.id = res.body.worker[i].id;
            _t.options.jobtype = res.body.worker[i].jobtype
          }
          if(_t.team==_t.teamId || _t.team==''){
            let arr=[];
            for(let m in  _t.tableData){
              let flag = _t.tableData[m].flag;
              if(flag == 0){
                m++;
                arr.push(m);
              }
            }
            _t.$nextTick(function(){
              let input = Array.from(document.getElementsByClassName('el-checkbox__original'));
              let checkInput = Array.from(document.getElementsByClassName('el-checkbox__input'));

              for(let i=0;i<input.length;i++){
                input[i].removeAttribute("disabled");
                if(_t.hasClass(checkInput[i],'is-disabled')){
                  _t.removeClass(checkInput[i],'is-disabled');
                }
              }

              if(arr.length === _t.tableData.length && arr.length!=0){
                input[0].setAttribute('disabled',true);
                _t.addClass(checkInput[0],'is-disabled');
              }else{
                input[0].setAttribute('disabled',false);
                _t.removeClass(checkInput[0],'is-disabled');
              }
              if(arr.length>0){
                for(let i=0;i<arr.length;i++){
                  let index =  arr[i];
                  input[index].setAttribute('disabled',true);
                  if(!_t.hasClass(checkInput[index],'is-disabled')){
                    _t.addClass(checkInput[index],'is-disabled');
                  }
                }
              }

            })
          }else{
            _t.$nextTick(function(){
              let input = Array.from(document.getElementsByClassName('el-checkbox__original'));
              let checkInput = Array.from(document.getElementsByClassName('el-checkbox__input'));
              for(let i=0;i<input.length;i++){
                input[i].removeAttribute('disabled');
                _t.removeClass(checkInput[i],'is-disabled');
              }
            })
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
      getDataVal(){
        let But = document.getElementsByClassName('addBut')[0];
        But.style.background='#0b95de';
        But.style.border='1px solid #0b95de';
        But.style.color='#fff';
        this.getData();
      },

      getData(formName){
        var _t=this;
        this.$api.post("/manage/recharge/rechargeList",{   // 充值人员名单
          tokenID:this.zyt_tokenID,
          userId:this.zyt_userId
        },function(res){
          _t.$store.commit("setLoading",false);
          _t.isShowNow = true;
//            let result = res.body;
          _t.totalNumber=res.body.length;
          let input = Array.from(document.getElementsByClassName('el-checkbox__original'));
          let checkInput = Array.from(document.getElementsByClassName('el-checkbox__input'));
//            for(let i=0;i<input.length;i++){
//              input[i].removeAttribute('disabled');
//              _t.removeClass(checkInput[i],'is-disabled');
//            }
//            for(let i in result){
//              _t.payWork.push({"id": val[i].id, "jobtype": val[i].jobtype, "money": 0});
//            }
//            _t.teamId = _t.options.labor;
//            if(val[0]){
//              _t.team = val[0].laborid;
//            }else{
//              _t.team = '';
//            }
          _t.seach();
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
      }
    },
    mounted () {
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      let th = this.$refs.tableHeight.getBoundingClientRect().top;
      this.height = parseFloat(h)-parseFloat(th) -40;
      let che = document.getElementsByClassName('el-checkbox__original');

    },

    created(){
      this.$store.commit("setLoading",true);
      this.getData();
      var _t=this;
      // 获取工种
      this.$api.post("/labor/master/defaultJobtype",{tokenID:this.zyt_tokenID,userId:this.zyt_userId},function(res){
        _t.workTypes=res.body
      },function(e){
      });
      this.$api.post("/manage/recharge/rechargeList",{
        tokenID:this.zyt_tokenID,
        userId:this.zyt_userId,
      },function(res){
        _t.totalNumber=res.body.length;

      },function(e){

      });
    }
  }

</script>
<style scoped>
  .money{
    /*display:flex;*/
    flex-direction:column;
  }
  .money div.recharge{
    /*flex:1;*/
    width:100%;
    flex-direction:row;
    height:72px;
  }
  .money div.recharge ul{
    display:flex;
    width:100%;
    line-height:72px;
    flex-direction:row;
    font-size: 16px;
  }

  .money div.recharge li.line{
    flex:1;
    margin:38px 15px;
    line-height:72px;
    height:0;
    border:none;
    border-bottom:4px solid #ddd;
  }
  .money div.recharge li.lineColor{
    border-bottom:4px solid #05AA28;
  }
  /*.numberBackActive{*/
  /*background:url('../../assets/img/2-6.png') no-repeat;*/
  /*}*/
  .money div.inquiry{
    height:120px;
    padding:10px 0;
    /*color:#000;*/
    /*padding:0 0 10px;*/
  }
  .money div.inquiry .inquiryCondition
  {
    text-align:left;
    width:948px;
  }
  .money div.inquiry .inquiryCondition .el-form-item{
    color: #48576a;
    font-weight:normal;
  }
  .money div.inquiry .inquiryCondition .el-form-item:nth-child(2){
    margin:0 10px;
  }
  /*.money div.inquiry .inquiryButton{*/
  /*padding:0 30px;*/
  /*}*/
  .money div.inquiry .inquiryButton .el-form-item{
    margin-bottom:10px;
  }
  /*.money div.inquiry .inquiryButton .el-form-item:nth-child(2){*/
  /*float:right;*/
  /*}*/
  .money div.personnel{
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
  .recharge li.weight{
    font-weight: bold;
    color:#333;
  }
  .addBut{
    border:1px solid #0b95de;
    background:#0b95de;
    color:#fff
  }
  .addBut:hover{
    border:1px solid #26aaf2;
    background:#26aaf2;
    color:#fff
  }
  .addBut:active{
    border:1px solid #0069a1;
    background:#0069a1;
    color:#fff
  }
  /*.app-btn-link, .el-button--text{*/
  /*color:#ff9000;*/
  /*}*/
  /*.app-btn-link, .el-button--text:hover{*/
  /*color:#feb454;*/
  /*}*/
  /*.app-btn-link, .el-button--text:active{*/
  /*color:#f67a00;*/
  /*}*/
  .app-btn-link, .el-button--text{
    color:#ff9000;
  }
  .app-btn-link:hover, .el-button--text:hover, .el-button--text.hover{
    color:#feb454;
  }
  .app-btn-link:active, .el-button--text:active, .el-button--text.is-active{
    color:#f67a00;
  }
  .is-disabled{
    color:#999999;
  }
  .is-disabled:hover{
    color:#999999;
  }
  .el-table .cell, .el-table th>div{
    padding:0 10px;
  }
  /*.money .el-table-column--selection{*/
  /*text-align:center!important;*/
  /*}*/

</style>
<style>
  .moneyContainer .money .el-table tr th>div, .moneyList .el-table tr th>div, .payment .el-table tr th>div{
    text-align: center !important;
  }
  .moneyContainer .el-table .cell, .el-table th > div, .Recordrecharge .el-table th > .cell{
    text-align: center !important;
  }
  .moneyContainer .el-table__header .el-table_1_column_8{border-right-color:#fff;}
  .moneyContainer .box-wrap{
    min-height:95%;
  }

  .moneyContainer .el-table--border td, .el-table--border th{
    border-right:1px solid #dfe6ec;
  }
  .moneyContainer .el-table--border td:last-child, .el-table--border th:last-child{
    border-right:0 none;
  }
</style>

