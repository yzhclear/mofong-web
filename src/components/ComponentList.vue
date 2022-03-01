<template>
  <div class="create-component-list">
    <div class="component-item" v-for="(item, index) in list" :key="index" @click="onItemClick(item)">
      <m-text v-bind="item"></m-text>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MText from './MText.vue';

export default defineComponent({
  components: { MText },
  name: 'component-list',
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  emits: ['on-item-click'],
  setup(props, context) {
    const onItemClick = (data: any) => {
      context.emit('on-item-click', data);
    };

    return {
      onItemClick,
    };
  },
});
</script>

<style scoped></style>
