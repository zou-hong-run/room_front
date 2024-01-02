<script setup lang="ts">
export interface Props {
  prefix?: string;
  name: string;
  color?: string;
  width?: string;
  height?: string;
}
withDefaults(defineProps<Props>(), {
  prefix: '#icon-',
  name: '',
  color: '',
  width: '20px',
  height: '20px',
});
</script>

<template>
  <svg :style="{ width, height }">
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>

<style scoped lang="scss"></style>
