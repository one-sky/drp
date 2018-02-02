<template>
  <div class="center-brand" >
    <el-tabs class="center-tab" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="已代理" name="Y"></el-tab-pane>
      <el-tab-pane label="未代理" name="N"></el-tab-pane>
      <el-tab-pane label="审核中" name="W"></el-tab-pane>
      <el-tab-pane label="已拒绝" name="R"></el-tab-pane>
    </el-tabs>

    <div class="search">
      <el-form ref="searchGroup" :model="searchGroup" :inline="true" class="brand flex-row ver-center">
        <el-form-item label="品牌名称：">
            <el-input v-model="searchGroup.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item v-if="activeName=='Y'">温馨提示：鼠标滑到品牌底部可下载授权书和商品资料</el-form-item>
      </el-form>

    </div>

    <div class="grid flex-row-col" v-loading="loading" >
        <div class="brand" v-for="(brand,index) in brandList.rBrands" :style="{'margin-left': (index%7==0?0:15)+'px'}">
          <router-link :to="{path: '/brandDetail', query:{brand: brand.brandId}}" >
            <img v-bind:src="brand.logo" width="160" height="130">
          </router-link>
          <div v-if="activeName == 'Y'" class="download flex-row">
            <div @mouseenter="showActive(index, 'packageActive' , true)" @mouseleave="showActive(index,'packageActive', false)">
              <el-button type="primary"  v-on:click="fileDownload(index)" v-show = "brand.packageActive">
                资料包
              </el-button>
            </div>
            <div @mouseenter="showActive(index, 'authorActive',  true)" @mouseleave="showActive(index, 'authorActive', false)">
              <el-button type="primary"  v-on:click="openDialog(index)" v-show = "brand.authorActive">
                授权书
              </el-button>
            </div>

          </div>

        </div>
    </div>

    <div class="pagination">
      <el-pagination layout="prev, pager, next" :page-size="pageSize" :total="totalCount"
                     :current-page="currentPage" @current-change="handleCurrentChange">
      </el-pagination>
    </div>

    <el-dialog title="选择渠道" :visible.sync="dialogFormVisible" v-loading="loading" @open="getChannelOption()" @close="resetDialog('ruleForm')">
      <el-form :model="channel" :rules="dialog_rules" ref="ruleForm">
        <el-form-item label="分销渠道：" prop="channel" >
          <el-select v-model="channel.channel" >
            <el-option v-for="item in channelOption" :key="item.id" :label="item.channelName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="center-dialog-bottom">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="authorFileDownload()" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
  @import "../../css/center/centerBrand.css";


</style>

<script>
  import {getBrandListByAgentBrand, getChannelOption} from '../../api/api';
  export default {
    data () {
      return {
        activeName: 'Y',
        user: {
          userId: 101,
          vendorId: 1,
          distributorId: 29
        },
        searchGroup: {
          name: ''
        },

        searchForm: {
          name: ''
        },

        brandList: [],

        channelOption: [],
        channel: {
          channel: null
        },
        currBrand: null, // 下载授权书时标记品牌下标

        pageSize: 10,
        totalCount: 40,
        currentPage: 1,
        loading: false,
        dialogFormVisible: false,

        dialog_rules: {
          channel: [
            {
              type: 'number',
              required: true,
              message: '请选择分销渠道',
              trigger: 'change'
            }
          ],
        },
      };
    },

    methods: {
      getBrandListByAgentBrand: () => {
        this.loading = true;
        let param = {
          distributorId: this.user.distributorId,
          vendorId: this.user.vendorId,
          brandName: this.searchForm.name,
          status: this.activeName == 'N' ? '' : this.activeName,
          pageNum: this.currentPage
        };
        getBrandListByAgentBrand(param).then((res) => {
          if (res.status == 200) {
            this.totalCount = res.page.totalNum;
            this.brandList = res.data;
            for (var i in this.brandList.rBrands) {
              this.$set(this.brandList.rBrands[i], 'packageActive', false);
              this.$set(this.brandList.rBrands[i], 'authorActive', false);
            }
            this.loading = false;
          }
        });
      },

      // 获取渠道列表
      getChannelOption: () => {
        let param = {};
        this.channelOption = new Array();
        getChannelOption(param).then((res) => {
          if (res.status == 200) {
            var channelOption = res.data;
            for (var i in channelOption) {
              if (channelOption[i].status == 1) {
                this.channelOption.push(channelOption[i]);
              }
            }
          }
        });
      },

      // tab_event
      handleClick: (tab, event) => {
        // reset
        this.searchGroup = {
          name: ''
        };
        this.searchForm = {
          name: ''
        };
        this.currentPage = 1;
        this.getBrandListByAgentBrand();
      },

      handleSearch: () => {
        this.searchForm.name = this.searchGroup.name;
        this.currentPage = 1;
        this.getBrandListByAgentBrand();
      },

      showActive: (key, prop, value) => {
        this.$set(this.brandList.rBrands[key], prop, value);
      },

      fileDownload: (id) => {
        for (var i in this.brandList.agentBrandVOS) {
          if (this.brandList.agentBrandVOS[i].id == this.brandList.rBrands[id].id) {
            window.open(this.brandList.agentBrandVOS[i].brandCertificate, '_blank');
            return;
          }
        }
        this.$message({
          message: '下载失败，请重试',
          type: 'error'
        });
      },

      authorFileDownload: () => {
        for (var i in this.brandList.agentBrandVOS) {
          // key
          if (this.brandList.agentBrandVOS.channelId == this.channel.channel) {
            window.open(this.brandList.agentBrandVOS[i].brandCertificate, '_blank');
            return;
          }
        }
        this.$message({
          message: '下载失败，请重试',
          type: 'error'
        });
        this.dialogFormVisible = false;
      },

      // 页码变更
      handleCurrentChange: (val) => {
        this.currentPage = val;
        this.getBrandList(this.searchForm, this.currentPage);
      },

      openDialog: (key) => {
        this.dialogFormVisible = true;
        this.currBrand = key;
      },

      resetDialog: (formName) => {
        this.$refs[formName].resetFields();
      }
    },

    created () {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.getBrandListByAgentBrand();
    }

  };
</script>

