<template>
  <div class="homepage-container">
    <a-layout :style="{ background: '#fff' }">
      <a-layout-content class="home-layout">
        <div class="content-container">
          <template-list :list="testData"></template-list>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { GlobalDataProps } from '../store/index';
import TemplateList from '../components/TemplateList.vue';

export default defineComponent({
  name: 'Home',
  components: {
    TemplateList,
  },
  props: {},
  setup() {
    const {
      state: { templates },
    } = useStore<GlobalDataProps>();
    const testData = computed(() => templates.data);
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
