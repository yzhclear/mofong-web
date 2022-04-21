<template>
  <div class="work-detail-container">
    <a-row type="flex" justify="center" v-if="template">
      <a-col :span="8" class="cover-img">
        <img :src="template.coverImg" alt="" />
      </a-col>
      <a-col :span="8">
        <h2>{{ template.title }}</h2>
        <p>{{ template.title }}</p>
        <div class="author">
          <a-avatar>V</a-avatar>
          该模板由<b>{{ template.author }}</b> 创作
        </div>
        <div class="bar-code-area">
          <span>扫一扫, 手机预览</span>
          <div ref="container"></div>
        </div>
        <div class="use-button">
          <a-button type="primary" size="large" class="large">使用模板</a-button>
          <a-button size="large">下载图片海报</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { GlobalDataProps } from '../store/index';
import { WorkProp } from '../store/works';

export default defineComponent({
  name: 'TemplateDetail',
  setup() {
    const store = useStore<GlobalDataProps>();
    const route = useRoute();
    const templateId = route.params.id as string;
    const template = computed<WorkProp>(() => store.getters.getTemplateById(parseInt(templateId)));
    return {
      template,
    };
  },
});
</script>

<style>
.work-detail-container {
  width: 1200px;
  margin: 0 auto;
}
.work-detail-container .cover-img {
  margin-right: 20px;
}
.work-detail-container img {
  height: 617px;
}
.work-detail-container .use-button {
  margin-top: 20px;
}
</style>
