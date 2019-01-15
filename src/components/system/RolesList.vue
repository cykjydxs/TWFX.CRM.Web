<template>
  <section>

    <!--搜索-->
    <el-col :span="20" :class="this.Global.pageToolBarClass" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.Rolename" placeholder="角色名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" v-on:click="f_Search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="4" :class="this.Global.pageToolBarClass" style="padding-bottom: 0px; text-align: right;">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary"  @click="f_Add"><i class="fa fa-plus-circle" aria-hidden="true" style="margin-right: 6px;"></i>新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="resultData" highlight-current-row  border v-loading="listLoading" style="width: 100%;" :height="tableHeight"
              :header-cell-style="this.Global.headerCellStyle" :cell-style="this.Global.cellStyle">
      <el-table-column type="index" width="50"  label="序号"  header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Rolename" label="角色名称"  min-width="150"  header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="Roledesc" label="角色描述"  min-width="200" show-overflow-tooltip  header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="Usertruename" label="最后更新用户" min-width="150"  header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="Modifydate" label="最后更新日期"  min-width="180"  header-align="center" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.Modifydate | moment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150"  align="center">
        <template slot-scope="scope">
          <div v-if="pageButtonType===1">
            <el-tooltip class="item" effect="dark" content="权限设置" placement="top">
              <el-button size="mini" type="primary" icon="el-icon-setting" circle   @click="f_Access(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button size="mini" type="primary" icon="el-icon-edit" circle   @click="f_Edit(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="f_Delete(scope.$index, scope.row)"></el-button>
            </el-tooltip>
          </div>
          <div v-else-if="pageButtonType===2">
            <el-button size="mini" @click="f_Access(scope.$index, scope.row)">权限设置</el-button>
            <el-button size="mini" @click="f_Edit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="f_Delete(scope.$index, scope.row)">删除</el-button>
          </div>
          <div v-else>
            <el-button type="text"  @click="f_Access(scope.$index, scope.row)" >权限设置</el-button>
            <el-button type="text"  @click="f_Edit(scope.$index, scope.row)" >编辑</el-button>
            <el-button type="text"  @click="f_Delete(scope.$index, scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-col :span="4" :class="this.Global.pageBarClass">
    </el-col>
    <el-col :span="20" :class="this.Global.pageBarClass" >
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="size"
        layout="total, prev, pager, next, jumper"
        :total="total" style="float:right;">
      </el-pagination>
    </el-col>


    <!--编辑界面-->
    <el-dialog :title="editTitle"  :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
      <div slot="title" style="font-size: 14px; font-weight: bold; color: #606266;" >
        <i class="fa fa-th-large" aria-hidden="true" style="margin-right: 10px;"></i>{{editTitle}}
      </div>
      <el-card class="box-card" style="margin:-10px 0px -25px 0px; border:#DCDFE6 1px solid; ">
      <el-form :model="editForm" label-width="180px" :rules="editFormRules" ref="editForm" border>
        <el-form-item label="角色名称" prop="Rolename" :inline-message="true">
          <el-col :span="12">
          <el-input v-model="editForm.Rolename" placeholder="请输入角色名称" maxlength="30" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="角色描述" style="margin-top: 10px;">
          <el-col :span="16">
          <el-input type="textarea" v-model="editForm.Roledesc" placeholder="请输入角色描述" maxlength="100" :rows="2" clearable></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      </el-card>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click.native="f_EditSubmit" :loading="editLoading" size="medium">保存</el-button>
        <el-button @click.native="f_EditClose" size="medium">取消</el-button>
      </div>
    </el-dialog>


    <!--菜单权限界面-->
    <el-dialog :visible.sync="editFormAccessVisible"  width="60%"  :close-on-click-modal="false">
      <div slot="title" style="font-size: 14px; font-weight: bold; color: #606266;" >
        <i class="fa fa-th-large" aria-hidden="true" style="margin-right: 10px;"></i>角色菜单权限设置
      </div>
      <el-card class="box-card" style="margin:-10px 0px -25px 0px; border:#DCDFE6 1px solid; ">
        <el-form :model="accessForm" label-width="180px" :rules="accessFormRules" ref="accessForm" border>
          <el-form-item label="角色名称">
            <el-col :span="10">
              <el-input v-model="accessForm.roleName"  maxlength="30" :disabled="true"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="角色权限" prop="accessValue" style="margin-top: 30px;">
            <el-col :span="24">
              <el-transfer v-model="accessValue" :data="menuList"  :titles="['未选', '已选']"
                           :props="{key: 'Menuid',label: 'Menuname',disabled: 'Parentmenuid'}">
              </el-transfer>
            </el-col>
          </el-form-item>
        </el-form>
      </el-card>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click.native="f_EditAccessSubmit" :loading="editLoading" size="medium">保存</el-button>
        <el-button @click.native="f_EditAccessClose" size="medium">取消</el-button>
      </div>
    </el-dialog>


  </section>
</template>

<script>

  export default {
    data() {
      return {
        //表格高度
        tableHeight:this.Global.pagetableHeight,
        //列表界面数据
        filters: {
          Rolename: '',
        },
        page: 1,
        size: this.Global.pageSize,
        pageButtonType: this.Global.pageButtonType,
        total: 0,
        resultData: [],
        listLoading: false,

        //编辑界面数据
        editTitle: '角色编辑',
        editFormVisible: false,
        editLoading: false,
        editFormRules: {
          Rolename: [
            {required: true, message: '角色名称不能为空', trigger: 'blur'}
          ]
        },
        editForm: {
          Rolename: '',
          Roledesc: '',
          Roleid: 0,
        },

        //菜单权限设置
        editFormAccessVisible:false,
       editAccessLoading:false,
        accessFormRules: {
          Rolename: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ]
        },
        accessForm:{
          roleId:0,
          roleName:'',
        },
        menuList: [],
        accessValue: [],
      }
    },
    methods: {
      //显示添加界面
      f_Add: function () {
        this.editFormVisible = true;
        this.editTitle = '角色新增';
        this.editForm = {
          Rolename: '',
          Roledesc: '',
          Roleid: 0,
        };
      },
      //显示编辑界面
      f_Edit: function (index, row) {
        this.editFormVisible = true;
        this.editTitle = '角色编辑';
        this.editForm = Object.assign({}, row);
      },
      //删除事件
      f_Delete: function (index, row) {
        this.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let pars = {
            Pkid: row.Roleid,
          };
          this.$httpPost('Role/DRole', pars).then((res) => {
            if (res.success == 'ok') {
              this.listLoading = false;
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              });
              this.f_Search();
            }
            else {
              this.$message({
                showClose: true,
                message: '删除失败',
                type: 'error'
              });
              this.listLoading = false;
            }
          }).catch(function (error) {
            this.$message.error('数据错误！');
            this.listLoading = false;
          });
        }).catch(() => {
        });
      },
      //搜索事件
      f_Search: function () {
        this.listLoading = true;
        let pars = {
          page: this.page,
          size: this.size,
          Rolename: this.filters.Rolename,
        };
        this.$httpPost('Role/GRoleList', pars).then((res) => {
          if (res.success == 'ok') {
            this.resultData = res.dtData;
            this.total = res.total;
            this.listLoading = false;
          }
          else {
            this.listLoading = false;
          }
        }).catch(function (error) {
          this.$message.error('数据错误！');
          this.listLoading = false;
        });
      },
      //分页事件
      handleCurrentChange(val) {
        this.page = val;
        this.f_Search();
      },

      //提交事件
      f_EditSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.editLoading = true;
            let pars = {
              Rolename: this.editForm.Rolename,
              Roledesc: this.editForm.Roledesc,
              Roleid: this.editForm.Roleid,
            };
            this.$httpPost('Role/SRole', pars).then((res) => {
              if (res.success == 'ok') {
                this.editLoading = false;
                if (!res.addResult) {
                  this.$alert('角色名称已存在，请重新输入！', '提示', {
                    confirmButtonText: '确定',
                    type: 'error',
                  });
                }
                else {
                  this.$message({
                    showClose: true,
                    message: '保存成功',
                    type: 'success'
                  });
                  this.editFormVisible = false;
                  this.f_Search();
                }
              }
              else {
                this.$message({
                  showClose: true,
                  message: '保存失败',
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
      //提交取消事件
      f_EditClose: function () {
        this.$refs['editForm'].resetFields();
        this.editFormVisible = false;
      },


      //权限设置
      f_Access: function (index, row) {
        this.editFormAccessVisible = true;
        this.f_SearchAccess(row.Roleid, row.Rolename);
      },
      f_EditAccessSubmit:function () {
        if(this.accessForm.roleId<=0) {
          this.$message.error('角色不能为空！');
        }
        else {
          this.editAccessLoading = true;
          let pars = {
            accessValue: this.accessValue,
            roleId: this.accessForm.roleId,
          };
          this.$httpPost('Menu/SAccess', pars).then((res) => {
            if (res.success == 'ok') {
              this.$message({
                showClose: true,
                message: '保存成功',
                type: 'success'
              });
              this.editAccessLoading = false;
              this.f_Search();
              this.editFormAccessVisible=false;
            }
            else {
              this.$message({
                showClose: true,
                message: '保存失败',
                type: 'success'
              });
              this.editAccessLoading = false;
            }
          }).catch(function (error) {
            this.$message.error('数据错误！');
            this.editAccessLoading = false;
          });
        }
      },
      f_EditAccessClose:function() {
        this.accessValue = [];
        this.editAccessLoading = false;
        this.editFormAccessVisible=false;
      },
      f_SearchAccess: function (rid,rname) {
        this.accessForm.roleId=rid;
        this.accessForm.roleName=rname;
        let pars = {
          Roleid: rid,
        };
        this.$httpPost('Menu/GAccess',pars).then((res) => {
          if (res.success == 'ok') {
            this.menuList = res.dtData;
            for(var i=0;i<this.menuList.length;i++){
              if(this.menuList[i].Parentmenuid==0)
                this.menuList[i].Parentmenuid=true;
              else
                this.menuList[i].Parentmenuid=false;
            }
            for(var i=0;i<res.dtAccess.length;i++){
              this.accessValue.push(res.dtAccess[i].Menuid);
            }
          }
        }).catch(function (error) {
          this.$message.error('数据错误！');
        });
      },
    },
    mounted() {
      this.f_Search();
    },
  }
</script>

<style scoped>
  @import '../../style/font-awesome/css/font-awesome.css';
</style>
<style>
  #accesslist .el-transfer-panel{
    width:300px;
  }
</style>
