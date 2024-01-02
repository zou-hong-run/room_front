<script setup lang="ts">
import MySide from '@/layout/aside/index.vue';
import MyHeader from '@/layout/header/index.vue';
import MyFooter from '@/layout/footer/index.vue';
import ParentView from '@/components/ParentView/index.vue';
import { useSettingsStore } from '@/store/settings';
const settingsStore = useSettingsStore();
</script>

<template>
  <el-container class="layout_container">
    <el-aside
      :class="[
        !settingsStore.isCollapse ? 'layout_aside' : 'layout_aside_collapse',
      ]"
    >
      <MySide />
    </el-aside>
    <el-container>
      <el-header class="layout_header"> <MyHeader /></el-header>
      <el-main class="layout_main"> <ParentView></ParentView> </el-main>
      <el-footer class="layout_footer">
        <MyFooter />
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100%;

  .layout_aside {
    width: $layout_aside_width;
    border: 1px dashed pink;
  }
  .layout_aside_collapse {
    width: $layout_aside_width_collapse;
    border: 1px dashed pink;
  }
  .layout_header {
    border: 1px dashed pink;
    border-bottom: none;
    border-left: none;
    height: $layout_header_height;
  }
  .layout_main {
    border: 1px dashed pink;
    border-left: none;
    height: calc(100% - ($layout_header_height + $layout_footer_height));
  }
  .layout_footer {
    border: 1px dashed pink;
    border-top: none;
    border-left: none;

    height: $layout_footer_height;
  }
}
</style>
