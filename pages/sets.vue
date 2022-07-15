<template>
  <v-row justify="center" align="center">
    <v-col
      cols="12"
    >
      <material-card
        color="purple"
        class="px-5 py-3 my-6"
      >
        <template #heading>
          <div class="display-1 font-weight-light">
            Community contributed sets
          </div>

          <!-- <div class="subtitle-1 font-weight-light">
            New employees on 15th September, 2016
          </div> -->
        </template>
        <v-card-title>
          <v-text-field
            v-model="filter"
            append-icon="mdi-magnify"
            label="Search (English or Chinese)"
            single-line
            hide-details
            class="pink--text"
          />
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="items"
            :search="filter"
          >
            <template #[`item.link`]="{ item }">
              <v-icon class="info--text" @click="openLink(item)"> mdi-open-in-new </v-icon>
            </template>
          </v-data-table>
        </v-card-text>
      </material-card>
    </v-col>
  </v-row>
</template>

<script>
import MaterialCard from '~/components/base/MaterialCard'
export default {
  components: {
    MaterialCard
  },
  data () {
    return {
      filter: '',
      headers: [
        {
          sortable: false,
          text: 'Keywords',
          value: 'search'
        },
        {
          sortable: true,
          text: 'Notes',
          value: 'note'
        },
        {
          sortable: true,
          text: 'Contributor',
          value: 'contributor'
        },
        {
          sortable: true,
          text: 'Last updated',
          value: 'time',
          align: 'right'
        },
        {
          sortable: false,
          text: 'Link',
          value: 'link',
          align: 'right'
        }
      ],
      items: []
    }
  },
  mounted () {
    // console.log(this.$store.state.userObj)
    // console.log(this.$fire.auth.currentUser)
    if (this.$fire.auth.currentUser === null) {
      this.$fire.auth.signInAnonymously().then(() => {
        this.init()
      }).catch((error) => { console.error(error.message) })
    } else {
      this.init()
    }

    // if (this.$store.state.uid === '') {
    //   this.$router.push('/')
    // } else {
    //   this.init()
    // }
  },
  destroyed () {

  },
  methods: {
    openLink (item) {
      // console.log(item)
      // window.open(`http://localhost:3000/demo/?id=${item.sid}`, '_blank')
      window.open(`https://liju30m.web.app/demo/?id=${item.sid}`, '_blank')
    },
    async init () {
      const res = await this.$fire.firestore.collection('-video_demo').get()
      // console.log(res.data())
      res.forEach((set) => {
        this.items.push({ sid: set.id, ...set.data() })
      })
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
