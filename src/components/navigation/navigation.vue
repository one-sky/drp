<template>
  <div class="hor-center navigation-component">
    <div class="hor-start" style="width:1200px;">
      <div class="hor-ver-center product" style="width:178px;">
        商品分类
      </div>
      <div class="content hor-between ver-center">
        <router-link to="/">
          首页
        </router-link>
        <img src="../../imgs/components/split.png">
        <router-link to="/">
          批发采购
        </router-link>
        <img src="../../imgs/components/split.png">
        <router-link to="/">
          一件代发
        </router-link>
        <img src="../../imgs/components/split.png">
        <router-link to="/brandList" class="link a4_link">
          品牌库
        </router-link>
        <img src="../../imgs/components/split.png">
        <router-link to="/">
          智黑"智选"
        </router-link>
        <img src="../../imgs/components/split.png">
        <router-link to="/">
          了解智黑
        </router-link>
      </div>
    </div>

  </div>
</template>
<style>
  @import "navigation.css"
</style>
