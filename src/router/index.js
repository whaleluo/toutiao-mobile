import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    // name: 'layout', // 如果父路由有默认子路由，那它的 name 没有意义
    path: '/',
    component: () => import('@/views/layout'),
    children: [
      {
        path: '', // 默认子路由，只能有1个
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    // 将路由动态参数映射到组件的 props 中，更推荐这种做法
    props: true // 开启 Props 传参，说白了就是把路由参数映射到组件的 props 数据中
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile')
  }
]
// https://router.vuejs.org/guide/essentials/history-mode.html#html5-history-mode
const router = new VueRouter({
  mode: 'history', // https://router.vuejs.org/guide/essentials/history-mode.html#html5-history-mode
  routes
})

export default router
