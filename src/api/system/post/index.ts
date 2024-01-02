import request, { Response } from '@/utils/request';
import {
  PostListResultType,
  CreatePostParamType,
  CreatePostResultType,
} from './types';

export const getPostList = () => {
  return request<any, Response<PostListResultType>>({
    url: '/post/list',
    method: 'get',
  });
};
export const addPost = (createPostParam: CreatePostParamType) => {
  return request<any, Response<CreatePostResultType>>({
    url: '/post/create',
    method: 'post',
    data: createPostParam,
  });
};
