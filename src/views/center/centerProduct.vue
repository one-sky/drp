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
  import { getCollectionProductList, cancelAttentionProduct, batchCancelAttentionProduct, stickyProduct } from '../../api/api';
  import ElCheckbox from "../../../node_modules/element-ui/packages/checkbox/src/checkbox";
  export default {
    components: {ElCheckbox},
    data() {
      return {
        loading:false,
        user:{},
        productList: [],
        handleProductList:[],
        currentPage:1,
        pageSize: 5,
        totalCount:40,
        multipleOption: false,
        checked: false,
        multipleSelection: [],

        isAgent: false,


      }

    },
    methods: {
      //获取已关注商品
      getCollectionProductList: function() {
        this.noneOption = true;
        this.checked = false;
        let param = {
          distributorId: 35,
          vendorId: 1,
          pageNum: this.currentPage

        };
//        getCollectionProductList(param).then((res) => {
//          if(res.status == 200){
//            this.totalCount = res.page.totalNum;
//            this.productList = res.data.listVO;
//            this.loading = false;
//            console.log(this.productList)
//          }
//
//
//        })
        this.productList = [{
          productName: '美国ROCKETBOOK创意云笔记本美国ROCKETBOOK创意云笔'
        }]
      },

      //取消已关注商品
      cancelAttentionProduct: function(row) {
        let param = {
          distributorId: this.user.distributorId,
          productId: row.productId

        };
        cancelAttentionProduct(param).then((res) => {
          if(res.status==200){
            this.$message({
              message: '取关成功',
              type: 'success'
            });
            this.getCollectionProductList();
          }

        })
      },

      //批量处理取消关注
      batchCancelAttentionProduct(){
        if(!this.handleProductList||this.handleProductList ==''){
          return;
        }else{
          var productIds = new Array();
          for(var i in this.handleProductList){
            productIds.push(this.handleProductList[i].productId)
          }
          let param = {
            productIds: productIds,
            distributorId: this.user.distributorId
          };
          batchCancelAttentionProduct(param).then((res) => {
            if(res.status == 200){
              this.getCollectionProductList();

            }
          })

        }
      },

      //批量置顶商品
      stickyProduct(value){
        var listId = new Array();
        if(value&&value!=''){
          listId.push(value);
        }else{
          if(!this.handleProductList||this.handleProductList ==''){
            return;
          }else {
            for (var i in this.handleProductList) {
              listId.push(this.handleProductList[i].id)
            }
          }
        }

        let param = {
          listId: listId,
          distributorId: this.user.distributorId
        };
        console.log(param)
        stickyProduct(param).then((res) => {
          if(res.status == 200){
            console.log(res)
            this.currentPage = 1;
            this.getCollectionProductList();

          }
        })
      },



      //降价通知
      handlePriceRemind(val){
        if(val){
          this.handleProductList = val;
        }

        /*
         this.loading = true;
         let para = Object.assign({}, this.handleProductList, userID: this.filter.userID);
         handlePriceRemind(para).then((res) => {
         this.loading = false;
         this.$message({
         message: '设置成功',
         type: 'success'
         });
         });
         */
      },

      //页码变更
      handleCurrentChange: function(val) {
        this.currentPage = val;
        this.getCollectionProduct();

      },

      //批量操作取消操作
      handleSelection() {
        this.noneOption = !this.noneOption;
        this.checked = false;
      },

      //全选按钮
      toggleSelection() {
        if (this.checked) {
          this.productList.forEach(row => {
            this.$refs.product_table.toggleRowSelection(row,true);
          });
        } else {
          this.$refs.product_table.clearSelection();
        }
      },

      handleSelectionChange(val) {
        this.handleProductList = val;
        if(this.handleProductList.length<this.productList.length){
          this.checked = false;
        }else{
          this.checked = true;
        }
      },


    },
    created() {
      this.$set(this.user, 'userId', 107);
      this.$set(this.user, 'distributorId', 35);
      this.$set(this.user, 'vendorId', 1);
      this.getCollectionProductList();
    }

  };
</script>
