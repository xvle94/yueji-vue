<template>
  <div class="login-container">
    <div class="title-container">
      <h3 class="title">岳戟 - web应用安全检测平台</h3>
    </div>
    <div class="from-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-form-item prop="code" style="width:71%;float:left;">
          <span class="svg-container">
            <svg-icon icon-class="verify" />
          </span>
          <el-input
            ref="code"
            v-model="loginForm.code"
            placeholder="输入验证码"
            name="code"
            type="text"
            tabindex="3"
            auto-complete="on"
            maxlength="4"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <div class="captcha_code" style="float:right;width:27%;border-radius:10px;overflow:hidden;cursor:pointer;">
          <img style="display:inline-block;width:100%;height:100%;float:right;" :src="'data:image/png;base64,'+imgUrl" ref="code" @click="changeCode">
        </div>
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;font-size:16px;line-height:16px;background:#07BDFE;border-radius:10px" @click.native.prevent="handleLogin">登 录</el-button>
      </el-form>
    </div>
    
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validateVerify = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入验证码'))
      }else if(value.length>4){
        callback(new Error('请输入4位数验证码'))
      } else {
        callback()
      }
    }
    return {
      imgUrl:'',
      loginForm: {
        username: '',
        password: '',
        code:'',
        codeId:''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        code: [{ required: true, trigger: 'blur', validator: validateVerify }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  mounted() {
    this.changeCode();
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            location.reload();
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false;
            
          }).catch((error) => {
            this.changeCode();
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeCode() {
      this.$store.dispatch('user/getverify').then((res) => {
        this.imgUrl = res.data.imgCodeByte;
        this.loginForm.codeId = res.data.uuid
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  min-height: 936px;
  .el-input {
    display: inline-block;
    height: 26px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 26px;
      caret-color: $cursor;
      
      &:-webkit-autofill {
        // box-shadow: 0 0 0px 1000px $bg inset !important;
        // -webkit-text-fill-color: $cursor !important;
        -webkit-text-fill-color: #fff !important;
        transition: background-color 5000s ease-in-out 0s;
      }
    }
  }

  .el-form-item {
    border: 1px solid #fff;
    border-radius: 10px;
    color: #fff;
  }
  
  .el-form-item__content{
    line-height: 28px !important;
  }
  
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#fff;
$light_gray:#fff;

.login-container {
  min-height: 100%;
  width: 100%;
  background: url(../../../public/login_bg.jpg) center no-repeat;
  background-size: auto;
  overflow: hidden;
  position: relative;
  .from-container{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .login-form {
      // position: relative;
      width: 520px;
      max-width: 100%;
      padding: 0 60px 0;
      margin: 0 auto;
      overflow: hidden;
    }
  }
  

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: absolute;
    // top: 120px;
    top: 20%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 100%;
    max-width: 100%;
    .title {
      // font-size: 52px;
      font-size: 3.3rem;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: normal;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
  
</style>
