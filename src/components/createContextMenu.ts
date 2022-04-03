import { createVNode, render } from 'vue';
import ContextMenu from './ContextMenu.vue';

export interface ActionItem {
  action: (id: string) => void;
  text: string;
  shortcut: string;
}

const createContextMenu = (actions: ActionItem[], triggerClass = 'edit-wrapper') => {
  const container = document.createElement('div');

  const options = {
    actions,
    triggerClass,
  };
  const vm = createVNode(ContextMenu, options);

  render(vm, container);
  document.body.appendChild(container);

  // 离开 editor 路由时进行销毁
  return () => {
    render(null, container);
    document.body.removeChild(container);
  };
};

export default createContextMenu;
