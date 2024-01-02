<script setup lang="ts">
import { useRoute } from 'vue-router';
const $route = useRoute();
const link = $route.meta.link as string;
if (!link) {
  location.href = '/404';
}
</script>

<template>
  <iframe
    src="http://localhost:3000/swagger-api"
    frameborder="0"
    width="100%"
    height="100%"
    scrolling="auto"
  ></iframe>
</template>

<style scoped lang="scss"></style>
