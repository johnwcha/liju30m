<template>
  <v-layout row justify-center align-center>
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
            <div> [T] <span v-html="subtrad"></span> </div>
            <div> [S] <span v-html="subsimp"></span> </div>
          </div>
        </v-col>
        <v-col class="mx-1">
          <v-card class="pb-2">
            <v-card-actions>
              <v-card-title v-if="!showSimp"> {{ keyword }} </v-card-title>
              <v-card-title v-if="showSimp"> {{ keywordsimp }} </v-card-title>
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
            <!-- <v-card-text> {{ note }} </v-card-text> -->
            <div v-if="note!=''" class="mx-2 text-body-2">
              <v-icon class="pink--text"> mdi-circle-medium </v-icon>
              {{ note }}
            </div>
            <v-divider class="mx-4 mb-4" />
            <v-simple-table dense class="mb-1">
              <tbody v-for="(item, i) in demoArray" :key="item.sub">
                <tr>
                  <td> {{ i + 1 }} </td>
                  <td v-if="showSimp" v-html="item.htmlsimp" />
                  <td v-if="!showSimp" v-html="item.html" />
                  <td class="text-right">
                    <v-icon color="blue" @click="rewind5()">
                      mdi-rewind-5
                    </v-icon>
                    <v-icon color="green" @click="playSegment(item)">
                      mdi-play-circle
                    </v-icon>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
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
  layout: 'nomenu',
  props: ['docid'],
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
      videoId: 'qKTAf5hSyzY',
      slider: '1',
      // docid: '',
      keyword: '',
      note: '',
      keywordsimp: '',
      demoArray: [],
      subtrad: '',
      subsimp: '',
      showSimp: false,
      unsubscribe: null
    }
  },
  mounted () {
    if (this.$fire.auth.currentUser === null) {
      // this.$router.push('/account')
      this.$fire.auth.signInAnonymously().then(() => {
        // this.docid = this.$route.query.id
        this.init()
      }).catch((error) => { console.error(error.message) })
    } else {
      // console.log('user obj')
      // this.docid = this.$route.query.id
      this.init()
    }
  },
  methods: {
    async convertSimp (arr) {
      const OpenCC = require('opencc-js')
      const convert = await OpenCC.Converter('tw', 'cn')
      this.keywordsimp = convert(this.keyword)
      arr.forEach((item) => {
        let temp = convert(item.html)
        if (item.html.length !== temp.length) {
          // console.log(item.html.length, temp.length)
          temp = temp.split('\r').join('').split('\n').join('')
          // console.warn(item.html, temp)
        }
        this.demoArray.push({ htmlsimp: temp, ...item })
      })
      // console.log(this.demoArray)
    },
    async init () {
      const res = await this.$fire.firestore.collection('-video_demo').doc(this.docid).get()
      this.keyword = res.data().search
      this.note = res.data().note
      this.convertSimp(res.data().demo)
      // console.log(res.data())
      // this.demoArray = res.data().demo
    },
    setPlayerSpeed () {
      this.$refs.youtube.player.setPlaybackRate(this.slider)
    },
    playSegment (obj) {
      console.log(obj)
      // this.convertChar(obj.sub)
      // this.subtrad = obj.sub
      this.subtrad = obj.html
      this.subsimp = obj.htmlsimp
      const starttime = obj.start2 ? obj.start2 : obj.start
      // console.log(starttime)
      if (obj.vid === this.videoId) { // same video
        this.$refs.youtube.player.seekTo(starttime, true)
        this.$refs.youtube.player.playVideo()
      } else {
        this.videoId = obj.vid
        // this.$refs.youtube.player.loadVideoById(this.videoId)
        // this.$refs.youtube.player.seekTo(obj.start, true)
        // this.$refs.youtube.player.playVideo()

        this.$refs.youtube.player.getPlayerState().then((state) => {
          this.$refs.youtube.player.loadVideoById(this.videoId, starttime)
          // this.$refs.youtube.player.playVideo()
          console.log('player state :', state)
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
  }
}
</script>
