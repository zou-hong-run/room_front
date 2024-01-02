import request, { Response } from '@/utils/request';
import {
  CreateUserResultType,
  CreateUserType,
  UserListResultType,
} from './types';
import { queryParamType } from '@/views/system/user/index.vue';

export const getUserList = (queryParam: queryParamType) => {
  return request<any, Response<UserListResultType>>({
    url: '/user/list',
    method: 'get',
    params: {
      ...queryParam,
    },
  });
};
export const addUser = (crateUserParam: CreateUserType) => {
  return request<any, Response<CreateUserResultType>>({
    url: '/user/create',
    method: 'post',
    data: {
      ...crateUserParam,
    },
  });
};
