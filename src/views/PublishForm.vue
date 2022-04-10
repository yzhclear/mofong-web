<template>
  <div class="publish-form-container">
    <a-row type="flex" align="middle" :style="{ marginBottom: '20px' }">
      <a-col :span="8">
        <p>封面图</p>
        <img :src="page.coverImg" :style="{ width: '100px' }" :alt="page.title" />
      </a-col>
      <a-col :span="16" class="right-col">
        <a-row>
          <a-col :span="6">
            <img src="http://mofong.oss-cn-hangzhou.aliyuncs.com/upload-files/file-906368" />
          </a-col>
          <a-col :span="18" class="left-gap">
            <h4>{{ page.title }}</h4>
            <p>{{ page.desc }}</p>
          </a-col>
        </a-row>
        <a-tabs type="card" :style="{ marginTop: '20px' }" @change="tabChange">
          <a-tab-pane key="channels" tab="发布为作品">
            <a-row v-for="channel in channels" :key="channel.id" class="channel-item">
              <a-col :span="6">
                <canvas class="barcode-container" :id="`channel-barcode-${channel.id}`"></canvas>
              </a-col>
              <a-col :span="18" class="left-gap">
                <h4>{{ channel.name }}</h4>
                <a-row>
                  <a-col :span="18">
                    <a-input :value="generateChannelURL(channel.id)" :readonly="true" />
                  </a-col>
                  <a-col :span="6">
                    <a-button class="copy-button" @click="copyUrl(channel.id)">复制</a-button>
                  </a-col>
                </a-row>
              </a-col>
              <div class="delete-area">
                <a-button @click="deleteChannel(channel.id)" :disabled="deleteDisabled" type="danger" size="small">删除渠道</a-button>
              </div>
            </a-row>
            <a-form layout="inline" :style="{ marginTop: '20px' }" :model="form" :rules="rules" ref="publishForm">
              <a-form-item name="channelName">
                <a-input placeholder="渠道名称" v-model:value="form.channelName"></a-input>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="createChannel"> 创建新渠道 </a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane key="template" tab="发布为模板">
            <a-row class="channel-item">
              <a-col :span="6">
                <canvas id="channel-barcode-template" class="barcode-container"></canvas>
              </a-col>
              <a-col :span="18" class="left-gap">
                <h4>模板信息</h4>
                <a-row>
                  <a-col :span="18">
                    <a-input :value="generateChannelURL()" :readonly="true" id="channel-url-template" />
                  </a-col>
                  <a-col :span="6">
                    <a-button class="copy-button" @click="copyUrl()">复制</a-button>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <div class="template-submit">
              <a-button type="primary" size="large" @click="publishTemplate"> 发布模版 </a-button>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, reactive, ref, Ref, onMounted, watch, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { last } from 'lodash-es';
import { GlobalDataProps } from '../store';
import { baseH5URL } from '../main';
import { generateQRCode, copyToClipboard } from '../helper';
import { message } from 'ant-design-vue';

interface FormRuleInstance {
  validate: () => Promise<any>;
}

export default defineComponent({
  setup(props, context) {
    const store = useStore<GlobalDataProps>();
    const route = useRoute();
    const page = computed(() => store.state.editor.page);
    const currentWorkId = route.params.id as string;
    const channels = computed(() => store.state.editor.channels);
    const qrCodeGenerated = ref(false);
    const generateChannelURL = (id?: number) => (id ? `${baseH5URL}/p/${page.value.id}-${page.value.uuid}?channel=${id}` : `${baseH5URL}/p/${page.value.id}-${page.value.uuid}`);

    // ---- 复制 ----
    const copyUrl = (id?: number) => {
      const url = generateChannelURL(id);
      const result = copyToClipboard(url);
      if (result) {
        message.success('复制成功', 1);
      }
    };

    const tabChange = (activeKey: string) => {
      if (activeKey === 'template' && !qrCodeGenerated.value) {
        nextTick(() => {
          generateQRCode('channel-barcode-template', generateChannelURL());
          qrCodeGenerated.value = true;
        });
      }
    };

    // ----- 表单 创建渠道------
    const form = reactive({
      channelName: '',
    });
    const publishForm = ref() as Ref<FormRuleInstance>;
    const rules = {
      channelName: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
    };
    const createChannel = async () => {
      const payload = {
        name: form.channelName,
        workId: parseInt(currentWorkId),
      };
      try {
        await publishForm.value.validate();
        await store.dispatch('createChannel', payload);
        form.channelName = '';
      } catch (error) {
        console.error(error);
      }
    };

    // ---- 删除渠道 -----
    const deleteDisabled = computed(() => channels.value.length === 1);
    const deleteChannel = (id: number) => {
      store.dispatch('deleteChannel', id);
    };

    const publishTemplate = () => {
      store.dispatch('publishTemplate', currentWorkId).then(() => {
        message.success('模板发布成功', 1);
      });
    };

    // 获取渠道, 生成二维码
    onMounted(() => {
      channels.value.forEach((channel) => {
        generateQRCode(`channel-barcode-${channel.id}`, generateChannelURL(channel.id));
      });
    });
    // 监听channels变化,生成二维码
    watch(
      channels,
      (newVal, oldVal) => {
        if (newVal.length > oldVal.length) {
          const channel = last(newVal);
          if (channel) {
            generateQRCode(`channel-barcode-${channel.id}`, generateChannelURL(channel.id));
          }
        }
      },
      {
        flush: 'post',
      },
    );

    const cancelEdit = () => {
      context.emit('panel-close', true);
    };

    return {
      channels,
      page,
      form,
      rules,
      publishForm,
      deleteDisabled,
      copyUrl,
      tabChange,
      publishTemplate,
      createChannel,
      deleteChannel,
      generateChannelURL,
    };
  },
});
</script>

<style>
.left-col img {
  width: 80%;
}
.right-col img {
  width: 80px;
}
.left-gap {
  padding-left: 5px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.delete-area {
  position: absolute;
  top: 10px;
  right: 20px;
}
.channel-item {
  position: relative;
  padding: 10px 0;
  border-bottom: 1px solid #efefef;
}
.barcode-container {
  height: 80px;
  width: 80px;
}
.template-submit {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.ant-row-middle {
  align-items: flex-start;
}
</style>
