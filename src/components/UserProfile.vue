<template>
  <a-button type="primary" v-if="!user.isLogin" class="user-profile-component" @click="handleClickLogin"> 登录 </a-button>
  <div v-else>
    <a-dropdown-button class="user-profile-component">
      <router-link to="/setting">{{ user.userName }}</router-link>
      <template v-slot:overlay>
        <a-menu class="user-profile-dropdown" @click="handleClickLogout">
          <a-menu-item key="0"> 登出 </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
import { GlobalDataProps } from '../store/index';

export default defineComponent({
  name: 'UserProfile',
  props: {
    msg: String,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const router = useRouter();
    const user = computed(() => store.state.user);
    const handleClickLogin = () => {
      store.commit('login');
      message.success('登录成功', 2);
    };
    const handleClickLogout = () => {
      store.commit('logout');
      message.success('退出登录成功', 2);
      setTimeout(() => {
        router.push('/');
      });
    };
    return {
      user,
      handleClickLogin,
      handleClickLogout,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
