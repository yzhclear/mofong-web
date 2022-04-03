<template>
  <div class="context-menu-component menu-container" ref="menuRef">
    <a-menu mode="vertical" style="width: 220px; border: 1px solid #ccc" :selectable="false">
      <a-menu-item v-for="(action, index) in actions" :key="index" @click="action.action(componentId)">
        <span class="item-text">{{ action.text }}</span>
        <span class="item-shortcut">{{ action.shortcut }}</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script lang="ts">
import { clickInsideElement } from '@/helper';
import { defineComponent, onMounted, ref, onUnmounted, PropType } from 'vue';
import { ActionItem } from '@/components/createContextMenu';

export default defineComponent({
  props: {
    actions: {
      type: Array as PropType<ActionItem[]>,
      required: true,
    },
    triggerClass: {
      type: String,
      default: 'edit-wrapper',
    },
  },
  setup(props, context) {
    const menuRef = ref<HTMLElement | null>(null);
    const componentId = ref('');

    const triggerContextMenu = (e: MouseEvent) => {
      const domElement = menuRef.value as HTMLElement;
      e.preventDefault();
      const wrapperEle = clickInsideElement(e, props.triggerClass);
      if (wrapperEle) {
        domElement.style.display = 'block';
        domElement.style.top = e.pageY + 'px';
        domElement.style.left = e.pageX + 'px';

        const cid = wrapperEle.dataset.componentId;
        if (cid) {
          componentId.value = cid;
        }
      }
    };
    const handleClick = () => {
      const domElement = menuRef.value as HTMLElement;
      domElement.style.display = 'none';
    };

    onMounted(() => {
      document.addEventListener('contextmenu', triggerContextMenu);
      document.addEventListener('click', handleClick);
    });
    onUnmounted(() => {
      document.removeEventListener('contextmenu', triggerContextMenu);
      document.removeEventListener('click', handleClick);
    });

    return {
      menuRef,
      componentId,
    };
  },
});
</script>

<style>
.menu-container {
  display: none;
  position: absolute;
  background: #fff;
  z-index: 2000;
}
.menu-container .ant-menu-item {
  display: flex;
  justify-content: space-between;
}
.menu-container .ant-menu-item:hover {
  background: #efefef;
}
.ant-menu-item .item-shortcut {
  color: #ccc;
}
</style>
