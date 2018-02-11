<template>
  <div class="pay">
    <div class="seperate-bar"></div>
    <div class="order success flex-col hor-ver-center">
        <template v-if="!flag">
            <div class="flex-row ver-center">
                <img class="success-icon" src="../../imgs/login/register_success.png" height="56" width="56"/>
                <h1>恭喜您，支付成功！</h1>
            </div>
            <div class="flex-row">
                <div>
                    <div>支付方式:</div>
                    <div>{{orderDetail.paymentChannel|paymentChannel}}</div>
                </div>
                <div class="ub"  style="margin-top:10px;color:#7e7e7e;font-size:14px;">
                    <div>订单编号:&nbsp;&nbsp;</div>
                    <div>{{orderDetail.orderCode}}</div>
                </div>
                <div  class="ub" style="margin-top:10px;color:#7e7e7e;font-size:14px;margin-bottom:24px;">
                    <div>支付金额:&nbsp;&nbsp;</div>
                    <div style="color:#ffdb15">{{orderDetail.totalAmount|formatMoney}}元</div>
                </div>
            </div>
            <div style="margin-top:10px;">
                <div style="margin-right:25px;"><el-button @click="toOrder(orderDetail.id)">订单详情</el-button></div>
                <div style="margin-right:25px;"><el-button @click="toShoppingCart()">返回购物车</el-button></div>
                <div style="margin-right:25px;"><el-button @click="toProductList()">继续购物</el-button></div>
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
    getOrderDetailByOrderCode
  } from '../../api/api';
  export default {

    data () {
      return {
        orderCode: null,
        user: {},
        orderDetail: {},
        orderResult: null,
        flag: false,
        loading: false,
      };
    },
    methods: {
      getOrderDetailByOrderCode: function () {
        const param = {
          orderCode: this.orderCode,
        };
        getOrderDetailByOrderCode(param).then((res) => {
          if (res.status == 200) {
            this.orderDetail = res.data;
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
              order: id
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
            path: '/toPay',
            query: {
              orderCode: this.orderCode
            }
          }
        );
      }
      },
    created () {
      this.orderCode = this.$route.query.orderCode;

      this.searchCharge();
    },
  };
</script>

