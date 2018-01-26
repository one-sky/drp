<template>
  <div class="brand-list flex-col ver-center">
    <!--title-->
    <div class="top flex-row hor-center ver-center">
      <router-link to="#最新品牌">最新品牌</router-link>
      <div class="seperate">|</div>
      <router-link to="#热门品牌">热门品牌</router-link>

      <template v-for="(title, index) in categoryList">
        <div class="seperate" v-if="categoryList.length>0">|</div>
        <router-link :to="'#'+title.categoryName">{{title.categoryName}}</router-link>
      </template>
    </div>

    <!--middle-->
    <div class="middle">
      <template v-for="item in brandItemCommon">
        <div class="menu flex-row hor-ver-center" :id="item.categoryName">
          <img src="../../imgs/brand/title_left.png" height="94" width="31"/>
          <div class="flex-col ver-center">
            <h2>{{item.name}}</h2>
            <h4>{{item.categoryEgName}}</h4>
          </div>
          <img src="../../imgs/brand/title_right.png" height="94" width="30"/>
        </div>
        <div class="flex-row-col item">
          <template v-for="(brand, index) in item.children">
            <router-link :to="{path: '/brandDetail', query:{ brand: brand.brandId }}">
              <img v-bind:src="brand.logo" height="234" width="234"/>
            </router-link>
          </template>
        </div>
      </template>
    </div>
    <!--智能**-->
    <div class="bottom flex-row" v-for="(item, index) in categoryList"  :id="item.categoryName" :key="Math.random()">
      <!--left-->
      <div class="menu flex-col hor-center">
        <div class="flex-col ver-center">
          <h2>{{item.categoryName}}</h2>
          <h4>{{item.categoryEgName}}</h4>
        </div>
        <img src="../../imgs/brand/brand_kind_bottom.png" height="10" width="50"/>
        <el-button type="text" @click="showMore(index)">{{item.more_button_message}}</el-button>
      </div>
      <!--right pic-->
      <div v-if="item.rBrands&&item.rBrands!=''" class="item flex-row-col ver-center" :key="item.isShow">
        <template v-for="index in item.rBrands.length>10?10:item.rBrands.length">
          <router-link :to="{path: '/brandDetail', query:{ brand: item.rBrands[index-1].brandId }}" >
            <img v-bind:src="item.rBrands[index-1].logo" height="142" width="142"/>
          </router-link>
        </template>
        <div v-if="item.rBrands.length>10" >
          <div v-if="item.isShow">
            <div v-for="index in item.rBrands.length-10">
              <router-link :to="{path: '/brandDetail', query:{ brand: item.rBrands[9+index].brandId }}" >
                <img v-bind:src="item.rBrands[9+index].logo" height="142" width="142"/>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      </div>




  </div>
</template>
<style >
  @import "../../css/brand.css";
</style>

<script>
  import { getNewstBrand, getRecommendBrandList, getBrandListByCategoryId } from "../../api/api.js";
  export default {
    name: 'mainPage',
    data () {
      return{
        user:{
          userId:null,
          vendorId:null
        },
        brandItemCommon:[
          {name:'最新品牌', categoryEgName:'NEW SETTLED BRAND',children:[]},
          {name:'热门品牌', categoryEgName:'THE HOT',children:[]}
        ],

        categoryList:[]
      }
    },
    methods:{
      getNewstBrand(){
        let param ={
          vendorId: 1,
        };
        getNewstBrand(param).then((res) => {
          if(res.status ==200){
            this.brandItemCommon[0].children=res.data;
          }

        })
      },
      getRecommendBrandList(){
        let param ={
          vendorId: 1,
        };
        getRecommendBrandList(param).then((res) => {
          if(res.status ==200){
            this.brandItemCommon[1].children=res.data;
          }

        })
      },
      getBrandListByCategoryId(){
        let param = {
          vendorId:1,
        };
        getBrandListByCategoryId(param).then((res)=>{
          if(res.status ==200){
            this.categoryList=res.data;
            for(var p in this.categoryList){
              this.$set(this.categoryList[p],'isShow',false);
              this.$set(this.categoryList[p],'more_button_message','查看更多');
            }
          }
        })
      },

      showMore(val){
        this.categoryList[val].isShow=!this.categoryList[val].isShow;
        if(this.categoryList[val].isShow){
          this.$set(this.categoryList[val],'more_button_message','收起');
        }else{
          this.$set(this.categoryList[val],'more_button_message','查看更多>');

        }
      }
    },
    created() {
      this.getNewstBrand();
      this.getRecommendBrandList();
      this.getBrandListByCategoryId();
    }
  }
</script>
