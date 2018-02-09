<template>
  <div class="brand-detail flex-col ver-center">
    <div class="top flex-row">
      <!--left pic-->
      <img v-bind:src="brandDetail.brandPic" height="270" width="720"/>
      <!--right info-->
      <div class="right flex-col">
        <div class="flex-row">
          <img v-bind:src="brandDetail.logo" height="61" width="113"/>
          <img class="seperate" src="../../imgs/brand/split.png" height="80" width="1"/>
          <div class="flex-col hor-center">
            <h1 class="stress-size fz_font">{{brandDetail.brandName}}</h1>
            <template v-if="!brandAgent || brandAgent.status=='R'">
              <el-button class="agent" type="text" @click="handleAgentBrand">
                <img src="../../imgs/brand/agent.png" height="11" width="11"/>申请代理
              </el-button>
            </template>
            <div v-else class="agented hor-ver-center">
              {{brandAgent.status|formateStatusDesc(brandAgent.status)}}
            </div>
          </div>

        </div>
        <p v-html="brandDetail.description"></p>

      </div>
    </div>

    <el-tabs class="middle" type="border-card" v-model="brandDetail_tab">
      <el-tab-pane label="商品" name="商品" class="flex-row-col">
        <div class="product" v-for="item in productList" >
          <router-link class="flex-row hor-ver-center":to="{path: '/productDetail', query:{ product: item.productId }}" >
            <img v-bind:src="item.thumbnailImage" height="226" width="206"/>
          </router-link>
          <router-link class="long-title" :to="{path: '/productDetail', query:{ product: item.productId }}" >
            {{item.productName}}
          </router-link>
          <div class="third-font-color price-size">
            <span class="price-icon-size">¥</span>{{item.retailPrice|formatMoney}}
          </div>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="品牌故事" name="品牌故事">
        <p v-html="brandDetail.brandDiary"></p>
      </el-tab-pane> -->
      <el-tab-pane label="招募书" name="招募书">
        <p v-html="brandDetail.recruitment"></p>
      </el-tab-pane>
    </el-tabs>
    <!--分页-->
    <div v-if="brandDetail_tab == '商品'" class="pagination flex-row hor-center">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-size="page.pageSize"
        layout="prev, pager, next"
        :total="page.totalCount">
      </el-pagination>
    </div>
    <el-dialog title="申请代理" :visible.sync="storeDialog" @close="resetDialog('storeForm')" class="dialog" >
      <el-form ref="storeForm"  class="form" label-width="100px">
        <el-form-item label="分销渠道：">
            <el-select v-model="channelId" ref="channel">
              <el-option
                v-for="channel in channelList"
                :key="channel.id"
                :label="channel.name"
                :value="channel.id"
              ></el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="center-dialog-bottom">
        <el-button @click="storeDialog = false">取 消</el-button>
        <el-button type="primary" :disabled="!channelId" @click="insertAgentBrand()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<style>
  @import "../../css/brand.css";
</style>

<script>
  import {
    getBrandById,
    getProductList
  } from '../../api/api.js';

  import {
    GetChannelList,
    GetAgentBrand,
    InsertAgentBrand
  } from '../../js/distributor';

  export default {
    data () {
      return {
        user: {},
        status: {
          status: null,
          statusDesc: null
        },
        // 品牌详情
        brandDetail: {},
        // 品牌代理情况
        brandAgent: {},
        productList: [],

        // 申请代理
        channelId: null,
        storeDialog: false,

        channelList: [],
        page: {
          currentPage: 1,
          pageSize: 20,
          totalCount: null,
        },
        // 商品tab
        brandDetail_tab: '商品',
      };
    },
    methods: {
      // 获取品牌详情
      getBrandById: function () {
        const param = {
          id: this.brandDetail.id,
        };
        getBrandById(param).then((res) => {
          if (res.status == 200) {
            if(res.data) {
              this.$set(this, 'brandDetail', res.data);
              this.brandDetail.brandAttachmentEntityList.map(item => {
                switch(item.type) {
                  case '1': 
                    this.$set(this.brandDetail, 'brandPic', item);
                    return true;
                  case '3':
                    this.$set(this.brandDetail, 'recruitment', item);
                    return true;
                  default:
                    return false;
                }
              });
              return true;
            }
          }
          this.$message({
            message: '找不到该品牌',
            type: 'warning',
            duration: 2000,
            onClose: () => {
              this.$router.push({ path: '/brandList' });
            }
          });
        });
      },

      // 获取代理品牌
      getAgentBrand: function () {
        GetAgentBrand(
          this.brandDetail.id,
          (brand) => {
            this.$set(this, 'brandAgent', brand);
          }
        );
      },

      // 获取分销商已代理渠道
      getChannelList: function () {
        GetChannelList((channelList) => this.$set(this, 'channelList', channelList));
      },

      // 点击申请代理btn
      handleAgentBrand: function () {
        this.user.distributorId && (this.storeDialog = true) || this.$router.push({ path: '/login' });
      },

      // 申请代理
      insertAgentBrand: function () {
        InsertAgentBrand(
          this.brandDetail.id,
          this.channelId,
          (result) => {
            if (result) {
              this.storeDialog = false;
              this.getAgentBrand();
            }
          }
        );
      },
      getProductList: function () {
        const param = {
          brandIds: [this.brandDetail.id],
          page: this.page.currentPage,
          pageSize: this.page.pageSize
        };
        getProductList(param).then((res) => {
          if (res.status == 200) {
            this.$set(this, 'productList', res.data);
            this.page.totalCount = res.page.total;
          }
        });
      },
      resetDialog (formName) {
        this.channelId = '';
        this.$refs[formName].resetFields();
      },
      // 页码变更
      handleCurrentChange: function (val) {
        this.currentPage = val;
        this.getProductList();
      },

    },
    created () {
      if (!this.$route.query.brand) {
        this.$router.push({ path: '/brandList' });
      } else {
        this.$set(this.brandDetail, 'id', this.$route.query.brand);
      }
      this.$set(this, 'user', JSON.parse(sessionStorage.getItem('user')));
      this.getBrandById();
      this.getProductList();
      if (this.user) {
        this.getAgentBrand();
        this.getChannelList();
      }
    },
    filters: {
      formateStatusDesc: (status) => {
        if (!status || status == 'R') {
            return '申请代理';
        } else if (status == 'W') {
          return '等待审核';
        } else {
          return '已代理';
        }
      }
    }
  };
</script>

