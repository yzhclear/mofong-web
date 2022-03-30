<template>
  <div class="editor" id="editor-layout-main">
    <a-layout>
      <a-layout-sider width="300" style="background: yellow">
        <div class="sidebar-container">
          <component-list :list="defaultTextTemplates" @onItemClick="addItem" />
        </div>
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
        <a-tabs type="card" v-model:activeKey="activePanel">
          <a-tab-pane key="component" tab="属性设置" class="no-top-radius">
            <div v-if="currentComponent && currentComponent.props">
              <props-table v-if="!currentComponent.isLocked" @change="handleChange" :props="currentComponent.props"> </props-table>
              <div v-else>
                <a-empty>
                  <template #description>
                    <p>该元素被锁定，无法编辑</p>
                  </template>
                </a-empty>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="layer" tab="图层设置">
            <layer-list :list="components" :selectedId="currentComponent && currentComponent.id" @change="handleChange" @select="setActive"> </layer-list>
          </a-tab-pane>
        </a-tabs>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';
import MText from '../components/MText.vue';
import MImage from '../components/MImage.vue';
import ComponentList from '../components/ComponentList.vue';
import LayerList from '../components/LayerList.vue';
import EditorWrapper from '../components/EditorWrapper.vue';
import PropsTable from '../components/PropsTable.vue';
import { GlobalDataProps } from '../store/index';
import { defaultTextTemplates } from '../defaultTemplates';
import { ComponentData } from '../store/editor';

export type TabType = 'component' | 'layer' | 'page';

export default defineComponent({
  name: 'editor',
  components: { MText, MImage, ComponentList, EditorWrapper, PropsTable, LayerList },
  setup() {
    const store = useStore<GlobalDataProps>();
    const activePanel = ref<TabType>('component');
    const components = computed(() => store.state.editor.components);

    const addItem = (component: any) => {
      store.commit('addComponent', component);
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
      activePanel,
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
