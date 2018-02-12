<template>
  <div class="pay">
    <div class="seperate-bar"></div>
    <div class="order success flex-col hor-ver-center">
        <template v-if="flag">
            <div class="flex-row ver-center">
                <img class="success-icon" src="../../imgs/login/register_success.png" height="56" width="56"/>
                <h1>恭喜您，支付成功！</h1>
            </div>
            <div class="flex-col" style="margin-top: 30px;">
                <div class="flex-row">
                    <div>支付方式:&nbsp;&nbsp;</div>
                    <div>{{orderDetail.paymentChannel|paymentChannel(orderDetail.paymentChannel)}}</div>
                </div>
                <div class="flex-row"  style="margin-top:10px;color:#7e7e7e;font-size:14px;">
                    <div>订单编号:&nbsp;&nbsp;</div>
                    <div>{{orderDetail.orderCode}}</div>
                </div>
                <div  class="flex-row" style="margin-top:10px;color:#7e7e7e;font-size:14px;margin-bottom:24px;">
                    <div>支付金额:&nbsp;&nbsp;</div>
                    <div style="color:#ffdb15">{{orderDetail.totalAmount|formatMoney}}元</div>
                </div>
            </div>
            <div class="flex-row hor-between" style="margin-top:10px;width: 300px;">
                <el-button type="primary" @click="toOrder(orderDetail.id)">订单详情</el-button>
                <el-button type="primary" @click="toShoppingCart()">返回购物车</el-button>
                <el-button type="primary" @click="toProductList()">继续购物</el-button>
            </div>
        </template>
        <template v-else>
            <h1>未支付成功,请重新支付</h1>
            <el-button type="primary" class="pay-btn" @click="toPayPage">去支付</el-button>
        </template>
    </div>

  </div>
</template>

<style>
  @import "../../css/purchase/pay.css";
</style>

<script>
  import {
    getOrderDetail
  } from '../../api/api';
  export default {

    data () {
      return {
        orderId: null,
        user: {},
        orderDetail: {},
        orderResult: null,
        flag: false,
        loading: false,
      };
    },
    methods: {
      getOrderDetail: function () {
        const param = {
          distributorId: this.user.id,
          orderIds: [this.orderId]
        };
        getOrderDetail(param).then((res) => {
          if (res.status == 200) {
            this.$set(this, 'orderDetail', res.data);
            this.flag = true; // 支付成功
            this.loading = false;
          }
        });
      },
      toOrder: function (id) {
        this.$router.push(
          {
            path: '/center/orderDetail',
            query: {
              order: this.orderId
            }
          }
        );
      },
      toShoppingCart: function () {
        this.$router.push(
          {
            path: '/shoppingCart'
          }
        );
      },
      toProductList: function () {
        this.$router.push(
          {
            path: '/productList'
          }
        );
      },
      toPayPage: function () {
        this.$router.push(
          {
            path: '/pay',
            query: {
              order: this.orderId
            }
          }
        );
      }
      },
    created () {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (user && user.distributorId != 0) {
        this.user = user;
      } else {
        this.$router.push({ path: '/login' });
      }
      if (!this.$route.query.order) {
        this.$router.push({ path: '/center/dashboard' });
        return;
      }
      this.orderId = this.$route.query.order;
      this.getOrderDetail();
    },
    filters: {
      paymentChannel: (channel) => {
        switch (channel) {
          case 'upacp_pc':
            return '银联';
          case 'wx_pub_qr':
            return '微信支付';
          default:
            return '支付宝';
        }
      }
    }
  };
</script>

