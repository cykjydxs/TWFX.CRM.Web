<template>
  <div>
  <el-form :model="loginData" :rules="loginRules" ref="loginData" label-position="left" label-width="0px" class="login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="checkName" style="margin-bottom:28px;">
      <el-input type="text" v-model="loginData.checkName" auto-complete="off" placeholder="账号" clearable >
        <template slot="prepend"><i class="fa fa-user-circle-o" aria-hidden="true"></i></template>
      </el-input>
    </el-form-item>
    <el-form-item prop="checkPass" style="margin-bottom:28px;">
      <el-input type="password" v-model="loginData.checkPass" auto-complete="off" placeholder="密码" @keyup.enter.native="handleSubmit" clearable>
        <template slot="prepend"><i class="fa fa-key" aria-hidden="true"></i></template>
      </el-input>
    </el-form-item>
    <!--<el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="isLogin" >登录</el-button>
      <!--<el-button @click="handleReset('loginData')">重置</el-button>-->
    </el-form-item>
  </el-form>
    <div style="text-align: center; margin:10px 0px; font-size: 12px;">2018 © 天仙仓储管理系统-V1.0</div>
  </div>
</template>

<script>

    export default {
      data() {
        return {
          isLogin: false,
          loginData: {
            checkName: '',
            checkPass: ''
          },
          loginRules: {
            checkName: [
              { required: true, message: '请输入账号', trigger: 'blur' },
            ],
            checkPass: [
              { required: true, message: '请输入密码', trigger: 'blur' },
            ]
          },
          checked: true
        };
      },
      methods:{
        handleReset(formName){
          this.$refs[formName].resetFields();
        },
        handleSubmit(){
          let _this = this;
          this.$refs.loginData.validate((valid) => {
            if (valid) {
              _this.isLogin = true;
              let loginParms={"parms":{'checkName':this.loginData.checkName,'checkPwd':this.loginData.checkPass}};
              _this.$httpGet('Login/UserLogin',loginParms).then((res)=> {
                if (res.loginStatus) {
                  //登录信息
                  let mInfoSplit = res.mInfo.split(',');
                  let user = {
                    checkName: _this.loginData.checkName,
                    employeeName: decodeURIComponent(mInfoSplit[3]),
                    employeeImg: mInfoSplit[4],
                    mKey: res.mKey,
                    mInfo: res.mInfo,
                  };
                  //菜单信息
                  let menuList = res.menuList;
                  if (_this.$router.options.routes.length <= 1) {
                    //路由菜单
                    let twfxMenu = [];
                    //一级菜单
                    let menuOneList = _this.Enumerable.from(menuList).where(p => p.PARENTMENUID == null || p.PARENTMENUID == 0).orderBy(o => o.MENUSORT).toArray();
                    //二级菜单
                    let menuTwoList = _this.Enumerable.from(menuList).where(p => p.PARENTMENUID != null && p.PARENTMENUID != 0).toArray();
                    //循环
                    for (let i = 0; i < menuOneList.length; i++) {
                      let curMenu = menuOneList[i];
                      //二级菜单
                      let child = [];
                      let curTowList = _this.Enumerable.from(menuTwoList).where(p => p.PARENTMENUID == curMenu.MENUID).orderBy(o => o.MENUSORT).toArray();
                      for (let ch = 0; ch < curTowList.length; ch++) {
                        let curMenuChild = curTowList[ch];
                        let childMenu = {
                          path: curMenuChild.MENUURL,
                          name: curMenuChild.MENUNAME,
                          iconCls: curMenuChild.MENUICON,
                          hidden: curMenuChild.MENUHIDDEN == 'Y' ? true : false,
                          component: _this.$VueList[curMenuChild.COMPONENT],
                          meta: {},
                        };
                        child.push(childMenu);
                      }
                      let menu = {
                        path: curMenu.MENUURL,
                        name: curMenu.MENUNAME,
                        iconCls: curMenu.MENUICON,
                        hidden: curMenu.MENUHIDDEN == 'Y' ? true : false,
                        component: resolve => require(['@/components/MasterPage.vue'], resolve),
                        children: child,
                      };
                      twfxMenu.push(menu);
                    }
                    let menu404 = {
                      path: '*',
                      hidden: true,
                      redirect: '/Error',
                    };
                    twfxMenu.push(menu404);
                    _this.$router.addRoutes(twfxMenu);
                    // this.$router不是响应式的，所以手动将路由元注入路由对象
                    for (let i = 0; i < twfxMenu.length; i++) {
                      _this.$router.options.routes.push(twfxMenu[i]);
                    }
                  }
                  let existMenu = sessionStorage.getItem('twfxmenu');
                  if (existMenu != null)
                    sessionStorage.removeItem('twfxmenu');
                  let existUser = sessionStorage.getItem('twfxuser');
                  if (existUser != null)
                    sessionStorage.removeItem('twfxuser');
                  sessionStorage.setItem('twfxmenu', JSON.stringify(menuList));
                  sessionStorage.setItem('twfxuser', JSON.stringify(user));
                  //记住用户名
                  let existLg = localStorage.getItem('loginName');
                  if (existLg != null)
                    localStorage.removeItem('loginName');
                  localStorage.setItem('loginName', _this.loginData.checkName);
                  _this.$router.push({path: '/Home'});
                }
                else {
                  if (res.loginMessage != 'undefined' && res.loginMessage != null
                    && res.loginMessage != '')
                    _this.$message.error('系统授权已到期！');
                  else
                    _this.$message.error('用户名或密码错误！');
                  _this.isLogin = false;
                }
              }) .catch(function (error) {
                _this.$message.error('用户名或密码错误！');
                _this.isLogin = false;
              });
            }
            else
              return false;
          });
        },
      },
      mounted() {
        let existLg = localStorage.getItem('loginName');
        if (existLg) {
          this.loginData.checkName=existLg;
        }
      }
    }
</script>

<style scoped>
  @import '../style/font-awesome/css/font-awesome.css';
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto 0px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .title {
    margin: 0px auto 28px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 28px 0px;
  }

</style>

