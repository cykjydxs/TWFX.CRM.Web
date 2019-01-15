<template>
<div v-loading="listLoading">

  <el-row class="homehead">
    <el-col :span="18" style="padding:40px 0;background: #33CCCC;">
      <el-col :span="6" style="border-right: 1px solid white;">
        {{bunkCount}}<br>
        <span>合作商铺</span>
      </el-col>
      <el-col :span="6"  style="border-right: 1px solid white;">
        {{brandCount}}<br>
        <span>经营品牌</span>
      </el-col>
      <el-col :span="6" style="border-right: 1px solid white;">
        {{monthOrderCount}}<br>
        <span>本月订单</span>
      </el-col>
      <el-col :span="6" style="border: none;">
        {{yearOrderCount}}<br>
        <span>本年订单</span>
      </el-col>
    </el-col>
    <el-col :span="6" style="background:  #3091F2;padding:40px 0;">
      {{historyOrderCount}}<br>
      <span>历史订单</span>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="23">
      <div style="height: 30px;"></div>
    </el-col>
  </el-row>
  <!--图表-->
  <el-row>
    <el-col :span="12">
      <div id="chartBunk" style="width:100%; height:400px;"></div>
    </el-col>
    <el-col :span="12">
      <div id="chartProductTypes" style="width:100%; height:400px;"></div>
    </el-col>
  </el-row>

</div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    data() {
      return {
        listLoading: false,
        //汇总数
        bunkCount: 0,
        yearOrderCount: 0,
        monthOrderCount: 0,
        historyOrderCount: 0,
        brandCount: 0,

        //商铺图表
        chartBunk: null,
        //产品类别销量图表
        chartProductTypes: null,
        typesData: {legendData:[],seriesData:[]},
      }
    },
    methods: {

      //商铺图表
      f_ChartBunk: function (bunkHCount, bunkYCount, bunkCCount, bunkLCount) {
        this.chartBunk = echarts.init(document.getElementById('chartBunk'));
        this.chartBunk.setOption({
          title: {
            text: '商铺',
            subtext: '合作统计',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['合作客户', '意向客户', '潜在客户', '历史客户']
          },
          series: [
            {
              name: '商铺',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                {value: bunkHCount, name: '合作客户', itemStyle: {color: '#67C23A'}},
                {value: bunkYCount, name: '意向客户', itemStyle: {color: '#409EFF'}},
                {value: bunkCCount, name: '潜在客户', itemStyle: {color: '#E6A23C'}},
                {value: bunkLCount, name: '历史客户', itemStyle: {color: '#909399'}},
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
      },
      //产品类别销量图表
      f_ChartProductTypes: function (data) {
        this.chartProductTypes = echarts.init(document.getElementById('chartProductTypes'));
        this.chartProductTypes.setOption({
          title: {
            text: '产品类别',
            subtext: '销售统计（订单数）',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: 'right',
            data: data.legendData,
          },
          series: [
            {
              name: '产品类别',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: data.seriesData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
      },
      //产品类别销量图表数据处理
      f_ChartProductTypesData: function (curthis, resData) {
        let legendData = [];
        let seriesData = [];
        for (let i = 0; i < resData.length; i++) {
          legendData.push(resData[i].name);
          seriesData.push({
            name: resData[i].name,
            value: resData[i].value
          });
        }
        curthis.typesData.legendData = legendData;
        curthis.typesData.seriesData = seriesData;
      },

      //搜索
      f_Search: function () {
        this.listLoading = true;
        let _this = this;
        let parms = {};
        _this.$httpPost('Home/GSummaryInfo', parms).then((res) => {
          if (res.success == 'ok') {

            //汇总统计
            _this.bunkCount = res.bunkHCount;
            _this.brandCount = res.brandCount;
            _this.monthOrderCount = res.monthOrderCount;
            _this.yearOrderCount = res.yearOrderCount;
            _this.historyOrderCount = res.historyOrderCount;

            //商铺图表
            _this.f_ChartBunk(res.bunkHCount, res.bunkYCount, res.bunkCCount, res.bunkLCount);

            //产品类别销量图表
            let proTypeList = [];
            if (res.productTypesData != null && res.productTypesData.length > 0) {
              for (let m = 0; m < res.productTypesData.length; m++) {
                let sellCount=0;
                if (res.productTypesDataSell != null && res.productTypesDataSell.length > 0) {
                  for (let n = 0; n < res.productTypesDataSell.length; n++) {
                    if (res.productTypesDataSell[n].Producttypesname == res.productTypesData[m].Producttypesname)
                      sellCount = res.productTypesDataSell[n].Sellcount;
                  }
                }
                let pro = {name: res.productTypesData[m].Producttypesname, value: sellCount};
                proTypeList.push(pro);
              }
            }
            _this.f_ChartProductTypesData(_this, proTypeList);
            _this.f_ChartProductTypes(_this.typesData);

            _this.listLoading = false;

            //库存预警
            if(res.paramsSet!=null&&res.paramsSet.length>0) {
              let Warningenable = res.paramsSet[0].Warningenable == 1 ? true : false;
              if(Warningenable) {
                let Warningmin1 = res.paramsSet[0].Warningmin1;
                let Warningmin2 = res.paramsSet[0].Warningmin2;
                let Warningmax1 = res.paramsSet[0].Warningmax1;
                let yjMessage = '';
                if (res.dtYJ != null && res.dtYJ.length > 0) {
                  for (let m = 0; m < res.dtYJ.length; m++) {
                    if (res.dtYJ[m].Pucount > Warningmax1)
                      yjMessage = yjMessage + '<div style="clear:both; width: 100%; white-space: normal height: 24px; line-height: 24px; "><span style="font-weight: bold;">' +
                        res.dtYJ[m].Brandname + '</span>&nbsp;' + res.dtYJ[m].Productname + '：库存积压</div>';
                    if (res.dtYJ[m].Pucount >= Warningmin1 && res.dtYJ[m].Pucount <= Warningmin2)
                      yjMessage = yjMessage + '<div style="clear:both; width: 100%; white-space: normal height: 24px; line-height: 24px; "><span style="font-weight: bold;">' +
                        res.dtYJ[m].Brandname + '</span>&nbsp;' + res.dtYJ[m].Productname + '：库存不足</div>';
                  }
                }
                if (yjMessage != '') {
                  this.$notify.warning({
                    title: '库存预警',
                    message: yjMessage,
                    showClose: true,
                    duration: 10000,
                    dangerouslyUseHTMLString: true,
                    offset: 20,
                    position: 'bottom-right',
                  });
                }
              }
            }
          }
          else {
            _this.listLoading = false;
          }
        }).catch(function (error) {
          _this.$message.error('获取数据出错！');
          _this.listLoading = false;
        });
      },
    },
    mounted: function () {
      this.f_Search();
    },
    updated: function () {
    }
  }
</script>

<style scoped>



</style>
<style>
  .homehead{
    color: white;
    text-align: center;
    font-size: 24px;
  }
  .homehead span{
    font-size: 16px;
  }
</style>
