<!--<template>-->
  <!--<div v-loading="editLoading">-->
    <!--<el-form :model="editForm" label-width="160px" ref="editForm" border-->
             <!--style="padding-top: 40px; border-top: #DCDFE6 1px solid;">-->
      <!--<el-form-item label="真实姓名">-->
        <!--<el-col :span="10">-->
          <!--<el-input v-model="editForm.Usertruename"  maxlength="30"></el-input>-->
        <!--</el-col>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="用户头像" style="margin-top: 30px;">-->
        <!--<el-col :span="16">-->
          <!--<el-upload-->
            <!--class="avatar-uploader"-->
            <!--action="User/UploadImg"-->
            <!--:http-request="myUpload"-->
            <!--:show-file-list="false"-->
            <!--:on-success="handleAvatarSuccess"-->
            <!--:before-upload="beforeAvatarUpload">-->
            <!--<img v-if="editForm.Userimg" :src="editForm.Userimg" class="avatar">-->
            <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
          <!--</el-upload>-->
        <!--</el-col>-->
      <!--</el-form-item>-->
      <!--<el-form-item style="margin-top: 60px;">-->
        <!--<el-button type="primary" @click.native="f_EditSubmit" size="medium">保存</el-button>-->
        <!--<el-button @click.native="f_EditClose" size="medium">重置</el-button>-->
      <!--</el-form-item>-->
    <!--</el-form>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
  <!--import axios1 from 'axios';-->
  <!--export default {-->
    <!--data() {-->
      <!--return {-->
        <!--editLoading: false,-->
        <!--editForm: {-->
          <!--Usertruename: '',-->
          <!--Userimg: '',-->
        <!--},-->
        <!--imgPath: '',-->
      <!--};-->
    <!--},-->
    <!--methods: {-->
      <!--//图片上传-->
      <!--myUpload:function(content) {-->
        <!--let config = {-->
          <!--headers:{'Content-Type':'multipart/form-data'}-->
        <!--};-->
        <!--let pars = new FormData(); //创建form对象-->
        <!--pars.append('file',content.file,);//通过append向form对象添加数据-->
        <!--//param.append('chunk','0');//添加form表单中其他数据-->
        <!--//console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去-->
        <!--let _this=this;-->
        <!--this.$http_PostUp('User/UploadImg', pars,config).then((res) => {-->
          <!--if (res.success == 'ok') {-->
            <!--_this.editForm.Userimg =_this.Global.webApiUrl +  res.fullPath;-->
            <!--_this.imgPath = res.fullPath;-->
          <!--}-->
          <!--else if(res.success == 'errCode'){-->
            <!--_this.$message.error('上传头像图片只能是JPG/JPEG/PNG/GIF格式!');-->
          <!--}-->
          <!--else {-->
            <!--_this.$message.error('上传出错!');-->
          <!--}-->
        <!--}).catch(function (error) {-->
          <!--_this.$message.error('上传出错!');-->
        <!--});-->
      <!--},-->
      <!--//提交事件-->
      <!--f_EditSubmit:function () {-->
        <!--if(this.editForm.roleId<=0) {-->
          <!--this.$message.error('角色不能为空！');-->
        <!--}-->
        <!--else {-->
          <!--this.editLoading = true;-->
          <!--let pars = {-->
            <!--Usertruename: this.editForm.Usertruename,-->
            <!--Userimg: this.imgPath,-->
          <!--};-->
          <!--this.$httpPost('User/SUserInfo', pars).then((res) => {-->
            <!--if (res.success == 'ok') {-->
              <!--this.$confirm('保存成功,，请重新登录！', '提示', {-->
                <!--confirmButtonText: '确定',-->
                <!--type: 'success',-->
                <!--showCancelButton:false,-->
              <!--}).then(() => {-->
                <!--sessionStorage.removeItem('twfxuser');-->
                <!--sessionStorage.removeItem('twfxmenu');-->
                <!--location.reload();-->
                <!--this.$router.push('/Login');-->
              <!--}).catch(function (error) {-->
                <!--this.$message({-->
                  <!--showClose: true,-->
                  <!--message: '保存失败',-->
                  <!--type: 'success'-->
                <!--});-->
                <!--this.editLoading = false;-->
              <!--});-->
            <!--}-->
            <!--else {-->
              <!--this.$message({-->
                <!--showClose: true,-->
                <!--message: '保存失败',-->
                <!--type: 'success'-->
              <!--});-->
              <!--this.editLoading = false;-->
            <!--}-->
          <!--}).catch(function (error) {-->
            <!--this.$message.error('数据错误！');-->
            <!--this.editLoading = false;-->
          <!--});-->
        <!--}-->
      <!--},-->
      <!--f_EditClose:function() {-->
        <!--this.editLoading = false;-->
      <!--},-->
      <!--f_Search: function () {-->
        <!--let pars = {-->
          <!--Roleid: this.$route.query.roleId,-->
        <!--};-->
        <!--this.$httpPost('User/GUserInfo',pars).then((res) => {-->
          <!--if (res.success == 'ok') {-->
            <!--this.editForm.Usertruename = res.dtData[0].Usertruename;-->
            <!--this.editForm.Userimg = this.Global.webApiUrl + res.dtData[0].Userimg;-->
            <!--this.imgPath = res.dtData[0].Userimg;-->
          <!--}-->
        <!--}).catch(function (error) {-->
          <!--this.$message.error('数据错误！');-->
        <!--});-->
      <!--},-->
      <!--handleAvatarSuccess(res, file) {-->
        <!--console.log(res);-->
        <!--console.log(file);-->
      <!--},-->
      <!--beforeAvatarUpload(file) {-->
        <!--let isJPG = false;-->
        <!--if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif')-->
          <!--isJPG = true;-->
        <!--let isLt2M = file.size / 1024 / 1024 < 5;-->
        <!--if (!isJPG) {-->
          <!--this.$message.error('上传头像图片只能是JPG/JPEG/PNG/GIF格式!');-->
        <!--}-->
        <!--if (!isLt2M) {-->
          <!--this.$message.error('上传头像图片大小不能超过 5MB!');-->
        <!--}-->
        <!--return isJPG && isLt2M;-->
      <!--},-->
    <!--},-->
    <!--mounted() {-->
      <!--this.f_Search();-->
    <!--},-->
  <!--};-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
<!--<style>-->
  <!--.avatar-uploader .el-upload {-->
    <!--border: 1px dashed #d9d9d9;-->
    <!--border-radius: 6px;-->
    <!--cursor: pointer;-->
    <!--position: relative;-->
    <!--overflow: hidden;-->
  <!--}-->
  <!--.avatar-uploader .el-upload:hover {-->
    <!--border-color: #409EFF;-->
  <!--}-->
  <!--.avatar-uploader-icon {-->
    <!--font-size: 28px;-->
    <!--color: #8c939d;-->
    <!--width: 178px;-->
    <!--height: 178px;-->
    <!--line-height: 178px;-->
    <!--text-align: center;-->
  <!--}-->
  <!--.avatar {-->
    <!--width: 178px;-->
    <!--height: 178px;-->
    <!--display: block;-->
  <!--}-->
<!--</style>-->
