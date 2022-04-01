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
            <div class="body-container" :style="page.props">
              <editor-wrapper
                v-for="component in components"
                :key="component.id"
                :id="component.id"
                :props="component.props"
                @onSetActive="setActive(component.id)"
                @update-positon="handleUpdatePosition"
                :active="component.id === (currentComponent && currentComponent.id)"
              >
                <component :is="component.name" v-bind="component.props" />
              </editor-wrapper>
            </div>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout-sider width="500" style="background: #fff">
        <a-tabs type="card" v-model:activeKey="activePanel">
          <a-tab-pane key="component" tab="属性设置" class="no-top-radius">
            <div v-if="currentComponent && currentComponent.props">
              <edit-group v-if="!currentComponent.isLocked" @change="handleChange" :props="currentComponent.props"> </edit-group>
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
          <a-tab-pane key="page" tab="页面设置">
            <div class="page-settings">
              <props-table :props="page.props" @change="handlePageChange"> </props-table>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { pickBy, forEach } from 'lodash-es';
import MText from '../components/MText.vue';
import MImage from '../components/MImage.vue';
import ComponentList from '../components/ComponentList.vue';
import LayerList from '../components/LayerList.vue';
import EditorWrapper from '../components/EditorWrapper.vue';
import PropsTable from '../components/PropsTable.vue';
import EditGroup from '../components/EditGroup.vue';
import { GlobalDataProps } from '../store/index';
import { defaultTextTemplates } from '../defaultTemplates';
import { ComponentData } from '../store/editor';

export type TabType = 'component' | 'layer' | 'page';

export default defineComponent({
  name: 'editor',
  components: { MText, MImage, ComponentList, EditorWrapper, PropsTable, LayerList, EditGroup },
  setup() {
    const store = useStore<GlobalDataProps>();
    const activePanel = ref<TabType>('component');
    const components = computed(() => store.state.editor.components);
    const page = computed(() => store.state.editor.page);

    const addItem = (component: any) => {
      store.commit('addComponent', component);
    };
    const setActive = (id: string) => {
      store.commit('setActive', id);
    };
    const handleChange = (e: any) => {
      store.commit('updateComponentProps', e);
    };
    const handlePageChange = (e: any) => {
      store.commit('updatePage', e);
    };
    const handleUpdatePosition = (e: any) => {
      const { id } = e;
      const updateProps = pickBy(e, (v, k) => k !== 'id');
      forEach(updateProps, (v, key) => {
        store.commit('updateComponentProps', { key, value: v + 'px', id });
      });
    };
    const currentComponent = computed<ComponentData | null>(() => store.getters.getCurrentComponent);
    return {
      page,
      components,
      defaultTextTemplates,
      activePanel,
      currentComponent,
      addItem,
      setActive,
      handleChange,
      handlePageChange,
      handleUpdatePosition,
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
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 200px;
  border: 1px solid #efefef;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  margin-top: 50px;
  max-height: 80vh;
}
</style>
