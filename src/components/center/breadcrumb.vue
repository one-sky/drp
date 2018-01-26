<template>
  <div class="hor-center">
    <div class="breadcrumb-component hor-start ver-center">
      当前位置：
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item >a</el-breadcrumb-item>
        <el-breadcrumb-item>b</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<style>
  @import "center.css";
</style>

<script>
  export default{
    data() {
      return {
        breadcrumbItem: null
      }
    }
  }
</script>
