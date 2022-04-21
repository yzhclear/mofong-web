import { createStore, Commit } from 'vuex';
import axios, { AxiosRequestConfig } from 'axios';
import works, { WorkProp, WorksProp } from './works';
import user, { UserProps } from './user';
import editor, { EditorDataProps } from './editor';

export interface GlobalStatus {
  loading: boolean;
  error: any;
  opName?: string;
}
export interface GlobalDataProps {
  // 全局状态，loading，error 等
  status: GlobalStatus;
  user: UserProps;
  works: WorksProp;
  editor: EditorDataProps;
}

export type ICustomAxiosConfig = AxiosRequestConfig & {
  mutationName: string;
};

export const asyncAndCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
  const newConfig: ICustomAxiosConfig = { ...config, mutationName };
  const { data } = await axios(url, newConfig);
  if (extraData) {
    commit(mutationName, { data, extraData });
  } else {
    commit(mutationName, data);
  }
  return data;
};

const store = createStore<GlobalDataProps>({
  state: {
    user: {} as UserProps,
    status: { loading: false, error: { status: false, message: '' }, opName: '' },
    editor: {} as EditorDataProps,
    works: {} as WorksProp,
  },
  modules: {
    works,
    user,
    editor,
  },
  mutations: {
    setLoading(state, { status, opName }) {
      state.status.loading = status;
      if (opName) {
        state.status.opName = opName;
      }
    },
    setError(state, e) {
      state.status.error = e;
    },
  },
});

export default store;
