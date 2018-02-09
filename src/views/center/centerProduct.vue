<template >
  <div class="center-product">
    <div class="top flex-col hor-center">
      <h1>温馨提示</h1>
      <p>1.商品库存到达预警库存时，系统将第一时间以邮件的方式通知您。
        <br/>2.商品价格比关注时的价格下降时，系统将第一时间以站内消息的方式通知您。
        <br/>3.最多只能关注100件商品，超出将无法关注。
      </p>
    </div>
    <el-table class="table" :data="productList" v-loading="loading" border>
      <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="商品" width="116" align="center">
          <template scope="scope">
            <router-link class="flex-row hor-ver-center" :to="{path: '/productDetail', query: {product: scope.row.productId}}">
              <img v-bind:src="scope.row.thumbnailImage" width="80" height="88"/>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="productName" width="200" align="center"></el-table-column>
        <el-table-column label="商品现价" width="100" align="center">
          <template scope="scope">
            <div class="third-font-color price-size">¥{{scope.row.retailPrice|formatMoney}}</div>
          </template>
        </el-table-column>
        <el-table-column label="关注时的价格" class-name="last-price" width="124" align="center">
          <template scope="scope">
            <div class="price-size">¥{{scope.row.price|formatMoney}}</div>
          </template>
        </el-table-column>
        <el-table-column label="实时库存" class-name="third-font-color" prop="price" width="96" align="center">
        </el-table-column>
        <el-table-column label="预警库存" prop="price" width="96" align="center">
        </el-table-column>
        <el-table-column label="关注时间" class-name="third-font-color" width="122" align="center">
          <template scope="scope">
            {{scope.row.createTime|formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作" class-name="third-font-color" prop="option" width="114" align="center">
          <template scope="scope" >
            <el-button type="text" @click="stickyProduct(scope.row.id)">
              置顶
            </el-button>
            <el-button type="text" @click="addToShoppingCart(scope.row)">
            加入购物车
            </el-button>
            <el-button type="text" @click="cancelAttentionProduct(scope.row)">
              取消关注
            </el-button>
            <el-button type="text" @click="handlePriceRemind(scope.row)">
              降价通知
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    <div class="pagination">
      <el-pagination layout="prev, pager, next" :page-size="pageSize" :total="totalCount"
                     :current-page="currentPage" @current-change="handleCurrentChange">
      </el-pagination>
    </div>

  </div>

</template>

<style>
  @import "../../css/center/centerProduct.css";


</style>

<script>
  import {
    GetCollectionProductList,
    AddCollectionProduct,
    CancelCollectionProduct
  } from '../../js/distributor';
  export default {
    data () {
      return {
        loading: false,
        user: {},
        productList: [],
        handleProductList: [],
        page: {
          currentPage: 1,
          pageSize: 5,
          totalCount: 40,
        },
       
        multipleOption: false,
        checked: false,
        multipleSelection: [],

        isAgent: false,
      };
    },
    methods: {
      // 收藏列表
      getCollectionProductList: function () {
        GetCollectionProductList(this.page.currentPage, this.page.pageSize, (res) => {
          if (res.data) {
            this.$set(this, 'productList', res.data);
            this.$set(this.page, 'totalCount', res.page.total);
          }
        });
      },

      // 加入收藏
      addCollectionProduct: function () {
        !this.user.id && this.$router.push({path: '/login'});
        AddCollectionProduct([this.productDetail.spuDetail.productId], (res) => {
          let msg = '';
          msg = res > 0 && '加入收藏成功' || '加入收藏失败，请重新取消';
          this.$message({
            message: msg,
            type: 'success',
            duration: 2000,
            onClose: () => {
              this.getCollectionProductList();
            }
          });
        });
      },
      // 取消收藏
      cancelCollectionProduct: function (row) {
        let productIds = [];
        if (row) {
          productIds.push(row.productId);
        } else {
          this.handleProductList.map(item => {
            productIds.push(item.productId);
          });
        }
        CancelCollectionProduct(productIds, (res) => {
          let msg = '';
          msg = res > 0 && '取消收藏成功' || '取消收藏失败，请重新取消';
          this.$message({
            message: msg,
            type: 'success',
            duration: 2000,
            onClose: () => {
              this.getCollectionProductList();
            }
          });
        });
      },

      // 批量置顶商品
      stickyProduct: function (value) {
      },

      // 降价通知
      handlePriceRemind: function (val) {
      },

      // 页码变更
      handleCurrentChange: function (val) {
        this.currentPage = val;
        this.getCollectionProduct();
      },

      // 批量操作取消操作
      handleSelection: function () {
        this.noneOption = !this.noneOption;
        this.checked = false;
      },

      // 全选按钮
      toggleSelection: function () {
        if (this.checked) {
          this.productList.forEach(row => {
            this.$refs.product_table.toggleRowSelection(row, true);
          });
        } else {
          this.$refs.product_table.clearSelection();
        }
      },

      handleSelectionChange: function (val) {
        this.handleProductList = val;
        this.checked = this.handleProductList.length >= this.productList.length;
      },
    },
    created () {
      this.$set(this, 'user', JSON.parse(sessionStorage.getItem('user')));
      this.getCollectionProductList();
    }
  };
</script>
