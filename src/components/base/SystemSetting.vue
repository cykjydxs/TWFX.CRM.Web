<template>
  <div v-loading="listLoading">
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix" >
          <span>系统参数设置</span>
          <el-button type="text" @click.native="f_EditInfoSubmit" size="medium" style="float: right; padding: 3px 0;">保存</el-button>
        </div>
        <div :style="{height: tableHeight}">
          <div>
            <el-form :model="editForm" label-width="200px"  ref="editForm" border>
              <el-form-item label="是否启用库存预警：" prop="Warningenable" :inline-message="true">
                <el-col :span="18">
                  <el-switch
                    v-model="editForm.Warningenable"
                    active-color="#13ce66">
                  </el-switch>
                </el-col>
              </el-form-item>
              <el-form-item label="库存不足预警：" :inline-message="true">
                <el-col :span="18">
                  <el-input-number v-model="editForm.Warningmin1" :min="0" :max="1" :step="1" style="width: 150px;"></el-input-number>
                  &nbsp;至&nbsp;
                  <el-input-number v-model="editForm.Warningmin2" :min="1" :max="500" :step="1" style="width: 150px;"></el-input-number>
                  <span style="margin-left: 10px;">（单个产品库存数量在设置值区间内则报库存不足预警）</span>
                </el-col>
              </el-form-item>
              <el-form-item label="库存积压预警：" prop="Warningmax1" :inline-message="true">
                <el-col :span="18">
                  <el-input-number v-model="editForm.Warningmax1" :min="10" :max="10000" :step="10" style="width: 150px;"></el-input-number>
                  <span style="margin-left: 10px;">（单个产品库存数量超过设置值则报库存积压预警）</span>
                </el-col>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
    export default {
      data() {
        return {
          //表格高度
          tableHeight:this.Global.pagetableHeight,
          listLoading: false,
          editForm:{
            Warningenable:false,
            Warningmin1:1,
            Warningmin2:10,
            Warningmax1:1000,
          },
        }
      },
      methods:{
        //提交事件
        f_EditInfoSubmit:function () {
          let pars = {
            Warningenable: this.editForm.Warningenable == true ? 1 : 0,
            Warningmin1: this.editForm.Warningmin1,
            Warningmin2: this.editForm.Warningmin2,
            Warningmax1: this.editForm.Warningmax1,
          };
          let _this = this;
          _this.listLoading = true;
          _this.$httpPost('ParamsSet/SParamsSet', pars).then((res) => {
            if (res.success == 'ok') {
              this.$alert('保存成功！', '提示', {
                confirmButtonText: '确定',
                type: 'success',
              });
              _this.listLoading = false;
            }
            else {
              _this.$message({
                showClose: true,
                message: '保存失败',
                type: 'success'
              });
              _this.listLoading = false;
            }
          }).catch(function (error) {
            _this.$message.error('数据错误！');
            _this.listLoading = false;
          });
        },

        //搜索
        f_Search:function () {
          this.listLoading = true;
          let _this=this;
          let parms = {};
          _this.$httpPost('ParamsSet/GParamsSetInfo', parms).then((res) => {
            if (res.success == 'ok') {
              if(res.paramsSet!=null&&res.paramsSet.length>0) {
                _this.editForm.Warningenable = res.paramsSet[0].Warningenable == 1 ? true : false;
                _this.editForm.Warningmin1 = res.paramsSet[0].Warningmin1;
                _this.editForm.Warningmin2 = res.paramsSet[0].Warningmin2;
                _this.editForm.Warningmax1 = res.paramsSet[0].Warningmax1;
              }
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
      mounted: function () {
        this.f_Search();
      },
    }
</script>

<style scoped>

</style>
