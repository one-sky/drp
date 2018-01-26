/**
 * Created by cyw on 2017/10/12.
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  step: 0,
  stepType: null,
  shoppingCart: null
}

// 触发actions函数，将状态提交到mutaions中处理
const actions = {

}

//显式的更改state里的数据
const mutations = {
  updateStep(state, msg){
    state.step = msg;
  },
  updateStepType(state, msg){
    state.stepType = msg;
  }
}

const getters = {
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})
