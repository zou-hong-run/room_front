export interface PostResultType {
  id: number;
  post_name: string;
  post_code: string;
  create_time: string;
  update_time: string;
  remark: string;
}
export type PostListResultType = PostResultType[];

export interface CreatePostParamType {
  post_name: string;
  post_code: string;
  remark: string;
}
export type CreatePostResultType = string;
