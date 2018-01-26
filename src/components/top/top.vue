<template>
  <div class="common-top hor-center">
    <div class="content ver-center">
      <router-link class="flex-row hor-center slogan third-font-color info-size" to="/">懂你的，才是智能</router-link>
      <div class="second-font-color info-size">
        您好，欢迎来到智黑分销平台！
      </div>
      <router-link class="user second-font-color info-size" to="/login">
        请登录
      </router-link>
      <router-link class="user second-font-color info-size" to="/register">
        免费注册
      </router-link>
      <div class="hor-end" style="flex: 1">
        <div class="hor-between ver-center" style="width:320px;">
          <router-link class="second-font-color info-size"  to="/center/dashboard">
            个人中心
          </router-link>

          <el-popover placement="bottom-start" trigger="hover" width="74">
            <img src="../../imgs/components/inheater_qrcode.png" height="74" width="74"/>
            <el-button type="text" slot="reference">
              <div class="hor-center ver-center">
                <img src="../../imgs/components/top_like_icon.png">
                <div class="second-font-color info-size">关注我们</div>
              </div>
            </el-button>
          </el-popover>
          <router-link class="second-font-color info-size" to="/">
            新手指南
          </router-link>
          <div class="flex-row ver-center">
            <img src="../../imgs/components/top_list_icon.png" height="10" width="11"/>
            <div class="second-font-color info-size">
              网站导航
            </div>
          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<style>
  @import "./top.css"
</style>
