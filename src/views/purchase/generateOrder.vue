<template>
    <div class="generator">
        <!--收获地址设置-->
        <div class="address flex-row">
            <h4>收货人信息</h4>
            <template v-if="!addressList||addressList==''">
            <div class="info">
                对不起，您没有收货地址！
            </div>
            <el-button class="addBtn" type="text" @click="addressDialogVisible = true">新增地址</el-button>
            </template>
            <template v-else>
            <div class="info">
                <img src="../../imgs/shoppingCart/person.png" height="12" width="10" />
                <span>{{addressList[defaultAddress].receiveName}}</span>
            </div>
            <div class="info">
                <img src="../../imgs/shoppingCart/address.png" height="12" width="9"/>
                <span>{{addressList[defaultAddress].provinceDesc}}{{addressList[defaultAddress].cityDesc}}{{addressList[defaultAddress].areaDesc}} 
                    {{addressList[defaultAddress].detailAddress}}
                </span>
            </div>
            <div class="info">
                <img src="../../imgs/shoppingCart/phone.png" height="11" width="11" />
                <span>{{addressList[defaultAddress].phone}}</span>
            </div>
            <el-button type="text" @click="updateAddressVisible = true ">更改</el-button>
            <el-button type="text" @click="addressDialogVisible = true;">新增地址</el-button>
            </template>
        </div>

        <!-- 订单信息 -->
        <el-table :data="shoppingCart">
            <el-table-column label="货品信息" width="450">
                <template scope="scope">
                <div class="flex-row">
                  <img class="sku-img" v-bind:src="scope.row.skuImg" width="105" height="89">
                  <div class="flex-col hor-around">
                    <h5>{{scope.row.spuName}}</h5>
                    <h6 class="spu-size">{{scope.row.skuAttr|formatAttribute}}</h6>
                  </div>
                </div>
                </template>
            </el-table-column>
            <el-table-column label="数量" width="184" prop="quantity"></el-table-column>
            <el-table-column label="单价（元）" width="140">
                <template scope="scope">
                <div>
                    ¥{{scope.row.unitPrice|formatMoney}}
                </div>
                </template>
            </el-table-column>
            <el-table-column label="优惠" width="149">
                <template scope="scope">
                <div>¥0.00</div>
                </template>
            </el-table-column>
            <el-table-column label="金额（元）" width="136" style="color:#ffa800">
                <template scope="scope">
                <div>
                    ¥{{(scope.row.unitPrice*scope.row.quantity)|formatMoney}}
                </div>
                </template>
            </el-table-column>
            <el-table-column label="运费（元）" width="140">
                <template scope="scope">
                <div>
                    ¥{{0|formatMoney}}
                    <div>（包邮）</div>
                </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 备注一行 -->
        <div class="buyer-message flex-row ver-center">
            <div>备注：</div>
            <el-input type="textarea" :rows="2" v-model="buyerMessage"></el-input>
        </div>

        <!-- 订单金额统计一行 -->
        <div class="statistic">
          <div class="flex-row ver-center">
            <p>总计：</p>
            <p>货品种类：<span>{{shoppingCart&&shoppingCart!=''?shoppingCart.length:0}}</span>种</p>
            <p>数量总计：<span>{{realTotalCount}}</span>件</p>
            <p class="statistic-box flex-normal" >优惠金额：<span>0.00</span>元</p>
          </div>
          <div class="statistic-box">
            <p>运费共计：<span>{{shippingCost|formatMoney}}</span>元</p>
            <p>货品总金额：<span>{{realTotalAmount|formatMoney}}</span>元</p>
            <p>应付总额（含运费）：<span>{{realTrueAmount|formatMoney}}</span>元</p>
          </div>
        </div>

        <!-- 按钮操作 -->
        <div class="option flex-row">
            <el-button type="text" @click="backShoppingCart">返回进货单</el-button>
            <div class="flex-normal ver-center hor-end">
                <div class="money" >应付总额（包含运费）：<span>{{realTrueAmount|formatMoney}}</span>元</div>
                <el-button class="submit" type="primary"  :disabled="!shoppingCart||shoppingCart==''||!addressList||addressList==''" 
                    @click="generateOrder()">提交订单</el-button>
            </div>
        </div>
    </div>
  
</template>

<style>
    @import "../../css/purchase/order.css";
</style>

<script>
  import {
    getAddressList,
    saveAddress,
    getAgentBrand,
    generateOrder
    } from '../../api/api';
    import {
    GetProvinceList,
    GetCityListByProvince,
    GetAreaListByCity
  } from '../../js/common';

  export default {
    data () {
      return {
        user: {},
        shoppingCart: [],
        loading: false,
        // 地址列表
        addressList: [],

        // 默认地址，初始默认第一个
        defaultAddress: 0,
        // 备注
        buyerMessage: null,

        // 数量总计
        realTotalCount: 0,
        // 总金额
        realTotalAmount: 0,
        // 应付总额
        realTrueAmount: 0,

      };
    },

    methods: {

      getAddressList: function () {
        const param = {
          id: this.user.id
        };
        getAddressList(param).then((res) => {
          if (res.status == 200) {
            this.$set(this, 'addressList', res.data);
            this.addressList = res.data;
            this.defaultAddress = 0;
          }
        });
      },

      // 获取省列表
      getProvinceList: function () {
        GetProvinceList((provinceList) => this.$set(this, 'provinceList', provinceList));
      },

      // 获取市列表
      getCityListByProvince: function (value) {
        GetCityListByProvince(value, (cityList) => {
          this.$set(this, 'cityList', cityList);
          this.$set(this.updateAddress, 'city', this.cityList[0].regionCode);
        });
      },

      // 获取地区列表
      getAreaListByCity: function (value) {
        GetAreaListByCity(value, (areaList) => {
          this.$set(this, 'areaList', areaList);
          this.$set(this.updateAddress, 'area', this.areaList[0].regionCode);
          this.user.area = this.areaList[0].regionCode;
        });
      },

      // 提交地址
      submitAddress (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const param = {
              ...this.updateAddress,
              distributorId: this.user.id,
              provinceDesc: this.$refs.province.selectedLabel,
              cityDesc: this.$refs.city.selectedLabel,
              areaDesc: this.$refs.area.selectedLabel
            };
            saveAddress(param).then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 2000,
                  onClose: () => {
                    this.dialogVisible = false;
                    this.getAddressList();
                  }
                });
              }
            });
          }
        });
      },

      resetDialog (formName) {
        this.updateAddress = {
          id: null,
          receiverName: null,
          province: null,
          city: null,
          area: null,
          detailAddress: null,
          phone: null
        };
        this.$refs[formName].resetFields();
      },

      // 生成订单，进入支付
      generateOrder: function () {
        var shopCartItem = new Array();
        for (var i in this.shoppingCart) {
          this.$set(this.shoppingCart[i], 'price', this.shoppingCart[i].unitPrice);
          shopCartItem.push(this.shoppingCart[i]);
        }
        let param = {
          type: parseInt(this.tabActive),
          vendorId: this.user.vendorId,
          distributorId: this.user.distributorId,
          userId: this.user.userId,
          levelId: this.user.vipId,
          buyerMessage: this.buyerMessage,
          address: Object.assign({}, this.addressList[this.defaultAddress]),
          shopCartItems: shopCartItem,
        };
        generateOrder(param).then((res) => {
          if (res.status == 200) {
            this.orderCode = res.data;
            this.$router.push({
              path: '/toPay',
              query: {
                orderCode: this.orderCode
              }
            });
          }
        });
      },
      // 返回进货单
      backShoppingCart: function () {
        // 初始化步骤条、勾选商品信息
        this.$store.state.step = 0;
        this.$store.state.shoppingCart = null;
        this.$router.push({ path: '/shoppingCart' });
      },
    },

    created () {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (user && user.distributorId != 0) {
        this.user = user;
      } else {
        this.$router.push({ path: '/login' });
      }
      this.$set(this, 'shoppingCart', this.$store.handleCart);
      this.getAddressList();
      this.getProvince();
      this.$store.commit('updateStepType', 'purchase');
      this.$store.commit('updateStep', '1');
    },
    computed: {
      totalCount: function () {
        let totalCount = 0;
        this.shoppingCart.map(item => {
          totalCount += parseInt(item.quantity);
        });
        return totalCount;
      },

      totalAmount: function () {
        let totalAmount = 0.00;
        this.shoppingCart.map(item => {
          totalAmount += parseFloat(item.unitPrice) * parseFloat(item.quantity);
        });
        return totalAmount.toFixed(2);
      }
    }
  };
</script>


