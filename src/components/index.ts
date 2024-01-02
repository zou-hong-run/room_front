import { App } from 'vue';
import SvgIcon from './SvgIcon/index.vue';
import Pagination from './Pagination/index.vue';
let allGlobalComponents = { SvgIcon, Pagination };

export default {
  install(app: App) {
    for (const [key, component] of Object.entries(allGlobalComponents)) {
      app.component(key, component);
    }
  },
};
