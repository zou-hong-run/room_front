export interface LoginResultType {
  access_token: string;
  refresh_token: string;
}
export type CaptchaResultType = string;
export interface RoleType {
  id: number;
  role_name: string;
  role_key: string;
  create_time: string;
  update_time: string;
  remark: string;
  menu: string;
  dept: string;
}
export interface DeptType {
  id: number;
  dept_name: string;
  parent_id: number | null;
  create_time: string;
  update_time: string;
  remark: string;
}
export interface PostType {
  id: number;
  post_name: string;
  post_code: string;
  create_time: string;
  update_time: string;
  remark: string;
}

export interface UserInfoType {
  id: string;
  nick_name: string;
  user_name: string;
  email: string;
  phone_number: string;
  avatar: string;
  create_time: string;
  perms: string[];
  roles: RoleType[];
  depts: DeptType[];
  posts: PostType[];
}
