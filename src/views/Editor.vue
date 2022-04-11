<template>
  <div class="editor" id="editor-layout-main">
    <a-modal title="发布成功" v-model:visible="showModal" width="700px" :footer="null">
      <publish-form></publish-form>
    </a-modal>
    <preview-form
      :isSaving="isSaving"
      :isPublishing="isPublishing"
      :visible="showPreviewForm"
      @panel-close="showPreviewForm = false"
      @trigger-publish="publishWork"
      @trigger-save="saveWork(true)"
    ></preview-form>
    <a-layout>
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">
            <img alt="Vue logo" src="../assets/logo-simple.png" class="logo-img" />
          </router-link>
          <input-edit :value="page.title" @change="titleChange">
            <h4>{{ page.title }}</h4>
          </input-edit>
        </div>
        <a-menu :selectable="false" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
          <a-menu-item key="1">
            <a-button type="primary" @click="preview">预览和设置</a-button>
          </a-menu-item>
          <a-menu-item key="2">
            <a-button type="primary" @click="saveWork">保存</a-button>
          </a-menu-item>
          <a-menu-item key="3">
            <a-button type="primary" @click="publishWork" :loading="isPublishing">发布</a-button>
          </a-menu-item>
          <a-menu-item key="4">
            <user-profile :user="user"></user-profile>
          </a-menu-item>
        </a-menu>
      </a-layout-header>
    </a-layout>
    <a-layout>
      <a-layout-sider width="300" style="background: yellow">
        <div class="sidebar-container">
          <component-list :list="defaultTextTemplates" @onItemClick="addItem" />
          <img id="test-img" :style="{ width: '300px' }" />
        </div>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container">
          <p>画布区域</p>
          <history-area></history-area>

          <div class="preview-list" id="canvas-area" :class="{ 'canvas-fix': canvasFix }">
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
import { defineComponent, computed, ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useRoute, onBeforeRouteLeave } from 'vue-router';
import { Modal } from 'ant-design-vue';
import { pickBy } from 'lodash-es';
import initHotKeys from '../plugins/hotKey';
import initContextMenu from '../plugins/contextMenu';
import HistoryArea from './HistoryArea.vue';
import MText from '../components/MText.vue';
import MImage from '../components/MImage.vue';
import ComponentList from '../components/ComponentList.vue';
import LayerList from '../components/LayerList.vue';
import EditorWrapper from '../components/EditorWrapper.vue';
import PropsTable from '../components/PropsTable.vue';
import EditGroup from '../components/EditGroup.vue';
import InputEdit from '../components/InputEdit.vue';
import UserProfile from '../components/UserProfile.vue';
import PublishForm from './PublishForm.vue';
import PreviewForm from './PreviewForm.vue';
import { GlobalDataProps } from '../store/index';
import defaultTextTemplates from '../defaultTemplates';
import { ComponentData } from '../store/editor';
import { takeScreenshotAndUpload } from '@/helper';

export type TabType = 'component' | 'layer' | 'page';

export default defineComponent({
  name: 'editor',
  components: { MText, MImage, ComponentList, EditorWrapper, PropsTable, LayerList, EditGroup, HistoryArea, InputEdit, UserProfile, PublishForm, PreviewForm },
  setup() {
    // 初始化快捷键
    initHotKeys();
    // 初始化快捷键菜单
    initContextMenu();

    const store = useStore<GlobalDataProps>();
    const route = useRoute();
    const workId = route.params.id;
    const activePanel = ref<TabType>('component');
    const isSaving = ref(false);
    const isPublishing = ref(false);
    const components = computed(() => store.state.editor.components);
    const isDirty = computed(() => store.state.editor.isDirty);
    const currentComponent = computed<ComponentData | null>(() => store.getters.getCurrentComponent);
    const user = computed(() => store.state.user);
    const page = computed(() => store.state.editor.page);
    const channels = computed(() => store.state.editor.channels);
    let timer: any;
    onMounted(() => {
      // 清空 editor 中数据
      store.commit('resetEditor');

      // 获取 work 数据
      if (workId) {
        store.dispatch('fetchWork', workId);
      }

      // 自动保存
      timer = setInterval(() => {
        if (isDirty.value) {
          saveWork();
        }
      }, 1000 * 30);
    });
    onUnmounted(() => {
      clearInterval(timer);
    });

    onBeforeRouteLeave((to, from, next) => {
      // 有修改 未保存
      if (isDirty.value) {
        Modal.confirm({
          title: '作品还未保存，是否保存？',
          okText: '保存',
          okType: 'primary',
          cancelText: '不保存',
          onOk: async () => {
            await saveWork();
            next();
          },
          onCancel() {
            next();
          },
        });
      } else {
        next();
      }
    });

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
    const titleChange = (newTitle: string) => {
      store.commit('updatePage', { key: 'title', value: newTitle, isRoot: true });
    };
    const handleUpdatePosition = (e: any) => {
      const { id } = e;
      const updateProps = pickBy(e, (v, k) => k !== 'id');
      const keyArr = Object.keys(updateProps);
      const valueArr = Object.values(updateProps).map((v) => v + 'px');
      store.commit('updateComponentProps', { key: keyArr, value: valueArr, id });
    };

    // ----- 保存作品 ------
    const saveWork = () => {
      store.dispatch('fetchSaveWork', { id: workId });
    };

    // ----- 发布作品 ------
    const canvasFix = ref(false); // 控制样式, 解决 html2canvas 黑框及长图截屏不全问题
    const showModal = ref(false);
    const publishWork = async () => {
      isPublishing.value = true;
      // 截图时隐藏选中框
      store.commit('setActive', '');

      canvasFix.value = true;
      await nextTick();

      try {
        // 截图并上传
        const resp = await takeScreenshotAndUpload('canvas-area');
        if (resp) {
          store.commit('updatePage', { key: 'coverImg', value: resp.data.urls[0], isRoot: true });
          // 保存
          await saveWork();
          // 发布
          await store.dispatch('publishWork', workId);
          // 获取渠道
          await store.dispatch('fetchChannels', workId);
          if (channels.value.length === 0) {
            await store.dispatch('createChannel', { workId: parseInt(workId as string), name: '默认' });
          }
          showModal.value = true;
        }
      } catch (error) {
        console.error(error);
      } finally {
        canvasFix.value = false;
        isPublishing.value = false;
      }
    };

    // 预览图层
    const showPreviewForm = ref(false);
    const preview = async () => {
      await saveWork();
      showPreviewForm.value = true;
    };

    return {
      page,
      components,
      defaultTextTemplates,
      activePanel,
      currentComponent,
      user,
      canvasFix,
      isSaving,
      isPublishing,
      showModal,
      showPreviewForm,
      addItem,
      setActive,
      handleChange,
      handlePageChange,
      handleUpdatePosition,
      titleChange,
      saveWork,
      publishWork,
      preview,
    };
  },
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}
.header .logo-img {
  margin-right: 20px;
  height: 40px;
}
.page-title {
  display: flex;
}
.header h4 {
  color: #ffffff;
}
.content-container {
  background: #fff;
  padding: 0 24px 24px 30px;
  min-height: 85vh;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
.body-container {
  width: 100%;
  height: 100%;
}
.preview-container {
  padding: 24px;
  margin: 0;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
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

.preview-list.canvas-fix .edit-wrapper > * {
  box-shadow: none !important;
}
.preview-list.canvas-fix {
  position: absolute;
  max-height: none;
}
</style>
