<template>
  <div class="indexpage-container">
    <a-spin tip="读取中" class="editor-spinner" v-if="loading"> </a-spin>
    <a-layout :style="{ background: '#fff' }">
      <a-layout-header class="header" :class="{ 'transparent-header': isHomePage }">
        <div class="page-title">
          <router-link to="/">
            <img alt="Vue logo" src="../assets/logo2.png" class="logo-img" />
          </router-link>
        </div>
        <div class="right-col">
          <user-profile :user="userInfo"></user-profile>
        </div>
      </a-layout-header>
      <a-layout-content v-if="isHomePage" class="home-layout">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-content style="padding: 0 50px" v-else>
        <a-layout style="padding: 24px 0; background: #fff">
          <a-layout-content :style="{ padding: '0 24px', minHeight: '85vh', maxWidth: '1200px', margin: '0 auto', width: '100%' }">
            <router-view></router-view>
          </a-layout-content>
        </a-layout>
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }"> ©️ 魔方(mofong.com) 版权所有 | 皖ICP备2022004858号 </a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import UserProfile from '../components/UserProfile.vue';
import showError from '../hooks/useShowError';

export default defineComponent({
  name: 'Index',
  components: {
    UserProfile,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const loading = computed(() => store.state.status.loading);
    const userInfo = computed(() => store.state.user);
    const isHomePage = computed(() => route.name === 'Home');

    // 提示报错信息
    showError();

    return {
      userInfo,
      isHomePage,
      loading,
    };
  },
});
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ant-layout-header {
  z-index: 50;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
.indexpage-container .transparent-header {
  background-color: rgba(0, 0, 0, 0.5);
}
.home-layout {
  position: relative;
  top: -70px;
}
.editor-spinner {
  position: fixed;
  right: 50%;
  top: 10px;
  z-index: 100;
}
.header .logo-img {
  height: 35px;
}
.header .ant-input-search {
  width: 250px;
}
.right-col > * {
  margin-left: 30px !important;
}
.banner {
  display: flex;
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
}
.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.banner-text {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.text-headline {
  text-shadow: 0 0 1px rgba(68, 92, 116, 0.02), 0 2px 8px rgba(57, 76, 96, 0.15);
  font-size: 3rem;
}
.text-link {
  color: #ffffff;
}
.text-link:hover {
  color: #ffffff;
  text-decoration: underline;
}
.poster-item {
  position: relative;
  margin-bottom: 20px;
}
.list-inline {
  list-style: none;
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
  padding-top: 24px;
  border-top: 1px solid #4d4d4d;
}
.list-inline li {
  margin-right: 20px;
}
.extra-margin {
  margin-top: 70px;
}
.ant-layout-footer {
  background: #333;
  color: #999;
}
.footer-info {
  max-width: 1200px;
  margin: 0 auto;
}
.footer-info .feature-item {
  text-align: left;
}
.footer-info .feature-item h3 {
  color: #fff;
  font-size: 19px;
}
.footer-info .feature-item ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.footer-info .feature-item li {
  height: 35px;
  line-height: 35px;
}
.footer-info .feature-item a {
  color: #999;
}
</style>
