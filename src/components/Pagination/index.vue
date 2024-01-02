<script setup lang="ts">
import { computed } from 'vue';
export interface PropPaginationType {
  total: number;
  page: number;
  limit: number;
  pageSizes?: number[];
  // 移动端页码按钮的数量端默认值5
  pagerCount?: number;
  layout?: string;
  background?: boolean;
  hidden?: boolean;
}
const props = withDefaults(defineProps<PropPaginationType>(), {
  limit: 20,
  page: 1,
  layout: 'total, sizes, prev, pager, next, jumper',
  pagerCount: document.body.clientWidth < 992 ? 5 : 7,
  pageSize: [10, 20, 30, 50],
});

const emit = defineEmits();
const currentPage = computed({
  get() {
    return props.page;
  },
  set(val) {
    emit('update:page', val);
  },
});
const pageSize = computed({
  get() {
    return props.limit;
  },
  set(val) {
    emit('update:limit', val);
  },
});
function handleSizeChange(val: number) {
  if (currentPage.value * val > props.total) {
    currentPage.value = 1;
  }
  emit('pagination', { page: currentPage.value, limit: val });
}
function handleCurrentChange(val: number) {
  emit('pagination', { page: val, limit: pageSize.value });
}
</script>
<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :pager-count="pagerCount"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
