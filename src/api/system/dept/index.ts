import request, { Response } from '@/utils/request';
import {
  CreateDeptParamType,
  CreateDeptResultType,
  DeptListResultType,
} from './types';

export const getDeptList = () => {
  return request<any, Response<DeptListResultType>>({
    url: '/dept/list',
    method: 'get',
  });
};
export const addDept = (createDeptParam: CreateDeptParamType) => {
  return request<any, Response<CreateDeptResultType>>({
    url: '/dept/create',
    method: 'post',
    data: createDeptParam,
  });
};
