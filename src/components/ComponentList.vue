<template>
  <div class="create-component-list">
    <div class="component-item" v-for="(item, index) in list" :key="index" @click="onItemClick(item)">
      <m-text v-bind="item"></m-text>
    </div>

    <styled-uploader @success="onImageUploaded" />
  </div>
</template>

<script lang="ts">
import { message } from 'ant-design-vue';
import { defineComponent } from 'vue';
import MText from './MText.vue';
import StyledUploader from '../components/StyledUploader.vue';
import { TextComponentProps, imageDefaultProps } from '../defaultProps';
import { v4 as uuidv4 } from 'uuid';
import { ComponentData } from '@/store/editor';
import { UploadResp } from '@/extraType';
import { getImageDimensions } from '@/helper';

export default defineComponent({
  components: { MText, StyledUploader },
  name: 'component-list',
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  emits: ['on-item-click'],
  setup(props, context) {
    const onItemClick = (props: TextComponentProps) => {
      const newComponent: ComponentData = {
        id: uuidv4(),
        name: 'm-text',
        props,
      };
      context.emit('on-item-click', newComponent);
    };
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
        const maxWidth = 373;
        componentData.props.width = (width < maxWidth ? width : maxWidth) + 'px';
        context.emit('on-item-click', componentData);
        console.log(width, componentData.props.width, '=====');
      });
    };

    return {
      onItemClick,
      onImageUploaded,
    };
  },
});
</script>

<style scoped></style>
