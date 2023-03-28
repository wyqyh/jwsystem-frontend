import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/Login.vue'
import Registe from '../views/registe.vue'
import Layout from '../layout/index'
import Index from "../views/index"
import GrantRoles from "../views/system/user/grantrole.vue"
import UserCenter from "../views/system/user/center"
import StudentList from "../views/basicdata/class/studentlist.vue"
import AddCourseDetail from "../views/course/detail/add"

import store from '@/store'
import { getUid } from '../utils/auth'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style

Vue.use(VueRouter)
NProgress.configure({showSpinner: false})// NProgress Configuration

export const constantRouters = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    hidden: true
  },
  {
    path: '/registe',
    name: 'Registe',
    component: Registe,
    hidden: true
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: UserCenter,
        name: '个人中心'
      },
      {
        path: 'grantrole/:uid',
        component: GrantRoles,
        name: '分配角色'
      }
    ]
  },
  {
    path: '/class',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'student',
        component: StudentList,
        name: '学员列表'
      }
    ]
  },
  {
    path: '/course',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'detail/add',
        component: AddCourseDetail,
        name: '添加细化课表'
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        component: Index,
        name: '首页',
        icon: 'dashboard',
        meta: {
          affix: true
        }
      }
    ]
  }
]

const router = new VueRouter({
  routes: constantRouters
})

const whiteList = ['/login', '/registe']

router.beforeEach((to, from, next) => {
  let uid = getUid()
  NProgress.start()
  if(uid == null) {
    if(whiteList.indexOf(to.path) == -1) {
      next({path: "/login"})
      NProgress.done()
    } else {
      next()
    }
  } else {
    if(whiteList.indexOf(to.path) !== -1) {
      next({path: "/"})
      NProgress.done()
    } else {
      if(store.getters.sidebarRouters == null || store.getters.sidebarRouters.length === 0) {
        store.dispatch('GenerateRoutes', uid).then(accessRouters => {
          accessRouters.forEach(route => {
            router.addRoute(route)
          })
        })
      }
      next();
    }
    
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

export default router
