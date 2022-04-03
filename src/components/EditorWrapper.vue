<template>
  <div class="edit-wrapper" @mousedown="startMove" :style="styles" @click="onItemClick" :class="{ active: active }" ref="editWrapper" :data-component-id="id">
    <slot></slot>
    <div class="resizers">
      <div class="resizer top-left" @mousedown.stop="startResize($event, 'top-left')"></div>
      <div class="resizer top-right" @mousedown.stop="startResize($event, 'top-right')"></div>
      <div class="resizer bottom-left" @mousedown.stop="startResize($event, 'bottom-left')"></div>
      <div class="resizer bottom-right" @mousedown.stop="startResize($event, 'bottom-right')"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref } from 'vue';
import { pick } from 'lodash-es';

type ResizeDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface OriginalPositions {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export default defineComponent({
  name: 'editor-wrapper',
  props: {
    id: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    props: {
      type: Object,
    },
  },
  emits: ['on-set-active', 'update-positon'],
  setup(props, context) {
    const editWrapper = ref<null | HTMLElement>(null);
    const styles = computed(() => {
      return pick(props.props, ['width', 'height', 'position', 'left', 'top']);
    });
    const onItemClick = () => {
      context.emit('on-set-active', props.id);
    };
    // ------- 拖动 -------
    const gap = {
      x: 0,
      y: 0,
    };
    let isMoving = false;
    const calculateMovePosition = (e: MouseEvent) => {
      const container = document.getElementById('canvas-area') as HTMLElement;
      const left = e.clientX - gap.x - container.getBoundingClientRect().left;
      const top = e.clientY - gap.y - container.getBoundingClientRect().top;
      return {
        left,
        top,
      };
    };
    const startMove = (e: MouseEvent) => {
      if (e.button === 0) {
        const currentElement = editWrapper.value;
        if (currentElement) {
          const { top, left } = currentElement.getBoundingClientRect();
          gap.x = e.clientX - left;
          gap.y = e.clientY - top;
        }

        const handleMouseMove = (event: MouseEvent) => {
          isMoving = true;
          const { left, top } = calculateMovePosition(event);
          if (currentElement) {
            currentElement.style.top = top + 'px';
            currentElement.style.left = left + 'px';
          }
        };
        const handleMouseUp = (event: MouseEvent) => {
          // 如果没有移动, 就不发送事件更新位置信息
          if (isMoving) {
            const { left, top } = calculateMovePosition(event);
            context.emit('update-positon', { top, left, id: props.id });
            document.removeEventListener('mousemove', handleMouseMove);
            isMoving = false;
          }

          // 清除
          nextTick(() => {
            document.removeEventListener('mouseup', handleMouseUp);
          });
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    };

    // ------ 改变大小 -------
    const calculateSize = (direction: ResizeDirection, e: MouseEvent, position: OriginalPositions) => {
      const { left, right, top, bottom } = position;
      const container = document.getElementById('canvas-area') as HTMLElement;
      const { clientX, clientY } = e;

      const rightWidth = clientX - left;
      const bottomHeight = clientY - top;
      const topHeight = bottom - clientY;
      const leftWidth = right - clientX;
      const topOffset = clientY - container.getBoundingClientRect().top + container.scrollTop;
      const leftOffset = clientX - container.getBoundingClientRect().left;

      switch (direction) {
        case 'top-left':
          return {
            width: leftWidth,
            height: topHeight,
            top: topOffset,
            left: leftOffset,
          };
        case 'top-right':
          return {
            width: rightWidth,
            height: topHeight,
            top: topOffset,
          };
        case 'bottom-left':
          return {
            width: leftWidth,
            height: bottomHeight,
            left: leftOffset,
          };
        case 'bottom-right':
          return {
            width: rightWidth,
            height: bottomHeight,
          };
        default:
          break;
      }
    };
    const startResize = (e: MouseEvent, direction: ResizeDirection) => {
      const currentElement = editWrapper.value as HTMLElement;
      const { left, top, right, bottom } = currentElement.getBoundingClientRect();
      const handleMouseMove = (event: MouseEvent) => {
        if (currentElement) {
          const size = calculateSize(direction, event, { left, top, right, bottom });
          const { style } = currentElement;
          if (size) {
            if (size.left) {
              style.left = size.left + 'px';
            }
            if (size.top) {
              style.top = size.top + 'px';
            }
            style.width = size.width + 'px';
            style.height = size.height + 'px';
          }
        }
      };

      const handleMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', handleMouseMove);
        const size = calculateSize(direction, e, { left, top, right, bottom });
        context.emit('update-positon', { ...size, id: props.id });
        // 清除
        nextTick(() => {
          document.removeEventListener('mouseup', handleMouseUp);
        });
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    return {
      styles,
      editWrapper,
      startMove,
      onItemClick,
      startResize,
    };
  },
});
</script>

<style scoped>
.edit-wrapper {
  padding: 0px;
  cursor: pointer;
  border: 1px solid transparent;
  user-select: none;
  box-sizing: content-box;
}
.edit-wrapper:hover {
  border: 1px dashed #ccc;
}
.edit-wrapper.active {
  border: 1px solid #1890ff;
  user-select: none;
  z-index: 1500;
}
.edit-wrapper .m-text-component,
.edit-wrapper .m-image-component,
.edit-wrapper .m-shape-component {
  position: static !important;
  width: 100% !important;
  height: 100% !important;
}
.edit-wrapper.active .resizers .resizer {
  width: 10px;
  height: 10px;
  border-radius: 50%; /*magic to turn square into circle*/
  background: white;
  border: 3px solid #1890ff;
  position: absolute;
  display: block;
}
.edit-wrapper .resizers .resizer.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize; /*resizer cursor*/
}
.edit-wrapper .resizers .resizer.top-right {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizers .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizers .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
</style>
