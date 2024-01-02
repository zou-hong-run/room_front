export interface RoleResultType {
  id: number;
  role_name: string;
  role_key: string;
  create_time: string;
  update_time: string;
  remark: string;
}
export type RoleListResultType = RoleResultType[];

export interface CreateRoleType {
  role_name: string;
  role_key: string;
  menu_ids: number[];
  remark: string;
}
export type CreateRoleResultType = string;
