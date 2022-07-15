<template>
  <v-row justify="center" align="center">
    <v-col
      cols="12"
      lg="6"
    >
      <material-stats-card
        class="my-5"
        color="info"
        icon="mdi-translate"
        title="# of unique chars indexed"
        :value="unique_char"
        sub-icon="mdi-calendar"
        sub-text="Next milestone: 3000"
      />
    </v-col>

    <v-col
      cols="12"
      lg="6"
    >
      <material-stats-card
        color="pink"
        icon="mdi-poll"
        title="total # of chars indexed"
        :value="total_char"
        sub-icon="mdi-tag"
        sub-text="reached 200,000 and moving forward"
      />
    </v-col>

    <v-col
      cols="12"
      lg="6"
    >
      <material-stats-card
        class="my-5"
        color="success"
        icon="mdi-youtube"
        title="total # of minutes of video"
        :value="video_length"
        sub-icon="mdi-clock"
        :sub-text="`That's about ${hour} hours of video`"
      />
    </v-col>

    <v-col
      cols="12"
      lg="6"
    >
      <material-stats-card
        color="orange"
        icon="mdi-sofa"
        title="# of videos indexed"
        :value="video_count"
        sub-icon="mdi-video-plus"
        sub-text="Continue to grow ..."
      />
    </v-col>

    <v-col
      cols="12"
      lg="6"
    >
      <material-stats-card
        class="my-5"
        color="amber lighten-1"
        icon="mdi-folder-settings"
        title="# of sentence sets created"
        :value="total_set"
        sub-icon="mdi-format-list-bulleted"
        sub-text="+ create your own set"
      />
    </v-col>
    <v-col
      cols="12"
      lg="6"
    >
      <material-stats-card
        color="cyan"
        icon="mdi-text-search"
        title="# of searches made"
        :value="total_search"
        sub-icon="mdi-magnify"
        sub-text="both keyword & pattern searches"
      />
    </v-col>
  </v-row>
</template>

<script>
import MaterialStatsCard from '~/components/base/MaterialStatsCard'
export default {
  components: {
    MaterialStatsCard
  },
  data () {
    return {
      total_char: '',
      total_search: '',
      total_set: '',
      unique_char: '',
      video_count: '',
      video_length: '',
      hour: ''
    }
  },
  mounted () {
    // console.log(this.$store.state.userObj)
    // this.$fire.auth.onAuthStateChanged((user) => {
    //   if (user) {
    //     // User is signed in, see docs for a list of available properties
    //     // https://firebase.google.com/docs/reference/js/firebase.User
    //     // user.displayName
    //     // user.email
    //     // user.isAnonymous
    //     console.log(user)
    //     const uid = user.uid
    //     this.$store.dispatch('setUid', uid)
    //     // this.init()
    //     this.logEvent()
    //   }
    // })
    if (this.$store.state.userObj === null) {
      // this.signin()
      this.$router.push('/account')
    } else {
      this.init()
    }
  },
  methods: {
    // async testfb () {
    //   const res = await this.$fire.firestore.collection('祝').get()
    //   // console.log(res.data())
    //   res.forEach((item) => {
    //     console.log(item.data())
    //   })
    // },
    // signin () {
    //   this.$fire.auth.signInAnonymously().then(() => {
    //     this.init()
    //   }).catch((error) => { console.error(error.message) })
    // },
    async init () {
      const res = await this.$fire.firestore.collection('-video_stats').doc('stats_doc').get()
      // console.log(res.data())
      this.total_char = res.data().total_char.toString()
      this.unique_char = res.data().unique_char.length.toString()
      this.video_count = res.data().video_count.toString()
      this.video_length = res.data().video_length.toString()
      this.hour = (res.data().video_length / 60).toFixed(1).toString()
      this.total_search = res.data().total_search.toString()
      this.total_set = res.data().total_set.toString()
    },
    async logEvent () {
      try {
        await this.$fire.analytics.logEvent('login')
        // alert("Event 'analytics_button_clicked' logged to Google Analytics")
      } catch (e) {
        alert(e)
      }
    }
  }
}
</script>

<style scoped>
.v-sheet {
  border-radius: 8px;
}
</style>
