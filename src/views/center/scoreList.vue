<template >
  <div class="score-list">
    <div class="search flex-col hor-center">
      <el-form :model="searchGroup" :inline="true">
        <el-form-item label="订单编号：">
          <el-input  v-model="searchGroup.orderCode"></el-input>
        </el-form-item>
        <el-form-item label="下单时间：">
          <el-date-picker type="datetime" v-model="searchGroup.startDate"></el-date-picker>
          <span>到</span>
          <el-date-picker type="datetime" v-model="searchGroup.endDate"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table">
      <el-table :data="scoreList" v-loading="loading" border >
        <el-table-column label="时间" width="230" align="center">
          <template scope="scope">
            {{formatDate(orderTime)}}
          </template>
        </el-table-column>
        <el-table-column prop="pointsType" label="来源" width="216" align="center">
        </el-table-column>
        <el-table-column prop="orderNumber" label="订单号" width="230" align="center">
        </el-table-column>
        <el-table-column class-name="third-font-color" prop="points" label="积分" width="105" align="center">
        </el-table-column>
        <el-table-column prop="pointsBefore" label="交易前积分" width="114" align="center">
        </el-table-column>
        <el-table-column class-name="third-font-color" prop="pointsAfter" label="交易后积分" width="114" align="center">
        </el-table-column>
      </el-table>
    </div>


    <div class="pagination">
      <el-pagination layout="prev, pager, next" :page-size="page.pageSize" :total="page.totalCount"
                     :current-page="page.pageNum" @current-change="handleCurrentChange">
      </el-pagination>
    </div>

  </div>

</template>

<style>
  @import "../../css/center/scoreList.css";
</style>

<script>
  import {
    getPoints
  } from '../../api/api';
  import * as formatDate from '../../js/date';
  export default {
    data () {
      return {
        user: {},
        searchGroup: {
          orderCode: '',
          startDate: '',
          endDate: ''
        },
        searchForm: {
          orderCode: '',
          startDate: '',
          endDate: ''
        },
        scoreList: [],
        page: {
          pageNum: 1,
          pageSize: 10,
          totalCount: 40,
        },
        loading: false,
      };
    },
    methods: {
      getPoints: function () {
        this.loading = true;
        const param = {
          ...this.searchForm,
          distributorId: this.user.id,
          pageNum: this.page.currentPage
        };
        getPoints(param).then((res) => {
          this.loading = false;
          this.page.totalCount = res.page.totalNum;
          this.$set(this, 'scoreList', res.data);
        });
      },
      handleSearch: function () {
        this.searchForm.startDate = this.searchForm.startDate && formatDate.formatDate.format(new Date(this.searchForm.startDate), 'yyyy-MM-dd');
        this.searchForm.endDate = this.searchForm.endDate && formatDate.formatDate.format(new Date(this.searchForm.endDate), 'yyyy-MM-dd');
        this.page.pageNum = 1;
        this.getPoints();
      },

      // 页码变更
      handleCurrentChange: function (val) {
        for (var p in this.searchForm) {
          this.searchGroup[p] = this.searchForm[p];
        }
        this.page.pageNum = val;
        this.getPoints();
      }
    },
    created () {
      this.$set(this, 'user', JSON.parse(sessionStorage.getItem('user')));
      this.getPoints();
    }

  };
</script>
