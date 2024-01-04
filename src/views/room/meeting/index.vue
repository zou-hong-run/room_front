<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import {
  meetingList,
  deleteMeeting,
  createMeeting,
  updateMeeting,
} from '@/api/room/meeting';
import {
  CreateMeetingParamType,
  MeetingItemResultType,
  UpdateMeetingParamType,
} from '@/api/room/meeting/types';

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
const onDelete = async (id: number) => {
  try {
    await deleteMeeting(id);
    ElMessage.success('删除成功');
    initData(1);
  } catch (error) {
    ElMessage.error('删除失败');
  }
};

const dialogVisible = ref(false);
const ruleFormRef = ref();

const formData = reactive<CreateMeetingParamType>({
  name: '会议室6',
  capacity: 10,
  location: '二楼',
  equipment: '黑板',
  description: '好好好',
});
const rules = reactive<FormRules<CreateMeetingParamType>>({
  name: [{ required: true, message: '请输入会议室名称', trigger: 'blur' }],
  capacity: [{ required: true, message: '请输入会议室容量', trigger: 'blur' }],
  location: [{ required: true, message: '请输入会议室位置', trigger: 'blur' }],
  equipment: [{ required: true, message: '请输入会议室设备', trigger: 'blur' }],
  description: [
    { required: true, message: '请输入会议室描述', trigger: 'blur' },
  ],
});
const onAddMeeting = async () => {
  const res = await createMeeting(formData);
  if (res.code === 200) {
    ElMessage.success('创建成功');
    ruleFormRef.value?.resetFields();
    dialogVisible.value = false;
    initData(1);
  } else {
    ElMessage.error(res.message);
  }
};
const onAddMeetingSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      onAddMeeting();
    } else {
      console.log(fields);
      ElMessage('请输入正确格式信息');
    }
  });
};

const updateDialogVisible = ref(false);
const updateRuleFormRef = ref();

const updateFormData = reactive<UpdateMeetingParamType>({
  id: 0,
  name: '',
  capacity: 0,
  location: '',
  equipment: '',
  description: '',
});
const updateRules = reactive<FormRules<UpdateMeetingParamType>>({
  name: [{ required: true, message: '请输入会议室名称', trigger: 'blur' }],
  capacity: [{ required: true, message: '请输入会议室容量', trigger: 'blur' }],
  location: [{ required: true, message: '请输入会议室位置', trigger: 'blur' }],
  equipment: [{ required: true, message: '请输入会议室设备', trigger: 'blur' }],
  description: [
    { required: true, message: '请输入会议室描述', trigger: 'blur' },
  ],
});
const onUpdate = (row: UpdateMeetingParamType) => {
  updateDialogVisible.value = true;
  updateFormData.id = row.id;
  updateFormData.name = row.name;
  updateFormData.capacity = row.capacity;
  updateFormData.location = row.location;
  updateFormData.equipment = row.equipment;
  updateFormData.description = row.description;
};
const onUpdateMeeting = async () => {
  const res = await updateMeeting(updateFormData);
  if (res.code === 200) {
    ElMessage.success('创建成功');
    updateRuleFormRef.value?.resetFields();
    updateDialogVisible.value = false;
    initData(1);
  } else {
    ElMessage.error(res.data);
  }
};
const onUpdateMeetingSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      onUpdateMeeting();
    } else {
      console.log(fields);
      ElMessage('请输入正确格式信息');
    }
  });
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
          <el-button type="success" @click="dialogVisible = true"
            >添加会议室</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="name" label="会议室名字" />
        <el-table-column prop="capacity" label="会议室容量" />
        <el-table-column prop="equipment" label="会议室设备" />
        <el-table-column prop="location" label="会议室位置" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" @click="onUpdate(scope.row)"
              >修改</el-button
            >
            <el-popconfirm
              title="你确定要删除吗"
              @confirm="
                () => {
                  onDelete(scope.row.id);
                }
              "
            >
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
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
    <el-dialog v-model="dialogVisible" title="添加会议室">
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        :model="formData"
        label-width="100px"
      >
        <el-form-item prop="name" label="会议室名称">
          <el-input v-model="formData.name" clearable />
        </el-form-item>
        <el-form-item prop="capacity" label="会议室容量">
          <el-input v-model="formData.capacity" clearable />
        </el-form-item>
        <el-form-item prop="equipment" label="会议室设备">
          <el-input v-model="formData.equipment" clearable />
        </el-form-item>
        <el-form-item prop="location" label="会议室位置">
          <el-input v-model="formData.location" clearable />
        </el-form-item>
        <el-form-item prop="description" label="会议室描述">
          <el-input v-model="formData.description" clearable />
        </el-form-item>
        <el-form-item>
          <el-button
            class="btn"
            type="primary"
            @click="onAddMeetingSubmit(ruleFormRef)"
            >添加会议室</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-model="updateDialogVisible" title="修改会议室">
      <el-form
        ref="updateRuleFormRef"
        :rules="updateRules"
        :model="updateFormData"
        label-width="100px"
      >
        <el-form-item prop="name" label="会议室名称">
          <el-input v-model="updateFormData.name" clearable />
        </el-form-item>
        <el-form-item prop="capacity" label="会议室容量">
          <el-input v-model="updateFormData.capacity" clearable />
        </el-form-item>
        <el-form-item prop="equipment" label="会议室设备">
          <el-input v-model="updateFormData.equipment" clearable />
        </el-form-item>
        <el-form-item prop="location" label="会议室位置">
          <el-input v-model="updateFormData.location" clearable />
        </el-form-item>
        <el-form-item prop="description" label="会议室描述">
          <el-input v-model="updateFormData.description" clearable />
        </el-form-item>
        <el-form-item>
          <el-button
            class="btn"
            type="primary"
            @click="onUpdateMeetingSubmit(updateRuleFormRef)"
            >修改会议室</el-button
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
