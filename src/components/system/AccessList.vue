<!--<template>-->
<!--<div id="accesslist" v-loading="editLoading">-->
  <!--<el-form :model="accessForm" label-width="160px" :rules="accessFormRules" ref="accessForm" border-->
           <!--style="padding-top: 40px; border-top: #DCDFE6 1px solid;">-->
    <!--<el-form-item label="角色名称">-->
      <!--<el-col :span="10">-->
        <!--<el-input v-model="accessForm.roleName"  maxlength="30" :disabled="true"></el-input>-->
      <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="角色权限" prop="accessValue" style="margin-top: 30px;">-->
      <!--<el-col :span="16">-->
        <!--<el-transfer v-model="accessValue" :data="menuList"  :titles="['未选', '已选']"-->
                     <!--:props="{key: 'Menuid',label: 'Menuname',disabled: 'Parentmenuid'}">-->
        <!--</el-transfer>-->
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
  <!--export default {-->
    <!--data() {-->
      <!--return {-->
        <!--editLoading:false,-->
        <!--accessFormRules: {-->
          <!--Rolename: [-->
            <!--{ required: true, message: '角色名称不能为空', trigger: 'blur' }-->
          <!--]-->
        <!--},-->
        <!--accessForm:{-->
          <!--roleId:0,-->
          <!--roleName:'',-->
        <!--},-->
        <!--menuList: [],-->
        <!--accessValue: []-->
      <!--};-->
    <!--},-->
    <!--methods: {-->
      <!--//提交事件-->
      <!--f_EditSubmit:function () {-->
        <!--if(this.accessForm.roleId<=0) {-->
          <!--this.$message.error('角色不能为空！');-->
        <!--}-->
        <!--else {-->
          <!--this.editLoading = true;-->
          <!--let pars = {-->
            <!--accessValue: this.accessValue,-->
            <!--roleId: this.accessForm.roleId,-->
          <!--};-->
          <!--this.$httpPost('Menu/SAccess', pars).then((res) => {-->
            <!--if (res.success == 'ok') {-->
              <!--this.$message({-->
                <!--showClose: true,-->
                <!--message: '保存成功',-->
                <!--type: 'success'-->
              <!--});-->
              <!--this.editLoading = false;-->
              <!--this.f_Search();-->
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
        <!--this.accessValue = [];-->
        <!--this.editLoading = false;-->
      <!--},-->
      <!--f_Search: function () {-->
        <!--this.accessForm.roleId=this.$route.query.roleId;-->
        <!--this.accessForm.roleName=this.$route.query.roleName;-->
        <!--let pars = {-->
          <!--Roleid: this.$route.query.roleId,-->
        <!--};-->
        <!--this.$httpPost('Menu/GAccess',pars).then((res) => {-->
          <!--if (res.success == 'ok') {-->
            <!--this.menuList = res.dtData;-->
            <!--for(var i=0;i<this.menuList.length;i++){-->
              <!--if(this.menuList[i].Parentmenuid==0)-->
                <!--this.menuList[i].Parentmenuid=true;-->
              <!--else-->
                <!--this.menuList[i].Parentmenuid=false;-->
            <!--}-->
            <!--for(var i=0;i<res.dtAccess.length;i++){-->
              <!--this.accessValue.push(res.dtAccess[i].Menuid);-->
            <!--}-->
          <!--}-->
        <!--}).catch(function (error) {-->
          <!--this.$message.error('数据错误！');-->
        <!--});-->
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

  <!--#accesslist .el-transfer-panel{-->
    <!--width:300px;-->
  <!--}-->
  <!--/*-->
  <!--.el-transfer-panel__body{-->

  <!--}-->
  <!--#accesslist .el-checkbox-group el-transfer-panel__list{-->
    <!--padding-top: 200px;-->
    <!--height: 350px;-->
    <!--overflow-y: scroll;-->

  <!--}-->
<!--*/-->
<!--</style>-->
