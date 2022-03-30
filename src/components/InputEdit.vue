<template>
  <div class="inline-edit" @click.stop="handleClick" ref="wrapper">
    <a-input v-model:value="innerValue" v-if="isEditing" placeholder="文本不能为空" ref="inputRef" />
    <slot v-else></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, ref, watch } from 'vue';
import useKeyPress from '../hooks/useKeyPress';
import useClickOutside from '../hooks/useClickOutside';

export default defineComponent({
  name: 'input-edit',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  emits: ['clicked', 'change'],
  setup(props, context) {
    const isEditing = ref(false);
    let cachedOldValue = '';
    const innerValue = ref(props.value);
    const inputRef = ref<null | HTMLInputElement>(null);
    watch(isEditing, async (newVal) => {
      if (newVal) {
        cachedOldValue = innerValue.value;
        await nextTick();
        inputRef.value?.focus();
      }
    });

    useKeyPress('Enter', () => {
      if (isEditing.value) {
        isEditing.value = false;
        context.emit('change', innerValue.value);
      }
    });

    useKeyPress('Escape', () => {
      if (isEditing.value) {
        isEditing.value = false;
        innerValue.value = cachedOldValue;
      }
    });

    // 是否点击容器外部
    const wrapper = ref<null | HTMLElement>(null);
    const isClickOutside = useClickOutside(wrapper);
    watch(isClickOutside, (newVal) => {
      if (newVal && isEditing.value) {
        isEditing.value = false;
        context.emit('change', innerValue.value);
      }
      isClickOutside.value = false;
    });

    const handleClick = () => {
      isEditing.value = true;
    };

    return {
      isEditing,
      innerValue,
      inputRef,
      wrapper,
      handleClick,
    };
  },
});
</script>

<style>
.inline-edit {
  cursor: pointer;
}
.input-error {
  border: 1px solid #f5222d;
}
.input-error:focus {
  border-color: #f5222d;
}
.input-error::placeholder {
  color: #f5222d;
}
</style>
