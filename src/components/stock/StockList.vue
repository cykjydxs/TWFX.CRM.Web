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

    <!--列表-->
    <el-table :data="resultData" highlight-current-row  border v-loading="listLoading" style="width: 100%; " :height="tableHeight"
              :header-cell-style="this.Global.headerCellStyle" >
      <el-table-column type="index" width="50"  label="序号"  header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Stockcode" label="库存流水号"  min-width="150" show-overflow-tooltip  header-align="center"   align="center">
        <template slot-scope="scope">
          <div style="color: #409EFF; cursor: pointer;" @click="f_View(scope.$index, scope.row)">
            <span v-if="scope.$index==0 && page==1"><i class="el-icon-star-on"></i>&nbsp;</span>
            <span v-else></span>
            {{scope.row.Stockcode}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="Stockdate" label="库存时间"  min-width="150"   header-align="center"  align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.Stockdate | moment }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Rcname" label="业务类型"  min-width="100" show-overflow-tooltip  header-align="center"   align="center">
        <template slot-scope="scope">
          <span style="color: #409EFF; cursor: pointer;" @click="f_RecordBus(scope.$index, scope.row)">{{scope.row.Rcname}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="Recordid" label="业务单据" min-width="100" show-overflow-tooltip  header-align="center"  align="center">-->
      <!--</el-table-column>-->
      <el-table-column prop="Recorddesc" label="库存说明" min-width="150" show-overflow-tooltip  header-align="center" align="center">
      </el-table-column>
      <!--<el-table-column label="操作" width="100"  align="center">-->
        <!--<template slot-scope="scope">-->
          <!--<div v-if="pageButtonType===1">-->
            <!--<el-tooltip class="item" effect="dark" content="查看明细" placement="top">-->
              <!--<el-button size="mini" type="primary" icon="el-icon-view" circle   @click="f_View(scope.$index, scope.row)"></el-button>-->
            <!--</el-tooltip>-->
          <!--</div>-->
          <!--<div v-else-if="pageButtonType===2">-->
            <!--<el-button size="mini" @click="f_View(scope.$index, scope.row)">查看明细</el-button>-->
          <!--</div>-->
          <!--<div v-else>-->
            <!--<el-button type="text"  @click="f_View(scope.$index, scope.row)" >查看明细</el-button>-->
          <!--</div>-->
        <!--</template>-->
      <!--</el-table-column>-->
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
        filters:{
          stockType:'',
          CooperdateArray:'',
          startdate:'',
          enddate:'',
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
      //合作意向日期选择改变事件
      f_CooperdateArray: function () {
        if(this.filters.CooperdateArray==null){
          this.filters.startdate = null;
          this.filters.enddate = null;
        }
        else {
          this.filters.startdate = this.filters.CooperdateArray[0];
          this.filters.enddate = this.filters.CooperdateArray[1];
        }
      },
      //明细查看
      f_View:function(index, row){
        this.$router.push({
          path: '/stock/StockDetailList',
          query: {
            stockId: row.Stockid,
          },
        });
      },
      f_RecordBus:function(index,row){
        let recordBus=row.Recordbus;
        let pkid=row.Recordid;
        switch (recordBus) {
          case 'CGRK':
            this.$router.push({
              path: '/purchase/PurchaseList',
              query: {
                purchaseId: pkid,
              },
            });
            break;
          case 'XSCK':
            this.$router.push({
              path: '/sell/SellList',
              query: {
                sellId: pkid,
              },
            });
            break;
          case 'THRK':
            this.$router.push({
              path: '/sell/SellReturnList',
              query: {
                stockIOId: pkid,
              },
            });
            break;
          case 'BSCK':
            this.$router.push({
              path: '/stock/StockBadList',
              query: {
                stockIOId: pkid,
              },
            });
            break;
          case 'QTCK':
            this.$router.push({
              path: '/stock/StockOutList',
              query: {
                stockIOId: pkid,
              },
            });
            break;
          case 'QTRK':
            this.$router.push({
              path: '/stock/StockInList',
              query: {
                stockIOId: pkid,
              },
            });
            break;
          case 'ZZDRK':
          case 'CXDRK':
          case 'ZZDCK':
          case 'CXDCK':
            this.$router.push({
              path: '/stock/StockDetailList',
              query: {
                stockId: pkid,
              },
            });
            break;
        }
      },
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
      f_Search:function(){
        this.listLoading = true;

        //资源加载
        this.f_ConfigLoad();

        let pars= {
          page: this.page,
          size: this.size,
          stockType: this.filters.stockType,
          startDate: this.filters.startdate,
          endDate: this.filters.enddate,

        };
        let _this=this;
        this.$httpPost('Stock/GStockList',pars).then((res)=> {
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
