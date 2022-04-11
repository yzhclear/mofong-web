<template>
  <div class="preview-form" v-if="visible">
    <div class="final-preview">
      <div class="final-preview-inner">
        <div class="preview-title">
          {{ pageState.title }}
        </div>
        <div class="iframe-container">
          <iframe :src="previewURL" class="iframe-placeholder" width="375" frameborder="0" :height="pageState.props && pageState.props.height ? pageState.props.height : '560'"></iframe>
        </div>
      </div>
    </div>
    <a-drawer title="设置面板" placement="right" width="400" :closable="true" :visible="visible">
      <div class="publish-form-container">
        <a-row type="flex" align="middle" :style="{ marginBottom: '20px' }">
          <a-col :span="6"> 扫码预览： </a-col>
          <a-col :span="10">
            <canvas id="preview-barcode-container"></canvas>
          </a-col>
        </a-row>
        <a-row type="flex" align="middle" :style="{ marginBottom: '20px' }">
          <a-col :span="6"> 上传封面： </a-col>
          <a-col :span="10">
            <styled-uploader text="上传封面图" @file-uploaded="updateAvatar" :uploaded="form.uploaded"> </styled-uploader>
          </a-col>
        </a-row>
        <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" :model="form" :rules="rules" ref="publishForm">
          <a-form-item label="标题" required name="title">
            <a-input v-model:value="form.title" @change="updatePage('title', form.title)" />
          </a-form-item>
          <a-form-item label="副标题" required name="subTitle">
            <a-input v-model:value="form.subTitle" @change="updatePage('desc', form.subTitle)" />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 18, offset: 4 }">
            <a-button type="primary" @click="checkAndpublish" :loading="isPublishing"> 发布 </a-button>
            <a-button style="margin-left: 10px" @click="saveWork" :loading="isSaving"> 保存 </a-button>
            <a-button style="margin-left: 10px" @click="cancelEdit"> 取消 </a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-drawer>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, Ref, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';
import { GlobalDataProps } from '../store/index';
import { baseH5URL } from '../main';
import { commonUploadCheck, UploadImgProps, generateQRCode } from '../helper';
import StyledUploader from '../components/StyledUploader.vue';

interface RuleFormInstance {
  validate: () => Promise<any>;
}

export default defineComponent({
  components: {
    StyledUploader,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isSaving: Boolean,
    isPublishing: Boolean,
  },
  emits: ['panel-close', 'trigger-publish', 'trigger-save'],
  setup(props, context) {
    const store = useStore<GlobalDataProps>();
    const pageState = computed(() => store.state.editor.page);
    const previewURL = computed(() => `${baseH5URL}/p/preview/${pageState.value.id}-${pageState.value.uuid}`);

    onMounted(() => {
      // 生成二维码
      generateQRCode('preview-barcode-container', previewURL.value);
    });

    // ------ 表单 ----------
    const { title, desc, setting } = pageState.value;
    const form = reactive({
      title: title || '',
      subTitle: desc || '',
      uploaded: {
        data: {
          url: (setting && setting.shareImg) || 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f79389d4737571e2e1dc7cb.png',
        },
      },
    });
    const publishForm = ref() as Ref<RuleFormInstance>;
    const rules = {
      title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
      subTitle: [{ required: true, message: '副标题不能为空', trigger: 'blur' }],
    };
    const updatePage = (key: string, value: string, settings = false) => {
      store.commit('updatePage', {
        key,
        value,
        level: settings ? 'setting' : false,
      });
    };
    const updateAvatar = (rawData: UploadImgProps) => {
      const url = rawData.data.urls[0];
      form.uploaded = {
        data: { url },
      };
      updatePage('shareImg', url, true);
    };
    const validate = () => {
      return publishForm.value.validate();
    };
    const cancelEdit = () => {
      context.emit('panel-close', true);
    };
    const checkAndpublish = () => {
      validate().then(() => {
        context.emit('trigger-publish', true);
      });
    };
    const saveWork = () => {
      validate().then(() => {
        context.emit('trigger-save', true);
      });
    };
    return {
      pageState,
      previewURL,
      form,
      rules,
      publishForm,
      updatePage,
      updateAvatar,
      cancelEdit,
      checkAndpublish,
      saveWork,
    };
  },
});
</script>
<style>
.final-preview {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 400px);
  height: 100%;
  background: transparent;
  z-index: 1500;
}
.final-preview-inner {
  position: relative;
  width: 430px;
  height: 870px;
  padding: 60px 28px;
  background: url('~@/assets/phone-back.png') no-repeat;
  background-size: cover;
}
.final-preview-inner .preview-title {
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-weight: bold;
}
.iframe-container {
  width: 100%;
  height: 706px;
  overflow-y: auto;
  overflow-x: hidden;
}
.iframe-placeholder {
  background: url('~@/assets/loading.svg') 50% 50% no-repeat;
  background-size: 50px;
}

.publish-form-container .file-upload-container {
  height: 130px;
}
.publish-form-container .ant-form-item-label {
  text-align: left;
}
#preview-barcode-container {
  border: 2px dotted #efefef;
  padding: 10px;
}
</style>
