<template>
  <section>

    <!--搜索-->
    <el-col :span="20" :class="this.Global.pageToolBarClass" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.storageLoCode" placeholder="库位编号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.storageLoName" placeholder="库位名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.storageId" clearable filterable placeholder="仓库" style="width: 150px;">
            <el-option
              v-for="item in storageList"
              :key="item.Storageid"
              :label="item.Storagename"
              :value="item.Storageid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.storageLoType" clearable filterable placeholder="库位类型" style="width: 150px;">
            <el-option
              v-for="item in storageLoTypeList"
              :key="item.Rccode"
              :label="item.Rcname"
              :value="item.Rccode">
            </el-option>
          </el-select>
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
      <el-table-column prop="Storagelocode" label="库位编号"  min-width="100" show-overflow-tooltip  header-align="center"   align="center">
      </el-table-column>
      <el-table-column prop="Storageloname" label="库位名称"  min-width="120" show-overflow-tooltip  header-align="center"   align="center">
      </el-table-column>
      <el-table-column prop="Storagelotypename" label="库位类型" min-width="90" show-overflow-tooltip  header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="Storagename" label="仓库" min-width="120" show-overflow-tooltip  header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Isenable" label="启用" min-width="50" show-overflow-tooltip  header-align="center"   align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.Isenable=='Y'">
            <el-tag type="success" size="mini">是</el-tag>
          </div>
          <div v-else>
            <el-tag type="info"  size="mini">否</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="Isdefault" label="默认" min-width="50" show-overflow-tooltip  header-align="center"   align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.Isdefault=='Y'">
            <el-tag type="success" size="mini">是</el-tag>
          </div>
          <div v-else>
            <el-tag type="info"  size="mini">否</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="Storagelodesc" label="描述" min-width="150" show-overflow-tooltip  header-align="center" >
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
    <el-col :span="20"  :class="this.Global.pageBarClass" >
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
    <el-dialog :title="editTitle"  :visible.sync="editFormVisible"  width="65%"  :close-on-click-modal="false">
      <div slot="title" style="font-size: 14px; font-weight: bold; color: #606266; " >
        <i class="fa fa-th-large" aria-hidden="true" style="margin-right: 10px;"></i>{{editTitle}}
      </div>
      <el-card class="box-card" style="margin:-10px 0px -25px 0px; border:#DCDFE6 1px solid; ">
        <el-col :span="12">
          <el-form :model="editForm" label-width="120px" :rules="editFormRules1" ref="editForm1">
            <el-form-item label="库位编号" prop="Storagelocode" :inline-message="true">
              <el-col :span="14">
                <el-input v-model="editForm.Storagelocode" placeholder="请输入库位编号" maxlength="25" clearable></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="库位类型" prop="Storagelotype" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="14">
                <el-select v-model="editForm.Storagelotype" filterable placeholder="请选择">
                  <el-option
                    v-for="item in storageLoTypeList"
                    :key="item.Rccode"
                    :label="item.Rcname"
                    :value="item.Rccode">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="是否默认" prop="Isdefault" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="14">
                <el-radio v-model="editForm.Isdefault" label="Y">是</el-radio>
                <el-radio v-model="editForm.Isdefault" label="N">否</el-radio>
              </el-col>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
            <el-form-item label="库位名称" prop="Storageloname" :inline-message="true" >
              <el-col :span="14">
                <el-input v-model="editForm.Storageloname" placeholder="请输入库位名称" maxlength="25" :rows="2" clearable></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="仓库" prop="Storageid" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="14">
                <el-select v-model="editForm.Storageid" filterable placeholder="请选择" clearable>
                  <el-option
                    v-for="item in storageList"
                    :key="item.Storageid"
                    :label="item.Storagename"
                    :value="item.Storageid">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="是否启用"  prop="Isenable" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="14">
                <el-radio v-model="editForm.Isenable" label="Y">是</el-radio>
                <el-radio v-model="editForm.Isenable" label="N">否</el-radio>
              </el-col>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="24">
          <el-form :model="editForm" label-width="120px"  ref="editForm2">
            <el-form-item label="描述" prop="Storagelodesc" :inline-message="true" style="margin-top: 5px;">
              <el-col :span="20">
                <el-input  v-model="editForm.Storagelodesc" placeholder="请输入描述" maxlength="25" clearable></el-input>
              </el-col>
            </el-form-item>
            <el-form-item  style="margin-top: 10px;">
            </el-form-item>
          </el-form>
        </el-col>
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
          storageLoCode:'',
          storageLoName:'',
          storageLoType:'',
          storageId:null
        },
        page:1,
        size:this.Global.pageSize,
        pageButtonType:this.Global.pageButtonType,
        total:0,
        resultData:[],
        listLoading: false,

        leasesshow:false,
        leaseeshow:false,

        //编辑界面数据
        editTitle:'产品编辑',
        editFormVisible:false,
        editLoading: false,
        editFormRules1: {
          Storagecode: [
            { required: true, message: '仓库编号不能为空', trigger: 'blur' },
          ],
          Storagetype: [
            { required: true, message: '仓库类型不能为空', trigger: 'blur' },
          ],
          Storagenature: [
            { required: true, message: '仓库性质不能为空', trigger: 'blur' },
          ],
        },
        editFormRules: {
          Storagename: [
            { required: true, message: '仓库名称不能为空', trigger: 'blur' },
          ],
          Departid: [
            { required: true, message: '所属部门不能为空', trigger: 'blur' },
          ],
        },
        editForm: {
          Storageloid:0,
          Storageloname:'',
          Storagelocode: '',
          Storageid:null,
          Storagelotype:'',
          Isenable:'Y',
          Isdefault:'N',
          Storagelodesc:'',
        },
        //资源
        storageLoTypeList:[],
        storageList:[],
      }
    },
    methods:{


      //显示添加界面
      f_Add:function(){
        this.editFormVisible=true;
        this.editTitle='仓库新增';
        this.editForm = {
          Storageloid:0,
          Storageloname:'',
          Storagelocode: '',
          Storageid:null,
          Storagelotype:'',
          Isenable:'Y',
          Isdefault:'N',
          Storagelodesc:'',
        };
      },
      //显示编辑界面
      f_Edit: function (index, row) {
        this.editFormVisible=true;
        this.editTitle='仓库编辑';
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
            Pkid: row.Storageloid,
          };
          this.$httpPost('StorageLo/DStorageLo',pars).then((res)=> {
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

      //提交事件
      f_EditSubmit:function () {
        let _this=this;
        this.$refs.editForm1.validate((valid1) => {
          _this.$refs.editForm.validate((valid) => {
            if (valid1&&valid) {
              this.editLoading = true;
              let pars = Object.assign({}, this.editForm);
              _this.$httpPost('StorageLo/SStorageLo', pars).then((res) => {
                if (res.success == 'ok') {
                  if (!res.addResult) {
                    _this.$alert('库位名称已存在，请重新输入！', '提示', {
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
        });
      },
      //提交取消事件
      f_EditClose:function () {
        this.$refs['editForm1'].resetFields();
        this.$refs['editForm'].resetFields();
        this.editFormVisible = false;
      },

      //资源加载
      f_ConfigLoad:function(){
        this.$httpPost('StorageLo/GLoadConfig',{}).then((res)=> {
          if(res.success=='ok') {
            this.storageLoTypeList = res.storageLoType;
            this.storageList=res.storageList;
          }
        }) .catch(function (error) {
          this.$message.error('数据错误！');
        });
      },
      //搜索事件
      f_Search:function(){
        this.listLoading = true;

        //资源加载
        this.f_ConfigLoad();

        let pars= {
          page: this.page,
          size: this.size,
          storageLoName: this.filters.storageLoName,
          storageLoCode: this.filters.storageLoCode,
          storageLoType: this.filters.storageLoType,
          storageId: this.filters.storageId,
        };
        let _this=this;
        this.$httpPost('StorageLo/GStorageLoList',pars).then((res)=> {
          if(res.success=='ok') {
            _this.resultData = res.dtData;
            _this.total=res.total;
            _this.listLoading = false;
          }
          else {
            _this.listLoading = false;
          }
        }) .catch(function (error) {
          _this.$message.error('数据错误！');
          _this.listLoading = false;
        });
      },
      //分页事件
      handleCurrentChange(val) {
        this.page = val;
        this.f_Search();
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
