<template>
	<!--登录-->
  	<div id="LoginBox" class="wrap">
		  <div class="login-content">
			<div class="login-box">
					<div class="errortips" v-show="resultError">
						<span v-text="resulttip"></span>
					</div>
          <p><img src="../assets/img/loginIcon.png" alt=""></p>
					<p class="welcome">诸英台劳务分包管理平台</p>
					<form autocomplete="off">
						<input style="visibility: hidden;display: none;" type="text" name="user" class="input user" v-model="username" >
						<input style="visibility: hidden;display: none;" type="password" name="pwd" class="input pass" v-model="password" >
						<div autocomplete="off" class="input-num" :class="{'error':resultError}">
							<input autocomplete="off" type="text" class="input user" name="user" v-model='username' placeholder="用户名" @focus="focus()" />
							<img v-if='username.length>0' class='del' @click='delText(1)' src='../assets/img/del.png' />
						</div>
						<div autocomplete="off" class="input-num">
							<input autocomplete="off" type="password" name="pwd" class="input pass" v-model='password' placeholder="密码" @input="keyPressDown" @keypress="DownPress"/>
              <img src="../assets/dressDown.png" alt="" class="capsLook" v-if="capsLook">
							<img  v-if='password.length>0' class='del'  @click='delText(2)'  src='../assets/img/del.png' />
						</div>
						<div class="login-btn">
							<button class="login-button" type="submit" @click="loign($event)" :disabled="isLogining"><span>登&nbsp;录</span></button>
						</div>
					</form>

				</div>
		</div>
      <!--断网提示-->
      <div id="BrokenNetwork1">
        <div class="BrokenNetwork">
          <p style="color: #fff;font-size: 14px;">加载失败，请重新加载</p>
          <button @click="BrokenNetworkReload" class="BrokenNetworkBtn">重新加载</button>
        </div>
      </div>
    </div>
</template>

<script>
import md5 from 'js-md5';
import { MessageBox } from 'element-ui';
export default {
  name: 'login',
  data () {
    return {
      isLogining:false,
	    username:'',
	    lastUsername:'',
	    password:'',
	    resultError:false,
	    resulttip:'',
	    errorCount:this.getCookie('error')||0,
      zyt_tokenID:this.getCookie('lab_session'),
      zyt_userId:this.getCookie('lab_userId'),
      capsLook:false
    }

  },
  created(){

	},
	methods:{
    BrokenNetworkReload(){
      window.location.reload();
    },
    keyPressDown(e){
        if(!e.target.value){
          this.capsLook = false
        }
    },
    DownPress(e){
      var e = event||window.event;var o = e.target||e.srcElement;var keyCode  =  e.keyCode||e.which;var isShift  =  e.shiftKey ||(keyCode  ==   16 ) || false ;
      if (((keyCode >=   65   &&  keyCode  <=   90)  &&   !isShift) || ((keyCode >=   97   &&  keyCode  <=   122 )  &&  isShift)){
        this.capsLook = true;
      }else{
        this.capsLook = false;
      }
    },
		focus(){
			this.resultError=false;
		},
		delText(type){
			if(type==1){
				this.username='';
			}else{
				this.password='';
			}
			this.capsLook = false
		},
		loign(event){
			event.preventDefault();
			if(this.lastUsername!==''&&this.lastUsername!==this.username){
				this.resulttip='请输入用户名或密码';
				this.errorCount=0;
				this.resultError=false;
				this.isLogining=false;
			}
			if(this.errorCount>=4){
				this.resulttip='密码输入错误超过5次，账户被锁定';
				this.resultError=true;
				this.lastUsername=this.username;
				return;
			}

			if(this.username!==''&&this.password!==''){
				this.resultError=false;
				this.toLogin();
			}else{
				this.resulttip='请输入用户名或密码';
				this.resultError=true;
			}
		},
		toLogin(){
			this.isLogining=true;
			let u=this.username;
			let p= md5( this.password ).toUpperCase();
			let _t=this;
			this.$api.post('labor/user/login',{userName:u,password:p},function(res){
				_t.setCookie('lab_session',res.body.tokenID);
				_t.zyt_tokenID = res.body.tokenID;
				_t.zyt_userId = res.body.userId;
				_t.setCookie('lab_userID',res.body.userId);
						_t.$router.push({ path: '/manage/workermanage' });

			},function(e){
				_t.isLogining=false;
				switch(e.errorcode){
					case "USER_NOT_EXIST":
						_t.resulttip='用户名或密码不正确，请重新输入';
						_t.resultError=true;
						_t.username='';
						_t.password='';
					break;
					case "PASSWORD_ERROR":
						_t.errorCount=parseInt(e.body.num);
						_t.setCookie('error',e.body.num,1);
						_t.resulttip='密码不正确，请重新输入';
						_t.resultError=true;
						_t.password='';
					break;
					case "PASSWORD_ERROR_LOCK":
						_t.resulttip='密码输入错误超过5次，账户被锁定';
						_t.resultError=true;
						_t.password='';
					break;
					default:
						_t.resulttip='密码不正确，请重新输入';
						_t.resultError=true;
						_t.password='';
					break;
				}

			})
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .w1180{
        min-width: 0;
    }
    .com-header{
        position: fixed;
        width: 100%;
        left: 0;
        top: 0;
    }

    #LoginBox {
      position: relative;
    }

    #BrokenNetwork1 {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 11;
      background-color: rgba(0,0,0,0.8);
      display: none;
    }


    .BrokenNetwork {
      width: 147px;
      height: 140px;
      margin: 0 auto;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      text-align: center;
    }

    .BrokenNetwork img {
      width: 100%;
      height: 84px;
    }

    .BrokenNetwork .BrokenNetworkBtn {
      width: 80px;
      height: 35px;
      border-radius: 5px;
      background-color: #fb8125;
      color: #fff;
      font-size: 14px;
      border: none;
      outline: none;
      margin-top: 20px;
    }

    .login-content{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: url(../assets/img/login-bg.jpg) no-repeat center center;
        background-size: cover;
        padding-top: 40px;
    }
    .login-box{
      width: 350px;
      background: #fff;
      border-radius: 3px;
      height: 360px;
      text-align: center;
      padding: 33px 25px 50px;
      position:fixed;
      left:50%;
      top:50%;
      margin-left:-175px;
      margin-top:-180px;
      background: url(../assets/img/login-cont.png) no-repeat center center;
    }
    .login-t{
      font-size: 22px;
      color: #3e4956;
      line-height: 1;
    }
    .login-box p.welcome{
      color: #333;
      font-size: 16px;
      text-align:center;
      margin:15px 0 30px;
    }
    .input-num{
      width: 100%;
      position: relative;
      margin-bottom: 30px;
      text-align: left;
    }
    .del{
      position:absolute;
      right:12px;
      top:11px;
      cursor:pointer;
      z-index:10;
    }
    .input-num.login-margin{
      margin-bottom: 20px;
    }

    .input-num input{
      width: 100%;
      border: 1px solid #837b75;
      height: 40px;
      box-sizing: border-box;
      position: relative;
      z-index: 4;
      font-size: 14px;
      padding:8px 0 8px 44px;
      color:#333;
    }
    .input-num .user{
      background:url('../assets/img/user.png') no-repeat 12px 8px transparent;
    }
    .input-num .pass{
      background:url('../assets/img/password.png') no-repeat 12px 8px transparent;
    }
    .input-num input::-webkit-input-placeholder {
        color:#999;
    }
    .input-num input:-moz-placeholder {
        color:#333;
    }
    .login-btn{
      margin-top:30px;
    }
    .input-num input:focus{
      border:1px solid #f90;
    }

    .input-num.error .input{
      border: 1px solid #f00;
    }
    .input-num.show .input{
      border: 1px solid #f00;
    }
    .errortips{
      color: #ff5c5c;
      width: 100%;
      text-align: left;
      padding-left: 38px;
      position: absolute;
      top: 170px;
      left: 0;
    }
    .show{
      display: block;
    }

    .login-button{
      display:block;
      width: 100%;
      height: 40px;
      line-height: 40px;
      box-sizing: border-box;
      background: #ff9000;
      border: none;
      outline: none;
      padding: 0;
      border-radius:5px;
      color: #fff;
      font-size: 16px;
      margin-bottom:15px;
    }
    .login-button[disabled]{
      pointer-events:none;
      opacity:0.3;
    }
    .login-button:hover{
      background: #feb454;
    }
    .login-button:active{
      background: #f67a00;
    }
      .capsLook{
        position: absolute;
        right:13%;
        top:33%;
        cursor:pointer;
        z-index:10;
      }

</style>
