import { Module } from 'vuex';
import { v4 } from 'uuid';
import { GlobalDataProps } from './index';
import { TextComponentProps } from '../defaultProps';

export interface EditorDataProps {
  components: ComponentData[];
  currentElement: string;
}

export interface ComponentData {
  props: { [key: string]: any };
  id: string;
  name: string; // 业务组件名称
}

export const testComponents: ComponentData[] = [
  {
    id: v4(),
    props: { text: 'hello', fontSize: '20px', color: '#000000', lineHeight: '1', textAlign: 'left', fontFamily: '' },
    name: 'm-text',
  },
  {
    id: v4(),
    props: { text: 'heihei', fontSize: '10px', fontWeight: 'bold', color: 'red', lineHeight: '2', textAlign: 'left', fontFamily: '' },
    name: 'm-text',
  },
  {
    id: v4(),
    props: { text: 'hello1', fontSize: '15px', textAlign: 'left', fontFamily: '' },
    name: 'm-text',
  },
  {
    id: v4(),
    props: { text: 'hello2', actionType: 'url', url: 'https://www.baidu.com' },
    name: 'm-text',
  },
];

const editor: Module<EditorDataProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
  },
  mutations: {
    addComponent: (state, props: Partial<TextComponentProps>) => {
      const newComponent: ComponentData = {
        id: v4(),
        name: 'm-text',
        props,
      };
      state.components.push(newComponent);
    },
    setActive: (state, payload: string) => {
      state.currentElement = payload;
    },
    updateComponentProps: (state, { key, value }) => {
      const needUpdateComponent = state.components.find((item) => item.id === state.currentElement);
      if (needUpdateComponent) {
        needUpdateComponent.props[key] = value;
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
