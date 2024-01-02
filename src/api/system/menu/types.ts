export interface CreateMenuType {
  component: string;
  menu_name: string;
  menu_type: string;
  parent_id: number | null;
  path: string;
  perms: string;
  remark: string;
}

export interface MenuResultType {
  id: number;
  component: string;
  create_time: string;
  menu_name: string;
  menu_type: string;
  parent_id: number;
  path: string;
  perms: string;
  remark: string;
  update_time: string;
}
export type MenuListResultType = MenuResultType[];

export type CreateMenuResultType = string;
