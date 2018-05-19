# Drp

## 项目说明
本项目是使用了webpack、vue、elementui、vuex、vue-router、axios，实现一个智能家居分销平台的批发采购流程

```
- src/api        接口地址
- src/components 公用组件
- src/router     路由文件
- src/store      状态管理文件
- src/views      业务页面
```

## 本地环境搭建
```bash
# 拉取项目
git clone git@github.com:one-sky/drp.git
# 安装依赖
npm i
# 打包
npm run dev
# 浏览
https://127.0.0.1:8080
```

## 简单介绍
 ``` src/views ```下的页面对应一个  ``` src/css ```中的样式
 ``` src/css/common/ui_base ``` 为elementui基础公用组件样式
  ``` src/css/common/components ``` 为自定义基础公用组件样式
 ``` src/css/common/ui_box ``` 为div的位置样式
 ``` src/css/common/ui_font ``` 为字体样式

## 主要业务逻辑
 ``` src/views/index ``` 本系统的首页
 ``` src/views/brand ``` 本系统的品牌列表页与品牌详情页（登录状态与游客均可访问）
 ``` src/views/center ``` 本系统的个人中心页，包括dashboard、个人信息、地址管理、积分管理、订单列表与详情、售后、品牌代理列表页、商品关注页、订单统计（尚未开发）
 ``` src/views/product ``` 本系统的商品列表页与商品详情页（登录状态与游客均可访问），商品列表页用户可根据标签查询商品
 ``` src/views/purchase ``` 本系统的购买管理，包括购物车管理、购物车结算（生成订单、订单确认、支付）
 ``` src/views/user ``` 本系统的用户登录注册管理