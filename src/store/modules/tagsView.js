
const tagsView = {
  state: {
    visitedViews: []
  },
  mutations: {
    ADD_VISITED_VIEW: (state, view) => {
      if(state.visitedViews.some(v => v.path === view.path)) return
      state.visitedViews.push(Object.assign({}, view, {
        title: view.name || 'no-name',
        affix: view.meta ? view.meta.affix : false
      }))
    },
    DEL_VISITED_VIEW: (state, view) => {
      for(const [i, v] of state.visitedViews.entries()) {
        if(v.path === view.path) {
          state.visitedViews.splice(i, 1)
          break;
        }
      }
    },
    DEL_OTHERS_VISITED_VIEWS: (state, view) => {
      state.visitedViews = state.visitedViews.filter(v => {
        return v.meta.affix || v.path === view.path
      })
    },
    DEL_ALL_VISITED_VIEWS: state => {
      // keep affix tags
      const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
      state.visitedViews = affixTags
    },
    UPDATE_VISITED_VIEW: (state, view) => {
      for (let v of state.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    },
    DEL_RIGHT_VIEWS: (state, view) => {
      const index = state.visitedViews.findIndex(v => v.path === view.path)
      if (index === -1) {
        return
      }
      state.visitedViews = state.visitedViews.filter((item, idx) => {
        if (idx <= index || (item.meta && item.meta.affix)) {
          return true
        }
        return false
      })
    },
    DEL_LEFT_VIEWS: (state, view) => {
      const index = state.visitedViews.findIndex(v => v.path === view.path)
      if (index === -1) {
        return
      }
      state.visitedViews = state.visitedViews.filter((item, idx) => {
        if (idx >= index || (item.meta && item.meta.affix)) {
          return true
        }
        return false
      })
    }
  },
  actions: {
    addView({ dispatch }, view) {
      dispatch('addVisitedView', view)
    },
    addVisitedView({ commit }, view) {
      commit('ADD_VISITED_VIEW', view)
    },
    delView({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delVisitedView', view)
        resolve({
          visitedViews: [...state.visitedViews]
        }) 
      })
    },
    delVisitedView({ commit }, view) {
      commit('DEL_VISITED_VIEW', view)
    },
    delOthersViews({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delOthersVisitedViews', view)
        resolve({
          visitedViews: [...state.visitedViews]
        })
      })
    },
    delOthersVisitedViews({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delAllViews({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delAllVisitedViews', view)
        resolve({
          visitedViews: [...state.visitedViews]
        })
      })
    },
    delAllVisitedViews({ commit, state }) {
      return new Promise(resolve => {
        commit('DEL_ALL_VISITED_VIEWS')
        resolve([...state.visitedViews])
      })
    },
    updateVisitedView({ commit }, view) {
      commit('UPDATE_VISITED_VIEW', view)
    },
    delRightTags({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_RIGHT_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delLeftTags({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_LEFT_VIEWS', view)
        resolve([...state.visitedViews])
      })
    }
  }
}
export default {
  namespaced: true,
  ...tagsView
}