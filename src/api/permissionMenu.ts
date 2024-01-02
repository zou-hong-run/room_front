import request, { Response } from '@/utils/request';
export interface MenuType {
  id: string;
  menu_name: string;
  path: string;
  component: string;
  perms: string;
  parent_id: string;
  create_time: string;
  update_time: string;
  menu_type: string;
  remark: string;
}
export interface PermissionMenuType {
  menus: MenuType[];
}
export const getPermissionMenus = () => {
  return request<any, Response<PermissionMenuType>>({
    url: '/getPermissionMenus',
    method: 'get',
  });
};
