import axios from 'axios';
import { getAccessToken } from './auth';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/user';
import { createPinia } from 'pinia';

let pinia = createPinia();

export interface Response<T = any> {
  code: number;
  message: string;
  data: T;
}
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 10000,
  // headers: {
  //   'Content-Type': 'application/json;charset=utf-8',
  // },
});

request.interceptors.request.use(
  (config) => {
    config.headers.Authorization = 'Bearer ' + getAccessToken();
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  },
);

request.interceptors.response.use(
  async (res) => {
    // console.log('response===', res);
    console.log('response===', res.config.url);
    const config = res.config;
    const code = res.data.code || 200;
    const msg = res.data.message || '系统未知信息';
    let userStore = useUserStore(pinia);
    if (code === 401 && !config.url?.includes('/refresh')) {
      try {
        const res = await userStore.RefreshToken();
        if (res.code === 200) {
          return request(config);
        } else {
          ElMessage.error('用户登录信息过期，请重新登录');
          return Promise.reject(res.data);
        }
      } catch (error) {
        // 刷新token失败，清除用户登录信息
        userStore.LogOut();
        ElMessage.error('用户登录状态信息已过期！');
        location.href = '/';
        return Promise.reject('用户登录状态信息已过期！');
      }
    } else if (code === 500) {
      ElMessage.error({
        message: msg,
      });
      return Promise.reject('服务器尚不可用');
    } else if (code !== 200) {
      ElMessage.error({
        message: msg,
      });
      return Promise.reject(msg);
    } else {
      return Promise.resolve(res.data);
    }
  },
  (error) => {
    console.log('response error', error);
    let { message, response } = error;
    let code = response.status;
    if (code === 500) {
      ElMessage({
        message: '服务器错误',
        type: 'error',
        duration: 5 * 1000,
      });
    } else {
      ElMessage({
        message,
        type: 'error',
        duration: 5 * 1000,
      });
    }
    return Promise.reject(error);
  },
);

export default request;
