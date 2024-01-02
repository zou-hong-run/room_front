<script setup lang="ts">
import { ref, reactive } from 'vue';
import { getPostList, addPost } from '@/api/system/post';
import { FormInstance, ElMessage } from 'element-plus';
import {
  CreatePostParamType,
  PostListResultType,
} from '@/api/system/post/types';

const postList = ref<PostListResultType>([]);

const loading = ref(true);
const total = ref(0);
const title = ref('');
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
});

const addPostFormRef = ref<FormInstance>();
const showAddPostDialogForm = ref(false);
const rules = {
  post_name: [{ required: true, message: '岗位名不能为空', trigger: 'blur' }],
  post_code: [{ required: true, message: '岗位代码能为空', trigger: 'blur' }],
};

const addPostFormData = reactive<CreatePostParamType>({
  post_name: '',
  post_code: '',
  remark: '',
});

// 查询岗位列表
const getList = async () => {
  loading.value = true;
  let res = await getPostList();
  if (res.code === 200) {
    postList.value = res.data;
    loading.value = false;
  }
};

// 重置新增的表单以及其他数据
const resetAddPostForm = () => {
  addPostFormRef.value?.resetFields();
};
// 添加岗位
const handlePost = async () => {
  resetAddPostForm();
  showAddPostDialogForm.value = true;
  title.value = '添加岗位';
};
// 提交添加岗位按钮
const submitAddPostForm = () => {
  addPostFormRef.value?.validate(async (valid) => {
    if (valid) {
      console.log(addPostFormData);
      let res = await addPost(addPostFormData);
      if (res.code === 200) {
        ElMessage.success('添加新岗位成功');
      } else {
        ElMessage.success('添加新岗位失败');
      }
      showAddPostDialogForm.value = false;
    }
  });
};
/** 取消按钮 */
function cancelPostPost() {
  showAddPostDialogForm.value = false;
  resetAddPostForm();
}

getList();
</script>
<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handlePost"
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
    <el-table v-loading="loading" :data="postList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="岗位编号" prop="id" width="120" />
      <el-table-column
        label="岗位名称"
        prop="post_name"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="岗位代码"
        prop="post_code"
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

    <!-- 添加岗位配置对话框 -->
    <el-dialog
      :title="title"
      v-model="showAddPostDialogForm"
      width="500px"
      append-to-body
    >
      <el-form
        ref="addPostFormRef"
        :model="addPostFormData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="岗位名称" prop="post_name">
          <el-input
            v-model="addPostFormData.post_name"
            placeholder="请输入岗位名称"
          />
        </el-form-item>
        <el-form-item label="岗位代码" prop="post_code">
          <el-input
            v-model="addPostFormData.post_code"
            placeholder="请输入岗位代码"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="addPostFormData.remark"
            type="textarea"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitAddPostForm">确 定</el-button>
          <el-button @click="cancelPostPost">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
