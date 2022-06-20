<template>
<!--修改密码-->
<Box class="updatePwd">
    <div class="repwd">
      <div class="topHeight"></div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" >
            <el-form-item label="现密码" prop="pwd">
                <el-input v-model="ruleForm.pwd" type="password"></el-input>
            </el-form-item>
                <el-form-item label="新密码" prop="newpwd">
                <el-input v-model="ruleForm.newpwd"  type="password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')" :disabled="isSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</Box>
</template>
<script>
import md5 from 'js-md5';
import Box from '../../components/Box';
  export default {
      name:'updatepwd',
      components:{Box},
    data() {
        var checkPass = (rule, value, callback) => {
            if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(value)) {
                callback(new Error('请输入6-20位数字字母组合'));
            }else {
            callback();
            }
        };
        var checkPass1 = (rule, value, callback) => {
            var _t=this;
            let values=value.toLowerCase();
            this.post(values,values,function(res){
                callback();
            },function(e){
                switch(e.errorcode){
                    case "TOKEN_NOT_EXIST":
                        _t.$alert('用户登录超时，请重新登录', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning',
                            callback: action => {
                                _t.delCookie('lab_session');
                                _t.delCookie('lab_userID');
                                _t.$router.replace({ path: '/login' });
                            }
                        });

                    break;
                    case "PASSWORD_ERROR":
                        callback(new Error('现密码不正确'));
                    default:

                    break;
                }

            })
        };
      return {
        isSubmit:false,
        ruleForm: {
          pwd: '',
          newpwd: '',
        },
        rules: {
          pwd: [
            { required: true, message: '请输入现密码', trigger: 'blur' },
            { validator:checkPass1, message: '现密码不正确', trigger: 'blur' },
          ],
          newpwd:[
              { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 20, message: '请输入6-20位数字字母组合', trigger: 'blur' },
            {validator:checkPass,message:'请输入6-20位数字字母组合',trigger: 'blur'}
          ]
        },
        tokenID:this.getCookie("lab_session"),
        userId:this.getCookie("lab_userID")

      };
    },
    methods: {
      submitForm(formName) {
          this.isSubmit=true;
          var _t=this;

            this.$refs[formName].validate((valid) => {
            if (valid) {
                let oldpwd=this.ruleForm.pwd.toLowerCase();
                let newpwd=this.ruleForm.newpwd.toLowerCase();
                this.post(oldpwd,newpwd,function(res){
                    _t.$alert('密码修改成功', '提示', {
                        confirmButtonText: '确定',
                        type:'success',
                        callback: action => {
                           _t.$router.push({ path: '/manage/info' });
                        }
                    });
            },function(e){
                switch(e.errorcode){
                    case "TOKEN_NOT_EXIST":
                        _t.$alert('用户登录超时，请重新登录', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning',
                            callback: action => {
                                _t.delCookie('lab_session');
                                _t.delCookie('lab_userID');
                                _t.$router.replace({ path: '/login' });
                            }
                        });

                    break;
                    case "PASSWORD_ERROR":
                        callback(new Error('现密码不正确'));
                    default:

                    break;
                }

            })
            } else {
                _t.isSubmit=false;
                    new Error('请检查输入')

                return false;
            }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      post(oldpwd,newpwd,success,fail){
          let token=this.getCookie('lab_session');
		  let userId=this.getCookie('lab_userID');
          this.$api.post('/labor/user/updatePassword',
                {
                    tokenID:this.tokenID,
                    userId:this.userId,
                    oldPassword:md5( oldpwd ).toUpperCase(),
                    newPassword:md5( newpwd ).toUpperCase()
                },function(res){
                    if(success){
                        success(res);
                    }

                },function(e){
                    if(fail){
                        fail(e);
                    }
                });
      },
      created(){

      }
    }
  }
</script>
<style scoped>
.repwd {
    max-width: 460px;
}

.asterisk {
    font-size: 16px;
    color: #f00;
    padding: 0 4px;
    line-height: 20px;
}

.form-control {
    height: 40px;
    border-radius: 5px;
    box-shadow: none;
}
</style>
<style >
    .updatePwd .el-input__inner:focus{
        border-color:#f90;
    }
  .updatePwd .box-wrap{min-height:95%;}
</style>
