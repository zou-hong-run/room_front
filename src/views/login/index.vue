<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store/user';
import router from '@/router';

import { getCaptcha } from '@/api/login';

const $route = useRoute();

const userStore = useUserStore();

const formRef = ref<FormInstance>();

export interface LoginFormData {
  username: string;
  password: string;
  captcha: string;
}
const loginFormData = reactive<LoginFormData>({
  username: 'zhangsan',
  password: '123456',
  captcha: 'ouhidj',
});
const redirect = ref('');
watch(
  $route,
  (newRoute) => {
    redirect.value = newRoute.query && (newRoute.query.redirect as string);
  },
  { immediate: true },
);

const loading = ref(false);

const rules = reactive<FormRules<typeof loginFormData>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 6, max: 12, message: '长度6到12', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 12, message: '长度6到12', trigger: 'blur' },
  ],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
});
const handleLogin = async () => {
  try {
    loading.value = true;
    await userStore.Login(loginFormData);
    ElMessage.success({
      message: '登录成功，正在跳转到首页',
      duration: 3000,
    });
    router.push({ path: redirect.value || '/' });
  } catch (error) {
    ElMessage.error({
      message: '登录失败:' + error,
      duration: 3000,
    });
  } finally {
    loading.value = false;
  }
};
const setCaptcha = async () => {
  let username = loginFormData.username;
  if (!username) {
    ElMessage.error('请输入用户名');
    return;
  }
  try {
    loading.value = true;
    await getCaptcha(loginFormData.username);
    ElMessage.success({
      message: '获取验证码成功，请查看邮箱获取验证码',
      duration: 5000,
    });
  } catch (error) {
    ElMessage.error({
      message: '获取验证码失败',
      duration: 3000,
    });
  } finally {
    loading.value = false;
  }
};
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      await handleLogin();
    } else {
      ElMessage.error('表单校验失败，请检查输入项');
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<template>
  <div class="login">
    <el-row>
      <el-col :xs="0" :sm="0" :md="8" :span="8"></el-col>
      <el-col :xs="24" :sm="24" :md="8" :span="8">
        <el-form
          ref="formRef"
          :model="loginFormData"
          status-icon
          :rules="rules"
          label-width="80px"
          class="login_form"
        >
          <el-form-item>
            <h1>redrun_admin管理系统</h1>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input
              clearable
              placeholder="请输入用户名"
              v-model="loginFormData.username"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="密&nbsp;&nbsp;&nbsp;码" prop="password">
            <el-input
              placeholder="请输入用户密码"
              clearable
              v-model="loginFormData.password"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="验证码" prop="captcha">
            <div class="captcha">
              <el-input
                placeholder="请输入验证码"
                clearable
                v-model="loginFormData.captcha"
              />
              <el-button :loading="loading" @click="setCaptcha"
                >获取验证码</el-button
              >
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm(formRef)"
              :loading="loading"
              >登录</el-button
            >
            <el-button @click="resetForm(formRef)">清空表单</el-button>
          </el-form-item>
        </el-form></el-col
      >
      <el-col :xs="0" :sm="0" :md="8" :span="8"></el-col>
    </el-row>
  </div>
</template>
<style scoped lang="scss">
.login {
  width: 100%;
  height: 100%;
  h1 {
    font-size: 20px;
    font-weight: bold;
  }
  .login_form {
    margin-top: 20vh;

    border: 1px solid pink;
    border-radius: 15px;
    padding: 50px;
    .captcha {
      width: 100%;
      display: flex;
    }
  }
  .login_form:hover {
    border-radius: 10px;

    border: 1px dashed blue;
  }
}
</style>
