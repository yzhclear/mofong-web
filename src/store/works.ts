import axios from 'axios';
import { Module } from 'vuex';
import store, { GlobalDataProps, asyncAndCommit } from './index';
import { PageData } from './editor';
import { RespData, RespListData } from './respTypes';
import { objToQueryString } from '../helper';

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
    getWorks(state, { data, extraData }) {
      const { searchText } = extraData;
      const { list, count } = data.data;

      state.works = list;
      state.totalWorks = count;
      state.searchText = searchText || '';
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
  },
  getters: {
    getTemplateById: (state) => (id: number) => {
      return state.templates.find((t) => t.id === id);
    },
  },
};

export default workModule;
