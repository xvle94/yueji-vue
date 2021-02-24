import axios from 'axios'
import { MessageBox, Message, Input } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router/index'
import { message } from '@/utils/resetMessage';
import this_vue from '@/main';
import Cookies from 'js-cookie'
// create an axios instance

const service = axios.create({
  baseURL: window.PLATFROM_CONFIG.baseUrl, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers['token'] = localStorage.getItem('token')?localStorage.getItem('token'):''
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      config.headers['token'] = localStorage.getItem('token')?localStorage.getItem('token'):''
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 200, it is judged as an error.
    if(res.code === 200){
      return res
    }else if(res.code === 300){
      message.error(res.data);
      router.push('/login');
      Cookies.remove('vue_admin_template_token')
      Cookies.remove('role')
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      // store.dispatch('user/logout').then(() => {
      //   // router.push('/login')
      //   // location.reload()
      // })
      
    }else if(res.code === 510 || res.code === 511 || res.code === 512){
      message.warning('请先进行license认证');
      this_vue.$auth_view({
        centerDialogVisible:true,
        click: () => {
          // 点击按钮事件
          
        }
      })
    }else{
      message({
        message: res.data || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.data || 'Error'))
    }
  },
  error => {
    console.log(error) // for debug
    let str = error.toString();
    if(str.includes('timeout')  ){
      message.error('请求超时，请稍后再试');
    }else{
      message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
