import { RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';

const constRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    component: Layout,
    meta: {
      title: '首页',
    },
    redirect: '/desc',
    children: [
      {
        path: '/desc',
        name: 'desc',
        component: () => import('@/views/desc/index.vue'),
        meta: {
          title: '描述页面',
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录页面',
      hidden: true,
    },
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '404页面',
      hidden: true,
    },
    component: () => import('@/views/error/404.vue'),
  },
  {
    path: '/401',
    name: '401',
    meta: {
      title: '401页面',
      hidden: true,
    },
    component: () => import('@/views/error/401.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404.vue'),
    name: 'not_find',
    meta: {
      title: '未知页面',
      hidden: true,
    },
  },
];

export { constRoutes };
