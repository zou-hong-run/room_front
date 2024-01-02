<script setup lang="ts">
import { ref, reactive } from 'vue';
import { getMenuList, addMenu } from '@/api/system/menu';
import { FormInstance, ElMessage } from 'element-plus';
import {
  CreateMenuType,
  MenuListResultType,
  MenuResultType,
} from '@/api/system/menu/types';

export interface MenuParentTreeDataType {
  value: number;
  label: string;
  children: MenuParentTreeDataType[];
}

const menuList = ref<MenuListResultType>([]);

const loading = ref(true);
const total = ref(0);
const title = ref('');
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  menu_name: undefined,
  menu_key: undefined,
});

const addMenuFormRef = ref<FormInstance>();
const showAddMenu = ref(false);
const menuParentTreeData = ref<MenuParentTreeDataType[]>([]);
const rules = {
  menu_name: [{ required: true, message: '菜单名不能为空', trigger: 'blur' }],
  path: [{ required: true, message: '路径不能为空', trigger: 'blur' }],
  menu_type: [{ required: true, message: '菜单类型不能为空', trigger: 'blur' }],
};

const addMenuFormData = reactive<CreateMenuType>({
  menu_name: '',
  path: '',
  perms: '',
  remark: '',
  parent_id: null,
  menu_type: '',
  component: '',
});

// 查询菜单列表
const getList = async () => {
  loading.value = true;
  let res = await getMenuList();
  if (res.code === 200) {
    menuList.value = res.data;
    loading.value = false;
  }
};

// 重置新增的表单以及其他数据
const resetAddMenuForm = () => {
  addMenuFormRef.value?.resetFields();
};
// 添加菜单
const handleMenu = async () => {
  resetAddMenuForm();
  menuParentTreeData.value = getMenuParentTreeData(menuList.value);
  showAddMenu.value = true;
  title.value = '添加菜单';
};

const getMenuParentTreeData = (
  menuData: MenuListResultType,
  _parent?: MenuResultType,
) => {
  return menuData
    .filter((item) => item.parent_id == _parent?.id)
    .map((item) => {
      let result = {
        value: item.id,
        label: item.menu_name,
        children: getMenuParentTreeData(menuData, item),
      } as MenuParentTreeDataType;
      return result;
    });
};

// 提交添加菜单按钮
const submitAddMenuForm = () => {
  addMenuFormRef.value?.validate(async (valid) => {
    if (valid) {
      console.log(addMenuFormData);
      let res = await addMenu(addMenuFormData);
      if (res.code === 200) {
        ElMessage.success('添加新菜单成功');
      } else {
        ElMessage.success('添加新菜单失败');
      }
      showAddMenu.value = false;
    }
  });
};
/** 取消按钮 */
function cancelMenuMenu() {
  showAddMenu.value = false;
  resetAddMenuForm();
}

getList();
</script>
<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleMenu"
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
    <el-table v-loading="loading" :data="menuList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="菜单编号" prop="id" width="120" />
      <el-table-column
        label="菜单名称"
        prop="menu_name"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="菜单路径"
        prop="path"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="菜单类型"
        prop="menu_type"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="权限标识"
        prop="perms"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="组件路径"
        prop="component"
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

    <!-- 添加菜单配置对话框 -->
    <el-dialog
      :title="title"
      v-model="showAddMenu"
      width="500px"
      append-to-body
    >
      <el-form
        ref="addMenuFormRef"
        :model="addMenuFormData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input
            v-model="addMenuFormData.menu_name"
            placeholder="请输入菜单名称"
          />
        </el-form-item>
        <el-form-item label="菜单路径" prop="path">
          <el-input
            v-model="addMenuFormData.path"
            placeholder="请输入菜单路径"
          />
        </el-form-item>
        <el-form-item label="权限标识" prop="perms">
          <el-input
            v-model="addMenuFormData.perms"
            placeholder="请输入权限标识"
          />
        </el-form-item>
        <el-form-item label="父级菜单" prop="parent_id">
          <el-tree-select
            v-model="addMenuFormData.parent_id"
            :data="menuParentTreeData"
            :render-after-expand="true"
            default-expand-all
            check-strictly
          />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menu_type">
          <el-select
            v-model="addMenuFormData.menu_type"
            placeholder="请选择菜单类型"
          >
            <el-option
              v-for="(name, value) in { 目录: 'C', 菜单: 'M', 按钮: 'B' }"
              :label="value"
              :value="name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input
            v-model="addMenuFormData.component"
            placeholder="请输出组件路径"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="addMenuFormData.remark"
            type="textarea"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitAddMenuForm">确 定</el-button>
          <el-button @click="cancelMenuMenu">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
