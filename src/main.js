import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'
import './server/axios'
//  导入全局样式,任何文件皆模块
import './assets/styles/global.css'
//  导入iconfont样式
import './assets/fonts/iconfont.css'



//  生产提示
Vue.config.productionTip = false

// @ is an alias to /src


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
