<template>
  <a-button type="primary" v-if="!user.isLogin" class="user-profile-component" @click="handleClickLogin"> 登录 </a-button>
  <div v-else>
    <a-dropdown-button class="user-profile-component">
      <router-link to="/setting">{{ user.data && user.data.nickName }}</router-link>
      <template v-slot:overlay>
        <a-menu class="user-profile-dropdown" @click="handleClickLogout">
          <a-menu-item key="0"> 登出 </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
import { UserProps } from '@/store/user';

export default defineComponent({
  name: 'UserProfile',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true,
    },
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const handleClickLogin = () => {
      store.commit('login');
      message.success('登录成功', 2);
    };
    const handleClickLogout = () => {
      store.commit('logout');
      message.success('退出登录成功, 2秒后跳到首页', 2);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    };
    return {
      handleClickLogin,
      handleClickLogout,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
