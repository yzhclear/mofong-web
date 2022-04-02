import { Module } from 'vuex';
import { v4 } from 'uuid';
import { message } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';
import store, { GlobalDataProps } from './index';
import { textDefaultProps, imageDefaultProps } from '@/defaultProps';

type MoveDirection = 'Up' | 'Down' | 'Left' | 'Right';

export interface EditorDataProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[];
  // 当前编辑的元素
  currentElement: string;
  // 当前editor页面信息
  page: PageData;
  // 复制的component
  copiedComponent?: ComponentData;
}

export interface ComponentData {
  props: { [key: string]: any };
  id: string;
  name: string; // 业务组件名称
  // 图层是否被锁定
  isLocked?: boolean;
  // 图层是否被隐藏
  isHidden?: boolean;
  // 图层名称
  layerName?: string;
}

export interface PageData {
  props: { [key: string]: any };
  titile: string;
}

export const testComponents: ComponentData[] = [
  {
    id: v4(),
    props: {
      ...textDefaultProps,
      text: 'hello',
      width: '100px',
      height: '100px',
      fontSize: '20px',
      color: '#000000',
      lineHeight: '1',
      textAlign: 'left',
      fontFamily: '',
      fontWeight: '',
      fontStyle: '',
      textDecoration: '',
      backgroundColor: '#eee',
    },
    name: 'm-text',
    layerName: '图层一',
  },
  // {
  //   id: v4(),
  //   props: { ...textDefaultProps, text: 'heihei', fontSize: '10px', fontWeight: 'bold', color: 'red', lineHeight: '2', textAlign: 'left', fontFamily: '' },
  //   name: 'm-text',
  //   layerName: '图层二',
  // },
  // {
  //   id: v4(),
  //   props: { ...textDefaultProps, text: 'hello1', fontSize: '15px', textAlign: 'left', fontFamily: '' },
  //   name: 'm-text',
  //   layerName: '图层三',
  // },
  // {
  //   id: v4(),
  //   props: { ...textDefaultProps, text: 'hello2', actionType: 'url', url: 'https://www.baidu.com' },
  //   name: 'm-text',
  //   layerName: '图层四',
  // },
  // {
  //   id: v4(),
  //   props: { ...imageDefaultProps, imgSrc: 'http://mofong.oss-cn-hangzhou.aliyuncs.com/upload-files/file-404525' },
  //   name: 'm-image',
  //   layerName: '图层五',
  // },
];

interface PageProps {
  backgroundColor: string;
  backgroundImage: string;
  backgroundSize: string;
  backgroundRepeat: string;
  height: string;
}

const pageDefaultProps = {
  backgroundColor: '#fff',
  backgroundImage: '',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  height: '560px',
};

const editor: Module<EditorDataProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
    page: {
      titile: 'test background',
      props: pageDefaultProps,
    },
  },
  mutations: {
    addComponent: (state, component: ComponentData) => {
      component.layerName = '图层' + (state.components.length + 1);
      state.components.push(component);
    },
    setActive: (state, payload: string) => {
      state.currentElement = payload;
    },
    updateComponentProps: (state, { key, value, id, isRoot }) => {
      const needUpdateComponent = state.components.find((item) => item.id === (id || state.currentElement));
      if (needUpdateComponent) {
        // 更改根属性 isLocked, isHidden, layerName
        if (isRoot) {
          (needUpdateComponent as any)[key] = value;
        } else {
          needUpdateComponent.props[key] = value;
        }
      }
    },
    updatePage: (state, { key, value }) => {
      state.page.props[key as keyof PageProps] = value;
    },
    copyComponent: (state, { id }) => {
      const currentComponent = state.components.find((item) => item.id === (id || state.currentElement));
      if (currentComponent) {
        state.copiedComponent = currentComponent;
        message.success('已拷贝当前图层', 1);
      }
    },
    pasteCopiedComponent: (state) => {
      if (state.copiedComponent) {
        const cloneComponent = cloneDeep(state.copiedComponent);
        cloneComponent.id = v4();
        cloneComponent.layerName = cloneComponent.layerName + '复制';
        state.components.push(cloneComponent);
        message.success('已粘贴当前图层', 1);
      }
    },
    deleteComponent: (state, { id }) => {
      const currentComponent = state.components.find((item) => item.id === (id || state.currentElement));
      if (currentComponent) {
        state.components = state.components.filter((component) => component.id !== (id || state.currentElement));
        message.success('已删除当前图层', 1);
      }
    },
    moveComponent: (state, data: { direction: MoveDirection; amount: number; id: string }) => {
      const { id } = data;
      const currentComponent = state.components.find((item) => item.id === (id || state.currentElement));
      if (currentComponent) {
        const oldTop = parseInt(currentComponent.props.top || '0');
        const oldLeft = parseInt(currentComponent.props.left || '0');
        const { direction, amount } = data;
        switch (direction) {
          case 'Up': {
            const newVal = oldTop - amount + 'px';
            store.commit('updateComponentProps', { key: 'top', value: newVal, id: id });
            break;
          }
          case 'Down': {
            const newVal = oldTop + amount + 'px';
            store.commit('updateComponentProps', { key: 'top', value: newVal, id: id });
            break;
          }
          case 'Left': {
            const newVal = oldLeft - amount + 'px';
            store.commit('updateComponentProps', { key: 'left', value: newVal, id: id });
            break;
          }
          case 'Right': {
            const newVal = oldLeft + amount + 'px';
            store.commit('updateComponentProps', { key: 'left', value: newVal, id: id });
            break;
          }
          default:
            break;
        }
      }
    },
  },
  getters: {
    getCurrentComponent: (state) => {
      return state.components.find((item) => item.id === state.currentElement);
    },
  },
};

export default editor;
