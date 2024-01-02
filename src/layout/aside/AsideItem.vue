<script setup lang="ts">
import { RouteRecordRaw } from 'vue-router';

defineProps<{
  item: RouteRecordRaw;
}>();
</script>

<template>
  <template v-if="!item.children">
    <el-menu-item v-if="!item.meta?.hidden" :index="item.path">
      <el-icon><Van /></el-icon>
      <template #title>
        <span>{{ item.meta ? item.meta?.title : '没有标题' }}</span>
      </template>
    </el-menu-item>
  </template>
  <!-- <el-menu-item
    v-if="item.children && item.children.length === 1"
    :index="item.children[0].path"
  >
    <template #title>
      <span>{{ item.children[0].meta.title }}</span></template
    >
  </el-menu-item> -->
  <el-sub-menu :index="item.path" v-if="item.children && item.children.length">
    <template #title>
      <el-icon><Place /></el-icon>
      <span>{{ item.meta ? item.meta?.title : '没有标题' }}</span>
    </template>
    <AsideItem
      v-for="(route, index) in item.children"
      :key="route.path + index"
      :item="route"
    />
  </el-sub-menu>
</template>

<style scoped lang="scss"></style>
