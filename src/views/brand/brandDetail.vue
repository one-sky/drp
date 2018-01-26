<template>
  <div class="brand-detail flex-col ver-center">
    <div class="top flex-row">
      <!--left pic-->
      <img v-bind:src="brand.brandPic" height="270" width="720"/>
      <!--right info-->
      <div class="right flex-col">
        <div class="flex-row">
          <img v-bind:src="brand.logo" height="61" width="113"/>
          <img class="seperate" src="../../imgs/brand/split.png" height="80" width="1"/>
          <div class="flex-col hor-center">
            <h1 class="stress-size fz_font">{{brand.brandName}}</h1>
            <template v-if="status.status==null||status.status=='R'">
              <el-button class="agent" type="text" v-if="!user.userId||user.userId==''" @click="$router.push({ path: '/login' });">
                <img src="../../imgs/brand/agent.png" height="11" width="11"/>申请代理
              </el-button>
              <el-button class="agent" type="text" v-else @click="storeDialog = true">
                <img src="../../imgs/brand/agent.png" height="11" width="11"/>
                申请代理
              </el-button>
            </template>
            <div v-else class="agented">
              {{status.statusDesc}}
            </div>
          </div>

        </div>
        <p v-html="brand.description"></p>

      </div>
    </div>

    <el-tabs class="middle" type="border-card" v-model="brandDetail_tab">
      <el-tab-pane label="商品" name="商品" class="flex-row-col">
        <div class="product" v-for="item in productList" >
          <router-link class="flex-row hor-ver-center":to="{path: '/productDetail', query:{ product: item.productId }}" >
            <img v-bind:src="item.thumbnailImage" height="226" width="206"/>
          </router-link>
          <router-link class="long-title" :to="{path: '/productDetail', query:{ product: item.productId }}" >
            {{item.productName}}
          </router-link>
          <div class="third-font-color price-size">
            <span class="price-icon-size">¥</span>{{item.retailPrice|formatMoney}}
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="品牌故事" name="品牌故事">
        <p v-html="brandDetail.brandDiary"></p>
      </el-tab-pane>
      <el-tab-pane label="招募书" name="招募书">
        <p v-html="brandDetail.recruitment"></p>
      </el-tab-pane>
    </el-tabs>
    <!--分页-->
    <div v-if="brandDetail_tab=='商品'" class="pagination flex-row hor-center">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalCount">
      </el-pagination>
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
  @import "../../css/brand.css";
</style>

<script>
  import { getBrandByBrandId, getDAgentBrand, getBrandDetail,  insertDAgentBrand, getChannelOption, getProductList } from "../../api/api.js";
  export default {
    name: 'mainPage',
    data () {
      return {
        user:{
          userId:null,
          vendorId:null,
        },

        status:{
          status:null,
          statusDesc:null
        },
        brand:{
          statusDesc:null,
        },
        //erp中的资料包
        brandDetail:{},
        productList:[],

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

        trueBrandId:null,

        currentPage:1,
        pageSize:20,
        totalCount: null,

        //商品tab
        brandDetail_tab: '商品',
      }
    },
    methods:{
      //获取品牌详情
      getBrandByBrandId(){

        let param ={
          erpBrandId: this.$route.query.brand,
          vendorId: this.user.vendorId
        };
        getBrandByBrandId(param).then((res) => {

          if(res.status ==200){
            var category= res.data;
            for(var p in category.rBrandAtts){
              if(category.rBrandAtts[p].type==1){
                this.$set(category,'brandPic',category.rBrandAtts[p].attachmentUrl);
              }else if(category.rBrandAtts[p].type==3){
                this.$set(category,'paper',category.rBrandAtts[p].attachmentUrl);
              }

            }
            this.brand=category;
            this.trueBrandId=res.data.id;
            if(this.user.userId &&this.user.userId!=''){
              this.getDAgentBrand();
            }
            this.getBrandDetail();
            this.getProductList();
          }

        })
      },

      //获取erp中的资料包
      getBrandDetail:function(){
        let param={
          vendorId:this.user.vendorId,
          brandId:this.brand.brandId
        };
        getBrandDetail(param).then((res) => {
          if(res.status==200){
            this.brandDetail =  res.data;
            console.log(this.brandDetail)
          }

        })
      },
      //获取代理品牌
      getDAgentBrand:function(){
        let param={
          vendorId:this.user.vendorId,
          distributorId: this.user.distributorId,
          brandId:this.trueBrandId
        };
        console.log(param)
        getDAgentBrand(param).then((res) => {
          if(res.status==200){
            console.log(res);
            if(!res.data||res.data==''){
              this.$set(this.status, 'status', null);
              this.$set(this.status,'statusDesc',"申请代理");
            }else if(res.data.status == "R"){
              this.$set(this.status, 'status',"R");
              this.$set(this.status, 'statusDesc',"申请代理");
            }else if(res.data.status == "W"){
              this.$set(this.status,'status',"W");
              this.$set(this.status,'statusDesc',"等待审核");
            }else if(res.data.status == "Y"){
              this.$set(this.status,'status',"Y");
              this.$set(this.status,'statusDesc',"已代理");
            }
          }

        })
      },
      //获取渠道列表
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
          }
        });
      },





      //申请代理
      insertDAgentBrand(formName){
        this.$refs[formName].validate((valid) => {
          let param = {
            brandId: this.trueBrandId,
            distributorId: this.user.distributorId,
            channelId: this.dialogStoreData.channelId
          };
          insertDAgentBrand(param).then((res) => {
            if (res.status == 200) {
              this.storeDialog = false;
              this.getDAgentBrand();
            }

          });
        });
      },
      getProductList(){
        let param = {
          brandIds: [this.brand.brandId],
          vendorId:this.user.vendorId,
          page:this.currentPage
        };
        getProductList(param).then((res) => {
          if (res.status == 200) {
            this.productList=res.data.productList;
            this.totalCount = res.data.count;
            console.log(this.productList)
          }

        });
      },
      resetDialog(formName){
        this.channelId = '';
        this.$refs[formName].resetFields();

      },
      //页码变更
      handleCurrentChange: function(val) {
        this.currentPage = val;
        this.getProductList();
      },

    },
    created(){
      this.$set(this.user,'vendorId',1);
      if(!this.$route.query.brand||this.$route.query.brand==''){
        this.$router.push({ path: '/brandList' });
      }
      this.getBrandByBrandId();

    }
  }
</script>

