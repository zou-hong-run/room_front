<script setup lang="ts">
import { useSettingsStore } from '@/store/settings';

const settingsStore = useSettingsStore();
const handleCollapse = () => {
  settingsStore.setIsCollapse(!settingsStore.isCollapse);
  console.log(settingsStore.isCollapse);
};
</script>

<template>
  <div>
    <el-page-header>
      <template #icon>
        <el-icon @click="handleCollapse" style="font-size: 24px">
          <Fold v-show="settingsStore.isCollapse" />
          <Expand v-show="!settingsStore.isCollapse" />
        </el-icon>
      </template>
      <template #title
        ><el-avatar
          class="mr-3"
          :size="32"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      /></template>
      <template #content>
        <div class="flex items-center">what？</div>
      </template>
      <template #extra>
        <div class="flex items-center">
          <el-button>Print</el-button>
          <el-button type="primary" class="ml-2">Edit</el-button>
        </div>
      </template>
    </el-page-header>
  </div>
</template>

<style scoped lang="scss"></style>
