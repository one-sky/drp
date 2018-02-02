<template>
  <div class="statistic-item">
    <el-form class="search" :model="searchGroup" :inline="true">
      <el-form-item label="下单时间：">
        <el-date-picker type="datetime" v-model="searchGroup.startDate"></el-date-picker>
        <span>到</span>
        <el-date-picker type="datetime" v-model="searchGroup.endDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="订单编号：">
        <el-input v-model="searchGroup.orderCode"></el-input>
      </el-form-item>
      <el-form-item label="商品名称：">
        <el-input v-model="searchGroup.productName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleSearch" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="orderList" v-loading="loading" border>
        <el-table-column label="订单编号" prop="orderCode" width="163" align="center">
        </el-table-column>
        <el-table-column label="商品名称" width="240" align="center">
          <template scope="scope">
            <div class="ub" style="width:216px;">
              <div class="ub" style="width:48px; margin-top:10px;">
                <img v-bind:src="scope.row.skuImg" width="48" height="48"/>
              </div>
              <div class="ub" style="width:150px; margin-left:16px;">
                {{scope.row.productName}}
              </div>
            </div>

          </template>
        </el-table-column>
        <el-table-column label="规格" width="118" align="center">
          <template scope="scope">
            <div>
              {{scope.row.skuAttributes|formatAttribute}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="skuQuantity" width="67" align="center">
        </el-table-column>
        <el-table-column label="退货" class-name="third-font-color" width="86" align="center">
          <template scope="scope">
            <img v-bind:src="scope.row.skuImg" width="48" height="48"/>
            <div class="long-title">
              {{scope.row.skuName}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="88" align="center">
          <template scope="scope">
            <div>{{scope.row.skuPrice|formatMoney}}</div>
          </template>
        </el-table-column>
        <el-table-column label="小计" class-name="third-font-color" width="114" align="center">
          <template scope="scope">
            <div>{{(scope.row.skuPrice*scope.row.skuQuantity)|formatMoney}}</div>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="134" align="center">
          <template scope="scope">
            <div>{{scope.row.orderTime|formatDate}}</div>
          </template>
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
    data () {
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

      // detail_event
      getOrderList: () => {
        let param = Object.assign({}, this.searchForm, {distributorId: 30, vendorId: 1, pageNum: this.currentPage});
        getOrderList(param).then((res) => {
          if (res.status == 200) {
            this.totalCount = res.page.totalNum;
            var orderList = res.data;
            for (var i = 0; i < orderList.length; i++) {
              for (var j = 0; j < orderList[i].oOrderItems.length; j++) {
                this.orderList.push(Object.assign({}, orderList[i].oOrderItems[j], {orderCode: orderList[i].orderCode, orderTime: orderList[i].orderTime}));
              }
            }
          }
        });
      },
      // form_button_event
      handleSearch: () => {
        for (var p in this.searchGroup) {
          this.searchForm[p] = this.searchGroup[ p ];
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
      this.getOrderList();
    }
  };
</script>
