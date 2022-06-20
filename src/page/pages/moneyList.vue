<template>
  <Box class="moneyList" >
    <div style="width: 950px;margin:0 auto;position:relative">
      <div class="recharge">
        <ul style="width: 890px;margin:0 auto">
          <li class="one weight">
            <img src="../../assets/img/2-6.png" alt="">选择生活费充值人员名单
          </li>
          <li class="line lineColor"></li>
          <li class="two weight">
            <img src="../../assets/img/2-6.png" alt="">提交充值订单
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

      <div class="personnel">
        <div class="title">
          <span style="float:left">全部充值人员 :<b v-model="this.dex" style="font-size: 20px;color:#ff4f12"> {{dex}} </b></span>
          <div style="float:right">
            <el-checkbox v-model="checked" @change="newColor">
              统一充值金额
            </el-checkbox>
            <input @blur="test('val','')"
                   @focus="oldVal" style="text-align:center;width:52px;height:35px;margin:0 5px;border:none;border-radius:5px;"
                   :disabled="!checked" ref="val" placeholder="金额"
                   v-model="money">
            <span ref="but" class="button" @click="change">确认</span>
          </div>
          <div class="uploadFont" style="float:right">
            <el-upload
              class="upload-demo upload-btn"
              :action="fileUrl"
              multiple
              :data="UserIdToken"
              auto-upload
              :show-file-list="false"
              :on-success="UploadSuccess"
              :on-error="UploadError"
            >
              <el-button size="small" class="upload-font">批量导入发放名单</el-button>
            </el-upload>
            <el-button @click="downLoadLabor" class="upload-btn upload-font" size="small">下载导入模板</el-button>
          </div>
        </div>
        <div  ref="tableHeight">
          <el-table :data="tableData" tooltip-effect="dark" style="width:100%;overflow-x:hidden " :height="height" border
          >
            <el-table-column type="" min-width="40">
              <template slot-scope="scope">
                <div>
                  <el-checkbox  @change="handcheck(scope.$index,scope.row)" class='checkType' :checked="checkAll"></el-checkbox>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" min-width="60">
            </el-table-column>
            <el-table-column prop="idno" label="身份证号" min-width="150" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="jobno" label="职业号" min-width="80" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="jobtype" label="工种" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="充值金额" width="150">
              <template slot-scope="scope">
                <div style="width:100%;text-align: center;height:30px;">
                  <div class="listMoney">
                    <b :disabled="checked"  style="cursor:pointer" @click="sum(scope.$index,scope.row,'-')"></b>
                    <input :disabled="checked"  class="num" @input="changeMoney" @focus="oldVal" @blur="blurVal($event,scope.$index)"
                           :value="scope.row.amount"   oninput="value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');"
                           onkeyup="value=value.replace(/[^\d^\.]+/g,'') "
                           type="text">
                    <b :disabled="checked"  style="cursor:pointer" @click="sum(scope.$index,scope.row,'+')"></b>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button
                  style=" display:block;margin:0 auto;"
                  @click.native.prevent="handleDelete(scope.$index,scope.row,tableData)"
                  type="text"
                  size="small">
                  移出
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="submit">
        <span>
        <template>
          <!-- `checked` 为 true 或 false -->
              <el-checkbox  v-model="checkAll" @change="handleCheckAllChange()">全选</el-checkbox>
          </template>
           <template>
          <!-- `checked` 为 true 或 false -->
              <el-checkbox  style="position:absolute;top:133px;left:-6px;" v-model="checkAll" @change="handleCheckAllChange()"></el-checkbox>
          </template>
          <template>
               <el-button
                 style="margin-left:10px;color:#333;background:#fff;"
                 @click="minusVal()"
                 class="poin"
                 :disabled="this.out"
                 type="text"
                 size="small">
                    批量移出
               </el-button>
           </template>
          </span>
        <span>
            <span> 已选充值人数：<b style="font-size: 20px;color:#ff4f12">{{this.numx}}</b></span>
            <span>充值总金额：<b style="font-size: 20px;color:#ff4f12">{{this.total}}</b></span>
            <el-button type="warning" v-model="buttonVal" ref="submitButton" @click="list">提交充值订单</el-button>
        </span>
      </div>
      <el-dialog :visible.sync="dialogTableVisible" title="生活费发放名单导入失败" class="dislogList">
        <p class="item">以下人员非本劳务队人员：</p>
        <el-table :data="gridData" border>
          <el-table-column label="姓名" width="90" prop="name" align="center"></el-table-column>
          <el-table-column label="身份证号" width="160" prop="idno" align="center"></el-table-column>
          <el-table-column label="职业号" width="90" prop="jobno" align="center"></el-table-column>
          <el-table-column label="充值金额" prop="amount" align="center"></el-table-column>
        </el-table>
        <div class="clearfix">
          <el-button style="float: right;margin-top: 20px;" type="primary" @click="getDataList">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </Box>
</template>
<script>
  import Box from '../../components/Box';
  import {formatDate} from '../../assets/js/date.js';
  import {Decimal} from 'decimal.js';
  export default {
    name:'moneyList',
    components:{Box,Decimal,formatDate},
    data() {
      return {
        fileUrl:this.$config.config_importRechargeInfoUrl(),
        fileList: [],
        live: [],
        checked:false,
        checkAll: false,
        out:false,
        money:500,
        oldValue:'',
        newValue:'',
        height:'',
        labors:[],
        workTypes:[],
        tableData:[],
        gridData:[{
          name : '',
          idno : '',
          jobno : '',
          amount : ''
        }],
        dialogTableVisible: false,
        zyt_tokenID:this.getCookie("lab_session"),
        zyt_userId:this.getCookie('lab_userID'),
        UserIdToken:{
          'userId':this.getCookie("lab_userID"),
          'tokenID':this.getCookie('lab_session')
        },
        numx:0,
        total:0,
        work:[],
        names:[],
        dex:'',
        storage:'',
        blurValue:'',
        buttonVal:false,
        removename:''
      }
    },
    methods: {
      // 导入失败确认按钮
      getDataList(){
        this.dialogTableVisible = false;
        this.getData();
      },
      // 下载导入模板
      downLoadLabor(){
        let oReq = new XMLHttpRequest();
        oReq.open("GET", "../../../static/worker_list_temp.xlsx", true);
        oReq.setRequestHeader("Content-Type" , "application/vnd.ms-excel;charset=UTF-8");
        oReq.setRequestHeader("Accept" , "application/vnd.ms-excel");
        oReq.responseType = "blob";
        oReq.onload = function (oEvent) {
          let content = oReq.response;

          if (window.navigator.msSaveBlob){
            try{
              let blobObject = new Blob([content]);
              window.navigator.msSaveBlob(blobObject,"生活费充值人员名单-导入模板.xlsx")
            }
            catch(e){
              alert("仅支持IE10及以上版本");
            }
          }else{
            let elink = document.createElement('a');
            elink.download ="生活费充值人员名单-导入模板.xlsx";
            elink.style.display = 'none';
            var blob = new Blob([content],{type:"application/vnd.ms-excel"});
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            document.body.removeChild(elink);
          }
        };
        oReq.send();
      },
      userErrorFun(t,res){
        this.$message({
          message: res,
          center: true,
          duration:2000
        });
      },
      UploadSuccess(res){
        var _t = this;
        if (res.status == 0) {
          this.tableData = [];
          this.getData();
        } else {
          switch (res.errorcode){
            case 'INFO_INCOM':
              _t.userErrorFun(_t,'导入失败 , 导入表格四项数据必须全部填写');
              break;
            case 'FORMAT_ERROR':
              _t.userErrorFun(_t,'导入失败，请检查充值金额');
              break;
            case 'WORKER_NOT_EXIST':
              if (res.body.detail.length > 5) {
                var gridDataArr = [];
                for (var i = 0;i< 5;i++){
                  gridDataArr.push(res.body.detail[i]);
                }
                _t.gridData = gridDataArr;
              } else {
                _t.gridData = res.body.detail;
              }
              _t.dialogTableVisible = true;
              break;
            default:
              break;
          }
        }
      },
      UploadError(res){
        // console.log(res)
      },
      submitForm (formName) {
        //包含上传的文件信息和服务端返回的所有信息都在这个对象里
        this.$refs.uploada.uploadFiles
      },
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
      list(){
        if(!this.buttonVal){
          let succ = true;
          if(this.live.length==0 || this.numx==0 || this.total==0){
            this.$alert('请先添加充值人员', '温馨提示', {
              dangerouslyUseHTMLString: true
            })
            succ = false;
          }
          //提交订单
          if(succ){
            var _t=this;
            this.$api.post("/manage/recharge/submitOrder",{
              tokenID:this.zyt_tokenID,
              userId:this.zyt_userId,
              live:this.live,
              num: this.numx,
              money: this.total
            },function(res){
              _t.$router.push({name:'payment'});
              sessionStorage.setItem("orderDetails_next",res.body.orderno);
              sessionStorage.setItem("ko",1);
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
        }
      },
      newColor(){
        if(this.checked){
          //确认颜色变化
          this.$refs.but.style.background="#38afee";
          this.$refs.val.style.border='1px solid #ff7241';
        }else{
          this.$refs.but.style.background="#999999";
          this.$refs.val.style.border='none';
        }
      },
      handleCheckAllChange(){
        this.$nextTick(() => {
          let check = document.getElementsByClassName('checkType');
          let arr = Array.from(check);
          if(this.checkAll){
            arr.forEach(v => {
              let name = v.querySelector('.el-checkbox__input');
              if(name.getAttribute('class').indexOf('is-checked')<=-1 && name.parentNode.getAttribute('class').indexOf('no') <= -1){
                name.className += ' is-checked';
                name.click();
              }
            });
          }else{
            arr.forEach(v => {
              let name = v.querySelector('.el-checkbox__input');
              if(name.getAttribute('class').indexOf('is-checked')>-1 && name.parentNode.getAttribute('class').indexOf('no') <= -1){
                name.setAttribute('class','el-checkbox__input');
                name.click();
              }
            });
          }
        })

      },
      blurVal(e,index){
        this.tableData[index].amount = e.target.value;

        let checkType = Array.from(document.getElementsByClassName('checkType'));
        if(!e.target.value){
          e.target.value = this.oldValue;
          if(this.blurValue){
            this.$refs.submitButton.$el.style.background='#ff9000';
            this.$refs.submitButton.$el.style.borderColor='#ff9000';
            this.buttonVal = false;
            let input = checkType[this.blurValue].querySelector('.el-checkbox__input');
            if(input.getAttribute('class').indexOf('is-checked')>-1) {
              this.total = parseFloat(new Decimal(this.total).plus(e.target.value))>0?parseFloat(new Decimal(this.total).plus(e.target.value)).toFixed(2):0;

              this.newValue = e.target.value;
            }
          }
        }else{
           let num = Array.from(document.getElementsByClassName('num'));
           let index = '';
           for(let i in num){
             if(num[i]==e.target){
               index = i;
             }
           }
           checkType[index].click();
           this.$nextTick(()=>{
             checkType[index].click();
           })
        }
      },
      oldVal(e){
        this.oldValue = e.target.value;
        this.newValue = this.oldValue;
      },
      test(name,value,e,index){
        let v = '';
        name? v = this.$refs.val.value : v = value;
        if(!this.numTest(v)){
          if(name){
            this.$refs.val.value=this.oldValue
          }else{
            if(v == '0'){
              e.target.value= 500;
              let checkType = Array.from(document.getElementsByClassName('checkType'));
              let input = checkType[index].querySelector('.el-checkbox__input');
              if(input.getAttribute('class').indexOf('is-checked')>-1) {
                this.total =parseFloat(new Decimal(this.total).sub(this.newValue).plus(500)).toFixed(2);
              }
            }else{
              e.target.value = this.oldValue
              this.$refs.val.value=this.newValue;
              this.total =parseFloat(new Decimal(this.total).plus(this.oldValue).sub(this.newValue)).toFixed(2);
            }
          }
          this.$refs.submitButton.$el.style.background='#ff9000';
          this.$refs.submitButton.$el.style.borderColor='#ff9000';
          this.buttonVal = false;
        }else{
          if(v){
            if(!name){
              let checkType = Array.from(document.getElementsByClassName('checkType'));
              let input = checkType[index].querySelector('.el-checkbox__input');
              this.$refs.submitButton.$el.style.background='#ff9000';
              this.$refs.submitButton.$el.style.borderColor='#ff9000';
              this.buttonVal = false;
              if(input.getAttribute('class').indexOf('is-checked')>-1) {
                // this.total = (parseFloat(this.total).toFixed(2)*100 - parseFloat(this.newValue).toFixed(2)*100 + parseFloat(e.target.value).toFixed(2)*100)/100
                this.total =parseFloat(new Decimal(this.total).sub(this.newValue).plus(e.target.value)).toFixed(2);
                this.newValue = e.target.value
              }
            }
          }else{
            name ? this.$refs.val.value=this.oldValue :e.target.value='';
            if(!name){
              let checkType = Array.from(document.getElementsByClassName('checkType'));
              let input = checkType[index].querySelector('.el-checkbox__input');
              this.$refs.submitButton.$el.style.background='#999';
              this.$refs.submitButton.$el.style.borderColor='#999';
              this.buttonVal = true;
              if(input.getAttribute('class').indexOf('is-checked')>-1) {
                // this.total = (parseFloat(this.total).toFixed(2)*100 - parseFloat(this.newValue).toFixed(2)*100)/100 ;
                this.total =parseFloat(new Decimal(this.total).sub(this.newValue)).toFixed(2);

                this.newValue = 0;
                this.blurValue = index;
                // this.newValue = e.target.value
              }
            }
          }
        }
      },
      numTest(val){
        if(val){
          //如果存在 判断
          var patrn = /^\d+(\.\d+)?$/;

          if(val.lastIndexOf(".") != val.indexOf("."))
          {
            let text = '充值金额最低为1元';
            this.$alert(text, '温馨提示', {
              dangerouslyUseHTMLString: true,
              callback:action =>{
                this.$refs.val.value = this.oldValue
              }
            })
            return false;
          }
          else
          if(val == "-" || parseFloat(val)<1 || isNaN(parseFloat(val))){
            let text = '充值金额最低为1元';
            this.$alert(text, '温馨提示', {
              dangerouslyUseHTMLString: true,
              callback:action =>{
                this.$refs.val.value = this.oldValue
              }
            })
            return false;
          }else{
            return true;
          }
        }else{
          //显示变更前的数据
          return true;

        }
      },
      hasClass(elem, cls) {
        cls = cls || '';
        if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
        return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
      },
      addClass(obj, cls) {
        let obj_class = obj.className,
          blank = (obj_class != '') ? ' ' : ''
        let added = obj_class + blank + cls;
        obj.className = added;
      },
      removeClass(obj, cls) {
        let obj_class = ' ' + obj.className + ' ';
        obj_class = obj_class.replace(/(\s+)/gi, ' ');
        let removed = obj_class.replace(' ' + cls + ' ', ' ');
        removed = removed.replace(/(^\s+)|(\s+$)/g, '');
        obj.className = removed;
      },
      isInArray(arr,value){
        for(var i = 0; i < arr.length; i++){
          if(value === arr[i]){
            return true;
          }
        }
        return false;
      },
      handcheck(index, row){
        this.$nextTick(() => {
          let out = document.getElementsByClassName('poin')[0];
          let input = document.getElementsByClassName('el-checkbox__input');
          let arrs = Array.from(input);
          let check = document.getElementsByClassName('num');
          let arr = Array.from(check);
          let number = arr[index].value;
          if(arrs[index+1].getAttribute('class').indexOf('is-checked')>-1){
            this.live.push({'work':row.id,'amount':number,'jobtypeid':row.jobtypeid});
            // this.total=(parseFloat(this.total).toFixed(2)*100+parseFloat(number).toFixed(2)*100).toFixed(2)/100;
            this.total=parseFloat(new Decimal(this.total).plus(number));

            if(this.total <0){
              this.total = 0
            }

            this.work.push(row.id);

            this.names.push(row.id);
          }else{
            //this.total=(parseFloat(this.total).toFixed(2)*100-parseFloat(number).toFixed(2)*100).toFixed(2)/100;
            this.total = parseFloat(new Decimal(this.total).sub(number));

            if(this.total < 0){
              this.total = 0
            }
            let _t=this;
            this.live.map(function(v,i){
              if(v.work==row.id){
                _t.live.splice(i,1)
              }
            })
            this.work.map(function(v,i){
              if(row.id==v){
                _t.work.splice(i,1);
              }
            })
            this.names.map(function(v,i){
              if(row.id==v){
                _t.names.splice(i,1)
              }
            })
          }

          if(this.work.length==this.dex && this.dex!=0){
            this.checkAll=true;
          }else{
            this.checkAll=false;
          }

          this.numx = this.work.length;
          if(this.numx===0){
            this.out=true;
            out.style.color='#999';
          }else{
            this.out=false;
            out.style.color='#333';
          }
        })
      },
      getData(formName){
        var _t=this;
        this.$api.post("/manage/recharge/rechargeList",{
          tokenID:this.zyt_tokenID,
          userId:this.zyt_userId,
        },function(res){
          _t.tableData=res.body;
          // dex 返回数据的条数
          _t.dex= _t.tableData.length;
          var out = document.getElementsByClassName('poin')[0];
          if(_t.tableData.length>0){
            _t.storage = _t.tableData[0].laborid;
            out.style.color='#333';
            _t.out=false;
            _t.checkAll=true;
          }else{
            _t.out=true;
            out.style.color='#999';
            _t.checkAll=false;
          }
          _t.names=[];
          _t.work=[];
          _t.live=[];
          for(let i=0;i<_t.tableData.length;i++){
            _t.work.push(_t.tableData[i].id);
            _t.live.push({'work':_t.tableData[i].id,'amount':_t.tableData[i].amount,'jobtypeid':_t.tableData[i].jobtypeid})
            _t.names.push(_t.tableData[i].id);

          }
          // numx 已选充值人数
          _t.numx =_t.tableData.length;
          var totalMoney = 0;
          for (var m = 0;m< _t.tableData.length;m++) {
            totalMoney += _t.tableData[m]['amount'];
          }
          if (totalMoney > 0){
            _t.total = totalMoney.toFixed(2);
          } else {
            _t.total = 0;
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
      minusVal(){
        if(this.names.length<=0){
          this.$alert('请选择需移除人员', '温馨提示', {
            dangerouslyUseHTMLString: true
          })
        }else{
          this.$confirm('确定要将所选人员从充值名单中移出吗？', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            let _t = this;
            let checkType = Array.from(document.getElementsByClassName('checkType'));
            let arr =[];
            for(let i in checkType){
              let val = checkType[i].querySelector('.el-checkbox__input');
              if(this.hasClass(val,'is-checked')){
                arr.push(i);
              }
            }
            _t.minus('','',arr);
          });
        }

      },
      minus(val,index,arr){
        if(val){
          this.removename = val;
        }else{
          this.removename = this.names;
        }
        let _t = this;
        this.$api.post("/manage/recharge/removeRecharge",{
          tokenID:this.zyt_tokenID,
          userId:this.zyt_userId,
          work:this.removename
        },function(res){
          let checkType = Array.from(document.getElementsByClassName('checkType'));
          let tr = Array.from(document.getElementsByTagName('tr'));
          if(arr){
            for(let i in arr){
              let val = checkType[arr[i]].querySelector('.el-checkbox__input');
              tr[parseInt(arr[i])+1].setAttribute('style','display:none');
              _t.dex = _t.dex-1;
              if(val.getAttribute('class').indexOf('is-checked')>-1){
                checkType[arr[i]].click();
              }
              let input = tr[parseInt(arr[i])+1].firstChild.querySelector('.checkType');
              input.setAttribute('class','el-checkbox checkType no');
            }
          }else{
            let val = checkType[index].querySelector('.el-checkbox__input');
            tr[index+1].setAttribute('style','display:none');
            _t.dex = _t.dex-1;
            if(val.getAttribute('class').indexOf('is-checked')>-1){
              checkType[index].click();
            }
            let input = tr[index+1].firstChild.querySelector('.checkType');
            input.setAttribute('class','el-checkbox checkType no');
          }
          if(_t.work.length==_t.dex && _t.dex!=0){
            _t.checkAll=true;
          }else{
            _t.checkAll=false;
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

      handleDelete(index,row,rows){
        this.$confirm('确定将该人员从充值名单中移出吗？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          let arr = [];
          // this.names = [];
          // this.names.push(row.id);
          arr.push(row.id);
          this.minus(arr,index,);
        });
      },
      change(){
        //判断统一金额是否勾选
        if(this.checked){
          this.$refs.but.style.background="#999999";
          // this.$refs.but.style.border="1px solid #999999";
          this.$refs.val.style.border='none';
          let num = Array.from(document.getElementsByClassName('num'));

          var patrn = /^\d+(\.\d+)?$/;
          if(!patrn.test(this.$refs.val.value) ||this.$refs.val.value.indexOf("-")>=0 || this.$refs.val.value < 1) {
            let text = '充值金额最低为1元';
            this.$alert(text, '温馨提示', {
              dangerouslyUseHTMLString: true,
              callback:action =>{
                this.$refs.val.value = this.oldValue;
                this.newColor();
              }
            })
          }
          else {
          for(var v in num){
            // num[v].value= this.$refs.val.value;
            this.tableData[v]['amount'] = this.$refs.val.value;
          }
          // this.money = this.$refs.val.value;
          this.checked=false;

          //this.total = (this.numx * (this.money*100)/100).toFixed(2);
          var z = new Decimal(this.numx).mul(this.money);
          this.total = parseFloat(z);

          let arr= this.live;
          for(let i in arr){
            arr[i].amount=this.$refs.val.value;
          }
        }
        }
      },
      sum(index,rows,v){
        let listMoney = Array.from(document.getElementsByClassName('listMoney'));
        let num = Array.from(document.getElementsByClassName('num'));
        let checkType = Array.from(document.getElementsByClassName('checkType'));
        if(!num[index].getAttribute('disabled')){
          if(v==='-'){
            if(parseFloat(num[index].value)>100){
              this.removeClass(listMoney[index],'disabled');
              this.removeClass(listMoney[index],'Add');
              //num[index].value= (parseFloat(num[index].value)*100-100*100)/100;
              num[index].value= parseFloat(new Decimal(num[index].value).sub(100));
              // '-' 要实际减去tableData的值
              this.tableData[index].amount = num[index].value;
              if(num[index].value<=100){
                if(!this.hasClass(listMoney[index],'disabled')){
                  this.addClass(listMoney[index],'disabled');
                }
              }
              let name = checkType[index].querySelector('.el-checkbox__input');
              if(name.getAttribute('class').indexOf('is-checked')>-1){
                //this.total=(parseFloat(this.total).toFixed(2)*100-100*100)/100;
                this.total = parseFloat(new Decimal(this.total).sub(100)) > 0 ? parseFloat(new Decimal(this.total).sub(100)).toFixed(2):0;
                this.live.map(function(v,i){
                  if(v.work==rows.id){
                    //v.amount = (parseFloat(v.amount).toFixed(2)*100 - 100*100)/100
                    v.amount = parseFloat(new Decimal(v.amount).sub(100));
                  }
                })
              }
            }
          }else{
            if(parseFloat(num[index].value)<=4900000){
              this.removeClass(listMoney[index],'Add')
              this.removeClass(listMoney[index],'disabled')
              //num[index].value=(parseFloat(num[index].value)*100+100*100)/100;
              num[index].value=parseFloat(new Decimal(num[index].value).plus(100));
              this.tableData[index].amount = num[index].value;
              if(num[index].value>49000000){
                if(!this.hasClass(listMoney[index],'Add')){
                  this.addClass(listMoney[index],'Add')
                }
              }
              let name = checkType[index].querySelector('.el-checkbox__input');
              if(name.getAttribute('class').indexOf('is-checked')>-1){
                //this.total=(parseFloat(this.total).toFixed(2)*100+100*100)/100;
                this.total=parseFloat(new Decimal(this.total).plus(100))>0?parseFloat(new Decimal(this.total).plus(100)).toFixed(2):0;

                this.live.map(function(v,i){
                  if(v.work==rows.id){
                    //v.amount = (parseFloat(v.amount).toFixed(2)*100 + 100*100)/100
                    v.amount = parseFloat(new Decimal(v.amount).plus(100));
                  }
                })
              }
            }
          }
        }
      },
      changeMoney(e){
        //判断位置
        let listMoney = Array.from(document.getElementsByClassName('listMoney'));
        let num = Array.from(document.getElementsByClassName('num'));
        //let checkType = Array.from(document.getElementsByClassName('checkType'));
        let index = '';
        for(let i in num){
          if(num[i]==e.target){
            index = i;
          }
        }
//        handcheck(index,)
        //checkType[index].click();
        this.test('',e.target.value,e,index);
        // this.$nextTick(()=>{
        //   checkType[index].click();
        // })
//        if(parseFloat(e.target.value).toFixed(2)){
//          if(num[index].value>4900){
//            if(!this.hasClass(listMoney[index],'Add')){
//              this.addClass(listMoney[index],'Add')
//            }
//          }else{
//            this.removeClass(listMoney[index],'Add')
//          }
//          if(num[index].value<=100){
//            if(!this.hasClass(listMoney[index],'disabled')){
//              this.addClass(listMoney[index],'disabled');
//            }
//          }else{
//            this.removeClass(listMoney[index],'disabled')
//          }
//        }
      }

    },

    mounted () {
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      let th = this.$refs.tableHeight.getBoundingClientRect().top;
      this.height = parseFloat(h)-parseFloat(th) -100;

    },

    created(){
      this.getData();
      this.$watch('money', function (newVal, oldVal) {
        this.$nextTick( () => {
          this.money = this.money.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
          this.money = this.money.replace(/[^\d|\.]/g,'')
        })
      })


//
//      let listMoney = Array.from(document.getElementsByClassName('listMoney'));
//      for (var i = 0; i < listMoney.length; i++) {
//        var obj = listMoney[i];
//        obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
//      }

    }
  }
</script>
<style scoped>
  .upload-demo {
    display: inline-block;
  }
  .upload-btn {
    margin-right: 20px;
  }

  .upload-font {
    font-size: 14px;
    font-family: '微软雅黑';
    height: 35px;
  }

  .moneyList{
    display:flex;
    flex-direction:column;
    font-size:14px;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
  }
  .moneyList div.recharge{
    flex:1;
    width:100%;
    flex-direction:row;

  }
  .moneyList div.recharge ul{
    display:flex;
    width:100%;
    line-height:80px;
    flex-direction:row;
    font-size: 16px;
  }

  .moneyList div.recharge li.line{
    flex:1;
    margin:38px 15px;
    line-height:80px;
    height:0;
    border:none;
    border-bottom:4px solid #ddd;
  }
  .moneyList div.recharge li.lineColor{
    border-bottom:4px solid #05AA28;
  }
  .moneyList div.personnel .title{
    overflow: hidden;
    padding:10px 0px;
  }
  .moneyList div.personnel .title .button{
    display: inline-block;
    background: #999999;
    width: 80px;
    border-radius: 5px;
    line-height: 35px;
    color: #fff;
    text-align: center;
    cursor: pointer;
  }
  /*.moneyList div.personnel .title .button:hover{*/
  /*background:#feb454;*/
  /*}*/
  .submit{
    width:100%;
    line-height:50px;
    border:1px solid #ff7241;
    display:flex;
    padding:0 10px;
  }
  .submit span:nth-child(1){
    flex:1;
    text-align:left;
  }
  .submit span:nth-child(2){
    flex:2;
    text-align:right;
  }
  .submit span span{
    margin:0 10px;
  }
  .submit .poin{
    cursor:pointer;
  }
  .listMoney{
    display:inline-block;
    /*border:1px solid #ddd;*/
    width: 130px;
    line-height: 28px;
    text-align: center;
  }
  .listMoney input{
    width: 62px;
    display:inline-block;
    text-align: center;
    line-height:28px;
    box-sizing: border-box;
    height: 28px;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    border-left:1px solid #c2c2c2;
    border-right:1px solid #c2c2c2;
    float:left;
  }

  .listMoney b{
    float:left;
    display:inline-block;
    width:33px;
    line-height:28px;
    box-sizing: border-box;
    height: 28px;
    background-color:#eeeeee;
  }
  .listMoney b:nth-child(1){
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    background-position:center center;
    background-repeat:no-repeat;
    background-image: url("../../assets/img/newReduce.png");
  }
  .listMoney b:nth-child(3){
    border-right: 1px solid #ddd;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    background-position:center center;
    background-repeat:no-repeat;
    background-image: url("../../assets/img/newAdd.png");
  }
  .disabled b:nth-child(1){
    background-position:center center;
    background-repeat:no-repeat;
    background-image: url("../../assets/img/newforbidReduce.png");
  }
  .Add b:nth-child(3){
    background-position:center center;
    background-repeat:no-repeat;
    background-image: url("../../assets/img/newforbidAdd.png");
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
  .submit .el-button{
    height: 35px;
    background-color: #ff9000;
    border-color: #ff9000;
    color:#fff;
  }
  /*.submit:hover .el-button{*/
  /*background-color: #feb454;*/
  /*border-color: #feb454;*/
  /*color:#fff;*/
  /*}*/
  .recharge li.weight{
    font-weight: bold;
    color:#333;
  }

</style>
<style>
  /*message*/
  .el-message{height:40px;background:#66666c;border-radius: 10px;top:43%;left:53%;padding:10px 8px;min-width:auto;text-align: center;}
  .el-message img.el-message__img{width:0;height:0;display:block;}
  .el-message__group p{color:#fff;font-size:14px;font-family: 'Microsoft YaHei';text-align: center;margin:0 auto;}
  .el-message__group{text-align: center;margin:0;padding:8px 16px;}


  .dislogList .el-dialog__body {
    padding-top: 0;
    padding-bottom: 10px;
  }

  .dislogList .el-dialog__body p.item {
    padding: 10px 0;
  }
  .dislogList .el-dialog__body .el-table {
    border-top: 1px solid #ddd;
  }

  .dislogList .el-table__header-wrapper thead tr th {
    background-color: #f6f6f6 !important;
  }

  .moneyList .el-dialog {
    width: 500px;
  }
  .moneyList .submit span label:nth-child(2) span span::before{
    content:"全选";
    font-family: "Microsoft YaHei";
    font-size: 13px;
    position: absolute;
    left:25px;
    top:1px;
  }
  .moneyList .box-wrap{
    min-height:95%;
  }
</style>


