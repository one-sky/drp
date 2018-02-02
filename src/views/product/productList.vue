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
      <!--category-->
      <div class="top">
        <div class="item" v-for="(item, index) in attributeList" v-if="index<5">
          <div  class="flex-row ver-center" :key="item.isShow">
            <div class="flex-row ver-center">
              <h2>
                {{item.attributeName}} :
              </h2>
              <el-button type="text" @click="searchProductByCategory(index,-1,item)">全部</el-button>
              <el-checkbox-group class="flex-row-col" v-model="checkAttributeList">
                <div v-for="valueItem in item.attributeValueItemVOList">
                  <el-checkbox v-if="item.isMore" :label="valueItem">
                    {{valueItem.attributeValueName}}
                  </el-checkbox>
                  <el-button v-else type="text" @click="searchProductByCategory(index,1,valueItem)">{{valueItem.attributeValueName}}</el-button>
                </div>
              </el-checkbox-group>
            </div>
            <div class="option flex-row hor-end">
              <el-button type="default" @click="showCategory(item.isMore,item.isShow,index)">更多<i class="el-icon-arrow-down"></i></el-button>
              <el-button type="default" @click="isAllowMore(item.isMore,item.isShow,index)">多选<i class="el-icon-plus"></i></el-button>
            </div>
          </div>
          <div class="collapse flex-row hor-center" v-if="item.isMore">
            <el-button type="primary" @click="searchProductByCategory(index)">查询</el-button>
            <el-button @click="collapseMore(index)">取消</el-button>
          </div>
        </div>
        <template v-if="isShowAll">
          <div class="item" v-for="i in parseInt(attributeList.length-5)">
            <div  class="flex-row ver-center" :key="attributeList[i+4].isShow">
              <div class="flex-row ver-center">
                <h2>
                  {{attributeList[i+4].attributeName}} :
                </h2>
                <el-button type="text" @click="searchProductByCategory(i+4,-1,attributeList[i+4])">全部</el-button>
                <el-checkbox-group class="flex-row-col" v-model="checkAttributeList">
                  <div v-for="valueItem in attributeList[i+4].attributeValueItemVOList">
                    <el-checkbox v-if="attributeList[i+4].isMore" :label="valueItem">
                      {{valueItem.attributeValueName}}
                    </el-checkbox>
                    <el-button v-else type="text" @click="searchProductByCategory(i+4,1,valueItem)">{{valueItem.attributeValueName}}</el-button>
                  </div>
                </el-checkbox-group>
              </div>
              <div class="option flex-row hor-end">
                <el-button type="default" @click="showCategory(attributeList[i+4].isMore,attributeList[i+4].isShow,i+4)">更多<i class="el-icon-arrow-down"></i></el-button>
                <el-button type="default" @click="isAllowMore(attributeList[i+4].isMore,attributeList[i+4].isShow,i+4)">多选<i class="el-icon-plus"></i></el-button>
              </div>
            </div>
            <div class="collapse flex-row hor-center" v-if="attributeList[i+4].isMore">
              <el-button type="primary" @click="searchProductByCategory(i+4)">查询</el-button>
              <el-button @click="collapseMore(i+4)">取消</el-button>
            </div>
          </div>
        </template>

        <div v-if="attributeList&&attributeList.length>5"  class="show-more flex-row hor-center">
          <el-button ref="more_button" @click="handleShowAll">{{more_button_message}}</el-button>
        </div>

      </div>

      <!--condition-->
      <div class="middle flex-row ver-center">
        <el-radio-group v-model="search.type" class="product_condition_group" fill="#ffd200" text-color="#4a4a4a">
          <el-radio-button label="一件代发">一件代发</el-radio-button>
          <el-radio-button label="批发">批发</el-radio-button>
        </el-radio-group>
        <p class="fz_font">排序：</p>
        <el-button @click="updateAndToggle('productId')" :style="{'background-color':search.orderField=='productId'?'#fff':'#ebebeb'}">
          综合
          <img v-if="search.orderField=='productId'&& search.orderDirection==2" src="../../imgs/product/asc.jpg" height="10" width="6"/>
          <img v-else src="../../imgs/product/desc.jpg" height="10" width="6"/>
        </el-button>
        <el-button @click="updateAndToggle('priceOrder')" :style="{'background-color':search.orderField=='priceOrder'?'#fff':'#ebebeb'}">
          价格
          <img v-if="search.orderField=='priceOrder'&& search.orderDirection==2" src="../../imgs/product/asc.jpg" height="10" width="6"/>
          <img v-else src="../../imgs/product/desc.jpg" height="10" width="6"/>
        </el-button>
        <el-button @click="updateAndToggle('salesNum')" :style="{'background-color':search.orderField=='salesNum'?'#fff':'#ebebeb'}">
          销量
          <img v-if="search.orderField=='salesNum'&& search.orderDirection==2" src="../../imgs/product/asc.jpg" height="10" width="6"/>
          <img v-else src="../../imgs/product/desc.jpg" height="10" width="6"/>
        </el-button>
        <el-cascader :options="areaList" class="area" popper-class="area_popper" :clearable="true" :props="{value:'index' ,label:'regionName',children:'cities'}"
                     @change="changeArea" @active-item-change="handleChooseProvince" placeholder="所在地区">

        </el-cascader>
        <div class="right flex-row hor-end ver-center">
          <el-button class="el-icon-arrow-left" type="text" :disabled="curPage<2" @click="handleCurrentChange(curPage-1)"></el-button>
          <span>{{curPage}}</span>／{{pageCount}}
          <el-button class="el-icon-arrow-right" type="text" :disabled="curPage>pageCount-1" @click="handleCurrentChange(curPage+1)"></el-button>
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
              <div v-if="search.type=='一件代发'">
                <div>
                  <span class="price-icon-size">¥</span>{{item.highPrice|formatMoney}}
                </div>
                <div>一件代发价</div>
              </div>
              <div v-else-if="search.type=='批发'">
                <div v-if="user.userId&&user.userId!=''">
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
          :current-page.sync="curPage"
          :page-size="20"
          layout="prev, pager, next, total, jumper"
          :total="count">
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
    getProductList,
    getRecommendBrandList,
    getProvinceList,
    getCityListByProvince,
    getAgentBrand
    } from '../../api/api.js';
  export default{
    data () {
      return {
        loading: false,
        user: {},
        curPage: 1,
        count: 0, // 条目总数
        pageCount: 0, // 页码总数
        attributeList: [],  // top属性显示
        search: {
          type: '一件代发',
          orderField: 'productId',
          orderDirection: 1
        },
        lastChosen: 'productId',

        brandList: [], // 查询列表

        checkAttributeList: [], // checkBox监听列表
        // 品牌首字母
        brandFirstLetters: {
          isMore: false,
          isShow: false,
          firstLetters: []
        },
        productList: [{
          productId: null,
          productName: null,
          thumbnailImage: null,
          retailPrice: null,
          priceRange: null

        }],

        // 推荐商品
        recommendBrand: [],

        // area
        areaList: [],
        area: [],
        city: null,
        // 属性栏是否展开
        isShowAll: false,
        more_button_message: '更 多',

      };
    },
    methods: {
      init () {
        // 属性栏初始化
        this.isShowAll = false;
        this.more_button_message = '更 多';
        for (var p in this.attributeList) {
          this.$set(this.attributeList[p], 'isMore', false);
          this.$set(this.attributeList[p], 'isShow', false);
        }
      },
      updateAndToggle: (val) => {
        if (this.lastChosen == val) {
          this.search.orderDirection = this.search.orderDirection == 1 ? 2 : 1;
        } else {
          this.lastChosen = val;
          this.search.orderField = val;
          this.search.orderDirection = 1;
        }
        this.getProductList();
      },

      getProductList: () => {
        this.loading = true;
        this.productList = [];
        var firstLetters = new Array();
        var brandIds = new Array();
        var attributeIds = new Array();
        var attributeValueIds = new Array();
//        for(var i in this.brandList){
//          //字母
//          if(this.brandList[i].attributeName=='按品牌首字母'){
//            if(this.brandList[i].attributes&&this.brandList[0].attributes!=''){
//              for(var item in this.brandList[i].attributes) {
//                firstLetters.push(this.brandList[i].attributes[item].attributeValueId);
//              }
//            }else if(this.brandList[i].attributeId&&this.brandList[i].attributeId!=''){
//              firstLetters = new Array();
//            }
//          }else if(this.brandList[i].attributeName=='品牌'){ //品牌
//            if(this.brandList[i].attributes&&this.brandList[i].attributes!=''){
//              for(var item in this.brandList[i].attributes) {
//                brandIds.push(this.brandList[i].attributes[item].attributeValueId);
//              }
//            }else if(this.brandList[i].attributeId&&this.brandList[i].attributeId!=''){
//              brandIds.push(this.brandList[i].attributeId);
//            }else{
//              brandIds = new Array();
//            }
//          } else{ //属性
//            if(this.brandList[i].attributes&&this.brandList[i].attributes!=''){
//              for(var item in this.brandList[i].attributes){
//                attributeValueIds.push(this.brandList[i].attributes[item].attributeValueId);
//              }
//            }else if(this.brandList[i].attributeId&&this.brandList[i].attributeId!=''){
//              attributeIds.push(this.brandList[i].attributeId);
//            }else{
//              attributeIds = new Array();
//            }
//          }
//        }
        //标记查询的是商品还是品牌  1-product  2-brand

//        var flag = null;
//        if(null != this.$store.state.selectType && this.$store.state.selectType == '品牌' ){
//          flag=2;
//        }else{
//          flag =1;
//        }
        let param = {
          vendorId: 1,
          pageNum: 1
        };
        getProductList(param).then((res) => {
          if (res.status == 200) {
            if (res.data && res.data != '') {
              this.productList = res.data.productList;
              // 品牌首字母
              if (res.data.firstLetters && res.data.firstLetters != '') {
                this.attributeList.push({ 'attributeId': 0, 'attributeName': '品牌首字母', 'attributeValueItemVOList': null });
                // 首字母转成大写字母
                this.$set(this.attributeList[0], 'attributeValueItemVOList', res.data.firstLetters.map(function (item) {
                    return {'attributeValueId': item.toUpperCase(), 'attributeValueName': item.toUpperCase()};
                  })
                );
              }
              for (var i in res.data.attibutes) {
                this.attributeList.push(res.data.attibutes[i]);
              }

              // 区别一件代发与批发价
              for (var p in this.productList) {
                this.$set(this.productList[p], 'lowPrice', this.productList[p].priceRange.split('~')[0]);
                this.$set(this.productList[p], 'highPrice', this.productList[p].priceRange.split('~')[1]);
              }
              this.count = res.data.count;
              this.pageCount = res.data.pageCount;
              if (this.user.userId && this.user.userId != '') {
                this.getAgentBrand();
              }
            }

            this.init();
//            if(null != this.$store.state.showType && this.$store.state.showType =='批发'){
//              this.$set(this.search, 'type', '批发');
//            }else{
//              this.$set(this.search, 'type', '一件代发');
//            }
            this.loading = false;
          }
        });
      },
      // 在没有多选下，更多按钮有效
      showCategory: (moreVal, showVal, id) => {
        if (!moreVal) {
          this.$set(this.attributeList[id], 'isShow', !showVal);
        }
      },
      // 展开多选，并展示更多
      isAllowMore: (moreVal, showVal, id) => {
        if (!moreVal) {
          this.attributeList[id].isMore = true;
          this.attributeList[id].isShow = true;
        }
      },

      // 关闭多选
      collapseMore: (id) => {
        this.attributeList[id].isMore = false;
        this.attributeList[id].isShow = false;
        // 清除当前大类选项
        var attributList = [];
        for (let i in this.attributeList[id - 1].attibutes) {
          for (let j in this.checkAttributeList) {
            if (this.attributeList[id - 1].attibutes[i].attributeValueId != this.checkAttributeList[j].attributeValueId) {
              attributList.push(this.checkAttributeList[j]);
            }
          }
        }
        this.checkAttributeList = attributList;
      },

      // 检查brandList中是否已有， -1为重复， 不重复返回brandList中的位置，从0开始
      handelDuplicate: (index, value) => {
        if (index < 1) {  // 品牌首字母
          for (let i in this.brandList) {
            if (this.brandList[i].attributeName == '按品牌首字母') {
              for (var j in this.brandList[i].attributes) {
                if (this.brandList[i].attributes[j] == value) {
                  return -1;
                }
              }
              return i;
            }
          }
          // 未return ，不重复
          // 没有这个属性大类
          const attribute = {attributeId: null, attributeName: '按品牌首字母', attributes: new Array()};
          this.brandList.push(attribute);
          return this.brandList.length - 1;
        } else {  // 品牌或属性
          for (let i in this.brandList) {
            // 已有这一个属性大类
            if (this.brandList[i].attributeId == this.attributeList[index - 1].attributeId) {
              // 遍历子属性中是否存在
              for (let j in this.brandList[i].attributes.attributeValueItemVOList) {
                if (this.brandList[i].attributes.attributeValueItemVOList[j] == value) {
                  return -1;
                }
              }
              return i;
            }
          }
          // 没有这个属性大类
          const attribute = {
            attributeId: this.attributeList[index - 1].attributeId,
            attributeName: this.attributeList[index - 1].attributeName,
            attributes: new Array()
          };
          this.brandList.push(attribute);
          return this.brandList.length - 1;
        }
      },
      // 查询
      searchProductByCategory: (index, flag, value) => {
        if (index < 1) {  // 品牌首字母
          if (value && value != '') {
            var i = this.handelDuplicate(index, value);
            if (this.handelDuplicate(index, value)) {
              this.brandList[i].attributes.push({attributeValueId: value, attributeValueName: value});
            }
          }
        } else {
          if (flag && flag != '' && flag > 0) { // 单选
            let i = this.handelDuplicate(index, value);
            if (i > -1) {
              this.brandList[i].attributes.push(value);
            }
          } else {  // 多选
            for (let i in this.checkAttributeList) {
              var k = this.handelDuplicate(index, this.checkAttributeList[i]);
              if (k > -1) {
                this.brandList[k].attributes.push(this.checkAttributeList[i]);
              }
            }
          }
        }
        this.getProductList();
      },
      handleCurrentChange: (val) => {
        this.curPage = val;
      },

      handleShowAll: () => {
        this.isShowAll = !this.isShowAll;
        if (this.isShowAll) {
          this.more_button_message = '收 起';
        } else {
          this.more_button_message = '更 多';
        }
      },

      // 获取省列表
      getProvince: () => {
        let param = {};
        getProvinceList(param).then((res) => {
          if (res.status == 200) {
            this.areaList = res.data;
            for (var i in this.areaList) {
              this.$set(this.areaList[i], 'cities', []);
              this.$set(this.areaList[i], 'index', i);
            }
          }
        });
      },

      // 获取市列表
      handleChooseProvince: (value) => {
        if (value && value != '') {
          let param = {
            parentCode: this.areaList[value[0]].regionCode
          };
          getCityListByProvince(param).then((res) => {
            if (res.status == 200) {
              this.areaList[value[0]].cities = res.data;
              for (var i in this.areaList[value[0]].cities) {
                this.$set(this.areaList[value[0]].cities[i], 'index', i);
              }
            }
          });
        }
      },

      // 省市均选择后调用getProductList
      changeArea: (value) => {
        if (value && value != '') {
          this.area = value;
          if (this.area.length > 1) {
            this.city = this.areaList[this.area[0]].cities[this.area[1]].regionCode;
            this.getProductList();
          }
        } else {
          this.city = null;
          this.getProductList();
        }
      },

      // 获取已代理品牌
      getAgentBrand: () => {
        let param = {
          distributorId: this.user.distributorId,
          vendorId: this.user.vendorId
        };
        getAgentBrand(param).then((res) => {
          if (res.status == 200) {
            this.agentBrandList = res.data;
            for (let i in this.productList) {
              this.$set(this.productList[i], 'isAgent', false);
              for (var j in this.agentBrandList) {
                if (this.productList[i].brandIds[0] == this.agentBrandList[j].erpBrandId) {
                  this.$set(this.productList[i], 'isAgent', true);
                  break;
                }
              }
            }
          }
        });
      },

    },
    created () {
      this.getProductList();
      this.getProvince();
    }
  };
</script>
