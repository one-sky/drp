<template>
  <div class="order-list">
    <el-tabs class="center-tab" v-model="activeName" @tab-click="handleClick" >
      <el-tab-pane v-for="status in orderStatus" :key="status.key" :label="status.value" :name="status.key+''">
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
          <el-form-item label="商品名称：">
            <el-input v-model="searchGroup.spuName"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="订单状态：">
            <el-select v-model="searchGroup.orderStatus">
              <el-option v-for="status in orderStatus" :key="status.key" :label="status.value" :value="status.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付状态：" class="order_search_select" >
            <el-select v-model="searchGroup.payStatus">
              <el-option v-for="status in payStatus" :key="status.value" :label="status.label" :value="status.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="receiver" label="收货人／电话：">
            <el-input v-model="searchGroup.reveivePhone"></el-input>
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
              <el-col :span="14">
                <template v-for="n in (props.row.orderItem.length>3 ? 3:props.row.orderItem.length)">
                  <div class="flex-row">
                    <div class="flex-row" style="width:43%;">
                      <router-link :to="{path: '/productDetail', query: {product: props.row.orderItem[n-1].productId}}">
                        <img v-bind:src="props.row.orderItem[n-1].skuImg" width="51" height="51">
                      </router-link>
                      <div class="flex-col">
                        <router-link class="link a4_link" :to="{path: '/productDetail', query: {product: props.row.orderItem[n-1].productId}}">
                          {{props.row.productName}}
                        </router-link>
                        {{props.row.orderItem[n-1].skuAttributes|formatAttribute}}
                        <el-button :disabled="props.row.orderItem[n-1].status<11" @click="handleRefund(props.row.id,props.row.orderItem[n-1].orderId)" type="primary">申请售后</el-button>
                      </div>
                    </div>

                    <div class="hor-center" style="width:24%;">
                      ￥{{props.row.orderItem[n-1].skuPrice|formatMoney}}*{{props.row.orderItem[n-1].skuQuantity}}
                    </div>
                    <div class="flex-col hor-ver-center long-title" style="width:30%;">
                      <div>
                        {{props.row.receiveName}}
                      </div>
                      <div>
                        {{props.row.reveivePhone}}
                      </div>
                      <div class="text-center">
                        {{props.row.provinceDesc}}{{props.row.cityDesc}}{{props.row.areaDesc}} {{props.row.detailAddress}}
                      </div>
                    </div>

                  </div>
                </template>
                <template v-if="props.row.orderItem.length>3">
                  <template v-for="n in props.row.orderItem.length-3 ">
                    <div class="flex-row">
                      <div class="flex-row" style="width:42%;">
                        <router-link :to="{path: '/productDetail', query: {product: props.row.orderItem[n+2].productId}}">
                          <img v-bind:src="props.row.orderItem[n+2].skuImg" width="51" height="51">
                        </router-link>
                        <div class="flex-col">
                          <router-link class="link a4_link" :to="{path: '/productDetail', query: {product: props.row.orderItem[n+2].productId}}">
                            {{props.row.productName}}
                          </router-link>
                          {{props.row.orderItem[n+2].skuAttributes|formatAttribute}}
                          <el-button :disabled="props.row.orderItem[n-1].status<11" @click="handleRefund(props.row.id,props.row.orderItem[n+2].orderId)" type="primary">申请售后</el-button>
                        </div>

                      </div>
                      <div class="hor-center" style="width:22%;">
                        ￥{{props.row.orderItem[n+2].skuPrice|formatMoney}}*{{props.row.orderItem[n+2].skuQuantity}}
                      </div>
                      <div class="flex-col hor-ver-center long-title" style="width:30%;">
                        <div>
                          {{props.row.receiveName}}
                        </div>
                        <div>
                          {{props.row.reveivePhone}}
                        </div>
                        <div class="text-center">
                          {{props.row.provinceDesc}}{{props.row.cityDesc}}{{props.row.areaDesc}} {{props.row.detailAddress}}
                        </div>
                      </div>

                    </div>
                  </template>
                </template>
              </el-col>
              <el-col :span="10" :key="isShowAll" class="hor-ver-center">
                <el-col :span="7">
                  ￥{{props.row.shippingCost|formatMoney}}{{props.row.shippingCost==0?'（包邮）':''}}
                </el-col>
                <el-col :span="6">
                  ￥{{props.row.paidAmount|formatMoney}}
                  <p v-if="props.row.status>10" class="third-font-color">
                    （ 支付方式：{{props.row.payChannel}}）
                  </p>
                  <div v-else-if="props.row.status==9">
                    <el-button  @click="$router.push({path:'/toPay', query:{ orderCode: props.row.orderCode }}); ">去支付</el-button>
                  </div>
                </el-col>
                <el-col :span="10" class="flex-col hor-ver-center">
                  {{props.row.statusDesc}}
                  <router-link :to="{path: '/center/orderDetail', query:{ order: props.row.id }}">
                    订单详情
                  </router-link>
                  <el-button v-if="props.row.status==10"  @click="cancelOrder(props.row)">取消订单</el-button>
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
        <el-table-column label="单价*数量" width="130" align="center"></el-table-column>
        <el-table-column label="收货人信息" width="170" align="center"></el-table-column>
        <el-table-column label="运费" width="100" align="center"></el-table-column>
        <el-table-column label="订单金额" width="120" align="center"></el-table-column>
        <el-table-column label="订单状态" prop="orderTime" align="center"></el-table-column>
      </el-table>

    </div>
    <div class="pagination">
      <el-pagination layout="prev, pager, next" :page-size="pageSize" :total="totalCount"
                     :current-page="currentPage" @current-change="handleCurrentChange">
      </el-pagination>
    </div>

    <el-dialog title="确认处理方式" :visible.sync="refundDialogVisible" @close="resetDialog('refundForm')" >
      <el-form :model="refund" ref="refundForm" :rules="form_rules" class="refundList">
        <el-form-item style="margin-left:20px;margin-bottom:8px;" prop="type">
          <div class="ub"style="font-size:13px;">
            <div>
              <span style="color:#ffa800;">*</span>
            </div>
            <div style="width:57px;margin-left:5px;text-align-last:justify;">
              处理方式
            </div>
            <div style="margin-left:12px;">
              ：
            </div>
            <el-radio class="refund_input refund_radio" v-model="refund.type" label="1">退货</el-radio>
            <el-radio class="refund_input refund_radio" v-model="refund.type" label="2">换货</el-radio>
            <el-radio class="refund_input refund_radio" v-model="refund.type" label="3">仅退款</el-radio>
          </div>
        </el-form-item>
        <el-form-item style="margin-left:20px;margin-bottom:12px;" prop="reason">
          <div class="ub"style="font-size:13px;">
            <div>
              <span style="color:#ffa800;">*</span>
            </div>
            <div style="width:57px;margin-left:5px;text-align-last:justify;">
              退款原因
            </div>
            <div style="margin-left:12px;">
              ：
            </div>
            <el-form-item style="margin-right:6px;">
              <el-select class="refund_input refund_select" v-model="refund.reason" placeholder="请选择退款原因">
                <el-option
                  v-for="item in refundReason"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

          </div>
        </el-form-item>
        <el-form-item style="margin-left:31px;margin-bottom:12px;">
          <div class="ub"style="font-size:13px;">
            <div style="width:57px;text-align-last:justify;">
              退款数量
            </div>
            <div style="margin-left:12px;">
              ：
            </div>
            <div class="refund_number">
              <el-input-number :max="refund.avaNumber" v-model="refund.number" :disabled="refund.number<=0"></el-input-number>
            </div>

            <div>（最多可退 <span style="color:#ffa200;">{{refund.avaNumber}}</span> 件）</div>
          </div>
        </el-form-item>
        <el-form-item class="refund_input refund_textarea" style="margin-left:31px;">
          <div class="ub"style="font-size:13px;">
            <div style="width:57px;text-align-last:justify;">
              退款说明
            </div>
            <div style="margin-left:12px;">
              ：
            </div>
            <el-input class="refund_input refund_textarea" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="refund.text"></el-input>
          </div>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-bottom:10px;">
        <el-button type="primary" :disabled="refund.avaNumber<=0" @click="submitRefund('refundForm')">提交申请</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<style>
  @import "../../css/center/orderList.css";
</style>

<script>
  import { getOrderList, cancelOrder, getRefundReasons, saveRefund, getRefundNum} from '../../api/api';
  export default {
    data() {
      return {
        activeName: '100',
        collapseName: '',
        user:{
          userId: 147,
          vendorId: 2,
          distributorId: 64
        },
        searchGroup: {
          orderCode: '',
          startDate: '',
          endDate: '',
          spuName: '',
          orderStatus: 100,
          payStatus: '',
          reveivePhone: ''
        },
        searchForm: {
          orderCode: '',
          startDate: '',
          endDate: '',
          spuName: '',
          orderStatus: 100,
          payStatus: '',
          reveivePhone: ''
        },


        orderList: [],
        orderItem: [],

        //订单状态
        orderStatus: [
          {key:100, value:'全部订单'},
          {key:10, value:'待付款'},
          {key:20, value:'待发货'},
          {key:30, value:'待收货'},
          {key:40, value:'已完成'},
          {key:0, value:'已取消'},
        ],

        payStatus: [
          {value: '', label: '全部状态'},
          {value: 2, label: '已付款'},
          {value: 1, label: '部分付款'},
          {value: 0, label: '未付款'},
        ],

        //申请售后
        refund:{
          orderId:null,
          orderItemId:null,
          type:"1",
          reason:null,
          number:1,
          text:null,
          avaNumber: null
        },

        //退款原因
        refundReason:[],
        refundDialogVisible: false,
        form_rules: {
          reason: [
            {required: true,type:'number', message:'请选择申请原因', trigger: 'change,blur'}
          ]

        },

        n:0,
        currentPage:1,
        pageSize: 4,
        totalCount:0,
        isShowAll: false,
        more_button_message: '展开',
        loading:false,

      };
    },
    methods: {


      getOrderList() {
        let param = {};
        if(this.searchForm.orderStatus==100){
          param = Object.assign({}, this.searchForm, {distributorId: this.user.distributorId, vendorId: this.user.vendorId, pageNum: this.currentPage});
          param.orderStatus = '';
        }else{
          param = Object.assign({}, this.searchForm, {distributorId: this.user.distributorId, vendorId: this.user.vendorId, pageNum: this.currentPage});
        }
        console.log(param)
//        getOrderList(param).then((res) => {
//          this.loading = false;
//          if(res.status==200){
//            this.totalCount = res.page.totalNum;
//            this.orderList = res.data;
//            //展开此页的第一个订单明细
//            if(this.orderList.length>0){
//              this.collapseName  = this.orderList[0].id;
//              this.handleChangeCollapse(this.collapseName);
//            }
//          }

//          console.log(this.totalCount)
//
//
//        })
  this.orderList = [{
    orderCode: '1111',
    orderTime: '12232312313',
    orderItem: [{
      skuAttributes: '颜色分类：红；'
    },
    {
      skuAttributes: '颜色分类：白；'
    }],
    productName: 'aa',
    receiveName: 'cyw',
    reveivePhone: '17826856409',
    provinceDesc: '浙江省',
    cityDesc: '杭州市',
    areaDesc: '浙江理工大学生活一区'

  }]
      },

      cancelOrder(order) {

        this.loading= true;
        let param = {
          orderId: order.id,
          userId: this.user.userId,
          vendorId: this.user.vendorId,
          orderCode: order.orderCode

        };
        cancelOrder(param).then((res) => {

          if(res.status==200){
            this.getOrderList();
          }


        })
      },

      getOrderDetail(activeName) {
        this.orderItem = this.orderList.find((item) => {
          return item.id === activeName;
        }).oOrderItems;
        this.isShowAll = false;
        this.more_button_message = '更多';
      },


      //form_button_event
      handleSearch() {
        for ( var p in this.searchGroup ){
          this.searchForm[ p ]=  this.searchGroup[ p ];
        }
        this.searchForm.startDate = (!this.searchForm.startDate || this.searchForm.startDate == '') ? '' : date.formatDate.format(new Date(this.searchForm.startDate), 'yyyy-MM-dd');
        this.searchForm.endDate = (!this.searchForm.endDate || this.searchForm.endDate == '') ? '' : date.formatDate.format(new Date(this.searchForm.endDate), 'yyyy-MM-dd');
        this.activeName = this.searchGroup.orderStatus+'';
        this.currentPage = 1;
        this.getOrderList();
      },


      //list_button_event
      handleRefund(orderId, orderItemId){
        this.$set(this.refund, 'orderItemId', orderItemId);
        this.$set(this.refund, 'orderId', orderId);
        this.$set(this.refund, 'type', 1);
        this.$set(this.refund, 'number', 1);
        this.getRefundReasons();
        this.getRefundNum();

      },
      resetDialog(formName){
        this.refund ={
          orderId:null,
          type:null,
          reason:null,
          price:null,
          text:null
        };
        this.$refs[formName].resetFields();
      },

      handleShowAll(){
        this.isShowAll = !this.isShowAll;
        if(this.isShowAll){
          this.more_button_message = '收起';
        }else{
          this.more_button_message = '更多';

        }
      },


      //页码变更
      handleCurrentChange: function(val) {
        for ( var p in this.searchForm ){
          this.searchGroup[ p ]=  this.searchForm[ p ];
        }
        this.currentPage = val;
        this.getOrderList();

      },

      //tab_event
      handleClick(tab, event) {
        //reset

        this.searchGroup = {};
        this.searchForm = {};
        this.$set(this.searchGroup, 'orderStatus', parseInt(tab.name));
        this.$set(this.searchForm, 'orderStatus', parseInt(tab.name));
        this.currentPage = 1;
        this.getOrderList();
      },

      //collapse_event
      handleChangeCollapse(activeName){
        if(activeName != ''){
          this.getOrderDetail(activeName);
        }
      },

      //获取售后原因
      getRefundReasons(){
        let param = {};
        getRefundReasons(param).then((res) => {
          if(res.status==200){
            this.refundReason = res.data;
          }


        })
      },
      //获取可退款数量
      getRefundNum(){
        let param = {
          orderItemId: this.refund.orderItemId
        };
        console.log(param)
        getRefundNum(param).then((res) => {
          if(res.status==200){
            this.$set(this.refund, 'avaNumber', parseInt(res.data)||0);
            this.refundDialogVisible = true;
          }


        })
      },

      //申请售后提交
      submitRefund(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let param = {
              userId: this.user.userId,
              refundQuantity: this.refund.number,
              refundReason: this.refund.reason,
              reasonDescription: this.refund.text,
              orderId: this.refund.orderId,
              orderItemId: this.refund.orderItemId,
              type: parseInt(this.refund.type)

            }
            console.log(param)
            saveRefund(param).then((res) => {
              this.$message({
                message: '提交成功',
                type: 'success'
              });
              this.refundDialogVisible = false;
              this.$message({
                showClose: true,
                message: '您的退货申请已提交，请等待客服进行审核！',
                type: 'success'
              });
              this.getOrderList();
            });
          }
        });


      }

    },
    created()  {
      this.getOrderList();
    }
  };
</script>

