import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登录角色：client、postsale
    loginType: ""
  },
  mutations: {
    //保存用户登录信息
    setUserInfo(state, loginType) {
      localStorage.setItem(`loginType`, loginType);
      state.loginType = loginType;
    },
  },
  actions: {
    // 更新用户信息：防止页面刷新 vuex 中数据被清空
    updateUserInfo(context, value) {
      context.commit('setUserInfo', value)
    },
  },
  modules: {
  }
})
