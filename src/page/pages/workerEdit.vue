<template>
  <Box class="workEditPage">
    <el-form :inline="true" >
      <div class="topHeight"></div>
      <div class="widthScope">
        <div class="fixedScope">
          <el-form-item class="itemImg">
            <img v-bind:src="imgUrl+form.icon"  alt=""  >
          </el-form-item>
        </div>
        <div class="leftscope">
          <el-form-item label="姓名">
            <el-input v-model="form.name"  placeholder="" :disabled="true" class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select clearable v-model="form.sex" placeholder="" :disabled="true" class="input-width">
              <el-option :label="sex.label" :value="sex.id" v-for="sex in sexList" :key="sex.id"></el-option>
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
            <el-input v-model="form.jobno"  :disabled="true" placeholder="" class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="form.mobile" :disabled="true" placeholder="" class="input-width"></el-input>
          </el-form-item>
        </div>
        <div class="leftscopemini">
          <el-form-item label="身份证号" >
            <el-input v-model="IDCard" :disabled="true" placeholder="" class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="户籍地址" >
            <el-input v-model="form.address" :disabled="true" class="input-width2"></el-input>
          </el-form-item>
        </div>
        <div class="leftscopeminitext">
          <!--<el-form-item label="劳务队">-->
            <!--<el-select v-model="form.teamid" placeholder="" class="input-width" @change="teamId">-->
              <!--<el-option :label="teamid.tname" :value="teamid.id" v-for="teamid in teamidList" :key="teamid.id" ></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="劳务队">
                <el-input v-model="form.labor"  placeholder="" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="进入项目时间">
            <el-input v-model="time"  placeholder="" :disabled="true" class="input-width"></el-input>
          </el-form-item>
        </div>
        <div class="leftscopeminitext">
          <el-form-item label="派遣工种">
            <el-select v-model="form.workType" placeholder="" class="input-width">
              <el-option :label="workType.displayref" :value="workType.id" v-for="workType in workTypeList" :key="workType.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="form.position" placeholder="" class="input-width">
              <el-option :label="position.displayref" :value="position.id" v-for="position in positionList" :key="position.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select clearable v-model="form.status" placeholder="" class="input-width">
              <el-option :label="status.label" :value="status.id" v-for="status in statusList" :key="status.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label=" ">
          <el-button type="primary" @click="Keepedit()" style="margin-right:100px;">保存</el-button>
          <el-button type="" @click="goback()">返回</el-button>
        </el-form-item>
      </div>
    </el-form>
  </Box>
</template>
<script>
  import Box from '../../components/Box';
  export default {
    name:'workerEdit',
    components:{Box},
    data(){
      return{
        imgUrl:this.$config.config_imgUrl(),
        isFirstSelect:true,
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
          teamid:'',
          labor:'',
          position:'',
          status:'',
          time:'',
          endTime:'',
          icon:'',
          registerjobtypeid:''
        },
        positionList:[],
        workTypeList:[],
        teamidList:[],
        statusList:[
          {
            id: 3200,
            label: "在场"
          }, {
            id: 3201,
            label: "离场"
          }
        ],
        sexList:[],
        "zyt_tokenID":this.getCookie("lab_session"),
        zyt_userId:this.getCookie('lab_userID'),
        defaultRole:0
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
          _t.defaultRole = _t.form.teamid;
          _t.$api.post("/labor/master/seeWorkType",{
            tokenID:_t.zyt_tokenID,
            userId:_t.zyt_userId,
          },function(res2){
            let isHas = false;
            for (let i = 0;i<res2.body.length;i++){
              if(res2.body[i].pcode === res.body.registerjobtypeid){
                isHas = true;
                break;
              }
            }
            if(isHas){
              _t.form.registerjobtypeid = res.body.registerjobtypeid;
            }else{
              _t.form.workTypeid = res.body.workTypeid;
            }
            _t.setWorkType();
            _t.workTypeList=res2.body;
          },function(e){

          })

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

        this.$api.post("/dictionary/read",{
          id:200600
        },function(res){
          _t.positionList=res.body
        },function(e){

        })
      },
      setWorkType(){
        if(this.form.jobtype){
          this.form.workType=this.form.workTypeid;
        }else{
          let key = ''
          if(this.form.registerjobtypeid){
            key = this.form.registerjobtypeid;
          }else{
            for (let index in this.workTypeList){
              let _d = this.workTypeList[index];

              if(_d.pname === '普工'){
                key=_d.pcode;
              }
            }

          }
          if(!key){
            let rand =Math.floor(5*Math.random());
            key = this.workTypeList[rand].pcode;
          }
          this.form.workType=key;
        }
      },
      goback(){
        this.$router.back();
      },

      teamId(val){
        const _t = this;
        this.$api.post("/labor/master/seeWorkType",{
          tokenID:this.zyt_tokenID,
          userId:this.zyt_userId,
        },function(res){
          _t.workTypeList=res.body;
          _t.$api.post("/labor/master/defaultJobtype",{
            tokenID:_t.zyt_tokenID,
            userId:_t.zyt_userId,
          },function(res){
            if(res.body && res.body.length > 0){
              let _id = '';
              if(_t.form.registerjobtypeid){
                for (let i = 0 ;i<res.body.length;i++){
                  if(res.body[i].id === _t.form.registerjobtypeid){
                    _id = res.body[i].id;
                    break;
                  }
                }
              }

              if(!_t.isFirstSelect){
                _t.form.jobtype = '';
              }else{
                var isHasDefault = false;
                for(var i = 0 ; i< res.body.length;i++){
                  if(res.body[i]['id']===_t.form.workTypeid){
                    isHasDefault = true;
                    break;
                  }
                }
                _t.isFirstSelect = false;
                if(isHasDefault){
                  _id = _t.form.workTypeid;
                }else{
                  _id = ''
                }
              }
              if(!_id){
                for (let i = 0 ;i<res.body.length;i++){
                  if(res.body[i].jobtype === '普工'){
                    _id = res.body[i].id;
                    //break;
                  }
                }
              }
              if(!_id){
                _id = res.body[0].id;
              }
              _t.form.jobtype = _id;
              _t.setWorkType();
            }
          },function(e){
          })

        },function(e){

        })

        if(val !== this.defaultRole){
          this.form.position = 200602
        }
      },
      Keepedit(data){
        var _t=this;
        this.$api.post("/labor/master/updateWorkerInfo",{
          tokenID:this.zyt_tokenID,
          userId:this.zyt_userId,
          workId:this.$route.params.id,
          workType:this.form.workType,
          position:this.form.position,
          status:this.form.status,
        },function(res){
          _t.$store.commit("setLoading",false);
          _t.$message({
            type:"success",
            message:"修改成功!"
          });
          _t.$router.push({name:"workermanage"})
        },function(e){

          if(e.errorcode=="LABOR_LEADER_EXIST"){
            _t.$message({
              type:"success",
              message:"每个劳务队仅可有一名劳务队长!"
            });
          }
        });
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
        return str.replace(r,"$1$2$3");
      }
    },
    computed:{
      time(){
        return this.format(this.form.time);
      },
      endTime(){
        return this.format(this.form.endTime);
      }
      ,
      IDCard(){
        return this.formatCard(this.form.IDCard);
      },

    },
    mounted(){
      this.getData();
    },
    created(){
      //this.getData();

    }


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
  .el-form-item{display:inline-block;margin-bottom:23px;}
  /*.itemImg{position: fixed;top:150px;right:20%;}*/
</style>
<style>
  .el-message{height:40px;background:#66666c;border-radius: 10px;top:43%;left:53%;padding:10px 8px;min-width:auto;text-align: center;}
  .el-message img.el-message__img{width:0;height:0;display:block;}
  .el-message__group p{color:#fff;font-size:14px;font-family:'Microsoft YaHei';text-align: center;margin:0 auto;}
  .el-message__group{text-align: center;margin:0;padding:8px 16px;}
  .workEditPage .WorkerManagement .el-dialog, .el-message-box{
    width: 400px;}
  .workEditPage .fixedScope{position: absolute;left:3%;}
  .workEditPage .widthScope{
    position: relative;display: inline-block;}
  .workEditPage .box-wrap{text-align:center;}
  .workEditPage .el-form--inline .el-form-item, .el-form--inline .el-form-item__content{vertical-align: middle;}
  .workEditPage .leftscopeminitext{text-align:left;}
  .el-form--inline .el-form-item{margin-right:18px;}
  .workEditPage .box-wrap{min-height:95%;}

</style>
