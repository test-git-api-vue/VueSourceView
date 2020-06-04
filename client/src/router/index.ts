import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Login from '../Pages/Login/Index.vue'
import ReposList from '../Pages/ReposList/Index.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/repos',
    name: 'ReposList',
    component: ReposList,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

(Vue as any).router = router

export default router
