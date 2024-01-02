<script setup lang="ts">
import { ref, reactive } from 'vue';
import { getUserList, addUser } from '@/api/system/user';
import { getRoleList } from '@/api/system/role';
import { getPostList } from '@/api/system/post';
import { getDeptList } from '@/api/system/dept';
import {
  ElMessage,
  type ElTree,
  type FormInstance,
  type FormRules,
} from 'element-plus';
import type { UserResultType, CreateUserType } from '@/api/system/user/types';
import type { RoleResultType } from '@/api/system/role/types';
import type { PostResultType } from '@/api/system/post/types';
import type { DeptResultType } from '@/api/system/dept/types';

export interface FormData {
  id: number | undefined;
  user_name: string;
  nick_name: string;
  password: string;
  phone_number: string;
  email: string;
  gender: string;
  remark: string;
  dept_ids: number[];
  post_ids: number[];
  role_ids: number[];
}
export interface queryParamType {
  page_no: number;
  page_size: number;
  user_name: string;
  phone_number: string;
  dept_id?: number | null;
}
export interface TreeOptionItemType {
  label: string;
  value: number;
  children: TreeOptionItemType[];
}
export interface OptionItemType {
  label: string;
  value: number;
}

const userList = ref<UserResultType[]>([]);
const roleList = ref<RoleResultType[]>([]);
const postList = ref<PostResultType[]>([]);
const deptList = ref<DeptResultType[]>([]);

const open = ref<boolean>(false);
const loading = ref(true);
const total = ref(0);
const title = ref('');
const treeRef = ref<InstanceType<typeof ElTree>>();

const deptOptions = ref<TreeOptionItemType[]>([]);
const postOptions = ref<PostResultType[]>([]);
const roleOptions = ref<RoleResultType[]>([]);

const dialogFormRef = ref<FormInstance>();
// 列显隐信息
const columns = ref([
  { key: 0, label: `用户编号`, visible: true },
  { key: 1, label: `用户名称`, visible: true },
  { key: 2, label: `用户昵称`, visible: true },
  { key: 3, label: `部门`, visible: true },
  { key: 4, label: `手机号码`, visible: true },
  { key: 5, label: `状态`, visible: true },
  { key: 6, label: `创建时间`, visible: true },
]);
const form = ref<FormData>({
  id: undefined,
  user_name: 'redtest',
  nick_name: 'redtest',
  password: '123456',
  phone_number: '19853149156',
  email: 'zhr19853149156@163.com',
  gender: '0',
  remark: '',
  dept_ids: [],
  post_ids: [],
  role_ids: [],
});

const rules: FormRules<FormData> = {
  user_name: [
    { required: true, message: '用户名称不能为空', trigger: 'blur' },
    {
      min: 2,
      max: 20,
      message: '用户名称长度必须介于 2 和 20 之间',
      trigger: 'blur',
    },
  ],
  nick_name: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  password: [
    { required: true, message: '用户密码不能为空', trigger: 'blur' },
    {
      min: 5,
      max: 20,
      message: '用户密码长度必须介于 5 和 20 之间',
      trigger: 'blur',
    },
  ],
  email: [
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change'],
    },
  ],
  phone_number: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur',
    },
  ],
};
const queryParams = reactive<queryParamType>({
  page_no: 1,
  page_size: 10,
  user_name: '',
  phone_number: '',
  dept_id: null,
});

/** 查询用户列表 */
const getList = async () => {
  loading.value = true;
  let res = await getUserList(queryParams);
  if (res.code === 200) {
    userList.value = res.data.users;
    total.value = res.data.totalCount;
    loading.value = false;
  }
};
// 获取角色，部门，岗位列表
const getRoleAndPostAndDeptList = async () => {
  let roleListRes = await getRoleList();
  if (roleListRes.code === 200) {
    roleList.value = roleListRes.data;
  }
  let postListRes = await getPostList();
  if (postListRes.code === 200) {
    postList.value = postListRes.data;
  }
  let deptListRes = await getDeptList();
  if (deptListRes.code === 200) {
    deptList.value = deptListRes.data;
  }
  roleOptions.value = roleList.value;
  postOptions.value = postList.value;
  deptOptions.value = getTreeData(deptList.value);
};
/** 新增按钮操作 */
const handleAdd = async () => {
  reset();
  open.value = true;
  title.value = '添加用户';
};
/** 提交按钮 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (form.value.id != undefined) {
        // 修改用户
      } else {
        // 添加用户
        // 树形控件
        getCheckNodes();
        let res = await addUser(form.value as CreateUserType);
        if (res.code === 200) {
          open.value = false;
          ElMessage.success('添加用户成功');
        } else {
          reset();
          getList();
        }
      }
    } else {
      console.log('error submit', fields);
    }
  });
};
/** 取消按钮 */
const cancel = () => {
  reset();
  open.value = false;
};
/** 当选择项发生变化时会触发该事件  */
const handleSelectionChange = (selection: any) => {
  console.log(selection);
};
const reset = () => {
  dialogFormRef.value?.resetFields();
};
const resolveRoleName = (role: any) => {
  return role[0].dept.map((item: any) => item.dept_name).pop();
};
const getTreeData = (data: any[], _parent?: any) => {
  return data
    .filter((item) => {
      return item.parent_id == _parent?.id;
    })
    .map((item) => {
      let result = {
        value: item.id,
        label: item.dept_name,
        children: getTreeData(data, item),
      } as TreeOptionItemType;
      return result;
    });
};
const getCheckNodes = () => {
  let nodes = treeRef.value!.getCheckedNodes(false, true);
  form.value.dept_ids = nodes.map((item) => item.value);
};
getList();
getRoleAndPostAndDeptList();
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="20" :xs="24">
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

        <el-table
          v-loading="loading"
          :data="userList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            label="用户编号"
            align="center"
            key="id"
            prop="id"
            v-if="columns[0].visible"
          />
          <el-table-column
            label="用户名称"
            align="center"
            key="user_name"
            prop="user_name"
            v-if="columns[1].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="用户昵称"
            align="center"
            key="nick_name"
            prop="nick_name"
            v-if="columns[2].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="部门"
            align="center"
            key="dept_name"
            prop="dept.dept_name"
            v-if="columns[3].visible"
            :show-overflow-tooltip="true"
          >
            <template #default="scope">
              <span>{{ resolveRoleName(scope.row.role) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="手机号码"
            align="center"
            key="phone_number"
            prop="phone_number"
            v-if="columns[4].visible"
            width="120"
          />
          <el-table-column
            label="创建时间"
            align="center"
            prop="create_time"
            v-if="columns[6].visible"
            width="160"
          >
            <template #default="scope">
              <span>{{ scope.row.create_time }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="150"
            class-name="small-padding fixed-width"
          >
            <template #default="scope">
              <el-tooltip
                content="修改"
                placement="top"
                v-if="scope.row.id !== 1"
              >
                <el-text type="primary">
                  <el-icon>
                    <Edit />
                  </el-icon>
                </el-text>
              </el-tooltip>
              <el-tooltip
                content="删除"
                placement="top"
                v-if="scope.row.id !== 1"
              >
                <el-text>
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-text>
              </el-tooltip>
              <el-tooltip
                content="重置密码"
                placement="top"
                v-if="scope.row.id !== 1"
              >
                <el-text type="primary">
                  <el-icon>
                    <Key />
                  </el-icon>
                </el-text>
              </el-tooltip>
              <el-tooltip
                content="分配角色"
                placement="top"
                v-if="scope.row.id !== 1"
              >
                <el-text>
                  <el-icon>
                    <CircleCheck />
                  </el-icon>
                </el-text>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.page_no"
          v-model:limit="queryParams.page_size"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form
        :model="form"
        :rules="rules"
        ref="dialogFormRef"
        label-width="80px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nick_name">
              <el-input
                v-model="form.nick_name"
                placeholder="请输入用户昵称"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="dept_id">
              <el-tree-select
                v-model="form.dept_ids"
                multiple
                ref="treeRef"
                :data="deptOptions"
                node-key="value"
                show-checkbox
                placeholder="请选择归属部门"
                highlight-current
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone_number">
              <el-input
                v-model="form.phone_number"
                placeholder="请输入手机号码"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              v-if="form.id == undefined"
              label="用户名称"
              prop="user_name"
            >
              <el-input
                v-model="form.user_name"
                placeholder="请输入用户名称"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.id == undefined"
              label="用户密码"
              prop="password"
            >
              <el-input
                v-model="form.password"
                placeholder="请输入用户密码"
                type="password"
                maxlength="20"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.gender" placeholder="请选择">
                <el-option
                  v-for="(item, index) in ['男', '女']"
                  :label="item"
                  :value="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="岗位">
              <el-select v-model="form.post_ids" multiple placeholder="请选择">
                <el-option
                  v-for="item in postOptions"
                  :key="item.post_code"
                  :label="item.post_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.role_ids" multiple placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.role_key"
                  :label="item.role_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm(dialogFormRef)"
            >确 定</el-button
          >
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
