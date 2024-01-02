<script setup lang="ts">
import { ref, reactive } from 'vue';
import { addRole, getRoleList } from '@/api/system/role';
import { RoleListResultType, CreateRoleType } from '@/api/system/role/types';
import { getMenuList } from '@/api/system/menu';
import { FormInstance, ElTree, ElMessage } from 'element-plus';
import { MenuListResultType, MenuResultType } from '@/api/system/menu/types';

export interface MenuOptionsType {
  id: number;
  label: string;
  children: MenuOptionsType[];
}

const roleList = ref<RoleListResultType>([]);
const loading = ref(true);
const total = ref(0);
const title = ref('');
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  role_name: undefined,
  role_key: undefined,
  status: undefined,
});
const rules = {
  role_name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  role_key: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
  roleSort: [{ required: true, message: '角色顺序不能为空', trigger: 'blur' }],
};

const menuRef = ref<typeof ElTree>();
const menuOptions = ref<MenuOptionsType[]>([]);

const addRoleFormRef = ref<FormInstance>();
const showAdd = ref(false);
const addRoleFormData = reactive<CreateRoleType>({
  role_name: '',
  role_key: '',
  menu_ids: [],
  remark: '',
});

// 获取角色列表
const getList = async () => {
  loading.value = true;
  let res = await getRoleList();
  if (res.code === 200) {
    roleList.value = res.data;
    loading.value = false;
  }
};

// 重置添加角色表单
const resetAddRoleForm = () => {
  addRoleFormRef.value?.resetFields();
};
// 添加角色 弹出表单
const handleAdd = async () => {
  resetAddRoleForm();
  await getMenuTreeselect();
  showAdd.value = true;
  title.value = '添加角色';
};

// 获取菜单树结构
const getMenuTreeselect = async () => {
  let res = await getMenuList();
  if (res.code === 200) {
    menuOptions.value = getMenuTreeData(res.data);
  }
};
// 将数据转换为树形结构
const getMenuTreeData = (
  menuData: MenuListResultType,
  _parent?: MenuResultType,
) => {
  return menuData
    .filter((item) => item.parent_id == _parent?.id)
    .map((item) => {
      let result = {
        id: item.id,
        label: item.menu_name,
        children: getMenuTreeData(menuData, item),
      } as MenuOptionsType;
      return result;
    });
};

// 所有菜单节点数据
const getMenuAllCheckedKeys = () => {
  // 目前被选中的菜单节点
  let checkedKeys = menuRef.value?.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = menuRef.value?.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
};
// 提交添加角色按钮
const submitAddRoleForm = () => {
  addRoleFormRef.value?.validate(async (valid) => {
    if (valid) {
      addRoleFormData.menu_ids = getMenuAllCheckedKeys();
      let res = await addRole(addRoleFormData);
      if (res.code === 200) {
        ElMessage.success('添加新角色成功');
      } else {
        ElMessage.success('添加新角色失败');
      }
      showAdd.value = false;
    }
  });
};
/** 取消按钮 */
function cancelAddRole() {
  showAdd.value = false;
  resetAddRoleForm();
}

getList();
</script>
<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
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
    <el-table v-loading="loading" :data="roleList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色编号" prop="id" width="120" />
      <el-table-column
        label="角色名称"
        prop="role_name"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="权限字符"
        prop="role_key"
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
          <el-tooltip
            content="修改"
            placement="top"
            v-if="scope.row.role_id !== 1"
          >
            <el-text type="primary">
              <el-icon> <Edit /> </el-icon
            ></el-text>
          </el-tooltip>
          <el-tooltip
            content="删除"
            placement="top"
            v-if="scope.row.role_id !== 1"
          >
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

    <!-- 添加角色配置对话框 -->
    <el-dialog :title="title" v-model="showAdd" width="500px" append-to-body>
      <el-form
        ref="addRoleFormRef"
        :model="addRoleFormData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="role_name">
          <el-input
            v-model="addRoleFormData.role_name"
            placeholder="请输入角色名称"
          />
        </el-form-item>
        <el-form-item prop="role_key">
          <template #label>
            <span>
              <el-tooltip
                content="控制器中定义的权限字符，如：Admin"
                placement="top"
              >
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
              权限字符
            </span>
          </template>
          <el-input
            v-model="addRoleFormData.role_key"
            placeholder="请输入权限字符"
          />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menuRef"
            node-key="id"
            empty-text="加载中，请稍候"
            :default-expand-all="true"
            :props="{ label: 'label', children: 'children' }"
          ></el-tree>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="addRoleFormData.remark"
            type="textarea"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitAddRoleForm">确 定</el-button>
          <el-button @click="cancelAddRole">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
