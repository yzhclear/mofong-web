<template>
  <div @click.prevent="handleClick" :style="styleProps" class="m-shape-component" :draggable="false"></div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import useComponentCommon from '@/hooks/useComponentCommon';
import { shapeStyleProps, transformToComponentProps, shapeDefaultProps } from '@/defaultProps';
const defaultProps = transformToComponentProps(shapeDefaultProps);

export default defineComponent({
  name: 'm-shape',
  props: {
    ...defaultProps,
  },
  setup(props) {
    const { styleProps, handleClick } = useComponentCommon(props, shapeStyleProps);
    return {
      styleProps,
      handleClick,
    };
  },
});
</script>
