<script setup lang="ts">
import { ref, reactive } from 'vue';
import { getDeptList, addDept } from '@/api/system/dept';
import { FormInstance, ElMessage } from 'element-plus';
import {
  CreateDeptParamType,
  DeptListResultType,
  DeptResultType,
} from '@/api/system/dept/types';

const deptList = ref<DeptListResultType>([]);

const loading = ref(true);
const total = ref(0);
const title = ref('');
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
});
export interface DeptParentTreeDataType {
  value: number;
  label: string;
  children: DeptParentTreeDataType[];
}

const addDeptFormRef = ref<FormInstance>();
const showAddDept = ref(false);
const deptParentTreeData = ref<DeptParentTreeDataType[]>([]);
const rules = {
  dept_name: [{ required: true, message: '部门名不能为空', trigger: 'blur' }],
};

const addDeptFormData = reactive<CreateDeptParamType>({
  dept_name: '',
  parent_id: null,
  remark: '',
});

// 查询部门列表
const getList = async () => {
  loading.value = true;
  let res = await getDeptList();
  if (res.code === 200) {
    deptList.value = res.data;
    loading.value = false;
  }
};

// 重置新增的表单以及其他数据
const resetAddDeptForm = () => {
  addDeptFormRef.value?.resetFields();
};
// 添加部门
const handleDept = async () => {
  resetAddDeptForm();
  deptParentTreeData.value = getMenuParentTreeData(deptList.value);
  showAddDept.value = true;
  title.value = '添加部门';
};
const getMenuParentTreeData = (
  menuData: DeptListResultType,
  _parent?: DeptResultType,
) => {
  return menuData
    .filter((item) => item.parent_id == _parent?.id)
    .map((item) => {
      let result = {
        value: item.id,
        label: item.dept_name,
        children: getMenuParentTreeData(menuData, item),
      } as DeptParentTreeDataType;
      return result;
    });
};
// 提交添加部门按钮
const submitAddDeptForm = () => {
  addDeptFormRef.value?.validate(async (valid) => {
    if (valid) {
      console.log(addDeptFormData);
      let res = await addDept(addDeptFormData);
      if (res.code === 200) {
        ElMessage.success('添加新部门成功');
      } else {
        ElMessage.success('添加新部门失败');
      }
      showAddDept.value = false;
    }
  });
};
/** 取消按钮 */
function cancelDeptDept() {
  showAddDept.value = false;
  resetAddDeptForm();
}

getList();
</script>
<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleDept"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete">删除</el-button>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="deptList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="部门编号" prop="id" width="120" />
      <el-table-column
        label="部门名称"
        prop="dept_name"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column label="创建时间" align="center" prop="create_time">
        <template #default="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-tooltip content="修改" placement="top">
            <el-text type="primary"
              >{{ scope.row.id }} <el-icon> <Edit /> </el-icon
            ></el-text>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-text type="primary">
              <el-icon> <Delete /> </el-icon
            ></el-text>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加部门配置对话框 -->
    <el-dialog
      :title="title"
      v-model="showAddDept"
      width="500px"
      append-to-body
    >
      <el-form
        ref="addDeptFormRef"
        :model="addDeptFormData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="部门名称" prop="dept_name">
          <el-input
            v-model="addDeptFormData.dept_name"
            placeholder="请输入部门名称"
          />
        </el-form-item>
        <el-form-item label="父级部门" prop="parent_id">
          <el-tree-select
            v-model="addDeptFormData.parent_id"
            :data="deptParentTreeData"
            :render-after-expand="true"
            default-expand-all
            check-strictly
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="addDeptFormData.remark"
            type="textarea"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitAddDeptForm">确 定</el-button>
          <el-button @click="cancelDeptDept">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
