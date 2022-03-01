<template>
  <div class="editor" id="editor-layout-main">
    <a-layout>
      <a-layout-sider width="300" style="background: yellow">
        <div class="sidebar-container"><component-list :list="defaultTextTemplates" @onItemClick="addItem" /></div>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content>
          <p>画布区域</p>
          <div class="preview-list" id="canvas-area">
            <editor-wrapper
              v-for="component in components"
              :key="component.id"
              :id="component.id"
              @onSetActive="setActive(component.id)"
              :active="component.id === (currentComponent && currentComponent.id)"
            >
              <component :is="component.name" v-bind="component.props" />
            </editor-wrapper>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout-sider width="300" style="background: #fff">
        <props-table v-if="currentComponent && currentComponent.props" @change="handleChange" :props="currentComponent.props" />
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import MText from '../components/MText.vue';
import ComponentList from '../components/ComponentList.vue';
import EditorWrapper from '../components/EditorWrapper.vue';
import PropsTable from '../components/PropsTable.vue';
import { GlobalDataProps } from '../store/index';
import { TextComponentProps } from '../defaultProps';
import { defaultTextTemplates } from '../defaultTemplates';
import { ComponentData } from '../store/editor';

export default defineComponent({
  name: 'editor',
  components: { MText, ComponentList, EditorWrapper, PropsTable },
  setup() {
    const store = useStore<GlobalDataProps>();
    const components = computed(() => store.state.editor.components);

    const addItem = (props: Partial<TextComponentProps>) => {
      store.commit('addComponent', props);
    };
    const setActive = (id: string) => {
      store.commit('setActive', id);
    };
    const handleChange = (e: any) => {
      store.commit('updateComponentProps', e);
    };
    const currentComponent = computed<ComponentData | null>(() => store.getters.getCurrentComponent);
    return {
      components,
      defaultTextTemplates,
      addItem,
      setActive,
      currentComponent,
      handleChange,
    };
  },
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
.preview-list {
  position: relative;
}
</style>
