import createContextMenu, { ActionItem } from '@/components/createContextMenu';
import { onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
const initContextMenu = () => {
  const store = useStore();
  // 使用函数方式创建快捷键菜单
  const testActions: ActionItem[] = [
    {
      text: '删除图层',
      shortcut: 'Backspace / Delete',
      action: (id) => {
        store.commit('deleteComponent', id);
      },
    },
  ];
  let destroy: any;
  onMounted(() => {
    destroy = createContextMenu(testActions);
  });
  onUnmounted(() => {
    destroy();
  });
};

export default initContextMenu;
