<template>
  <div class="header">
    <div class="user">
        <span class="link" @click="toInfo">
          <img src="../assets/img/ren-4.png" class="avatar">
          您好,<em v-cloak>{{options.userName}}</em>
        </span>
      <a href="javascript:;" @click="loginOut()" class="login-out">退出</a>
    </div>
    <img src="../assets/img/logo.png" class="logo">
    <div class="project-name" v-cloak>{{options.projectName }}-{{options.laborName }} 劳务分包管理平台</div>
    <div class="project-number" v-cloak></div>
  </div>
</template>

<script>
  export default {
    name: 'app-header',
    data () {
      return {
        zyt_tokenID:this.getCookie("lab_session"),
        zyt_userId:this.getCookie("lab_userID"),
        options:{
          projectName:'',
          laborName:'',
          userName:'',
          contractor:''
        }

      }
    },
    created(){
      var _t = this;
      _t.$api.post("/labor/user/info",{
        tokenID:_t.zyt_tokenID,
        userId:_t.zyt_userId
      },function(res){
        _t.options = res.body
      },function(e){
      })
    },
    methods:{

      toInfo(){
        this.$router.push({ path: '/manage/info' });
      },
      loginOut(){
        let token=this.getCookie('lab_session');
        let userId=this.getCookie('lab_userID');
        let _t=this;
        this.$confirm('您确定要退出系统吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _t.$api.post('/labor/user/logout',{tokenID:this.zyt_tokenID,userId:this.zyt_userId},function(res){
            _t.delCookie('lab_session');
            _t.delCookie('lab_userID');
            _t.$router.replace({ path: '/login' });
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
              default:

                break;
            }
          });
        }).catch(() => {

        });
      }
    },
    computed:{
      proName(){
        return this.$store.state.projectInfo.projectName
      },
      proNumber(){
        return this.$store.state.projectInfo.projectId
      },
      username(){
        return this.$store.state.projectInfo.userName
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header{
    height:50px;
    background-color:#fff;
    box-sizing:border-box;
    padding:0 20px;
    line-height:50px;
    position:fixed;
    left:0;
    top:0;
    width:100%;
    z-index:2;
    box-shadow:0 1px 3px #e3e5e6;
    white-space: nowrap;
  }
  .logo{
    margin:0;
    vertical-align:middle;
    border:none;
  }
  .theadTitle{
    color:#333;
    font-weight: bold;
  }
  .project-name{
    font-size:16px;
    color:#1e1c1c;
    /* font-weight:bold; */
    font-family: "Microsoft YaHei";
    display:inline-block;
    vertical-align:middle;
    margin-left:65px;
    *display:inline;
    *zoom:1;
  }
  .project-number{
    font-size:12px;
    color:#666;
    display:inline-block;
    vertical-align:middle;
    line-height:50px;
    font-family: "Microsoft YaHei";
    height:50px;
    margin-left:20px;
    *display:inline;
    *zoom:1;
  }
  .link{
    cursor: pointer;
  }
  .user{
    float:right;
    font-size:14px;
    color:#333;
  }
  .avatar{
    vertical-align:middle;
    border:none;
  }
  .user em{
    font-style:normal;
    margin-left:10px;
  }
  .login-out{
    color:#333;
    margin-left:20px;
    text-decoration:none;
  }
  .login-out:hover{
    color:#fd8125;
  }
</style>
