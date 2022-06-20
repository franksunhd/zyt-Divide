<template>
  <Box class="workerEditor">
    <el-form :inline="true">
      <div class="topHeight"></div>
      <div class="widthScope">
        <div class="fixedScope">
          <el-form-item class="itemImg">
            <img :src="imgUrl+form.icon" alt="">
          </el-form-item>
        </div>
        <div class="leftscope">
          <el-form-item label="姓名">
            <el-input v-model="form.name" :disabled="true" placeholder="" class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="form.sex" placeholder="" :disabled="true" class="input-width">
            </el-select>
          </el-form-item>
        </div>
        <div class="leftscope">
          <el-form-item label="年龄">
            <el-input v-model="form.age" :disabled="true" placeholder="" class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="工种">
            <el-select v-model="form.type" :disabled="true" placeholder="" class="input-width">
            </el-select>
          </el-form-item>
        </div>
        <div class="leftscope">
          <el-form-item label="职业号">
            <el-input v-model="form.jobno" :disabled="true" placeholder="" class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="form.mobile" :disabled="true" placeholder="" class="input-width"></el-input>
          </el-form-item>
        </div>
        <div class="leftscopemini">
          <el-form-item label="身份证号">
            <el-input v-model="IDCard" :disabled="true" placeholder="" class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="户籍地址">
            <el-input v-model="form.address" :disabled="true" class="input-width2"></el-input>
            <!-- <el-select v-model="form.address" :disabled="true" placeholder="省" class="address">
            </el-select>
            <el-select v-model="form.address" :disabled="true" placeholder="市" class="address">
            </el-select>
            <el-select v-model="form.address" :disabled="true" placeholder="区" class="address">
            </el-select> -->
          </el-form-item>
        </div>
        <div class="leftscopeminitext">
          <el-form-item label="劳务队">
            <el-input v-model="form.labor" :disabled="true" placeholder="" class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="派遣工种">
            <el-select v-model="form.workType" :disabled="true" placeholder="" class="input-width">
              <el-option label="木工" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色">
            <el-input v-model="form.positionvalue" :disabled="true" placeholder="" class="input-width"></el-input>
          </el-form-item>
        </div>
        <div class="leftscopeminitext">
          <el-form-item label="状态">
            <el-select v-model="form.statusvalue" :disabled="true" placeholder="" class="input-width">
            </el-select>
          </el-form-item>
          <el-form-item label="进入项目时间">
            <el-input v-model="time" :disabled="true" placeholder="" class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="离开项目时间" >
            <el-input v-model="leavedate" :disabled="true" placeholder="" class="input-width"></el-input>
          </el-form-item>
        </div>
        <el-form-item label=" ">
          <el-button type="primary" :disabled="true" style="margin-right:100px;">保存</el-button>
          <el-button type="" @click="goback()">返回</el-button>
        </el-form-item>
      </div>
    </el-form>
  </Box>
</template>
<script>
  import Box from '../../components/Box';
  export default {
    name:'workerdetail',
    components:{Box},
    data(){
      return{
        imgUrl:this.$config.config_imgUrl(),
        form:{
          name:'',
          sex:'',
          age:'',
          type:'',
          jobno:'',
          mobile:'',
          IDCard:'',
          address:'',
          workType:'',
          labor:'',
          positionvalue:'',
          statusvalue:'',
          time:'',
          leavedate:'',
          icon:''
        },
        'zyt_tokenID':this.getCookie("lab_session"),
        zyt_userId:this.getCookie('lab_userID'),
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
      getData(){
        var _t=this;
        this.$api.post("/labor/master/workerInfoDetails",{
          tokenID:this.zyt_tokenID,
          userId:this.zyt_userId,
          workId:this.$route.params.id
        },function(res){
          _t.$store.commit("setLoading",false);
          _t.form=res.body;
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
      goback(){
        this.$router.back();
      },
      format(time){
        if(!time) return "";
        var r=/([0-9]{4})([0-9]{2})([0-9]{2})/ig;
        var str=String(time);
        return str.replace(r,"$1-$2-$3");
      },
      formatCard(card){
        if(!card) return "";
        var r=/([0-9]{6})([0-9]{1,})([0-9]{4})/ig;
        var str=String(card);
//                return str.replace(r,"$1**********$3");
        return str.replace(r,"$1$2$3");
      }
    },
    computed:{
      time(){
        return this.format(this.form.time);
      },
      leavedate(){
        return this.format(this.form.leavedate);
      },
      IDCard(){
        return this.formatCard(this.form.IDCard);
      }
    },
    created(){
      this.getData();
    },

  }
</script>
<style scoped>
  .input-width{
    width:180px;
  }
  .input-width2{
    width:474px;
  }
  .address{
    width: 100px;
  }
  .el-form-item{display:inline-block;margin-bottom: 23px;}
</style>
<style>
  .workerEditor .WorkerManagement .el-dialog, .el-message-box{
    width: 400px;}
  .workerEditor .fixedScope{position: absolute;left:3%;}
  .workerEditor .widthScope{
    position: relative;display: inline-block;}
  .workerEditor .box-wrap{text-align:center;}
  .workerEditor .el-form--inline .el-form-item, .el-form--inline .el-form-item__content{vertical-align: middle;}
  .workerEditor .leftscopeminitext{text-align:left;}
  .workerEditor .el-form--inline .el-form-item{margin-right:18px;}
  .workerEditor .box-wrap{min-height:95%;}
</style>
