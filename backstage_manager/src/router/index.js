import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: { name: 'login' }
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/components/Login')
  },
  {
    name: 'home',
    path: '/home',
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: () => import('@/components/Welcome')
    },
    {
      path: '/users',
      component: () => import('@/components/User/User')
    },
    {
      path: '/roles',
      component: () => import('@/components/authority/roles')
    },
    {
      path: '/rights',
      component: () => import('@/components/authority/rights')
    },
    {
      path: '/goods',
      component: () => import('@/components/commodity/goods')
    },
    {
      path: '/params',
      component: () => import('@/components/commodity/params')
    },
    {
      path: '/categories',
      component: () => import('@/components/commodity/categories')
    },
    {
      path: '/orders',
      component: () => import('@/components/orders/orders')
    },
    {
      path: '/reports',
      component: () => import('@/components/reports/reports')
    },
    {
      name: 'addgoods',
      path: '/goods/add',
      component: () => import('@/components/commodity/add.vue')
    }
    ],
    component: () => import('@/components/Home')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(function (to, from, next) {
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('login');
  next();
})

export default router
