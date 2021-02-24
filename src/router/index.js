import Vue from 'vue'
import Router from 'vue-router'
import { getRole } from '@/utils/auth'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

const role = getRole()
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '仪表盘', icon: 'dashboard' }
    }],
  },

  {
    path: '/overview',
    component: Layout,
    redirect: '/overview',
    children: [{
      path: 'overview',
      name: 'Overview',
      component: () => import('@/views/overview/index'),
      meta: { title: '总览', icon: 'overview' }
    }],
    hidden: role == 3?true:false
  },

  // {
  //   path: '/task',
  //   component: Layout,
  //   redirect: '/task',
  //   children: [{
  //     path: 'task',
  //     name: 'Task',
  //     component: () => import('@/views/task/index'),
  //     meta: { title: '任务总览', icon: 'task' }
  //   }],
  // },
  {
    path: '/task',
    component: Layout,
    redirect: '/task',
    name: 'Task',
    meta: {
      title: '任务总览',
      icon: 'task'
    },
    children: [
      {
        path: 'task',
        component: () => import('@/views/task/index'),
        name:'Task',
        meta: { title: '任务总览', icon: 'task' },
      },
      {
        path: 'timedTask',
        component: () => import('@/views/task/timedTask'),
        name: 'TimedTask',
        meta: { title: '定时任务', icon: 'task' },
      },
    ],
  },

  {
    path: '/infiltration',
    component: Layout,
    redirect: '/infiltration',
    children: [{
      path: 'infiltration',
      name: 'Infiltration',
      component: () => import('@/views/infiltration/index'),
      meta: { title: '渗透测试', icon: 'infiltration' }
    },
    {
      path: 'targetDetail/:id(\\d+)',
      name: 'TargetDetail',
      component: () => import('@/views/infiltration/targetDetail/index'),
      meta: { title: '目标详情' },
      hidden: true
    },
    {
      path: 'add',
      name: 'Add',
      component: () => import('@/views/infiltration/add/index'),
      meta: { title: '专家级' },
      hidden: true
    }],
    hidden: role == 3?true:false
  },

  {
    path: '/loophole',
    component: Layout,
    redirect: '/loophole',
    children: [{
      path: 'loophole',
      name: 'Loophole',
      component: () => import('@/views/loophole/index'),
      meta: { title: '漏洞总览', icon: 'loophole' }
    },
    {
      path: 'targetDetail/:name',
      name: 'TargetDetail',
      component: () => import('@/views/loophole/targetDetail/index'),
      meta: { title: '漏洞详情' },
      hidden: true
    },
    {
      path: 'taskDetail/:id/:tid_id',
      name: 'taskDetail',
      component: () => import('@/views/loophole/taskDetail/index'),
      meta: { title: '任务详情' },
      hidden: true
    }],
    hidden: role == 3?true:false
  },

  {
    path: '/basic',
    component: Layout,
    redirect: '/basic',
    children: [{
      path: 'basic',
      name: 'Basic',
      component: () => import('@/views/basic/index'),
      meta: { title: '基础扫描', icon: 'basic' }
    },
    {
      path: 'targetDetail/:id/:tp_name',
      name: 'TargetDetail',
      component: () => import('@/views/basic/targetDetail/index'),
      meta: { title: '目标详情' },
      hidden: true
    }],
    hidden: role == 3?true:false
  },

  {
    path: '/report',
    component: Layout,
    redirect: '/report',
    children: [{
      path: 'report',
      name: 'Report',
      component: () => import('@/views/report/index'),
      meta: { title: '报告一览', icon: 'report' }
    }],
  },

  {
    path: '/strategy',
    component: Layout,
    redirect: '/strategy',
    name: 'Strategy',
    meta: {
      title: '策略模板',
      icon: 'strategy'
    },
    children: [
      {
        path: 'mineTemplate',
        component: () => import('@/views/strategy/mineTemplate'),
        name:'MineTemplate',
        meta: { title: '我的模板', icon: 'mineTemplate' },
      },
      {
        path: 'loopholeList',
        component: () => import('@/views/strategy/loopholeList'),
        name: 'LoopholeList',
        meta: { title: '漏洞列表', icon: 'loopholeList' },
      },
      {
        path: 'mineConduit',
        component: () => import('@/views/strategy/mineConduit'),
        name:'MineConduit',
        meta: { title: '我的管道', icon: 'mineConduit' },
        hidden: true
      },
      {
        path: 'taskDetail/:pid/',
        name: 'taskDetail',
        component: () => import('@/views/strategy/taskDetail/index'),
        meta: { title: '任务详情' },
        hidden: true
      }
    ],
    hidden: (role == 2 || role == 3)?true:false
  },

  {
    path: '/holdAll',
    component: Layout,
    redirect: '/holdAll',
    children: [{
      path: 'holdAll',
      name: 'HoldAll',
      component: () => import('@/views/holdAll/index'),
      meta: { title: '工具箱', icon: 'holdAll' }
    },
    {
      path: 'repeater/:id',
      name: 'Repeater',
      component: () => import('@/views/holdAll/repeater/index'),
      meta: { title: '中继器' },
      hidden: true
    },
    {
      path: 'intrusion/:id',
      name: 'Intrusion',
      component: () => import('@/views/holdAll/intrusion/index'),
      meta: { title: '入侵' },
      hidden: true
    }
    ],
    hidden: role == 3?true:false
  },

  {
    path: '/systemSet',
    component: Layout,
    redirect: '/systemSet',
    children: [{
      path: 'systemSet',
      name: 'SystemSet',
      component: () => import('@/views/systemSet/index'),
      meta: { title: '系统设置', icon: 'systemSet' }
    }],
    hidden: (role == 2 || role == 3)?true:false
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
