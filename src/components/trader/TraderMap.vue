<template>
  <div>
    <!--搜索-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-cascader
            :options="territoryidOptions"
            :props="{'value':'Valueid','label':'Cname'}"
            v-model="filters.Territoryid" change-on-select style="width:440px;">
          </el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" v-on:click="f_Search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <span style="color: red;">注：此功能需连网使用！</span>
        </el-form-item>
      </el-form>
    </el-col>

    <!--地图元素-->
    <div id="l-map"></div>


    <!--商户-->
    <el-table :data="resultData" highlight-current-row  border v-loading="listLoading" style="width: 100%; margin-top: 20px;"  :height="tableHeight">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column prop="Bunkname" label="商户名称" min-width="200"  header-align="center"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="Address" label="地址" min-width="200"  header-align="center"  show-overflow-tooltip>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
  import baidu from '../../oscripts/baidumap.js'
  export default {
    data() {
      return {
        //表格高度
        tableHeight:window.innerHeight-400+'px',
        filters: {
          Territoryid: [],
        },
        territoryidOptions: [],
        resultData:[],
        listLoading:false,
        //bmap对象
        bmap:'',
        map:'',
        index: 0,
        myGeo: '',
        adds: [
          // "武汉光谷国际大厦A座",
          // "庐阳区凤台路209号（凤台路与蒙城北路交叉口）",
          // "蜀山区金寨路217号(近安医附院公交车站)",
          // "蜀山区梅山路10号(近安徽饭店) ",
          // "蜀山区 长丰南路159号铜锣湾广场312室",
          // "合肥市寿春路93号钱柜星乐町KTV（逍遥津公园对面）",
          // "庐阳区长江中路177号",
          // "新站区胜利路89"
        ],
      }
    },
    methods: {
      //解析点击事件
      bdGEO: function () {
        var add = this.adds[this.index];
        for (let i = 0; i < this.adds.length; i++) {
          //循环延迟加载
          setTimeout(this.geocodeSearch(this.adds[i], i+1), 4000);
        }
      },
      //循环解析地址
      geocodeSearch: function (add,curIndex) {
        let _this = this;
        this.myGeo.getPoint(add, function (point) {
          if (point) {
            var address = new _this.bmap.Point(point.lng, point.lat);
            _this.addMarker(address, new _this.bmap.Label(curIndex + ":" + add, {offset: new _this.bmap.Size(20, -10)}));
          }
        }, "中国");
      },
      //地图打标记
      addMarker: function (point, label) {
        var marker = new this.bmap.Marker(point);
        this.map.addOverlay(marker);
        marker.setLabel(label);
      },

      //搜索
      f_Search:function () {
        this.listLoading=true;
        this.index=0;
        let _this = this;
        let pars = {
          city: this.filters.Territoryid
        };
        this.$httpPost('Bunk/GBunkMapList', pars).then((res) => {
          if (res.success == 'ok') {
            //console.log(res.dtMap);

            //清除标记
            var allOverlay =_this.map.getOverlays();
            for(let i = 0;i<allOverlay.length;i++) {
              _this.map.removeOverlay(allOverlay[i]);
            }

            _this. resultData=res.dtMap;
            _this.adds =[];
            for(let i=0;i<res.dtMap.length;i++){
              _this.adds.push(res.dtMap[i].Address+'（'+res.dtMap[i].Bunkname+'）');
            }
            _this.bdGEO();

          }
          _this.listLoading=false;
        });

      },
      //资源加载
      f_MyLoad:function () {
        let _this = this;
        let pars = {
          cityConfig: this.Global.cityConfig,
        };
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
                  let curFourList = _this.Enumerable.from(fourList).where(p => p.Parentid == curThreeModel.Pkid).orderBy(o => o.Pkid).toArray();
                  if (curFourList != null && curFourList.length > 0)
                    curThreeModel.children = curFourList;
                  threeChild.push(curThreeModel);
                }
                if (threeChild.length > 0)
                  curTwoModel.children = threeChild;
                twoChild.push(curTwoModel);
              }
              curOneModel.children = twoChild;
              _this.territoryidOptions.push(curOneModel);
            }

            //从其它页在过来传值
            let bunkName = _this.Global.isNullOrEmpty(_this.$route.query.bunkName) ? '' : _this.$route.query.bunkName;
            let address = _this.Global.isNullOrEmpty(_this.$route.query.address) ? '' : _this.$route.query.address;
            if(address!='') {
              _this.resultData = [{Bunkname: bunkName, Address: address}];
              _this.adds.push(address + '（' + bunkName + '）');
              _this.bdGEO();
            }
          }
        });
      },
    },
    mounted() {
      this.$nextTick(function() {
        let _this = this;
        let ak='GqADfOTbVxt7vx6xWQpdrmb0RltCwGB6';
        baidu.init().then(BMap => {
          _this.bmap=BMap;
          _this.map=new BMap.Map("l-map");
          //初始地图终心点与缩放倍数
          _this.map.centerAndZoom(new BMap.Point(117.269945,31.86713), 6);
          _this.map.enableScrollWheelZoom(true);
          _this.myGeo=new BMap.Geocoder();
          _this.f_MyLoad();
        });
      });
    },
  }

</script>

<style scoped>

</style>
<style>
  #l-map{width:100%; height: 350px;}
</style>
