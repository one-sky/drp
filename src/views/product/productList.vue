<template>
  <div class="category-list flex-col ver-center">
    <div class="breadcrumb-component hor-start ver-center" style="width:1200px;height:40px;">
      当前位置：
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item >a</el-breadcrumb-item>
        <el-breadcrumb-item>b</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="flex-col ver-center">
      <!--attribute-->
      <div class="top">
        <div class="item" v-for="(item, index) in attributeList" v-if="index<5">
          <div  class="flex-row ver-center" :key="item.isShow">
            <div class="flex-row ver-center">
              <h2>
                {{item.attrName}} :
              </h2>
              <el-button type="text" @click="handleSearch(item)">全部</el-button>
              <el-checkbox-group class="flex-row-col" v-model="checkAttributeList">
                <div v-for="child in item.attrValueEntityList">
                  <el-checkbox v-if="item.isMore" :label="child">
                    {{child.attrValue}}
                  </el-checkbox>
                  <el-button v-else type="text" @click="handleSearch(child)">{{child.attrValue}}</el-button>
                </div>
              </el-checkbox-group>
            </div>
            <div class="option flex-row hor-end">
              <el-button type="default" @click="showMore(item)">更多<i class="el-icon-arrow-down"></i></el-button>
              <el-button type="default" @click="expandChoosen(item)">多选<i class="el-icon-plus"></i></el-button>
            </div>
          </div>
          <div class="collapse flex-row hor-center" v-if="item.isMore">
            <el-button type="primary" @click="handleSearch()">查询</el-button>
            <el-button @click="collapseChoosen(item)">取消</el-button>
          </div>
        </div>
        <template v-if="attributeList.isShowAll">
          <div class="item" v-for="i in parseInt(attributeList.length-5)">
            <div  class="flex-row ver-center" :key="attributeList[i+4].isShow">
              <div class="flex-row ver-center">
                <h2>
                  {{attributeList[i+4].attrName}} :
                </h2>
                <el-button type="text" @click="handleSearch(attributeList[i+4])">全部</el-button>
                <el-checkbox-group class="flex-row-col" v-model="checkAttributeList">
                  <div v-for="child in attributeList[i+4].attrValueEntityList">
                    <el-checkbox v-if="attributeList[i+4].isMore" :label="child">
                      {{child.attrValue}}
                    </el-checkbox>
                    <el-button v-else type="text" @click="handleSearch(child)">{{child.attrValue}}</el-button>
                  </div>
                </el-checkbox-group>
              </div>
              <div class="option flex-row hor-end">
                <el-button type="default" @click="showMore(child)">更多<i class="el-icon-arrow-down"></i></el-button>
                <el-button type="default" @click="expandChoosen(child)">多选<i class="el-icon-plus"></i></el-button>
              </div>
            </div>
            <div class="collapse flex-row hor-center" v-if="attributeList[i+4].isMore">
              <el-button type="primary" @click="handleSearch()">查询</el-button>
              <el-button @click="collapseChoosen(child)">取消</el-button>
            </div>
          </div>
        </template>

        <div v-if="attributeList.length>5"  class="show-more flex-row hor-center">
          <el-button ref="more_button" @click="handleShowAll">{{attributeList.moreDesc}}</el-button>
        </div>

      </div>

      <!--condition-->
      <div class="middle flex-row ver-center">
        <el-radio-group v-model="priceType" class="product_condition_group" fill="#ffd200" text-color="#4a4a4a">
          <el-radio-button label="2">一件代发</el-radio-button>
          <el-radio-button label="1">批发</el-radio-button>
        </el-radio-group>
        <p class="fz_font">排序：</p>
        <el-button @click="handleToggle('productId')" :style="{'background-color':search.orderField=='productId'?'#fff':'#ebebeb'}">
          综合
          <img v-if="search.orderField=='productId'&& search.orderDirection==2" src="../../imgs/product/asc.jpg" height="10" width="6"/>
          <img v-else src="../../imgs/product/desc.jpg" height="10" width="6"/>
        </el-button>
        <el-button @click="handleToggle('retailPrice')" :style="{'background-color':search.orderField=='retailPrice'?'#fff':'#ebebeb'}">
          价格
          <img v-if="search.orderField=='retailPrice'&& search.orderDirection==2" src="../../imgs/product/asc.jpg" height="10" width="6"/>
          <img v-else src="../../imgs/product/desc.jpg" height="10" width="6"/>
        </el-button>
        <el-button @click="handleToggle('salesNum')" :style="{'background-color':search.orderField=='salesNum'?'#fff':'#ebebeb'}">
          销量
          <img v-if="search.orderField=='salesNum'&& search.orderDirection==2" src="../../imgs/product/asc.jpg" height="10" width="6"/>
          <img v-else src="../../imgs/product/desc.jpg" height="10" width="6"/>
        </el-button>
        <div class="right flex-row hor-end ver-center">
          <el-button class="el-icon-arrow-left" type="text" :disabled="page.pageNum<2" @click="handleCurrentChange(page.pageNum - 1)"></el-button>
          <span>{{page.pageNum}}</span>／{{page.pages}}
          <el-button class="el-icon-arrow-right" type="text" :disabled="page.pageNum>page.pages-1" @click="handleCurrentChange(page.pageNum + 1)"></el-button>
        </div>
      </div>


      <!--product_list-->
      <div class="flex-row-col">
        <template v-for="(item, index) in productList">
          <div class="bottom" :style="{'margin-left': (index%5==0?0:20)+'px'}">
            <router-link :to="{path: '/productDetail', query:{ product: item.productId }}" >
              <img v-bind:src="item.thumbnailImage" height="209" width="210" />
            </router-link>
            <div class="price-table">
              <div>
                <div>
                  <span class="price-icon-size">¥</span>{{item.retailPrice|formatMoney}}
                </div>
                <div class="price-icon-size">零售价</div>
              </div>
              <div v-if="priceType == '2'">
                <div>
                  <span class="price-icon-size">¥</span>{{item.highPrice|formatMoney}}
                </div>
                <div>一件代发价</div>
              </div>
              <div v-else>
                <div v-if="user.id && user.id != 0">
                  <div v-if="item.isAgent">
                    <span class="price-icon-size">¥</span>{{item.lowPrice|formatMoney}}～{{item.highPrice|formatMoney}}
                  </div>
                  <img v-else src="../../imgs/product/lock.png" height="20" width="16" style="margin-left:4px;"/>
                </div>
                <div v-else>登录后可查看</div>
                <div>批发价</div>
              </div>
            </div>
            <router-link to="/" class="long-title">
              {{item.productName}}
            </router-link>
          </div>

        </template>
      </div>

      <!--分页-->
      <div class="pagination flex-row hor-center">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="page.pageNum"
          :page-size="page.pageSize"
          layout="prev, pager, next, total, jumper"
          :total="page.total">
        </el-pagination>
      </div>
    </div>
  </div>


</template>
<style>
  @import "../../css/product.css";
</style>

<script>
  import {
    getAttributeList,
    getRecommendBrandList,
    getProductList,
    getBrandListByAgentBrand
  } from '../../api/api.js';

  export default{
    data () {
      return {
        loading: false,
        user: {},
        categoryIds: null,
        attributeList: [],  // top类目显示
        // 推荐商品
        recommendBrand: [],
        // 查询条件
        search: {
          productName: null,
          brandName: null,
          productIds: [],
          brandId: null,
          orderField: 'productId',
          orderDirection: 1
        },
        brandAgentList: [],
        priceType: 1,
        brandList: [], // 查询列表
        checkAttributeList: [], // checkBox监听列表

        productList: [],
        page: {
          pageNum: 1,
          total: 0,
          pageSize: 20,
          pages: 0
        },
        
      };
    },
    methods: {
      handleToggle: function (val) {
        if (this.search.orderField == val) {
          this.search.orderDirection = this.search.orderDirection == 1 ? 2 : 1;
        } else {
          this.search.orderField = val;
          this.search.orderDirection = 1;
        }
        this.getProductList();
      },

      // 在没有多选下，更多按钮有效
      showMore: function (category) {
        !category.isMore && this.$set(category, 'isShow', !category.isShow)
      },

      // 展开多选，并展示更多
      expandChoosen: function (category) {
        const isMore = category.isMore;
        // 关闭已展开的其他类的多选并清除选择项
        this.attributeList.map(item => {
          this.collapseChoosen(item);
        });
        !isMore && this.$set(category, 'isShow', true) && this.$set(category, 'isMore', true)
      },

      // 关闭多选
      collapseChoosen: function (category) {
        this.$set(category, 'isMore', false);
        this.$set(category, 'isShow', false);
        // 清除当前大类选中的子选项
        const parent = category.id;
        const tmp = [];
        this.checkAttributeList.map((item, index) => {
          return item.parentId != parent ? tmp.push(item) : '';
        });
        this.checkAttributeList = tmp;
      },

      // 属性点击查询
      handleSearch: function (attribute) {
        let productIds = [];
        // 单选
        if (attribute) {
          // 点击的是属性大类
          if (attribute.hasOwnProperty('categoryId')) {
            attribute.attrValueEntityList.map(item => {
              productIds.push(...item.spuIds.split(','));
            });
          } else {
            productIds = attribute.spuIds && attribute.spuIds.split(',');
          }
        } else {  // 多选
          // 设置查询类目的条件
          this.checkAttributeList.map(item => {
            productIds.push(...(item.spuIds && item.spuIds.split(',')));
            return true;
          });
        }
        if (!productIds || productIds.length === 0) {
          productIds = [];
          productIds.push(-1);
        }
        productIds.map(item => {
          item = parseInt(item);
        });
        this.$set(this.search, 'productIds', [...new Set(productIds)]);

        this.getProductList();
      },

      // 点击页码
      handleCurrentChange: function (val) {
        this.page.pageNum = val;
      },

      // 总类目的收缩与展开
      handleShowAll: function () {
        this.$set(this.attributeList, 'isShowAll', !this.attributeList.isShowAll);
        const desc = this.attributeList.isShowAll && '收 起' || '更 多';
        this.$set(this.attributeList, 'moreDesc', desc);
      },

      // 类目
      getAttributeList: function () {
        const param = {
          userType: 1,
          categoryIds: this.categoryIds
        };
        getAttributeList(param).then((res) => {
          if (res.status == 200) {
            const attributeList = res.data;
            if (!attributeList || attributeList.length == 0) {
              this.$router.push({path: '/'});
            }
            this.$set(this, 'attributeList', attributeList);
            // // 去所有属性中的商品Id
            // const productIds = [];
            // attributeList.map(item => {
            //   item.attrValueEntityList.map(item => {
            //     item.spuIds && productIds.push(...item.spuIds.split(','));
            //   });
            // });
            // this.$set(this.search, 'productIds', [...new Set(productIds)]);
            this.getProductList();
          }
        });
      },

      // 获取代理品牌
      getBrandListByAgentBrand: function () {
        const param = {
          distributorId: this.user.id,
          pageSize: 10000,
          pageNum: 1
        };
        getBrandListByAgentBrand(param).then((res) => {
          if (res.status == 200) {
            this.$set(this, 'brandAgentList', res.data);
          }
        });
      },

      getProductList: function () {
        this.loading = true;
        // top 搜索框标记查询的是商品还是品牌  1-product  2-brand
        if (this.$store.state.searchProduct.type == 1) {
          this.$set(this.search, 'productName', this.$store.state.searchProduct.value);
        } else if (this.$store.state.searchProduct.type == 2) {
          this.$set(this.search, 'brandName', this.$store.state.searchProduct.value);
        }
        const param = {
          userType: 1,
          ...this.search,
          pageSize: this.page.pageSize,
          page: this.page.pageNum
        };
        getProductList(param).then((res) => {
          if (res.status == 200) {
            if (res.data) {
              const productList = res.data;
              // 区别一件代发与批发价
              productList.map(item => {
                item.lowPrice = item.priceRange.split('~')[0];
                item.highPrice = item.priceRange.split('~')[1];
                // 设置商品所属品牌是否代理
                const brand = this.brandAgentList.find(brand => {
                  return brand.id == item.brandId;
                });
                item.isAgent = !!brand;
              });
              this.$set(this, 'productList', productList);
              this.page = {...res.page};
              // this.showSearchCondition();
            }
            this.loading = false;
          }
        });
      },

    },
    created () {
      const user = sessionStorage.getItem('user');
      if (user) {
        this.$set(this, 'user', JSON.parse(user));
        this.getBrandListByAgentBrand();
      }
      if (this.$store.state.searchProduct.priceType == 2) {
          this.priceType = '2';
      } else {
        this.priceType = '1';
      }
      this.categoryIds = this.$store.state.searchProduct.categoryIds || this.$router.push({path: '/'});
      this.getAttributeList();
    }
  };
</script>
