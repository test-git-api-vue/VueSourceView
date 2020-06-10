import Vue from 'vue';
import VueAuth from '@d0whc3r/vue-auth-plugin';

Vue.use(VueAuth, {
  authMeta: 'auth',
  rolesVar: 'roles',
  tokenDefaultName: 'tp_auth_token',
  userDefaultName: 'tp_auth_user',
  tokenStore: ['localStorage'],
  headerTokenReplace: '{auth_token}',
  tokenType: 'Bearer',
  vuexStoreSpace: 'vue-auth',

  authRedirect: '/login',

  loginData: {
    url: '/user',
    method: 'POST',
    redirect: '/',
    headerToken: 'Authorization',
    fetchUser: false,
  },
  logoutData: { redirect: '/login' },
  fetchData: { url: '/users/test-git-api-vue', method: 'GET', enabled: true },
  refreshData: { url: '/users/test-git-api-vue', method: 'GET', enabled: true },
});