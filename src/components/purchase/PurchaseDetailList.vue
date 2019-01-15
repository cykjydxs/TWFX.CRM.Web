<template>
  <section>

    <!--搜索-->
    <el-col :span="24" :class="this.Global.pageToolBarClass" style="padding-bottom: 0px;">
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


    <!--列表-->
    <el-table :data="resultData" highlight-current-row  border v-loading="listLoading" style="width: 100%;" :height="tableHeight"
              :header-cell-style="this.Global.headerCellStyle">
      <el-table-column type="index" width="50"  label="序号"  header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Purchasecode" label="采购单号"  min-width="180"  header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Brandname" label="品牌" min-width="100"  header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Producttypesname" label="产品类别" min-width="100"  header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Productname" label="产品名称" min-width="180"  header-align="center">
      </el-table-column>
      <el-table-column prop="Pucount" label="采购数量" min-width="80"  header-align="center"  align="center" >
      </el-table-column>
      <el-table-column prop="Pumoney" label="采购金额/元" min-width="80"  header-align="center"  align="center">
        <template slot-scope="scope">
          {{ scope.row.Pumoney | money(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="Isinstock" label="订单状态" min-width="80"  header-align="center"  align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.Isinstock=='Y'">
            <el-tag type="success" size="mini">已完成</el-tag>
          </div>
          <div v-else>
            <el-tag type="info"  size="mini">执行中</el-tag>
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
          purchaseId: 0,
          Brandid:null,
          Producttypesid:null,
          productName:'',

        },
        page: 1,
        size: this.Global.pageSize,
        pageButtonType: this.Global.pageButtonType,
        total: 0,
        resultData: [],
        listLoading: false,


        //资源
        productTypeList:[],
        brandTypeList:[],
      }
    },
    methods: {

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

      //搜索
      f_Search: function () {
        this.listLoading = true;

        //url参数
        let purchaseId = this.Global.isNullOrEmpty(this.$route.query.purchaseId) ? 0 : this.$route.query.purchaseId;
        if (purchaseId > 0)
          this.filters.purchaseId = purchaseId;

        //资源加载
        this.f_ConfigLoad();

        let _this=this;
        let parms = {
          page: this.page,
          size: this.size,
          purchaseId:this.filters.purchaseId,
          productName: this.filters.productName,
          Brandid: this.filters.Brandid,
          Producttypesid: this.filters.Producttypesid,
        };
        _this.$httpPost('Purchase/GPurchaseDetailList', parms).then((res) => {
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
