<template>
  <v-row justify="center" align="center">
    <v-col
      cols="12"
    >
      <BaseMaterialCard
        v-if="items.length > 0"
        color="yellow darken-2"
        class="px-5 py-3 my-10"
      >
        <template #heading>
          <div class="display-1 font-weight-light">
            My Collection
          </div>
        </template>
        <v-card-title>
          <v-text-field
            v-model="filter"
            append-icon="mdi-magnify"
            label="Search (English or Chinese)"
            single-line
            hide-details
            class="pink--text"
          ></v-text-field>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="items"
            :search="filter"
          >
            <template #[`item.link`]="{ item }">
              <v-icon class="info--text" @click="openLink(item)"> mdi-open-in-new </v-icon>
              <!-- <v-icon class="pink--text" @click="editLink(item)"> mdi-playlist-edit </v-icon> -->
            </template>
          </v-data-table>
        </v-card-text>
      </BaseMaterialCard>
    </v-col>
  </v-row>
</template>

<script>
export default {
  asyncData ({ req, redirect }) {
    // console.log(req, redirect)
    // console.warn(process.server) // loading from server (true) or navigate from another page (false)
    if (process.server) {
      redirect('/')
    }
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
          text: 'Last updated',
          value: 'time',
          align: 'right'
        },
        {
          sortable: false,
          text: 'Actions',
          value: 'link',
          align: 'left'
        }
      ],
      items: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    editLink (item) {
      window.open(`http://localhost:3000/search/?id=${item.sid}`)
      // window.open(`https://liju30m.web.app/demo/?id=${item.sid}`, '_blank')
    },
    openLink (item) {
      // console.log(item)
    //   window.open(`http://localhost:3000/demo/?id=${item.sid}`, '_blank')
      window.open(`https://liju30m.web.app/demo/?id=${item.sid}`, '_blank')
    },
    init () {
      const email = this.$store.state.userObj.email
      this.$fire.firestore.collection('-video_demo').where('email', '==', email).get().then((res) => {
        // console.log(res)
        // console.log(res.docs)
        res.forEach((set) => {
          this.items.push({ sid: set.id, ...set.data() })
        })
      }).catch((err) => {
        console.log(err.message)
      })
    }
  }
}
</script>
