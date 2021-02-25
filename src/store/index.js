import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'

Vue.use(Vuex)

const TOKNE_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 存储当前登录的用户信息
    user: getItem(TOKNE_KEY)
  },
  mutations: {
    // 对 user 进行修改
    setUser(state, data) {
      state.user = data
      setItem(TOKNE_KEY, state.user)
    }
  },
  actions: {},
  modules: {}
})
