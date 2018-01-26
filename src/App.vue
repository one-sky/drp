<template>
  <div id="app" style="background-color:#fff;">
    <router-view name="top"></router-view>
    <div class="hor-center">
      <div class="flex-row ver-end" style="width:1200px;margin-top:21px;">
        <router-view name="logo"></router-view>
        <router-view name="searchbox" style="flex:1;"></router-view>
        <router-view name="step" style="flex:1;"></router-view>
      </div>
    </div>
    <router-view name="navigation" style="margin-top:24px; "></router-view>
    <router-view name="default" ></router-view>
    <router-view name="footer"></router-view>
  </div>
</template>

<style>
  @import "./css/common/ui_base.css";
  @import "./css/common/ui_font.css";
  @import "./css/common/ui_box.css";
  @import "./css/common/components.css";
</style>
