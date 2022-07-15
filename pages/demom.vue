<template>
  <v-layout row justify-center>
    <v-flex>
      <v-row>
        <v-col cols="12" md="7" class="mx-1">
          <div class="iframe_div">
            <youtube
              ref="youtube"
              :video-id="videoId"
              :player-vars="playerVars"
              :resize="true"
              :fit-parent="true"
            />
            <v-slider
              v-model="slider"
              label="Playback rate"
              thumb-label
              max="1"
              min="0.1"
              step="0.05"
              @end="setPlayerSpeed"
            />
            <div v-html="`[T] ${subtrad}`"> </div>
            <div v-html="`[S] ${subsimp}`"> </div>
            <!-- <div> [T] {{ subtrad }} </div>
            <div> [S] {{ subsimp }} </div> -->
          </div>
        </v-col>
        <v-col class="mx-1">
          <v-card class="pb-2">
            <v-card-actions>
              <v-spacer />
              <v-btn
                v-if="!showSimp"
                small
                outlined
                class="ml-1 pink--text"
                @click="showSimp = true"
              >
                simplified
              </v-btn>
              <v-btn
                v-else
                small
                outlined
                class="ml-1 pink--text"
                @click="showSimp = false"
              >
                traditional
              </v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-autocomplete
                v-model="values"
                :items="items"
                item-text="search"
                label="search (traditional characters)"
                :allow-overflow="false"
                return-object
                multiple
                chips
                filled
                solo
                dense
                @change="getValue"
              />
            </v-card-actions>
            <!-- <v-divider class="mx-4 mb-4" /> -->
            <v-tabs
              v-model="tab"
              background-color="info"
              dark
            >
              <v-tabs-slider color="yellow"></v-tabs-slider>
              <v-tab
                v-for="item in tabItems"
                :key=item.note
              >
                <span v-if="showSimp" class="text-h6"> {{ item.searchsimp }} </span>
                <span v-else class="text-h6"> {{ item.search }} </span>
                <!-- <span v-if="!showSimp" class="text-h6"> {{ item.search }} </span> -->
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item
                v-for="item in tabItems"
                :key="item.search"
              >
                <div class="my-3 mx-2 text-body-2">
                  <v-icon class="pink--text"> mdi-circle-medium </v-icon>
                  {{ item.note }}
                </div>
                <v-divider />
                <v-simple-table dense class="mx-1">
                  <tbody v-for="(demoitem, i) in item.demo" :key="demoitem.sub">
                    <tr>
                      <td> {{ i + 1 }} </td>
                      <td v-if="showSimp" v-html="demoitem.htmlsimp" />
                      <td v-else v-html="demoitem.html" />
                      <!-- <td v-if="!showSimp" v-html="demoitem.html" /> -->
                      <td class="text-right">
                        <v-icon color="blue" @click="rewind5()">
                          mdi-rewind-5
                        </v-icon>
                        <v-icon color="green" @click="playSegment(demoitem)">
                          mdi-play-circle
                        </v-icon>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
    </v-flex>
  </v-layout>
</template>

<script>
import Vue from 'vue'
import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube)

export default {
  data () {
    return {
      playerVars: {
        autoplay: 0,
        controls: 1,
        fs: 1,
        iv_load_policy: 3, // not working
        loop: 1, // not working
        modestbranding: 0, // no effect
        rel: 0,
        showinfo: 0
      },
      videoId: '5nu3RjIXt_Y',
      slider: '1',
      docid: '',
      keyword: '1',
      note: '',
      keywordsimp: '',
      demoArray: [],
      subtrad: '',
      subsimp: '',
      showSimp: false,
      values: [],
      items: [],
      tab: null,
      tabItems: []
    }
  },
  mounted () {
    // this.docid = this.$route.query.id
    // console.log(this.$route.query.id)
    // console.log(this.$store.state.userObj)
    // if (this.$store.state.uid === '') {
    if (!this.$store.state.userObj) {
      this.$router.push('/account')
    } else {
      // console.log('user obj')
    //   this.docid = this.$route.query.id
      this.init()
    }
    // this.init()
  },
  methods: {
    getValue () {
      this.tabItems = []
      this.values.forEach((item) => {
        this.tabItems.push({ search: item.search, note: item.note, demo: item.demo })
      })
      // console.log(this.tabItems)
      this.convertSimp()
    },
    async convertSimp () {
      const OpenCC = require('opencc-js')
      const convert = await OpenCC.Converter('tw', 'cn')
      this.keywordsimp = convert(this.keyword)
      this.tabItems.forEach((item) => {
        let obj = {}
        obj = item
        obj.searchsimp = convert(item.search)
        obj.demo = item.demo
        obj.demo.forEach((set, i) => {
          let temp = convert(set.html)
          if (set.html.length !== temp.length) {
            temp = temp.split('\r').join('').split('\n').join('')
          }
          obj.demo[i] = { htmlsimp: temp, ...set }
        })
        item = obj
        // this.demoArray.push({ htmlsimp: convert(item.html), ...item })
      })
      // console.log(this.tabItems)
    },
    async init () {
      const email = this.$store.state.userObj.email
      const res = await this.$fire.firestore.collection('-video_demo').where('email', '==', email).get()
      res.forEach((set) => {
        // console.log(set.data())
        this.items.push({ sid: set.id, ...set.data() })
      })
    },
    setPlayerSpeed () {
      this.$refs.youtube.player.setPlaybackRate(this.slider)
    },
    playSegment (obj) {
      // console.log(obj)
      // this.convertChar(obj.sub)
      // this.subtrad = obj.sub
      // this.convertChar(obj.html)
      // this.subtrad = obj.html
      this.subtrad = obj.html
      this.subsimp = obj.htmlsimp
      if (obj.vid === this.videoId) { // same video
        this.$refs.youtube.player.seekTo(obj.start, true)
        this.$refs.youtube.player.playVideo()
      } else {
        this.videoId = obj.vid
        this.$refs.youtube.player.getPlayerState().then((state) => {
          this.$refs.youtube.player.loadVideoById(this.videoId, obj.start)
          // console.log('player state :', state)
        })
      }
    },
    rewind5 () {
      this.$refs.youtube.player.getCurrentTime().then((time) => {
        if (time > 5) {
          this.$refs.youtube.player.seekTo(time - 5, true)
          this.$refs.youtube.player.playVideo()
        } else {
          this.$refs.youtube.player.seekTo(0, true)
          this.$refs.youtube.player.playVideo()
        }
      })
    }
    // async convertChar (str) {
    //   const OpenCC = require('opencc-js')
    //   const convert = await OpenCC.Converter('tw', 'cn')
    //   this.subsimp = convert(str)
    //   // console.log(this.subsimp)
    //   if (str.length !== this.subsimp.length) {
    //     // this.subsimp = this.subsimp.replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    //     this.subsimp = this.subsimp.replace('\r', '')
    //     this.subsimp = this.subsimp.replace('\n', '')
    //     // console.log(JSON.stringify(this.subsimp))
    //   }
    // }
  }
}
</script>
