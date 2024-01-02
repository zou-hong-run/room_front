import { LoginFormData } from '@/views/login/index.vue';
import request, { Response } from '../../utils/request';
import { CaptchaResultType, LoginResultType, UserInfoType } from './types';

export const login = (loginFormData: LoginFormData) => {
  return request<any, Response<LoginResultType>>({
    url: '/login',
    method: 'post',
    data: {
      user_name: loginFormData.username,
      password: loginFormData.password,
      captcha: loginFormData.captcha,
    },
  });
};

export const getCaptcha = (username: string) => {
  return request<Response<CaptchaResultType>>({
    url: '/captcha',
    method: 'get',
    params: {
      username,
    },
  });
};

export const refreshToken = (refresh_token: string) => {
  return request<any, Response<LoginResultType>>({
    url: '/refresh',
    method: 'get',
    params: {
      refresh_token,
    },
  });
};
export const getInfo = () => {
  return request<any, Response<UserInfoType>>({
    method: 'get',
    url: '/user/info',
  });
};
