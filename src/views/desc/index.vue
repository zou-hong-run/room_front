<script setup lang="ts">
let cardData = [
  {
    icon: 'House',
    value: '功能强大',
  },
  {
    icon: 'Link',
    value: '方便管理',
  },

  {
    icon: 'Compass',
    value: '提高管理效率',
  },
  {
    icon: 'Crop',
    value: '会议室管理系统',
  },
  {
    icon: 'Open',
    value: '线上管理系统',
  },
  {
    icon: 'Check',
    value: '全栈',
  },
  {
    icon: 'House',
    value: 'RBAC用户角色权限',
  },
  {
    icon: 'Link',
    value: 'Vite',
  },

  {
    icon: 'Compass',
    value: 'Vue3+Typescript+Nest',
  },
  {
    icon: 'Crop',
    value: 'Typeorm',
  },
  {
    icon: 'Open',
    value: 'Mysql',
  },
  {
    icon: 'Pointer',
    value: 'Redis',
  },
  {
    icon: 'Lock',
    value: '动态路由',
  },
  {
    icon: 'PieChart',
    value: 'VueUse',
  },
  {
    icon: 'Switch',
    value: 'Pinia',
  },
  {
    icon: 'Crop',
    value: 'vue-outer',
  },
  {
    icon: 'Open',
    value: 'Element-plus',
  },
  {
    icon: 'Pointer',
    value: 'Redis',
  },
  {
    icon: 'Pointer',
    value: '小皮面板',
  },
  {
    icon: 'Pointer',
    value: '动态路由',
  },
  {
    icon: 'Pointer',
    value: 'Axios封装',
  },
  {
    icon: 'Pointer',
    value: 'DayJS',
  },
  {
    icon: 'Pointer',
    value: 'Swagger',
  },
  {
    icon: 'Pointer',
    value: 'JWT',
  },
  {
    icon: 'Pointer',
    value: 'mailer',
  },
];
</script>

<template>
  <div>
    <h1>
      <span class="title">企业会议室管理系统</span>
    </h1>
    <el-space wrap :size="40">
      <el-card v-for="item in cardData" :key="item.value + item.icon">
        <div class="card-header">
          <el-button type="primary" :icon="item.icon">{{
            item.value
          }}</el-button>
        </div>
      </el-card>
    </el-space>
  </div>
</template>

<style scoped lang="scss">
h1 {
  color: transparent;
  text-align: center;
  letter-spacing: -0.4px;
  line-height: 40px;
  font-weight: 700;
  white-space: pre-wrap;
  margin-bottom: 40px;
}
.title {
  font-size: 56px;
  -webkit-text-fill-color: transparent;
  background: linear-gradient(120deg, #bd34fe 30%, #41d1ff);
  background-clip: text;
}
.chat {
  width: 60px;
  height: 60px;
  background-color: red;
}
</style>
