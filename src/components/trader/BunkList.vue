<template>
  <section>

    <!--搜索-->
    <el-col :span="20" :class="this.Global.pageToolBarClass" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.bunkName" placeholder="商铺名称" clearable style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.traderName" placeholder="商户名称" clearable style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.Businessstate" placeholder="经营情况" clearable style="width: 150px;">
            <el-option
              v-for="item in businessStateList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.Intention" placeholder="合作意向" clearable style="width: 150px;">
            <el-option
              v-for="item in intentionList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" v-on:click="f_Search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="4" :class="this.Global.pageToolBarClass" style="padding-bottom: 0px; text-align: right;">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary"  @click="f_Add"><i class="fa fa-plus-circle" aria-hidden="true" style="margin-right: 6px;"></i>新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="resultData" highlight-current-row  border v-loading="listLoading" style="width: 100%; font-size: 14px;"  :height="tableHeight"
              :header-cell-style="this.Global.headerCellStyle" :cell-style="this.Global.cellStyle">
      <el-table-column type="index" width="50"  label="序号"  header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Bunkname" label="商铺名称"  min-width="200"  header-align="center"  show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.Bunkname}}
        </template>
      </el-table-column>
      <el-table-column prop="Tradername" label="所属商户" min-width="200"  header-align="center"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="Sellcount" label="订单数量" min-width="80"  header-align="center" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="color:#F56C6C;">{{scope.row.Sellcount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Tradertype" label="商户分类" min-width="80"  header-align="center"  align="center" >
        <template slot-scope="scope">
          <label v-if="scope.row.Tradertype==='INDIVIDUAL'">个体商户</label>
          <label v-else-if="scope.row.Tradertype==='COMPANY'">公司</label>
          <label v-else>--</label>
        </template>
      </el-table-column>

      <el-table-column prop="Businessstate" label="经营情况" min-width="80"  header-align="center" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>开业日期：{{ myMoment( scope.row.Openstartdate).format("YYYY-MM-DD")}}</p>
            <p v-if="scope.row.Businessstate===3">停业日期：{{ myMoment( scope.row.Openenddate).format("YYYY-MM-DD")}}</p>
            <div slot="reference" class="name-wrapper">
              <label v-if="scope.row.Businessstate===1"><el-tag type="success" size="mini">营业</el-tag></label>
              <label v-else-if="scope.row.Businessstate===2"><el-tag type="warning" size="mini">歇业</el-tag></label>
              <label v-else-if="scope.row.Businessstate===3"><el-tag type="info" size="mini">停业</el-tag></label>
              <label v-else>--</label>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="Businessnature" label="经营性质" min-width="90" header-align="center" align="center"  >
        <template slot-scope="scope">
          <label v-if="scope.row.Businessnature===1">代理</label>
          <label v-else-if="scope.row.Businessnature===2">加盟</label>
          <label v-else-if="scope.row.Businessnature===3">直营</label>
          <label v-else-if="scope.row.Businessnature===4">直营+代理</label>
          <label v-else-if="scope.row.Businessnature===5">直营+加盟</label>
          <label v-else>--</label>
        </template>
      </el-table-column>
      <el-table-column prop="Intention" label="合作意向" min-width="100"  header-align="center" align="center">
        <template slot-scope="scope">
          <label v-if="scope.row.Intention===1"><el-tag type="success" size="mini">合作客户</el-tag></label>
          <label v-else-if="scope.row.Intention===2"><el-tag size="mini">意向客户</el-tag></label>
          <label v-else-if="scope.row.Intention===3"><el-tag type="warning" size="mini">潜在客户</el-tag></label>
          <label v-else-if="scope.row.Intention===9"><el-tag type="info" size="mini">历史客户</el-tag></label>
          <label v-else>--</label>
        </template>
      </el-table-column>
      <el-table-column prop="Levelname" label="商铺等级" min-width="120"  header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Visitcount" label="拜访次数" min-width="120"  header-align="center"  align="center">
      </el-table-column>
      <el-table-column label="联系人" min-width="100"  header-align="center"  align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <table>
              <tr>
                <td class="tdTitle">姓名</td>
                <td class="tdValue">{{ scope.row.Bunkcontacts }}</td>
                <td class="tdTitle"></td>
                <td class="tdValue"></td>
              </tr>
              <tr>
                <td class="tdTitle">电话</td>
                <td class="tdValue">{{ scope.row.Bunkphone }}</td>
                <td class="tdTitle">微信</td>
                <td class="tdValue">{{ scope.row.Bunkwechat }}</td>
              </tr>
              <tr>
                <td class="tdTitle">支付宝</td>
                <td class="tdValue">{{ scope.row.Bunkalipay }}</td>
                <td class="tdTitle">邮箱</td>
                <td class="tdValue">{{ scope.row.Bunkemail }}</td>
              </tr>
            </table>
            <div slot="reference" class="name-wrapper">
              {{ scope.row.Bunkcontacts }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="Bunkphone" label="联系电话" min-width="120"  header-align="center"  align="center">
      </el-table-column>
      <el-table-column prop="Territoryidname" label="归属地" min-width="250"  header-align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.Territoryidname" placement="left">
            <el-button type="text" style="color: #606266;"> {{scope.row.Territoryidname}}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="Address" label="详细地址" min-width="250"  header-align="center"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="Area" label="商铺面积/㎡" min-width="100"  header-align="center"  align="center">
        <template slot-scope="scope">
          {{ scope.row.Area | money(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="Floor" label="楼层" min-width="60"  header-align="center"  align="center">
      </el-table-column>
      <!--<el-table-column prop="Licensetype" label="证件类型" min-width="100"  header-align="center"  align="center">-->
        <!--<template slot-scope="scope">-->
          <!--<label v-if="scope.row.Licensetype==='IDCARD'">身份证</label>-->
          <!--<label v-else-if="scope.row.Licensetype==='BUSINDESSLICENSE'">营业执照</label>-->
          <!--<label v-else></label>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="License" label="证件号码" min-width="150"  header-align="center"  show-overflow-tooltip>-->
      <!--</el-table-column>-->
      <el-table-column prop="Modifydate" label="更新时间"  min-width="200"   header-align="center"  align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.Modifydate | moment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200"  align="center" fixed="right">
        <template slot-scope="scope">
          <div v-if="pageButtonType===1">
            <el-tooltip class="item" effect="dark" content="商铺拜访" placement="top">
              <el-button size="mini" type="primary" icon="el-icon-tickets" circle   @click="f_Visit(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="商户地图" placement="top">
              <el-button size="mini" type="primary" icon="el-icon-location" circle   @click="f_Map(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button size="mini" type="primary" icon="el-icon-edit" circle   @click="f_Edit(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" >
              <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="f_Delete(scope.$index, scope.row)"></el-button>
            </el-tooltip>
          </div>
          <div v-else-if="pageButtonType===2">
            <el-button size="mini" @click="f_Visit(scope.$index, scope.row)">拜访</el-button>
            <el-button size="mini" @click="f_Map(scope.$index, scope.row)">地图</el-button>
            <el-button size="mini" @click="f_Edit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="f_Delete(scope.$index, scope.row)">删除</el-button>
          </div>
          <div v-else>
            <el-button type="text"  @click="f_Visit(scope.$index, scope.row)" >拜访</el-button>
            <el-button type="text"  @click="f_Map(scope.$index, scope.row)" >地图</el-button>
            <el-button type="text"  @click="f_Edit(scope.$index, scope.row)" >编辑</el-button>
            <el-button type="text"  @click="f_Delete(scope.$index, scope.row)">删除</el-button>
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


    <!--编辑界面-->
    <el-dialog :title="editTitle"  :visible.sync="editFormVisible"  width="60%"  :close-on-click-modal="false">
      <div slot="title" style="font-size: 14px; font-weight: bold; color: #606266; " >
        <i class="fa fa-th-large" aria-hidden="true" style="margin-right: 10px;"></i>{{editTitle}}
      </div>
      <el-tabs v-model="activeTabName" type="border-card" style="margin:-20px 0px -20px 0px; border:#DCDFE6 1px solid; height: 400px;">
        <el-tab-pane label="历史拜访" name="tablist">
          <span slot="label"><i class="el-icon-tickets"></i> 历史拜访</span>
          <div style=" height:330px; overflow-y: auto; overflow-x: hidden;">
            <el-collapse v-model="activeColNames">
              <div v-for="(visitItem,index) in bunkVisitList">
              <el-collapse-item v-bind:name="index">
                <template slot="title">
                  <div style="background-color: #f2f2f2; border: 1px solid #ffffff; padding-left:10px;">
                  <label v-if="visitItem.Intention==='1'"><i class="header-icon el-icon-info" style="color:#67C23A;"></i>&nbsp;&nbsp;</label>
                  <label v-else-if="visitItem.Intention==='2'"><i class="header-icon el-icon-info" style="color:#409EFF;"></i>&nbsp;&nbsp;</label>
                  <label v-else-if="visitItem.Intention==='3'"><i class="header-icon el-icon-info" style="color:#E6A23C;"></i>&nbsp;&nbsp;</label>
                  <label v-else-if="visitItem.Intention==='9'"><i class="header-icon el-icon-info" style="color:#909399;"></i>&nbsp;&nbsp;</label>
                  <label v-else><i class="header-icon el-icon-info"></i>&nbsp;&nbsp;</label>
                  拜访日期：<span  style="color:#409EFF;">{{ myMoment( visitItem.Visitdate).format("YYYY-MM-DD")}}</span>&nbsp;&nbsp;
                  第 <span  style="color:#409EFF;">{{bunkVisitList.length-index}}</span> 次
                  </div>
                </template>
                <div style=" padding:0px 20px; margin-top: 10px;">
                  <table>
                    <tr>
                      <td style="width:120px; height: 32px; color:#909399;">拜访人：</td>
                      <td style="width:20%;">{{visitItem.Bunkcontacts}}</td>
                      <td style="width:120px; color:#909399;">客户意向：</td>
                      <td style="width:20%;">
                        <label v-if="visitItem.Intention==='1'"><el-tag type="success"  size="mini">合作客户</el-tag></label>
                        <label v-else-if="visitItem.Intention==='2'"><el-tag size="mini">意向客户</el-tag ></label>
                        <label v-else-if="visitItem.Intention==='3'"><el-tag type="warning"  size="mini">潜在客户</el-tag></label>
                        <label v-else-if="visitItem.Intention==='9'"><el-tag type="info"  size="mini">历史客户</el-tag></label>
                        <label v-else>--</label>
                      </td>
                      <td style="width:120px; color:#909399;">评分：</td>
                      <td style="width:24%;">
                        <div style="margin-top:5px;">
                          <el-rate v-model="visitItem.Intentionscore" disabled  :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
                          </el-rate>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="width:120px; height: 32px; color:#909399;">拜访内容：</td>
                      <td colspan="5"  style="width:88%;">
                        <div style=" width:95%;line-height: 24px;">{{visitItem.Visitcontent}}</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="width:120px; height: 32px; color:#909399;">解决方案：</td>
                      <td colspan="5"  style="width:88%;">
                        <div style=" width:95%;line-height: 24px;">{{visitItem.Visitresult}}</div>
                      </td>
                    </tr>
                  </table>
                </div>
              </el-collapse-item>
              </div>
            </el-collapse>
          </div>
        </el-tab-pane>
        <el-tab-pane label="新增拜访" name="tabedit">
          <span slot="label"><i class="el-icon-circle-plus"></i> 新增拜访</span>
          <el-form :model="editForm"  label-width="140px" :rules="editFormRules" ref="editForm">
            <el-form-item label="拜访人" prop="Bunklinkid" :inline-message="true">
              <el-col :span="12">
                <el-select v-model="editForm.Bunklinkid" placeholder="请选择" >
                  <el-option
                    v-for="item in bunkLinkList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="拜访日期" prop="Visitdate" :inline-message="true">
              <el-col :span="12">
                <el-date-picker
                  v-model="editForm.Visitdate"
                  type="date"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期" :clearable="false">
                </el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="客户意向" prop="Intention" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="20">
                <el-radio-group v-model="editForm.Intention">
                  <el-radio :label="1">合作客户</el-radio>
                  <el-radio :label="2">意向客户</el-radio>
                  <el-radio :label="3">潜在客户</el-radio>
                  <el-radio :label="9">历史客户</el-radio>
                </el-radio-group>
              </el-col>
            </el-form-item>
            <el-form-item label="拜访评分" prop="Intentionscore" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="16">
                <div style="margin-top:12px;">
                  <el-rate v-model="editForm.Intentionscore"  :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
                  </el-rate>
                </div>
              </el-col>
            </el-form-item>
            <el-form-item label="沟通内容" prop="Visitcontent" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="16">
                <el-input type="textarea" v-model="editForm.Visitcontent" placeholder="请输入沟通内容" maxlength="100" :rows="2" clearable></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="解决方案" prop="Visitresult" :inline-message="true" style="margin-top: 10px;">
              <el-col :span="16">
                <el-input type="textarea" v-model="editForm.Visitresult" placeholder="请输入解决方案" maxlength="100" :rows="2" clearable></el-input>
              </el-col>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer" style="text-align: center; ">
        <el-button type="primary" @click.native="f_EditSubmit" :loading="editLoading" size="medium">保存</el-button>
        <el-button @click.native="f_EditClose" size="medium">取消</el-button>
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
          bunkName: '',
          traderName:'',
          Businessstate:'',
          Intention:'',
        },
        page: 1,
        size: this.Global.pageSize,
        pageButtonType: this.Global.pageButtonType,
        total: 0,
        resultData: [],
        listLoading: false,
        //编辑界面
        activeTabName:'tablist',
        activeColNames:[0],
        editTitle: '',
        editFormVisible: false,
        editLoading: false,
        editFormRules: {
          Bunklinkid: [
            {required: true, message: '拜访人不能为空', trigger: 'blur'}
          ],
          Visitdate: [
            {required: true, message: '拜访日期不能为空', trigger: 'blur'}
          ],
          Visitcontent: [
            {required: true, message: '沟通内容不能为空', trigger: 'blur'}
          ],
          Visitresult: [
            {required: true, message: '解决方案不能为空', trigger: 'blur'}
          ],
        },
        editForm: {
          Bunkvisitid: 0,
          Bunkid:0,
          Bunklinkid:null,
          Visitdate:  new Date(),
          Visitcontent:'',
          Visitresult:'',
          Intention:3,
          Intentionscore: 0,
        },

        //资源数据
        businessStateList:[
          {label:'营业',value:'1'},
          {label:'歇业',value:'2'},
          {label:'停业',value:'3'},
        ],
        intentionList:[
          {label:'合作客户',value:'1'},
          {label:'意向客户',value:'2'},
          {label:'潜在客户',value:'3'},
          {label:'历史客户',value:'9'}
        ],
        bunkLinkList:[],
        bunkVisitList:[],
      }
    },
    methods: {
      //添加
      f_Add: function () {
        this.$router.push('/trader/BunkEdit');
      },
      //商户沟通
      f_Visit:function(index, row){
        this.editFormVisible = true;
        this.editTitle = '商户拜访';
        this.f_GetVisit(row.Bunkid);
      },
      //商铺沟通记录查询
      f_GetVisit:function(bunkId){
        this.editForm= {
          Bunkvisitid: 0,
          Bunkid: 0,
          Bunklinkid: null,
          Visitdate: new Date(),
          Visitcontent: '',
          Visitresult: '',
          Intention: 3,
          Intentionscore: 0,
        };
        this.bunkLinkList=[];
        this.bunkVisitList=[];
        this.editForm.Bunkid=bunkId;
        this.editLoading=true;
        let _this=this;
        let parms = {
          Bunkid: this.editForm.Bunkid,
        };
        _this.$httpPost('Bunk/GBunkVisitList', parms).then((res) => {
          if (res.success == 'ok') {
            if (res.dtBunkLink != null && res.dtBunkLink.length > 0) {
              for (let i = 0; i < res.dtBunkLink.length; i++) {
                var model = {value: res.dtBunkLink[i].Bunklinkid, label: res.dtBunkLink[i].Bunkcontacts};
                _this.bunkLinkList.push(model);
              }
            }
            _this.bunkVisitList = res.dtBunkVisit;
            _this.editLoading = false;
          }
          else {
            _this.editLoading = false;
          }
        }).catch(function (error) {
          _this.$message.error('获取数据出错！');
          _this.editLoading = false;
        });
      },
      //商户地图
      f_Map:function(index, row){
        this.$router.push({
          path: '/trader/TraderMap',
          query: {
            bunkName: row.Bunkname,
            address: row.Address,
          },
        });
      },
      //显示编辑界面
      f_Edit: function (index, row) {
        this.$router.push({
          path: '/trader/BunkEdit',
          query: {
            bunkId: row.Bunkid,
          },
        });
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
            Pkid: row.Bunkid,
          };
          this.$httpPost('Bunk/DBunk',pars).then((res)=> {
            if(res.success=='ok') {
              this.listLoading = false;
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              });
              this.page=1;
              this.f_Search();
            }
            else if (res.success == 'error1') {
              this.listLoading = false;
              this.$alert('该商铺已存在订单，不能删除！', '提示', {
                confirmButtonText: '确定',
                type: 'error',
              });
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
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            _this.editLoading = true;
            let pars = Object.assign({}, _this.editForm);
            _this.$httpPost('Bunk/SBunkVisit', pars).then((res) => {
              if (res.success == 'ok') {
                _this.editLoading = false;
                _this.$message({
                  showClose: true,
                  message: '保存成功',
                  type: 'success'
                });
                _this.activeTabName='tablist';
                _this.f_GetVisit( _this.editForm.Bunkid);
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
        });
      },
      //提交取消事件
      f_EditClose:function () {
        this.$refs['editForm'].resetFields();
        this.editFormVisible = false;
      },


      //分页事件
      handleCurrentChange(val) {
        this.page = val;
        this.f_Search();
      },
      //搜索
      f_Search: function () {
        this.listLoading = true;
        let _this=this;
        let parms = {
          page: this.page,
          size: this.size,
          bunkName: this.filters.bunkName,
          traderName: this.filters.traderName,
          businessState: this.filters.Businessstate,
          intention: this.filters.Intention,
        };
        _this.$httpPost('Bunk/GBunkList', parms).then((res) => {
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
.tdTitle{
  width:50px;
  height:32px;
  line-height: 32px;
  text-align: right;
  border: 1px solid #ccc;
  font-weight: bold;
  padding-right: 5px;
  font-size: 12px;
}
.tdValue{
  width:120px;
  height:32px;
  line-height: 32px;
  border: 1px solid #ccc;
  padding-left: 5px;
  font-size: 13px;
  color: #409EFF;
}

</style>
