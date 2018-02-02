<template>
    <div class="generator">
        <!--收获地址设置-->
        <div class="address flex-row">
            <h4>收货人信息</h4>
            <template v-if="!addressList||addressList==''">
            <div class="info">
                对不起，您没有收货地址！
            </div>
            <el-button class="addBtn" type="text" @click="addressDialogVisible = true;getProvince()">新增地址</el-button>
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
            <el-button type="text" @click="addressDialogVisible = true;getProvince()">使用临时地址</el-button>
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
                    ¥{{(shippingCost)|formatMoney}}
                    <div>{{parseInt(shippingCost)==0?'（包邮）':''}}</div>
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
    getProvinceList,
    getCityListByProvince,
    getAreaListByCity,
    saveAddress,
    getAgentBrand,
    getProductPackingInfo,
    calculateShippingCost,
    generateOrder
    } from '../../api/api';
  export default {
    data () {
      return {
        user: {
          userId: null,
          distributorId: null,
          vendorId: 1,
          vipId: null,
        },
        shoppingCart: [],
        loading: false,
        // 地址列表
        addressList: [],

        // 默认地址，初始默认第一个
        defaultAddress: 0,
        // 选择地址时所选的id
        tmpDefaultAddress: 0,
        // 备注
        buyerMessage: null,

        // 数量总计
        realTotalCount: 0,
        // 总金额
        realTotalAmount: 0,
        // 应付总额
        realTrueAmount: 0,

        // 订单运费
        shippingCost: null
      };
    },

    methods: {

      getAddressList: () => {
        let param = {
          distributorId: this.user.distributorId
        };
        getAddressList(param).then((res) => {
          if (res.status == 200) {
            if (res.data) {
              this.addressList = res.data;
              this.defaultAddress = 0;
              this.tmpDefaultAddress = 0;
              // this.getProductPackingInfo();
            }
          }
        });
      },
      // 获取省列表
      getProvince: () => {
        let param = {};
        getProvinceList(param).then((res) => {
          this.provinceList = res.data;
        });
      },

      // 获取市列表
      handleChangeProvince: (value) => {
        if (value && value != '') {
          this.city_disabled = false;
          let param = {
            parentCode: value
          };
          getCityListByProvince(param).then((res) => {
            this.cityList = res.data;
            if (this.cityList) {
              this.$set(this.add_addressForm.city, this.cityList[0].regionCode);
            }
          });
        } else {
          this.$set(this.add_addressForm.city, null);
        }
      },

      // 获取地区列表
      handleChangeCity: (value) => {
        if (value != '' && value) {
          this.area_disabled = false;
          let param = {
            parentCode: value
          };
          getAreaListByCity(param).then((res) => {
            this.areaList = res.data;
            if (this.areaList) {
              this.$set(this.add_addressForm.area, this.areaList[0].regionCode);
            }
          });
        } else {
          this.$set(this.add_addressForm.area, null);
        }
      },

      // 提交地址
      submitAddress: (formName) => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$set(this.add_addressForm, 'distributorId', this.user.distributorId);
            let param = this.add_addressForm;
            saveAddress(param).then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.addressDialogVisible = false;
                if (!this.addressList || this.addressList == '') {
                  this.defaultAddress = 0;
                } else {
                  this.defaultAddress = 1;
                }
                this.getAddressList();
              }
            });
          } else {
            return false;
          }
        });
      },
      resetDialog: (formName) => {
        this.add_addressForm = {
          receiveName: null,
          province: null,
          city: null,
          area: null,
          detailAddress: null,
          phone: null
        };
        this.$refs[formName].resetFields();
      },

      // 生成订单，进入支付
      generateOrder: () => {
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
      backShoppingCart: () => {
        // 初始化步骤条、勾选商品信息
        this.$store.state.step = 0;
        this.$store.state.shoppingCart = null;
        this.$router.push({ path: '/shoppingCart' });
      },

      // 获取商品包裹信息
      getProductPackingInfo: () => {
        // if(this.addressList && this.addressList!=''){
        //   var skuCodeList = new Array();
        //   var packingList = new Array();
        //   for(var i in this.handleShoppingCart){
        //     skuCodeList.push(this.handleShoppingCart[i].skuCode);
        //   }
        //   let param = {
        //     skuCodeList:skuCodeList,
        //     vendorId: this.user.vendorId
        //   };
        //   getProductPackingInfo(param).then((res) => {
        //     if (res.status == 200) {
        //       packingList = res.data;
        //       for(var i in this.handleShoppingCart){
        //         for(var j in packingList){
        //           if(this.handleShoppingCart[i].skuCode==packingList[j].skuCode){
        //             this.$set(this.handleShoppingCart[i],'templeateId',packingList[j].templeateId);
        //             this.$set(this.handleShoppingCart[i],'packLength',packingList[j].packLength);
        //             this.$set(this.handleShoppingCart[i],'packWidth',packingList[j].packWidth);
        //             this.$set(this.handleShoppingCart[i],'packHeight',packingList[j].packHeight);
        //             this.$set(this.handleShoppingCart[i],'packGrossWeight',packingList[j].packGrossWeight);
        //             break;
        //           }
        //         }
        //       }
        //       console.log(this.handleShoppingCart);
        //       this.calculateShippingCost();
        //     }
        //   })
        // }else{
        //   return;
        // }
      },


      // 收获地址确认后计算运费
      calculateShippingCost: () => {
        var packingList = new Array();
        for (var i in this.shoppingCart) {
          packingList.push({
            templateId: this.shoppingCart[i].templeateId,
            packLength: this.shoppingCart[i].packLength,
            packWidth: this.shoppingCart[i].packWidth,
            packHeight: this.shoppingCart[i].packHeight,
            packGrossWeight: this.shoppingCart[i].packGrossWeight,
            totalNumber: this.shoppingCart[i].quantity
          });
        }
        let param = {
          provinceCode: this.addressList[this.defaultAddress].province,
          cityCode: this.addressList[this.defaultAddress].city,
          packingList: packingList
        };
        calculateShippingCost(param).then((res) => {
          if (res.status == 200) {
            this.shippingCost = res.data[0].shippingCost;
          }
        });
      },
    },

    created () {
      this.user.userId = 1;
      this.user.distributorId = 1;
      this.user.vendorId = 1;
      this.user.vipId = 1;
      this.shoppingCart = this.$route.query.shoppingCart;
      this.getAddressList();
      this.getProvince();
      this.$store.commit('updateStepType', 'purchase');
      this.$store.commit('updateStep', '1');
    },
    watch: {
      'add_addressForm.province': (val, oldVal) => {
        if (val) {
          this.handleChangeProvince(val);
        }
      },
      'add_addressForm.city': (val, oldVal) => {
        if (val != oldVal) {
          this.handleChangeCity(val);
        }
      }

    },
    computed: {
      // step==1
      totalCount: () => {
        var a = 0;
        for (var i in this.shoppingCart) {
          a += parseInt(this.shoppingCart[i].quantity);
        }
        return a;
      },

      totalAmount: () => {
        var a = 0.00;
        for (var i in this.shoppingCart) {
          a += parseFloat(this.shoppingCart[i].unitPrice) * parseFloat(this.shoppingCart[i].quantity);
        }
        return a.toFixed(2);
      }
    }
  };
</script>


