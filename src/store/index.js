import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'
Vue.use(Vuex)
const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state: {
    // 用户的登录状态信息
    user: getItem(TOKEN_KEY)
    // 为了防止数据丢失。我们需要把数据备份到本地储存
    // user: JSON.parse(window.localStorage.getItem('TOUTIAO_USER'))
    // user: null
  },
  mutations: {
    setUser(state, data) {
      state.user = data
      setItem(TOKEN_KEY, state.user)
      // window.localStorage.setItem('TOUTIAO_USER', JSON.stringify(user))
    }
  },
  actions: {},
  modules: {}
})
