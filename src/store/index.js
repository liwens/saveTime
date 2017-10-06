import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import state from './state'
import mutations from './mutations'
//这是追踪state数据变化的插件
// import createLogger from 'vuex/dist/logger'

Vue.use(Vuex);

//严格模式，检测state是否由mutations修改，否则抛出错误
const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict:debug
  // plugins: debug ? [createLogger()] : []
})
