<template>
    <Box class="Information">
        <div class="user-info">
            <table class="user">
                <tr>
                    <td class="text-right">劳务队名称：</td>
                    <td>{{options.laborName  }}</td>
                </tr>
                <tr>
                    <td class="text-right">所在项目：</td>
                    <td>{{options.projectName }}</td>
                </tr>
                <tr>
                    <td class="text-right">项目总包：</td>
                    <td>{{options.contractor }}</td>
                </tr>
                <tr>
                    <td class="text-right">用户名：</td>
                    <td>{{options.userName }}</td>
                </tr>
                <tr>
                    <td class="text-right">登录密码：</td>
                  <td>{{!pwdstatus?'已设置':'未设置'}}
                    <router-link to="/manage/info/updatepwd" class="change-pwd">修改</router-link>
                  </td>
                </tr>
            </table>
        </div>
    </Box>
</template>
<script>
  import {formatDate} from '../../assets/js/date.js';
  import Box from '../../components/Box';
    export default {
        name:'infoNe',
        components:{Box},
        data(){
            return{
              projectInfo:{},
              pwdstatus:'',
              'zyt_tokenID': this.getCookie("lab_session"),
              zyt_userId: this.getCookie('lab_userID'),
              options:{
                contractor:'',
                laborName:'',
                projectName:'',
                userName:''
              }
            }
        },

        created(){
            this.$store.commit("setLoading",false);
          var _t = this;
            this.$api.post("/labor/user/info",{
              tokenID:this.zyt_tokenID,
              userId:this.zyt_userId
            },function(res){
              _t.options = res.body
            },function(e){
            })
        },
        mounted(){
        }
    }
</script>
<style scoped>
.user {
    border-collapse: collapse;
}

.user td {
    padding: 0;
    font-size: 14px;
    color: #333;
    height: 48px;
}

.user td:last-child {
    padding-left: 10px;
}

.change-pwd {
    color: #fd8125;
    text-decoration: none;
    margin-left: 10px;
}

.change-pwd:hover {
    text-decoration: underline;
}

</style>
<style>
  .Information .box-wrap{
    min-height: 95%;
  }
</style>
