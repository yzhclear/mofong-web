<template>
  <div class="work-detail-container">
    <a-row type="flex" justify="center" v-if="template">
      <a-col :span="4" class="cover-img">
        <div class="work-detail-img">
          <img :src="template.coverImg" alt="" />
        </div>
      </a-col>
      <a-col :span="8">
        <h2>{{ template.title }}</h2>
        <p>{{ template.desc }}</p>
        <div class="author">
          <a-avatar :src="template.user.picture" v-if="template.user.picture"></a-avatar>
          该模板由<b>{{ template.author }}</b> 创作
        </div>
        <div class="bar-code-area">
          <p>扫一扫, 手机预览</p>
          <canvas id="detail-bar-code"></canvas>
        </div>
        <div class="use-button">
          <a-button type="primary" size="large" @click="onCopy(template.id)" :loading="isCreating">
            {{ isCreating ? '创建中...' : '使用模板' }}
          </a-button>
          <a-button size="large" @click="download">下载图片海报</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { GlobalDataProps } from '../store/index';
import { WorkProp } from '../store/works';
import { baseH5URL } from '../main';
import { downloadImage, generateQRCode } from '../helper';

export default defineComponent({
  name: 'TemplateDetail',
  setup() {
    const store = useStore<GlobalDataProps>();
    const route = useRoute();
    const router = useRouter();
    const isCreating = ref(false);
    const templateId = route.params.id as string;
    const template = computed<WorkProp>(() => store.getters.getTemplateById(parseInt(templateId)));
    const channelURL = computed(() => `${baseH5URL}/p/${template.value.id}-${template.value.uuid}`);

    // ------ 创建作品 -----------
    const onCopy = (id: number) => {
      if (store.state.user.isLogin) {
        isCreating.value = true;
        store.dispatch('copyWork', id).then(({ data }) => {
          router.push(`/editor/${data.id}`);
        });
      } else {
        router.push('/login');
      }
    };

    // ------- 下载海报 --------
    const download = () => {
      downloadImage(template.value.coverImg);
    };

    onMounted(() => {
      // 生成二维码
      generateQRCode('detail-bar-code', channelURL.value);
    });

    return {
      isCreating,
      template,
      onCopy,
      download,
    };
  },
});
</script>

<style>
.work-detail-container {
  margin-top: 180px;
}
.cover-img {
  margin-right: 30px;
}
.cover-img img {
  width: 100%;
}
.use-button {
  margin: 30px 0;
}
.use-button > * {
  margin-right: 20px;
}
.ant-avatar {
  margin-right: 10px;
}
.bar-code-area {
  margin: 20px 0;
}
.work-detail-img {
  width: 384px;
  height: 686px;
}
</style>
