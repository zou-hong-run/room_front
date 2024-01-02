import { getPermissionMenus } from '@/api/permissionMenu';
import { constRoutes } from '@/router/routes';
import { GenRouteType, genDynamicRouter } from '@/utils/genRouter';
import { defineStore } from 'pinia';
import Link from '@/layout/link/index.vue';
import Empty from '@/layout/empty/index.vue';
import ParentView from '@/components/ParentView/index.vue';
import Layout from '@/layout/index.vue';
import { Component } from 'vue';
import { RouteRecordRaw } from 'vue-router';
export interface PermissionStoreType {
  routes: RouteRecordRaw[];
  addRoute: RouteRecordRaw[];
  defaultRoutes: RouteRecordRaw[];
  topbarRouters: RouteRecordRaw[];
  asideRouters: RouteRecordRaw[];
}

const modules = import.meta.glob('@/views/**/*.vue');
export const usePermissionsStore = defineStore('permissions', {
  state: (): PermissionStoreType => {
    return {
      routes: [],
      addRoute: [],
      defaultRoutes: [],
      topbarRouters: [],
      asideRouters: [],
    };
  },
  actions: {
    async GenerateRoutes() {
      let res = await getPermissionMenus();
      if (res.code === 200) {
        let menus = res.data.menus;
        let routers = genDynamicRouter(menus);
        const sdata = JSON.parse(JSON.stringify(routers));
        const rdata = JSON.parse(JSON.stringify(routers));
        const defaultData = JSON.parse(JSON.stringify(routers));
        const asideRoutes = filterAsyncRouter(sdata);
        const rewriteRoutes = filterAsyncRouter(rdata, null, true);
        const defaultRoutes = filterAsyncRouter(defaultData);

        this.addRoute = rewriteRoutes as RouteRecordRaw[];
        this.routes = constRoutes.concat(rewriteRoutes as RouteRecordRaw[]);

        this.asideRouters = constRoutes.concat(asideRoutes as RouteRecordRaw[]);
        this.defaultRoutes = asideRoutes as RouteRecordRaw[];
        this.topbarRouters = defaultRoutes as RouteRecordRaw[];
        // console.log(rewriteRoutes);
        return rewriteRoutes;
      }
    },
  },
});
// 遍历路由字符串，转换为组件对象
const filterAsyncRouter = (
  dynamicRouter: GenRouteType[],
  _parentRouter?: GenRouteType | null,
  type?: boolean,
) => {
  return dynamicRouter.filter((route) => {
    // 处理路径的，我们已经处理好了
    // if (type && route.children) {
    //   route.children = filterChildren(route.children);
    // }
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout;
      } else if (route.component === 'ParentView') {
        route.component = ParentView;
      } else if (route.component === 'InnerLink') {
        route.component = Link;
      } else if (route.component === 'Empty') {
        route.component = Empty;
      } else {
        route.component = loadComponent(route.component as string) as Component;
      }
    }
    if (route.children !== null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type);
    } else {
      delete route['children'];
      delete route['redirect'];
    }
    return true;
  });
};
const loadComponent = (view: string) => {
  let res;
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0];
    if (dir === view) {
      res = () => modules[path]();
    }
  }
  return res;
};

// const filterChildren = (
//   childrenRouter: GenRouteType[],
//   _parentRouter?: GenRouteType,
// ) => {
//   let children: GenRouteType[] = [];
//   childrenRouter.forEach((el) => {
//     // 子路由还有子路由
//     if (el.children && el.children.length) {
//       if (el.component === 'ParentView' && !_parentRouter) {
//         el.children.forEach((c) => {
//           c.path = el.path + '/' + c.path;
//           if (c.children && c.children.length) {
//             children = children.concat(filterChildren(c.children, c));
//             return;
//           }
//           children.push(c);
//         });
//         return;
//       }
//     }
//     // 如果有父节点就给自己的路径加上父节点的路径
//     if (_parentRouter) {
//       el.path = _parentRouter.path + '/' + el.path;
//     }
//     children = children.concat(el);
//   });
//   return children;
// };
