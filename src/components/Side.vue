<template>
  <div class="app-side">
        <el-menu :default-active="current" :router="true" :unique-opened="true">
          <el-submenu v-for="(item,index) in data" :index="item.id" :key="index" >
            <template slot="title"><i class="icon-top"></i>{{item.label}}</template>
              <el-menu-item v-for="(i,index2) in item.children" :key="index2" :index="i.router"><i class="icon-item"></i>{{i.label}}</el-menu-item>
          </el-submenu>
        </el-menu>
  </div>
</template>
<script>
export default {
  name: 'app-side',
    data() {
      return {
        data: [{
          id:'1',
            label: '工人管理',
            children: [{
              id:'1-1',
              label: '工人管理',
              router:'/manage/workermanage'
            }]
        },
          {
            id:"2",
            label:"工人生活费充值",
            children:[{
              id:"2-1",
              label:"工人生活费充值",
              router:"/manage/money"
            },{
              id:"2-2",
              label:"生活费充值记录",
              router:"/manage/WorkerRechacode"
            }]
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    methods: {

    },
    computed:{
      current(){
        var arr=this.$route.path.split('/');
        if(arr.length>3){
          arr.pop();
          return arr.join("/");
        }else{
          return this.$route.path
        }
      }
    },
    created(){
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .change_color .el-select .el-input__inner{
    color:#ff9000;
  }

  .app-side{
    font-family: "Microsoft YaHei";
    width:200px;
    background-color:#282623;
    position:absolute;
    left:0;
    top:50px;
    bottom:0;
    overflow:auto;
    z-index: 2;
    /*border-right:3px solid #f3f5f6;*/
  }
  .el-submenu__title{
    font-size:16px;
  }
  .el-menu,
  .el-submenu .el-menu{
    background:#282623;
  }
  .el-menu-item, .el-submenu__title{
    color:#ffffff;
  }
  .el-submenu__title:hover {
    /*background:url(../assets/img/sidebac.png) no-repeat center;*/
    background-color: #171614;
    color:#fff;
  }

  .el-submenu .el-menu-item:hover{
    /*background: url(../assets/img/sidebacer.png) no-repeat center;*/
    background-color: #171614;
    /*color:#fff;*/
  }
  .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active, .el-menu-item.is-active{

    color:#fc9b0e;
  }
  .app-side .el-menu li.is-active .el-submenu__title{
    background: url(../assets/img/sidebac.png) no-repeat left;
  }
  /*.el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active .el-submenu__title{*/
  /*background: url(../assets/img/sidebac.png) no-repeat center;*/
  /*}*/
  .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active i.icon-item, .el-menu-item.is-active i.icon-item{
    background: url(../assets/img/icon2-hover.png)no-repeat center;
  }
  .icon-top{
    display:inline-block;
    vertical-align:middle;
    margin-right:13px;
    margin-top:-1px;
    width:17px;
    height:17px;
    border:none;
    background:url(../assets/img/icon-2.png) no-repeat center;

    /*background:url(../assets/img/icon-2-cur.png) no-repeat left center;*/
    -ms-transform:none;
    transform:none;
  }
  .icon-item{
    display:inline-block;
    vertical-align:middle;
    margin-top:-1px;
    margin-right:5px;
    width:10px;
    height:10px;
    background:url(../assets/img/icon-3.png) no-repeat center;
  }
  /*.el-submenu__title:hover .icon-top{*/
  /*background-image:url(../assets/img/icon1-hover.png);*/
  /*}*/
  .icon-item:hover,.icon-item:active{
    background: url(../assets/img/icon2-hover.png)no-repeat center;
  }
  .el-submenu .el-menu-item:hover i.icon-item, .el-submenu__title:hover i.icon-item{
    /*background: url(../assets/img/icon2-hover.png)no-repeat center;*/
  }
  /*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
  .app-side::-webkit-scrollbar{
    width: 6px;
    height: 6px;
    background-color: #f5f5f5;
  }
  /*定义滚动条的轨道，内阴影及圆角*/
  .app-side::-webkit-scrollbar-track{
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    border-radius: 5px;
    background-color: #f5f5f5;
  }
  /*定义滑块，内阴影及圆角*/
  .app-side::-webkit-scrollbar-thumb{
    /*width: 10px;*/
    height: 20px;
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #555;
  }
  .el-submenu .el-menu-item{
    height:35px;
    line-height:35px;
  }
  .el-submenu__title{
    height:50px;
    line-height:50px;
  }
  .app-side .el-submenu__icon-arrow[class^="el-icon-"], .app-side .el-icon-arrow-down[class*=" el-icon-"]{
    display:none;
  }
  .app-side .el-icon-arrow-down[class^="el-icon-"], .app-side .el-icon-arrow-down[class*=" el-icon-"]{
    display:none;
  }
</style>

