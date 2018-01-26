<template>
  <div class="shopping-cart">
    <el-alert v-if="isShowAlert" title="警告" type="warning" description="您的购物车中有商品在未代理前添加，请删除后重新添加" show-icon>
    </el-alert>
  
    <el-tabs v-model="tabActive" @tab-click="handleClick">
      <el-tab-pane label="我的代销进货单" name="onePurchase"></el-tab-pane>
      <el-tab-pane label="我的批发进货单" name="morePurchase"></el-tab-pane>
    </el-tabs>
    <el-table class="table" ref="cartTable" :data="shoppingCart" @selection-change="handleSelectionChange">
      <el-table-column label="全选" type="selection" width="76"></el-table-column>
      <el-table-column label="货品" width="429">
        <template scope="scope">
          <div class="flex-row">
            <router-link class="sku-img" :to="{path: '/productDetail', query: {product: scope.row.spuId}}">
              <img v-bind:src="scope.row.skuImg" width="105" height="89" />
            </router-link>
            <div class="flex-col hor-around">
              <router-link :to="{path: '/productDetail', query: {product: scope.row.spuId}}">
                <h5>{{scope.row.spuName}}</h5>
              </router-link>
              <h6 class="spu-size">{{scope.row.skuAttr|formatAttribute}}</h6>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="quantity" label="数量" width="180">
        <template scope="scope" >
          <template v-if="scope.row.needReAdd">
            <el-tooltip class="item"  effect="dark" content="该商品在未代理该品牌前加入，请删除后重新加入购物车" placement="top-start">
              <el-input-number v-model="scope.row.quantity" :min="1" :disabled="true"></el-input-number>
            </el-tooltip>
          </template>
          <template v-else>
            <el-input-number v-model="scope.row.quantity" :min="1"></el-input-number>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="单价（元）" width="170">
        <template scope="scope">
          <!--批发-->
          <template v-if="tabActive=='morePurchase'">
            <div v-for="(item,index) in scope.row.truePricePiece" :key="index">
              <div :class="{'text-through': scope.row.quantity>=item.startPiece&&scope.row.quantity<=item.endPiece? false: true}">
                <template v-if="item.startPiece==item.endPiece">
                  {{item.startPiece}}件：{{item.price|formatMoney}}
                </template>
                <template v-else>
                  {{item.startPiece}}-{{item.endPiece}}件：{{item.price|formatMoney}}
                </template>

              </div>
            </div>
          </template>
          <!--一件代发-->
          <div v-else>
            ¥{{scope.row.unitPrice|formatMoney}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="优惠" width="90">
        <template scope="scope">
          <span class="price-icon-size">¥</span>0.00
        </template>
      </el-table-column>
      <el-table-column label="金额（元）" width="130" style="color:#ffa800">
        <template scope="scope">
          <span class="price-icon-size">¥</span>{{(scope.row.unitPrice*scope.row.quantity)|formatMoney}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="124">
        <template scope="scope">
          <el-button v-if="scope.row.status=='Y'" type="text" @click="collectionProductToShoppingCart(scope.row.spuId)">
            <img src="../../imgs/shoppingCart/collect.png" height="11" width="12"/>
            收藏
          </el-button>
          <div v-else>商品已下架</div>
          <el-button type="text" @click="batchDeleteCollection(scope.row.productId)">
            <img src="../../imgs/shoppingCart/delete.png" height="11" width="12"/>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="statistic-box flex-row">
      <el-checkbox v-model="checked" @change="toggleSelection">全选</el-checkbox>
      <el-button type="text" :disabled="shoppingCart.length<1" @click="batchDeleteCollection()">
        <img src="../../imgs/shoppingCart/delete.png" height="11" width="12"/>
        删除
      </el-button>
      <el-button type="text" :disabled="shoppingCart.length<1" @click="batchMoveCollection">
        <img src="../../imgs/shoppingCart/collect.png" height="11" width="12"/>
        移动到收藏夹
      </el-button>
      <div class="statistic-list">
        <div class="statistic-item">
          货品种类：<span>{{handleShoppingCart&&handleShoppingCart!=''?handleShoppingCart.length:0}} </span>种
        </div>
        <div class="statistic-item">
          数量总计：<span>{{totalCount}} </span>件
        </div>
        <div class="statistic-item">
          货品金额总计（不包含运费）：<span>{{totalAmount}} </span>元
        </div>
        <el-button class="calculate" :disabled="shoppingCart.length<1" @click="toOrder">结 算</el-button>

      </div>
      
    </div>
  </div>
</template>
<style>
  @import "../../css/purchase/shoppingCart.css";
</style>

<script>
  import {getShoppingCart, addToShoppingCart, batchDeleteCollection, collectionProductToShoppingCart, batchMoveCollection,
    getAddressList, getProvinceList, getCityListByProvince, getAreaListByCity, saveAddress, getAgentBrand, getProductPackingInfo, calculateShippingCost, generateOrder} from '../../api/api';
  export default {
    data() {
      var validatePhone = (rule, value, callback) => {
        if(!value||value.length<=0){
          return callback(new Error('请输入手机号码'));
        }else{
          if (!(/^1\d{10}$/.test(value))) {
            return callback(new Error('请输入正确的手机号码'));
          }else{
            callback();
          }
        }

      };
      return {
        // morePurchase-批发，onePurchase-一件代发
        tabActive: 'onePurchase',  
        user:{
          userId:null,
          distributorId:null,
          vendorId:null,
          vipId:null,
        },
        checked: false,

        shoppingCart:[],

        handleShoppingCart:[],
        agentBrandList:[], //已代理品牌列表
        loading:false,
        handleRow:{}, //记录计数器操作的当前行
        isShowAlert:false,

        //上架商品数量
        productCount: 0,


        shippingCost: null,//订单运费

      }
    },

    methods: {
      //获取已代理品牌
      getAgentBrand(){
        let param = {
          distributorId: this.user.distributorId,
          vendorId: this.user.vendorId
        };
        getAgentBrand(param).then((res) => {
          if(res.status ==200) {
            this.agentBrandList = res.data;
          }
        })

      },
      getShoppingCart(){
        this.loading = true;
        this.checked = false;
        let param = {
          distributorId: this.user.distributorId,
          vendorId: this.user.vendorId,
          type: this.tabActive ==='onePurchase'?2:1
        };
        getShoppingCart(param).then((res) => {
          if(res.status ==200) {
            this.shoppingCart=res.data;
            for(var i in this.shoppingCart){
              //设置批发量
              this.$set(this.shoppingCart[i], 'pricePiece', new Array());
              //商品未下架加入时未代理，现在已代理品牌
              if(this.shoppingCart[i].status=='Y'&&this.shoppingCart[i].type==2){
                for(var k in this.agentBrandList){
                  if(this.shoppingCart[i].brandId==this.agentBrandList[k].erpBrandId){
                    this.$set(this.shoppingCart[i], 'needReAdd', true);
                    this.$set(this.shoppingCart[i], 'scope="scope"', true);
                    this.isShowAlert =true;

                    break;
                  }
                }

              }else{
                this.$set(this.shoppingCart[i], 'needReAdd', false);
                this.$set(this.shoppingCart[i], 'isChecked', false);
              }
              //促销Id
              this.$set(this.shoppingCart[i], 'promotionId', -1);

              //price
              for(var j in this.shoppingCart[i].productPriceList){
                if(this.shoppingCart[i].productPriceList[j].levelId==this.user.vipId){
                  //一件代发
                  if(this.tabActive==2){
                    if(this.shoppingCart[i].productPriceList[j].startPiece==1&&this.shoppingCart[i].productPriceList[j].endPiece==1){
                      if(this.shoppingCart[i].productPriceList[j].promotionId>this.shoppingCart[i].promotionId){
                        console.log(j);
                        this.$set(this.shoppingCart[i],'unitPrice',this.shoppingCart[i].productPriceList[j].price);
                        this.$set(this.shoppingCart[i],'promotionId',this.shoppingCart[i].productPriceList[j].promotionId);
                      }
                    }
                  } else{  //批发

                    this.shoppingCart[i].pricePiece.push(this.shoppingCart[i].productPriceList[j]);
                    if(this.shoppingCart[i].quantity>=this.shoppingCart[i].productPriceList[j].startPiece &&
                      this.shoppingCart[i].quantity<=this.shoppingCart[i].productPriceList[j].endPiece && this.shoppingCart[i].productPriceList[j].promotionId>this.shoppingCart[i].promotionId) {
                      this.$set(this.shoppingCart[i],'unitPrice',this.shoppingCart[i].productPriceList[j].price);
                      this.$set(this.shoppingCart[i],'promotionId',this.shoppingCart[i].productPriceList[j].promotionId);
                    }


                  }
                }
              }
            }
            if(this.tabActive==1){
              for(var i in this.shoppingCart) {
                this.$set(this.shoppingCart[i],'truePricePiece', new Array());
                //单价从小到大排序,过滤促销时的非促销价
                if(this.shoppingCart[i].pricePiece && this.shoppingCart[i].pricePiece.length>1){

                  this.shoppingCart[i].pricePiece.sort(function(a,b){
                    if(a.startPiece == b.startPiece){
                      return a.endPiece > b.endPiece
                    }else{
                      return a.startPiece > b.startPiece
                    }
                  });
                  this.shoppingCart[i].truePricePiece.push(this.shoppingCart[i].pricePiece[0]);
                  for(var j = 1; j< this.shoppingCart[i].pricePiece.length; j++){
                    var price = this.shoppingCart[i].truePricePiece.pop();
                    if(this.shoppingCart[i].pricePiece[j].startPiece==price.startPiece){ //2-10(促销) 2-20 10-20(促销) 则2-20不放入
                      if(this.shoppingCart[i].pricePiece[j].promotionId>price.promotionId){
                        this.shoppingCart[i].truePricePiece.push(this.shoppingCart[i].pricePiece[j]);
                      }else{
                        this.shoppingCart[i].truePricePiece.push(price);
                      }
                    }else if(this.shoppingCart[i].pricePiece[j].endPiece==price.endPiece){ //2-10 2-999(促销) 10-999 则10-999不放入
                      if(this.shoppingCart[i].pricePiece[j].promotionId>price.promotionId){
                        this.shoppingCart[i].truePricePiece.push(this.shoppingCart[i].pricePiece[j]);
                      }else{
                        this.shoppingCart[i].truePricePiece.push(price);
                      }
                    }else{
                      this.shoppingCart[i].truePricePiece.push(price);
                      this.shoppingCart[i].truePricePiece.push(this.shoppingCart[i].pricePiece[j]);

                    }
                  }
                }
              }
            }
            var shoppingCart = new Array();
            var notShoppingCart = new Array();
            for(var i in this.shoppingCart){
              if(this.shoppingCart[i].status=='Y'){
                shoppingCart.push(this.shoppingCart[i]);
              }else{
                notShoppingCart.push(this.shoppingCart[i]);
              }
            }
            this.shoppingCart = new Array();
            if(shoppingCart&&shoppingCart!=''){
              for(let i in shoppingCart){
                this.shoppingCart.push(shoppingCart[i]);
              }

            }
            this.productCount = this.shoppingCart.length||0;
            if(notShoppingCart&&notShoppingCart!='') {
              for(let i in notShoppingCart){
                this.shoppingCart.push(notShoppingCart[i]);
              }

            }
            this.loading = false;
          }
        })

      },

      //设置已下架背景色
      tableRowClassName(row) {
        if (row.status == 'Y') {
          return 'can-row';
        } else {
          return 'cannot-row';
        }

      },


      //tab_event
      handleClick(tab, event) {
        this.checked = false;
        this.getShoppingCart();
      },


      //全选按钮
      toggleSelection() {
        if (this.checked) {
          for(var i=0; i< this.productCount;i++){
            this.shoppingCart[i].isChecked = true;
          }
        } else {
          for(var i=0; i< this.productCount;i++){
            this.shoppingCart[i].isChecked = false;
          }
        }
      },
      handleSelectionChange(row) {
        this.handleShoppingCart = row;
        
      },

      //加入购物车
      addToShoppingCart(row,value){
        if(!this.user.userId||this.user.userId==''){
          this.$router.push({path:'/login'});
          return;
        }
        let param = {
          distributorId: this.user.distributorId,
          userId: this.user.userId,
          skuId: row.productId,
          quantity: value,
          isAgent:row.type==1?true:false
        };
        console.log(param)
        addToShoppingCart(param).then((res) => {
          if(res.status==200){
            if(res.data>0){
              this.getShoppingCart()
            }else{
              this.$message({
                message: '加入进货单失败',
                type: 'warning'
              });
            }

          }
        })
      },


      //批量删除
      batchDeleteCollection:function(value){
        var skuIdList = new Array();
        console.log('value'+value);
        if(value&&value!=''){
          skuIdList.push(value);
        }else{
          if(this.handleShoppingCart.length>0) {
            var skuIdList = [];
            for (var i in this.handleShoppingCart) {
              skuIdList.push(this.handleShoppingCart[i].productId);
            }
          }else {
            return;
          }
        }


        let param = {
          skuIdList:skuIdList,
          distributorId:this.user.distributorId,
          type:parseInt(this.tabActive),
        }
        console.log(param);
        batchDeleteCollection(param).then((res)=>{
          if(res.status == 200){
            this.getShoppingCart();
          }
        })

      },

      //添加收藏
      collectionProductToShoppingCart:function(spuId){

        let param = {
          distributorId:this.user.distributorId,
          spuId:spuId,
          levelId:this.user.vipId,
          vendorId: this.user.vendorId
        }

        collectionProductToShoppingCart(param).then((res)=>{
          if(res.status == 200){
            this.$message({
              message: '收藏成功',
              type: 'success'
            });
          }
        })
      },

      //批量移动到收藏夹
      batchMoveCollection(){
        var spuIdList = new Array();
        var skuIdList = new Array();
        if(this.handleShoppingCart&&this.handleShoppingCart.length>0){
          for(var i in this.handleShoppingCart){
            spuIdList.push(this.handleShoppingCart[i].spuId);
            skuIdList.push(this.handleShoppingCart[i].productId);
          }

          // spuIdList = this.unique(spuIdList);

          let param = {
            vendorId: this.user.vendorId,
            distributorId: this.user.distributorId,
            spuIdList: spuIdList,
            skuIdList: skuIdList,
            type: parseInt(this.tabActive),
            levelId: this.user.vipId

          };

          batchMoveCollection(param).then((res) => {
            if(res.status == 200){
              this.getShoppingCart();
            }
          })


        }
      },


      toOrder(){
        if(!this.handleShoppingCart||this.handleShoppingCart==''){
          this.$message({
            message: '请选择待结算商品',
            type: 'warning'
          });
          return;
        }else{
          this.$router.push({path: '/generateOrder', query: {shoppingCart: this.handleShoppingCart}});
        }
      },

      //获取商品包裹信息
      getProductPackingInfo(){
        if(this.addressList&&this.addressList!=''){
          var skuCodeList = new Array();
          var packingList = new Array();
          for(var i in this.handleShoppingCart){
            skuCodeList.push(this.handleShoppingCart[i].skuCode);
          }
          let param = {
            skuCodeList:skuCodeList,
            vendorId: this.user.vendorId
          };
          getProductPackingInfo(param).then((res) => {
            if (res.status == 200) {
              packingList = res.data;
              for(var i in this.handleShoppingCart){
                for(var j in packingList){
                  if(this.handleShoppingCart[i].skuCode==packingList[j].skuCode){
                    this.$set(this.handleShoppingCart[i],'templeateId',packingList[j].templeateId);
                    this.$set(this.handleShoppingCart[i],'packLength',packingList[j].packLength);
                    this.$set(this.handleShoppingCart[i],'packWidth',packingList[j].packWidth);
                    this.$set(this.handleShoppingCart[i],'packHeight',packingList[j].packHeight);
                    this.$set(this.handleShoppingCart[i],'packGrossWeight',packingList[j].packGrossWeight);
                    break;
                  }
                }
              }
              console.log(this.handleShoppingCart);
              this.calculateShippingCost();
            }
          })
        }else{
          return;
        }


      },
    },

    created() {
      this.user.userId = 1;
      this.user.distributorId = 1;
      this.user.vendorId = 1;
      this.user.vipId = 1;
      this.getAgentBrand();
      this.getShoppingCart();
      this.$store.commit('updateStepType', 'purchase')
      this.$store.commit('updateStep', 0)

    },
    watch: {
      'add_addressForm.province': function(val,oldVal) {
        if(val){
          this.handleChangeProvince(val);

        }
      },
      'add_addressForm.city': function(val,oldVal) {
        if(val!=oldVal){
          this.handleChangeCity(val);
        }

      }

    },
    computed:{
      // step==1
      totalCount: function(){
        var a = 0;
        for(var i in this.handleShoppingCart){
          a += parseInt(this.handleShoppingCart[i].quantity);
        }
        return a;
      },

      totalAmount: function(){
        var a = 0.00;
        for(var i in this.handleShoppingCart){
          a += parseFloat(this.handleShoppingCart[i].unitPrice)*parseFloat(this.handleShoppingCart[i].quantity);
        }
        return a.toFixed(2);
      },

      // step==2
      realTotalCount: function(){
        var a = 0;
        for(var i in this.handleShoppingCart){
          a += parseInt(this.handleShoppingCart[i].quantity);
        }
        return a;
      },

      realTotalAmount: function(){
        var a = 0.00;
        for(var i in this.handleShoppingCart){
          a += parseFloat(this.handleShoppingCart[i].unitPrice)*parseFloat(this.handleShoppingCart[i].quantity);
        }
        return a;
      },

      realTrueAmount: function(){
        var a = 0.00;
        for(var i in this.handleShoppingCart){
          a += parseFloat(this.handleShoppingCart[i].unitPrice)*parseFloat(this.handleShoppingCart[i].quantity);
        }
        a = a+this.shippingCost;
        console.log(a)
        return a;
      },
    }

  };
</script>


