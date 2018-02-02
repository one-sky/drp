<template>
  <div class="step flex-row hor-end">
    <el-steps :active="parseInt($store.state.step)" :align-center="true" finish-status="success">
      <template v-for="item in stepTitle">
        <el-step :title="item"></el-step>
      </template>

    </el-steps>
  </div>
</template>

<style >
  @import "step.css";
</style>

<script>
  export default {

    data () {
      return {
        stepTitle: {}
      };
    },
    mounted () {
      if (this.$store.state.stepType == 'register') {
        this.stepTitle = [ '1.验证手机号码', '2.填写基本信息', '3.注册完成' ];
      } else {
        this.stepTitle = [ '1.我的进货单【代销／批发】', '2.填写核对订单信息', '3.成功提交代销／批发订单' ];
      }
    },
  };
</script>
