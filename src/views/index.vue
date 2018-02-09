<template>
  <div class="index" ref="index" style="padding-bottom:42px;">
    <router-view name="searchbox" style="flex:1;"></router-view>
    <router-view name="navigation" style="margin-top:24px; "></router-view>
    <!--banner-->
    <div class="banner">
      <el-carousel height="460px" indicator-position="none" arrow="hover">
        <el-carousel-item v-for="item in bannerList" :key="item.id">
          <router-link :to="item.bannerPath" style="width:100%; height:460px;">
            <div :style="{backgroundImage: `url(${item.bannerImg})`, width:'100%', height:'460px'}"></div>
            <!--<img v-bind:src="item.bannerImg" width="100%" height="460"/>-->
          </router-link>

        </el-carousel-item>
      </el-carousel>

      <!--menu -->
      <div class="menu" :style="{left:(screenWidth>1200?(screenWidth-1200)/2:0)+'px'} ">
        <el-button v-for="(item,index) in categoryList" type="text" @click="searchProduct(item)" :key="index">
          <div class="second-font-color flex-row hor-between">
            <div>{{item.categoryName}}</div>
            <div>&gt;</div>
          </div>
        </el-button>


      </div>

      <!--info-->
      <div class="info ver-between" :style="{left:(screenWidth>1200?(screenWidth/2+410):screenWidth-190)+'px'}">
        <div class="top flex-col ver-center" >
          <div v-if="!user.userId">
            <div class="hor-center">
              <img src="../imgs/home/header_icon.png" height="41" width="41"/>
            </div>

            <p class="hor-center">Hi，你好</p>
            <div class="hor-center">
              <router-link class="login hor-center" to="/login">
                登录
              </router-link>
              <router-link class="register hor-center" to="/register">注册</router-link>
            </div>
          </div>
          <div v-else>
            <div class="hor-center">
              <img v-bind:src="user.headUrl" height="41" width="41"/>
            </div>
            <p class="hor-center">Hi，{{user.nickname}}</p>
            <div class="hor-center">
              <el-button class="logout" @click="logout">
                退出登录
              </el-button>
            </div>
          </div>

          <div class="hor-around icon">
            <div class="flex-col">
              <div class="hor-center">
                <img src="../imgs/home/home_xuan.png" height="32" width="38"/>
              </div>
              <p>智选认证</p>
            </div>
            <div class="flex-col">
              <div class="hor-center">
                <img src="../imgs/home/home_zheng.png" height="32" width="38"/>
              </div>
              <p>正品保证</p>
            </div>
            <div class="flex-col">
              <div class="hor-center">
                <img src="../imgs/home/home_zhuan.png" height="32" width="38"/>
              </div>
              <p>专业服务</p>
            </div>
          </div>
        </div>

        <div class="middle flex-row-col">

          <el-button>
            <div>
              <img src="../imgs/home/home_info_brand.png" height="22" width="23" />
            </div>
            <p>品牌招商</p>
          </el-button>

          <el-button>
            <div>
              <img src="../imgs/home/home_info_distribution.png" height="17" width="25"/>
            </div>
            <p>分销加盟</p>
          </el-button>

          <el-button>
            <div>
              <img src="../imgs/home/home_info_channel.png" height="25" width="21"/>
            </div>
            <p>渠道对接</p>
          </el-button>

          <el-button>
            <div>
              <img src="../imgs/home/home_info_gift.png" height="21" width="19"/>
            </div>
            <p>礼品采购</p>
          </el-button>

          <el-button>
            <div>
              <img src="../imgs/home/home_info_vip.png" height="12" width="24"/>
            </div>
            <p>会员福利</p>
          </el-button>

          <el-button>
            <div>
              <img src="../imgs/home/home_info_store.png" height="18" width="18"/>
            </div>
            <p>门店加盟</p>
          </el-button>

        </div>

        <div class="bottom">
          <el-tabs class="flex-col" v-model="activeName" >
            <el-tab-pane label="公告" name="notice">
              <div v-for="(item,index) in noticeList" :key="index">
                <router-link :to="{path:'/noticesDetail',query:{name: 'notice', id:item.id}}">【公告】{{item.title}}</router-link>
              </div>
            </el-tab-pane>
            <el-tab-pane label="促销" name="promotion">
              <div  v-for="(item,index) in promotionList" :key="index">
                <router-link :to="{path:'/noticesDetail',query:{name: 'promotion', id:item.id}}">【促销】{{item.promotionName}}</router-link>
              </div>
            </el-tab-pane>
            <el-tab-pane label="规则" name="rule"></el-tab-pane>
            <el-tab-pane label="指南" name="guide"></el-tab-pane>
          </el-tabs>

        </div>


      </div>

    </div>

    <!--market-->
    <div class="hor-center">
      <div class="market flex-row">
        <!--left-->
        <div class="left">
          <div class="top flex-col ver-center">
            <div class="stress-size second-font-color">不想备货、资金短缺、不想发货？</div>
            <div class="third-font-color">智黑全链路为您搞定了！</div>
            <div class="box">一站式的销售解决方案，轻松批发和分销</div>
          </div>
          <el-carousel>
            <el-carousel-item v-for="i in (promotionList.length%2==0?(promotionList.length/2):(parseInt(promotionList.length/2)+1))" height="277px" :key="i">
              <div class="flex-row">
                <router-link to="/">
                  <img v-bind:src="promotionList[2*(i-1)].coverImg" height="277" width="248"/>
                </router-link>
                <router-link to="/" style="margin-left:4px;">
                  <img v-if="(2*(i-1)+1<promotionList.length-1)" v-bind:src="promotionList[2*(i-1)+1].coverImg" height="277" width="248"/>
                </router-link>
              </div>


            </el-carousel-item>

          </el-carousel>
        </div>
        <!-- right-->
        <div class="right flex-row-col ver-around hor-around">
          <div class="flex-col hor-center">
            <img src="../imgs/home/home_market_logo.png" height="74" width="200"/>
            <div class="fz-font" style="font-size:2.5rem; margin-top:10px;">何为智黑“智选”<br>严格的选品标准？</div>
          </div>

          <!--line-->
          <div class="ver-center">
            <div style="width:1px; height:160px;background-color:#ffd200;"></div>
          </div>

          <div class="ver-center">
            <div class="ver-around">
              <div class="fz_font stress-size third-font-color">Choose <span class="stress-size first-font-color">品牌</span></div>
              <img src="../imgs/home/home_market_title_icon.png" height="7" width="24"/>
              <div class="fz_font">
                完整的品牌商资质<br/>自主研发能力<br/>提供优质产品的能力<br/>完备的售后体系<br/>良好的信誉
              </div>
            </div>

          </div>

          <div class="flex-col hor-center">
            <div class="ver-around">
              <div class="fz_font stress-size third-font-color">Choose <span class="stress-size first-font-color">产品</span></div>
              <img src="../imgs/home/home_market_title_icon.png" height="7" width="24"/>
              <div class="fz_font">
                产品解决用户痛点<br/>产品富有竞争力<br/>优质的产品<br/>真·智能<br/>环境友好
              </div>
            </div>
          </div>

          <div class="flex-col ver-center">
            <div class="fz_font stress-size">贵精，不贵多</div>
            <div style="width:10px; height:2px; background-color:#ffd200;margin: 8px auto;"></div>
            <div class="hor-center fz_font" style="text-align:center;">智黑inHeater专注于智能领域，智慧严选全球优质实用的智能产品<br/>从严格甄选品牌到产品专业评测，让科技服务于生活！</div>
          </div>

        </div>

      </div>
    </div>

    <!--brand -->
    <div class="hor-center" style="background-color:#f2f2f2;">
      <div class="brand flex-col hor-start">
        <div class="catalog-title">
          <el-button type="text">品牌馆</el-button>
        </div>
        <div class="content flex-row">
          <img src="../imgs/home/home_brand_title.png"/>
          <div class="flex-row-col">
            <div v-for="(item,index) in brandList" :key="item.id" style="margin-left:4px;position:relative" @mouseenter="showActive(index-1, 'isShowActive', true)" @mouseleave="showActive(index-1,'isShowActive', false)">
              <div>
                <img v-bind:src="item.logo" height="100" width="155" style=""/>
              </div>

              <div v-if="!!item.isShowActive" class="flex-col hor-ver-center hover"  >
                <div class="long-title">{{item.brandName}}</div>
                <div class="hor-center">
                  <el-button type="primary" @click="$router.push({path: '/brandDetail', query:{ brand: item.brandId }});">CHECK</el-button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--category-->
    <div class="hor-center" style="background-color:#f2f2f2;" v-for="(item,index) in categoryList" :id="item.categoryName" :key="item.categoryName" >
      <div class="category flex-col hor-start">
        <div class="catalog-title flex-row">
          <el-button type="text" @click="searchProduct(item)">{{item.categoryName}}</el-button>
          <div class="flex-row hor-end ver-center" style="flex:1;">
            <div class="fz_font">0{{index+1}}</div>
            <div class="ver-center" ><img v-bind:src="item.icon" height="17" width="13"/></div>
            <div class="fz_font">{{item.categoryEgName}}</div>
            <div class="more">
              <el-button type="text" :style="{'background-color':item.color}" @click="$router.push({path: '/productList', query:{ category: item.id }})">查看更多</el-button>
            </div>

          </div>
        </div>
        <div class="content flex-row">
          <div style="height:445px; width:247px;background-color:#ff1;">
          </div>
          <div class="flex-row-col child-category-list ">
            <template v-for="( category, index) in item.childCategoryList" v-if="index<6"  >
              <div class="flex-row ver-center hor-around child-category-item" :style="{'margin-left': (index%3!=0>0?1:0)+'%'}" :key="index">
                <el-button type="text" @click="searchProduct(item)" :style="{color:item.color}">
                  <div>{{category.categoryName}}</div>
                  <div class="fz_font info-font" >{{category.categoryEgName}}</div>
                </el-button>
                <div>
                  <img v-bind:src="category.categoryPic" width="136" height="136"/>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!--test-->
    <div class="hor-center" style="background-color:#f2f2f2;">
      <div class="test flex-col">
        <div class="flex-row catalog-title ">
          <el-button type="text" @click="$router.push({path: '/industryList', query:{name:'test'}});">评测专区</el-button>
          <div class="hor-end">
            <el-button class="stepBtn prevTests" icon="arrow-left" slot="button-prev"></el-button>
            <el-button class="stepBtn nextTests" icon="arrow-right" slot="button-next"></el-button>
          </div>
        </div>
        <div class="content flex-row hor-between">
          <!--test-swiper-->
          <swiper :options="swiperTests">
            <swiper-slide v-for="(item, index) in testList" :key="index">
              <el-card :body-style="{ padding: '0px 0px 36px 0px' }">
                <router-link :to="{path: '/noticesDetail', query:{name:'test', id: item.id }}">
                  <img v-bind:src="item.articleImg" height="180" width="295"/>
                </router-link>
                <div class="flex-col hor-center">
                  <div class="hor-center">
                    <router-link class="test-name title" :to="{path: '/noticesDetail', query:{name:'test', id: item.id }}">
                      {{item.title}}
                    </router-link>
                  </div>
                  <div class="hor-center">
                    <div class="test-profile profile-font-color title">
                      {{item.profile}}
                    </div>
                  </div>
                </div>
              </el-card>
            </swiper-slide>
          </swiper>
          <!--industry-->
          <div class="industry flex-col ver-around">
            <div class="catalog-title flex-row ver-center">
              <el-button class="catalog-title" type="text" @click="$router.push({path: '/industryList', query:{name:'industry'}});">行业资讯</el-button>
              <router-link class="hor-end" style="flex:1;" :to="{path:'industryList', query:{name:'industry'}}">更多></router-link>
            </div>

            <template v-for="(item,index) in industryList">
              <div class="flex-row hor-around" style="margin-top:10px;" :key="index">
                <router-link :to="{path: '/noticesDetail', query:{name:'industry', id: item.id }}">
                  <img v-bind:src="item.articleImg" height="34" width="64"/>
                </router-link>
                <div class="flex-col" style="width:170px;">
                  <router-link class="title info-size" :to="{path: '/noticesDetail', query:{name:'industry', id: item.id }}">{{item.title}}</router-link>
                  <div class="title profile-font-color info-size">{{item.profile}}</div>
                </div>

              </div>

            </template>

          </div>
        </div>
      </div>
    </div>
    <!--offline store-->
    <div class="hor-center">
      <div class="offline flex-col hor-start">
        <div class="catalog-title">
          <el-button type="text">线下合作门店</el-button>
        </div>
        <div class="content">
          <swiper :options="swiperOffline" >
            <!-- 这部分放你要渲染的那些内容 -->
            <swiper-slide v-for="(item, index) in storeList" :key="index">
              <img v-bind:src="item.pic" width="355" height="355"/>
              <div class="hor-around ver-center" style="width:355px;">
                <div>
                  <img v-bind:src="item.brand" height="40" width="115"/>
                </div>

                <div class="fz_font stress-size">{{item.title}}</div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
        <div class="hor-end" style="margin-top:13px;">
          <el-button class="stepBtn prevOffline" icon="arrow-left" slot="button-prev"></el-button>
          <el-button class="stepBtn nextOffline" icon="arrow-right" slot="button-next"></el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<style>
  @import "../css/index.css";
  @import "../../node_modules/swiper/dist/css/swiper.css";
</style>
<script>
  import {
    getBannerList,
    getCategoryList,
    getNoticeList,
    getPromotionList,
    getNewBrandList,
    getArticleList
  } from '../api/api';
  const COLOR = [ '#5ecfbe', '#ffdb15', '#f1bc5b', '#b8b8b8', '#e74574' ];
  const ICON = [
    require('@/imgs/home/home_1_icon.png'),
    require('@/imgs/home/home_2_icon.png'),
    require('@/imgs/home/home_3_icon.png'),
    require('@/imgs/home/home_4_icon.png'),
    require('@/imgs/home/home_5_icon.png')
  ];
  export default {
    
    data () {
      return {
        // 评测专区
        swiperTests: {
          nextButton: '.nextTests',
          prevButton: '.prevTests',
          slidesPerView: '3',
          notNextTick: true,
          spaceBetween: 15
        },
        // 线下门店
        swiperOffline: {
          nextButton: '.nextOffline',
          prevButton: '.prevOffline',
          slidesPerView: '3',
          notNextTick: true,
          spaceBetween: 15,
          autoplay: 3000
        },
        screenWidth: null,
        activeName: 'notice',
        bannerList: [],
        // 活动
        activity: [],
        // 公告
        noticeList: [],
        // 促销
        promotionList: [],
        // 品牌馆
        brandList: [],
        // 类目与二级类目
        categoryList: [],
        // 评测专区
        testList: [],
        // 行业资讯
        industryList: [],
        // 线下门店
        storeList: [],
        leftMenu: false,
        // 当前用户
        user: {
          userId: null,
          headUrl: null,
          nickname: null
        },
        currentHeight: document.body.scrollTop,
        activeLeftMenu: '#home',
        // 头条menu
        isActive: false,
      };
    },
    methods: {

      // 获取banner列表
      getBannerList: function () {
        const param = {
          status: 1,
          pageNum: 1,
          pageSize: 1000
        };
        getBannerList(param).then((res) => {
          if (res.status == 200) {
            this.$set(this, 'bannerList', res.data);
          }
        });
      },

      // 获取公告详情
      getNoticeList: function () {
        const param = {
          isIndex: true
        };
        getNoticeList(param).then((res) => {
          if (res.status == 200) {
            this.$set(this, 'noticeList', res.data);
          }
        });
      },

      // 获取促销
      getPromotionList: function () {
        const param = {
          isIndex: true
        };
        getPromotionList(param).then((res) => {
          if (res.status == 200) {
            this.$set(this, 'promotionList', res.data);
          }
        });
      },

      // 类目
      getCategoryList: function () {
        const param = {
          userType: 1
        };
        getCategoryList(param).then((res) => {
          if (res.status == 200) {
            const categoryList = res.data && res.data != '' ? res.data : [];
            // 获得一级类目
            this.categoryList = categoryList.filter((item, index) => {
              if (item.level == 1) {
                item.color = COLOR[index % 5];
                item.icon = ICON[index % 5];
                item.childCategoryList = categoryList.filter(child => child.level == 2 && child.parentId == item.id);
                return true;
              }
              return false;
            });
          }
        });
      },

      getNewBrandList: function () {
        const param = {
          num: 30
        };
        getNewBrandList(param).then((res) => {
          if (res.status == 200) {
            this.brandList = res.data && res.data != '' ? res.data : {};
          }
        });
      },
      // 评测专区
      getTestList: function () {
        const param = {
          displayArea: 1,
          status: 1,
          pageNum: 1,
          pageSize: 10000
        };
        getArticleList(param).then((res) => {
          if (res.status == 200) {
              this.testList = res.data && res.data != '' ? res.data : {};
          }
        });
      },

      // 行业资讯专区
      getIndustryList: function () {
        const param = {
          displayArea: 2,
          status: 1,
          pageNum: 1,
          pageSize: 10000
        };
        getArticleList(param).then((res) => {
          if (res.status == 200) {
            this.industryList = res.data && res.data != '' ? res.data : {};
          }
        });
      },
      getStores: function () {
        this.storeList = [
          {
            id: 1,
            pic: require('@/imgs/home/home_offline_shunpic.png'),
            brand: require('@/imgs/home/home_offline_shunicon.png'),
            title: '顺店商城'
          },
          {
            id: 2,
            pic: require('@/imgs/home/home_offline_zhipic.png'),
            brand: require('@/imgs/home/home_offline_zhiicon.png'),
            title: 'dc.space智慧生活馆'
          },
          {
            id: 3,
            pic: require('@/imgs/home/home_offline_qipic.png'),
            brand: require('@/imgs/home/home_offline_qiicon.png'),
            title: '奇客巴士'
          },
          {
            id: 3,
            pic: require('@/imgs/home/home_offline_qipic.png'),
            brand: require('@/imgs/home/home_offline_qiicon.png'),
            title: '奇客巴士'
          },
          {
            id: 4,
            pic: require('@/imgs/home/home_offline_shunpic.png'),
            brand: require('@/imgs/home/home_offline_shunicon.png'),
            title: '顺店商城'
          }
        ];
      },

      showActive: function (key, prop, value) {
        this.$set(this.brandList[key], prop, value);
      },

      logout: () => {
        sessionStorage.removeItem('user');
        // 当前用户
        this.user = {
          userId: null,
          headUrl: null,
          nickname: null
        };
      },

      searchProduct: function (category) {
        if (category.level == 1) {
          const categoryIds = [];
          category.childCategoryList.map(item => {
            categoryIds.push(item.id);
          });
          this.$set(this.$store.state.searchProduct, 'categoryIds', categoryIds);
        } else {
          this.$set(this.$store.state.searchProduct, 'categoryIds', [category.parentId]);
        }
        this.$router.push({path: '/productList'});
      },
//      currentHeightListener() {
//        this.currentHeight = document.body.scrollTop;
//        if(this.screenWidth>1284){
//          if(this.currentHeight > 904&& this.currentHeight<1383) {
//            this.isActive = true;
//            for(var i in this.categoryList){
//              this.categoryList[i].isActive = false;
//            }
//            this.leftMenu = true;
//          }else if(this.currentHeight > 1382 && this.currentHeight<1929) {
//            for(var i in this.categoryList){
//              this.categoryList[i].isActive = false;
//            }
//            this.isActive = false;
//          }else if(this.currentHeight > 1928){
//            var index = parseInt((this.currentHeight-1929)/860);
//            //目前高度超过类目数，隐藏menu
//            if(index>=this.categoryList.length){
//              this.leftMenu = false;
//              return;
//            }else{
//              for(var i in this.categoryList){
//                this.categoryList[i].isActive = false;
//              }
//              this.isActive = false;
//              this.categoryList[index].isActive = true;
//              if(this.leftMenu == false){
//                this.leftMenu = true;
//              }
//            }
//          } else {  //没有到达类目，隐藏menu
//            this.leftMenu = false;
//            for(var i in this.categoryList){
//              this.categoryList[i].isActive = false;
//              this.isActive = false;
//            }
//          }
//        }
//      },
//
//      onReSize(){
//        window.screenWidth = document.body.clientWidth;
//        this.screenWidth = window.screenWidth;
//        if(this.screenWidth<1284){
//          if(this.leftMenu === true){
//            this.leftMenu = false;
//          }
//        }else{
//          this.currentHeightListener();
//        }
//      },
    },
    created () {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (user && user.userId > 0) {
        this.$set(this, 'user', user);
      }

      // 获取导航条
      this.getBannerList();

      // 获取公告详情
      this.getNoticeList();

      // 获取促销
      this.getPromotionList();

      // 品牌馆
      this.getNewBrandList();

      // 品牌馆与类目
      this.getCategoryList();

      // 评测专区
      this.getTestList();

      // 行业资讯专区
      this.getIndustryList();

      // 线下门店
      this.getStores();
//      window.addEventListener('resize', this.onReSize)
//      window.addEventListener('scroll', this.currentHeightListener)
    },
    mounted () {
      this.screenWidth = this.$refs.index.offsetWidth;
    },

    destroyed () {
      window.removeEventListener('scroll', this.currentHeightListener);
      window.removeEventListener('resize', this.onReSize);
    },
  };
</script>


