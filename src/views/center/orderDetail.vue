<template>
    <div class="order-detail" v-loading="loading" >
        <div class="statusBox">

            <div class="flex-row hor-ver-center">
                <div v-for="item in statusList">
                <div v-if="item.statusTime">
                    <div class="flex-row hor-ver-center statusDesc reachStatus">{{item.statusDesc}}</div>
                    <div class="flex-row hor-ver-center time">{{item.statusTime|formatDate}}</div>
                </div>
                <div v-else>
                    <div class="flex-row hor-ver-center statusDesc notReachStatus">{{item.statusDesc}}</div>
                </div>
                </div>
            </div>
        </div>

        <div v-model="orderItemList" class="buyerInfo">
            <div class="buyer_title">
                <div class="flex-row hor-ver-center">
                买家信息
                </div>
            </div>
            <div class="flex-row infoItem" >
                <div>买家名称：</div>
                <div class="infoItemDesc">{{orderItemList.receiveName}}</div>
            </div>
            <div class="flex-row infoItem" >
                <div>联系电话：</div>
                <div class="infoItemDesc">{{orderItemList.receivePhone}}</div>
            </div>
            <div class="flex-row infoItem" >
                <div>收货地址：</div>
                <div class="infoItemDesc">{{orderItemList.provinceDesc}}{{orderItemList.cityDesc}}{{orderItemList.areaDesc}} {{orderItemList.detailAddress}}</div>
            </div>
            <div class="buyer_message flex-row infoItem">
                <div>买家留言：</div>
                <div class="infoItemDesc">
                    <el-input type="textarea" v-model="orderItemList.buyerMessage" :disabled="true">
                    </el-input>
                </div>
            </div>
        </div>

        <div class="buyerInfo">
            <div class="buyer_title">
                <div class="flex-row hor-ver-center">
                    订单信息
                </div>
            </div>
            <div class="flex-row hor-end ver-center" style="margin-top: 20px;">
                <div>
                    订单编号：
                </div>
                <div>
                    {{orderItemList.orderCode}}
                </div>
                <div style="margin-left: 100px;">
                    付款时间：
                </div>
                <div style="min-width: 100px;">
                    {{orderItemList.paymentTime|formatDate}}
                </div>
            </div>
        </div>

        <div class="flex-row ver-center productInfo" v-loading="loading">
            <div style="width:418px;">
                商品信息
            </div>
            <div style="width:156px;">
                价格（元）
            </div>
            <div style="width:108px;">
                数量
            </div>
            <div style="width:156px;">
                小计（元）
            </div>
            <div style="width:164px;">
                订单状态
            </div>
        </div>
        <div id="refundItem" v-for="orderItem in orderItemList.orderItemVOList" >
            <div class="flex-row ver-center hor-end" style="height:20px;background-color:#eeeeee;">
                <div>
                    快递公司：{{orderItem.deliverName}}
                </div>

                <div style="margin-left:220px;">
                    快递单号：{{orderItem.trackingNumber}}
                </div>

                <div style="margin-left:160px;">
                    <el-popover width="462" trigger="hover" @show="getDeliveryInfo(orderItem.deliverName, orderItem.trackingNumbe)">
                        <el-table :data="deliveryInfo" stripe style="font-size:12px;" >
                            <el-table-column width="160" label-class-name="table_head" property="time" label="时间"></el-table-column>
                            <el-table-column width="300" label-class-name="table_head" property="context" label="物流信息"></el-table-column>
                        </el-table>
                        <el-button slot="reference" class="service" >
                            查看物流
                        </el-button>
                    </el-popover>
                </div>

            </div>
            <div class="flex-row">
                <div class="flex-row" style="width:419px;">
                    <div style="margin-top:15px;margin-left: 30px;width:60px;">
                        <img v-bind:src="orderItem.skuImg" />
                    </div>
                    <div class="flex-col" style="width:280px;">
                        <div>
                            {{orderItem.skuName}}
                        </div>
                        <div style="color:#e5e5e5">
                            颜色分类：{{orderItem.skuAttributes}}
                        </div>
                        <div>
                            <el-button @click="handleRefund(orderItemList.id, orderItem.id)" class="service" style="color:#ffa800; text-decoration-line: underline;">申请退款／退货</el-button>
                        </div>
                    </div>
                </div>
                <div class="flex-row ver-center" style="width:159px;">
                    ￥{{orderItem.skuPrice}}
                </div>
                <div class="flex-row ver-center" style="width:107px;">
                    {{orderItem.skuQuantity}}
                </div>
                <div class="flex-row ver-center" style="width:155px;">
                    ￥{{orderItem.skuPrice*orderItem.skuQuantity+orderItemList.shippingCost}}
                </div>
                <div class="flex-row ver-center" style="width:163px;">
                    {{orderItem.status}}
                </div>
            </div>
        </div>
        <div>
            <div class="ub" style="float:right;height:38px; padding-right:10px;padding-top:14px;font-size:13px;">
                订单共 <span class="orange_font">{{ orderItemList.orderItemQuantity }}</span>
                件商品，总计 ： <span class="orange_font">¥ {{ orderItemList.totalAmount|formatMoney(orderItemList.totalAmount)}}</span>（含运费
                <span class="orange_font">¥ {{ orderItemList.shippingCost|formatMoney(orderItemList.shippingCost) }}</span>）
                ，优惠金额：<span class="orange_font">¥ {{ orderItemList.coupon_amount|formatMoney(orderItemList.coupon_amount) }}</span>元
            </div>
        </div>
    </div>


  </div>
</template>
<style>
    @import "../../css/center/orderDetail.css";
</style>
    
<script>
  import {
    getOrderDetail
  } from '../../api/api';

export default {
    data () {
        return {
            user: {},
            statusDesc: ['确认订单', '买家付款', '卖家发货', '交易完成'],
            statusList: [],
            orderItemList: {},
            deliveryInfo: [],
            loading: false

        };
    },

    methods: {
        getOrderDetail: function () {
            this.loading = true;
            const orderIds = [];
            orderIds.push(this.$route.query.order);
            const param = {
                distributorId: this.user.id,
                orderIds
            };
            getOrderDetail(param).then((res) => {
                this.orderItemList = res.data;
                // status_Array
                const status = [
                    this.orderItemList.orderTime,
                    this.orderItemList.paymentTime,
                    this.orderItemList.deliveryTime,
                    this.orderItemList.finishTime
                ];
                status.map((item, index) => {
                    const i = {
                        statusDesc: this.statusDesc[index],
                        statusTime: item
                    };
                    this.statusList.push(i);
                });
                this.loading = false;
            });
        },

        getDeliveryInfo: function (deliveryCompany, deliveryID) {
            // 根据deliveryCompany, deliveryID查询
            this.deliveryInfo = [{
                time: '2015-05-17 01:20:07',
                context: '合肥市|发件|合肥市【合肥分拨中心】，正发往【天津分拨中心】'
            },
            {
                time: '2015-05-17 01:18:20',
                context: '合肥市|到件|到合肥市【合肥分拨中心】'
            },
            {
                time: '2015-05-16 19:45:27',
                context: '宿州市|发件|宿州市【宿州分拨仓】，正发往【合肥分拨中心】'
            },
            {
                time: '2015-05-16 16:38:48',
                context: '宿州市|到件|到宿州市【宿州分拨仓】'
            },
            {
                time: '2015-05-16 15:24:38',
                context: '宿州市|发件|宿州市【宿州市区八部】，正发往【宿州分拨仓】'
            },
            {
                time: '2015-05-16 15:17:59',
                context: '宿州市|收件|宿州市【宿州市区八部】，【宿州市区八部/0557-2229660】已揽收'
            }];
        },

        // list_button_event
        handleRefund: function (orderId, productID) {
        },

    },
    created () {
        this.$set(this, 'user', JSON.parse(sessionStorage.getItem('user')));
        this.getOrderDetail();
    },
  };
</script>

