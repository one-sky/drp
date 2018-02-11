<template >
  <div class="center-product">
    <div class="top flex-col hor-center">
      <h1>温馨提示</h1>
      <p>1.商品库存到达预警库存时，系统将第一时间以邮件的方式通知您。
        <br/>2.商品价格比关注时的价格下降时，系统将第一时间以站内消息的方式通知您。
        <br/>3.最多只能关注100件商品，超出将无法关注。
      </p>
    </div>
    <el-table class="table" :data="productList" v-loading="loading" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="商品" width="116" align="center">
          <template scope="scope">
            <router-link class="flex-row hor-ver-center" :to="{path: '/productDetail', query: {product: scope.row.spuId}}">
              <img v-bind:src="scope.row.thumbnailImage" width="80" height="88"/>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="spuName" width="200" align="center"></el-table-column>
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
        <el-table-column label="关注时间" class-name="third-font-color" width="122" align="center">
          <template scope="scope">
            {{scope.row.createTime|formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="96" align="center">
          <template scope="scope">
            {{scope.row.online == 'Y' ? '售卖中': '已下架'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" class-name="third-font-color" prop="option" width="114" align="center">
          <template scope="scope" >
            <el-button type="text">
              置顶
            </el-button>
            <el-button type="text" @click="cancelCollectionProduct(scope.row)">
              取消关注
            </el-button>
            <el-button type="text">
              降价通知
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="batchBtn">
        <el-button type="primary">
          置顶
        </el-button>
        <el-button type="primary" @click="cancelCollectionProduct()">
          取消关注
        </el-button>
        <el-button type="primary">
          降价通知
        </el-button>
      </div>
      

    <div class="pagination">
      <el-pagination layout="prev, pager, next" :page-size="page.pageSize" :total="page.totalCount"
                     :current-page="page.currentPage" @current-change="handleCurrentChange">
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
    CancelCollectionProduct
  } from '../../js/distributor';
  export default {
    data () {
      return {
        loading: false,
        user: {},
        productList: [],
        handleProductList: [],
        agentBrandList: [],
        page: {
          currentPage: 1,
          pageSize: 5,
          totalCount: 40,
        },
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

      // 取消收藏
      cancelCollectionProduct: function (row) {
        let ids = [];
        if (row) {
          ids.push(row.spuId);
        } else {
          if (!this.handleProductList) {
            this.$message({
              message: '请选择商品',
              type: 'success',
              duration: 1000,
            });
            return;
          }
          this.handleProductList.map(item => {
            ids.push(item.spuId);
          });
        }
        CancelCollectionProduct(ids, (res) => {
          let msg = '';
          msg = res > 0 ? '取消收藏成功' : '取消收藏失败，请重新取消';
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

      // 页码变更
      handleCurrentChange: function (val) {
        this.page.currentPage = val;
        this.getCollectionProductList();
      },

      handleSelectionChange: function (val) {
        this.handleProductList = val;
      },
    },
    created () {
      this.$set(this, 'user', JSON.parse(sessionStorage.getItem('user')));
      this.getCollectionProductList();
    }
  };
</script>
