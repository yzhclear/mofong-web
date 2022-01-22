<template>
  <div class="editor" id="editor-layout-main">
    <a-layout>
      <a-layout-slider width="300" style="background: yellow">
        <div class="sidebar-container">组件列表</div>
      </a-layout-slider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content>
          <p>画布区域</p>
          <div class="preview-list" id="canvas-area"></div>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <a-layout-slider width="300" style="background: purple"> 组件属性 </a-layout-slider>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  props: {},
});
</script>

<style scoped>
.content-container {
  background: #fff;
  padding: 0 24px 24px 30px;
  min-height: 85vh;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
</style>
