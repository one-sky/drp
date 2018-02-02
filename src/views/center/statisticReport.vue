<template>
  <div class="statistic-report">
    <div class="box">
      <div class="top">
        <h1>{{this.year}}年订单数量统计</h1>
        <div class="factor">
          <div>交易总量：<span>{{getTotalOrder('year', 'orderNum')}}</span>个</div>
          <div>交易金额：<span>{{getTotalOrder('year', 'orderAmount')|formatMoney}}</span>元</div>
          <div>预估毛利：<span>{{getTotalOrder('year', 'orderProfit')|formatMoney}}</span>元</div>
          <div>运费总额：<span>{{getTotalOrder('year', 'freight')|formatMoney}}</span>元</div>
        </div>
      </div>
      <div class="middle">
        <h6>请选择：</h6>
        <el-select v-model="year" @change="handleChangeYear">
          <el-option v-for="item in years" :key="item" :label="item+'年'" :value="item"></el-option>
        </el-select>
        <el-radio-group v-model="yearIndex" @change="getYearChart">
          <el-radio v-for="item in index" :key="item" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </div>
      <div class="bottom" ref="yearChart"></div>
    </div>
    <div class="box">
      <div class="top">
        <h1>{{this.month_year}}年{{this.month}}月订单数量统计</h1>
        <div class="factor">
          <div>交易总量：<span>{{getTotalOrder('month', 'orderNum')}}个</span></div>
          <div>交易金额：<span>{{getTotalOrder('month', 'orderAmount')|formatMoney}}</span>元</div>
          <div>预估毛利：<span>{{getTotalOrder('month', 'orderProfit')|formatMoney}}</span>元</div>
          <div>运费总额：<span>{{getTotalOrder('month', 'freight')|formatMoney}}</span>元</div>
        </div>
      </div>
      <div class="middle">
        <h6>请选择：</h6>
        <el-select v-model="month_year" @change="handleChangeMonth">
          <el-option v-for="item in years" :key="item" :label="item+'年'" :value="item"></el-option>
        </el-select>
        <el-select v-model="month" @change="handleChangeMonth">
          <el-option v-for="item in months" :key="item" :label="item+'月'" :value="item"></el-option>
        </el-select>
        <el-radio-group v-model="monthIndex" @change="getMonthChart">
          <el-radio v-for="item in index" :key="item" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </div>
      <div class="bottom" ref="monthChart"></div>
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
        years: ['2016', '2017'],
        year: '2017',  // 年统计的年份
        month_year: '2017',  // 月统计的年
        months: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        month: '7',
        date: '',
        yearStatistic: [],
        monthStatistic: [],
        index: [
          {label: '订单量', value: 'orderNum'},
          {label: '交易额', value: 'orderAmount'},
          {label: '利润', value: 'orderProfit'},
          {label: '运费', value: 'freight'}
        ],
        yearIndex: 'orderNum',
        monthIndex: 'orderNum',
        echarts: require('echarts'),
      };
    },
    methods: {

      // report_event

      getYearStatistic: () => {
        this.yearStatistic = new Array();
        let param = {
          distributorId: this.user.distributorId,
          startDate: this.year + '-01',
          endDate: this.year + '-12',
          type: 1,

        };
        getOrderStatistics(param).then((res) => {
          if (res.status == 200) {
            var statistic = res.data;
            for (var i in statistic) {
              this.yearStatistic.push(statistic[i]);
              this.$set(this.yearStatistic[i], 'date', parseInt(statistic[i].dateStr.split('-')[1]));
            }
            this.getYearChart();
          }
        });
      },

      getMonthStatistic: () => {
        this.monthStatistic = new Array();
        var date = new Date(this.month_year + '-' + (parseInt(this.month) + 1) + '-01').getTime() - 10;
        var yesterday = new Date();
        yesterday.setTime(date);
        this.date = yesterday.getDate();
        let param = {
          distributorId: this.user.distributorId,
          startDate: this.month_year + '-' + this.month + '-01',
          endDate: this.month_year + '-' + this.month + '-' + this.date,
          type: 2,

        };
        getOrderStatistics(param).then((res) => {
          if (res.status == 200) {
            var statistic = res.data;
            for (var i in statistic) {
              this.monthStatistic.push(statistic[i]);
              this.$set(this.monthStatistic[i], 'date', parseInt(statistic[i].dateStr.split('-')[2]));
            }
            this.getMonthChart();
          }
        });
      },

      getYearChart: () => {
        var months = new Array();
        var data = new Array();
        for (var i = 0; i < 12; i++) {
          months.push((i + 1) + '月');
          for (var j = 0; j < this.yearStatistic.length; j++) {
            if (this.yearStatistic[j].date == i+1) {
              data.push(this.yearStatistic[j][this.yearIndex]);
              break;
            }
          }
          if (j >= this.yearStatistic.length) {
            data.push(0);
          }
        }
        var label = this.index.find((item) => {
          return item.value == this.yearIndex;
        }).label;
        var myChart = this.echarts.init(this.$refs.yearChart);
        myChart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: months
          },
          yAxis: {
            show: false
          },
          series: [{
            name: label,
            type: 'line',
            smooth: true,
            data: data
          }],
          color: ['#c0e42e'],
        });
      },

      getMonthChart: () => {
        var days = new Array();
        var data = new Array();
        for (var i = 0; i < parseInt(this.date); i++) {
          for (var j = 0; j< this.monthStatistic.length; j++) {
            days.push((i + 1) + '日');
            if (this.monthStatistic[j].date == i + 1) {
              data.push(this.monthStatistic[j][this.monthIndex] && this.monthStatistic[j][this.monthIndex] != '' ? this.monthStatistic[j][this.monthIndex] : 0);
              break;
            }
          }
          if (j >= this.monthStatistic.length) {
            data.push(0);
          }
        }
        var label = this.index.find((item) => {
          return item.value == this.monthIndex;
        }).label;
        var myChart = this.echarts.init(this.$refs.monthChart);
        myChart.setOption({
          tooltip: {
            trigger: 'axis'
          },

          xAxis: {
            type: 'category',
            data: days

          },
          yAxis: {
            show: false
          },
          series: [{
            name: label,
            type: 'line',
            smooth: true,
            data: data
          }],
          color: ['#c0e42e']
        });
      },

      // 获取订单统计量
      getTotalOrder: (type, property) => {
        // type: year/month  property: orderNum, orderAmmount, orderProfit, frieight
        var a = 0;
        if (type == 'year') {
          for (var i in this.yearStatistic) {
            a += this.yearStatistic[i].orderNum;
          }
        } else {
          for (var i in this.yearStatistic) {
            a += this.yearStatistic[i][property];
          }
        }
        return a;
      },
      // update year
      handleChangeYear: () => {
        this.getYearStatistic();
        this.getYearChart();
      },
      // update year or month
      handleChangeMonth: () => {
        this.getMonthStatistic();
        this.getMonthChart();
      },
      // report_event end

      // detail_event
      getOrderList: () => {
        let param = Object.assign({}, this.searchForm, {distributorId: this.user.distributorId, vendorId: this.user.vendorId, pageNum: this.currentPage});
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
    },
    created () {
      this.handleChangeYear();
      this.handleChangeMonth();
    }
  };
</script>
