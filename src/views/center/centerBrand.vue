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
        <div class="brand" v-for="(brand,index) in brandList" :style="{'margin-left': (index%7==0?0:15)+'px'}">
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
      <el-pagination layout="prev, pager, next" :page-size="page.pageSize" :total="page.totalCount"
                     :current-page="page.currentPage" @current-change="handleCurrentChange">
      </el-pagination>
    </div>

    <el-dialog title="选择渠道" :visible.sync="dialogFormVisible" v-loading="loading" @open="getChannelList()" @close="resetDialog('ruleForm')">
      <el-form :model="channel" ref="ruleForm">
        <el-form-item label="分销渠道：">
          <el-select v-model="channel.channel" >
            <el-option v-for="item in channelList" :key="item.channelId" :label="item.name" :value="item.channelId"></el-option>
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
  import {
    getBrandListByAgentBrand,
  } from '../../api/api';

  import {
    GetChannelList,
    GetAgentBrand,
    InsertAgentBrand
  } from '../../js/distributor';

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

        channelList: [],
        channel: {
          channel: null
        },
        currBrand: null, // 下载授权书时标记品牌下标
        page: {
          pageSize: 10,
          totalCount: 40,
          currentPage: 1,
        },
        
        loading: false,
        dialogFormVisible: false,

      };
    },

    methods: {
      getBrandListByAgentBrand: function () {
        this.loading = true;
        const param = {
          distributorId: this.user.id,
          brandName: this.searchForm.name,
          status: this.activeName == 'N' ? 'all' : this.activeName,
          pageNum: this.page.currentPage,
          pageSize: this.page.pageSize
        };
        getBrandListByAgentBrand(param).then((res) => {
          if (res.status == 200) {
            this.page.totalCount = res.page.total;
            this.$set(this, 'brandList', res.data);
            this.loading = false;
          }
        });
      },

      // 获取分销商已代理渠道
      getChannelList: function () {
        GetChannelList((channelList) => this.$set(this, 'channelList', channelList));
      },

      // tab_event
      handleClick: function (tab, event) {
        // reset
        this.searchGroup = {
          name: ''
        };
        this.searchForm = {
          name: ''
        };
        this.page.currentPage = 1;
        this.getBrandListByAgentBrand();
      },

      handleSearch: function () {
        this.searchForm = {...this.searchGroup};
        this.page.currentPage = 1;
        this.getBrandListByAgentBrand();
      },

      showActive: function (key, prop, value) {
        this.$set(this.brandList[key], prop, value);
      },

      fileDownload: function (id) {
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

      authorFileDownload: function () {
        // for (var i in this.brandList.agentBrandVOS) {
        //   // key
        //   if (this.brandList.agentBrandVOS.channelId == this.channel.channel) {
        //     window.open(this.brandList.agentBrandVOS[i].brandCertificate, '_blank');
        //     return;
        //   }
        // }
        this.$message({
          message: '下载失败，请重试',
          type: 'error'
        });
        this.dialogFormVisible = false;
      },

      // 页码变更
      handleCurrentChange: function (val) {
        this.page.currentPage = val;
        this.getBrandListByAgentBrand();
      },

      openDialog: function (key) {
        this.dialogFormVisible = true;
        this.currBrand = key;
      },

      resetDialog: function (formName) {
        this.$refs[formName].resetFields();
      }
    },

    created () {
      this.$set(this, 'user', JSON.parse(sessionStorage.getItem('user')));
      this.getBrandListByAgentBrand();
    }

  };
</script>

