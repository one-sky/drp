<template>
  <div class="product-detail flex-col ver-center">
    <div class="top flex-row">
      <div class="flex-col left">
        <swiper :options="swiperOptionTop"  ref="swiperTop">
          <!-- 这部分放你要渲染的那些内容 -->
          <swiper-slide v-if="(!attributeList||attributeList==''||checkCount>=attributeList.length)" v-for="item in otherAttributeList.skuImg">
            <img v-bind:src="item.imageUrl" width="360" height="360"/>
          </swiper-slide>
          <swiper-slide v-else v-for="item in swiperPic"><img v-bind:src="item.imageUrl" width="360" height="360"/>
          </swiper-slide>
          <swiper-slide v-for="item in productDetail.productImg"><img v-bind:src="item.imageUrl" width="360" height="360"/>
          </swiper-slide>
        </swiper>
        <div class="swiper-thumb flex-row">
          <swiper :options="swiperOptionThumbs" ref="swiperThumbs" >
            <!-- 这部分放你要渲染的那些内容 -->
            <swiper-slide v-if="(!attributeList||attributeList==''||checkCount>=attributeList.length)" v-for="item in otherAttributeList.skuImg">
              <img v-bind:src="item.imageUrl" width="50" height="50" />
            </swiper-slide>
            <swiper-slide v-else v-for="item in swiperPic"><img v-bind:src="item.imageUrl" width="50" height="50" />
            </swiper-slide>
            <swiper-slide v-for="item in productDetail.productImg"><img v-bind:src="item.imageUrl" width="50" height="50" />
            </swiper-slide>
          </swiper>
          <div class="swiper-button-next swiper-button-black" slot="button-next"></div>
          <div class="swiper-button-prev swiper-button-black" slot="button-prev"></div>
        </div>
      </div>
      <div class="right">
        <div class="stress-size sku-name flex-row ver-center">{{otherAttributeList.skuName}}</div>
        <div class="flex-row">
          <div class="price" :key="type.id">

            <!--一件代发-->
            <div v-if="!type.id">
              <span>一件代发价格：</span>
              <div style="margin-left:0;" class="price-size third-font-color"><span class="price-icon-size">¥ </span>{{otherAttributeList.priceOne|formatMoney}}</div>
            </div>
            <!--批发-->
            <div v-else-if="type.id">
              <span>采购价：</span>
              <template v-if="user.userId&&user.userId!=''">
                <template v-if="status.status!='Y'">
                  <div v-for="(item,index) in otherAttributeList.truePricePiece">
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
              <div v-for="item in otherAttributeList.truePricePiece">
                {{item.startPiece}}-{{item.endPiece}}件
              </div>
            </div>

          </div>
          <el-button type="primary" v-model="type" @click="updatePrice" v-html="type.value+'<br>价<br>格'"></el-button>
        </div>


        <div class="attribute">
          <!--row-->
          <div>
            <h5>建议零售价：</h5>
            <div>¥ {{otherAttributeList.retailPrice|formatMoney}}</div>
            <h5>最低控价：</h5>
            <div>¥ {{otherAttributeList.minPrice|formatMoney}}</div>
          </div>
          <!--row-->
          <div>
            <h5>毛利润：</h5>
            <template v-if="user.userId&&user.userId!=''">
              <div v-if="status.status=='Y'">
                ¥ {{otherAttributeList.profit|formatMoney}}
              </div>
              <div v-else>
                <img class="product_detail_title_margin" src="../../imgs/product/lock.png" height="20" width="16"/>
              </div>
            </template>
            <div v-else>
              登录后可查看
            </div>
            <h5>商品规格：</h5>
            <div>{{otherAttributeList.cartonUnit}}</div>
          </div>

          <!--row-->
          <div>
            <h5>发货商家：</h5>
            <p>本商品由<h6>品牌商</h6>发货并提供售后服务</p>
          </div>

          <!--row shipping-->
          <div class="ub" style="margin-top:20px;">
            <h5>物流：</h5>
            <el-cascader :options="areaList" popper-class="area_popper" :props="{value:'index' ,label:'regionName',children:'cities'}"
                         @change="calculateShippingCost" @active-item-change="handleChooseProvince">

            </el-cascader>
            <div class="seperate">|</div>
            <div>运费：¥{{shipCost|formatMoney}}</div>
            <div v-if="shipCost==0">（包邮）</div>
          </div>

          <!--row attributes-->
          <div v-for="(item,index) in attributeList">
            <h5>{{item.attributeName}}：</h5>
            <el-checkbox-group  v-model="size[index]" @change="checkAllow()" :max="2">
              <el-checkbox-button v-for="(a,key) in item.attributes" :label="a" :disabled="a.checked">{{a.optionNameCn}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
          <!--row quantity-->
          <div>
            <h5>数量：</h5>
            <el-input-number v-model="buyCount" @change="calculateShippingCost" :min="1" :max="otherAttributeList.stock">
            </el-input-number>
            <div>（库存：{{otherAttributeList.stock}}{{otherAttributeList.prodUnit|formatProdUnit}}）</div>
          </div>

          <!--row brand agent-->
          <div>
            <template v-if="!status.status||status.status==''||status.status=='R'">
              <el-button type="text" class="agent" @click="openAgent">
                <img src="../../imgs/brand/agent.png" height="11" width="11"/>申请代理
              </el-button>
            </template>
            <div class="agented" v-else>
              {{status.statusDesc}}
            </div>
            <div>
              <el-button type="text" @click="addCollectionProduct" v-if="!isCollection">
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
          <el-button class="add" type="primary" @click="addToShoppingCart" :disabled="(otherAttributeList.stock<1||!(checkCount>=attributeList.length))||(type.id==true&&!(status.status&&status.status=='Y'))">加入进货单</el-button>
        </div>


      </div>

    </div>


    <!--content-->
    <div class="middle flex-row">
      <el-tabs class="left" type="border-card">
        <el-tab-pane label="商品图文详情">
          <div class="attribute">
            <div v-for="item in this.productDetail.skuDetailList">
              <div>商品编码 ： {{item.skuCode}}</div>
              <div>品牌 ： {{productDetail.brandName}}</div>
              <div>货号 ： {{item.mftProdCode}}</div>
              <div>单位 ： {{item.prodUnit|formatProdUnit}}</div>
            </div>
          </div>
          <template v-for="item in detailPic">
            <img :src="item.imageUrl" width="802"/>
          </template>
        </el-tab-pane>
        <el-tab-pane label="商品评测">
          <div v-for="item in productArticleList" v-html="item.content"></div>
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

    <el-dialog title="申请代理" :visible.sync="storeDialog" @open="getChannelOption()" @close="resetDialog('storeForm')">
      <el-form :model="dialogStoreData" :rules="dialog_rules" ref="storeForm" class="detail_shop_form">
        <el-form-item class="add_input add_select" style="margin-left:10px; margin-top:-10px;" prop="channelId" >
          <div class="ub" style="font-size:13px;">
            <div style="width:90px;">
              分销渠道：
            </div>
            <div class="ub">
              <el-select class="channel_select" v-model="dialogStoreData.channelId" >
                <el-option v-for="channel in channelOption" :key="channel.id" :label="channel.channelName" :value="channel.id"></el-option>
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

  import { getProductDetail, getProductSpecialList, getDAgentBrand,getBrandByBrandId, insertDAgentBrand, addCollectionProduct, getCollectionProduct, cancelAttentionProduct, getChannelOption, getProvinceList, getCityListByProvince, calculateShippingCost, addToShoppingCart} from "../../api/api.js";
  export default {
    data() {
      return {
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
        user:{
        },
        productDetail:{},
        specialList:[],//最近浏览列表、推荐列表
        relativeList:[],//相关商品列表
        productArticleList: [],//评测
        attributeList:[],   //存放规格等选项
        size:[],  //监听当前选择项

        checkCount:0, //当前选中项属性种类数
        //right_tab data
        rightTab:'3',

        otherAttributeList:{},

        //轮播图
        swiperPic: new Array(),
        //商品图文详情
        detailPic:new Array(),

        //申请代理
        dialogStoreData:{
          channelId:null
        },
        storeDialog: false,

        dialog_rules: {
          channelId: [
            {type: "number", required: true, message:'请选择分销渠道', trigger: 'change'}
          ]
        },
        channelOption: [{
          id: null,
          channelName: null
        }],
        status:{  //代理状态
          status:null,
          statusDesc:null
        },

        //收藏
        isCollection:false,

        type: {id:false,value:'批<br>发'}, //查看价格按钮

        buyCount:1,

        //area
        areaList:[], //选择地区列表
        shipCost:0,
        area:[],
        loading:false,




      }
    },
    methods:{
      load(){
        window.location.reload();
      },
      getProductDetail(){
        this.loading = true;
        let param ={
          vendorId:this.user.vendorId,
          spuId: this.$route.query.product,
          distributorId: this.user.distributorId,
          userId: this.user.userId
        };
        getProductDetail(param).then((res) => {
          if(res.status ==200) {
            this.checkCount=0;
            this.buyCount=1;
            this.productDetail = res.data;
            this.productDetail.skuDetailList[0].attributes.push({attributeId:111, attributeName:'规格',attributeValueId: 123,optionNameCn: '小'});
            this.productDetail.skuDetailList[1].attributes.push({attributeId:111, attributeName:'规格',attributeValueId: 124,optionNameCn: '中'});
            var productArticleList = res.data.productArticleList;
            //设置评测顺序与是否显示
            for(var i in productArticleList){
              if(productArticleList[i].status ==1){
                this.productArticleList.push(productArticleList[i]);
              }
            }
            if(this.productArticleList&&this.productArticleList.length>1) {
              this.productArticleList.sort(function (a, b) {
                return a.sortBy > b.sortBy
              });
            }
            console.log(this.productArticleList)
            if(this.productDetail.skuDetailList.length>0){
              //i-row   j-col
              for(var i in this.productDetail.skuDetailList){
                for(var j in this.productDetail.skuDetailList[i].attributes){
                  if(i==0){
                    //建立属性分组的分组类名 attributeList    el-checkbox的size个数
                    var attribute ={attributeName:this.productDetail.skuDetailList[i].attributes[j].attributeName,attributes:new Array()};
                    this.attributeList.push(attribute);
                    this.size.push(new Array());
                  }
                  var flag = false;
                  //过滤属性名重复项
                  for(var k in this.attributeList[j].attributes){
                    if(this.attributeList[j].attributes[k].optionNameCn==this.productDetail.skuDetailList[i].attributes[j].optionNameCn){
                      flag =true;
                    }
                  }
                  //未重复项放入attributeList
                  if( !flag){
                    var array=Object.assign({}, this.productDetail.skuDetailList[i].attributes[j],{checked:false});
                    this.attributeList[j].attributes.push(array);
                  }

                }

                //抽取轮播图图片、图文详情图片
                for(var p in this.productDetail.skuDetailList[i].skuImgs){
                  if(this.productDetail.skuDetailList[i].skuImgs[p].imageType=='B'){
                    for(var z in this.productDetail.skuDetailList[i].skuImgs[p].imgList){
                      this.swiperPic.push(this.productDetail.skuDetailList[i].skuImgs[p].imgList[z]);
                    }
                  }else if(this.productDetail.skuDetailList[i].skuImgs[p].imageType=='A'||this.productDetail.skuDetailList[i].skuImgs[p].imageType=='O'){
                    for(var z in this.productDetail.skuDetailList[i].skuImgs[p].imgList){
                      this.detailPic.push(this.productDetail.skuDetailList[i].skuImgs[p].imgList[z]);
                    }

                  }
                }

                //主SKU的参数图放入图文详情图片
                if(this.productDetail.skuDetailList[i].isDefault=='Y'){
                  for(var s in this.productDetail.skuDetailList[i].skuImgs){
                    if(this.productDetail.skuDetailList[i].skuImgs[s].imageType=='G'){
                      for(var z in this.productDetail.skuDetailList[i].skuImgs[s].imgList){
                        this.detailPic.push(this.productDetail.skuDetailList[i].skuImgs[s].imgList[z]);
                      }
                    }
                  }
                }

              }



            }
            //已登陆用户调用代理
            if(this.user.userId&&this.user.userId!='') {
             // this.getBrandByBrandId();
              this.getCollectionProduct();
            }
            this.getProvince();
            this.handleClickTab();
            this.getRelativeProduct();
            this.getBasicAttributes();
            this.loading = false;


          }
        })
      },

      //tab--最近浏览,推荐
      handleClickTab(tab) {
        //最近浏览
        let param = {
          spuId:this.$route.query.product,
          distributorId:this.user.distributorId,
          type:this.rightTab,
          vendorId:this.user.vendorId,
          page:1,
          pageSize:5
        };
        getProductSpecialList(param).then((res) => {
          if (res.status == 200) {
            this.specialList = res.data;
          }
        });
      },

      //相关商品
      getRelativeProduct() {
        //最近浏览
        let param = {
          spuId:this.$route.query.product,
          distributorId:this.user.distributorId,
          type:2,
          vendorId:this.user.vendorId,
          page:1,
          pageSize:5
        };
        getProductSpecialList(param).then((res) => {
          if (res.status == 200) {
            this.relativeList = res.data;
          }
        });
      },

      // 获取品牌详情(增加一个根据erpBrandId查询)
      getBrandByBrandId(){
        let param = {
          erpBrandId: this.productDetail.brandId,
          vendorId: this.user.vendorId
        };
        getBrandByBrandId(param).then((res) => {
          if (res.status == 200) {
            this.$set(this.productDetail,'trueBrandId',res.data.id);
            this.getDAgentBrand();
          }



        });
      },


      // 获取代理品牌
      getDAgentBrand:function() {
        let param = {
          vendorId: this.user.vendorId,
          distributorId: this.user.distributorId,
          erpBrandId: this.productDetail.brandId
        };
        getDAgentBrand(param).then((res) => {
          if (res.status == 200) {
            if (res.data == null) {
              this.$set(this.status,'status',null);
              this.status.statusDesc = "申请代理";
            } else if (res.data.status == "R") {
              this.$set(this.status,'status','R');
              this.status.statusDesc = "申请代理";
            } else if (res.data.status == "W") {
              this.$set(this.status,'status','W');
              this.status.statusDesc = "等待审核";
            } else if (res.data.status == "Y") {
              this.$set(this.status,'status','Y');
              this.status.statusDesc = "已代理";
            }
          }

        })
      },

      // 申请代理
      insertDAgentBrand(formName){
        this.$refs[formName].validate((valid) =>{
          let param = {
            brandId: this.productDetail.trueBrandId,
            distributorId: this.user.distributorId,
            channelId:this.dialogStoreData.channelId
          };
          insertDAgentBrand(param).then((res) => {
            if (res.status == 200) {
              this.storeDialog=false;
              this.getDAgentBrand();
            }

          });
        });

      },

      // 点击申请代理
      openAgent() {
        if(!this.user.userId || this.user.userId==''){
          $router.push({ path: '/login' });
        }else{
          this.storeDialog = true;
        }
      },

      // 获取渠道列表
      getChannelOption() {
        let param = {};
        this.channelOption = new Array();
        getChannelOption(param).then((res) => {
          if(res.status ==200) {
            var channelOption = res.data;
            for(var i in channelOption){
              if(channelOption[i].status==1){
                this.channelOption.push(channelOption[i]);
              }
            }
            this.getBrandByBrandId();
          }
        });
      },

      // 是否加入收藏
      getCollectionProduct:function() {
        let param = {
          distributorId: this.user.distributorId,
          productId: this.$route.query.product
        };
        getCollectionProduct(param).then((res) => {
          if (res.status == 200) {
            if(!res.data || res.data == ''){
              this.isCollection = false;
            }else{
              this.isCollection = true;
            }
          }
        })

      },

      // 加入收藏
      addCollectionProduct:function(){
        if(!this.user.userId||this.user.userId==''){
          this.$router.push({path:'/login'});
        }else{
          if(!this.isCollection){
            //查找主sku 收藏时价格为主sku的一件代发价
            var defaultSkuId = null;
            var defaultSkuCode = null;
            var price = null;
            for(var j in this.productDetail.skuDetailList){
              var sku =this.productDetail.skuDetailList[j];
              if(sku.isDefault == "Y"){
                for(var k in sku.priceList){
                  var skuPrice = sku.priceList[k];
                  if(skuPrice.levelId == this.user.vipId && skuPrice.startPiece== 1 && skuPrice.endPiece ==1 ){//登录未代理，显示的是一件代发价(需要根据会员id确定)
                    price =  skuPrice.price; //一件代发的价格
                  }
                }
                defaultSkuId = sku.productBaseId;
                defaultSkuCode = sku.skuCode;

              }
            }
            let param={
              distributorId: this.user.distributorId,
              productId: this.productDetail.productId,
              defaultSkuId:defaultSkuId,
              defaultSkuCode: defaultSkuCode,
              price: price
            };
            addCollectionProduct(param).then((res) => {
              if(res.status == 200){
                this.$message({
                  message: '收藏成功',
                  type: 'success'
                });
                this.getCollectionProduct();
              }
            })

          }
        }

      },

      // 取消收藏
      cancelAttentionProduct:function(){
        let param = {
          distributorId: this.user.distributorId,
          productId: this.productDetail.productId
        };
        cancelAttentionProduct(param).then((res)=>{
          if(res.status == 200){
            this.$message({
              message: '取消收藏成功',
              type: 'success'
            });
            this.getCollectionProduct();
          }
        })

      },

      // 获取获取响应组合的价格或主SKU价格等
      getBasicAttributes(){

        // 标记当前需要的sku
        var currSku;
        /*根据是否选全选项显示主Sku还是
         *根据用户是否登录判断显示的属性*/
        // 选全
        if(this.checkCount >= this.attributeList.length) {
          for (var i in this.productDetail.skuDetailList) {
            var flag = true;
            for (var j in this.productDetail.skuDetailList[i].attributes) {
              if (this.productDetail.skuDetailList[i].attributes[j].optionNameCn != this.size[j][0].optionNameCn) {
                // 有一个属性不相同
                flag = false;
                break;
              }
            }
            if (flag == true) {
              currSku = i;
              break;
            }
          }
          this.$refs.swiperTop.swiper.slideTo(0, 1000, false);
        }else{
          // 一个都没选
          if(this.checkCount == 0){
            this.$refs.swiperTop.swiper.slideTo(0, 1000, false);
          }
          for (var i in this.productDetail.skuDetailList) {
            if (this.productDetail.skuDetailList[i].isDefault == 'Y') {
              currSku = i;
              break;
            }
          }
        }
        // type.id==true 批发
        if(this.type.id) {
          // 价格与起批量
          this.$set(this.otherAttributeList,'pricePiece',[]);
          this.$set(this.otherAttributeList,'truePricePiece', new Array());
          this.productDetail.skuDetailList[0].priceList = new Array();
          this.productDetail.skuDetailList[0].priceList.push({startPiece: 1, endPiece: 10, price: 10, levelId: 1});
          this.productDetail.skuDetailList[0].priceList.push({startPiece: 11, endPiece: 100, price: 100, levelId: 1});
          this.productDetail.skuDetailList[0].priceList.push({startPiece: 101, endPiece: 1000, price: 1000, levelId: 1});
          for (var j in this.productDetail.skuDetailList[i].priceList){
            if(this.productDetail.skuDetailList[i].priceList[j].levelId == this.user.vipId){
              if(this.productDetail.skuDetailList[i].priceList[j].startPiece==1 &&
                this.productDetail.skuDetailList[i].priceList[j].endPiece==1){

              }else{
                //设置批发价格
                this.otherAttributeList.pricePiece.push(this.productDetail.skuDetailList[i].priceList[j]);
              }
            }

          }
          //起批量从小到大排序,过滤促销时的非促销价
          if(this.otherAttributeList.pricePiece&&this.otherAttributeList.pricePiece.length>1){

            this.otherAttributeList.pricePiece.sort(function(a,b){
              if(a.startPiece == b.startPiece){
                return a.endPiece > b.endPiece
              }else{
                return a.startPiece > b.startPiece
              }
            });
            this.otherAttributeList.truePricePiece.push(this.otherAttributeList.pricePiece[0]);
            for(var j = 1; j< this.otherAttributeList.pricePiece.length; j++){
              var price = this.otherAttributeList.truePricePiece.pop();
              if(this.otherAttributeList.pricePiece[j].startPiece==price.startPiece){ //2-10(促销) 2-20 10-20(促销) 则2-20不放入
                if(this.otherAttributeList.pricePiece[j].promotionId>price.promotionId){
                  this.otherAttributeList.truePricePiece.push(this.otherAttributeList.pricePiece[j]);
                }else{
                  this.shoppingCart[i].truePricePiece.push(price);
                }
              }else if(this.otherAttributeList.pricePiece[j].endPiece==price.endPiece){ //2-10 2-999(促销) 10-999 则10-999不放入
                if(this.otherAttributeList.pricePiece[j].promotionId>price.promotionId){
                  this.otherAttributeList.truePricePiece.push(this.otherAttributeList.pricePiece[j]);
                }else{
                  this.otherAttributeList.truePricePiece.push(price);
                }
              }else{
                this.otherAttributeList.truePricePiece.push(price);
                this.otherAttributeList.truePricePiece.push(this.otherAttributeList.pricePiece[j]);

              }
            }
          }


          console.log(this.otherAttributeList.pricePiece)
        }else{
          //设置一件代发价格
          if(this.productDetail.skuDetailList[i].specialPrice&&this.productDetail.skuDetailList[i].specialPrice!=''){
            this.$set(this.otherAttributeList,'priceOne',this.productDetail.skuDetailList[i].specialPrice);
          }else{
            //促销Id
            this.$set(this.otherAttributeList, 'promotionId', -1);
            for (var j in this.productDetail.skuDetailList[i].priceList){
              if(this.productDetail.skuDetailList[i].priceList[j].levelId==this.user.vipId){
                if(this.productDetail.skuDetailList[i].priceList[j].startPiece==1 && this.productDetail.skuDetailList[i].priceList[j].endPiece==1){
                  if(this.productDetail.skuDetailList[i].priceList[j].promotionId>this.otherAttributeList.promotionId){
                    this.$set(this.otherAttributeList,'priceOne',this.productDetail.skuDetailList[i].priceList[j].price);
                    this.$set(this.otherAttributeList,'promotionId',this.productDetail.skuDetailList[i].priceList[j].promotionId);
                  }
                }
              }

            }
          }

        }
        //设置动态轮播图sku主图
        for(var p in this.productDetail.skuDetailList[currSku].skuImgs){
          if(this.productDetail.skuDetailList[currSku].skuImgs[p].imageType=='A'){
            var list = new Array();
            for(var s in this.productDetail.skuDetailList[currSku].skuImgs[p].imgList){
              list.push(this.productDetail.skuDetailList[currSku].skuImgs[p].imgList[s]);
            }
            this.$set(this.otherAttributeList,'skuImg',list);
          }
        }
        this.$set(this.otherAttributeList,'skuName',this.productDetail.skuDetailList[currSku].skuName);
        this.$set(this.otherAttributeList,'retailPrice',this.productDetail.skuDetailList[currSku].retailPrice+'');
        this.$set(this.otherAttributeList,'minPrice',this.productDetail.skuDetailList[currSku].minPrice+'');
        this.$set(this.otherAttributeList,'profit',(this.productDetail.skuDetailList[currSku].retailPrice-this.productDetail.skuDetailList[i].minPrice)+'');
        this.$set(this.otherAttributeList,'retailPrice',this.productDetail.skuDetailList[currSku].retailPrice);
        this.$set(this.otherAttributeList,'prodUnit',this.productDetail.skuDetailList[currSku].prodUnit);
        this.$set(this.otherAttributeList,'stock',this.productDetail.skuDetailList[currSku].channels[0].stock);
        this.$set(this.otherAttributeList,'cartonUnit',this.productDetail.skuDetailList[currSku].cartonUnit);
        //用于计算运费
        this.$set(this.otherAttributeList,'packLength',this.productDetail.skuDetailList[currSku].packLength);
        this.$set(this.otherAttributeList,'packWidth',this.productDetail.skuDetailList[currSku].packWidth);
        this.$set(this.otherAttributeList,'packHeight',this.productDetail.skuDetailList[currSku].packHeight);
        this.$set(this.otherAttributeList,'packGrossWeight',this.productDetail.skuDetailList[currSku].packGrossWeight);
        this.$set(this.otherAttributeList,'templateId',this.productDetail.skuDetailList[currSku].defaultTemplateId);

        //用于加入购物车
        this.$set(this.otherAttributeList,'productBaseId',this.productDetail.skuDetailList[currSku].productBaseId);

      },

      //查看一代代发或批发按钮
      updatePrice(){
        if(this.type.id==false){
          this.type.id=true;
          this.type.value='一<br>件<br>代<br>发';
        }else{
          this.type.id=false;
          this.type.value='批<br>发';
        }
        this.getBasicAttributes();
      },

      resetDialog(formName){
        this.channelId = '';
        this.$refs[formName].resetFields();

      },
      //规格变动，选择可选选项
      checkAllow(){
        //每次修改选择项，初始化已选个数
        this.checkCount=0;
        this.buyCount=1;
        for(var i in this.size){
          if(this.size[i]&&this.size[i]!=''){
            //若该属性组选了两个，移除第一个选中项
            if(this.size[i].length>1){
              this.size[i].shift();
            }
            this.checkCount++;
          }
        }
        if(this.checkCount>0){
          for(var k in this.attributeList){
            for(var p in this.attributeList[k].attributes){
              this.attributeList[k].attributes[p].checked = true;
            }
          }
          for(var p in this.size){
            //去掉size中的空项
            if(this.size[p]&&this.size[p]!=''){
              for(var i in this.productDetail.skuDetailList){
                //查找到含有该属性的sku
                if(this.productDetail.skuDetailList[i].attributes[p].optionNameCn==this.size[p][0].optionNameCn){
                  //将第i+1个sku的属性全部设为可选
                  for(var j in this.productDetail.skuDetailList[i].attributes){
                    for(var k in this.attributeList[j].attributes){
                      if(this.attributeList[j].attributes[k].optionNameCn == this.productDetail.skuDetailList[i].attributes[j].optionNameCn){
                        this.attributeList[j].attributes[k].checked = false;
                      }
                    }
                  }
                }
              }
            }

          }
        }else if(this.checkCount==0){
          for(var k in this.attributeList){
            for(var p in this.attributeList[k].attributes){
              this.attributeList[k].attributes[p].checked = false;
            }
          }
        }
        this.getBasicAttributes();



      },
      //获取省列表
      getProvince() {
        let param = {};
        getProvinceList(param).then((res) => {
          if (res.status == 200) {
            this.areaList = res.data;
            for(var i in this.areaList){
              this.$set(this.areaList[i],'cities',[]);
              this.$set(this.areaList[i],'index',i);
            }
          }
        })
      },

      //获取市列表
      handleChooseProvince(value) {
        if(value && value!='') {
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

      //省市均选择后计算运费
      calculateShippingCost(value){
        if(value&&value!=''){
          this.area=value;
        }
        if(this.area.length>1){
          let param = {
            provinceCode: this.areaList[this.area[0]].regionCode,
            cityCode: this.areaList[this.area[0]].cities[this.area[1]].regionCode,
            packingList:[Object.assign({}, this.otherAttributeList, {totalNumber: this.buyCount})]
          }
          calculateShippingCost(param).then((res) => {
            if (res.status == 200) {
              this.shipCost = res.data&&res.data!=''?res.data[0].shippingCost:0;
            }
          })
        }

      },

      //加入购物车
      addToShoppingCart(){
        if(!this.user.userId||this.user.userId==''){
          this.$router.push({path:'/login'});
        }
        let param = {
          distributorId: 1,
          userId: 1,
          skuId: this.otherAttributeList.productBaseId,
          quantity: this.buyCount,
          isAgent:this.status.status=='Y'?true:false


        }
        addToShoppingCart(param).then((res) => {
          if (res.status == 200) {
            this.$message({
              message: '加入进货单成功',
              type: 'success'
            });
          }
        })
      }
    },
    created () {
        this.$set(this.user,'vendorId',1);
        this.$set(this.user,'vipId',1);
        this.$set(this.user,'userId',1);
        this.$set(this.user,'distributorId',1);
      if(!this.$route.query.product||this.$route.query.product==''){
        this.$router.push({ path: '/productList' });
        return;
      }
      this.getProductDetail();
      this.getRelativeProduct();
    },
    mounted (){
      const swiperTop = this.$refs.swiperTop.swiper
      const swiperThumbs = this.$refs.swiperThumbs.swiper
      swiperTop.params.control = swiperThumbs
      swiperThumbs.params.control = swiperTop
    },

    filters: {
      formatProdUnit (val) {
        //商品单位
        var prodUnit = ['件','箱', '盒','包','个', '套','把', '台','块','条','支','对','只'];
        return (!val || val == '') ? prodUnit[0] : prodUnit[parseInt(val)-1];
      }
    }
  }
</script>
