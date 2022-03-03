import { Module } from 'vuex';
import { GlobalDataProps } from './index';

export interface TemplateProps {
  id: number;
  title: string;
  coverImg: string;
  author: string;
  copiedCount: number;
}

export const testData: TemplateProps[] = [
  {
    id: 1,
    coverImg: 'http://static-dev.imooc-lego.com/imooc-test/sZHlgv.png',
    title: '前端架构师直播海报',
    author: 'yzh',
    copiedCount: 1,
  },
  {
    id: 2,
    coverImg: 'http://static-dev.imooc-lego.com/imooc-test/sZHlgv.png',
    title: '前端架构师直播海报',
    author: 'yzh',
    copiedCount: 1,
  },
  {
    id: 3,
    coverImg: 'http://static-dev.imooc-lego.com/imooc-test/sZHlgv.png',
    title: '前端架构师直播海报',
    author: 'yzh',
    copiedCount: 1,
  },
  {
    id: 4,
    coverImg: 'http://static-dev.imooc-lego.com/imooc-test/sZHlgv.png',
    title: '前端架构师直播海报',
    author: 'yzh',
    copiedCount: 1,
  },
];

export interface TemplatesProps {
  data: TemplateProps[];
}

const templates: Module<TemplatesProps, GlobalDataProps> = {
  state: {
    data: testData,
  },
  getters: {
    getTemplateById: (state) => (id: number) => {
      return state.data.find((t) => t.id === id);
    },
  },
};

export default templates;
