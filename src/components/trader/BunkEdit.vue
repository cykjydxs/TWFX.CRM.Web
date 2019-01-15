<template>
  <div v-loading="editLoading" style=" border-top: #DCDFE6 1px solid;">
    <el-steps :active="stepActive" finish-status="success" simple >
      <el-step title="基本信息" @click.native="f_Step(0)"></el-step>
      <el-step title="商铺信息" @click.native="f_Step(1)"></el-step>
      <el-step title="联系方式" @click.native="f_Step(2)"></el-step>
      <el-step title="经营品牌" @click.native="f_Step(3)"></el-step>
    </el-steps>

    <div style="padding-top: 30px;  border-top: #DCDFE6 1px solid; overflow-y: auto; padding-bottom: 30px;" v-bind:style="{height:tableHeight}">

      <!--基本信息-->
      <el-form :model="editForm" label-width="180px" v-show="stepActive==0"  :rules="editFormRules" ref="editForm" border>
        <el-form-item label="商户名称" prop="Tradername" :inline-message="true" style="margin-top: 10px;">
          <el-col :span="10">
            <el-input v-model.trim="editForm.Tradername" placeholder="请输入商户名称" maxlength="30" clearable @change="f_ChangeTraderName" @clear="f_ClearTraderName">
              <el-button slot="append" icon="el-icon-search" @click.native="f_DataSelectTrader"></el-button>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="商户分类" style="margin-top: 15px;">
          <el-col :span="10">
            <el-select v-model="editForm.Tradertype" placeholder="请选择" :disabled="traderTypeDis">
              <el-option
                v-for="item in traderTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="商铺名称" prop="Bunkname" :inline-message="true" style="margin-top: 15px;">
          <el-col :span="10">
            <el-input v-model.trim="editForm.Bunkname" placeholder="请输入商铺名称"  maxlength="30" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="经营性质" style="margin-top: 15px;">
          <el-col :span="16">
            <el-radio-group v-model="editForm.Businessnature">
              <el-radio :label="1">代理</el-radio>
              <el-radio :label="2">加盟</el-radio>
              <el-radio :label="3">直营</el-radio>
              <el-radio :label="4">直营+代理</el-radio>
              <el-radio :label="5">直营+加盟</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="经营情况" style="margin-top: 15px;">
          <el-col :span="10">
            <el-radio-group v-model="editForm.Businessstate" @change="f_Businessstate">
              <el-radio :label="1">营业</el-radio>
              <el-radio :label="2">歇业</el-radio>
              <el-radio :label="3">停业</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="营业开始日期" prop="Openstartdate" :inline-message="true" v-show="showForm.Openstartdate" style="margin-top: 15px;" ref="refOpenstartdate">
          <el-col :span="10">
            <el-date-picker
              v-model="editForm.Openstartdate"
              type="date"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="营业日期"  prop="OpendateArray" :inline-message="true" v-show="showForm.OpendateArray" style="margin-top: 15px;"  ref="refOpendateArray">
          <el-col :span="10">
            <el-date-picker
              v-model="editForm.OpendateArray"
              type="daterange"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期" @change="f_OpendateArray">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="合作意向" style="margin-top: 15px;">
          <el-col :span="10">
            <el-radio-group v-model="editForm.Intention"  @change="f_Intention">
              <el-radio :label="1">合作客户</el-radio>
              <el-radio :label="2">意向客户</el-radio>
              <el-radio :label="3">潜在客户</el-radio>
              <el-radio :label="9">历史客户</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="合作开始日期" prop="Cooperstartdate" :inline-message="true" v-show="showForm.Cooperstartdate" style="margin-top: 15px;" ref="refCooperstartdate">
          <el-col :span="10">
            <el-date-picker
              v-model="editForm.Cooperstartdate"
              type="date"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="合作日期"  prop="CooperdateArray" :inline-message="true" v-show="showForm.CooperdateArray" style="margin-top: 15px;"  ref="refCooperdateArray">
          <el-col :span="10">
            <el-date-picker
              v-model="editForm.CooperdateArray"
              type="daterange"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"  @change="f_CooperdateArray">
            </el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>

      <!--店铺信息-->
      <el-form :model="editBunkForm" label-width="180px"  v-show="stepActive==1"  :rules="editBunkFormRules" ref="editBunkForm" border>
        <el-form-item label="商铺等级" prop="Bunklevelid" :inline-message="true" style="margin-top: 10px;">
          <el-col :span="10">
            <el-select v-model="editBunkForm.Bunklevelid" placeholder="请选择">
              <el-option
                v-for="item in levelList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="所属地" prop="Territoryid" :inline-message="true" style="margin-top: 10px;">
          <el-col :span="16">
            <el-cascader
              :options="territoryidOptions"
              :props="{'value':'Valueid','label':'Cname'}"
              v-model="editBunkForm.Territoryid" style="width:440px;">
            </el-cascader>
          </el-col>
        </el-form-item>
        <el-form-item label="详性地址" prop="Address" :inline-message="true" style="margin-top: 10px;">
          <el-col :span="16">
            <el-input v-model="editBunkForm.Address" placeholder="请输入详性地址"  maxlength="30" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="商铺面积（㎡）" prop="Area" :inline-message="true" style="margin-top: 10px;">
          <el-col :span="10">
            <el-input-number v-model="editBunkForm.Area" :precision="2" :step="1" :min="1" :max="5000"></el-input-number>
          </el-col>
        </el-form-item>
        <el-form-item label="商铺楼层" prop="Floor" style="margin-top: 10px;">
          <el-col :span="10">
            <el-select v-model="editBunkForm.Floor" placeholder="请选择" clearable>
              <el-option
                v-for="item in floorList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="商铺商场名称" style="margin-top: 10px;">
          <el-col :span="10">
            <el-input v-model="editBunkForm.Inplaza"  placeholder="请输入商铺商场名称" maxlength="30" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="证件类型" style="margin-top: 10px;">
          <el-col :span="10">
            <el-select v-model="editBunkForm.Licensetype" placeholder="请选择" clearable>
              <el-option
                v-for="item in licenseTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="证件号码" prop="License" style="margin-top: 10px;">
          <el-col :span="10">
            <el-input v-model="editBunkForm.License" placeholder="请输入证件号码" maxlength="30" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="商铺特点" v-show="false" style="margin-top: 10px;" clearable>
          <el-col :span="10">
            <el-select v-model="editBunkForm.Trait" multiple placeholder="请选择" style="width:440px;">
              <el-option
                v-for="item in traitList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="商铺描述" prop="Bunkdesc" style="margin-top: 10px;" clearable>
          <el-col :span="16">
            <el-input v-model="editBunkForm.Bunkdesc"  placeholder="请输入商铺描述"  maxlength="30"></el-input>
          </el-col>
        </el-form-item>
      </el-form>

      <!--联系方式-->
      <div  v-show="stepActive==2">
        <div style="text-align: right; height: 40px; margin-top: -20px; padding-right: 10px;">
          <el-button type="primary" round size="mini" icon="el-icon-plus" @click="f_BunkLinkAdd">新增</el-button>
        </div>
        <el-table :data="linkList" highlight-current-row  border v-loading="editLoading" style="width: 100%;" height="430">
          <el-table-column type="index" width="80"  label="序号"  header-align="center"  align="center">
          </el-table-column>
          <el-table-column prop="Bunkcontacts" label="姓名"  min-width="100"  header-align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.Bunkcontacts" placeholder="请输入姓名" maxlength="30" clearable></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="Bunkphone" label="电话" min-width="100"  header-align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.Bunkphone" placeholder="请输入电话" maxlength="30" clearable></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="Bunkwechat" label="微信" min-width="100"  header-align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.Bunkwechat" placeholder="请输入微信" maxlength="30" clearable></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="Bunkalipay" label="支付宝" min-width="100"  header-align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.Bunkalipay" placeholder="请输入支付宝" maxlength="30" clearable></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="Bunkemail" label="邮箱" min-width="100"  header-align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.Bunkemail" placeholder="请输入邮箱" maxlength="30" clearable></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="Ismain" label="主要联系人"  min-width="80" align="center"  header-align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.Ismain"
                active-color="#13ce66" @change="f_BunkLinkSwitch(scope.$index, scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80"  align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="f_BunkLinkDelete(scope.$index, scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--经营品牌-->
      <div  v-show="stepActive==3" style="padding-left: 10px;">
        <el-card shadow="always">
          <el-tree
            :data="bunkTraderList"
            show-checkbox
            node-key="id"
            ref="brandTree"
            :default-checked-keys="bunkTraderChecked"
            :props="defaultProps">
          </el-tree>
        </el-card>

      </div>




      <!--商户选择-->
      <el-dialog  :visible.sync="dataSelectTraderVisible"  width="60%"  :close-on-click-modal="false">
        <div slot="title" style="font-size: 14px; font-weight: bold; color: #606266;" >
          <i class="fa fa-th-large" aria-hidden="true" style="margin-right: 10px;"></i>商户选择
        </div>
        <!--搜索-->
        <div style="margin-top: -10px;">
          <el-form :inline="true" :model="filters">
            <el-form-item>
              <el-input v-model="filters.traderName" placeholder="商户名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="filters.traderType" placeholder="请选择" clearable>
                <el-option
                  v-for="item in traderTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" v-on:click="f_DataSelectTraderSearch">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!--列表-->
        <el-table :data="traderList" highlight-current-row  border v-loading="dataSelectTraderLoading" style="width: 100%;" height="300"
                  @row-click="f_DataSelectTraderClick" @row-dblclick="f_DataSelectTraderDbClick">
          <el-table-column type="index" width="80"  label="序号"  header-align="center"  align="center">
          </el-table-column>
          <el-table-column prop="Tradername" label="商户名称"  min-width="200"  header-align="center">
          </el-table-column>
          <el-table-column prop="Tradertypename" label="商铺分类" min-width="100"  align="center" header-align="center">
          </el-table-column>
          <el-table-column prop="Tradercount" label="商铺数量" min-width="80"  align="center" header-align="center">
          </el-table-column>
          <el-table-column prop="Modifydate" label="更新时间"  min-width="200"   header-align="center"  align="center">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.Modifydate | moment }}</span>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <div style="margin-top: 10px;">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="size"
            layout="total, prev, pager, next, jumper"
            :total="total" style="float:right;">
          </el-pagination>
        </div>
        <!--按钮-->
        <div slot="footer" style="text-align: center;">
          <el-button type="primary" @click.native="f_DataSelectTraderChoose" :loading="editLoading" size="medium">选择</el-button>
          <el-button @click.native="f_DataSelectTraderClose" size="medium">取消</el-button>
        </div>
      </el-dialog>



    </div>
    <!--按钮-->
    <div style="text-align: center;  height: 60px; line-height: 60px; background-color: #f2f2f2;">
      <el-button type="primary" @click.native="f_LastStep" v-show="stepActive!=0" size="medium">上一步</el-button>
      <el-button type="primary" @click.native="f_EditSubmit" v-show="stepActive==3" size="medium">保存</el-button>
      <el-button type="primary" @click.native="f_NextStep" v-show="stepActive!=3" size="medium">下一步</el-button>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        //表格高度
        tableHeight:window.innerHeight-305+'px',
        editLoading: false,
        dataSelectTraderVisible: false,
        dataSelectTraderLoading: false,
        //步骤
        stepActive: 0,
        //显示隐藏
        showForm: {
          Openstartdate: true,
          OpendateArray: false,
          Cooperstartdate: true,
          CooperdateArray: false,
        },

        //基本信息
        editFormRules: {
          Tradername: [
            {required: true, message: '商户名称不能为空', trigger: 'blur'}
          ],
          Bunkname: [
            {required: true, message: '商铺名称不能为空', trigger: 'blur'}
          ],
          Openstartdate: [],
          Cooperstartdate: [],
          OpendateArray: [],
          CooperdateArray: [],
        },
        editForm: {
          Bunkid: 0,
          Traderid: 0,
          Straderid:0,//选择页面返回商户ID
          Tradername: '',
          Tradertype: '',
          Bunkname: '',
          Businessnature: 1,
          Businessstate: 1,
          Openstartdate: new Date(),
          Openenddate: '',
          OpendateArray: [],
          Intention: 1,
          Cooperstartdate: new Date(),
          Cooperenddate: '',
          CooperdateArray: [],
        },
        filters: {
          traderName: '',
          traderType:'',
        },
        traderList: [],
        page: 1,
        size: 5,
        total: 0,
        traderRow: {},
        traderTypeDis: false,
        //商铺信息
        editBunkFormRules: {
          Territoryid: [
            {required: true, message: '归属地不能为空', trigger: 'blur'}
          ],
          Address: [
            {required: true, message: '详细地址不能为空', trigger: 'blur'}
          ],
          Area: [
            {required: true, message: '面积不能为空', trigger: 'blur'}
          ],
        },
        editBunkForm: {
          Bunklevelid: '',
          Territoryid: [],
          Territoryidname: '',
          Address: '',
          Inplaza: '',
          Floor: '',
          Area: 50,
          Trait: '',
          Licensetype: '',
          License: '',
          Bunkdesc: '',
        },
        //联系方式
        linkList: [],
        //经营品牌
        bunkTraderList: [],
        bunkTraderChecked: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },


        //资源数据
        traderTypeList: [],
        levelList: [],
        licenseTypeList: [],
        floorList: [],
        traitList: [
          {value: '10年老店', label: '10年老店'},
          {value: '人流量大商场', label: '人流量大商场'},
        ],
        territoryidOptions: [],
      };
    },
    methods: {
      //商户选择打开事件
      f_DataSelectTrader: function () {
        this.dataSelectTraderVisible = true;
        this.traderRow = {};
        this.f_DataSelectTraderSearch();
      },
      //商户选择搜索事件
      f_DataSelectTraderSearch: function () {
        this.dataSelectTraderLoading = true;
        let parms = {
          page: this.page,
          size: this.size,
          traderName: this.filters.traderName,
          traderType: this.filters.traderType,
        };
        let _this = this;
        this.$httpPost('Trader/GTraderList', parms).then((res) => {
          if (res.success == 'ok') {
            _this.traderList = res.dtData;
            _this.total = res.total;
            _this.dataSelectTraderLoading = false;
          }
          else {
            _this.dataSelectTraderLoading = false;
          }
        }).catch(function (error) {
          _this.dataSelectTraderLoading = false;
        });
      },
      //商户选择分页事件
      handleCurrentChange(val) {
        this.page = val;
        this.f_DataSelectTraderSearch();
      },
      //商户清空事件
      f_ClearTraderName: function () {
        this.editForm.Straderid = 0;
        this.traderTypeDis = false;
      },
      //商户名称变化事件
      f_ChangeTraderName: function () {
        if (this.editForm.Tradername != this.traderRow.Tradername) {
          this.editForm.Straderid = 0;
          this.traderTypeDis = false;
        }
      },
      //商户选择页点击事件
      f_DataSelectTraderClick: function (row, event, column) {
        this.traderRow = row;
      },
      //商户选择页双击事件
      f_DataSelectTraderDbClick: function (row, event) {
        this.traderRow = row;
        this.f_DataSelectTraderChoose();
      },
      //商户选择事件
      f_DataSelectTraderChoose: function () {
        if (this.Global.isNullOrEmpty(this.traderRow.Traderid)) {
          this.$alert('请选择数据', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }
        else {
          this.dataSelectTraderVisible = false;
          this.editForm.Straderid = this.traderRow.Traderid;
          this.editForm.Tradername = this.traderRow.Tradername;
          this.editForm.Tradertype = this.traderRow.Tradertype;
          this.traderTypeDis = true;
        }
      },
      //商户选择关闭事件
      f_DataSelectTraderClose: function () {
        this.dataSelectTraderVisible = false;
      },
      //经营情况选择事件
      f_Businessstate: function () {
        if (this.editForm.Businessstate == 3) {
          this.editFormRules.Openstartdate = [];
          this.$refs['refOpenstartdate'].clearValidate();
          this.editFormRules.OpendateArray = [{required: true, message: '营业日期不能为空', trigger: 'blur'}];
          this.showForm.Openstartdate = false;
          this.showForm.OpendateArray = true;
        }
        else {
          this.editFormRules.OpendateArray = [];
          this.$refs['refOpendateArray'].clearValidate();
          this.editFormRules.Openstartdate = [{required: true, message: '营业开始日期不能为空', trigger: 'blur'}];
          this.showForm.Openstartdate = true;
          this.showForm.OpendateArray = false;
        }
      },
      //经营日期选择改变事件
      f_OpendateArray: function () {
        //this.editForm.Openstartdate =this.myMoment( this.editForm.OpendateArray[0]).format("YYYY-MM-DD");
        this.editForm.Openstartdate = this.editForm.OpendateArray[0];
        this.editForm.Openenddate = this.editForm.OpendateArray[1];
      },
      //合作意向选择事件
      f_Intention: function () {
        if (this.editForm.Intention == 9) {
          this.editFormRules.Cooperstartdate = [];
          this.$refs['refCooperstartdate'].clearValidate();
          this.editFormRules.CooperdateArray = [{required: true, message: '合作日期不能为空', trigger: 'blur'}];
          this.showForm.CooperdateArray = true;
          this.showForm.Cooperstartdate = false;
        }
        else if (this.editForm.Intention == 1) {
          this.editFormRules.CooperdateArray = [];
          this.$refs['refCooperdateArray'].clearValidate();
          this.editFormRules.Cooperstartdate = [{required: true, message: '合作开始日期不能为空', trigger: 'blur'}];
          this.showForm.Cooperstartdate = true;
          this.showForm.CooperdateArray = false;
        }
        else {
          this.editFormRules.Cooperstartdate = [];
          this.$refs['refCooperstartdate'].clearValidate();
          this.editFormRules.CooperdateArray = [];
          this.$refs['refCooperdateArray'].clearValidate();
          this.showForm.Cooperstartdate = false;
          this.showForm.CooperdateArray = false;
        }
      },
      //合作意向日期选择改变事件
      f_CooperdateArray: function () {
        this.editForm.Cooperstartdate = this.editForm.CooperdateArray[0];
        this.editForm.Cooperenddate = this.editForm.CooperdateArray[1];
      },

      //联系人添加事件
      f_BunkLinkAdd: function () {
        var model = {
          Ismain: this.linkList.length <= 0 ? true : false,
          Bunkcontacts: '',
          Bunkphone: '',
          Bunkwechat: '',
          Bunkalipay: '',
          Bunkemail: '',
        };
        this.linkList.push(model);
      },
      //联系人删除事件
      f_BunkLinkDelete: function (index, row) {
        if (index > -1) {
          this.linkList.splice(index, 1);
        }
      },
      //联系人设置主要事件
      f_BunkLinkSwitch: function (index, row) {
        if (this.linkList.length > 1 && row.Ismain == true) {
          for (let i = 0; i < this.linkList.length; i++) {
            if (index != i)
              this.linkList[i].Ismain = false;
          }
        }
      },


      //步骤
      f_Step: function (value) {
        //this.$alert(value, '标题名称', {
        //  confirmButtonText: '确定',
        //});
        if (value > this.stepActive) {
          this.f_NextStep();
        }
      },
      //上一步
      f_LastStep: function () {
        if (this.stepActive > 0)
          this.stepActive = this.stepActive - 1;
      },
      //下一步
      f_NextStep: function () {
        if (this.stepActive == 0) {
          this.$refs.editForm.validate((valid) => {
            if (valid) {
              this.stepActive = this.stepActive + 1;
            }
          });
        }
        else if (this.stepActive == 1) {
          this.$refs.editBunkForm.validate((valid) => {
            if (valid) {
              this.stepActive = this.stepActive + 1;
            }
          });
        }
        else if (this.stepActive == 2) {
          if (this.linkList.length > 0) {
            let goTo = true;
            let setMain = false;
            for (let i = 0; i < this.linkList.length; i++) {
              if (this.linkList[i].Bunkcontacts == '' || this.linkList[i].Bunkphone == '') {
                this.$alert('联系方式姓名与电话不能为空！', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                });
                goTo = false;
                break;
              }
              if (this.linkList[i].Ismain == true)
                setMain = true;
            }
            if (goTo && !setMain) {
              this.$alert('请设置主要联系人！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
            }
            if (goTo && setMain)
              this.stepActive = this.stepActive + 1;
          }
          else {
            this.$alert('联系方式不能为空！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          }
        }
      },
      //提交事件
      f_EditSubmit: function () {
        console.log(this.$refs.brandTree.getCheckedKeys());

        this.editLoading = true;
        let pars = {
          editForm: this.editForm,
          editBunkForm: this.editBunkForm,
          linkList: this.linkList,
          brandList: this.$refs.brandTree.getCheckedKeys(),
        };
        let _this = this;
        this.$httpPost('Bunk/SBunkEdit', pars).then((res) => {
          if (res.success == 'ok') {
            if (res.addResult == '101') {
              this.$alert('商铺名称已存，请重新输入！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
            }
            else if (res.addResult == '102') {
              this.$alert('商户名称已存，请重新输入！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
            }
            else {
              _this.$confirm('保存成功！', '提示', {
                confirmButtonText: '确定',
                type: 'success',
                showCancelButton: false,
              }).then(() => {
                _this.editLoading = false;
                this.$router.push('/trader/BunkList');
              }).catch(function (error) {
                _this.$message({
                  showClose: true,
                  message: '保存失败',
                  type: 'warning'
                });
                _this.editLoading = false;
              });
            }
            _this.editLoading = false;
          }
          else {
            _this.$message({
              showClose: true,
              message: '保存失败',
              type: 'warning'
            });
            _this.editLoading = false;
          }
        }).catch(function (error) {
          _this.$message.error('数据错误！');
          _this.editLoading = false;
        });

      },


      //品牌产品类型递归方法
      f_ToTreeData: function (arrayData, pid) {
        var result = [], temp;
        for (var i in arrayData) {
          if (arrayData[i].pid == pid) {
            result.push(arrayData[i]);
            temp = this.f_ToTreeDataChild(arrayData, arrayData[i].id);
            if (temp.length > 0) {
              arrayData[i].children = temp;
            }
          }
        }
        return result;
      },
      //品牌产品类型递归方法
      f_ToTreeDataChild: function (arrayData, pid) {
        var result = [], temp;
        for (var i in arrayData) {
          if (arrayData[i].pid == pid) {
            result.push(arrayData[i]);
            temp = this.f_ToTreeDataChild(arrayData, arrayData[i].id);
            if (temp.length > 0) {
              arrayData[i].children = temp;
            }
          }
        }
        return result;
      },
      //加载事件
      f_Search: function () {
        let _this = this;
        let pars = {
          bunkId: this.Global.isNullOrEmpty(this.$route.query.bunkId) ? 0 : this.$route.query.bunkId,
          cityConfig: this.Global.cityConfig,
        };
        this.editLoading = true;
        this.$httpPost('Bunk/GBunkEdit', pars).then((res) => {
          if (res.success == 'ok') {

            //资源
            let traderType = _this.Enumerable.from(res.dtResourceConfig).where(p => p.Rctype == 'TRADERTYPE').orderBy(o => o.Rcsort).toArray();
            let bunkFloor = _this.Enumerable.from(res.dtResourceConfig).where(p => p.Rctype == 'BUNKFLOOR').orderBy(o => o.Rcsort).toArray();
            let licenseType = _this.Enumerable.from(res.dtResourceConfig).where(p => p.Rctype == 'LICENSETYPE').orderBy(o => o.Rcsort).toArray();
            for (let i = 0; i < traderType.length; i++) {
              var model = {value: traderType[i].Rccode, label: traderType[i].Rcname};
              _this.traderTypeList.push(model);
            }
            for (let i = 0; i < res.dtBunkLevel.length; i++) {
              var model = {value: res.dtBunkLevel[i].Bunklevelid, label: res.dtBunkLevel[i].Levelname};
              _this.levelList.push(model);
            }
            for (let i = 0; i < bunkFloor.length; i++) {
              var model = {value: bunkFloor[i].Rccode, label: bunkFloor[i].Rcname};
              _this.floorList.push(model);
            }
            for (let i = 0; i < licenseType.length; i++) {
              var model = {value: licenseType[i].Rccode, label: licenseType[i].Rcname};
              _this.licenseTypeList.push(model);
            }
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


            //经营品牌
            _this.bunkTraderList = _this.f_ToTreeData(res.dtBrand, 0);

            //新增
            if (_this.Global.isNullOrEmpty(_this.$route.query.bunkId)) {
              _this.editForm.Tradertype = 'INDIVIDUAL';
              _this.editBunkForm.Bunklevelid = _this.levelList[0].value;
              _this.editBunkForm.Floor = '1F';
              _this.editFormRules.Openstartdate = [{required: true, message: '营业开始日期不能为空', trigger: 'blur'}];
              _this.editFormRules.Cooperstartdate = [{required: true, message: '合作开始日期不能为空', trigger: 'blur'}];
            }
            else {
              //联系人
              for (let gg = 0; gg < res.dtBunkLink.length; gg++) {
                res.dtBunkLink[gg].Ismain = res.dtBunkLink[gg].Ismain == 'Y' ? true : false;
              }
              _this.linkList = res.dtBunkLink;

              //商户类别不可编辑
              _this.traderTypeDis = true;

              _this.editForm.Bunkid = res.dtBase[0].Bunkid;
              _this.editForm.Traderid = res.dtBase[0].Traderid;
              _this.editForm.Straderid = res.dtBase[0].Traderid;//选择页面返回商户ID
              _this.editForm.Tradername = res.dtBase[0].Tradername;
              _this.editForm.Tradertype = res.dtBase[0].Tradertype;
              _this.editForm.Bunkname = res.dtBase[0].Bunkname;
              _this.editForm.Businessnature = res.dtBase[0].Businessnature;
              _this.editForm.Businessstate = res.dtBase[0].Businessstate;
              _this.editForm.Openstartdate = res.dtBase[0].Openstartdate;
              _this.editForm.Openenddate = res.dtBase[0].Openenddate;
              _this.editForm.OpendateArray = [];
              _this.editForm.Intention = res.dtBase[0].Intention;
              _this.editForm.Cooperstartdate = res.dtBase[0].Cooperstartdate;
              _this.editForm.Cooperenddate = res.dtBase[0].Cooperenddate;
              _this.editForm.CooperdateArray = [];

              _this.editBunkForm.Bunklevelid = res.dtBase[0].Bunklevelid;
              _this.editBunkForm.Territoryid = res.dtBase[0].Territoryid.split(',');
              _this.editBunkForm.Territoryidname = res.dtBase[0].Territoryidname;
              _this.editBunkForm.Address = res.dtBase[0].Address;
              _this.editBunkForm.Inplaza = res.dtBase[0].Inplaza;
              _this.editBunkForm.Floor = res.dtBase[0].Floor;
              _this.editBunkForm.Area = res.dtBase[0].Area;
              _this.editBunkForm.Trait = res.dtBase[0].Trait;
              _this.editBunkForm.Licensetype = res.dtBase[0].Licensetype;
              _this.editBunkForm.License = res.dtBase[0].License;
              _this.editBunkForm.Bunkdesc = res.dtBase[0].Bunkdesc;

              console.log(res.dtBunkBrand);
              _this.bunkTraderChecked = [];
              for (let i = 0; i < res.dtBunkBrand.length; i++) {
                var curB = res.dtBunkBrand[i];
                _this.bunkTraderChecked.push(curB.Brandid * 1000000 + curB.Producttypesid);
              }
            }
          }
          _this.editLoading = false;
        }).catch(function (error) {
          _this.$message.error('数据错误！');
          _this.editLoading = false;
        });
      },
    },
    //必须放最后
    mounted() {
      this.f_Search();
    },
  };
</script>

<style scoped>
  @import '../../style/font-awesome/css/font-awesome.css';
</style>
<style>
  .el-step__head:hover {
    /*color: #67c23a;
    /border-color: #67c23a;*/
    cursor: pointer;
  }
  .el-step__title:hover{
    /*color: #67c23a;*/
    /*border-color: #67c23a;*/
    cursor: pointer;
  }
</style>
