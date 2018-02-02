<template>
  <div class="statistic-order">
    <el-form class="search" :model="searchGroup" :inline="true">
        <el-form-item label="下单时间：">
          <el-date-picker type="datetime" v-model="searchGroup.startDate"></el-date-picker>
          <span>到</span>
          <el-date-picker type="datetime" v-model="searchGroup.endDate"></el-date-picker>
        </el-form-item>
        <el-form-item label="订单编号：">
          <el-input v-model="searchGroup.orderCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    <div class="middle flex-row ver-center">
      <div>订单总金额：<span>¥</span><span>{{totalOrders.totalOrderAmount}}</span></div>
      <div>商品总金额：<span>¥</span><span>{{totalOrders.totalProductAmount}}</span></div>
      <div>已退款金额：<span>¥</span><span>{{totalOrders.totalRefundAmount}}</span></div>
      <div>运费总计：<span>¥</span><span>{{totalOrders.totalExpense}}</span></div>
    </div>
    <el-table :data="statisticList" v-loading="loading" border>
      <el-table-column label="订单编号" prop="orderID" width="168" align="center">
      </el-table-column>
      <el-table-column label="收货人" prop="contact" width="160" align="center">
      </el-table-column>
      <el-table-column label="金额" prop="sumAmount" width="100" align="center">
      </el-table-column>
      <el-table-column label="已退款" prop="isRefund" width="80" align="center">
      </el-table-column>
      <el-table-column label="支付方式" prop="payChannel" width="106" align="center">
      </el-table-column>
      <el-table-column label="状态" class-name="third-font-color" prop="orderStatus" width="100" align="center">
      </el-table-column>
      <el-table-column label="下单时间" prop="orderTime" width="148" align="center">
      </el-table-column>
      <el-table-column label="付款时间" prop="payTime" width="148" align="center">
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination layout="prev, pager, next" :page-size="pageSize" :total="totalCount"
                     :current-page="currentPage" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<style>
  @import "../../css/center/statistic.css";
</style>

<script>
  import {
    getOrderStatistics,
    getOrderList
  } from '../../api/api';
  export default {
    data() {
      return {
        user: null,
        loading: false,
        // detail_prop
        orderList: [],
        searchGroup: {
          orderCode: '',
          startOrder: '',
          endOrder: '',
          productName: '',
        },
        searchForm: {},
        currentPage: 1,
        totalCount: 40,
        pageSize: 10,

        // statistic_prop
        statisticList: [],
        totalOrders: {}
      };
    },
    methods: {

      // statistic_event
      getStatisticList: () => {
        this.statisticList = [
          {
            orderID: '1558990000112256',
            contact: 'crystal',
            sumAmount: '210.00',
            isRefund: '是',
            payChannel: '支付宝',
            orderStatus: '退款成功',
            orderTime: '2017/1/1 0:00:00',
            payTime: '2017/1/1 0:00:00',
          },
          {
            orderID: '1558990000112256',
            contact: 'crystal',
            sumAmount: '210.00',
            isRefund: '是',
            payChannel: '支付宝',
            orderStatus: '退款成功',
            orderTime: '2017/1/1 0:00:00',
            payTime: '2017/1/1 0:00:00',
          }
        ];
        this.totalOrders = {
          totalOrderAmount: '0.00',
          totalProductAmount: '0.00',
          totalRefundAmount: '0.00',
          totalExpense: '0.00',
        };

        /*
         this.loading = true;
         let para = Object.assign({}, this.searchForm,
         {userID: this.filter.userID, startID: (this.currentPage-1)*this.pageSize+1, endID: this.currentPage*this.pageSize,orderStatus:'已完成'});
         getOrderList(para).then((res) => {
         this.loading = false;
         this.totalCount = res.data.total;
         this.statisticList = res.data.statistics;
         this.totalOrders = res.data.totalOrders;
         })
         */
      },

      // form_button_event
      handleSearch: () => {
        for (var p in this.searchGroup) {
          this.searchForm[p] = this.searchGroup[p];
        }
        this.searchForm.startDate = (!this.searchForm.startDate || this.searchForm.startDate == '') ? '' : date.formatDate.format(new Date(this.searchForm.startDate), 'yyyy-MM-dd');
        this.searchForm.endDate = (!this.searchForm.endDate || this.searchForm.endDate == '') ? '' : date.formatDate.format(new Date(this.searchForm.endDate), 'yyyy-MM-dd');
        if (this.activeName === 'detail') {
          this.getOrderList();
        } else if (this.activeName === 'statistic') {
          this.getStatisticList();
        } else {
          this.handleChangeYear();
          this.handleChangeMonth();
        }
      },
      // 页码变更
      handleCurrentChange: (val) => {
        this.currentPage = val;
        if (this.activeName === 'detail') {
          this.getOrderList();
        } else {
          this.getStatisticList();
        }
      }
    },
    created () {
      this.getStatisticList();
    }
  };
</script>
