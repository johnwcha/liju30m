export const state = () => ({
  userObj: null, // { uid, email, displayName, isAnonymous }
  userData: null, // { displayName, membership, school, classes }
  userItems: [],
  allVideos: {},
  randomstring: '',
  items: [
    {
      icon: 'mdi-apps',
      title: '大海撈 • 珍',
      color: 'purple',
      to: '/'
    },
    {
      icon: 'mdi-magnify',
      title: '海撈 • Search',
      color: 'orange',
      to: '/search'
    }
    // {
    //   icon: 'mdi-pot-steam',
    //   title: '招牌鍋底 • Special',
    //   color: 'green',
    //   to: '/base'
    // }
    // {
    //   icon: 'mdi-rhombus-split',
    //   title: '拼盤 • GP Combo',
    //   color: 'cyan',
    //   to: '/demom'
    // }
  ]
})

export const getters = {
  randomstring (state) {
    return state.randomstring
  }
}

export const mutations = {
  SET_UID (state, uid) {
    state.uid = uid
    // console.log(uid)
  },
  SET_USEROBJ (state, userObj) {
    state.userObj = userObj
    if (userObj === null) {
      state.userData = null
      state.userItems = []
    }
  },
  SET_USERDATA (state, userData) {
    // console.log(userData)
    state.userData = userData
  },
  SET_USERITEMS (state, items) {
    // console.warn(items)
    items.forEach((item) => {
      state.userItems.push(item)
    })
  },
  SET_ALLVIDEOS (state, allVideos) {
    console.log(allVideos)
    state.allVideos = allVideos
  },
  SET_RANDOM (state, random) {
    // console.log(random)
    console.log(random.data().randomstring)
    state.randomstring = random.data().randomstring
  }
}

export const actions = {
  onAuthStateChangedAction (state, { authUser, claims }) {
    // console.log(authUser)
    if (!authUser) {
      // console.log('user object NULL')
      // claims = null
      // Perform logout operations
      state.commit('SET_USEROBJ', null)
      // this.$router.push({ path: '/' })
      // state.commit('SET_USERITEMS', items)
    } else {
      // Do something with the authUser and the claims object...
      const { uid, email, displayName, isAnonymous } = authUser
      state.commit('SET_USEROBJ', { uid, email, displayName, isAnonymous })
      // console.warn('isAnonymous', isAnonymous, email)
      if (!isAnonymous) {
        const items = [
          {
            icon: 'mdi-pot-mix', // mdi-bowl-mix
            title: '私藏 • My Collection',
            color: 'pink',
            to: '/mysets'
          },
          {
            icon: 'mdi-rhombus-split',
            title: '拼盤 • Combo',
            color: 'cyan',
            to: '/demom'
          }
        ]
        state.commit('SET_USERITEMS', items)
        state.dispatch('getUserData', email)
      }
    }
  },
  setUid ({ commit }, uid) {
    commit('SET_UID', uid)
  },
  setUserObj ({ commit }, userObj) {
    commit('SET_USEROBJ', userObj)
  },
  setUserData ({ commit }, userData) {
    commit('SET_USERDATA', userData)
  },
  async getUserData ({ commit }, email) {
    const res = await this.$fire.firestore.collection('-video_user').where('email', '==', email).get()
    // console.log(res)
    res.forEach((item) => {
      // console.log(item.data())
      const displayName = item.data().displayName
      const membership = item.data().membership
      const school = item.data().school
      const classes = item.data().classes
      commit('SET_USERDATA', { displayName, membership, school, classes })
    })
    const rs = await this.$fire.firestore.collection('-video_user').doc('randomstring').get()
    // console.log(rs)
    commit('SET_RANDOM', rs)
  },
  async getAllVideos ({ commit }) {
    const temp = []
    const res = await this.$fire.firestore.collection('-video_meta').where('access', '==', 0).get()
    res.forEach((doc) => {
      temp.push({ id: doc.id, ...doc.data() })
    })
    commit('SET_ALLVIDEOS', { temp })
  }
}

// This error usually occurs if you're watching the passed in value somewhere
// which causes an infinite update loop but if you're not watching, it could be
// due to you passing in the original value rather than a copy.

// IINDEX page
// check if registered
// yes: show app icon
// no : direct to ACCOUNT page
