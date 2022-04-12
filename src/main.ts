import { createApp } from 'vue';
import App from './App.vue';
import Antd from './configAntD';
import router from './routes';
import store, { ICustomAxiosConfig } from './store';
import axios from 'axios';

import 'ant-design-vue/dist/antd.less';
import 'cropperjs/dist/cropper.css';

let baseBackendURL = '';
let baseH5URL = '';
let baseStaticURL = '';

if (process.env.NODE_ENV === 'development' || process.env.VUE_APP_IS_STAGING) {
  // 这里是本地的请求 URL
  // staging 也就是测试环境 URL
  // baseBackendURL = 'http://182.92.168.192:8081'
  // baseH5URL = 'http://182.92.168.192:8082'
  // baseStaticURL = 'http://182.92.168.192:8080'
  baseBackendURL = 'http://localhost:3000';
  baseH5URL = 'http://localhost:3001';
} else {
  // 生产环境 URL
  baseBackendURL = 'https://api.mofong.cc';
  baseH5URL = 'https://h5.mofong.cc';
  baseStaticURL = 'https://statistic-res.mofong.cc';
}

export { baseBackendURL, baseH5URL, baseStaticURL };

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
