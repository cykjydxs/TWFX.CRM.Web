<template>
  <section>

    <!--搜索-->
    <el-col :span="20" :class="this.Global.pageToolBarClass" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.checkName" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.trueName" placeholder="姓名" clearable></el-input>
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
    <el-table-column prop="Username" label="用户名"  min-width="100"  header-align="center" align="center">
    </el-table-column>
    <el-table-column prop="Usertruename" label="姓名" min-width="100"  header-align="center" align="center">
    </el-table-column>
    <el-table-column prop="Roleidsdesc" label="所属角色" min-width="300" show-overflow-tooltip  header-align="center" align="center">
    </el-table-column>
    <el-table-column prop="Remark" label="备注"  min-width="200" show-overflow-tooltip  header-align="center" align="center">
    </el-table-column>
    <el-table-column prop="Createdate" label="创建日期"  min-width="180"  header-align="center" align="center">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.Createdate | moment }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150"  align="center">
      <template slot-scope="scope">
        <div v-if="pageButtonType===1">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button size="mini" type="primary" icon="el-icon-edit" circle   @click="f_Edit(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" >
            <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="f_Delete(scope.$index, scope.row)"></el-button>
          </el-tooltip>
        </div>
        <div v-else-if="pageButtonType===2">
          <el-button size="mini" @click="f_Edit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="f_Delete(scope.$index, scope.row)">删除</el-button>
        </div>
        <div v-else>
          <el-button type="text"  @click="f_Edit(scope.$index, scope.row)" >编辑</el-button>
          <el-button type="text"  @click="f_Delete(scope.$index, scope.row)">删除</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>

    <!--分页-->
    <el-col :span="4" :class="this.Global.pageBarClass" >
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
      <div slot="title" style="font-size: 14px; font-weight: bold; color: #606266; " >
        <i class="fa fa-th-large" aria-hidden="true" style="margin-right: 10px;"></i>{{editTitle}}
      </div>
      <el-card class="box-card" style="margin:-10px 0px -25px 0px; border:#DCDFE6 1px solid; ">
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
            <el-form-item label="用户名" prop="Username" :inline-message="true">
              <el-col :span="12">
                <el-input v-model="editForm.Username" placeholder="请输入用户名" maxlength="30" clearable></el-input>
              </el-col>
            </el-form-item>
        <el-form-item label="真实姓名" prop="Usertruename" :inline-message="true" style="margin-top: 10px;">
          <el-col :span="12">
            <el-input v-model="editForm.Usertruename" placeholder="请输入姓名" maxlength="100" :rows="2" clearable></el-input>
          </el-col>
        </el-form-item>
            <el-form-item label="所属角色" prop="Roleids" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="18">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="editForm.Roleids" @change="handleCheckedCitiesChange" style="text-align: left;">
                  <el-checkbox v-for="role in roleList" :label="role.Roleid" :key="role.Rolename"  border >
                    {{role.Rolename}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-col>
            </el-form-item>
            <el-form-item label="备注" style="margin-top: 10px;">
              <el-col :span="18">
                <el-input v-model="editForm.Remark" placeholder="请输入备注信息" maxlength="100" :rows="2" clearable></el-input>
              </el-col>
            </el-form-item>
      </el-form>
      </el-card>
      <div slot="footer" style="text-align: center; ">
        <el-button type="primary" @click.native="f_EditSubmit" :loading="editLoading" size="medium">保存</el-button>
        <el-button @click.native="f_EditClose" size="medium">取消</el-button>
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
          //列表界面
          filters: {
            checkName: '',
            trueName: '',
          },
          page: 1,
          size: this.Global.pageSize,
          pageButtonType: this.Global.pageButtonType,
          total: 0,
          resultData: [],
          listLoading: false,
          //编辑界面
          editTitle: '',
          editFormVisible: false,
          editLoading: false,
          editFormRules: {
            Username: [
              {required: true, message: '用户名不能为空', trigger: 'blur'}
            ],
            Roleids: [
              {required: true, message: '请至少选择一个角色', trigger: 'blur'}
            ],
            Usertruename:[
              {required: true, message: '姓名不能为空', trigger: 'blur'}
            ],
          },
          editForm: {
            Userid: 0,
            Username: '',
            Usertruename: '',
            Remark: '',
            Roleids:[],
          },
          checkAll:false,
          isIndeterminate:false,
          roleList:[],
        }
      },
      methods: {
        //添加
        f_Add: function () {
          this.editFormVisible=true;
          this.editTitle='用户新增';
          this.editForm = {
            Userid: 0,
            Username: '',
            Usertruename: '',
            Remark: '',
            Roleids:[],
          };
          this.$httpPost('User/GUserRoles',{}).then((res)=> {
            if(res.success=='ok') {
              this.roleList = res.dtData;
            }
          }) .catch(function (error) {
            this.$message.error('数据错误！');
          });
        },
        //显示编辑界面
        f_Edit: function (index, row) {
          this.editFormVisible = true;
          this.editTitle = '用户编辑';
          this.editForm.Roleids = '';
          var _this = this;
          this.$httpPost('User/GUserRoles', {}).then((res) => {
            if (res.success == 'ok') {
              this.roleList = res.dtData;
              this.editForm = Object.assign({}, row);
              //是否全选
              let checkAllGet = true;
              let checkStr = "," + this.editForm.Roleids + ",";
              for (var i = 0; i < this.roleList.length; i++) {
                let strStr = "," + this.roleList[i].Roleid + ",";
                if (checkStr.indexOf(strStr) == -1) {
                  checkAllGet = false;
                  break;
                }
              }
              //角色字符串数组转换
              let checkvalue = [];
              if (this.editForm.Roleids != null && this.editForm.Roleids != "") {
                let roleArray = this.editForm.Roleids.split(',');
                for (var i = 0; i < roleArray.length; i++) {
                  for (var m = 0; m < this.roleList.length; m++) {
                    if (Number(this.roleList[m].Roleid) == Number(roleArray[i]))
                      checkvalue.push(Number(roleArray[i]));
                  }
                }
              }
              this.editForm.Roleids = checkvalue;

              let checkedCount = checkvalue.length;
              this.checkAll = checkAllGet;
              this.isIndeterminate =checkedCount > 0 && checkedCount < this.roleList.length;
            }
          }).catch(function (error) {
            _this.$message.error('数据错误！');
          });
        },
        //删除事件
        f_Delete: function (index, row) {
          this.$confirm('确定删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.listLoading = true;
            let pars= {
              Pkid: row.Userid,
            };
            this.$httpPost('User/DUser',pars).then((res)=> {
              if(res.success=='ok') {
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
            }) .catch(function (error) {
              this.$message.error('数据错误！');
              this.listLoading = false;
            });
          }).catch(() => {});
        },
        //搜索
        f_Search: function () {
          this.listLoading = true;
          let parms = {
            page: this.page,
            size: this.size,
            checkName: this.filters.checkName,
            trueName: this.filters.trueName,
          };
          this.$httpPost('User/GUserList', parms).then((res) => {
            if (res.success == 'ok') {
              this.resultData = res.dtData;
              this.total = res.total;
              this.listLoading = false;
            }
            else {
              this.listLoading = false;
            }
          }).catch(function (error) {
            this.$message.error('获取数据出错！');
            this.listLoading = false;
          });
        },
        //分页事件
        handleCurrentChange(val) {
          this.page = val;
          this.f_Search();
        },


        //提交事件
        f_EditSubmit:function () {
          this.$refs.editForm.validate((valid) => {
            if (valid) {
              this.editLoading = true;
              let pars = Object.assign({}, this.editForm);
              let roleStr = '';
              for (var i = 0; i < this.editForm.Roleids.length; i++) {
                if (i == 0)
                  roleStr += this.editForm.Roleids[i];
                else
                  roleStr += "," + this.editForm.Roleids[i];
              }
              pars.Roleids = roleStr;
              this.$httpPost('User/SUser', pars).then((res) => {
                if (res.success == 'ok') {
                  if(!res.addResult){
                    this.$alert('有户名已存在，请重新输入！', '提示', {
                      confirmButtonText: '确定',
                      type: 'error',
                    });
                  }
                  else {
                    this.editLoading = false;
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
        f_EditClose:function () {
          this.$refs['editForm'].resetFields();
          this.editFormVisible = false;
        },


        //check事件
        handleCheckAllChange(val) {
          let checkvalue = [];
          if(val) {
            for (var i = 0; i < this.roleList.length; i++) {
              checkvalue.push(this.roleList[i].Roleid);
            }
          }
          this.editForm.Roleids = checkvalue;
          this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
          let checkedCount = value.length;
          this.checkAll = checkedCount === this.roleList.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.roleList.length;
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
<style >


</style>
