import Vue from 'vue';
import VueAxios from 'vue-axios';
import axios from 'axios';
import { EventBus } from '@/plugins/event-bus';

axios.defaults.baseURL = 'https://api.github.com/';

axios.interceptors.response.use((response) => {
  EventBus.$emit('hideThrobber');
  return response;
}, function (error) {
  if (error.response.status === 400) {
    EventBus.$emit('error', error.response.data.message);
  }
  EventBus.$emit('hideThrobber');
  return Promise.reject(error.response);
});

axios.interceptors.request.use((request) => {
  const token = localStorage['tp_auth_token'];
  if (token) {
    request.headers.Authorization = 'Bearer ' + token;
  }
  EventBus.$emit('showThrobber');
  return request;
}, (error: any) => {
  EventBus.$emit('hideThrobber');
  return Promise.reject(error);
});

Vue.use(VueAxios, axios);