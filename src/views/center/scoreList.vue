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
            {{orderTime|formatDate}}
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
      <el-pagination layout="prev, pager, next" :page-size="pageSize" :total="totalCount"
                     :current-page="currentPage" @current-change="handleCurrentChange">
      </el-pagination>
    </div>

  </div>

</template>

<style>
  @import "../../css/center/scoreList.css";
</style>

<script>
  import { getPoints } from '../../api/api';
  export default {
    data () {
      return {
        user: {
          userId: 1,
          vendorId: 1,
          distributorId: 13
        },
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
        currentPage: 1,
        pageSize: 10,
        totalCount: 40,
        loading: false,
      };
    },
    methods: {
      getPoints: () => {
        this.loading = true;
        let param = Object.assign({}, this.searchForm, {distributorId: this.user.distributorId, vendorId:this.user.vendorId, pageNum: this.currentPage});
        getPoints(param).then((res) => {
          this.loading = false;
          this.totalCount = res.page.totalNum;
          this.scoreList = res.data;
        });
      },
      formatDate (row, column, cellValue) {
        var time = row[column.property];
        return (!time || time == '') ? '' : date.formatDate.format(new Date(time), 'yyyy-MM-dd hh:mm:ss');
      },

      handleSearch: () => {
        this.searchForm.orderCode = this.searchGroup.orderCode;
        this.searchForm.startDate = (!this.searchGroup.startDate || this.searchGroup.startDate === '') ? '' : date.formatDate.format(new Date(this.searchGroup.startDate), 'yyyy-MM-dd hh:mm:ss');
        this.searchForm.endDate = (!this.searchGroup.endDate || this.searchGroup.endDate === '') ? '' : date.formatDate.format(new Date(this.searchGroup.endDate), 'yyyy-MM-dd hh:mm:ss');
        this.currentPage = 1;
        this.getPoints();
      },

      // 页码变更
      handleCurrentChange: (val) => {
        for (var p in this.searchForm) {
          this.searchGroup[p] = this.searchForm[p];
        }
        this.currentPage = val;
        this.getPoints();
      }
    },
    created () {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.getPoints();
    }

  };
</script>
