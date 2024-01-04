<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { meetingList } from '@/api/room/meeting';
import { addBooking } from '@/api/room/booking';
import {
  CreateMeetingParamType,
  MeetingItemResultType,
} from '@/api/room/meeting/types';
import { CreateBookingParamType } from '@/api/room/booking/types';

const tableData = ref<MeetingItemResultType[]>([]);
const researchForm = reactive<CreateMeetingParamType>({
  name: '会议室',
  capacity: 10,
  equipment: '白板',
  location: '2楼',
  description: '',
});
// 每页显示条目
let page_size = ref(10);
// 第几页
let page_no = ref(1);
let total = ref(0);

// 显示添加预定
const addBookingDialogVisible = ref(false);
const addBookingFormRef = ref<FormInstance>();

const addBookingRules = reactive<FormRules<CreateBookingParamType>>({
  range_start_date: [
    { required: true, message: '请输入开始日期', trigger: 'blur' },
  ],
  range_start_time: [
    { required: true, message: '请输入开始时间', trigger: 'blur' },
  ],
  range_end_date: [
    { required: true, message: '请输入结束日期', trigger: 'blur' },
  ],
  range_end_time: [
    { required: true, message: '请输入结束时间', trigger: 'blur' },
  ],
  note: [{ required: true, message: '请输入备注信息', trigger: 'blur' }],
});
const addBookingFormData = reactive<CreateBookingParamType>({
  meeting_id: 0,
  range_start_date: 0,
  range_start_time: 0,
  range_end_date: 0,
  range_end_time: 0,
  note: '',
});
const handeAddBooking = (meeting_id: number) => {
  addBookingFormData.meeting_id = meeting_id;
  addBookingDialogVisible.value = true;
};
const handleAddBookingSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res = await addBooking(addBookingFormData);
      if (res.code === 200) {
        addBookingDialogVisible.value = false;
        ElMessage({
          type: 'success',
          message: '预定成功，等待审批',
          duration: 5000,
        });
      }
    } else {
      console.log(fields);
      ElMessage('请输入正确格式信息');
    }
  });
};

const onSubmit = () => {
  initData(
    page_no.value,
    page_size.value,
    researchForm.name,
    researchForm.capacity,
    researchForm.equipment,
    researchForm.location,
    researchForm.description,
  );
};
const initData = async (
  page_no?: number,
  page_size?: number,
  name?: string,
  capacity?: number,
  equipment?: string,
  location?: string,
  description?: string,
) => {
  let res = await meetingList(
    page_no,
    page_size,
    name,
    capacity,
    equipment,
    location,
    description,
  );
  if (res.code === 200) {
    if (res.data.meetings) {
      tableData.value = res.data.meetings;
      total.value = res.data.totalCount;
    }
  } else {
    ElMessage('服务器异常');
  }
};

const currentChange = (val: number) => {
  initData(val);
};

initData();
</script>

<template>
  <div class="meeting-room-manage">
    <div class="form-inline">
      <el-form :inline="true" :model="researchForm">
        <el-form-item label="会议室名称">
          <el-input v-model="researchForm.name" />
        </el-form-item>
        <el-form-item label="会议室容量">
          <el-input v-model="researchForm.capacity" />
        </el-form-item>
        <el-form-item label="会议室设备">
          <el-input v-model="researchForm.equipment" />
        </el-form-item>
        <el-form-item label="会议室位置">
          <el-input v-model="researchForm.location" />
        </el-form-item>
        <el-form-item label="会议室描述">
          <el-input v-model="researchForm.description" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索会议室</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="name" label="会议室名字" />
        <el-table-column prop="capacity" label="会议室容量" />
        <el-table-column prop="equipment" label="会议室设备" />
        <el-table-column prop="location" label="会议室位置" />
        <el-table-column prop="location" label="会议室位置" />
        <el-table-column prop="create_time" label="添加时间" />
        <el-table-column prop="update_time" label="上次更新时间" />
        <el-table-column prop="is_booked" label="预定状态">
          <template #default="scope">
            <el-text type="primary" size="small">{{
              scope.row.is_booked ? '不可预定' : '可预定'
            }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              :disabled="scope.row.is_booked"
              type="primary"
              size="small"
              @click="handeAddBooking(scope.row.id)"
              >预定</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="page_size"
        v-model:current-page="page_no"
        :total="total"
        @current-change="currentChange"
      />
    </div>
    <el-dialog v-model="addBookingDialogVisible" title="预定会议室">
      <el-form
        ref="addBookingFormRef"
        :rules="addBookingRules"
        :model="addBookingFormData"
        label-width="100px"
      >
        <el-form-item prop="name" label="会议室id">
          <el-input v-model="addBookingFormData.meeting_id" disabled />
        </el-form-item>
        <el-form-item label="预定开始日期">
          <el-date-picker
            v-model="addBookingFormData.range_start_date"
            clearable
          />
        </el-form-item>
        <el-form-item label="预定开始时间">
          <el-time-picker
            v-model="addBookingFormData.range_start_time"
            clearable
          />
        </el-form-item>
        <el-form-item label="预定结束日期">
          <el-date-picker
            v-model="addBookingFormData.range_end_date"
            clearable
          />
        </el-form-item>
        <el-form-item label="预定结束时间">
          <el-time-picker
            v-model="addBookingFormData.range_end_time"
            clearable
          />
        </el-form-item>
        <el-form-item prop="note" label="备注">
          <el-input v-model="addBookingFormData.note" clearable />
        </el-form-item>
        <el-form-item>
          <el-button
            class="btn"
            type="primary"
            @click="handleAddBookingSubmit(addBookingFormRef)"
            >预定会议室</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.meeting-room-manage {
  padding: 20px;
  .form-inline .el-input {
    --el-input-width: 120px;
  }
}
</style>
