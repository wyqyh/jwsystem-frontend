import { login } from '../../api/login'

import { setUid, setUName, setAvatar, getUid, getUName, getAvatar, removeUid, removeUName, removeAvatar } from '../../utils/auth'

const user  = {
  state: {
    uid: getUid(),
    uname: getUName(),
    loadMenus: false,
    avatar: getAvatar()
  },
  mutations: {
    SET_UID: (state, uid) => {
      setUid(uid)
      state.uid = getUid()
    },
    SET_UNAME: (state, name) => {
      setUName(name)
      state.uname = getUName()
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    },
    SET_AVATAR: (state, avatar) => {
      setAvatar(avatar)
      state.avatar = getAvatar()
    }
  },
  actions: {
    Login({commit}, userInfo) {
      const username = userInfo.username
      const password = userInfo.password
      const checkcode = userInfo.checkcode
      return new Promise((resolve, reject) => {
        login(username, password, checkcode).then(res => {
          if(res) {
            let uid = res.id
            let uname = res.name
            let avatar = (res.avatar === null || res.avatar === '') 
              ? require('../../assets/images/avatar.png') : res.avatar
            commit('SET_UID', uid)
            commit('SET_UNAME', uname)
            commit('SET_AVATAR', avatar)
            commit('SET_LOAD_MENUS', true)
            resolve()
          } else {
            reject()
          }
        })
      })
    },

    Logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        removeUid()
        removeUName()
        removeAvatar()
        resolve()
      })
    },

    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    }
  }
}

export default user