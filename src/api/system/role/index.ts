import request, { Response } from '@/utils/request';
import {
  CreateRoleType,
  RoleListResultType,
  CreateRoleResultType,
} from './types';

export const getRoleList = () => {
  return request<any, Response<RoleListResultType>>({
    url: '/role/list',
    method: 'get',
  });
};
export const addRole = (createRoleParam: CreateRoleType) => {
  return request<any, Response<CreateRoleResultType>>({
    url: '/role/create',
    method: 'post',
    data: createRoleParam,
  });
};
