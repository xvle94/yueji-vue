import Vue from 'vue'
import AuthView from '@/views/auth/auth.vue'

const AuthViewBox = Vue.extend(AuthView)

AuthView.install = function (data) {
  console.log(data);
  let instance = new AuthViewBox({
    data
  }).$mount()

  document.body.appendChild(instance.$el)

  Vue.nextTick(() => {
    instance.show = true
    // show 和弹窗组件里的show对应，用于控制显隐
  })
}

export default AuthView
