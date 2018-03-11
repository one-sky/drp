# Drp

## 项目说明
本项目是使用了webpack、vue、elementui、vuex、vue-router、axios

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

## 简单介绍
 ``` src/views ```下的页面对应一个  ``` src/css ```中的样式
 ``` src/css/common/ui_base ``` 为elementui基础公用组件样式
  ``` src/css/common/components ``` 为自定义基础公用组件样式
 ``` src/css/common/ui_box ``` 为div的位置样式
 ``` src/css/common/ui_font ``` 为字体样式