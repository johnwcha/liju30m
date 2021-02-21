export const state = () => ({
  uid: '',
  userObj: null
})

export const mutations = {
  SET_UID (state, uid) {
    state.uid = uid
    // console.log(uid)
  },
  SET_USEROBJ (state, userObj) {
    state.userObj = userObj
    console.log(userObj)
  }
}

export const actions = {
  setUid ({ commit }, uid) {
    commit('SET_UID', uid)
  },
  setUserObj ({ commit }, userObj) {
    commit('SET_USEROBJ', userObj)
  }
}

// This error usually occurs if you're watching the passed in value somewhere
// which causes an infinite update loop but if you're not watching, it could be
// due to you passing in the original value rather than a copy.

// IINDEX page
// check if registered
// yes: show app icon
// no : direct to ACCOUNT page
