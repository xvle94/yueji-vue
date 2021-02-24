import Vue from 'vue'
import  * as auth from '@/utils/auth'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// import Popup from "./components/popup/index.js"
import {
  message
} from '@/utils/resetMessage';

import echarts from 'echarts'
require('echarts/extension/dataTool')

Vue.use(echarts)

import DAGBoard from 'dag-board'
Vue.use(DAGBoard)

import AuthView from '@/utils/auth_view';
Vue.prototype.$auth_view = AuthView.install
// Vue.use(AuthView)

import less from 'less'
Vue.use(less)

// 定时计划全局弹窗组件
import Popup from '@/utils/popup'
Vue.prototype.$popup = Popup.install

// 模板全局弹窗组件
import Template from '@/utils/template'
Vue.prototype.$template = Template.install

//判断是否登录
router.beforeEach(function (to, from, next) {
  console.log(to);
  if (to.meta.needLogin) {
    //从cookie中获取用户信息，判断是否已登录
    if (auth.getAdminInfo().userUuid) {
      next(); //表示已经登录
    } else {
      //未登录
      //next可以传递一个路由对象作为参数 表示需要跳转到的页面
      next({
        name: "login",
        query: {redirect: to.meta.redirect} //登录后再跳回此页面时要做的配置
      });
    }
  } else {
    //表示不需要登录
    next(); //继续往后走
  }
  // if(to.path === '/login') next();
  // const tokenStr = window.localStorage.getItem('token');
  // if(!tokenStr) return next('/login');
  // next();
});
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.prototype.$message = message;
Vue.config.productionTip = false


var vue=new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

export default vue;
