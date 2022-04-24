import { Module } from 'vuex';
import store, { GlobalDataProps, asyncAndCommit } from './index';
import { PageData } from './editor';
import { RespData, RespListData } from './respTypes';
import { objToQueryString } from '../helper';
import { baseStaticURL } from '@/main';

export type WorkProp = Required<Omit<PageData, 'props' | 'setting'>> & {
  barcodeUrl?: string; // 二维码
};

export interface StaticProps {
  eventDate: string;
  eventData: { pv: number };
  eventKey: string;
  _id: string;
}

export interface WorksProp {
  templates: WorkProp[];
  works: WorkProp[];
  statics: { id: number; name: string; list: StaticProps[] }[];
  totalWorks: number;
  totalTemplates: number;
  searchText: string;
}

const workModule: Module<WorksProp, GlobalDataProps> = {
  state: {
    templates: [],
    works: [],
    totalWorks: 0,
    statics: [],
    totalTemplates: 0,
    searchText: '',
  },
  mutations: {
    getTemplates(state, { data, extraData }) {
      const { pageIndex, searchText } = extraData;
      const { list, count } = data.data;
      if (pageIndex === 0) {
        state.templates = list;
      } else {
        state.templates = [...state.templates, ...list];
      }
      state.totalTemplates = count;
      state.searchText = searchText || '';
    },
    getTemplate(state, { data }) {
      state.templates = [data];
    },
    deleteWork(state, { extraData }) {
      state.works = state.works.filter((work) => work.id !== extraData.id);
    },
    getWorks(state, { data, extraData }) {
      const { searchText } = extraData;
      const { list, count } = data.data;

      state.works = list;
      state.totalWorks = count;
      state.searchText = searchText || '';
    },
    transferWork(state, { data, extraData }) {
      if (data.errno === 0) {
        state.works = state.works.filter((work) => work.id !== extraData.id);
      }
    },
    clearStatic(state) {
      state.statics = [];
    },
  },
  actions: {
    fetchTemplates({ commit }, queryObj = { pageIndex: 0, pageSize: 8, title: '' }) {
      if (!queryObj.title) {
        delete queryObj.title;
      }
      const queryString = objToQueryString(queryObj);
      return asyncAndCommit(`/templates?${queryString}`, 'getTemplates', commit, { method: 'get' }, { pageIndex: queryObj.pageIndex, searchText: queryObj.title });
    },
    fetchTemplate({ commit }, id) {
      return asyncAndCommit(`/templates/${id}`, 'getTemplate', commit);
    },
    fetchWorks({ commit }, queryObj = { pageIndex: 0, pageSize: 8, title: '' }) {
      if (!queryObj.title) {
        delete queryObj.title;
      }
      const queryString = objToQueryString(queryObj);
      return asyncAndCommit(`/works?${queryString}`, 'getWorks', commit, { method: 'get' }, { pageIndex: queryObj.pageIndex, searchText: queryObj.title });
    },
    deleteWork({ commit }, id) {
      return asyncAndCommit(`/works/${id}`, 'deleteWork', commit, { method: 'delete' }, { id });
    },
    fetchStatic({ commit }, queryObj) {
      const newObj = { category: 'h5', action: 'pv', ...queryObj };
      const queryString = objToQueryString(newObj);
      return asyncAndCommit(`${baseStaticURL}/api/event?${queryString}`, 'fetchStatic', commit, { method: 'get' }, { name: queryObj.name, id: queryObj.label });
    },
    transferWork({ commit }, { id, username }) {
      return asyncAndCommit(`/works/transfer/${id}/${username}`, 'transferWork', commit, { method: 'post' }, { id });
    },
  },
  getters: {
    getTemplateById: (state) => (id: number) => {
      return state.templates.find((t) => t.id === id);
    },
  },
};

export default workModule;
