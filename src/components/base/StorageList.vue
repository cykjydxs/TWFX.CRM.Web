<template>
  <section>

    <!--搜索-->
    <el-col :span="20" :class="this.Global.pageToolBarClass" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.storageCode" placeholder="仓库编号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.storageName" placeholder="仓库名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.storageType" clearable filterable placeholder="仓库类型" style="width: 150px;">
            <el-option
              v-for="item in storageTypeList"
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
      <el-table-column prop="Storagecode" label="仓库编号"  min-width="100" show-overflow-tooltip  header-align="center"   align="center">
      </el-table-column>
      <el-table-column prop="Storagename" label="仓库名称"  min-width="120" show-overflow-tooltip  header-align="center"   align="center">
      </el-table-column>
      <el-table-column prop="Storagetypename" label="仓库类型" min-width="90" show-overflow-tooltip  header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="Departname" label="所属部门" min-width="80" show-overflow-tooltip  header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Storagenaturename" label="仓库性质" min-width="80" show-overflow-tooltip  header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Leasedatestr" label="租凭时间" min-width="150" show-overflow-tooltip  header-align="center"  >

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
      <el-table-column prop="Storagearea" label="面积/㎡" min-width="80" show-overflow-tooltip  header-align="center"   align="center">
        <template slot-scope="scope">
          {{ scope.row.Storagearea | money(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="Linkname" label="联系人" min-width="80" show-overflow-tooltip  header-align="center"   align="center">
      </el-table-column>
      <el-table-column prop="Linkphone" label="联系电话" min-width="80" show-overflow-tooltip  header-align="center" >
      </el-table-column>
      <el-table-column prop="Storageaddr" label="地址" min-width="100" show-overflow-tooltip  header-align="center" >
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
            <el-form-item label="仓库编号" prop="Storagecode" :inline-message="true">
              <el-col :span="14">
                <el-input v-model="editForm.Storagecode" placeholder="请输入仓库编号" maxlength="25" clearable></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="仓库类型" prop="Storagetype" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="14">
                <el-select v-model="editForm.Storagetype" filterable placeholder="请选择">
                  <el-option
                    v-for="item in storageTypeList"
                    :key="item.Rccode"
                    :label="item.Rcname"
                    :value="item.Rccode">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="仓库性质" prop="Storagenature" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="14">
                <el-select v-model="editForm.Storagenature" filterable placeholder="请选择" @change="f_Storagenature">
                  <el-option
                    v-for="item in storageNatureList"
                    :key="item.Rccode"
                    :label="item.Rcname"
                    :value="item.Rccode">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="租赁开始日期" prop="Leasesdate" :inline-message="true" style="margin-top: 10px;" v-show="leasesshow">
              <el-col :span="14">
                <el-date-picker
                  v-model="editForm.Leasesdate"
                  type="date"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="是否默认" prop="Isdefault" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="14">
                <el-radio v-model="editForm.Isdefault" label="Y">是</el-radio>
                <el-radio v-model="editForm.Isdefault" label="N">否</el-radio>
              </el-col>
            </el-form-item>
            <el-form-item label="联系人" prop="Linkname" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="14">
                <el-input v-model="editForm.Linkname" placeholder="请输入联系人" maxlength="20"  clearable></el-input>
              </el-col>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
            <el-form-item label="仓库名称" prop="Storagename" :inline-message="true" >
              <el-col :span="14">
                <el-input v-model="editForm.Storagename" placeholder="请输入仓库名称" maxlength="25" :rows="2" clearable></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="所属部门" prop="Departid" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="14">
                <el-select v-model="editForm.Departid" filterable placeholder="请选择" clearable>
                  <el-option
                    v-for="item in departList"
                    :key="item.Departid"
                    :label="item.Departname"
                    :value="item.Departid">
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
            <el-form-item label="租赁结束日期" prop="Leaseedate" :inline-message="true" style="margin-top: 10px;"  v-show="leaseeshow">
              <el-col :span="14">
                <el-date-picker
                  v-model="editForm.Leaseedate"
                  type="date"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="面积(㎡)" prop="Storagearea" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="14">
                <el-input-number v-model="editForm.Storagearea" controls-position="right"  :precision="2"  :step="1" :min="1" :max="1000"  clearable>
                </el-input-number>
              </el-col>
            </el-form-item>
            <el-form-item label="联系电话" prop="Linkphone" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="14">
                <el-input v-model="editForm.Linkphone" placeholder="请输入联系电话" maxlength="20" :rows="2" clearable></el-input>
              </el-col>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="24">
          <el-form :model="editForm" label-width="120px"  ref="editForm2">
            <el-form-item label="地址" prop="Storageaddr" :inline-message="true" style="margin-top: 5px;">
              <el-col :span="20">
                <el-input  v-model="editForm.Storageaddr" placeholder="请输入地址" maxlength="100" clearable></el-input>
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
          storageCode:'',
          storageName:'',
          storageType:null,
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
          Storageid:0,
          Storagename:'',
          Storagecode: '',
          Departid:null,
          Storagetype:'',
          Storagenature:'',
          Leasedate:'',
          Leasesdate:'',
          Leaseedate:'',
          Isenable:'Y',
          Isdefault:'N',
          Storageaddr:'',
          Storagearea:'',
          Linkname:'',
          Linkphone:'',
        },
        //资源
        storageTypeList:[],
        storageNatureList:[],
        departList:[],
      }
    },
    methods:{
      //选择改变事件
      f_Storagenature:function() {
        if (this.editForm.Storagenature == 'ZLCK') {
          this.leasesshow = true;
          this.leaseeshow = true;
        }
        else {
          this.leasesshow = false;
          this.leaseeshow = false;
        }
      },

      //显示添加界面
      f_Add:function(){
        this.editFormVisible=true;
        this.leasesshow = false;
        this.leaseeshow = false;
        this.editTitle='仓库新增';
        this.editForm = {
          Storageid:0,
          Storagename:'',
          Storagecode: '',
          Departid:null,
          Storagetype:'',
          Storagenature:'',
          Leasedate:'',
          Leasesdate:'',
          Leaseedate:'',
          Isenable:'Y',
          Isdefault:'N',
          Storageaddr:'',
          Storagearea:'',
          Linkname:'',
          Linkphone:'',
        };
      },
      //显示编辑界面
      f_Edit: function (index, row) {
        this.editFormVisible=true;
        this.editTitle='仓库编辑';
        this.editForm = Object.assign({}, row);

        if (this.editForm.Storagenature == 'ZLCK') {
          this.leasesshow = true;
          this.leaseeshow = true;
        }
        else {
          this.leasesshow = false;
          this.leaseeshow = false;
        }
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
            Pkid: row.Storageid,
          };
          this.$httpPost('Storage/DStorage',pars).then((res)=> {
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
              _this.$httpPost('Storage/SStorage', pars).then((res) => {
                if (res.success == 'ok') {
                  if (!res.addResult) {
                    _this.$alert('仓库名称已存在，请重新输入！', '提示', {
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
        this.$httpPost('Storage/GLoadConfig',{}).then((res)=> {
          if(res.success=='ok') {
            this.storageTypeList = res.storageType;
            this.storageNatureList = res.storageNature;
            this.departList=res.departList;
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
          storageName: this.filters.storageName,
          storageCode: this.filters.storageCode,
          storageType: this.filters.storageType,
          departId: 0,
        };
        let _this=this;
        this.$httpPost('Storage/GStorageList',pars).then((res)=> {
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
