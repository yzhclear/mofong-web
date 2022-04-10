import { createApp } from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import router from './routes';
import store, { ICustomAxiosConfig } from './store';
import axios from 'axios';

import 'ant-design-vue/dist/antd.css';
import 'cropperjs/dist/cropper.css';

// const baseBackendURL = 'http://182.92.168.192:8081';
const baseBackendURL = 'http://localhost:3000';
export const baseH5URL = 'http://localhost:3001';
axios.defaults.baseURL = `${baseBackendURL}/api/`;

axios.interceptors.request.use((config) => {
  const newConfig = config as ICustomAxiosConfig;
  store.commit('setLoading', { status: true, opName: newConfig.mutationName });
  store.commit('setError', { status: false, message: '' });

  return config;
});

axios.interceptors.response.use(
  (resp) => {
    store.commit('setLoading', { status: false });
    if (resp.data.errno !== 0) {
      store.commit('setError', { status: true, message: resp.data.message });
      return Promise.reject(resp.data);
    }

    return resp;
  },
  (e) => {
    store.commit('setError', { status: true, message: '服务器错误' });
    store.commit('setLoading', { status: false });
  },
);

const app = createApp(App);
app.use(Antd).use(router).use(store);
app.mount('#app');
