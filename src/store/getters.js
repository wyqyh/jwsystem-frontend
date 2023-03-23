const getters = {
  uid: state => state.user.uid,
  uname: state => state.user.uname,
  userinfo: state => state.user.userInfo,
  sidebarRouters: state => state.permission.sidebarRouters,
  permissions: state => state.permission.permissions,
  sidebar: state => state.app.sidebar,
  loadMenus: state => state.user.loadMenus,
  avatar: state => state.user.avatar
}
export default getters
