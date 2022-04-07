import axios, { AxiosRequestConfig } from 'axios';
import { Module } from 'vuex';
import { GlobalDataProps, asyncAndCommit } from './index';
import { RespData } from './respTypes';
export interface UserDataProps {
  username?: string;
  id?: string;
  phoneNumber?: string;
  nickName?: string;
  description?: string;
  updatedAt?: string;
  createdAt?: string;
  iat?: number;
  exp?: number;
  picture?: string;
  gender?: string;
}

export interface UserProps {
  isLogin: boolean;
  data: UserDataProps;
  token?: string;
}

const user: Module<UserProps, GlobalDataProps> = {
  state: {
    isLogin: false,
    data: {},
    token: localStorage.getItem('token') || '',
  },
  mutations: {
    login(state, rawData: RespData<{ token: string }>) {
      const { token } = rawData.data;
      state.token = token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    },
    getUserInfo(state, rawData: RespData<UserDataProps>) {
      state.isLogin = true;
      state.data = { ...rawData.data };
    },
    logout(state) {
      state.token = '';
      state.isLogin = false;
      localStorage.removeItem('token');
      delete axios.defaults.headers.common.Authorization;
    },
    updateUserInfo(state) {
      console.log('更改用户信息成功');
    },
  },
  actions: {
    fetchLogin: ({ commit }, payload) => {
      return asyncAndCommit('/users/loginByPhoneNumber', 'login', commit, { method: 'post', data: payload });
    },
    fetchUserInfo: ({ commit }) => {
      return asyncAndCommit('/users/getUserInfo', 'getUserInfo', commit);
    },
    fetchLoginAndGetUserInfo({ dispatch }, payload) {
      return dispatch('fetchLogin', payload).then(() => {
        return dispatch('fetchUserInfo');
      });
    },
    fetchUpdateUserInfo: ({ commit }) => {
      const payload = {
        nickName: '殷志浩1',
        gender: 2,
      };
      return asyncAndCommit('/users/updateUserInfo', 'updateUserInfo', commit, { method: 'PATCH', data: payload });
    },
  },
};

export default user;
