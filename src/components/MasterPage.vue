<template>

  <el-row class="container">
    <el-col :span="24" class="header" :style="this.Global.pageTopStyle">
      <el-col :span="4" class="logo" :class="isCollapse?'logo-collapse-width':'logo-width'">
        <div @click.prevent="f_HomePage">
          <div v-if="isCollapse">
            <!--<i class="fa fa-align-justify"></i>-->
          </div>
          <div v-else>
            {{sysName}}
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="tools" @click.prevent="collapse" style="float: left;">
          <i class="fa fa-align-justify" :title="isCollapse?'展开':'折叠'"></i>
        </div>
        <div  style="float: right;">
          <div style="float: left; cursor: pointer;">
            <span style="color: white;"><i class="fa fa-bell-o fa-lg" aria-hidden="true"></i></span>
            <el-badge is-dot style="margin-left: -8px; margin-top:-3px;"/>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner" style="margin-right: 10px;">
              <img :src="employeeImg" />
              欢迎您：{{employeeName}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="f_UpPwd">
              <i class="fa fa-key" aria-hidden="true"></i>&nbsp;&nbsp;修改密码
            </el-dropdown-item>
            <el-dropdown-item @click.native="f_Set">
              <i class="fa fa-cog" aria-hidden="true"></i>&nbsp;&nbsp;个人信息
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              <span style="color: #E6A23C;"><i class="fa fa-sign-out" aria-hidden="true"></i></span>&nbsp;&nbsp;退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>

    <el-col :span="24" class="main">
      <aside :class="isCollapse?'menu-collapsed':'menu-expanded'">
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" @select="handleSelect"
                 unique-opened router collapse-transition
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                  :collapse="isCollapse" style="overflow-y: auto;">
          <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
            <el-submenu :index="index+''" v-if="!item.leaf">
              <template slot="title">
                <div style="line-height: 56px;">
                  <i :class="item.iconCls" style="font-size: 18px; width: 18px; margin-top:19px;"></i>
                  <span slot="title" style="font-size: 14px;  vertical-align:top">{{item.name}}</span>
                </div>
              </template>
              <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">
                  <i :class="child.iconCls" style="width: 14px;"></i>
                  <span slot="title" style="vertical-align:top;font-size: 13px;">{{child.name}}</span>
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </aside>

      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="breadcrumb-container">
            <strong class="title"><i class="el-icon-location"></i>&nbsp;{{$route.name}}</strong>
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <!--<el-card class="box-card">-->
              <transition name="fade" mode="out-in">
                <router-view></router-view>
              </transition>
            <!--</el-card>-->
          </el-col>
        </div>
      </section>
    </el-col>


    <!--修改密码-->
    <el-dialog :title="editTitle"  :visible.sync="editFormVisible"  width="40%"  :close-on-click-modal="false">
      <div slot="title" style="font-size: 14px; font-weight: bold; color: #606266;" >
        <i class="fa fa-th-large" aria-hidden="true" style="margin-right: 10px;"></i>{{editTitle}}
      </div>
      <el-card class="box-card" style="margin:-10px 0px -25px 0px; border:#DCDFE6 1px solid; ">
      <el-form :model="editForm" label-width="140px" :rules="editFormRules" ref="editForm" border>
        <el-form-item label="原密码" prop="Oldpwd" :inline-message="true">
          <el-col :span="12">
            <el-input type="password" v-model="editForm.Oldpwd" placeholder="请输入原密码" maxlength="30" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="新密码" prop="Newpwd" :inline-message="true">
          <el-col :span="12">
            <el-input type="password" v-model="editForm.Newpwd" placeholder="请输入新密码" maxlength="30" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="确认密码" prop="Checkpass" :inline-message="true">
          <el-col :span="12">
            <el-input type="password" v-model="editForm.Checkpass" placeholder="请输入确认密码" maxlength="30" clearable></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      </el-card>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click.native="f_EditSubmit" :loading="editLoading" size="medium">保存</el-button>
        <el-button @click.native="f_EditClose" size="medium">取消</el-button>
      </div>
    </el-dialog>


    <!--头像设置-->
    <el-dialog  :visible.sync="editFormInfoVisible"  width="50%"  :close-on-click-modal="false">
      <div slot="title" style="font-size: 14px; font-weight: bold; color: #606266;" >
        <i class="fa fa-th-large" aria-hidden="true" style="margin-right: 10px;"></i>个人信息
      </div>
      <el-card class="box-card" style="margin:-10px 0px -25px 0px; border:#DCDFE6 1px solid; ">
        <el-form :model="editInfoForm" label-width="140px" :rules="editInfoFormRules" ref="editInfoForm" border>
          <el-form-item label="真实姓名" prop="Usertruename" :inline-message="true">
            <el-col :span="10">
              <el-input v-model="editInfoForm.Usertruename"  maxlength="30"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="头像上传" style="margin-top: 30px;" title="点击上传图片" prop="Userimg" :inline-message="true">
            <el-col :span="16">
              <el-upload
                class="avatar-uploader"
                action="User/UploadImg"
                :http-request="myUpload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="editInfoForm.Userimg" :src="editInfoForm.Userimg" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-col>
          </el-form-item>
        </el-form>
      </el-card>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click.native="f_EditInfoSubmit" :loading="editInfoLoading" size="medium">保存</el-button>
        <el-button @click.native="f_EditInfoClose" size="medium">取消</el-button>
      </div>
    </el-dialog>

  </el-row>
</template>

<script>

  export default {
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.editForm.Newpwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        sysName:'WMS系统',
        isCollapse:false,
        employeeName: '',
        employeeImg: require('../assets/logo.png'),
        menuList:[],

        //修改密码
        editFormVisible:false,
        editTitle:'修改密码',
        editForm:{
          Oldpwd:'',
          Newpwd:'',
          Newpwdtwo:''
        },
        editFormRules:{
          Oldpwd: [
            { required: true, message: '原密码不能为空', trigger: 'blur' },
          ],
          Newpwd: [
            { required: true, message: '新密码不能为空', trigger: 'blur' },
          ],
          Checkpass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        },
        editLoading:false,

        //设置
        editFormInfoVisible:false,
        editInfoForm:{
          Usertruename: '',
          Userimg: '',
        },
        imgPath: '',
        editInfoFormRules:{
          Usertruename: [
            { required: true, message: '真实姓名不能为空', trigger: 'blur' },
          ],
          Userimg: [
            { required: true, message: '头像不能为空', trigger: 'blur' },
          ],
        },
        editInfoLoading:false,
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      //折叠导航栏
      collapse:function(){
        this.isCollapse=!this.isCollapse;
      },
      handleOpen() {
      },
      handleClose() {
      },
      //页面跳转
      handleSelect: function (keyPath, key) {
        this.$router.push({path: keyPath});
      },
      //主页
      f_HomePage:function(){
        this.$router.push({path: '/Home'});
      },
      //修改密码
      f_UpPwd:function(){
        this.editFormVisible=true;
      },
      //修改密码提交事件
      f_EditSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.editLoading = true;
            let pars = {
              Oldpwd: this.editForm.Oldpwd,
              Newpwd: this.editForm.Newpwd,
            };
            this.$httpPost('User/SPwd', pars).then((res) => {
              if (res.success == 'ok') {
                this.editLoading = false;
                if (!res.addResult) {
                  this.$alert('原密码不正确，请重新输入！', '提示', {
                    confirmButtonText: '确定',
                    type: 'error',
                  });
                }
                else {
                  this.$confirm('密码修改成功,，请重新登录！', '提示', {
                    confirmButtonText: '确定',
                    type: 'success',
                    showCancelButton:false,
                  }).then(() => {
                    sessionStorage.removeItem('twfxuser');
                    sessionStorage.removeItem('twfxmenu');
                    location.reload();
                    this.$router.push('/Login');
                  }).catch(function (error) {
                    this.$message({
                      showClose: true,
                      message: '密码修改失败',
                      type: 'success'
                    });
                    this.editLoading = false;
                  });
                }
              }
              else {
                this.$message({
                  showClose: true,
                  message: '密码修改失败',
                  type: 'success'
                });
                this.editLoading = false;
              }
            }).catch(function (error) {
              this.$message.error('数据错误！');
              this.editLoading = false;
            });
          }
        });
      },
      //修改密码提交取消事件
      f_EditClose: function () {
        this.$refs['editForm'].resetFields();
        this.editFormVisible = false;
      },



      //设置
      f_Set:function(){
        this.editFormInfoVisible=true;
        this.$httpPost('User/GUserInfo',{}).then((res) => {
          if (res.success == 'ok') {
            this.editInfoForm.Usertruename = res.dtData[0].Usertruename;
            this.editInfoForm.Userimg = this.Global.webApiUrl + res.dtData[0].Userimg;
            this.imgPath = res.dtData[0].Userimg;
          }
        }).catch(function (error) {
          this.$message.error('数据错误！');
        });
      },
      //图片上传
      myUpload:function(content) {
        let config = {
          headers:{'Content-Type':'multipart/form-data'}
        };
        let pars = new FormData(); //创建form对象
        pars.append('file',content.file,);//通过append向form对象添加数据
        //param.append('chunk','0');//添加form表单中其他数据
        //console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
        let _this=this;
        this.$httpPostUp('User/UploadImg', pars,config).then((res) => {
          if (res.success == 'ok') {
            _this.editInfoForm.Userimg =_this.Global.webApiUrl +  res.fullPath;
            _this.imgPath = res.fullPath;
          }
          else if(res.success == 'errCode'){
            _this.$message.error('上传头像图片只能是JPG/JPEG/PNG/GIF格式!');
          }
          else {
            _this.$message.error('上传出错!');
          }
        }).catch(function (error) {
          _this.$message.error('上传出错!');
        });
      },
      //提交事件
      f_EditInfoSubmit:function () {
        let pars = {
          Usertruename: this.editInfoForm.Usertruename,
          Userimg: this.imgPath,
        };
        let _this=this;
        _this.$refs.editInfoForm.validate((valid) => {
          if (valid) {
            _this.editInfoLoading = true;
            _this.$httpPost('User/SUserInfo', pars).then((res) => {
              if (res.success == 'ok') {
                _this.$confirm('保存成功,，请重新登录！', '提示', {
                  confirmButtonText: '确定',
                  type: 'success',
                  showCancelButton: false,
                }).then(() => {
                  sessionStorage.removeItem('twfxuser');
                  sessionStorage.removeItem('twfxmenu');
                  location.reload();
                  _this.$router.push('/Login');
                }).catch(function (error) {
                  _this.$message({
                    showClose: true,
                    message: '保存失败',
                    type: 'success'
                  });
                  _this.editInfoLoading = false;
                });
              }
              else {
                _this.$message({
                  showClose: true,
                  message: '保存失败',
                  type: 'success'
                });
                _this.editInfoLoading = false;
              }
            }).catch(function (error) {
              _this.$message.error('数据错误！');
              _this.editInfoLoading = false;
            });
          }
        });
      },
      f_EditInfoClose:function() {
        this.editFormInfoVisible = false;
      },
      //图片上传
      handleAvatarSuccess(res, file) {
        console.log(res);
        console.log(file);
      },
      beforeAvatarUpload(file) {
        let isJPG = false;
        if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif')
          isJPG = true;
        let isLt2M = file.size / 1024 / 1024 < 5;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是JPG/JPEG/PNG/GIF格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
        }
        return isJPG && isLt2M;
      },


      //获取配置信息
      f_LoadConfig:function(){
        let _this=this;
        let parms = {};
        _this.$httpPost('ParamsSet/GParamsSetInfo', parms).then((res) => {
          if (res.success == 'ok') {
            if(res.paramsSet!=null&&res.paramsSet.length>0) {
              _this.sysName = res.paramsSet[0].Besysname;
            }
          }
          else {
          }
        }).catch(function (error) {
          _this.$message.error('获取数据出错！');
        });
      },

      //退出登录
      logout: function () {
        var _this = this;
        _this.$confirm('确认退出登录吗?', '提示', {type: 'warning'
        }).then(() => {
          sessionStorage.removeItem('twfxuser');
          sessionStorage.removeItem('twfxmenu');
          location.reload();
          _this.$router.push('/Login');
        }).catch(() => {});
      },
    },
    mounted() {
      var user = sessionStorage.getItem('twfxuser');
      //console.log(user);
      if (user) {
        user = JSON.parse(user);
        this.employeeName = user.employeeName || '';
        this.employeeImg = this.Global.webApiUrl + user.employeeImg;
        this.f_LoadConfig();
      }
      else
        this.$router.push({path: '/Login'});
    },
  }

</script>

<style scoped>
  @import '../style/font-awesome/css/font-awesome.css';


  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 100%;
  }
  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    /*background-color: #e9e9e9;*/
  }
  .header {
    height: 60px;
    line-height: 60px;
    color: #fff;
  }
  .logo {
    height: 60px;
    font-size: 22px;
    padding-left: 20px;
    padding-right: 20px;
    border-color: rgba(238, 241, 146, 0.3);
    border-right-width: 1px;
    border-right-style: solid;
    cursor: pointer;
  }
  .logo-width{
    width:201px;
  }
  .logo-collapse-width{
    width:65px
  }
  .tools{
    padding: 0px 23px;
    width:14px;
    height: 60px;
    line-height: 60px;
    cursor: pointer;
  }
  .userinfo {
    text-align: right;
    padding-right: 35px;
    float: right;
  }
  .userinfo-inner {
    cursor: pointer;
    color: #fff;
  }
  img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 10px 0px 10px 10px;
    float: right;
  }


  .main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
  }
  aside {
    flex: 0 0 200px;
    width: 200px;
  }
  .el-menu{
    height: 100%;
  }
  .menu-collapsed{
    flex:0 0 65px;
    width: 65px;
  }
  .menu-expanded{
    flex:0 0 200px;
    width: 200px;
  }


  .content-container {
    flex:1;
    overflow-y: scroll;
    padding: 20px;
  }
  .breadcrumb-container {
    margin-bottom: 15px;
  }
  .title {
    width: 200px;
    float: left;
    color: #475669;
  }
  .breadcrumb-inner {
    float: right;
  }
  .content-wrapper {
    background-color: #fff;
    box-sizing: border-box;
  }


  /*设置*/
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    border: 1px dashed #d9d9d9;
  }




</style>

<style>
  /*分页控件样式*/
  .pageBarClass{
    margin-top: 20px;
  }
</style>
