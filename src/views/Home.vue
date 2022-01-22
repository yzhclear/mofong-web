<template>
  <div class="homepage-container">
    <a-layout :style="{ background: '#fff' }">
      <a-layout-header class="header">
        <div class="page-title">魔方</div>
      </a-layout-header>
      <a-layout-content class="home-layout">
        <div class="content-container">
          <template-list :list="testData"></template-list>
        </div>
      </a-layout-content>
      <a-layout-footer> ©️ 魔方(mofong.com) 版权所有 | 津ICP备20000929号 </a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import TemplateList from '../components/TemplateList.vue';

export default defineComponent({
  name: 'Home',
  components: {
    TemplateList,
  },
  props: {},
  setup() {
    const testData: any = reactive([]);
    testData.push(
      {
        id: '1',
        coverImg: 'http://static-dev.imooc-lego.com/imooc-test/sZHlgv.png',
        title: '前端架构师直播海报',
      },
      {
        id: '2',
        coverImg: 'http://static-dev.imooc-lego.com/imooc-test/sZHlgv.png',
        title: '前端架构师直播海报',
      },
      {
        id: '3',
        coverImg: 'http://static-dev.imooc-lego.com/imooc-test/sZHlgv.png',
        title: '前端架构师直播海报',
      },
      {
        id: '4',
        coverImg: 'http://static-dev.imooc-lego.com/imooc-test/sZHlgv.png',
        title: '前端架构师直播海报',
      },
    );
    return {
      testData,
    };
  },
});
</script>

<style scoped>
.content-container {
  background: #fff;
  padding: 0 24px 24px 30px;
  min-height: 85vh;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
</style>
