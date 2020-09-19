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
    component: () => import(/* webpackChunkName: "login_home_welcome" */ "../views/Login.vue")
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "login_home_welcome" */ '../views/Home.vue'),
    redirect: '/welcom',
    children: [
      {
        path: '/welcom',
        name: 'welcom',
        component: () => import(/* webpackChunkName: "login_home_welcome" */'../views/Welcom.vue')
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('../components/user/Users.vue')
      },
      {
        path: '/rights',
        name: 'rights',
        component: () => import('../components/power/Rights.vue')
      },
      {
        path: '/roles',
        name: 'roles',
        component: () => import('../components/power/Roles.vue')
      },
      {
        path: '/params',
        name: 'params',
        component: () => import('../components/goods/Params.vue')
      },
      {
        path: '/categories',
        name: 'cate',
        component: () => import('../components/goods/Categories.vue')
      },
      {
        path: '/orders',
        name: 'orders',
        component: () => import('../components/orders/Orders.vue')
      },
      {
        path: '/reports',
        name: 'reports',
        component: () => import('../components/report/Reports.vue')
      },
      {
        path: '/goods',
        name: 'goods',
        component: () => import('../components/common/NotFount.vue')
      }
    ]
  },
  {
    path: '*',
    name: 'pageNotFound',
    component: () => import('../components/common/NotFount.vue')
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
