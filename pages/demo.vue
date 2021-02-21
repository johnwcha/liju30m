<template>
  <v-layout row justify-center align-center>
    <v-flex>
      <v-row>
        <v-col cols="7" class="ml-5">
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
            <p> [T] {{ subtrad }} </p>
            <p> [S] {{ subsimp }} </p>
          </div>
        </v-col>
        <v-col class="mr-5">
          <v-card>
            <v-card-actions>
              <v-card-title v-if="!showSimp"> {{ keyword }} </v-card-title>
              <v-card-title v-if="showSimp"> {{ keywordsimp }} </v-card-title>
              <v-spacer />
              <v-btn
                small
                outlined
                class="pink--text"
                @click="showSimp = true"
              >
                simplified
              </v-btn>
            </v-card-actions>
            <v-simple-table dense class="mb-1">
              <tbody v-for="item in demoArray" :key="item.sub">
              <tr>
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
      docid: '',
      keyword: '',
      keywordsimp: '',
      demoArray: [],
      subtrad: '',
      subsimp: '',
      showSimp: false
    }
  },
  mounted () {
    this.docid = this.$route.query.id
    // console.log(this.$route.query.id)
    this.init()
  },
  methods: {
    async convertSimp (arr) {
      const OpenCC = require('opencc-js')
      const convert = await OpenCC.Converter('tw', 'cn')
      this.keywordsimp = convert(this.keyword)
      arr.forEach((item) => {
        this.demoArray.push({ htmlsimp: convert(item.html), ...item })
      })
    },
    async init () {
      const res = await this.$fire.firestore.collection('-video_demo').doc(this.docid).get()
      this.keyword = res.data().search
      this.convertSimp(res.data().demo)
    //   res.data().demo.forEach((item) => {
    //     const simp = this.convertSimp(item.html)
    //     this.demoArray.push({ htmlsimp: simp, ...item })
    //   })
      // this.demoArray = res.data().demo
    },
    setPlayerSpeed () {
      this.$refs.youtube.player.setPlaybackRate(this.slider)
    },
    playSegment (obj) {
      // console.log(obj)
      this.convertChar(obj.sub)
      this.subtrad = obj.sub
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
    },
    async convertChar (str) {
      const OpenCC = require('opencc-js')
      const convert = await OpenCC.Converter('tw', 'cn')
      this.subsimp = convert(str)
      // console.log(this.subsimp)
      if (str.length !== this.subsimp.length) {
        // this.subsimp = this.subsimp.replace(/[\x00-\x1F\x7F-\x9F]/g, '')
        this.subsimp = this.subsimp.replace('\r', '')
        // console.log(JSON.stringify(this.subsimp))
      }
    }
  }
}
</script>
