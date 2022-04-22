<template>
  <div class="styled-upload-component">
    <uploader
      class="styled-uploader"
      action="http://localhost:3000/api/utils/upload-img"
      :beforeUpload="commonUploadCheck"
      @file-uploaded="
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
      default: '上传图片',
    },
    uploaded: {
      type: Object,
    },
  },
  emits: ['success'],
  setup(props, context) {
    const handleUploadSuccess = (data: any) => {
      context.emit('success', { url: 'http://mofong.oss-cn-hangzhou.aliyuncs.com/upload-files/file-404525' });
      // context.emit('success', { url: data.urls[0] });
    };
    return {
      commonUploadCheck,
      handleUploadSuccess,
    };
  },
});
</script>

<style scoped>
.styled-upload-component {
  width: 80%;
  margin: 0 auto;
}
.uploader-container {
  padding: 10px;
  color: #fff;
  background: #1890ff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.uploader-container:hover {
  border: 2px dotted #1890ff;
  color: #1890ff;
}
.uploader-container h4 {
  color: #fff;
  margin-bottom: 0;
  margin-left: 10px;
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
