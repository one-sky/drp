// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

// 引入element-ui组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
// vue滑块
import VueAwesomeSwiper from 'vue-awesome-swiper';

import App from './App';
import router from './router';
import store from './store';

import * as filters from './js/filters.js';

Vue.use(ElementUI);
Vue.use(VueAwesomeSwiper);
Vue.config.productionTip = false;
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }

});
