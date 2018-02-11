<template>
  <div class="pay">
    <div class="seperate-bar"></div>
    <div class="order flex-col hor-ver-center">
      <h1>宝贝马上到手，快选择支付方式吧！</h1>
      <div class="attention">请尽快支付，否则订单会被取消哦!</div>
      <div class="statistic">应付金额：<span>{{(orderDetail.totalAmount+orderDetail.shippingCost)|formatMoney}}</span></div>
      <div class="statistic">
        （商品金额：<span class="icon">¥</span><span>{{orderDetail.totalAmount|formatMoney}}</span>
        运费：<span class="icon">¥</span><span>{{orderDetail.shippingCost|formatMoney}}</span>
        优惠金额：<span class="icon">¥</span><span>0.00</span>)
      </div>
      <div class="trade">
        <div>【交易编号】:{{orderDetail.orderCode}}</div>
        <div>{{orderDetail.orderTime|formatDate}}</div>
      </div>
      <div class="receiver">收货人信息 :{{orderDetail.receiveName}} {{orderDetail.reveivePhone}}
        <span class="address">地址： </span>{{orderDetail.provinceDesc}}{{orderDetail.cityDesc}}{{orderDetail.areaDesc}} {{orderDetail.detailAddress}}
      </div>
    </div>
    <h2 class="pay-title">支付方式</h2>
    <div class="channel">
      <h4>推荐支付方式</h4>
      <div class="flex-row-col" >
        <el-button v-for="(item, index) in payChannel" :key="index" @click="changeSelected(index)" :style="{'border-color':item.selected?'#ffd200': '#c4c4c4'}">
          <div v-show="item.selected" style="height:61px;width:149px;">
            <img  src="../../imgs/shoppingCart/pay_selected.png" height="61" width="149"/>
          </div>
          <img :style="{position:'relative',left:'0px',top:item.selected?'-53px':'0px'}" v-bind:src="item.img" height="41" width="110"/>
        </el-button>
      </div>
      <div v-if="stepActive">
        <div class="ub ub-ac" style="margin-top:10px;"><canvas id="canvas"></canvas></div>
        <div class="ub ub-ac">
          <el-button type="text" @click="toPaySuccess()">付款后,点击可查看付款成功页面</el-button>
        </div>
      </div>

    </div>
    <div class="hor-center">
      <el-button class="pay-btn" type="primary" @click="toPay()">去付款</el-button>
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
        payChannel: [
          {
            id: 1,
            img: require('@/imgs/shoppingCart/alipay.png'),
            name: 'alipay_pc_direct',
            selected: false
          },
          {
            id: 2,
            img:
            require('@/imgs/shoppingCart/wxpay.png'),
            name: 'wx_pub_qr',
            selected: false
          },
          {
            id: 3,
            img: require('@/imgs/shoppingCart/onlinepay.png'),
            name: 'upacp_pc',
            selected: false
          }
        ],
        channel: 'alipay_pc_direct',
        orderDetail: {},
        stepActive: false, // 用来控制是否显示点击跳转成功页面的按钮
        flagChannel: true, // 用来控制已选择付款方式之后的订单
        flagStatus: true, // 用来控制订单已付款之后再次点击进入支付页面
      };
    },
    methods: {
      getOrderDetailByOrderCode: function () {
        const param = {
          orderCode: this.orderCode,
        };
        getOrderDetailByOrderCode(param).then((res) => {
          if (res.status == 200 && res.data.status < 20 && res.data.status != 0) { // 显示的订单状态为未支付
            this.orderDetail = res.data;
            if (this.orderDetail.trancationId != null && this.orderDetail.trancationId != '') {
              this.flagChannel = false;
              for (var i in this.payChannel) {
                if (this.payChannel[i].name == this.orderDetail.paymentChannel) {
                  this.changeSelected(i);
                }
              }
            }
          } else {
            if (res.order.status && res.order.status != '00') {
              alert('订单已取消');
            } else {
              this.flagStatus = false;
            }
          }
        });
      },

      changeSelected: function (val) {
        for (var i in this.payChannel) {
          if (i != val) {
            this.payChannel[i].selected = false;
          } else {
            this.payChannel[i].selected = true;
            this.channel = this.payChannel[i].name;
          }
        }
      },

      toPay: function () {
      },
      toPaySuccess: function () {
        this.$router.push(
          {
            path: '/paySuccess',
            query: {
              orderCode: this.orderCode
            }
          }
        );
      }

    },
    created () {
      // if(!this.$route.query.orderCode||this.$route.query.orderCode==''){
      //   this.$router.push({ path: '/center/dashboard' });
      //   return;
      // }
      // this.orderCode = this.$route.query.orderCode;

      this.getOrderDetailByOrderCode();
    }
  };
</script>

