<template>
  <section>

    <!--搜索-->
    <el-col :span="24" :class="this.Global.pageToolBarClass"  style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.traderName" placeholder="商户名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.traderType" placeholder="请选择" clearable>
            <el-option
              v-for="item in traderTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" v-on:click="f_Search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="traderList" highlight-current-row  border v-loading="listLoading" style="width: 100%;" :height="tableHeight"
              :header-cell-style="this.Global.headerCellStyle" :cell-style="this.Global.cellStyle">
      <el-table-column type="index" width="50"  label="序号"  header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Tradername" label="商户名称"  min-width="300"  header-align="center">
      </el-table-column>
      <el-table-column prop="Tradertypename" label="商铺分类" min-width="100"  align="center" header-align="center">
      </el-table-column>
      <el-table-column prop="Tradercount" label="商铺数量" min-width="80"  align="center" header-align="center">
      </el-table-column>
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
      <div slot="title" style="font-size: 14px; font-weight: bold; color: #606266; " >
        <i class="fa fa-th-large" aria-hidden="true" style="margin-right: 10px;"></i>{{editTitle}}
      </div>
      <el-card class="box-card" style="margin:-10px 0px -25px 0px; border:#DCDFE6 1px solid; ">
      <el-form :model="editForm" label-width="160px" :rules="editFormRules" ref="editForm">
        <el-form-item label="商户名称" prop="Tradername" :inline-message="true">
          <el-col :span="12">
            <el-input v-model.trim="editForm.Tradername" placeholder="请输入商户名称" maxlength="30" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="商户分类" style="margin-top: 10px;">
          <el-col :span="16">
            <el-select v-model="editForm.Tradertype" placeholder="请选择">
              <el-option
                v-for="item in traderTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
      listLoading: false,
      filters: {
        traderName: '',
        traderType:'',
      },
      page: 1,
      size: this.Global.pageSize,
      total: 0,
      pageButtonType: this.Global.pageButtonType,
      traderList: [],

      //编辑界面
      editTitle: '',
      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        Tradername: [
          {required: true, message: '商户名称不能为空', trigger: 'blur'}
        ],
      },
      editForm: {
        Traderid: 0,
        Tradername: '',
        Tradertype: '',
      },

      //资源数据
      traderTypeList: [],
    }
  },
  methods: {
    //显示编辑界面
    f_Edit: function (index, row) {
      this.editFormVisible = true;
      this.editTitle = '商户编辑';
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
          Pkid: row.Traderid,
        };
        this.$httpPost('Trader/DTrader', pars).then((res) => {
          if (res.success == 'ok') {
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
            this.$alert('该商铺存在生效商铺，不能删除！', '提示', {
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
        }).catch(function (error) {
          this.$message.error('数据错误！');
          this.listLoading = false;
        });
      }).catch(() => {
      });
    },
    //提交事件
    f_EditSubmit:function () {
      let _this=this;
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          _this.editLoading = true;
          let pars = Object.assign({}, _this.editForm);
          _this.$httpPost('Trader/STrader', pars).then((res) => {
            if (res.success == 'ok') {
              if(!res.addResult){
                _this.$alert('商户名称重复，请重新输入！', '提示', {
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

    //加载事件
    f_Search: function () {
      this.listLoading = true;
      let parms = {
        page: this.page,
        size: this.size,
        traderName: this.filters.traderName,
        traderType:this.filters.traderType,
      };
      let _this = this;
      this.$httpPost('Trader/GTraderList', parms).then((res) => {
        if (res.success == 'ok') {
          _this.traderList = res.dtData;
          _this.total = res.total;
          _this.traderTypeList=[];
          for (let i = 0; i < res.dtResourceConfig.length; i++) {
            var model = {value: res.dtResourceConfig[i].Rccode, label: res.dtResourceConfig[i].Rcname};
            _this.traderTypeList.push(model);
          }
          _this.listLoading = false;
        }
        else {
          _this.listLoading = false;
        }
      }).catch(function (error) {
        _this.listLoading = false;
      });
    },
    //商户选择分页事件
    handleCurrentChange(val) {
      this.page = val;
      this.f_Search();
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

</style>
