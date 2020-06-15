import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Login from '../Pages/Login/Index.vue'
import ReposList from '../Pages/ReposList/Index.vue'
import RepoCommitsList from '../Pages/RepoCommitsList/Index.vue'
import Error403 from '../Pages/errors/403.vue'
import Error404 from '../Pages/errors/404.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
        title: 'Вход в аккаунт GitHub',
        hideLayout: true
    }
  },
  {
    path: '/login-hub',
    name: 'login-hub',
    props: ['clientId', 'login'],
    redirect: to => {
      return "https://github.com/login/oauth/authorize?login=$loginclient_id=$clientId"
    }
  },
  {
    path: '/',
    name: 'ReposList',
    component: ReposList,
    props: true,
    meta: {
        title: 'Список репозиториев',
        auth: true

    }
  },
  {
    path: '/repo',
    name: 'RepoCommitsList',
    component: RepoCommitsList,
    props: true,
    meta: {
        title: 'Список коммитов репозитория',
        auth: true
    }
  },
  { 
    path: '/accessDenied', 
    name: '403', 
    component: Error403,
    meta: {
      title: 'Error 403',
      hideLayout: true
    }
  },
  { 
    path: '*', 
    name: '404',
    component: Error404,
    meta: {
      title: 'Error 404',
      hideLayout: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

(Vue as any).router = router

export default router
