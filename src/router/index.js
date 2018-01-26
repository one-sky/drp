import Vue from 'vue'
import Router from 'vue-router'
import top from '../components/top/top'
import footer from '../components/footer/footer'
import logo from '../components/logo/logo'
import searchbox from '../components/searchbox/searchbox'
import navigation from '../components/navigation/navigation'
import notice from '../components/center/notice'
import breadcrumb from '../components/center/breadcrumb'
import step from '../components/step/step'

import center from '../views/center/center'
import dashboard from '../views/center/dashboard'
import account from '../views/center/account'
import addressList from '../views/center/addressList'
import scoreList from '../views/center/scoreList'
import orderList from '../views/center/orderList'
import refundList from '../views/center/refundList'
import centerBrand from '../views/center/centerBrand'
import centerProduct from '../views/center/centerProduct'
import messageList from '../views/center/messageList'
import messageDetail from '../views/center/messageDetail'
import statisticReport from '../views/center/statisticReport'
import statisticItem from '../views/center/statisticItem'
import statisticOrder from '../views/center/statisticOrder'

import productList from '../views/product/productList'
import productDetail from '../views/product/productDetail'

import brandList from '../views/brand/brandList'
import brandDetail from '../views/brand/brandDetail'

import shoppingCart from '../views/purchase/shoppingCart'
import generateOrder from '../views/purchase/generateOrder'
import pay from '../views/purchase/pay'
import paySuccess from '../views/purchase/paySuccess'

import login from '../views/user/login'
import register from '../views/user/register'

import index from '../views/index'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      components: {
        top: top,
        footer: footer,
        logo: logo,
        searchbox: searchbox,
        navigation: navigation,
        default: index
      }

    },
    {
      path: '/center',
      components: {
        top: top,
        footer: footer,
        logo: logo,
        searchbox: searchbox,
        navigation: navigation,
        default: center
      },
      children: [
        { path: 'dashboard', components: { notice: notice, default: dashboard} },
        { path: 'account', components: { breadcrumb: breadcrumb, default: account} },
        { path: 'addressList', components: { breadcrumb: breadcrumb, default: addressList} },
        { path: 'scoreList', components: { breadcrumb: breadcrumb, default: scoreList} },
        { path: 'orderList', components: { breadcrumb: breadcrumb, default: orderList} },
        { path: 'refundList', components: { breadcrumb: breadcrumb, default: refundList} },
        { path: 'centerBrand', components: { breadcrumb: breadcrumb, default: centerBrand} },
        { path: 'centerProduct', components: { breadcrumb: breadcrumb, default: centerProduct} },
        { path: 'messageList', components: { breadcrumb: breadcrumb, default: messageList} },
        { path: 'messageDetail', components: { breadcrumb: breadcrumb, default: messageDetail} },
        { path: 'statisticReport', components: { breadcrumb: breadcrumb, default: statisticReport} },
        { path: 'statisticItem', components: { breadcrumb: breadcrumb, default: statisticItem} },
        { path: 'statisticOrder', components: { breadcrumb: breadcrumb, default: statisticOrder} },
      ]
    },
    {
      path: '/productList',
      components: {
        top: top,
        footer: footer,
        logo: logo,
        searchbox: searchbox,
        navigation: navigation,
        default: productList
      }
    },
    {
      path: '/productDetail',
      components: {
        top: top,
        footer: footer,
        logo: logo,
        searchbox: searchbox,
        navigation: navigation,
        default: productDetail
      }
    },
    {
      path: '/brandList',
      components: {
        top: top,
        footer: footer,
        logo: logo,
        searchbox: searchbox,
        navigation: navigation,
        default: brandList
      }
    },
    {
      path: '/brandDetail',
      components: {
        top: top,
        footer: footer,
        logo: logo,
        searchbox: searchbox,
        navigation: navigation,
        default: brandDetail
      }
    },
    {
      path: '/shoppingCart',
      components: {
        top: top,
        footer: footer,
        logo: logo,
        step: step,
        default: shoppingCart
      }
    },
    {
      path: '/generateOrder',
      components: {
        top: top,
        footer: footer,
        logo: logo,
        step: step,
        default: generateOrder
      }
    },
    {
      path: '/pay',
      components: {
        top: top,
        footer: footer,
        logo: logo,
        default: pay
      }
    },
    {
      path: '/paySuccess',
      components: {
        top: top,
        footer: footer,
        logo: logo,
        default: paySuccess
      }
    },
    {
      path: '/login',
      components: {
        top: top,
        footer: footer,
        logo: logo,
        default: login
      }
    },
    {
      path: '/register',
      components: {
        top: top,
        footer: footer,
        logo: logo,
        step: step,
        default: register
      }
    },
  ],
  mode: 'history'

})
