<template>
  <div class="login">
    <el-form 
      class="login-form" 
      :model="loginForm"
      status-icon
      ref="loginFormRef"
      :rules="loginFormRule">
      <h3>教学管理系统</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="登录名">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input :type="passwordType" v-model="loginForm.password" auto-complete="off" placeholder="密码">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
          <svg-icon slot="suffix" class="show-pwd" 
            @click="showPwd" :icon-class="passwordType === 'password' ? 'no_eye' : 'eye'"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%">
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode">
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width: 100%" @click="handleLogin"
          >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      codeUrl: 'http://localhost:8083/kaptcha/create',
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      loginFormRule: {
        username: [
          { required: true, message: "登录名不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ]
      },
      passwordType: 'password'
    }
  },
  methods: {
    getCode() {
      this.codeUrl = 'http://localhost:8083/kaptcha/create?timestamp=' + new Date().getTime()
    },
    showPwd() {
      if(this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginFormRef.validate(valid => {
        if(valid) {
          const user = {
            username: this.loginForm.username,
            password: this.loginForm.password,
            checkcode: this.loginForm.code
          }
          this.$store.dispatch('Login', user).then(() => {
            this.$router.push("/")
          }).catch(() => {
            this.codeUrl = 'http://localhost:8083/kaptcha/create?timestamp=' + new Date().getTime()
            this.$message({
              title: '提示',
              message: '用户名或密码错误',
              type: 'warning',
              duration: 3000
            })
          })
        } else {
            this.codeUrl = 'http://localhost:8083/kaptcha/create?timestamp=' + new Date().getTime()
            return false
          }
      })
    }
  }
}
</script>

<style lang="less">
.login{
  display: flex;
  height: 100%;
  background-image: url("../assets/images/background.webp");
  background-size: cover;
  justify-content: center;
  align-items: center;
}
.login-form {
  width: 400px;
  border-radius: 6px;
  background: #fff;
  padding: 25px 25px 5px 25px;
}

.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle
  }
}
.show-pwd {
  text-align: center;
  padding-right: 10px;
  padding-top: 15px;
  display: inline-flex;
}
.el-form-item--feedback {
  .el-input__validateIcon {
    display: none;
  }
}
</style>
