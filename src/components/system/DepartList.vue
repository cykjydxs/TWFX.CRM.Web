<template>
  <section>

    <!--搜索-->
    <el-col :span="20" :class="this.Global.pageToolBarClass" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.Departname" placeholder="部门名称" clearable></el-input>
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
      <el-table-column prop="Departname" label="部门名称"  min-width="200"  header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="Pdepartname" label="上级部门"  min-width="200" show-overflow-tooltip  header-align="center" align="center">
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
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button size="mini" type="primary" icon="el-icon-edit" circle   @click="f_Edit(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
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
          <el-form-item label="部门名称" prop="Departname" :inline-message="true">
            <el-col :span="12">
              <el-input v-model="editForm.Departname" placeholder="请输入部门名称" maxlength="30" clearable></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="上级部门" style="margin-top: 10px;">
            <el-col :span="12">
              <el-select v-model="editForm.Departparentid" filterable clearable placeholder="请选择">
                <el-option
                  v-for="item in departList"
                  :key="item.Departid"
                  :label="item.Departname"
                  :value="item.Departid">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-form>
      </el-card>
      <div slot="footer" style="text-align: center;">
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
        //列表界面数据
        filters: {
          Departname: '',
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
          Departname: [
            {required: true, message: '部门名称不能为空', trigger: 'blur'}
          ]
        },
        editForm: {
          Departid:0,
          Departname: '',
          Departparentid: '',
        },

        departList:[],
      }
    },
    methods: {
      //显示添加界面
      f_Add: function () {
        this.editFormVisible = true;
        this.editTitle = '部门新增';
        this.editForm = {
          Departid:0,
          Departname: '',
          Departparentid: '',
        };
        this.f_ReConfig();
      },
      //显示编辑界面
      f_Edit: function (index, row) {
        this.editFormVisible = true;
        this.editTitle = '部门编辑';
        this.f_ReConfig();
        this.editForm = Object.assign({}, row);
        if(this.editForm.Departparentid=='0')
          this.editForm.Departparentid='';
      },
      //删除事件
      f_Delete: function (index, row) {
        let _this=this;
        this.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.listLoading = true;
          let pars = {
            Pkid: row.Departid,
          };
          _this.$httpPost('Depart/DDepart', pars).then((res) => {
            if (res.success == 'ok') {
              _this.listLoading = false;
              _this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              });
              _this.f_Search();
            }
            else {
              _this.$message({
                showClose: true,
                message: '删除失败',
                type: 'error'
              });
              _this.listLoading = false;
            }
          }).catch(function (error) {
            _this.$message.error('数据错误！');
            _this.listLoading = false;
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
          departName: this.filters.Departname,
        };
        let _this=this;
        this.$httpPost('Depart/GDepartList', pars).then((res) => {
          if (res.success == 'ok') {
            _this.resultData = res.dtData;
            _this.total = res.total;
            _this.listLoading = false;
          }
          else {
            _this.listLoading = false;
          }
        }).catch(function (error) {
          _this.$message.error('数据错误！');
          _this.listLoading = false;
        });
      },
      //分页事件
      handleCurrentChange(val) {
        this.page = val;
        this.f_Search();
      },

      //资源加载
      f_ReConfig:function(){
        this.$httpPost('Depart/GAllDepart',{}).then((res)=> {
          if(res.success=='ok') {
            this.departList = res.departList;
          }
        }) .catch(function (error) {
          this.$message.error('数据错误！');
        });
      },

      //提交事件
      f_EditSubmit: function () {
        let _this=this;
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            _this.editLoading = true;
            let pars = Object.assign({}, _this.editForm);
            _this.$httpPost('Depart/SDepart', pars).then((res) => {
              if (res.success == 'ok') {
                _this.editLoading = false;
                if (!res.addResult) {
                  _this.$alert('部门名称已存在，请重新输入！', '提示', {
                    confirmButtonText: '确定',
                    type: 'error',
                  });
                }
                else {
                  _this.$message({
                    showClose: true,
                    message: '保存成功',
                    type: 'success'
                  });
                  _this.editFormVisible = false;
                  _this.f_Search();
                }
              }
              else {
                _this.$message({
                  showClose: true,
                  message: '保存失败',
                  type: 'success'
                });
                _this.editLoading = false;
              }
            }).catch(function (error) {
              _this.$message.error('数据错误！');
              _this.editLoading = false;
            });
          }
        });
      },
      //提交取消事件
      f_EditClose: function () {
        this.$refs['editForm'].resetFields();
        this.editFormVisible = false;
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
