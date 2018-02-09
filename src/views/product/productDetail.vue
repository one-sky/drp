<template>
  <div class="product-detail flex-col ver-center">
    <div class="top flex-row">
      <div class="flex-col left">
        <swiper :options="swiperOptionTop"  ref="swiperTop">
          <!-- 这部分放你要渲染的那些内容 -->
          <!-- <swiper-slide v-for="item in relativeAttrList.skuImg">
            <img v-bind:src="item" width="360" height="360"/>
          </swiper-slide>
          <swiper-slide
            v-if="productDetail.spuDetail.thumbnailImage.length>0"
            v-for="item in productDetail.spuDetail.thumbnailImage"
          >
            <img v-bind:src="item" width="360" height="360"/>
          </swiper-slide> -->
        </swiper>
        <div class="swiper-thumb flex-row">
          <swiper :options="swiperOptionThumbs" ref="swiperThumbs" >
            <!-- 这部分放你要渲染的那些内容 -->
            <!-- <swiper-slide v-for="item in relativeAttrList.skuImg">
              <img v-bind:src="item" width="50" height="50" />
            </swiper-slide>
            <swiper-slide
              v-if="productDetail.spuDetail.thumbnailImage.length>0"
              v-for="item in productDetail.spuDetail.thumbnailImage"
            >
              <img v-bind:src="item" width="50" height="50" />
            </swiper-slide> -->
          </swiper>
          <div class="swiper-button-next swiper-button-black" slot="button-next"></div>
          <div class="swiper-button-prev swiper-button-black" slot="button-prev"></div>
        </div>
      </div>
      <div class="right">
        <div class="stress-size sku-name flex-row ver-center">{{productDetail.spuDetail.productName}}</div>
        <div class="flex-row">
          <div class="price" :key="type.id">

            <!--一件代发-->
            <div v-if="!type.id">
              <span>一件代发价格：</span>
              <div style="margin-left:0;" class="price-size third-font-color"><span class="price-icon-size">¥ </span>{{relativeAttrList.onePiece|formatMoney}}</div>
            </div>
            <!--批发-->
            <div v-else-if="type.id">
              <span>采购价：</span>
              <template v-if="user.id">
                <template v-if="brandAgent.status!='Y'">
                  <div v-for="(item,index) in relativeAttrList.priceList">
                    <h1 class="price-size third-font-color"><span class="price-icon-size">¥ </span>{{item.price|formatMoney}}</h1>
                  </div>
                </template>
                <div v-else>
                  <img src="../../imgs/product/lock.png" height="20" width="16"/>
                </div>
              </template>
              <div v-else>登录后可查看</div>

            </div>
            <!--起批量-->
            <div>
              <span>起批量：</span>
              <div v-for="item in relativeAttrList.priceList">
                {{item.startPiece}}-{{item.endPiece}}件
                <div v-if="item.stock">{{`限购${item.stock}件`}}</div>
              </div>
            </div>

          </div>
          <el-button type="primary" v-model="type" @click="updatePrice" v-html="type.value+'<br>价<br>格'"></el-button>
        </div>


        <div class="attribute">
          <!--row-->
          <div>
            <h5>建议零售价：</h5>
            <div>¥ {{relativeAttrList.retailPrice|formatMoney}}</div>
            <h5>最低控价：</h5>
            <div>¥ {{relativeAttrList.minPrice|formatMoney}}</div>
          </div>
          <!--row-->
          <div>
            <h5>毛利润：</h5>
            <template v-if="user.id">
              <div v-if="brandAgent.status=='Y'">
                ¥ {{relativeAttrList.profit|formatMoney}}
              </div>
              <div v-else>
                <img class="product_detail_title_margin" src="../../imgs/product/lock.png" height="20" width="16"/>
              </div>
            </template>
            <div v-else>
              登录后可查看
            </div>
            <h5>商品规格：</h5>
            <div>件</div>
          </div>

          <!--row-->
          <div>
            <h5>发货商家：</h5>
            <p>本商品由<h6>品牌商</h6>发货并提供售后服务</p>
          </div>
          <div>
            <h5>运费：</h5>
            <p>¥{{0|formatMoney}}<h6 v-if="!shipCost">（包邮）</h6></p>
          </div>

          <!--row attributes-->
          <div v-for="(item,index) in productDetail.attributeList">
            <h5>{{item.attr}}：</h5>
            <el-checkbox-group  v-model="selectedAttr[index]" @change="checkAllow()" :max="2">
              <el-checkbox-button v-for="(a,key) in item.value" :label="a" :disabled="a.checked">{{a.name}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
          <!--row quantity-->
          <div>
            <h5>数量：</h5>
            <el-input-number v-model="buyCount" :min="1" :max="relativeAttrList.stock">
            </el-input-number>
            <div>（库存：{{relativeAttrList.stock}}件）</div>
          </div>

          <!--row brand agent-->
          <div>
            <template v-if="!brandAgent || brandAgent.status=='R'">
              <el-button type="text" class="agent hor-ver-center" @click="handleAgentBrand">
                <img src="../../imgs/brand/agent.png" height="11" width="11"/>申请代理
              </el-button>
            </template>
            <div class="agented hor-ver-center" v-else>
              {{brandAgent.status|formateStatusDesc(brandAgent.status)}}
            </div>
            <div>
              <el-button type="text" @click="addCollectionProduct" v-if="!collected">
                <img src="../../imgs/product/collect.png" height="11" width="12"/>加入收藏
              </el-button>
              <el-button type="text" @click="cancelAttentionProduct" v-else>
                <img src="../../imgs/product/collect.png" height="11" width="12"/>取消收藏
              </el-button>
            </div>
            <el-button type="text">
              <img src="../../imgs/product/download.png" height="10" width="8"/>下载商品资料包
            </el-button>
          </div>

          <!--row-->
          <div>
            <h5>发货时间：</h5>
            <p>48小时内发货（<h6>节假日不发货</h6>）</p>
          </div>

          <!--row-->
          <div>
            <h5>支付方式：</h5>
            <p>支付宝</p>
            <div class="seperate">|</div>
            <p>微信</p>
          </div>

          <div>
            <h5>运费说明：</h5>
            <p>订单运费根据商品重量与收货地址，以及选择的快递公司进行计算</p>
          </div>
        </div>

        <!--addShoppingCartBtn-->
        <!--选择好所有相关属性可点击, 未登录跳转login-->
        <div class="flex-row hor-center">
          <el-button
            class="add"
            type="primary"
            @click="addToShoppingCart"
            :disabled="(relativeAttrList.stock<1 || !(selectedAttr.length === productDetail.attributeList.length))||(type.id && !(brandAgent && brandAgent.status=='Y'))"
          >
              加入进货单
          </el-button>
        </div>


      </div>

    </div>


    <!--content-->
    <div class="middle flex-row">
      <el-tabs class="left" type="border-card">
        <el-tab-pane label="商品图文详情">
          <div class="attribute">
            <div v-for="item in productDetail.skuDetailList">
              <div>商品编码 ： 123456</div>
              <div>品牌 ： {{productDetail.spuDetail.brandName}}</div>
              <div>货号 ： 1234</div>
              <div>单位 ： 件</div>
            </div>
          </div>
          <template v-for="item in productDetail.spuDetail.thumbnailImage">
            <img :src="item" width="802"/>
          </template>
          <template v-for="item in productDetail.skuImgList">
            <img :src="item" width="802"/>
          </template>
        </el-tab-pane>
        <el-tab-pane label="商品评测">
          <div v-for="item in productDetail.productArticleList" v-html="item.content"></div>
        </el-tab-pane>
      </el-tabs>
      <div class="right flex-col ver-center">
        <el-tabs type="border-card" v-model="rightTab" @tab-click="handleClickTab">
          <el-tab-pane label="最近浏览" name="3"></el-tab-pane>
          <el-tab-pane label="商品推荐" name="1"></el-tab-pane>
        </el-tabs>
        <!--product-->
        <div class="product" v-for="(item, index) in specialList">
          <router-link :to="{path: '/productDetail', query:{ product: item.spuId }}" @click.native="load">
            <img v-bind:src="item.spuImg" height="250" width="250"/>
          </router-link>
          <router-link class="long-title" :to="{path: '/productDetail', query:{ product: item.spuId }}" @click.native="load"  >
            {{item.productName}}
          </router-link>
          <div class="third-font-color price-size">
            <span class="price-icon-size">¥</span>{{item.price|formatMoney}}
          </div>
          <div class="seperate" v-if="index<specialList.length-1"></div>
        </div>

      </div>

    </div>

    <!--bottom-->
    <div class="bottom">
      <h1 class="stress-size">相关产品</h1>
      <div class="seperate"></div>
      <div class="flex-row">
        <div class="product" v-for="(item,index) in relativeList" :style="{'margin-left':(index>0?30:0)+'px'}" >
          <router-link :to="{path: '/productDetail', query:{ product: item.spuId }}" @click.native="load">
            <img v-bind:src="item.spuImg" height="216" width="216"/>
          </router-link>
          <router-link class="long-title" :to="{path: '/productDetail', query:{ product: item.spuId }}" @click.native="load">
            {{item.productName}}
          </router-link>
          <div class="third-font-color price-size">
            <span class="price-icon-size">¥</span>{{item.price|formatMoney}}
          </div>
        </div>
      </div>



    </div>

    <el-dialog title="申请代理" :visible.sync="storeDialog" @open="getChannelList()" @close="resetDialog('storeForm')">
      <el-form :model="dialogStoreData" ref="storeForm" class="detail_shop_form">
        <el-form-item class="add_input add_select" style="margin-left:10px; margin-top:-10px;" prop="channelId" >
          <div class="ub" style="font-size:13px;">
            <div style="width:90px;">
              分销渠道：
            </div>
            <div class="ub">
              <el-select class="channel_select" v-model="dialogStoreData.channelId" >
                <el-option v-for="channel in channelList" :key="channel.id" :label="channel.channelName" :value="channel.id"></el-option>
              </el-select>
            </div>
            <div style="padding-top:4px;">
              <span style="color:red;margin-left:5px;">*</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px;margin-bottom:10px;">
        <el-button @click="storeDialog = false">取 消</el-button>
        <el-button type="primary"  @click="insertDAgentBrand('storeForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
  @import "../../css/product.css";
  @import "../../../node_modules/swiper/dist/css/swiper.css";
</style>

<script>
  import {
    getSpuDetail,
    getProductSpecialList,
    addToShoppingCart
  } from '../../api/api.js';

  import {
    GetChannelList,
    GetAgentBrand,
    InsertAgentBrand,
    GetCollectionProductList,
    AddCollectionProduct,
    CancelCollectionProduct
  } from '../../js/distributor';
  export default {
    data () {
      return {
        user: {},
        swiperOptionTop: {
          notNextTick: true,
          spaceBetween: 30,
        },
        swiperOptionThumbs: {
          notNextTick: true,
          spaceBetween: 10,
          centeredSlides: true,
          slidesPerView: 'auto',
          touchRatio: 0.2,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          slideToClickedSlide: true
        },

        productDetail: {
          spuDetail: {}, // spu详情
          attributeList: [], // 属性列表
          skuDetailList: [], // sku列表
          productArticleList: [], // 评测
          skuImgList: [] // 所有sku的img
        },
        specialList: [], // 最近浏览列表、推荐列表
        relativeList: [], // 相关商品列表
        selectedAttr: [],  // 监听当前选择项

        // right_tab data
        rightTab: '3',

        // 随着sku变化的属性
        relativeAttrList: {},
        // 商品图文详情
        detailPic: [],

        // 申请代理
        dialogStoreData: {
          channelId: null
        },
        storeDialog: false,

        channelList: [],
        brandAgent: {},

        // 收藏
        collected: false,

        type: {id: false, value: '批<br>发'}, // 查看价格按钮

        // 购买数量
        buyCount: 1,
        shipCost: 0,
        loading: false,
      };
    },
    methods: {
      load: function () {
        window.location.reload();
      },

       // tab--最近浏览,推荐
      handleClickTab: function (tab) {
        // 最近浏览
        // let param = {
        //   spuId: this.$route.query.product,
        //   distributorId: this.user.distributorId,
        //   type: this.rightTab,
        //   page: 1,
        //   pageSize: 5
        // };
        // getProductSpecialList(param).then((res) => {
        //   if (res.status == 200) {
        //     this.specialList = res.data;
        //   }
        // });
      },

      // 申请代理
      insertAgentBrand: function () {
        InsertAgentBrand(
          this.brandAgent.id,
          this.channelId,
          (result) => {
            if (result) {
              this.storeDialog = false;
              this.getAgentBrand();
            }
          }
        );
      },

      // 点击申请代理
      handleAgentBrand: function () {
        if (!this.user.userId || this.user.userId == '') {
          this.$router.push({ path: '/login' });
        } else {
          this.storeDialog = true;
        }
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
      cancelCollectionProduct: function () {
        CancelCollectionProduct([this.productDetail.spuDetail.productId], (res) => {
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

      getSpuDetail: function () {
        this.loading = true;
        const param = {
          spuId: this.$route.query.product,
          distributorId: this.user.id || null,
        };
        getSpuDetail(param).then((res) => {
          if (res.status == 200) {
            this.selectedAttr = [];
            this.buyCount = 1;
            const productDetail = res.data;
            productDetail.spuSearchVO.thumbnailImage = productDetail.spuSearchVO.thumbnailImage && productDetail.spuSearchVO.thumbnailImage.split('；');
            this.$set(this.productDetail, 'spuDetail', productDetail.spuSearchVO);
            this.$set(this.productDetail, 'productArticleList', productDetail.pProductArticleEntity);
            const skuImgList = [];
            productDetail.skuDetailList.map(item => {
              const sku = item.priceList[0];
              skuImgList.push(sku.skuImg && sku.skuImg.split('；'));

              // 设置价格优先度
              item.priceList.map(price => {
                if (price.special == 'Y') {
                  price.priority = 3;
                } else if (item.promotionId) {
                  price.priority = 2;
                } else {
                  price.priority = 1;
                }
              });
            });
            this.$set(this.productDetail, 'skuDetailList', productDetail.skuDetailList);
            this.$set(this.productDetail, 'skuImgList', skuImgList);

            // 设置属性列表
            const attributes = res.data.spuSearchVO.spuAttr;
            const attributeList = [];
            attributes && attributes.split('；').map(item => {
              this.selectedAttr.push([]);
              const attr = item.split('：')[0];
              const value = item.split('：')[1].split('、');
              const attrList = [];
              value.map(item => {
                attrList.push({
                  name: item
                });
              });
              attributeList.push({
                attr,
                value: attrList
              });
            });
            this.$set(this.productDetail, 'attributeList', attributeList);
            this.handleClickTab();
            this.getRelativeProduct();
            this.getBasicAttributes();
            this.loading = false;
          }
        });
      },

      // 获取获取响应组合的价格
      getBasicAttributes: function () {
        // 标记当前需要的sku
        let currSkuPriceList;
        // 根据用户是否登录判断显示的属性
        // 选全
        if (this.selectedAttr.length === this.productDetail.attributeList.length) {
          const currSku = this.productDetail.skuDetailList.find((item) => {
            const sku = item.priceList[0];
            const attrList = sku.skuAttr.split('；');
            let flag = true;
            attrList.map((attr, index) => {
              flag = (attr.split('：')[1] == this.selectedAttr[index]);
            });
            return flag;
          });
          this.$set(this.relativeAttrList, 'skuImg', currSku.skuImg.split['；']);
          this.$refs.swiperTop.swiper.slideTo(0, 1000, false);
          currSkuPriceList = [...currSku.priceList];
        } else {
          // 显示所有skuImg
          this.$set(this.relativeAttrList, 'skuImg', this.productDetail.skuImgList);
          currSkuPriceList = this.productDetail.skuDetailList[0].priceList;
        }
        let priceList = [];
        // 价格与起批量 接口返回的数据顺序特殊价格、促销价格、普通价格
        // 前端重新排序成起批量asc && （特殊、促销、普通）参照获取spuDetail时所设置的优先度
        currSkuPriceList.sort((a, b) => {
          if (a.startPiece == b.startPiece) {
            return b.priority > a.priority;
          }
          return a.startPiece - b.startPiece;
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
                  console.log(i)
                    
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
                  stock: currSkuPriceList[i].priority > 1 && currSkuPriceList[i].stock || 0
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
          stock: currSkuPriceList[currSkuPriceList.length - 1].priority > 1 && currSkuPriceList[currSkuPriceList.length - 1].stock || 0
        });
        // 设置一件代发价格
        const onePiece = currSkuPriceList.find(item => {
          return item.startPiece == 1;
        });
        const sku = currSkuPriceList.find(item => {
            return !item.special && !item.promotionId;
        });
        this.$set(this.relativeAttrList, 'onePiece', onePiece.price);
        this.$set(this.relativeAttrList, 'priceList', priceList);
        this.$set(this.relativeAttrList, 'retailPrice', sku.retailPrice);
        this.$set(this.relativeAttrList, 'minPrice', sku.minPrice);
        this.$set(this.relativeAttrList, 'profit', sku.retailPrice - sku.minPrice);
        this.$set(this.relativeAttrList, 'stock', sku.stock);
      },
      // 相关商品
      getRelativeProduct: function () {
        // 最近浏览
        // let param = {
        //   spuId: this.$route.query.product,
        //   distributorId: this.user.distributorId,
        //   type: 2,
        //   vendorId: this.user.vendorId,
        //   page: 1,
        //   pageSize: 5
        // };
        // getProductSpecialList(param).then((res) => {
        //   if (res.status == 200) {
        //     this.relativeList = res.data;
        //   }
        // });
      },

      // 获取代理品牌
      getAgentBrand: function () {
        GetAgentBrand(
          this.productDetail.spuDetail.brandId,
          (brand) => {
            this.$set(this, 'brandAgent', brand);
          }
        );
      },
      
      // 获取分销商已代理渠道
      getChannelList: function () {
        GetChannelList((channelList) => this.$set(this, 'channelList', channelList));
      },

      // 收藏列表
      getCollectionProductList: function () {
        GetCollectionProductList(1, 10000, (res) => {
          if (res.data) {
              const collectionList = res.data;
              const spuId = this.productDetail.spuId;
              this.collected = !!collectionList.find(item => {
                return item.spuId == spuId;
              });
            } else {
              this.collected = false;
            }
        });
      },

      // 查看一代代发或批发按钮
      updatePrice: function () {
        if (!this.type.id) {
          this.type.id = true;
          this.type.value = '一<br>件<br>代<br>发';
        } else {
          this.type.id = false;
          this.type.value = '批<br>发';
        }
      },

      resetDialog: function (formName) {
        this.channelId = '';
        this.$refs[formName].resetFields();
      },

      // 规格变动，选择可选选项
      checkAllow: function () {
        // 每次修改选择项，初始化已选个数
        this.buyCount = 1;
        this.selectedAttr.map(item => {
          if (item.length > 1) {
              item.shift();
          }
          return true;
        });
        for (var i in this.selectedAttr) {
          if (this.selectedAttr[i] && this.selectedAttr[i] != '') {
            // 若该属性组选了两个，移除第一个选中项
            if (this.selectedAttr[i].length > 1) {
            }
          }
        }
        if (this.selectedAttr.length > 0) {
          for (var k in this.attributeList) {
            for (var p in this.attributeList[k].attributes) {
              this.attributeList[k].attributes[p].checked = true;
            }
          }
          for (let p in this.size) {
            // 去掉size中的空项
            if (this.size[p] && this.size[p] != '') {
              for (let i in this.productDetail.skuDetailList) {
                // 查找到含有该属性的sku
                if (this.productDetail.skuDetailList[i].attributes[p].optionNameCn == this.size[p][0].optionNameCn) {
                  // 将第i+1个sku的属性全部设为可选
                  for (let j in this.productDetail.skuDetailList[i].attributes) {
                    for (let k in this.attributeList[j].attributes) {
                      if (this.attributeList[j].attributes[k].optionNameCn ==
                        this.productDetail.skuDetailList[i].attributes[j].optionNameCn) {
                        this.attributeList[j].attributes[k].checked = false;
                      }
                    }
                  }
                }
              }
            }
          }
        } else if (this.checkCount == 0) {
          for (let k in this.attributeList) {
            for (let p in this.attributeList[k].attributes) {
              this.attributeList[k].attributes[p].checked = false;
            }
          }
        }
        this.getBasicAttributes();
      },

      // 加入购物车
      addToShoppingCart: function () {
        !this.user.id && this.$router.push({path: '/login'});
        const param = {
          distributorId: 1,
          userId: 1,
          quantity: this.buyCount,
          isAgent: this.brandAgent.status == 'Y'
        };
        addToShoppingCart(param).then((res) => {
          if (res.status == 200) {
            this.$message({
              message: '加入进货单成功',
              type: 'success'
            });
          }
        });
      }
    },
    created () {
      if (!this.$route.query.product || this.$route.query.product == '') {
        this.$router.push({ path: '/productList' });
        return;
      }
      this.$set(this.productDetail, 'spuId', parseInt(this.$route.query.product));
      let user = JSON.parse(sessionStorage.getItem('user'));
      // 已登陆用户调用代理
      if (user) {
        this.getCollectionProductList();
      } else {
        user = {
          id: null
        };
      }
      this.$set(this, 'user', user);
      this.getSpuDetail();
      this.getRelativeProduct();
    },
    mounted () {
      const swiperTop = this.$refs.swiperTop.swiper;
      const swiperThumbs = this.$refs.swiperThumbs.swiper;
      this.$set(swiperTop.params, 'control', swiperThumbs);
      this.$set(swiperThumbs.params, 'control', swiperTop);
    },

    filters: {
      formatProdUnit (val) {
        // 商品单位
        var prodUnit = ['件', '箱', '盒', '包', '个', '套', '把', '台', '块', '条', '支', '对', '只'];
        return (!val || val == '') ? prodUnit[0] : prodUnit[parseInt(val) - 1];
      },
      formateStatusDesc: (status) => {
        if (!status || status == 'R') {
            return '申请代理';
        } else if (status == 'W') {
          return '等待审核';
        } else {
          return '已代理';
        }
      }
    }
  };
</script>
