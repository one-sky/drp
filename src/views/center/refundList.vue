<template>
  <div class="order-list">
    <el-tabs class="center-tab">
      <el-tab-pane label="售后订单" name="售后订单">
      </el-tab-pane>
    </el-tabs>
    <div class="search">
      <el-form ref="searchGroup" :model="searchGroup" :inline="true">
        <el-row>
          <el-form-item label="订单编号：">
            <el-input v-model="searchGroup.orderCode"></el-input>
          </el-form-item>
          <el-form-item label="下单时间：">
            <el-date-picker type="datetime" v-model="searchGroup.startDate"></el-date-picker>
            <span>到</span>
            <el-date-picker type="datetime" v-model="searchGroup.endDate"></el-date-picker>
          </el-form-item>

        </el-row>
        <el-row>
          <el-form-item label="商品名称：">
            <el-input v-model="searchGroup.spuName"></el-input>
          </el-form-item>
          <el-form-item class="receiver" label="收货人／电话：">
            <el-input v-model="searchGroup.receiverPhone"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleSearch" type="primary">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>

    </div>

    <div class="table">
      <el-table :data="orderList">
        <el-table-column type="expand">
          <template scope="props">
            <el-row class="flex-row ver-center">
              <el-col :span="16">
                <template v-for="n in (props.row.orderItem.length>3 ? 3:props.row.orderItem.length)">
                  <div class="flex-row">
                    <div class="flex-row" style="width:38%;">
                      <router-link :to="{path: '/productDetail', query: {product: props.row.orderItem[n-1].productId}}">
                        <img v-bind:src="props.row.orderItem[n-1].skuImg" width="51" height="51">
                      </router-link>
                      <div class="flex-col">
                        <router-link class="link a4_link" :to="{path: '/productDetail', query: {product: props.row.orderItem[n-1].productId}}">
                          {{props.row.productName}}
                        </router-link>
                        {{props.row.orderItem[n-1].skuAttributes|formatAttribute}}
                        ￥{{props.row.orderItem[n-1].skuPrice}}*{{props.row.orderItem[n-1].skuQuantity}}
                      </div>
                    </div>

                    <div class="flex-col ver-center" style="width:22%;">
                      ￥{{props.row.orderItem[n-1].paidAmount|formatMoney}}
                      <p class="third-font-color">
                        （ 支付方式：{{props.row.payChannel|payChannel(props.row.payChannel)}}）
                      </p>
                    </div>
                    <div class="text-center" style="width:28%;">
                      {{props.row.orderItem[n-1].refundQuantity}}
                    </div>
                    <div class="text-center" style="width:14%;">
                      {{props.row.orderItem[n-1].refundMoney|formatMoney}}
                    </div>
                  </div>
                </template>
                <template v-if="props.row.orderItem.length>3">
                  <template v-for="n in props.row.orderItem.length-3 ">
                    <div class="flex-row">
                      <div class="flex-row" style="width:38%;">
                        <router-link :to="{path: '/productDetail', query: {product: props.row.orderItem[n+2].productId}}">
                          <img v-bind:src="props.row.orderItem[n+2].skuImg" width="51" height="51">
                        </router-link>
                        <div class="flex-col">
                          <router-link class="link a4_link" :to="{path: '/productDetail', query: {product: props.row.orderItem[n+2].productId}}">
                            {{props.row.productName}}
                          </router-link>
                          {{props.row.orderItem[n-1].skuAttributes|formatAttribute}}
                          ￥{{props.row.orderItem[n-1].skuPrice}}*{{props.row.orderItem[n-1].skuQuantity}}
                        </div>
                      </div>

                      <div class="flex-col ver-center" style="width:22%;">
                        ￥{{props.row.orderItem[n+2].paidAmount|formatMoney}}
                        <p class="third-font-color">
                          （ 支付方式：{{props.row.payChannel|payChannel(props.row.payChannel)}}）
                        </p>
                      </div>
                      <div class="text-center" style="width:28%;">
                        {{props.row.orderItem[n+2].refundQuantity}}
                      </div>
                      <div class="text-center" style="width:14%;">
                        {{props.row.orderItem[n+2].refundMoney|formatMoney}}
                      </div>
                    </div>
                  </template>
                </template>
              </el-col>
              <el-col :span="8" :key="isShowAll" class="hor-ver-center">
                <el-col :span="10" class="text-center">
                  {{props.row.status|orderStatus(props.row.status)}}
                </el-col>
                <el-col :span="14" class="text-center">
                  {{props.row.reviewStatus|refundStatus(props.row.reviewStatus)}}
                </el-col>
              </el-col>
            </el-row>

            <div class="hor-center text-center more">
              共{{props.row.orderItem.length}}件商品
              <el-button type="primary" v-if="props.row.orderItem.length>3"  ref="more_button" @click="handleShowAll">{{more_button_message}}</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单详情" prop="orderCode" width="240" align="left"></el-table-column>
        <el-table-column label="订单金额" width="130" align="center"></el-table-column>
        <el-table-column label="退款数量" width="170" align="center"></el-table-column>
        <el-table-column label="退款金额" width="100" align="center"></el-table-column>
        <el-table-column label="订单状态" width="120" align="center"></el-table-column>
        <el-table-column label="售后状态" prop="orderTime" align="center"></el-table-column>
      </el-table>

    </div>
    <div class="pagination">
      <el-pagination layout="prev, pager, next" :page-size="pageSize" :total="totalCount"
                     :current-page="currentPage" @current-change="handleCurrentChange">
      </el-pagination>
    </div>

  </div>
</template>

<style>
  @import "../../css/center/orderList.css";

</style>

<script>
  export default {
    data () {
      return {
        user: {
          userId: 1,
          vendorId: 1,
          distributorId: 13
        },
        searchGroup: {
          orderNumber: '',
          startDate: '',
          endDate: '',
          productName: '',
          receiveParam: ''
        },
        searchForm: {
          orderNumber: '',
          startDate: '',
          endDate: '',
          productName: '',
          receiveParam: ''
        },
        orderList: [],
        orderItem: [],
        collapseName: '',
        currentPage: 1,
        pageSize: 4,
        totalCount: null,
        loading: false,
        isShowAll: false,
        more_button_message: '展开',

      };
    },
    methods: {
      getRefundList: function () {
        this.orderList = [{
          orderCode: '1111',
          orderTime: '12232312313',
          orderItem: [{
            skuAttributes: '颜色分类：红；',
            refundQuantity: 1,
            refundMoney: 112.0,
          },
          {
            skuAttributes: '颜色分类：白；',
            refundQuantity: 1,
            refundMoney: 100.0,
          }],
          payChannel: 'alipay_pc_direct',
          productName: 'aa',
          receiveName: 'cyw',
          reveivePhone: '17826856409',
          provinceDesc: '浙江省',
          cityDesc: '杭州市',
          areaDesc: '浙江理工大学生活一区',
          status: 1,
          reviewStatus: 1
        }];
      },
      // form_button_event
      handleSearch: function () {
        for (let p in this.searchGroup) {
          this.searchForm[p] = this.searchGroup[ p ];
        }
        this.searchForm.startDate = (!this.searchForm.startDate || this.searchForm.startDate == '') ? '' : date.formatDate.format(new Date(this.searchForm.startDate), 'yyyy-MM-dd');
        this.searchForm.endDate = (!this.searchForm.endDate || this.searchForm.endDate == '') ? '' : date.formatDate.format(new Date(this.searchForm.endDate), 'yyyy-MM-dd');
        if (this.searchGroup.orderStatus) {
          this.currentPage = 1;
        }
        this.getRefundList();
      },

      handleExport: function () {
      },

      // 页码变更
      handleCurrentChange: function (val) {
        for (var p in this.searchForm) {
          this.searchGroup[ p ] = this.searchForm[ p ];
        }
        this.currentPage = val;
        this.getRefundList();
      },

      handleShowAll: function () {
        this.isShowAll = !this.isShowAll;
        if (this.isShowAll) {
          this.more_button_message = '收起';
        } else {
          this.more_button_message = '更多';
        }
      },

    },
    mounted () {
      this.getRefundList();
    },
    filters: {
      payChannel: (channel) => {
        switch (channel) {
          case 'upacp_pc':
            return '银联';
          case 'wx_pub_qr':
            return '微信支付';
          default:
            return '支付宝';
        }
      }
    },
    // 过滤订单状态
    orderStatus: (value) => {
      switch (value) {
        case 1:
          return '待退款';
        case 2:
          return '已退款';
        case 3:
          return '已关闭';
        default:
          return '已取消';
      }
    },
    // 过滤退款审核状态
    refundStatus: (value) => {
      switch (value) {
        case 1:
          return '审批中';
        case 2:
          return '审批通过';
        default:
          return '审批未通过';
      }
    },
  };
</script>
