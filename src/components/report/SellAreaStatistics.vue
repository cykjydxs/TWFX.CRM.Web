<template>
  <section>
    <!--搜索-->
    <el-col :span="24" :class="this.Global.pageToolBarClass" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="统计年份">
          <el-select v-model="filters.year" placeholder="统计年份" clearable filterable  style="width: 120px;">
            <el-option
              v-for="item in yearList"
              :key="item.Yearid"
              :label="item.Yearname"
              :value="item.Yearid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="月份">
          <el-select v-model="filters.month" placeholder="统计月份" clearable filterable  style="width: 120px;">
            <el-option
              v-for="item in monthList"
              :key="item.Monthid"
              :label="item.Monthname"
              :value="item.Monthid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-cascader
            :options="territoryidOptions"
            :props="{'value':'Valueid','label':'Cname'}"
            v-model="filters.Territoryid" change-on-select clearable style="width:440px;">
          </el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" v-on:click="f_SearchOp">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-col>


    <!--统计图-->
    <el-col :span="24" v-loading="listLoading">
      <div style="width:100%; margin-top: 30px;">
        <div style="float:left; width:2%;">&nbsp;</div>
        <div id="chartDiv1" style=" float:left; width:96%;" :style="{height:chartHeight}"></div>
        <div style="float:left; width:2%;">&nbsp;</div>
      </div>
    </el-col>



  </section>
</template>

<script>
  import echarts from 'echarts'
  export default {
    data() {
      return {
        //表格高度
        tableHeight:this.Global.pagetableHeight,
        //列表界面
        filters: {
          year: '',
          month:'',
          Territoryid: [],
        },
        listLoading: false,
        chartHeight:'800px',
        //资源
        yearList:[],
        territoryidOptions:[],
        monthList:[{Monthname:'1',Monthid:1},
          {Monthname:'2',Monthid:2},
          {Monthname:'3',Monthid:3},
          {Monthname:'4',Monthid:4},
          {Monthname:'5',Monthid:5},
          {Monthname:'6',Monthid:6},
          {Monthname:'7',Monthid:7},
          {Monthname:'8',Monthid:8},
          {Monthname:'9',Monthid:9},
          {Monthname:'10',Monthid:10},
          {Monthname:'11',Monthid:11},
          {Monthname:'12',Monthid:12},
        ],
        //统计图
        chartStatistics: null,
        chartData: {stockInList:[],stockOutList:[]},
      }
    },
    methods: {

      //统计图
      f_Statistics: function (data) {
        this.chartStatistics = echarts.init(document.getElementById('chartDiv1'));
        this.chartStatistics.resize();
        this.chartStatistics.setOption({
          title: {
            text: '区域销售统计图',
            subtext: '金额统计（单位：元）',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['区域销售图']
          },
          grid: {
            containLabel: true
          },
          toolbox: {
            show : true,
            feature : {
              dataView : {
                show: true, readOnly: true,
                lang:['区域销售统计数据','关闭','刷新'],
                optionToContent: function (opt) {
                  let axisData = opt.yAxis[0].data; //坐标数据
                  let series = opt.series; //类型数据
                  //组装表头
                  let tdHeads = '<td  style="width:50%;">区域名称</td>';
                  tdHeads = tdHeads + '<td style="width:50%">销售金额</td>';
                  let table = '<table border="1" style="width:100%; border-collapse:collapse;font-size:14px;text-align:center">';
                  table = table + '<tbody><tr style="background-color: #ccc; height: 32px; line-height: :32px;">'+tdHeads+'</tr>';
                  //组装数据
                  let tdBodys = '';
                  for (let i = 0; i < axisData.length; i++) {
                    for (let j = 0; j < series.length; j++) {
                      tdBodys += '<td>' + series[j].data[i] + '</td>';
                    }
                    table += '<tr style="height: 24px; line-height: 24px;"><td style="text-align: center;">' + axisData[i] + '</td>' + tdBodys + '</tr>';
                    tdBodys = '';
                  }
                  table += '</tbody></table>';
                  return table;
                }
              },
              magicType : {show: true, type: ['line', 'bar']},
              restore : {show: true},
              saveAsImage : {show: true,title:'下载'}
            }
          },
          calculable : true,
          xAxis : [
            {
              type : 'value',
              boundaryGap: [0, 0.01],
            }
          ],
          yAxis : [
            {
              type: 'category',
              data:data.stockInList,
            }
          ],
          series : [
            {
              name:'区域销售图',
              type:'bar',
              data:data.stockOutList,
              markPoint : {
                data : [
                  {type : 'max', name: '最大值'},
                  {type : 'min', name: '最小值'}
                ]
              },
              markLine : {
                data : [
                  {type : 'average', name: '平均值'}
                ]
              }
            },
          ]
        });
      },




      //===============================================================
      //资源加载
      f_MyLoad:function () {
        let _this = this;
        let pars = {
          cityConfig: this.Global.cityConfig,
        };
        this.territoryidOptions=[];
        this.$httpPost('Bunk/GBunkMap', pars).then((res) => {
          if (res.success == 'ok') {
            //行政区域
            let oneList = _this.Enumerable.from(res.dtCity).where(p => p.Clevel == 2).orderBy(o => o.Pkid).toArray();
            let twoList = _this.Enumerable.from(res.dtCity).where(p => p.Clevel == 3).orderBy(o => o.Pkid).toArray();
            let threeList = _this.Enumerable.from(res.dtCity).where(p => p.Clevel == 4).orderBy(o => o.Pkid).toArray();
            let fourList = _this.Enumerable.from(res.dtCity).where(p => p.Clevel == 5).orderBy(o => o.Pkid).toArray();
            //一级
            for (var i = 0; i < oneList.length; i++) {
              let curOneModel = oneList[i];
              //二级
              let twoChild = [];
              let curTwoList = _this.Enumerable.from(twoList).where(p => p.Parentid == curOneModel.Pkid).orderBy(o => o.Pkid).toArray();
              for (var m = 0; m < curTwoList.length; m++) {
                let curTwoModel = curTwoList[m];
                //三级
                let threeChild = [];
                let curThreeList = _this.Enumerable.from(threeList).where(p => p.Parentid == curTwoModel.Pkid).orderBy(o => o.Pkid).toArray();
                for (var n = 0; n < curThreeList.length; n++) {
                  let curThreeModel = curThreeList[n];
                  //四级
                  // let curFourList = _this.Enumerable.from(fourList).where(p => p.Parentid == curThreeModel.Pkid).orderBy(o => o.Pkid).toArray();
                  // if (curFourList != null && curFourList.length > 0)
                  //   curThreeModel.children = curFourList;
                  threeChild.push(curThreeModel);
                }
                if (threeChild.length > 0)
                  curTwoModel.children = threeChild;
                twoChild.push(curTwoModel);
              }
              curOneModel.children = twoChild;
              _this.territoryidOptions.push(curOneModel);
            }

          }
        });
      },
      f_ConfigLoadYear:function(){
        let _this=this;
        _this.yearList=[];
        this.$httpPost('Report/GYear',{}).then((res)=> {
          if(res.success=='ok') {
            if (res.years != null && res.years.length > 0) {
              for (let m = 0; m < res.years.length; m++) {
                let model = {
                  Yearname: res.years[m],
                  Yearid: res.years[m]
                };
                _this.yearList.push(model);
              }
            }
          }
        }) .catch(function (error) {
          _this.$message.error('数据错误！');
        });
      },
      //搜索
      f_SearchOp:function() {
        if (this.filters.Territoryid != null && this.filters.Territoryid.length > 0) {
          if(this.filters.year==''&&this.filters.month!='')
          {
            this.$alert('请选择统计年份！', '提示', {
              confirmButtonText: '确定',
              type: 'error',
            });
          }
          else {
            let tId = this.filters.Territoryid[this.filters.Territoryid.length - 1].split('|')[0];
            this.f_Search(tId);
          }
        }
        else {
          this.$alert('请选择统计城市！', '提示', {
            confirmButtonText: '确定',
            type: 'error',
          });
        }
      },
      //搜索
      f_Search: function (tId) {
        this.listLoading = true;
        this.chartData={stockInList:[],stockOutList:[]};
        let curDate=new Date();

        //资源加载
        this.f_MyLoad();
        this.f_ConfigLoadYear();
        let _this=this;
        let parms = {
          year:this.filters.year,
          month:this.filters.month,
          territoryId:tId,
        };
        _this.$httpPost('Report/GSellAreaStatistics', parms).then((res) => {
          if (res.success == 'ok') {

            for (let i = 0; i < res.stockInList.length; i++) {
              _this.chartData.stockInList[i] = res.stockInList[i].Cname;
              _this.chartData.stockOutList[i] = 0;
              for (let m = 0; m < res.stockOutList.length; m++) {
                if ((',' + res.stockOutList[m].Territoryid).indexOf(',' + res.stockInList[i].Pkid + '|') > 0) {
                  let curMoney = _this.Global.toFloat(_this.Global.CallFloat(_this.chartData.stockOutList[i], _this.Global.toFloat(res.stockOutList[m].Scount), 0));
                  _this.chartData.stockOutList[i] = curMoney;
                }
              }
            }
            _this.f_Statistics(_this.chartData);
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
    },
    mounted() {
      this.f_Search(0);
    },
  }
</script>

<style scoped>

</style>
