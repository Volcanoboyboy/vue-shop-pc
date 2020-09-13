import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () =>  import("../views/Login.vue")
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(to.paht == '/login') return next({name: 'login'});
  const tokentStr = window.sessionStorage.getItem('token');
  if(!tokentStr) return next({ name: 'login'});
  next();
})

export default router
