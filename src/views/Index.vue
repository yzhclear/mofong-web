<template>
  <div class="indexpage-container">
    <a-layout :style="{ background: '#fff' }">
      <a-layout-header class="header">
        <div class="page-title">魔方</div>
        <div class="user-profile">
          <user-profile :user="user" />
        </div>
      </a-layout-header>
      <a-layout-content class="home-layout">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer> ©️ 魔方(mofong.com) 版权所有 | 津ICP备20000929号 </a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import UserProfile from '../components/UserProfile.vue';

export default defineComponent({
  name: 'Index',
  components: {
    UserProfile,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);

    return {
      user,
    };
  },
});
</script>

<style>
.indexpage-container .header {
  overflow: auto;
}
.indexpage-container .header .page-title {
  float: left;
  color: #fff;
  font-size: 18px;
}
.indexpage-container .header .user-profile {
  float: right;
}

.indexpage-container .home-layout {
  padding: 100px 20px;
}
</style>
