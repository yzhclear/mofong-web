<template>
  <div class="mofong-icon-switch" @click.prevent="onChange">
    <a-tooltip>
      <template v-slot:title>
        {{ tip }}
      </template>
      <a-button :type="checked ? 'primary' : 'default'" shape="circle">
        <template v-slot:icon><component :is="iconName" /></template>
      </a-button>
    </a-tooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  name: 'IconSwitch',
  components: {
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
  },
  props: {
    iconName: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    tip: {
      type: String,
    },
  },
  emits: ['change'],
  setup(props, context) {
    const onChange = () => {
      context.emit('change', !props.checked);
    };
    return {
      onChange,
    };
  },
});
</script>

<style></style>
