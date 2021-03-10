import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui' // 引入element-ui
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios';  //引入axios
import VueAxios from 'vue-axios';  // 引入vue-axios
import qs from "qs"
Vue.use(ElementUI, VueAxios, axios)

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
