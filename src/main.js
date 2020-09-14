import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'
import axios from 'axios'


//  导入全局样式,任何文件皆模块
import './assets/styles/global.css'

//  导入iconfont样式
import './assets/fonts/iconfont.css'



//  挂载axios
Vue.prototype.$axios = axios
//  配置axios全局默认值
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, (err) => {
  console.log('请求失败');
})
//  生产提示
Vue.config.productionTip = false



// @ is an alias to /src

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
