
import {getRouters} from '../../api/menu'
import { constantRouters } from "../../router/index"
import Layout from "@/layout/index"

const permission = {
  state: {
    sidebarRouters: [],
    permissions: []
  },
  mutations: {
    SET_SIDERBAR_ROUTERS: (state, routers) => {
      state.sidebarRouters = routers
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },
  actions: {
    GenerateRoutes({commit}, uid) {
      return new Promise(resolve => {
        getRouters(uid).then(res => {
          let menus = res.menus
          if(menus && menus.length > 0) {
            const rdata = JSON.parse(JSON.stringify(menus))
            const sdata = JSON.parse(JSON.stringify(menus))
            const sidebardata = filterAsyncRouter(rdata)
            const rewritedata = filterAsyncRouter(sdata)
            commit('SET_SIDERBAR_ROUTERS', constantRouters.concat(sidebardata))
            resolve(rewritedata)

            let perms = res.perms
            commit('SET_PERMISSIONS', perms)
          }
        })
      })
    }
  }
}

function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if(route.component) {
      if(route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = loadView(route.component)
      }
    }
    
    if(route.children && route.children !== null && route.children.length > 0) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}

function loadView(view) {
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default permission