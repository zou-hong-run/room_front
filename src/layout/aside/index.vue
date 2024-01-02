<script setup lang="ts">
import AsideItem from './AsideItem.vue';
import Logo from '../logo/index.vue';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePermissionsStore } from '@/store/permission';
import { useSettingsStore } from '@/store/settings';
import { isUrl } from '@/utils/common';

const permissionStore = usePermissionsStore();
const settingsStore = useSettingsStore();
const $route = useRoute();
const $router = useRouter();

const handleSelect = async (index: string) => {
  if (isUrl(index)) {
    window.open(index);
  } else {
    $router.push({ path: index });
  }
};
const asideRouters = computed(() => {
  return permissionStore.asideRouters;
});
const activeMenu = computed(() => {
  const { path } = $route;
  return path;
});
</script>

<template>
  <el-scrollbar>
    <Logo></Logo>
    <el-menu
      :default-active="activeMenu"
      class="aside"
      :collapse="settingsStore.isCollapse"
      :unique-opened="true"
      :collapse-transition="false"
      @select="handleSelect"
    >
      <AsideItem
        v-for="(route, index) in asideRouters"
        :key="route.path + index"
        :item="route"
      />
    </el-menu>
  </el-scrollbar>
</template>

<style scoped lang="scss">
.aside {
  border: none;
  width: 100%;
  height: 100%;
}
</style>
