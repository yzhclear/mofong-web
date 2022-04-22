<template>
  <div class="create-component-list">
    <a-tabs>
      <a-tab-pane key="1">
        <template v-slot:tab>
          <span>
            <FieldStringOutlined />
            文本
          </span>
        </template>
        <div v-for="(item, index) in textList" :key="index" @click="onItemClick(item)" class="component-item">
          <div class="component-wrapper">
            <component :is="item.name" v-bind="item.props" :style="generateResetCss(item.name)" class="inside-component" />
            <span v-if="item.text" class="tip-text">{{ item.text }}</span>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2">
        <template v-slot:tab>
          <span>
            <FileImageOutlined />
            图片
          </span>
        </template>
        <styled-uploader
          action="/utils/upload-img"
          @file-uploaded="
            (uploaded) => {
              onImageUploaded(uploaded);
            }
          "
          :beforeUpload="commonUploadCheck"
        >
          <div class="uploader-container">
            <FileImageOutlined />
            <h4>上传图片</h4>
          </div>
          <template #loading>
            <div class="uploader-container">
              <LoadingOutlined spin />
              <h4>上传中</h4>
            </div>
          </template>
          <template #uploaded>
            <div class="uploader-container">
              <FileImageOutlined />
              <h4>上传图片</h4>
            </div>
          </template>
        </styled-uploader>
        <div class="image-list">
          <div v-for="(item, index) in imageList" :key="index" @click="onItemClick(item)" class="component-item item-image">
            <div class="component-wrapper">
              <component :is="item.name" v-bind="item.props" :style="generateResetCss(item.name)" class="inside-component" />
            </div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3">
        <template v-slot:tab>
          <span>
            <BuildOutlined />
            形状
          </span>
        </template>
        <div v-for="(item, index) in shapeList" :key="index" @click="onItemClick(item)" class="component-item">
          <div class="component-wrapper">
            <component :is="item.name" v-bind="item.props" :style="generateResetCss(item.name)" class="inside-component" />
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <!-- <styled-uploader @success="onImageUploaded" /> -->
  </div>
</template>

<script lang="ts">
import { message } from 'ant-design-vue';
import { defineComponent } from 'vue';
import { FileImageOutlined, LoadingOutlined, FieldStringOutlined, BuildOutlined } from '@ant-design/icons-vue';
import MText from './MText.vue';
import MImage from './MImage.vue';
import MShape from './MShape.vue';
import StyledUploader from '../components/StyledUploader.vue';
import { imageDefaultProps } from '../defaultProps';
import { v4 as uuidv4 } from 'uuid';
import { ComponentData } from '@/store/editor';
import { UploadResp } from '@/extraType';
import { getImageDimensions, commonUploadCheck } from '@/helper';
import { textList, imageList, shapeList, generateResetCss, CreateComponentType } from '../defaultTemplates';
export default defineComponent({
  components: { MText, MImage, MShape, StyledUploader, FileImageOutlined, LoadingOutlined, FieldStringOutlined, BuildOutlined },
  name: 'component-list',
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  emits: ['on-item-click'],
  setup(props, context) {
    // 点击添加组件到画布
    const onItemClick = (data: CreateComponentType) => {
      if (data.type !== 'upload') context.emit('on-item-click', data);
    };

    // 上传图片
    const onImageUploaded = (resp: UploadResp) => {
      const componentData: ComponentData = {
        id: uuidv4(),
        name: 'm-image',
        props: {
          ...imageDefaultProps,
        },
      };
      message.success('图片上传成功');
      componentData.props.imgSrc = resp.url;
      getImageDimensions(resp.url).then(({ width }) => {
        const maxWidth = 300;
        componentData.props.width = (width < maxWidth ? width : maxWidth) + 'px';
        context.emit('on-item-click', componentData);
      });
    };

    return {
      textList,
      imageList,
      shapeList,
      generateResetCss,
      onItemClick,
      onImageUploaded,
      commonUploadCheck,
    };
  },
});
</script>

<style>
.component-wrapper {
  width: 100px;
  position: relative;
  display: flex;
  align-items: center;
}
.tip-text {
  position: absolute;
  text-align: center;
  top: 50%;
  width: 100%;
  margin-top: -10px;
}
.inside-component {
  width: 100px !important;
}
.image-list {
  display: flex;
  flex-wrap: wrap;
  width: 220px;
  margin: 20px auto;
}
.image-list img {
  max-height: 150px;
  object-fit: contain;
}
.item-image {
  margin-right: 10px;
}
.component-item {
  margin-bottom: 15px;
  cursor: pointer;
  display: flex;
  justify-content: center;
}
.create-component-list .uploader-container {
  padding: 10px;
  color: #ffffff;
  background: #1890ff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.create-component-list .uploader-container:hover {
  background: #40a9ff;
}
.create-component-list .uploader-container h4 {
  color: #ffffff;
  margin-bottom: 0;
  margin-left: 10px;
}
.create-component-list .ant-tabs-tab {
  margin: 0;
}
.ant-tabs-tabpane {
  padding-top: 20px;
}
</style>
