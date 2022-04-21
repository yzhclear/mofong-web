import { createRouter, createWebHashHistory } from 'vue-router';
import axios from 'axios';
import { message } from 'ant-design-vue';
import Home from '../views/Home.vue';
import Index from '../views/Index.vue';
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
          name: 'Home',
          component: Home,
          meta: {
            title: '欢迎来到魔方',
          },
        },
        {
          path: '/template/:id',
          name: 'Template',
          component: TemplateDetail,
          meta: {
            title: '模板详情',
          },
        },
      ],
    },
    {
      path: '/editor/:id',
      name: 'Editor',
      component: () => import(/* webpackChunkName: "editor" */ '../views/Editor.vue'),
      meta: {
        requireLogin: true,
        title: '编辑设计',
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
      meta: {
        redirectAlreadyLogin: true,
        title: '欢迎登录到魔方网',
      },
    },
  ],
});

router.beforeEach(async (to, from) => {
  const { user } = store.state;
  const { isLogin, token } = user;
  const { redirectAlreadyLogin, requireLogin, title } = to.meta;

  if (title) {
    document.title = title as string;
  }

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
