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
    component: () => import("../views/Login.vue")
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue'),
    redirect: '/welcom',
    children: [
      {
        path: '/welcom',
        component: () => import('../views/Welcom.vue')
      },
      {
        path: '/users',
        component: () => import('../components/user/Users.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //  这里要防止棧溢出调用
  if (to.path == '/login') return next();
  const tokentStr = window.sessionStorage.getItem('token');
  if (!tokentStr) return next({ name: 'login' });
  next();
})

export default router
