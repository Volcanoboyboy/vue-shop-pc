import axios from 'axios'
import Vue from 'vue'



//  配置axios全局默认值
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use((config) => {
    if (config.url !== 'login') {
        config.headers.Authorization = window.sessionStorage.getItem('token')
    }
    return config //  这里一定要记得要返回出去
}, (err) => {
    console.log('请求失败');
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

//  挂载axios
Vue.prototype.$axios = axios


//  利用这种就可以配置多个接口,基于微服务多服务器开发
// const userAxios = axios.create({
//     baseURL: 'http://127.0.0.1:8888/api/private/v1/'
// })