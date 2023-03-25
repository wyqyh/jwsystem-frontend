<template>
  <div class="registe">
    <el-form 
      class="registe-form" 
      :model="registeForm"
      status-icon
      ref="registeFormRef"
      :rules="registeFormRule">
    </el-form>
  </div>   
</template>

<script>
export default {
  name: 'Registe',
  data() {
    return {
      registeForm: {},
      registeFormRule: {
        account: [
          { required: true, message: "登录账号不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "真实姓名不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "真实姓名不能为空", trigger: "blur" }
        ]
      }
    }
  }
}
</script>

<style lang="less">
.registe{
  display: flex;
  height: 100%;
  background-image: url("../assets/images/background.webp");
  background-size: cover;
  justify-content: center;
  align-items: center;
}
.registe-form {
  width: 400px;
  border-radius: 6px;
  background: #fff;
  padding: 25px 25px 5px 25px;
}
</style>