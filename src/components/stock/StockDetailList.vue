<template>
  <section>

    <!--搜索-->
    <el-col :span="24" :class="this.Global.pageToolBarClass" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-select v-model="filters.stockType" clearable filterable placeholder="业务类型" style="width: 150px;">
            <el-option-group
              v-for="group in stockTypeList"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.Rccode"
                :label="item.Rcname"
                :value="item.Rccode">
              </el-option>
            </el-option-group>
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
               :header-cell-style="this.Global.headerCellStyle" >
      <el-table-column type="index" width="50"  label="序号"  header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Stockcode" label="库存流水号"  min-width="160"   header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Stockdate" label="库存时间"  min-width="150"   header-align="center"  align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.Stockdate | moment }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Rcname" label="业务类型"  min-width="80"   header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Brandname" label="品牌"  min-width="80" show-overflow-tooltip  header-align="center"   align="center">
      </el-table-column>
      <el-table-column prop="Producttypesname" label="产品类别"  min-width="100" show-overflow-tooltip  header-align="center"   align="center">
      </el-table-column>
      <el-table-column prop="Productname" label="产品名称" min-width="180" show-overflow-tooltip  header-align="center"   align="center">
      </el-table-column>
      <el-table-column prop="Pucount" label="库存数量" min-width="70" show-overflow-tooltip  header-align="center"   align="center">
      </el-table-column>
      <el-table-column prop="Changecount" label="变化量" min-width="70" show-overflow-tooltip  header-align="center"   align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.Changecount>0">
            <span style="color: #409EFF;">+{{scope.row.Changecount}}</span>
          </div>
          <div v-else-if="scope.row.Changecount<0">
            <span  style="color: #F56C6C;">{{scope.row.Changecount}}</span>
          </div>
          <div v-else>
            {{scope.row.Changecount}}
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

  </section>
</template>

<script>

  export default {
    data(){
      return {
        //表格高度
        tableHeight:this.Global.pagetableHeight,
        //列表界面数据
        filters: {
          stockType: '',
          stockId: 0,
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

        //资源
        stockTypeList:[],
      }
    },
    methods:{
      //资源加载
      f_ConfigLoad:function(){
        this.$httpPost('Stock/GStockConfig',{}).then((res)=> {
          if(res.success=='ok') {
            var stockIn=[];
            var stockOut=[];
            for (let i = 0; i < res.stockType.length; i++) {
              if (res.stockType[i].Rctype == 'STOCKINTYPE')
                stockIn.push(res.stockType[i]);
              else
                stockOut.push(res.stockType[i]);
            }
            this.stockTypeList=[{label: '入库类型', options: stockIn},{label: '出库类型', options: stockOut}];
          }
        }) .catch(function (error) {
          this.$message.error('数据错误！');
        });
      },
      //搜索事件
      f_Search:function() {
        this.listLoading = true;

        //url参数
        let stockId = this.Global.isNullOrEmpty(this.$route.query.stockId) ? 0 : this.$route.query.stockId;
        if (stockId > 0)
          this.filters.stockId = stockId;


        //资源加载
        this.f_ConfigLoad();

        let pars = {
          page: this.page,
          size: this.size,
          stockType: this.filters.stockType,
          stockId: this.filters.stockId,
          productName: this.filters.productName,
          Brandid: this.filters.Brandid,
          Producttypesid: this.filters.Producttypesid,
        };
        let _this = this;
        this.$httpPost('Stock/GStockDetailList', pars).then((res) => {
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

    },
    mounted(){
      this.f_Search();
    },
  }
</script>

<style scoped>
  @import '../../style/font-awesome/css/font-awesome.css';
</style>

