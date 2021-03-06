/**
 * Created by cyw on 2017/10/12.
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  step: 0,
  stepType: null,
  shoppingCart: null,
  user: {
    distributorId: 0,
    userId: 0,
    phone: 0
  },
  searchProduct: {
    type: 1,
    value: null,
    priceType: 1,
    categoryIds: null
  },
  handleCart: {
    
  }
  
};

// 触发actions函数，将状态提交到mutaions中处理
const actions = {

};

// 显式的更改state里的数据
const mutations = {
  updateStep (state, msg) {
    state.step = msg;
  },
  updateStepType (state, msg) {
    state.stepType = msg;
  },
};

const getters = {
};

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
});
