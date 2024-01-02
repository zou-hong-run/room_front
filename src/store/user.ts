import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/utils/auth';
import { defineStore } from 'pinia';
import { LoginFormData } from '@/views/login/index.vue';
import { getInfo, login, refreshToken } from '@/api/login';
import { DeptType, PostType, RoleType } from '@/api/login/types';
interface UserStoreType {
  access_token: string | null;
  refresh_token: string | null;
  user_name: string;
  nick_name: string;
  avatar: string;
  perms: string[];
  roles: RoleType[];
  depts: DeptType[];
  posts: PostType[];
}
export const useUserStore = defineStore('user', {
  state: (): UserStoreType => {
    return {
      access_token: getAccessToken(),
      refresh_token: getRefreshToken(),
      user_name: '',
      nick_name: '',
      avatar: '',
      perms: [],
      roles: [],
      depts: [],
      posts: [],
    };
  },
  actions: {
    async Login(loginFormData: LoginFormData) {
      const username = loginFormData.username;
      const password = loginFormData.password;
      const captcha = loginFormData.captcha;
      try {
        let res = await login({ username, password, captcha });
        if (res) {
          let { access_token, refresh_token } = res.data;
          this.access_token = access_token;
          this.refresh_token = refresh_token;
          setAccessToken(access_token);
          setRefreshToken(refresh_token);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async GetInfo() {
      let res = await getInfo();
      if (res.code === 200) {
        this.avatar = res.data.avatar;
        this.user_name = res.data.user_name;
        this.nick_name = res.data.nick_name;
        this.roles = res.data.roles;
        this.perms = res.data.perms;
        this.depts = res.data.depts;
        this.posts = res.data.posts;
      }
      return res;
    },
    async RefreshToken() {
      try {
        let refresh_token = getRefreshToken();
        if (refresh_token) {
          let res = await refreshToken(refresh_token);
          if (res) {
            let { access_token, refresh_token } = res.data;
            this.access_token = access_token;
            this.refresh_token = refresh_token;
            setAccessToken(access_token);
            setRefreshToken(refresh_token);
          }
          return res;
        } else {
          return Promise.reject('用户登录信息过期，请重新登录');
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },
    LogOut() {
      this.access_token = null;
      this.refresh_token = null;
      removeAccessToken();
      removeRefreshToken();
      return '退出成功';
    },
  },
});
