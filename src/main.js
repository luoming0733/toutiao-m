import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载 vant 全局样式
import Vant from 'vant'
import 'vant/lib/index.css'

// 加载全局样式
import '../src/styles/index.less'

// 加载动态设置 REM 基准值
import 'amfe-flexible'

// 加载图标样式
import '../src/styles/icon.less'
Vue.config.productionTip = false

// 注册使用 vant 组件库
Vue.use(Vant)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
