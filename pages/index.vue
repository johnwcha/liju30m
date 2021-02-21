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
        sub-text="reached 100,000 and moving forward"
      />
    </v-col>

    <v-col
      cols="12"
      lg="6"
    >
      <material-stats-card
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
    >
      <material-card
        color="purple"
        class="px-5 py-3 my-6"
      >
        <template #heading>
          <div class="display-1 font-weight-light">
            Employees Stats
          </div>

          <!-- <div class="subtitle-1 font-weight-light">
            New employees on 15th September, 2016
          </div> -->
        </template>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="items"
          />
        </v-card-text>
      </material-card>
    </v-col>
  </v-row>
</template>

<script>
// import Logo from '~/components/Logo.vue'
// import VuetifyLogo from '~/components/VuetifyLogo.vue'
import MaterialCard from '~/components/base/MaterialCard'
import MaterialStatsCard from '~/components/base/MaterialStatsCard'
export default {
  components: {
    MaterialCard,
    MaterialStatsCard
  },
  data () {
    return {
      total_char: '',
      unique_char: '',
      video_count: '',
      video_length: '',
      hour: '',
      headers: [
        {
          sortable: false,
          text: 'ID',
          value: 'id'
        },
        {
          sortable: false,
          text: 'Name',
          value: 'name'
        },
        {
          sortable: false,
          text: 'Salary',
          value: 'salary',
          align: 'right'
        },
        {
          sortable: false,
          text: 'Country',
          value: 'country',
          align: 'right'
        },
        {
          sortable: false,
          text: 'City',
          value: 'city',
          align: 'right'
        }
      ],
      items: [
        {
          id: 1,
          name: 'Dakota Rice',
          country: 'Niger',
          city: 'Oud-Tunrhout',
          salary: '$35,738'
        },
        {
          id: 2,
          name: 'Minerva Hooper',
          country: 'Curaçao',
          city: 'Sinaai-Waas',
          salary: '$23,738'
        },
        {
          id: 3,
          name: 'Sage Rodriguez',
          country: 'Netherlands',
          city: 'Overland Park',
          salary: '$56,142'
        },
        {
          id: 4,
          name: 'Philip Chanley',
          country: 'Korea, South',
          city: 'Gloucester',
          salary: '$38,735'
        },
        {
          id: 5,
          name: 'Doris Greene',
          country: 'Malawi',
          city: 'Feldkirchen in Kārnten',
          salary: '$63,542'
        }
      ]
    }
  },
  mounted () {
    // console.log(this.$store.state.userObj)
    if (this.$store.state.userObj === null) {
      this.signin()
    } else {
      this.init()
    }
    this.$fire.auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid
        this.$store.dispatch('setUid', uid)
        this.init()
        this.logEvent()
      }
    })
  },
  methods: {
    signin () {
      this.$fire.auth.signInAnonymously().then(() => {
        // this.init()
      }).catch((error) => { console.error(error.message) })
    },
    async init () {
      const res = await this.$fire.firestore.collection('-video_stats').doc('stats_doc').get()
      // console.log(res.data())
      this.total_char = res.data().total_char.toString()
      this.unique_char = res.data().unique_char.length.toString()
      this.video_count = res.data().video_count.toString()
      this.video_length = (res.data().video_length / 60).toFixed(2).toString()
      this.hour = (this.video_length / 60).toFixed(1).toString()
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
