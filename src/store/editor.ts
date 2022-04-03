import { Module } from 'vuex';
import { v4 } from 'uuid';
import { message } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';
import store, { GlobalDataProps } from './index';
import { textDefaultProps, imageDefaultProps } from '@/defaultProps';
import { insertArr, UploadImgProps } from '../helper';

type MoveDirection = 'Up' | 'Down' | 'Left' | 'Right';

export interface HistoryProps {
  id: string;
  componentId: string;
  type: 'add' | 'delete' | 'modify';
  data: any;
  index?: number;
}

export interface EditorDataProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[];
  // 当前编辑的元素
  currentElement: string;
  // 当前editor页面信息
  page: PageData;
  // 复制的component
  copiedComponent?: ComponentData;
  // 历史记录
  histories: HistoryProps[];
  // 历史记录的当前位置
  historyIndex: number;
  // 缓存的旧的值, 为 input 防抖时的撤销缓存
  cachedOldValue: any;
  // 历史记录保存的最大条数
  maxHistoriesNumber: number;
}

export interface ComponentData {
  props: { [key: string]: any };
  id: string;
  name: 'm-text' | 'm-image' | 'm-shape'; // 业务组件名称
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

const modifyHistory = (type: 'undo' | 'redo', history: HistoryProps, state: EditorDataProps) => {
  const { data, componentId } = history;
  const updateComponent = state.components.find((component) => component.id === componentId);
  const { key, oldValue, newValue } = data;
  if (updateComponent) {
    if (Array.isArray(key) && Array.isArray(oldValue)) {
      key.forEach((keyName: string, index) => {
        updateComponent.props[keyName] = type === 'undo' ? oldValue[index] : newValue[index];
      });
    } else if (typeof key === 'string' && typeof oldValue === 'string') {
      updateComponent.props[key] = type === 'undo' ? oldValue : newValue;
    }
  }
};

const pushHistory = (state: EditorDataProps, historyRecord: HistoryProps) => {
  if (state.historyIndex !== -1) {
    // history index 移动过, 需要删除 index 后面的 history
    state.histories = state.histories.slice(0, state.historyIndex);
    // 重置 historyIndex 为 未移动过
    state.historyIndex = -1;
  }

  // 历史记录是否小于最大保存条目
  if (state.histories.length < state.maxHistoriesNumber) {
    state.histories.push(historyRecord);
  } else {
    // 删除第一项
    state.histories.shift();
    // 添加为最后一项
    state.histories.push(historyRecord);
  }
};

const debounceChange = (callback: (...args: any) => void, timeout = 1000) => {
  let timer = 0;
  return (...args: any) => {
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(() => {
      callback(...args);
    }, timeout);
  };
};

const pushModifyHistory = (state: EditorDataProps, { key, value, id }: any) => {
  pushHistory(state, {
    id: v4(),
    type: 'modify',
    componentId: id || state.currentElement,
    data: {
      oldValue: state.cachedOldValue,
      newValue: value,
      key,
    },
  });

  // 清空缓存值
  state.cachedOldValue = null;
};

const pushHistoryDebounce = debounceChange(pushModifyHistory);

const editor: Module<EditorDataProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
    page: {
      titile: 'test background',
      props: pageDefaultProps,
    },
    histories: [],
    historyIndex: -1,
    cachedOldValue: null,
    maxHistoriesNumber: 5,
  },
  mutations: {
    resetEditor: (state) => {
      state.components = [];
      state.historyIndex = -1;
      state.histories = [];
      state.currentElement = '';
    },
    addComponent: (state, component: ComponentData) => {
      component.layerName = '图层' + (state.components.length + 1);
      state.components.push(component);

      // 记录当前操作
      pushHistory(state, {
        id: v4(),
        componentId: component.id,
        type: 'add',
        data: cloneDeep(component),
      });
    },
    setActive: (state, payload: string) => {
      state.currentElement = payload;
    },
    updateComponentProps: (state, { key, value, id, isRoot }) => {
      const needUpdateComponent = state.components.find((item) => item.id === (id || state.currentElement));
      if (needUpdateComponent) {
        // 更改根属性 isLocked, isHidden, layerName
        if (isRoot) {
          (needUpdateComponent as any)[key as string] = value;
        } else {
          const oldValue = Array.isArray(value) ? key.map((k: string) => needUpdateComponent.props[k]) : needUpdateComponent.props[key];
          if (!state.cachedOldValue) {
            state.cachedOldValue = oldValue;
          }
          // 记录当前操作
          pushHistoryDebounce(state, { key, value, id });

          if (Array.isArray(key) && Array.isArray(value)) {
            key.forEach((keyName: string, index) => {
              needUpdateComponent.props[keyName] = value[index];
            });
          } else if (typeof key === 'string' && typeof value === 'string') {
            needUpdateComponent.props[key] = value;
          }
        }
      }
    },
    updatePage: (state, { key, value }) => {
      state.page.props[key as keyof PageProps] = value;
    },
    copyComponent: (state, id: string) => {
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

        // 记录当前操作
        pushHistory(state, {
          id: v4(),
          componentId: cloneComponent.id,
          type: 'add',
          data: cloneDeep(cloneComponent),
        });
      }
    },
    deleteComponent: (state, id: string) => {
      const currentComponent = state.components.find((item) => item.id === (id || state.currentElement));
      const currentIndex = state.components.findIndex((item) => item.id === (id || state.currentElement));
      if (currentComponent) {
        state.components = state.components.filter((component) => component.id !== (id || state.currentElement));
        message.success('已删除当前图层', 1);

        // 记录当前操作
        // data 的 component 需要clone, 因为被删除后就不会再被修改数据了
        pushHistory(state, {
          id: v4(),
          componentId: currentComponent.id,
          type: 'delete',
          index: currentIndex,
          data: currentComponent,
        });
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
    undo: (state) => {
      // never undo before
      if (state.historyIndex === -1) {
        state.historyIndex = state.histories.length - 1;
      } else {
        state.historyIndex--;
      }

      const history = state.histories[state.historyIndex];
      switch (history.type) {
        case 'add':
          state.components = state.components.filter((component) => component.id !== history.componentId);
          break;
        case 'delete':
          state.components = insertArr(state.components, history.index as number, history.data);
          break;
        case 'modify': {
          modifyHistory('undo', history, state);
          break;
        }
        default:
          break;
      }
    },
    redo: (state) => {
      if (state.historyIndex === -1) {
        return;
      }

      const history = state.histories[state.historyIndex];
      switch (history.type) {
        case 'add':
          state.components.push(history.data);
          break;
        case 'delete':
          state.components = state.components.filter((component) => component.id !== history.componentId);
          break;
        case 'modify': {
          modifyHistory('redo', history, state);
          break;
        }
        default:
          break;
      }
      state.historyIndex++;
    },
  },
  getters: {
    getCurrentComponent: (state) => {
      return state.components.find((item) => item.id === state.currentElement);
    },
    checkUndoDisable: (state) => {
      // 1. 无历史记录
      // 2. 所在历史记录索引已经在第一位
      if (state.histories.length === 0 || state.historyIndex === 0) {
        return true;
      }
      return false;
    },
    checkRedoDisable: (state) => {
      // 1. 无历史记录
      // 2. 所在历史记录索引已经在最后一位
      // 3. never undo before
      if (state.histories.length === 0 || state.historyIndex === state.histories.length || state.historyIndex === -1) {
        return true;
      }
      return false;
    },
  },
};

export default editor;
