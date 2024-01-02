import request, { Response } from '@/utils/request';
import {
  CreateMenuType,
  MenuListResultType,
  CreateMenuResultType,
} from './types';

export const getMenuList = () => {
  return request<any, Response<MenuListResultType>>({
    url: '/menu/list',
    method: 'get',
  });
};
export const addMenu = (createMenuParam: CreateMenuType) => {
  return request<any, Response<CreateMenuResultType>>({
    url: '/menu/create',
    method: 'post',
    data: createMenuParam,
  });
};
