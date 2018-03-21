<template>
  <div class="shopping-cart">
    <el-alert v-if="isShowAlert" title="警告" type="warning" description="您的购物车中有商品在未代理前添加，请删除后重新添加" show-icon>
    </el-alert>
  
    <el-tabs v-model="tabActive" @tab-click="handleClick">
      <el-tab-pane label="我的代销进货单" name="2"></el-tab-pane>
      <el-tab-pane label="我的批发进货单" name="1"></el-tab-pane>
    </el-tabs>
    <el-table class="table" ref="cartTable" :data="shoppingCartList" @selection-change="handleSelectionChange">
      <el-table-column label="全选" type="selection" width="76" :selectable="selectable"></el-table-column>
      <el-table-column label="货品" width="429">
        <template scope="scope">
          <div class="flex-row">
            <router-link class="sku-img" :to="{path: '/productDetail', query: {product: scope.row.spuId}}">
              <img v-bind:src="scope.row.skuImg.split('；')[0]" width="105" height="89" />
            </router-link>
            <div class="flex-col hor-around">
              <router-link :to="{path: '/productDetail', query: {product: scope.row.spuId}}">
                <h5>{{scope.row.spuName}}</h5>
              </router-link>
              <h6 class="spu-size">{{scope.row.skuAttr}}</h6>
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
            <el-input-number v-model="scope.row.changeQuantity" :min="1"  @change="updateShoppingCartList(scope.row)"></el-input-number>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="单价（元）" width="170">
        <template scope="scope">
          <!--批发-->
          <template v-if="tabActive=='1'">
            <div v-for="(item,index) in scope.row.priceList" :key="index">
              <div :class="{'text-through': scope.row.quantity>=item.startPiece&&scope.row.quantity<=item.endPiece? false: true}">
                <template v-if="item.startPiece==item.endPiece">
                  {{item.startPiece}}件：{{item.price|formatMoney}}
                  <div v-if="item.stock">{{`(限购${item.stock}件)`}}</div>
                </template>
                <template v-else>
                  {{item.startPiece}}-{{item.endPiece}}件：{{item.price|formatMoney}}
                  <div v-if="item.stock">{{`(限购${item.stock}件)`}}</div>
                </template>

              </div>
            </div>
          </template>
          <!--一件代发-->
          <div v-else>
            ¥{{scope.row.onePrice|formatMoney}}
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
          <div>
            <span class="price-icon-size">¥</span>{{scope.row.amount|formatMoney}}
          </div>
          <div>
            <span class="price-icon-size">{{scope.row.onePrice}} * {{scope.row.quantity}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="124">
        <template scope="scope">
          <template v-if="scope.row.status=='Y'">
            <el-button v-if="scope.row.collected" type="text" @click="addCollectionProduct(scope.row.spuId)">
              <img src="../../imgs/shoppingCart/collect.png" height="11" width="12"/>
              收藏
            </el-button>
            <img v-else src="../../imgs/product/collect.png" height="11" width="12"/>已收藏
          </template>
          
          <div v-else>商品已下架</div>
          <el-button type="text" @click="updateShoppingCartList(row)">
            <img src="../../imgs/shoppingCart/delete.png" height="11" width="12"/>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="statistic-box flex-row">
      <el-checkbox v-model="checked" @change="toggleSelection">全选</el-checkbox>
      <el-button type="text" :disabled="onlineCount<1" @click="updateShoppingCartList()">
        <img src="../../imgs/shoppingCart/delete.png" height="11" width="12"/>
        删除
      </el-button>
      <el-button type="text" :disabled="onlineCount<1" @click="addCollectionProduct()">
        <img src="../../imgs/shoppingCart/collect.png" height="11" width="12"/>
        移动到收藏夹
      </el-button>
      <div class="statistic-list">
        <div class="statistic-item">
          货品种类：<span>{{handleShoppingCart && handleShoppingCart.length || 0}} </span>种
        </div>
        <div class="statistic-item">
          数量总计：<span>{{totalCount}} </span>件
        </div>
        <div class="statistic-item">
          货品金额总计（不包含运费）：<span>{{totalAmount}} </span>元
        </div>
        <el-button class="calculate" :disabled="onlineCount<1" @click="toOrder">结 算</el-button>

      </div>
      
    </div>
  </div>
</template>
<style>
  @import "../../css/purchase/shoppingCart.css";
</style>

<script>
  import {
    getShoppingCartList,
    updateShoppingCartList,
    addCollectionProduct,
    cancelCollectionProduct,
    getBrandListByAgentBrand,
  } from '../../api/api';

  import {
    GetCollectionProductList
  } from '../../js/distributor';
  export default {
    data () {
      return {
        // 1-批发，2-一件代发
        tabActive: '2',
        user: {},
        checked: false,

        shoppingCartList: [],
        handleShoppingCart: [],
        agentBrandList: [], // 已代理品牌列表
        loading: false,
        isShowAlert: false,

        shippingCost: null, // 订单运费
        onlineCount: 0, // 上架商品个数
      };
    },

    methods: {
      selectable: function (row, index) {
        return row.status == 'Y';
      },
      // 获取已代理品牌
      getBrandListByAgentBrand: function () {
        const param = {
          distributorId: this.user.id,
          status: 'Y',
          pageNum: 1,
          pageSize: 10000
        };
        getBrandListByAgentBrand(param).then((res) => {
          if (res.status == 200) {
            this.$set(this, 'agentBrandList', res.data);
          }
        });
      },
      getShoppingCartList: function () {
        this.loading = true;
        this.checked = false;
        this.onlineCount = 0;
        const param = {
          distributorId: this.user.id,
          type: parseInt(this.tabActive)
        };
        getShoppingCartList(param).then((res) => {
          if (res.status == 200) {
            const shoppingCartList = res.data;
            // 商品未下架加入时未代理，现在已代理品牌
            if (this.tabActive == 1 && this.agentBrandList.length > 0) {
              shoppingCartList.map(item => {
                if (item.status == 'Y' && item.type == 2) {
                  let product;
                  product = this.agentBrandList.find(i => {
                    return i.id == item.brandId;
                  });
                  if (product) {
                    this.$set(item, 'needReAdd', true);
                    this.isShowAlert = true;
                  }
                }
              });
            }
            shoppingCartList.map((cart, i) => {
              if (this.tabActive == 1) {

                // 对象数组深拷贝
                let currSkuPriceList = [];
                cart.skuPriceDetailVO.forEach(price => {
                  currSkuPriceList.push({...price});
                });
            
                let priceList = [];
                currSkuPriceList.map(item => {
                  if (item.special == 'Y') {
                    item.priority = 3;
                  } else if (item.promotionId) {
                    item.priority = 2;
                  } else {
                    item.priority = 1;
                  }
                });
                currSkuPriceList.sort((a, b) => {
                  if (a.startPiece == b.startPiece) {
                    return b.priority > a.priority;
                  }
                  return a.startPiece - b.startPiece;
                });
                
                const tmpPriceList = [];
                currSkuPriceList.forEach(price => {
                  tmpPriceList.push({...price});
                });
                // 抽取价格
                for (let i = 0; i < currSkuPriceList.length; i++) {
                  let j = i + 1;
                  let notFind = true;
                  let isFirst = true;
                  while (j < currSkuPriceList.length && notFind) {
                    if (currSkuPriceList[i].priority < currSkuPriceList[j].priority) {
                      // 后者优先度高的时候 后者的起批量介于前者中间
                      if (currSkuPriceList[j].startPiece > currSkuPriceList[i].startPiece) {
                        if (currSkuPriceList[j].startPiece <= currSkuPriceList[i].endPiece) {
                          // 后者截止量介于前者中间 如 普通价格：1-12；促销价格：3-5
                          if (currSkuPriceList[j].endPiece <= currSkuPriceList[i].endPiece) {
                            // 拆成 普通价格：1-2
                            
                            priceList.push({
                              startPiece: currSkuPriceList[i].startPiece,
                              endPiece: currSkuPriceList[j].startPiece - 1,
                              price: currSkuPriceList[i].price,
                              stock: currSkuPriceList[i].priority > 1 && currSkuPriceList[i].stock || 0
                            });
                          } else { // 后者截止量大于前者截止量 如 普通价格：1-12；促销价格：3-14
                            // 拆成 普通价格：1-2
                            
                            priceList.push({
                              startPiece: currSkuPriceList[i].startPiece,
                              endPiece: currSkuPriceList[j].startPiece - 1,
                              price: currSkuPriceList[i].price,
                              stock: currSkuPriceList[i].priority > 1 && currSkuPriceList[i].stock || 0
                            });
                          }
                        }
                        notFind = false;
                      } else { // 普通 1-12 特殊 1-4
                        priceList.push({
                          startPiece: currSkuPriceList[j].startPiece,
                          endPiece: currSkuPriceList[j].endPiece,
                          price: currSkuPriceList[j].price,
                          stock: currSkuPriceList[j].priority > 1 && currSkuPriceList[j].stock || 0
                        });
                        currSkuPriceList[i].startPiece = currSkuPriceList[j].endPiece + 1;
                        currSkuPriceList.splice(j, 1);
                        j = j - 1;
                      }
                    } else {
                      // 避免重复加入
                      if (isFirst) {
                        priceList.push({
                          startPiece: currSkuPriceList[i].startPiece,
                          endPiece: currSkuPriceList[i].endPiece,
                          price: currSkuPriceList[i].price,
                          stock: currSkuPriceList[i].priority > 1 ? currSkuPriceList[i].stock : 0
                        });
                        isFirst = false;
                      }
                      
                      if (currSkuPriceList[j].startPiece > currSkuPriceList[i].endPiece) {
                        notFind = false;
                      } else {
                        // 包含关系，删除该价格
                        if (currSkuPriceList[j].endPiece <= currSkuPriceList[i].endPiece) {
                          currSkuPriceList.splice(j, 1);
                          j = j - 1;
                        } else { // 交叉关系
                          currSkuPriceList[j].startPiece = currSkuPriceList[i].endPiece + 1;
                        }
                      }
                    }
                    
                    j = j + 1;
                  }
                }
                // 最后一个放入
                priceList.push({
                  startPiece: currSkuPriceList[currSkuPriceList.length - 1].startPiece,
                  endPiece: currSkuPriceList[currSkuPriceList.length - 1].endPiece,
                  price: currSkuPriceList[currSkuPriceList.length - 1].price,
                  stock: currSkuPriceList[currSkuPriceList.length - 1].priority > 1 &&
                            currSkuPriceList[currSkuPriceList.length - 1].stock || 0
                });
                cart.priceList = priceList;
                //  设置金额
                tmpPriceList.map(item => {
                  if (item.priority < 2 || cart.quantity <= item.stock) {
                    if (cart.quantity <= item.endPiece && cart.quantity >= item.startPiece) {
                      cart.amount = cart.quantity * item.price;
                      cart.onePrice = item.price;
                      return false;
                    }
                  }
                });
              } else {
                // 一件代发，1件的价：特殊、促销、普通
                for (let i in cart.skuPriceDetailVO) {
                  if (cart.skuPriceDetailVO[i].startPiece == 1) {
                    cart.onePrice = cart.skuPriceDetailVO[i].price;
                    break;
                  }
                }
                cart.amount = cart.quantity * cart.onePrice;
              }
              cart.status == 'Y' && (this.onlineCount++);
              cart.changeQuantity = cart.quantity;
            });
            this.$set(this, 'shoppingCartList', shoppingCartList);
            this.loading = false;

            console.log(shoppingCartList)
          }

        });
      },

      // // 设置已下架背景色
      // tableRowClassName: function (row) {
      //   if (row.status == 'Y') {
      //     return 'can-row';
      //   } else {
      //     return 'cannot-row';
      //   }
      // },

      // tab_event
      handleClick: function (tab, event) {
        this.checked = false;
        this.getShoppingCartList();
      },

      // 自定义全选按钮
      toggleSelection: function () {
        if (this.checked) {
          this.shoppingCartList.forEach(row => {
            this.$refs.cartTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.cartTable.clearSelection();
        }
      },

      // 表格上方自带的全选按钮
      handleSelectionChange: function (row) {
        this.handleShoppingCart = row;
        this.checked = this.handleShoppingCart.length == this.onlineCount;
      },

      // 批量或单个删除购物车中的商品
      updateShoppingCartList: function (row) {
        this.$nextTick(() => {
          let shoppingCartItemVOList = [];
          if (row) {
            if (row.changeQuantity != row.quantity) {
              shoppingCartItemVOList = [
                {
                  skuId: row.skuId,
                  quantity: row.changeQuantity - row.quantity,
                  type: parseInt(this.tabActive)
                }
              ];
            } else {
              shoppingCartItemVOList = [
                {
                  skuId: row.skuId,
                  quantity: -1 * row.changeQuantity,
                  type: parseInt(this.tabActive)
                }
              ];
            }
          } else {
            if (this.handleShoppingCart.length > 0) {
              this.handleShoppingCart.map(item => {
                shoppingCartItemVOList.push({
                  skuId: item.skuId,
                  quantity: -1 * item.quantity,
                  type: parseInt(this.tabActive)
                });
              });
            } else {
              return;
            }
          }
          const param = {
            distributorId: this.user.id,
            shoppingCartItemVOList
          };
          updateShoppingCartList(param).then((res) => {
            if (res.status == 200) {
              if (res.data >= 0) {
                this.getShoppingCartList();
              } else {
                this.$message({
                  message: '删除商品失败',
                  type: 'warning'
                });
              }
            }
          });
        });
      },

      // 收藏列表
      getCollectionProductList: function () {
        GetCollectionProductList(1, 10000, (res) => {
          if (res.data) {
              const collectionList = res.data;
              if (collectionList.length > 0) {
                this.shoppingCartList.map(item => {
                  for (let i = 0; i < collectionList.length; i++) {
                    if (collectionList[i].spuId == item.spuId) {
                      item.collected = true;
                      break;
                    }
                  }
                });
              }
          }
        });
      },

      // 添加收藏
      addCollectionProduct: function (spuId) {
        const param = {
          distributorId: this.user.id,
          spuIds: [spuId]
        };

        addCollectionProduct(param).then((res) => {
          if (res.status == 200 && res.data > 0) {
              this.$message({
                message: '收藏成功',
                type: 'success'
              });
          } else {
            this.$message({
              message: '收藏失败',
              type: 'success'
            });
          }
        });
      },

      // 批量移动到收藏夹
      cancelCollectionProduct: function () {
        if (this.handleShoppingCart && this.handleShoppingCart.length > 0) {
          const ids = [];
          ids.push(this.handleShoppingCart.spuId);
          let param = {
            distributorId: this.user.id,
            ids: ids

          };

          cancelCollectionProduct(param).then((res) => {
            if (res.status == 200 && res.data > 0) {
              this.getShoppingCartList();
            }
          });
        }
      },

      toOrder: function () {
        if (!this.handleShoppingCart || this.handleShoppingCart.length === 0) {
          this.$message({
            message: '请选择待结算商品',
            type: 'warning'
          });
        } else {
          this.$set(this.$store, 'handleCart', this.handleShoppingCart);
          this.$router.push({path: '/generateOrder'});
        }
      },
    },

    created () {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (user && user.distributorId != 0) {
        this.user = user;
      } else {
        this.$router.push({ path: '/login' });
      }
      this.getBrandListByAgentBrand();
      this.getShoppingCartList();
      this.$store.commit('updateStepType', 'purchase');
      this.$store.commit('updateStep', 0);
    },
    computed: {
      // step==1
      totalCount: function () {
        let totalCount = 0;
        this.handleShoppingCart.map(item => {
          totalCount = totalCount + parseInt(item.quantity);
        });
        return totalCount;
      },

      totalAmount: function () {
        let totalAmount = 0.00;
        this.handleShoppingCart.map(item => {
          totalAmount = totalAmount + parseFloat(item.onePrice) * parseFloat(item.quantity);
        });
        return totalAmount.toFixed(2);
      },

    }
  };
</script>


