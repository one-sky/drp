<template>
  <div>
    <router-view name="notice"></router-view>
    <router-view name="breadcrumb"></router-view>
    <div class="center hor-center">
      <div class="flex-row content">
        <el-menu mode="vertical" router class="center-menu" :default-active="$route.path">

          <div v-for="menu in menuItem" :key="menu.label" class="flex-col">
            <div class="first ver-center" >{{menu.label}}</div>
            <el-menu-item class="second flex-row ver-center first-font-color" v-for="(childMenu,index) in menu.children" :key="childMenu.label" :index="childMenu.router">
              {{childMenu.label}}
            </el-menu-item>
          </div>

        </el-menu>
        <router-view class="child-content"></router-view>
      </div>
    </div>

  </div>
</template>

<style>
  @import '../../css/center/center.css';
</style>


<script>
  export default{
    data() {
      return {
        router: '',
        menuItem:[{
          label: '账户管理', children:[{
            label: '基本信息', router: '/center/account'
          }, {
            label: '收货地址', router: '/center/addressList'
          }, {
            label: '积分管理', router: '/center/scoreList'
          }]
        }, {
          label: '订单管理', children: [{
            label: '我的订单', router: '/center/orderList'
          }, {
            label: '订单退换', router: '/center/refundList'
          }]
        }, {
          label: '我的分销', children: [{
            label: '已代理品牌', router: '/center/centerBrand'
          },{
            label: '已关注商品', router: '/center/centerProduct'
          }]
        }, {
          label: '消息中心', children: [{
            label: '消息列表', router: '/center/messageList'
          }]
        }, {
          label: '统计报表', children: [{
            label: '订单报表', router: '/center/statisticReport'
          },{
            label: '订单明细', router: '/center/statisticItem'
          },{
            label: '订单统计', router: '/center/statisticOrder'
          }]
        }]
      }
    }
  }
</script>


