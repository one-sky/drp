<template>
  <div class="search-component">
    <div class="hor-center ver-end">
      <div class="flex-col" >
        <!-- search_box-->
        <div class="flex-row searchbox weight-border">
          <el-select v-model="secondSearchValue">
            <el-option key="产品" label="产品" value="产品"></el-option>
            <el-option key="品牌" label="品牌" value="品牌"></el-option>
          </el-select>
          <div class="ver-center">
            <div class="split "></div>
          </div>
          <el-input type="text" v-model="detailSearchValue" placeholder="智能音箱" class="input"></el-input>
          <el-button type="primary" @click="searchProduct">
            <img src="../../imgs/components/search_icon.png">
          </el-button>
        </div>

        <!--brand-->
        <div class="hor-around" style="width:490px;height:28px;">
          <el-button v-for="(item, index) in hotName" type="text" @click="searchProduct(index)" :key=index m:style="{color:item.color}">
            <div class="info-size">
              {{item.name}}
            </div>
          </el-button>
        </div>
      </div>



      <!--shoppingCart-->
      <div class="flex-col hor-ver-center" style="width:70px;margin-left:34px;">
        <div class="shoppingCart hor-ver-center">
          <router-link to="/shoppingCart">
            <img src="../../imgs/components/shopcar_icon.png">
          </router-link>
        </div>
        <div class="hor-center" style="margin-top:6px;">
          <router-link to="/shoppingCart" class="first-font-color">
            我的进货单
          </router-link>
        </div>
      </div>


    </div>

  </div>
</template>

<style>
  @import 'searchbox.css';
</style>
<script>
  export default {
    data(){
      return{
        firstSearchValue: '一件代发', // 1-一件代发，  2-批发
        secondSearchValue: '产品',
        detailSearchValue: '',
        hotName: [
          {name: '爆款推荐', color: '#ffdb15'},
          {name: '智能手环', color: '#c8c8c8'},
          {name: '电动牙刷', color: '#c8c8c8'},
          {name: '空气净化器', color: '#ffdb15'},
          {name: '机器人', color: '#c8c8c8'},
          {name: '创意礼品', color: '#ffdb15'},
          {name: '3D针织鞋', color: '#c8c8c8'}
        ]
      }
    },
    methods:{
      searchProduct(index){


      }
    }
  }
</script>
