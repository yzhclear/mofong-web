<template>
  <a-button type="primary" v-if="!user.isLogin" class="user-profile-component" @click="handleClickLogin"> 登录 </a-button>
  <div :class="{ 'user-operation': !smMode }" v-else>
    <a-button type="primary" @click="createDesign" v-if="!smMode"> 创建设计 </a-button>
    <a-button type="primary" class="user-profile-component" v-if="!smMode">
      <router-link to="/mywork">我的作品</router-link>
    </a-button>
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
import useCreateDesign from '../hooks/useCreateDesign';

export default defineComponent({
  name: 'UserProfile',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true,
    },
    smMode: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const createDesign = useCreateDesign();
    const handleClickLogin = () => {
      router.push('/login');
    };
    const handleClickLogout = () => {
      store.commit('logout');
      message.success('退出登录成功, 2秒后跳到首页', 2);
      setTimeout(() => {
        router.push('/home');
      }, 2000);
    };
    return {
      createDesign,
      handleClickLogin,
      handleClickLogout,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.user-profile-dropdown {
  border-radius: 2px !important;
}
.user-operation > * {
  margin-left: 30px !important;
}
</style>
