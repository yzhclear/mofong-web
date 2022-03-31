import { Module } from 'vuex';
import { v4 } from 'uuid';
import { GlobalDataProps } from './index';
import { textDefaultProps, imageDefaultProps } from '@/defaultProps';

export interface EditorDataProps {
  components: ComponentData[];
  currentElement: string;

  page: PageData;
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
    props: { ...textDefaultProps, text: 'hello', fontSize: '20px', color: '#000000', lineHeight: '1', textAlign: 'left', fontFamily: '', fontWeight: '', fontStyle: '', textDecoration: '' },
    name: 'm-text',
    layerName: '图层一',
  },
  {
    id: v4(),
    props: { ...textDefaultProps, text: 'heihei', fontSize: '10px', fontWeight: 'bold', color: 'red', lineHeight: '2', textAlign: 'left', fontFamily: '' },
    name: 'm-text',
    layerName: '图层二',
  },
  {
    id: v4(),
    props: { ...textDefaultProps, text: 'hello1', fontSize: '15px', textAlign: 'left', fontFamily: '' },
    name: 'm-text',
    layerName: '图层三',
  },
  {
    id: v4(),
    props: { ...textDefaultProps, text: 'hello2', actionType: 'url', url: 'https://www.baidu.com' },
    name: 'm-text',
    layerName: '图层四',
  },
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
  backgroundImage: 'url("http://mofong.oss-cn-hangzhou.aliyuncs.com/upload-files/file-404525")',
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
  },
  getters: {
    getCurrentComponent: (state) => {
      return state.components.find((item) => item.id === state.currentElement);
    },
  },
};

export default editor;
