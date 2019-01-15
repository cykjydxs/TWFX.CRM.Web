<template>
  <section>

    <!--搜索-->
    <el-col :span="18" :class="this.Global.pageToolBarClass" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-select v-model="filters.supplierId" placeholder="请选择供应商" clearable filterable>
            <el-option
              v-for="item in supplierAllList"
              :key="item.Supplierid"
              :label="item.Suppliername"
              :value="item.Supplierid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.CooperdateArray"
            type="daterange"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"  @change="f_CooperdateArray" >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" v-on:click="f_Search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="6"  :class="this.Global.pageToolBarClass" style="padding-bottom: 0px; text-align: right;">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary"  @click="f_Add"><i class="fa fa-plus-circle" aria-hidden="true" style="margin-right: 6px;"></i>新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="f_Add"><i class="fa fa-arrow-circle-down" aria-hidden="true" style="margin-right: 6px;"></i>导出</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="resultData" highlight-current-row  border v-loading="listLoading" style="width: 100%;" :height="tableHeight"
              :header-cell-style="this.Global.headerCellStyle" :cell-style="this.Global.cellStyle">
      <el-table-column type="index" width="50"  label="序号"  header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Purchasecode" label="采购单号"  min-width="180"  show-overflow-tooltip  header-align="center" align="center">
        <template slot-scope="scope">
          <span style="color: #409EFF; cursor: pointer;" @click="f_View(scope.$index, scope.row)">{{scope.row.Purchasecode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Suppliername" label="供应商" min-width="180" show-overflow-tooltip   header-align="center"  align="left">
      </el-table-column>
      <el-table-column prop="Pucount" label="采购数量" min-width="70"  header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Pumoney" label="采购金额/元" min-width="80"  header-align="center"  align="center">
        <template slot-scope="scope">
          {{ scope.row.Pumoney | money(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="Isinstock" label="订单状态" min-width="70"  header-align="center"  align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.Isinstock=='Y'">
            <el-tag type="success" size="mini">已完成</el-tag>
          </div>
          <div v-else>
            <el-tag type="info"  size="mini">执行中</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="Puname" label="下单人" min-width="80" show-overflow-tooltip   header-align="center"  align="center">
      </el-table-column>
      <!--<el-table-column prop="Pudesc" label="采购说明" min-width="150"  show-overflow-tooltip  header-align="center"  align="center">-->
      <!--</el-table-column>-->
      <el-table-column prop="Pudate" label="采购日期"  min-width="150"   header-align="center"  align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.Pudate | moment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180"  align="center">
        <template slot-scope="scope">
          <div v-if="pageButtonType===1">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-button size="mini" type="info" icon="el-icon-view" circle  @click="f_ViewEdit(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="入库" placement="top" v-show="scope.row.Isinstock!='Y'">
              <el-button size="mini" type="primary" icon="el-icon-news" circle  @click="f_InStock(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top"  v-show="scope.row.Isinstock!='Y'">
              <el-button size="mini" type="primary" icon="el-icon-edit" circle   @click="f_Edit(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-show="scope.row.Isinstock!='Y'" >
              <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="f_Delete(scope.$index, scope.row)"></el-button>
            </el-tooltip>
          </div>
          <div v-else-if="pageButtonType===2">
            <el-button size="mini" @click="f_ViewEdit(scope.$index, scope.row)">查看</el-button>
            <el-button size="mini" @click="f_InStock(scope.$index, scope.row)" v-show="scope.row.Isinstock!='Y'">入库</el-button>
            <el-button size="mini" @click="f_Edit(scope.$index, scope.row)"  v-show="scope.row.Isinstock!='Y'">编辑</el-button>
            <el-button size="mini" type="danger"  @click="f_Delete(scope.$index, scope.row)" v-show="scope.row.Isinstock!='Y'" >删除</el-button>
          </div>
          <div v-else>
            <el-button type="text"  @click="f_ViewEdit(scope.$index, scope.row)">查看</el-button>
            <el-button type="text"  @click="f_InStock(scope.$index, scope.row)" v-show="scope.row.Isinstock!='Y'">入库</el-button>
            <el-button type="text"  @click="f_Edit(scope.$index, scope.row)"  v-show="scope.row.Isinstock!='Y'">编辑</el-button>
            <el-button type="text"  @click="f_Delete(scope.$index, scope.row)"  v-show="scope.row.Isinstock!='Y'">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-col :span="4"  :class="this.Global.pageBarClass" >
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
    <el-dialog :title="editTitle"  :visible.sync="editFormVisible"  width="65%"  :close-on-click-modal="false">
      <div slot="title" style="font-size: 14px; font-weight: bold; color: #606266; " >
        <i class="fa fa-th-large" aria-hidden="true" style="margin-right: 10px;"></i>{{editTitle}}
      </div>
      <el-tabs v-model="activeTabName" type="border-card" style="margin:-20px 0px -20px 0px; border:#DCDFE6 1px solid; height: 450px;">
        <el-tab-pane label="基本信息" name="tabedit">
          <span slot="label"><i class="el-icon-tickets"></i> 基本信息</span>
          <el-form :model="editForm" label-width="180px" :rules="editFormRules" ref="editForm" style="margin:-20px -20px -20px -20px; border:#DCDFE6 1px solid;">
            <el-form-item><div style="height: 30px;"></div></el-form-item>
            <el-form-item label="供应商" prop="Suppliername" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="12">
                <el-input v-model.trim="editForm.Suppliername" placeholder="请选择供应商" maxlength="30" :disabled="true">
                  <el-button slot="append" icon="el-icon-search" @click.native="f_DataSelectSupplier"></el-button>
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="采购日期" prop="Pudate" :inline-message="true">
              <el-col :span="12">
                <el-date-picker
                  v-model="editForm.Pudate"
                  type="date"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期" :clearable="false">
                </el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="采购人" prop="Puname" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="8">
                <el-input v-model="editForm.Puname" placeholder="请输入采购人" maxlength="100" clearable  ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="采购说明" prop="Pudesc" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="16">
                <el-input type="textarea" v-model="editForm.Pudesc" placeholder="请输入采购说明" maxlength="100" :rows="2" clearable></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="采购金额" prop="Pumoney" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="8">
                <el-input v-model="editForm.Pumoney" :disabled="true" placeholder="采购金额" maxlength="100" style="width:180px;" >
                  <template slot="append">元</template>
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="采购数量" prop="Pucount" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="12">
                <el-input v-model="editForm.Pucount" :disabled="true" placeholder="采购金额" maxlength="100" style="width:180px;" >
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item></el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="采购产品" name="tablist">
          <span slot="label"><i class="el-icon-circle-plus"></i> 采购产品</span>
          <div style="text-align: left; height: 40px; margin-top: 0px; padding-right: 0px;">
            <el-button type="primary" round size="mini" icon="el-icon-plus" @click="f_ProductAdd">添加产品</el-button>
          </div>
          <el-table :data="puData" highlight-current-row  border v-loading="listLoading" style="width: 100%; "  :height="350" :cell-style="this.Global.cellStyle">
            <el-table-column prop="Brandname" label="品牌"  min-width="100"  show-overflow-tooltip  header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="Producttypesname" label="产品类别" min-width="100" show-overflow-tooltip   header-align="center"  align="center">
            </el-table-column>
            <el-table-column prop="Productname" label="产品名称" min-width="150"  header-align="center"  align="center">
            </el-table-column>
            <el-table-column prop="Puprice" label="采购单价/元" min-width="130"  header-align="center"  align="center">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.Puprice" controls-position="right" :precision="2" :step="1" :min="0" :max="100000"
                                 @change="f_Pucount(scope.row)" style="width:130px;"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="Pucount" label="采购数量" min-width="130"  header-align="center"  align="center">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.Pucount" controls-position="right" :precision="0" :step="1" :min="0" :max="100000"
                                 @change="f_Pucount(scope.row)" style="width:130px;"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="Pumoney" label="采购金额" min-width="80"  header-align="center"  align="center">
              <template slot-scope="scope">
                {{ scope.row.Pumoney | money(2) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60"  align="center">
              <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="删除" placement="top" >
                    <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="f_ProductDelete(scope.$index, scope.row)"></el-button>
                  </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer" style="text-align: center; ">
        <el-button type="primary" @click.native="f_EditSubmit" :loading="editLoading" size="medium">保存</el-button>
        <el-button @click.native="f_EditClose" size="medium">取消</el-button>
      </div>
    </el-dialog>

    <!--查看界面-->
    <el-dialog :title="editTitle"  :visible.sync="viewFormVisible"  width="65%"  :close-on-click-modal="false">
      <div slot="title" style="font-size: 14px; font-weight: bold; color: #606266; " >
        <i class="fa fa-th-large" aria-hidden="true" style="margin-right: 10px;"></i>采购查看
      </div>
      <el-tabs v-model="activeTabName" type="border-card" style="margin:-20px 0px -20px 0px; border:#DCDFE6 1px solid; height: 450px;">
        <el-tab-pane label="基本信息" name="tabedit">
          <span slot="label"><i class="el-icon-tickets"></i> 基本信息</span>
          <el-form :model="editForm" label-width="180px" :rules="editFormRules" ref="editForm" style="margin:-20px -20px -20px -20px; border:#DCDFE6 1px solid;">
            <el-form-item><div style="height: 30px;"></div></el-form-item>
            <el-form-item label="供应商" prop="Suppliername" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="12">
                <el-input v-model.trim="editForm.Suppliername" placeholder="请输入供应商名称" maxlength="30" :disabled="true"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="采购日期" prop="Pudate" :inline-message="true">
              <el-col :span="12">
                <el-date-picker
                  v-model="editForm.Pudate"
                  type="date"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期" :clearable="false"  :disabled="true">
                </el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="采购人" prop="Puname" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="8">
                <el-input v-model="editForm.Puname" placeholder="请输入采购人" maxlength="100" clearable  :disabled="true"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="采购说明" prop="Pudesc" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="16">
                <el-input type="textarea" v-model="editForm.Pudesc" placeholder="请输入采购说明" maxlength="100" :rows="2" clearable :disabled="true"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="采购金额" prop="Pumoney" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="8">
                <el-input v-model="editForm.Pumoney" :disabled="true" placeholder="采购金额" maxlength="100" style="width:180px;" >
                  <template slot="append">元</template>
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="采购数量" prop="Pucount" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="12">
                <el-input v-model="editForm.Pucount" :disabled="true" placeholder="采购金额" maxlength="100" style="width:180px;" >
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item></el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="采购产品" name="tablist">
          <span slot="label"><i class="el-icon-circle-plus"></i> 采购产品</span>
          <el-table :data="puData" highlight-current-row  border v-loading="listLoading" style="width: 100%; "  :height="350" >
            <el-table-column prop="Brandname" label="品牌"  min-width="100"  show-overflow-tooltip  header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="Producttypesname" label="产品类别" min-width="100" show-overflow-tooltip   header-align="center"  align="center">
            </el-table-column>
            <el-table-column prop="Productname" label="产品名称" min-width="150"  header-align="center"  align="center">
            </el-table-column>
            <el-table-column prop="Puprice" label="采购单价/元" min-width="130"  header-align="center"  align="center">
              <template slot-scope="scope">
                {{ scope.row.Puprice | money(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="Pucount" label="采购数量" min-width="130"  header-align="center"  align="center">
            </el-table-column>
            <el-table-column prop="Pumoney" label="采购金额" min-width="80"  header-align="center"  align="center">
              <template slot-scope="scope">
                {{ scope.row.Pumoney | money(2) }}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" style="text-align: center; ">
        <el-button @click.native="f_ViewClose" size="medium">取消</el-button>
      </div>
    </el-dialog>

    <!--供应商选择-->
    <el-dialog  :visible.sync="dataSelectsupplierVisible"  width="60%"  :close-on-click-modal="false">
      <div slot="title" style="font-size: 14px; font-weight: bold; color: #606266;" >
        <i class="fa fa-th-large" aria-hidden="true" style="margin-right: 10px;"></i>供应商选择
      </div>
      <!--搜索-->
      <div style="margin-top: -10px;">
        <el-form :inline="true" :model="supplierFilters">
          <el-form-item>
            <el-input v-model="supplierFilters.Suppliername" placeholder="供应商名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" v-on:click="f_DataSelecSupplierSearch">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--列表-->
      <el-table :data="supplierList" highlight-current-row  border v-loading="dataSelectProductLoading" style="width: 100%;" height="300"
                @row-click="f_DataSelectSupplierClick" @row-dblclick="f_DataSelectSupplierDbClick" :header-cell-style="this.Global.headerCellStyle" :cell-style="this.Global.cellStyle">
        <el-table-column type="index" width="60"  label="序号"  header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="Suppliername" label="供应商名称"  min-width="200"  header-align="center"  align="center"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="Supplierdesc" label="供应商描述" min-width="200"  header-align="center"  show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div style="margin-top: 10px;">
        <el-pagination
          background
          @current-change="handleSupplierCurrentChange"
          :current-page="suppage"
          :page-size="size"
          layout="total, prev, pager, next, jumper"
          :total="suptotal" style="float:right;">
        </el-pagination>
      </div>
      <!--按钮-->
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click.native="f_DataSelectSupplierChoose" :loading="editLoading" size="medium">选择</el-button>
        <el-button @click.native="f_DataSelectSupplierClose" size="medium">取消</el-button>
      </div>
    </el-dialog>

    <!--产品选择-->
    <el-dialog  :visible.sync="dataSelectProductVisible"  width="60%"  :close-on-click-modal="false">
      <div slot="title" style="font-size: 14px; font-weight: bold; color: #606266;" >
        <i class="fa fa-th-large" aria-hidden="true" style="margin-right: 10px;"></i>产品选择
      </div>
      <!--搜索-->
      <div style="margin-top: -10px;">
        <el-form :inline="true" :model="productFilters">
          <el-form-item>
            <el-select v-model="productFilters.Brandid" clearable filterable placeholder="品牌" style="width: 150px;">
              <el-option
                v-for="item in brandTypeList"
                :key="item.Brandid"
                :label="item.Brandname"
                :value="item.Brandid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="productFilters.Producttypesid" clearable filterable placeholder="产品类别" style="width: 180px;">
              <el-option
                v-for="item in productTypeList"
                :key="item.Producttypesid"
                :label="item.Producttypesname"
                :value="item.Producttypesid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="productFilters.productName" placeholder="产品名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" v-on:click="f_DataSelectProductSearch">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--列表-->
      <el-table :data="productList" highlight-current-row  border v-loading="dataSelectProductLoading" style="width: 100%;" height="300"
                @row-click="f_DataSelectClick" @row-dblclick="f_DataSelectDbClick" :header-cell-style="this.Global.headerCellStyle" :cell-style="this.Global.cellStyle">
        <el-table-column type="index" width="60"  label="序号"  header-align="center"  align="center">
        </el-table-column>
        <el-table-column prop="Brandname" label="品牌"  min-width="100"  header-align="center"  align="center">
        </el-table-column>
        <el-table-column prop="Producttypesname" label="产品类别" min-width="100"  align="center" header-align="center">
        </el-table-column>
        <el-table-column prop="Productname" label="产品名称" min-width="180"  header-align="center">
        </el-table-column>
        <el-table-column prop="Rcname" label="计量单位"  min-width="80"   header-align="center"  align="center">
        </el-table-column>
      </el-table>
      <!--分页-->
      <div style="margin-top: 10px;">
        <el-pagination
          background
          @current-change="handleProductCurrentChange"
          :current-page="propage"
          :page-size="size"
          layout="total, prev, pager, next, jumper"
          :total="prototal" style="float:right;">
        </el-pagination>
      </div>
      <!--按钮-->
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click.native="f_DataSelectProductChoose" :loading="editLoading" size="medium">选择</el-button>
        <el-button @click.native="f_DataSelectProductClose" size="medium">取消</el-button>
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
          supplierName: '',
          supplierId: '',
          CooperdateArray:'',
          startDate:'',
          endDate:'',
          purchaseId:0,
        },
        page: 1,
        size: this.Global.pageSize,
        pageButtonType: this.Global.pageButtonType,
        total: 0,
        resultData: [],
        listLoading: false,

        //编辑界面
        puData:[],
        activeTabName:'tabedit',
        editTitle: '',
        editFormVisible: false,
        editLoading: false,
        editFormRules: {
          Suppliername:[
            {required: true, message: '供应商不能为空', trigger: 'blur'}
          ],
          Pudate: [
            {required: true, message: '采购日期不能为空', trigger: 'blur'}
          ],
        },
        editForm: {
          Purchaseid: 0,
          Supplierid:0,
          Suppliername:'',
          Pudate: new Date(),
          Puname:'',
          Pudesc: '',
          Pumoney:0,
          Pucount:0,
        },
        //查看界面
        viewFormVisible: false,

        //供应商
        suppage: 1,
        suptotal:0,
        supplierList:[],//供应商列表
        dataSelectsupplierVisible:false,
        dataSelectsupplierLoading:false,
        supplierFilters: {
          Suppliername: '',
        },
        supplierRow:{},//供应商选择行

        //产品选择
        propage: 1,
        prototal:0,
        productList:[],//产品列表
        dataSelectProductVisible:false,
        dataSelectProductLoading:false,
        productFilters: {
          Brandid: null,
          Producttypesid: null,
          productName: '',
        },
        productRow:{},//产品选择行

        //资源
        productTypeList:[],
        brandTypeList:[],
        supplierAllList:[],
        trueName:'',
      }
    },
    methods: {
      //日期选择改变事件
      f_CooperdateArray: function () {
        if(this.filters.CooperdateArray==null){
          this.filters.startDate = null;
          this.filters.endDate = null;
        }
        else {
          this.filters.startDate = this.filters.CooperdateArray[0];
          this.filters.endDate = this.filters.CooperdateArray[1];
        }
      },
      //添加
      f_Add: function () {
        var mydate = new Date();
        mydate.setHours(mydate.getHours() + 8);
        this.editFormVisible=true;
        this.editTitle='采购新增';
        this.editForm = {
          Purchaseid: 0,
          Supplierid: 0,
          Suppliername: '',
          Pudate: mydate,
          Puname: this.trueName,
          Pudesc: '',
          Pumoney: 0,
          Pucount: 0,
        };
        this.puData=[];
        this.productRow={};
        this.supplierRow={};
      },
      //显示编辑界面
      f_Edit: function (index, row) {
        this.editFormVisible = true;
        this.editTitle = '采购编辑';
        this.editForm = Object.assign({}, row);
        this.puData=[];
        this.productRow={};
        this.supplierRow={};
        this.activeTabName='tabedit';
        this.f_EditGetDetail(row.Purchaseid);
      },
      //编辑
      f_EditGetDetail:function(pkid){
        this.listLoading=true;
        let pars= {
          Purchaseid: pkid,
        };
        let _this=this;
        this.$httpPost('Purchase/GPurchaseEdit',pars).then((res)=> {
          if(res.success=='ok') {
            _this.puData = res.dtPuDetail;
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
      //单行计算
      f_Pucount:function(row) {
        row.Pumoney = (row.Puprice * row.Pucount).toFixed(2);
        this.f_AllCom();
      },
      //总钱计算
      f_AllCom:function(){
        let allCount = 0;
        let allMoney = 0;
        for (let i = 0; i < this.puData.length; i++) {
          allCount =this.Global.toFloat(this.Global.CallFloat(allCount,this.Global.toFloat(this.puData[i].Pucount),0));
          allMoney =this.Global.toFloat(this.Global.CallFloat(allMoney,this.Global.toFloat(this.puData[i].Pumoney),0));
        }
        this.editForm.Pucount = allCount;
        this.editForm.Pumoney = allMoney.toFixed(2);
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
          let pars= {
            Pkid: row.Purchaseid,
          };
          _this.$httpPost('Purchase/DPurchase',pars).then((res)=> {
            _this.listLoading = false;
            if(res.success=='ok') {
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
          }) .catch(function (error) {
            _this.$message.error('数据错误！');
            _this.listLoading = false;
          });
        }).catch(() => {});
      },
      //入库
      f_InStock:function(index,row){
        let _this=this;
        this.$confirm('入库会生成库存流水，确定入库吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.listLoading = true;
          let pars= {
            Pkid: row.Purchaseid,
          };
          _this.$httpPost('Purchase/SInStock',pars).then((res)=> {
            _this.listLoading = false;
            if(res.success=='ok') {
              _this.listLoading = false;
              _this.$message({
                showClose: true,
                message: '操作成功',
                type: 'success'
              });
              _this.f_Search();
            }
            else {
              _this.$message({
                showClose: true,
                message: '操作失败',
                type: 'error'
              });
              _this.listLoading = false;
            }
          }) .catch(function (error) {
            _this.$message.error('数据错误！');
            _this.listLoading = false;
          });
        }).catch(() => {});
      },
      //查看明细
      f_View:function(index,row){
        this.$router.push({
          path: '/purchase/PurchaseDetailList',
          query: {
            purchaseId: row.Purchaseid,
          },
        });
      },
      //提交事件
      f_EditSubmit:function () {
        let _this=this;
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            if(_this.puData==null||_this.puData.length<=0) {
              this.$alert('采购产品不能为空！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
            }
            else {
              _this.editLoading = true;
              let pars = {
                baseInfo: _this.editForm,
                detailInfo: _this.puData
              };
              _this.$httpPost('Purchase/SPurchase', pars).then((res) => {
                if (res.success == 'ok') {
                  _this.editLoading = false;
                  _this.$message({
                    showClose: true,
                    message: '保存成功',
                    type: 'success'
                  });
                  _this.editFormVisible = false;
                  _this.f_Search();
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
          }
        });
      },
      //提交取消事件
      f_EditClose:function () {
        this.$refs['editForm'].resetFields();
        this.editFormVisible = false;
      },


      //===============================================================
      //查看
      f_ViewEdit:function(index,row){
        this.viewFormVisible=true;
        this.editTitle = '采购编辑';
        this.editForm = Object.assign({}, row);
        this.productRow={};
        this.supplierRow={};
        this.activeTabName='tabedit';
        this.f_EditGetDetail(row.Purchaseid);
      },
      f_ViewClose:function(index,row){
        this.viewFormVisible=false;
      },

      //===============================================================
      //产品新增
      f_ProductAdd: function () {
        this.dataSelectProductVisible=true;
      },
      //产品搜索
      f_DataSelectProductSearch:function(){
        this.dataSelectProductLoading=true;
        let pars= {
          page: this.propage,
          size: this.size,
          productName: this.productFilters.productName,
          Brandid: this.productFilters.Brandid,
          Producttypesid: this.productFilters.Producttypesid,
        };
        let _this=this;
        this.$httpPost('Product/GProductList',pars).then((res)=> {
          if(res.success=='ok') {
            _this.productList = res.dtData;
            _this.prototal=res.total;
            _this.dataSelectProductLoading = false;
          }
          else {
            _this.dataSelectProductLoading = false;
          }
        }) .catch(function (error) {
          _this.$message.error('数据错误！');
          _this.dataSelectProductLoading = false;
        });
      },
      //产品分页
      handleProductCurrentChange(val) {
        this.propage = val;
        this.f_DataSelectProductSearch();
      },
      //产品单击事件
      f_DataSelectClick:function(row, event, column){
        this.productRow = row;
      },
      //产品双击事件
      f_DataSelectDbClick:function(row, event, column){
        this.productRow = row;
        this.f_DataSelectProductChoose();
      },
      //产品选择事件
      f_DataSelectProductChoose:function(){
        if (this.Global.isNullOrEmpty(this.productRow.Productid)) {
          this.$alert('请选择数据', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }
        else {
          this.dataSelectProductVisible = false;
          //不存在则添加
          let isExistProduct=false;
          for(let i=0;i<this.puData.length;i++){
            if(this.puData[i].Productid==this.productRow.Productid){
              isExistProduct=true;
              break;
            }
          }
          if(!isExistProduct) {
            let model = {
              Brandid: this.productRow.Brandid,
              Brandname: this.productRow.Brandname,
              Producttypesname: this.productRow.Producttypesname,
              Productid: this.productRow.Productid,
              Productname: this.productRow.Productname,
              Pucount: 0, Puprice: 0, Pumoney: 0
            };
            this.puData.push(model);
          }
        }
      },
      //产品选择关闭
      f_DataSelectProductClose:function(){
        this.dataSelectProductVisible=false;
      },
      //产品选择删除
      f_ProductDelete:function(index, row) {
        if (index > -1) {
          this.puData.splice(index, 1);
        }
      },

      //===============================================================
      //供应商选择事件
      f_DataSelectSupplier:function() {
        this.dataSelectsupplierVisible = true;
      },
      //供应商搜索
      f_DataSelecSupplierSearch:function(){
        this.dataSelectsupplierLoading=true;
        let pars= {
          page: this.suppage,
          size: this.size,
          supplierName: this.supplierFilters.Suppliername,
        };
        let _this=this;
        this.$httpPost('Supplier/GSupplierList',pars).then((res)=> {
          if(res.success=='ok') {
            _this.supplierList = res.dtData;
            _this.suptotal=res.total;
            _this.dataSelectsupplierLoading = false;
          }
          else {
            _this.dataSelectsupplierLoading = false;
          }
        }) .catch(function (error) {
          _this.$message.error('数据错误！');
          _this.dataSelectsupplierLoading = false;
        });

      },
      //供应商分页
      handleSupplierCurrentChange(val) {
        this.suppage = val;
        this.f_DataSelecSupplierSearch();
      },
      //供应商单击事件
      f_DataSelectSupplierClick:function(row, event, column){
        this.supplierRow = row;
      },
      //供应商双击事件
      f_DataSelectSupplierDbClick:function(row, event, column){
        this.supplierRow = row;
        this.f_DataSelectSupplierChoose();
      },
      //供应商选择事件
      f_DataSelectSupplierChoose:function(){
        this.dataSelectsupplierVisible=false;
        if (this.Global.isNullOrEmpty(this.supplierRow.Supplierid)) {
          this.$alert('请选择数据', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }
        else{
          this.editForm.Supplierid=this.supplierRow.Supplierid;
          this.editForm.Suppliername=this.supplierRow.Suppliername;
        }
      },
      //供应商选择关闭
      f_DataSelectSupplierClose:function(){
        this.dataSelectsupplierVisible=false;
      },


      //===============================================================
      //资源加载
      f_ConfigLoad:function(){
        let _this=this;
        this.$httpPost('Purchase/GEditConfig',{}).then((res)=> {
          if(res.success=='ok') {
            _this.productTypeList = res.productType;
            _this.brandTypeList = res.brandType;
            _this.supplierAllList = res.supplierAllList;
            _this.trueName=res.trueName;
          }
        }) .catch(function (error) {
          _this.$message.error('数据错误！');
        });
      },
      //搜索
      f_Search: function () {
        this.listLoading = true;

        //资源加载
        this.f_ConfigLoad();
        this.f_DataSelectProductSearch();
        this.f_DataSelecSupplierSearch();

        //url参数
        let purchaseId = this.Global.isNullOrEmpty(this.$route.query.purchaseId) ? 0 : this.$route.query.purchaseId;
        if (purchaseId > 0)
          this.filters.purchaseId = purchaseId;

        let _this=this;
        let parms = {
          page: this.page,
          size: this.size,
          supplierName: this.filters.supplierName,
          supplierId:this.filters.supplierId,
          startDate:this.filters.startDate,
          endDate:this.filters.endDate,
          purchaseId:this.filters.purchaseId,
        };
        _this.$httpPost('Purchase/GPurchaseList', parms).then((res) => {
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
