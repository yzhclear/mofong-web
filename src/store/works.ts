import axios from 'axios';
import { Module } from 'vuex';
import store, { GlobalDataProps } from './index';
import { RespData, RespListData } from './respTypes';
import { asyncAndCommit } from './index';

export interface TemplateProps {
  id: number;
  uuid: string;
  title: string;
  coverImg: string;
  author: string;
  copiedCount: number;
  contentId: string;
  createdAt: string;
  updatedAt: string;
  desc: string;
  isHot: boolean;
  isNew: boolean;
  isPublic: boolean;
  isTemplate: boolean;
  latestPublishAt: string;
  orderIndex: number;
  publishContentId: string;
  status: number;
}

export interface TemplatesProps {
  data: TemplateProps[];
}

const templates: Module<TemplatesProps, GlobalDataProps> = {
  state: {
    data: [],
  },
  mutations: {
    getTemplates(state, rawData: RespListData<TemplateProps>) {
      state.data = rawData.data.list;
    },
  },
  actions: {
    fetchTemplates({ commit }) {
      return asyncAndCommit('/templates', 'getTemplates', commit);
    },
  },
  getters: {
    getTemplateById: (state) => (id: number) => {
      return state.data.find((t) => t.id === id);
    },
  },
};

export default templates;
