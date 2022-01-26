import { Module } from 'vuex';
import { v4 } from 'uuid';
import { GlobalDataProps } from './index';
import { TextComponentProps } from '../defaultProps';

export interface EditorDataProps {
  components: ComponentData[];
  currentElement: string;
}

interface ComponentData {
  props: { [key: string]: any };
  id: string;
  name: string; // 业务组件名称
}

const testComponents: ComponentData[] = [
  {
    id: v4(),
    props: { text: 'hello' },
    name: 'm-text',
  },
  {
    id: v4(),
    props: { text: 'heihei' },
    name: 'm-text',
  },
  {
    id: v4(),
    props: { text: 'hello1' },
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
  },
};

export default editor;
