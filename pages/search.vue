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
          <v-card outlined>
            <v-card-actions>
              <v-text-field v-model="keyword" append-outer-icon="mdi-send" label="Search" placeholder="Traditional characters ONLY" @click:append-outer="parse" />
            </v-card-actions>
          </v-card>
          <v-card v-if="demoArray.length > 0" outlined>
            <v-simple-table>
              <template v-for="item in videoCollection">
                <tbody v-for="entry in item.entry" :key="entry.start">
                  <tr v-if="entry.demo">
                    <td> <v-checkbox v-model="entry.demo" @change="addDemo()" /> </td>
                    <td v-html="entry.html" />
                    <td class="text-right">
                      <v-icon color="blue" @click="rewind5()">
                        mdi-rewind-5
                      </v-icon>
                      <v-icon color="orange" @click="playSegment(entry)">
                        mdi-play-circle
                      </v-icon>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-card-actions>
              <v-text-field v-if="demodocid!==''" v-model="demourl" class="mr-1" @click="openLink" />
              <v-btn
                outlined
                small
                class="pink--text"
                @click="saveDemo"
              >
                save
              </v-btn>
            </v-card-actions>
          </v-card>
          <p />
          <v-simple-table dense class="mb-1">
            <template v-for="item in videoCollection">
              <thead v-if="item.entry.length > 0" :key="item.title" class="mt-1">
                <tr>
                  <th class="text-left" />
                  <th class="text-left subtitle-1 blue--text">
                    {{ item.title }}
                  </th>
                  <th class="text-right" />
                </tr>
              </thead>
              <tbody v-for="entry in item.entry" :key="entry.start">
                <tr v-if="!entry.demo">
                  <td> <v-checkbox v-model="entry.demo" @change="addDemo" /> </td>
                  <td v-html="entry.html" />
                  <td class="text-right">
                    <v-icon color="blue" @click="rewind5()">
                      mdi-rewind-5
                    </v-icon>
                    <v-icon color="green" @click="playSegment(entry)">
                      mdi-play-circle
                    </v-icon>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-flex>
  </v-layout>
</template>

<script>
import Vue from 'vue'
import VueYoutube from 'vue-youtube'
import dayjs from 'dayjs'
// import util from '~/util/functions'
Vue.use(VueYoutube)

export default {
  data () {
    return {
      subtrad: '',
      subsimp: '',
      catItems: [],
      videoCollection: [],
      keyword: '',
      vid: '',
      vocab: '',
      videoId: 'qKTAf5hSyzY',
      repeatwords: [],
      skipwords: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '哦', '喲', '呢', '啊', '呀', '呐', '唉', '哎', '了', '我', '', '，', '。', '！', '？', '《', '》', ',', '.', '?', ' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
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
      slider: '1',
      demoArray: [],
      demourl: '',
      demodocid: '',
      baseURL: 'https://liju30m.web.app/demo/?id='
    }
  },
  mounted () {
    // console.log(this.$fire.analytics)
    if (this.$store.state.uid === '') {
      this.$router.push('/')
    }
  },
  methods: {
    openLink () {
      window.open(this.baseURL + this.demodocid, '_blank')
    },
    async doUpdate () {
      const res = await this.$fire.firestore.collection('-video_demo').doc(this.demodocid).set({ search: this.keyword.trim(), demo: this.demoArray })
      console.warn(res)
    },
    async doAdd () {
      const res = await this.$fire.firestore.collection('-video_demo').add({ search: this.keyword.trim(), demo: this.demoArray })
      this.demodocid = res.id
      this.demourl = this.baseURL + res.id
    },
    saveDemo () {
      if (this.demodocid === '') {
        this.doAdd()
      } else {
        this.doUpdate()
      }
    },
    addDemo () {
      this.demoArray = []
      this.videoCollection.forEach((item) => {
        item.entry.forEach((entry) => {
          if (entry.demo) { this.demoArray.push(entry) }
        })
      })
      console.log(this.demoArray)
    },
    setPlayerSpeed () {
      this.$refs.youtube.player.setPlaybackRate(this.slider)
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
    parse () {
      if (this.keyword.trim() === '') { return }
      this.doSearch(this.keyword.trim())
    },
    gsearch (keyword, res) {
      let g1 = ''
      let g2 = ''
      if (keyword.includes('x')) {
        const tmp = keyword.split(' ').join('').split('x')
        g1 = tmp[0]
        g2 = tmp[1]
      }
      if (keyword.includes('X')) {
        const tmp = keyword.split(' ').join('').split('X')
        g1 = tmp[0]
        g2 = tmp[1]
      }
      if (g2 === '') {
        this.vsearch(g1, res)
      } else {
        res.forEach((item) => {
          this.$fire.firestore.collection('-video_meta').doc(item.id).get().then((meta) => {
            this.catItems = []
            for (const prop in item.data()) {
              const sub = item.data()[prop]
              if (sub.sub.includes(g2)) {
                const p1 = String(sub.sub).indexOf(g1)
                const p2 = String(sub.sub).lastIndexOf(g2)
                if (p1 < p2) {
                  let tag = sub.sub.split(g1).join(`<span class="pink--text">${g1}</span>`)
                  tag = tag.split(g2).join(`<span class="pink--text">${g2}</span>`)
                  this.catItems.push({ demo: false, html: tag, vid: item.id, start: sub.start, sub: sub.sub })
                  // this.videoCollection.push({ html: tag, vid: item.id, start: sub.start, sub: sub.sub })
                }
              }
            }
            this.videoCollection.push({ title: meta.data().title, entry: this.catItems })
          }).catch((err) => { console.log(err.message) })
        })
      }
      if (this.videoCollection.length === 0) {
        console.warn('no data by the pattern')
      }
    },
    vsearch (keyword, res) {
      res.forEach((item) => {
        // console.warn(item.id, item.data())
        this.$fire.firestore.collection('-video_meta').doc(item.id).get().then((meta) => {
          // console.log(meta.data())
          this.catItems = []
          for (const prop in item.data()) {
            const sub = item.data()[prop]
            // console.log(sub.sub)
            if (sub.sub.includes(keyword)) {
              const tag = sub.sub.split(keyword).join(`<span class="pink--text">${keyword}</span>`)
              this.catItems.push({ demo: false, html: tag, vid: item.id, start: sub.start, sub: sub.sub })
            }
            // console.log(this.catItems)
          }
          this.videoCollection.push({ title: meta.data().title, entry: this.catItems })
          if (this.videoCollection.length === 0) {
            console.warn('no data by the key phrase')
          }
        })
      })
    },
    async doSearch (keyword) {
      const firstChar = keyword.split('')[0]
      this.videoCollection = []
      this.demoArray = []
      this.demourl = ''
      const res = await this.$fire.firestore.collection(firstChar).get()
      // console.log(dayjs().format('MM-DD-YYYY'))
      if (res.size > 0) {
        if (keyword.includes('x') || keyword.includes('X')) {
          this.gsearch(keyword, res)
          this.logSearchByDate(keyword)
          this.logSearchPattern(keyword)
          this.logEvent_u('pattern_search', keyword)
          this.logEvent_v('pattern_event', keyword)
        } else {
          this.vsearch(keyword, res)
          this.logSearchByDate(keyword)
          this.logSearchKeyword(keyword)
          this.logEvent_u('keyword_search', keyword)
          this.logEvent_v('key_event', keyword)
        }
      } else {
        console.warn('no data by the keyword')
      }
    },
    async logEvent_u (evt, str) {
      try {
        if (evt === 'keyword_search') {
          await this.$fire.analytics.logEvent(evt, { search_term: str })
          // console.log('User ' + `${evt}` + ' logged to Google Analytics')
        } else {
          await this.$fire.analytics.logEvent(evt, { pattern_str: str })
          // console.log('User ' + `${evt}` + ' logged to Google Analytics')
        }
      } catch (e) {
        alert(e)
      }
    },
    async logEvent_v (evt, str) {
      try {
        if (evt === 'keyword_event') {
          await this.$fire.analytics.logEvent(evt, { k_evt: str })
          // console.log('Event ' + `${evt}` + ' logged to Google Analytics')
        } else {
          await this.$fire.analytics.logEvent(evt, { p_evt: str })
          // console.log('Event ' + `${evt}` + ' logged to Google Analytics')
        }
      } catch (e) {
        alert(e)
      }
    },
    async logSearchByDate (keyword) {
      const sdate = dayjs().format('MM-DD-YYYY')
      const stime = dayjs().format('HH:mm:ss.SSS')
      const obj = { [`${stime}`]: { uid: this.$store.state.uid, search: keyword } }
      const res = await this.$fire.firestore.collection('-video_search_by_date').doc(sdate).set(obj, { merge: true })
      console.log(res)
    },
    async logSearchPattern (keyword) {
      const sdate = dayjs().format('MM-DD-YYYY')
      const stime = dayjs().format('HH:mm:ss.SSS')
      const uid = this.$store.state.uid
      const obj = { [`${uid}`]: { date: sdate, time: stime, search: keyword } }
      const key = keyword.split('')[0]
      const res = await this.$fire.firestore.collection('-video_search_pattern').doc(key).set(obj, { merge: true })
      console.log(res)
    },
    async logSearchKeyword (keyword) {
      const sdate = dayjs().format('MM-DD-YYYY')
      const stime = dayjs().format('HH:mm:ss.SSS')
      const uid = this.$store.state.uid
      const obj = { [`${uid}`]: { date: sdate, time: stime, search: keyword } }
      const key = keyword.split('')[0]
      const res = await this.$fire.firestore.collection('-video_search_keyword').doc(key).set(obj, { merge: true })
      console.log(res)
    }
  }
}
</script>

<style scoped>
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td,
.v-data-table > .v-data-table__wrapper > table > tbody > tr > th,
.v-data-table > .v-data-table__wrapper > table > thead > tr > td,
.v-data-table > .v-data-table__wrapper > table > thead > tr > th,
.v-data-table > .v-data-table__wrapper > table > tfoot > tr > td,
.v-data-table > .v-data-table__wrapper > table > tfoot > tr > th {
  padding: 0 4px;
  transition: height 0.2s cubic-bezier(0.4, 0, 0.6, 1);
}
</style>
