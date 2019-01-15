<template>
  <section>

    <!--搜索-->
    <el-col :span="20"  :class="this.Global.pageToolBarClass" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.brandName" placeholder="品牌名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" v-on:click="f_Search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="4"  :class="this.Global.pageToolBarClass" style="padding-bottom: 0px; text-align: right;">
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
      <el-table-column prop="Brandname" label="品牌名称"  min-width="150"  header-align="center"  align="center">
      </el-table-column>
      <!--<el-table-column prop="Brandlogo" label="品牌LOGO"  min-width="150"  header-align="center"  align="center">-->
        <!--<template  slot-scope="scope">-->
          <!--<img src="http://127.0.0.1:40001/Upload/UploadEmp/20180705155937889.png" style="border:1px solid #ccc; width:100px; height: 40px;" />-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="Branddesc" label="品牌描述" min-width="200"  header-align="center">
      </el-table-column>
      <!--<el-table-column prop="Branddesc1" label="是否采购" min-width="80"  header-align="center">-->
      <!--</el-table-column>-->
      <el-table-column prop="Modifydate" label="更新时间"  min-width="150"   header-align="center"  align="center">
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
          <el-form :model="editForm" label-width="160px" :rules="editFormRules" ref="editForm">
            <el-form-item label="品牌名称" prop="Brandname" :inline-message="true">
              <el-col :span="12">
                <el-input v-model.trim="editForm.Brandname" placeholder="请输入品牌名称" maxlength="30" clearable></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="品牌描述" prop="Branddesc" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="16">
                <el-input v-model="editForm.Branddesc" placeholder="请输入品牌描述" maxlength="100" :rows="2" clearable></el-input>
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
          brandName: '',
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
          Brandname: [
            {required: true, message: '品牌名称不能为空', trigger: 'blur'}
          ],
          Branddesc: [
            {required: true, message: '品牌描述不能为空', trigger: 'blur'}
          ],
        },
        editForm: {
          Brandid: 0,
          Brandname: '',
          Branddesc: '',
        },
      }
    },
    methods: {
      //添加
      f_Add: function () {
        this.editFormVisible=true;
        this.editTitle='品牌新增';
        this.editForm = {
          Brandid: 0,
          Brandname: '',
          Branddesc: '',
        };
      },
      //显示编辑界面
      f_Edit: function (index, row) {
        this.editFormVisible = true;
        this.editTitle = '品牌编辑';
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
          let pars= {
            Pkid: row.Brandid,
          };
          this.$httpPost('Brand/DBrand',pars).then((res)=> {
            if(res.success=='ok') {
              this.listLoading = false;
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              });
              this.f_Search();
            }
            else if (res.success == 'error1') {
              this.listLoading = false;
              this.$alert('该品牌已存在产品，不能删除！', '提示', {
                confirmButtonText: '确定',
                type: 'error',
              });
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
        let _this=this;
        let parms = {
          page: this.page,
          size: this.size,
          brandName: this.filters.brandName,
        };
        _this.$httpPost('Brand/GBrandList', parms).then((res) => {
          if (res.success == 'ok') {
            _this.resultData = res.dtData;
            _this.total = res.total;
            _this.listLoading = false;
          }
          else {
            _this.listLoading = false;
          }
        }).catch(function (error) {
          _this.$message.error('获取数据出错！');
          _this.listLoading = false;
        });
      },
      //分页事件
      handleCurrentChange(val) {
        this.page = val;
        this.f_Search();
      },


      //提交事件
      f_EditSubmit:function () {
        let _this=this;
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            _this.editLoading = true;
            let pars = Object.assign({}, _this.editForm);
            _this.$httpPost('Brand/SBrand', pars).then((res) => {
              if (res.success == 'ok') {
                if(!res.addResult){
                  _this.$alert('品牌已存在，请重新输入！', '提示', {
                    confirmButtonText: '确定',
                    type: 'error',
                  });
                  _this.editLoading = false;
                }
                else {
                  _this.editLoading = false;
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
      f_EditClose:function () {
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
<style >


</style>
