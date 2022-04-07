import { createRouter, createWebHashHistory } from 'vue-router';
import axios from 'axios';
import { message } from 'ant-design-vue';
import Home from '../views/Home.vue';
import Index from '../views/Index.vue';
import Editor from '../views/Editor.vue';
import Login from '../views/Login.vue';
import store from '../store/index';
import TemplateDetail from '../views/TemplateDetail.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      children: [
        {
          path: '/home',
          name: 'home',
          component: Home,
          meta: {
            title: '欢迎来到魔方',
          },
        },
        {
          path: '/template/:id',
          name: 'template',
          component: TemplateDetail,
          meta: {
            title: '模板详情',
          },
        },
      ],
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor,
      meta: {
        requireLogin: true,
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        redirectAlreadyLogin: true,
      },
    },
  ],
});

router.beforeEach(async (to, from) => {
  const { user } = store.state;
  const { isLogin, token } = user;
  const { redirectAlreadyLogin, requireLogin, title } = to.meta;

  if (!isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      try {
        await store.dispatch('fetchUserInfo');
        if (redirectAlreadyLogin) return '/';
      } catch {
        message.error('登录状态已过期, 请重新登录', 2);
        store.commit('logout');
        return '/login';
      }
    } else {
      if (requireLogin) return '/login';
    }
  } else {
    if (redirectAlreadyLogin) return '/';
  }
});

export default router;
