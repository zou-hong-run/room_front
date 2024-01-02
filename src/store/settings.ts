import { defineStore } from 'pinia';

export interface SettingsStoreType {
  isCollapse: boolean;
}
export const useSettingsStore = defineStore('setting', {
  state: (): SettingsStoreType => {
    return {
      isCollapse:
        localStorage.getItem('redrun_admin_is_collapse') === 'true'
          ? true
          : false,
    };
  },
  actions: {
    setIsCollapse(collapse: boolean) {
      this.isCollapse = collapse;
      localStorage.setItem(
        'redrun_admin_is_collapse',
        collapse ? 'true' : 'false',
      );
    },
  },
});
