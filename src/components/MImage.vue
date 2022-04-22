<template>
  <img class="m-image-component" :src="imgSrc" :style="styleProps" @click="handleClick" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useComponentCommon from '../hooks/useComponentCommon';
import { imageDefaultProps, transformToComponentProps, imageStyleProps } from '../defaultProps';
const defaultProps = transformToComponentProps(imageDefaultProps);

export default defineComponent({
  name: 'm-image',
  props: {
    ...defaultProps,
  },
  setup(props) {
    const { styleProps, handleClick } = useComponentCommon(props, imageStyleProps);
    return {
      styleProps,
      handleClick,
    };
  },
});
</script>
<style>
.m-image-component {
  position: relative !important;
}
</style>
