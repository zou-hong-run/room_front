import { RouteRecordRaw, Router } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getAccessToken } from '@/utils/auth';
import { setTitle } from '@/utils/setTitle';
import { useUserStore } from '@/store/user';
import { usePermissionsStore } from '@/store/permission';
import { isUrl } from '@/utils/common';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/404', '/401'];

export const createRouterGuards = (router: Router) => {
  router.beforeEach(async (to) => {
    // console.log(router.getRoutes());
    const userStore = useUserStore();
    const permissionsStore = usePermissionsStore();
    let access_token = getAccessToken();
    // console.log(to, '===', from);
    NProgress.start();
    if (access_token) {
      // 设置网页标题
      setTitle(to.meta.title as string);
      if (to.path === '/login') {
        NProgress.done();
        return '/';
      } else {
        // 没有角色信息
        if (userStore.roles.length === 0) {
          try {
            await userStore.GetInfo();
            let accessRoutes =
              (await permissionsStore.GenerateRoutes()) as RouteRecordRaw[];
            accessRoutes?.forEach((route: RouteRecordRaw) => {
              if (!isUrl(route.path)) {
                router.addRoute(route);
              }
            });
            return {
              path: to.fullPath,
              replace: true,
            };
          } catch (error) {
            console.log('errror', error);
            userStore.LogOut();
          }
        } else {
          return true;
        }
      }
    } else {
      // 在免登录白名单中，直接放行
      if (whiteList.includes(to.path)) {
        return true;
      } else {
        NProgress.done();
        return `/login?redirect=${to.fullPath}`;
      }
    }
  });
  router.afterEach(async () => {
    NProgress.done();
  });
  router.onError((error) => {
    NProgress.done();
    console.log('路由错误', error);
  });
};
