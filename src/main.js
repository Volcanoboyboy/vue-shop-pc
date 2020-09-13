import Vue from 'vue'
import App from './App.vue'
import router from './router'

import { Button } from "element-ui"

Vue.config.productionTip = false
// @ is an alias to /src


Vue.use(Button)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
