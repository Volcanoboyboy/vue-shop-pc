import axios from 'axios'
import Vue from 'vue'



//  配置axios全局默认值
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use((config) => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
}, (err) => {
    console.log('请求失败');
})

//  挂载axios
Vue.prototype.$axios = axios


//  利用这种就可以配置多个接口,基于微服务多服务器开发
// const userAxios = axios.create({
//     baseURL: 'http://127.0.0.1:8888/api/private/v1/'
// })