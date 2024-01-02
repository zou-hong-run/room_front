export interface UserResultType {
  id: number;
  user_name: string;
  nick_name: string;
  email: string;
  phone_number: string;
  avatar: string;
  create_time: string;
  role: [];
  post: [];
}
export interface UserListResultType {
  users: UserResultType[];
  totalCount: number;
}

export interface CreateUserType {
  user_name: string;
  nick_name: string;
  password: string;
  email: string;
  phone_number: string;
  gender: string;
  remark: string;
  dept_ids: number[];
  post_ids: number[];
  role_ids: number[];
}
export type CreateUserResultType = string;
