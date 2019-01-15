<template>
  <section>

    <!--搜索-->
    <el-col :span="20" :class="this.Global.pageToolBarClass" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-select v-model="filters.Brandid" clearable filterable placeholder="品牌" style="width: 150px;">
            <el-option
              v-for="item in brandTypeList"
              :key="item.Brandid"
              :label="item.Brandname"
              :value="item.Brandid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.Producttypesid" clearable filterable placeholder="产品类别" style="width: 180px;">
            <el-option
              v-for="item in productTypeList"
              :key="item.Producttypesid"
              :label="item.Producttypesname"
              :value="item.Producttypesid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.productName" placeholder="产品名称" clearable></el-input>
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
      <el-table-column prop="Brandname" label="品牌"  min-width="80" show-overflow-tooltip  header-align="center"   align="center">
      </el-table-column>
      <el-table-column prop="Producttypesname" label="产品类别"  min-width="100" show-overflow-tooltip  header-align="center"   align="center">
      </el-table-column>
      <el-table-column prop="Productname" label="产品名称" min-width="150" show-overflow-tooltip  header-align="center">
        <!--<template slot-scope="scope">-->
          <!--<span style="color:#409EFF;">{{ scope.row.Productname }}</span>-->
        <!--</template>-->
      </el-table-column>
      <el-table-column prop="Barcode" label="条形码" min-width="100" show-overflow-tooltip  header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Productcode" label="产品编号" min-width="100" show-overflow-tooltip  header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Rcname" label="单位" min-width="50" show-overflow-tooltip  header-align="center"   align="center">
      </el-table-column>
      <el-table-column prop="Retailprice" label="产品售价/元" min-width="90" show-overflow-tooltip  header-align="center"   align="center">
        <template slot-scope="scope">
          {{ scope.row.Retailprice | money(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="Tradeprice" label="供货价/元" min-width="80" show-overflow-tooltip  header-align="center"   align="center">
        <template slot-scope="scope">
          {{ scope.row.Tradeprice | money(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="Ispecial" label="特价" min-width="50" show-overflow-tooltip  header-align="center"  align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.Ispecial=='Y'">是</div>
          <div v-else>否</div>
        </template>
      </el-table-column>
      <el-table-column prop="Productparms" label="规格参数" min-width="100" show-overflow-tooltip  header-align="center">
      </el-table-column>
      <!--<el-table-column prop="Component" label="库存数量" min-width="70" show-overflow-tooltip  header-align="center"   align="center">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="Component" label="累计销售" min-width="70" show-overflow-tooltip  header-align="center"   align="center">-->
      <!--</el-table-column>-->
      <el-table-column label="操作" width="150"  align="center">
        <template slot-scope="scope">
          <div v-if="pageButtonType===1">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button size="mini" type="primary" icon="el-icon-edit" circle   @click="f_Edit(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="停止销售" placement="top">
              <el-button size="mini" type="warning" icon="el-icon-caret-left" circle @click="f_Delete(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <!--<el-tooltip class="item" effect="dark" content="图片上传" placement="top">-->
              <!--<el-button size="mini" type="info" icon="el-icon-picture" circle @click="f_Picture(scope.$index, scope.row)"></el-button>-->
            <!--</el-tooltip>-->
          </div>
          <div v-else-if="pageButtonType===2">
            <el-button size="mini" @click="f_Edit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="f_Delete(scope.$index, scope.row)">停止销售</el-button>
          </div>
          <div v-else>
            <el-button type="text"  @click="f_Edit(scope.$index, scope.row)" >编辑</el-button>
            <el-button type="text"  @click="f_Delete(scope.$index, scope.row)">停止销售</el-button>
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
        <el-form-item label="品牌" prop="Brandid" :inline-message="true">
          <el-col :span="14">
            <el-select v-model="editForm.Brandid" filterable placeholder="请选择">
              <el-option
                v-for="item in brandTypeList"
                :key="item.Brandid"
                :label="item.Brandname"
                :value="item.Brandid">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="产品名称" prop="Productname" :inline-message="true" style="margin-top: 10px;">
          <el-col :span="14">
            <el-input v-model="editForm.Productname" placeholder="请输入产品名称" maxlength="100" :rows="2" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="条形码" prop="Barcode" :inline-message="true" style="margin-top: 10px;">
          <el-col :span="14">
            <el-input v-model="editForm.Barcode" placeholder="请输入条形码" maxlength="100" :rows="2" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="产品售价(元)" prop="Retailprice" :inline-message="true" style="margin-top: 10px;">
          <el-col :span="14">
            <el-input-number v-model="editForm.Retailprice" controls-position="right"  :precision="2"  :step="1" :min="1" :max="1000"  clearable>
            </el-input-number>
          </el-col>
        </el-form-item>
        <el-form-item label="是否特价产品" :inline-message="true" style="margin-top: 10px;">
          <el-col :span="12">
            <el-radio v-model="editForm.Ispecial" label="Y">是</el-radio>
            <el-radio v-model="editForm.Ispecial" label="N">否</el-radio>
          </el-col>
        </el-form-item>
      </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
            <el-form-item label="产品类别"  prop="Producttypesid" :inline-message="true" >
              <el-col :span="14">
                <el-select v-model="editForm.Producttypesid" filterable placeholder="请选择">
                  <el-option
                    v-for="item in productTypeList"
                    :key="item.Producttypesid"
                    :label="item.Producttypesname"
                    :value="item.Producttypesid">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="产品编号" prop="Productcode" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="14">
                <el-input v-model="editForm.Productcode" placeholder="请输入产品编号" maxlength="100" :rows="2" clearable></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="计量单位" prop="Meterunit" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="14">
                <el-select v-model="editForm.Meterunit" filterable placeholder="请选择">
                  <el-option
                    v-for="item in meterUnitList"
                    :key="item.Rccode"
                    :label="item.Rcname"
                    :value="item.Rccode">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="供货价(元)" prop="Tradeprice"  :inline-message="true" style="margin-top: 10px;">
              <el-col :span="14">
                <el-input-number v-model="editForm.Tradeprice" controls-position="right"  :precision="2"  :step="1" :min="1" :max="1000"  clearable>
                </el-input-number>
              </el-col>
            </el-form-item>

          </el-form>
        </el-col>
        <el-col :span="24">
          <el-form :model="editForm" label-width="120px"  ref="editForm2">
            <el-form-item label="规格参数" prop="Productparms" :inline-message="true">
              <el-col :span="16">
                <el-input type="textarea"  v-model="editForm.Productparms" placeholder="请输入产品规格参数，如：100cm*100cm*100cm" maxlength="100" :rows="2" clearable></el-input>
              </el-col>
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
          Brandid:null,
          Producttypesid:null,
          productName:'',
        },
        page:1,
        size:this.Global.pageSize,
        pageButtonType:this.Global.pageButtonType,
        total:0,
        resultData:[],
        listLoading: false,

        //编辑界面数据
        editTitle:'产品编辑',
        editFormVisible:false,
        editLoading: false,
        editFormRules1: {
          Brandid: [
            { required: true, message: '品牌不能为空', trigger: 'blur' },
          ],
          Productname: [
            { required: true, message: '产品名称不能为空', trigger: 'blur' },
          ],
          Barcode: [
            { required: true, message: '条形码不能为空', trigger: 'blur' },
          ],
          Retailprice: [
            { required: true, message: '产品售价不能为空', trigger: 'blur' },
          ],
        },
        editFormRules: {
          Producttypesid: [
            { required: true, message: '产品类别不能为空', trigger: 'blur' },
          ],
          Productcode: [
            { required: true, message: '产品编码不能为空', trigger: 'blur' },
          ],
          Meterunit: [
            { required: true, message: '计量单位不能为空', trigger: 'blur' },
          ],
          Tradeprice: [
            { required: true, message: '供货价不能为空', trigger: 'blur' },
          ],
        },
        editForm: {
          Productid:0,
          Brandid:null,
          Brandname: '',
          Producttypesid:null,
          Producttypesname:'',
          Productname:'',
          Productcode:'',
          Barcode:'',
          Meterunit:'',
          Retailprice:0,
          Tradeprice:0,
          Ispecial:'N',
          Productparms:'',
        },
        //资源
        productTypeList:[],
        brandTypeList:[],
        meterUnitList:[],
      }
    },
    methods:{
      //显示添加界面
      f_Add:function(){
        this.editFormVisible=true;
        this.editTitle='产品新增';
        this.editForm = {
          Productid:0,
          Brandid:null,
          Brandname: '',
          Producttypesid:null,
          Producttypesname:'',
          Productname:'',
          Productcode:'',
          Barcode:'',
          Meterunit:'',
          Retailprice:0,
          Tradeprice:0,
          Ispecial:'N',
          Productparms:'',
        };
      },
      //显示编辑界面
      f_Edit: function (index, row) {
        this.editFormVisible=true;
        this.editTitle='产品编辑';
        this.editForm = Object.assign({}, row);
      },
      //停售事件
      f_Delete: function (index, row) {
        this.$confirm('确定停售选中的产品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let pars= {
            Pkid: row.Productid,
            Isstop:'Y',
          };
          this.$httpPost('Product/SProductStop',pars).then((res)=> {
            if(res.success=='ok') {
              this.listLoading = false;
              this.$message({
                showClose: true,
                message: '产品停售成功',
                type: 'success'
              });
              this.f_Search();
            }
            else {
              this.$message({
                showClose: true,
                message: '产品停售失败',
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
      //产品图片上传
      f_Picture:function(index, row){
        this.$confirm('功能待开发', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

        }).catch(() => {});
      },
      //资源加载
      f_ConfigLoad:function(){
        this.$httpPost('Product/GProductEditConfig',{}).then((res)=> {
          if(res.success=='ok') {
            this.productTypeList = res.productType;
            this.brandTypeList = res.brandType;
            this.meterUnitList=res.meterUnitType;
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
          productName: this.filters.productName,
          Brandid: this.filters.Brandid,
          Producttypesid: this.filters.Producttypesid,
        };
        let _this=this;
        this.$httpPost('Product/GProductList',pars).then((res)=> {
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


      //提交事件
      f_EditSubmit:function () {
        let _this=this;
        this.$refs.editForm1.validate((valid1) => {
            _this.$refs.editForm.validate((valid) => {
              if (valid1&&valid) {
                this.editLoading = true;
                let pars = Object.assign({}, this.editForm);
                _this.$httpPost('Product/SProduct', pars).then((res) => {
                  if (res.success == 'ok') {
                    if (!res.addResult) {
                      _this.$alert('条形码已存在，请重新输入！', '提示', {
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
    },
    mounted(){
      this.f_Search();
    },
  }
</script>

<style scoped>
  @import '../../style/font-awesome/css/font-awesome.css';
</style>
