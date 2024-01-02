import { createRouter, createWebHistory } from 'vue-router';

import { constRoutes } from './routes';
import { createRouterGuards } from './router-guards';

const router = createRouter({
  history: createWebHistory(),
  routes: constRoutes,
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    };
  },
});
// 初始化路由守卫
createRouterGuards(router);
export default router;
