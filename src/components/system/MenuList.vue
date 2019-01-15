<template>
  <section>

    <!--搜索-->
    <el-col :span="20" :class="this.Global.pageToolBarClass" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.Menuname" placeholder="菜单名称" clearable></el-input>
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
    <el-table :data="resultData" highlight-current-row  border v-loading="listLoading" style="width: 100%; " :height="tableHeight"
              :header-cell-style="this.Global.headerCellStyle" :cell-style="this.Global.cellStyle">
      <el-table-column type="index" width="50"  label="序号"  header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Pmenuname" label="父级菜单名称" min-width="90" show-overflow-tooltip  header-align="center">
      </el-table-column>
      <el-table-column prop="Menuname" label="菜单名称"  min-width="90" show-overflow-tooltip  header-align="center">
      </el-table-column>
      <el-table-column prop="Menuurl" label="路径" min-width="100" show-overflow-tooltip  header-align="center">
      </el-table-column>
      <el-table-column prop="Menuicon" label="图标" min-width="100" show-overflow-tooltip  header-align="center">
      </el-table-column>
      <el-table-column prop="Component" label="组件名称" min-width="100" show-overflow-tooltip  header-align="center">
      </el-table-column>
      <el-table-column prop="Menuhidden" label="显示" min-width="50" align="center"  header-align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.Menuhidden==='Y'" style="color: red;"><i class="el-icon-close"></i></div>
          <div v-else><i class="el-icon-check" style="color: green;"></i></div>
        </template>
      </el-table-column>
      <el-table-column prop="Menusort" label="排序" min-width="50"  align="center"  header-align="center">
      </el-table-column>
      <el-table-column prop="Menudesc" label="菜单描述"  min-width="100" show-overflow-tooltip  header-align="center">
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
      <el-form :model="editForm" label-width="140px" :rules="editFormRules" ref="editForm">
        <el-form-item label="菜单名称" prop="Menuname" :inline-message="true">
          <el-col :span="12">
            <el-input v-model="editForm.Menuname" placeholder="请输入菜单名称" maxlength="30" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="父级菜单名称" :inline-message="true" style="margin-top: 10px;">
          <el-col :span="12">
            <el-select v-model="editForm.Parentmenuid" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in oneMenuList"
                :key="item.Menuid"
                :label="item.Menuname"
                :value="item.Menuid">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="路径" prop="Menuurl" :inline-message="true" style="margin-top: 10px;">
          <el-col :span="12">
            <el-input v-model="editForm.Menuurl" placeholder="请输入菜单Url路径" maxlength="100" :rows="2" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="图标" prop="Menuicon" :inline-message="true" style="margin-top: 10px;">
          <el-col :span="12">
            <el-input v-model="editForm.Menuicon" placeholder="请输入图标 如：fa fa-files-o" maxlength="100" :rows="2" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="组件名称" prop="Component" :inline-message="true" style="margin-top: 10px;">
          <el-col :span="12">
            <el-input v-model="editForm.Component" placeholder="请输入菜单Vue组件路径" maxlength="100" :rows="2" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="是否显示" style="margin-top: 10px;">
          <el-col :span="12">
            <el-radio v-model="editForm.Menuhidden" label="N">是</el-radio>
            <el-radio v-model="editForm.Menuhidden" label="Y">否</el-radio>
          </el-col>
        </el-form-item>
        <el-form-item label="排序" style="margin-top: 10px;">
          <el-col :span="12">
            <el-input-number v-model="editForm.Menusort" :min="0" :max="10000" label="排序"></el-input-number>
          </el-col>
        </el-form-item>
        <el-form-item label="菜单描述" style="margin-top: 10px;">
          <el-col :span="16">
            <el-input type="textarea" v-model="editForm.Menudesc" placeholder="请输入菜单描述" maxlength="100" :rows="2" clearable ></el-input>
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
    data(){
      return {
        //表格高度
        tableHeight:this.Global.pagetableHeight,
        //列表界面数据
        filters:{
          Menuname:'',
        },
        page:1,
        size:this.Global.pageSize,
        pageButtonType:this.Global.pageButtonType,
        total:0,
        resultData:[],
        listLoading: false,

        //编辑界面数据
        editTitle:'菜单编辑',
        editFormVisible:false,
        editLoading: false,
        editFormRules: {
          Menuname: [
            { required: true, message: '菜单名称不能为空', trigger: 'blur' },
          ],
          Menuurl: [
            { required: true, message: '菜单Url路径不能为空', trigger: 'blur' },
          ],
          Component: [
            { required: true, message: '菜单Vue组件路径不能为空', trigger: 'blur' },
          ],
        },
        editForm: {
          Menuid:0,
          Parentmenuid:'',
          Menuname: '',
          Menuurl:'',
          Menuicon:'',
          Menudesc:'',
          Component:'',
          Menuhidden:'',
          Menusort:0,
        },
        oneMenuList:[],
      }
    },
    methods:{
      //显示添加界面
      f_Add:function(){
        this.editFormVisible=true;
        this.editTitle='菜单新增';
        this.editForm = {
          Menuid:0,
          Parentmenuid:'',
          Menuname: '',
          Menuurl:'',
          Menuicon:'',
          Menudesc:'',
          Component:'',
          Menuhidden:'N',
          Menusort:0,
        };
        this.$httpPost('Menu/GOneMenuList',{}).then((res)=> {
          if(res.success=='ok') {
            this.oneMenuList = res.dtData;
          }
        }) .catch(function (error) {
          this.$message.error('数据错误！');
        });
      },
      //显示编辑界面
      f_Edit: function (index, row) {
        this.editFormVisible=true;
        this.editTitle='菜单编辑';
        this.$httpPost('Menu/GOneMenuList',{}).then((res)=> {
          if(res.success=='ok') {
            this.editForm = Object.assign({}, row);
            if (this.editForm.Parentmenuid === 0)
              this.editForm.Parentmenuid = '';
            this.oneMenuList = res.dtData;
          }
        }) .catch(function (error) {
          this.$message.error('数据错误！');
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
            Pkid: row.Menuid,
          };
          this.$httpPost('Menu/DMenu',pars).then((res)=> {
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
      //搜索事件
      f_Search:function(){
        this.listLoading = true;
        let pars= {
          page: this.page,
          size: this.size,
          Menuname: this.filters.Menuname,
        };
        this.$httpPost('Menu/GMenuList',pars).then((res)=> {
          if(res.success=='ok') {
            this.resultData = res.dtData;
            this.total=res.total;
            this.listLoading = false;
          }
          else {
            this.listLoading = false;
          }
        }) .catch(function (error) {
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
      f_EditSubmit:function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.editLoading=true;
            let pars = Object.assign({}, this.editForm);
            this.$httpPost('Menu/SMenu',pars).then((res)=> {
              if(res.success=='ok') {
                this.editLoading = false;
                this.$message({
                  showClose: true,
                  message: '保存成功',
                  type: 'success'
                });
                this.editFormVisible = false;
                this.f_Search();
              }
              else {
                this.$message({
                  showClose: true,
                  message: '保存失败',
                  type: 'success'
                });
                this.editLoading = false;
              }
            }) .catch(function (error) {
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
    },
    mounted(){
      this.f_Search();
    },
  }
</script>

<style scoped>
  @import '../../style/font-awesome/css/font-awesome.css';
</style>

