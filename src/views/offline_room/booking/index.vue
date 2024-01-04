<script setup lang="ts">
import { reactive, ref } from 'vue';
import { bookingList, apply, reject, unbind } from '@/api/room/booking';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs';
import {
  BookingItemResultType,
  BookingListParamType,
} from '@/api/room/booking/types';
import { useUserStore } from '@/store/user';
const userStore = useUserStore();
let user_name = userStore.user_name;

const tableData = ref<BookingItemResultType[]>([]);
const searchForm = reactive<BookingListParamType>({
  user_name: '',
  meeting_name: '',
  meeting_position: '',
  range_start_date: '',
  range_start_time: '',
  range_end_date: '',
  range_end_time: '',
});
// 每页显示条目
let pageSize = ref(10);
// 第几页
let pageNo = ref(1);
let total = ref(0);

const initData = async () => {
  let res = await bookingList(searchForm, pageNo.value, pageSize.value);
  if (res.code === 200) {
    if (res.data.bookings) {
      tableData.value = res.data.bookings.filter((item) => {
        return item.user.user_name === user_name;
      });
      total.value = res.data.totalCount;
    }
  } else {
    ElMessage('服务器异常');
  }
};

const currentChange = (val: number) => {
  pageNo.value = val;
  initData();
};

const onSearch = () => {
  initData();
};
const changeStatus = async (
  id: number,
  status: 'apply' | 'reject' | 'unbind',
) => {
  const methods = {
    apply,
    reject,
    unbind,
  };
  const res = await methods[status](id);
  if (res.code === 200) {
    ElMessage.success('状态更新成功');
    initData();
  } else {
    ElMessage.error(res.data);
  }
};
const filterTag = (value: string, row: BookingItemResultType) => {
  return row.status === value;
};
initData();
</script>

<template>
  <div class="booking-manage">
    <div class="form-inline">
      <el-form :inline="true" :model="searchForm" label-width="120px">
        <el-form-item label="预订人">
          <el-input v-model="searchForm.user_name" clearable />
        </el-form-item>
        <el-form-item label="会议室名字">
          <el-input v-model="searchForm.meeting_name" clearable />
        </el-form-item>
        <el-form-item label="会议室位置">
          <el-input v-model="searchForm.meeting_position" clearable />
        </el-form-item>
        <el-form-item label="预定开始日期">
          <el-date-picker v-model="searchForm.range_start_date" clearable />
        </el-form-item>
        <el-form-item label="预定开始时间">
          <el-time-picker v-model="searchForm.range_end_time" clearable />
        </el-form-item>
        <el-form-item label="预定结束日期">
          <el-date-picker v-model="searchForm.range_end_date" clearable />
        </el-form-item>
        <el-form-item label="预定结束时间">
          <el-time-picker v-model="searchForm.range_end_time" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索预定申请</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableData" :stripe="false" style="width: 100%">
        <el-table-column prop="meeting.name" label="会议室名称" />
        <el-table-column prop="meeting.location" label="会议室位置" />
        <el-table-column prop="user.user_name" label="预定人" />
        <el-table-column prop="start_time" label="开始时间">
          <template #default="scope">
            {{
              dayjs(new Date(scope.row.start_time)).format(
                'YYYY-MM-DD HH:mm:ss',
              )
            }}
          </template>
        </el-table-column>
        <el-table-column prop="end_time" label="结束时间">
          <template #default="scope">
            {{
              dayjs(new Date(scope.row.end_time)).format('YYYY-MM-DD HH:mm:ss')
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          :filters="[
            {
              text: '审批通过',
              value: '审批通过',
            },
            {
              text: '审批驳回',
              value: '审批驳回',
            },
            {
              text: '申请中',
              value: '申请中',
            },
            {
              text: '已解除',
              value: '已解除',
            },
          ]"
          :filter-method="filterTag"
          label="审批状态"
        >
          <template #default="scope">
            <el-tag>{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="预定时间">
          <template #default="scope">
            {{
              dayjs(new Date(scope.row.create_time)).format(
                'YYYY-MM-DD HH:mm:ss',
              )
            }}
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注">
          <template #default="scope">
            <el-text type="warning">{{ scope.row.note }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-popconfirm
              v-if="scope.row.status === '申请中'"
              title="你确定要解除申请吗"
              @confirm="
                () => {
                  changeStatus(scope.row.id, 'unbind');
                }
              "
            >
              <template #reference>
                <el-button bg text type="primary" size="small">解除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        v-model:current-page="pageNo"
        :total="total"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.booking-manage {
  padding: 20px;
  .form-inline .el-input {
    --el-input-width: 120px;
  }
}
</style>
