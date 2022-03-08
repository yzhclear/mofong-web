<template>
  <div class="styled-upload-component">
    <uploader
      class="styled-uploader"
      action="https://jsonplaceholder.typicode.com/posts"
      :showUploadList="false"
      :beforeUpload="commonUploadCheck"
      @success="
        (data) => {
          handleUploadSuccess(data);
        }
      "
    >
      <div class="uploader-container">
        <FileImageOutlined :style="{ fontSize: '30px' }" />
        <h4>{{ text }}</h4>
      </div>
      <template #loading>
        <div class="uploader-container">
          <LoadingOutlined :style="{ fontSize: '30px' }" spin />
          <h4>上传中</h4>
        </div>
      </template>
      <template #uploaded="">
        <div class="uploader-container">
          <img />
        </div>
      </template>
    </uploader>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FileImageOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import Uploader from './Uploader.vue';
import { commonUploadCheck } from '../helper';

export default defineComponent({
  components: {
    Uploader,
    FileImageOutlined,
    LoadingOutlined,
  },
  props: {
    text: {
      type: String,
      default: '上传背景图片',
    },
    uploaded: {
      type: Object,
    },
  },
  emits: ['success'],
  setup(props, context) {
    const handleUploadSuccess = (data: any) => {
      console.log(data);
      context.emit('success', { url: 'https://www.surely.cool/surely-vue-logo.png' });
    };
    return {
      commonUploadCheck,
      handleUploadSuccess,
    };
  },
});
</script>

<style scoped>
.uploader-container {
  text-align: center;
  padding: 10px;
  width: 100%;
  border: 2px dotted #efefef;
  color: #ccc;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  transition: all 0.25s ease-in-out;
  cursor: pointer;
}
.uploader-container:hover {
  border: 2px dotted #1890ff;
  color: #1890ff;
}
.uploader-container h4 {
  color: #999;
  transition: all 0.25s ease-in-out;
}
.uploader-container:hover h4 {
  color: #1890ff;
}
.uploader-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
