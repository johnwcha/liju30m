<template>
  <v-layout row justify-center align-center>
    <v-flex>
      <v-row>
        <v-col cols="12" sm="7" class="mx-1 iframe_wrap">
          <div class="iframe_div">
            <youtube
              ref="youtube"
              :video-id="videoId"
              :player-vars="playerVars"
              :resize="true"
              :fit-parent="true"
              @cued="ready"
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
            <p> </p>
            <div v-if="catCount > 0"> <v-icon class="blue--text"> mdi-magnify </v-icon>
              found <span class="pink--text"> {{ resultCount }} </span> entries
              in <span class="pink--text"> {{ catCount }} </span> videos
            </div>
            <!-- <div>
              <v-btn small class="ml-1 success" @click="showMore"> show more </v-btn>
              <v-text-field @change="reorder" v-model="fromto" />
            </div> -->
            <div> <a :href="demourl" target="_blank"> {{ demourl }} </a> </div>
          </div>
        </v-col>
        <v-col class="mx-1 vidlist">
          <v-card outlined>
            <v-card-actions v-if="searchbycode">
            <!-- ============= 一鍵搜尋 -->
            <v-autocomplete
              v-model="selCode"
              :items="gtagCollection"
              filled
              chips
              color="deep-purple"
              label="一鍵搜尋"
              item-text="eng"
              item-value="code"
              @change="codeSearch"
            >
              <template v-slot:selection="data">
                <v-chip
                  :input-value="data.selected"
                  outlined
                  color="deep-purple"
                  class="chip--select-multi"
                >
                  {{ data.item.ci }} -- {{ data.item.eng }}
                </v-chip>
              </template>
              <template v-slot:item="data">
                <template v-if="typeof data.item !== 'object'">
                  <v-list-item>
                  <v-list-item-icon>
                    <v-icon> mdi-star </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content v-text="data.item"></v-list-item-content>
                  </v-list-item>
                </template>
                <template v-else>
                  <v-list-item-content>
                    <v-list-item-title v-html="data.item.chn"></v-list-item-title>
                    <v-list-item-subtitle v-html="data.item.eng"></v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </template>
            </v-autocomplete>
            <v-spacer />
            <v-btn color="deep-purple" small outlined @click="searchbycode = false"> back </v-btn>
            </v-card-actions>
            <!-- ============= 一般 搜尋 -->
            <v-card-actions v-else>
              <v-text-field
                v-model="keyword"
                label="Keyword & pattern search"
                placeholder="Traditional characters ONLY"
                @keyup="keypress"/>
                <!-- append-outer-icon="mdi-send" @click:append-outer="parse" -->
                <v-spacer />
              <v-btn color="deep-purple" outlined @click="searchbycode = true"> 一鍵搜尋 </v-btn>
            </v-card-actions>
          </v-card>
          <BaseMaterialAlert
            v-model="noResult"
            color="pink"
            dark
            dismissible
          >
            {{ sorry }}
          </BaseMaterialAlert>
          <!-- ============= Save Results -->
          <v-card v-if="demoArrayClone.length > 0" class="mt-1" outlined>
            <v-simple-table class="mt-3">
              <tbody v-for="(entry, i) in demoArrayClone" :key="entry.html">
                <tr v-if="entry.demo">
                  <td> {{ i+1 }} </td>
                  <td>
                    <Editable :value=entry.html @clear="remove(i, $event)" @keyup="insertStartSymbol(i, $event)" />
                    <div v-if="entry.menu">
                      {{ dayjs.duration(entry.start2*1000).format('H:mm:ss') }}
                      <v-icon color="pink" @click="getCurrentTime(entry)"> mdi-clock-start </v-icon>
                      <v-icon color="cyan" @click="removeTag(entry)"> mdi-delete-clock </v-icon>
                    </div>
                  </td>
                  <td class="text-right">
                    <!-- <v-icon color="blue" @click="rewind5">
                      mdi-rewind-5
                      mdi-trash-can-outline
                    </v-icon> -->
                    <v-icon color="orange" @click="playSegment(entry)">
                      mdi-play-circle
                    </v-icon>
                    <v-icon color="cyan" @click="entry.menu = !entry.menu">
                      mdi-dots-vertical-circle-outline
                    </v-icon>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>

            <v-simple-table class="mb-1">
              <tbody>
                <tr>
                  <td> <v-checkbox v-model="clearList" label="clear list on new search" /> </td>
                </tr>
                <tr>
                  <td>
                    <v-text-field v-model="demonote" label="add a note (required)" class="mr-1" />
                    <v-text-field v-model="pptscript" label="script for G Slides" class="mr-1" />
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
            <v-card-actions>
              <v-btn
                outlined
                small
                class="blue--text"
                @click="saveScript"
              >
                PPT
              </v-btn>
              <v-spacer />
              <v-btn
                outlined
                small
                class="pink--text"
                :disabled="demonote == ''"
                @click="saveDemo"
              >
                save
              </v-btn>
            </v-card-actions>
          </v-card>
          <p />
          <!-- ============= Authoring Results -->
          <v-card v-if="authorCollection.length > 0" class="mt-1" outlined color="yellow lighten-5">
            Separate sentences with •
            <v-simple-table class="mt-3">
              <tbody v-for="(entry, i) in authorCollection" :key="i">
                <tr>
                  <td> {{ i+1 }}
                    <v-icon color="orange" @click="removeQue(entry, i)">
                      mdi-close
                    </v-icon>
                  </td>
                  <td> <v-textarea v-model="entry.sub" @change="setHighlight(entry, i)" />
                    <span v-if="entry.cuepoint"> {{ entry.cuepoint.length }} </span>
                  </td>
                  <td class="text-right" width="50">
                    <v-icon color="green" @click="playSegment(entry)">
                      mdi-play-circle
                    </v-icon>
                    <v-icon color="info" @click="setCuePoint(entry, i)">
                      mdi-clock-outline
                    </v-icon>
                    <v-icon color="pink" @click="delCuePoint(entry, i)">
                      mdi-close-circle-outline
                    </v-icon>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
            <v-card-actions>
              <v-text-field label="Doc id: ic_01_01" v-model="icdocid"/>
              <v-btn color="light-blue" outlined small @click="saveQue">
                save
              </v-btn>
              <v-btn color="light-pink" outlined small @click="editQue" :disabled="icdocid == ''">
                edit
              </v-btn>
            </v-card-actions>
          </v-card>
          <p />
          <!-- ============= Search Results -->
          <v-simple-table dense class="mb-1">
            <template v-for="(item, i) in videoCollection">
              <thead v-if="item.entry.length > 0" :key="item.title" class="mt-1">
                <tr>
                  <th class="text-left"> ({{ i+1 }}) <v-icon class="pink--text"> mdi-youtube </v-icon> </th>
                  <th class="text-left subtitle-1 blue--text">
                    {{ item.title }} <span class="pink--text"> {{ `(${String(item.cc).charAt(0).toUpperCase()})` }} </span>
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody v-for="(entry) in item.entry" :key="entry.id">
                <!-- <tr v-if="!entry.demo"> -->
                <tr>
                  <td> <v-checkbox v-model="entry.demo" @change="addDemo(entry)" /> </td>
                  <td v-html="entry.html" @mouseup="markup(entry, $event)" />
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
import { grammarcode } from '../util/gtag'

Vue.use(VueYoutube)

export default {
  // components: {
  //   MaterialAlert
  // },
  data () {
    return {
      icdocid: '',
      selCode: '',
      gtagCollection: {},
      searchbycode: false,
      fromto: '',
      clearList: false,
      subtrad: '',
      subsimp: '',
      catItems: [],
      videoCollection: [],
      videoCollection10: [],
      keyword: '',
      vid: '',
      vocab: '',
      videoId: '5nu3RjIXt_Y',
      startTime: 0,
      repeatwords: [],
      skipwords: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '哦', '喲', '呢', '啊', '呀', '呐', '唉', '哎', '了', '', '，', '。', '！', '？', '《', '》', ',', '.', '?', ' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
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
      demoArrayClone: [],
      demourl: '',
      demodocid: '',
      demonote: '',
      demoauthor: '',
      baseURL: 'https://liju30m.web.app/demo/?id=',
      videoFound: 0,
      resultCount: 0,
      catCount: 0,
      noResult: false,
      sorry: 'Sorry, no data found by this phrase',
      N_A: [],
      duration: require('dayjs/plugin/duration'),
      pptscript: '',
      authorCollection: []
    }
  },
  computed: {
    dayjs () {
      return dayjs.extend(this.duration)
    },
    yt () {
      return this.$refs.youtube.player
    }
  },
  mounted () {
    this.gtagCollection = grammarcode
    // console.log(this.$fire.analytics)
    // console.log(this.$fire.auth.currentUser)
    // console.log(this.$route.query.id)
    if (this.$fire.auth.currentUser === null) {
      // this.$router.push('/signin')
      this.$fire.auth.signInAnonymously().then(() => {
        // console.log(this.$fire.auth.currentUser)
        // getting Not Available video list
        this.getBlacklist()
      }).catch((error) => { console.error(error.message) })
    } else {
      this.getBlacklist()
      if (this.$route.query.id) {
        this.getSaved(this.$route.query.id)
      }
    }
  },
  methods: {
    delCuePoint (entry, i) {
      entry.cuepoint = []
      console.log(entry)
    },
    setCuePoint (entry, i) {
      this.$refs.youtube.player.getCurrentTime().then((time) => {
        if (entry.cuepoint) {
          entry.cuepoint.push(time - 0.8)
        } else {
          entry.cuepoint = []
          entry.cuepoint.push(time - 0.8)
        }
      })
      console.log(entry)
    },
    async setHighlight (entry, i) {
      const OpenCC = require('opencc-js')
      const convert = await OpenCC.Converter('tw', 'cn')
      entry.subarr = entry.sub.split('•')
      entry.subsimparr = []
      entry.subarr.forEach((item) => {
        entry.subsimparr.push(convert(item).split('\r').join(''))
      })
      console.log(entry)
    },
    editQue () {
      this.$fire.firestore.collection('-video_practice').doc(this.icdocid).get().then((res) => {
        console.log(res.data().que)
        this.authorCollection = res.data().que
      })
    },
    saveQue () {
      console.log(this.authorCollection)
      const tmp = JSON.parse(JSON.stringify(this.authorCollection))
      tmp.forEach((item) => {
        console.log(item.sub)
        item.sub = item.sub.split('•').join('')
      })
      const obj = { que: tmp }
      this.$fire.firestore.collection('-video_practice').doc(this.icdocid).set(obj).then((res) => {
        console.log('success')
      })
    },
    removeQue (entry, i) {
      // console.log(i)
      this.authorCollection.splice(i, 1)
      this.authorCollection = JSON.parse(JSON.stringify(this.authorCollection))
      // console.log(this.authorCollection)
    },
    async markup (item, event) {
      if (window.getSelection().isCollapsed) { return }
      console.log(this.$store.state.userData)

      const OpenCC = require('opencc-js')
      const convert = await OpenCC.Converter('tw', 'cn')
      let subsimpx = convert(item.sub)
      subsimpx = subsimpx.split('\r').join('')
      const anst = window.getSelection().getRangeAt(0).toString()
      let anssimpx = convert(anst)
      if (anst.length !== anssimpx.length) {
        anssimpx = anssimpx.split('\r').join('')
      }
      this.authorCollection.push({ sub: item.sub.split(anst).join('___'), subsimp: subsimpx.split(anssimpx).join('___'), ans: anst, anssimp: anssimpx, start: item.start, vid: item.vid })
      // // const range = window.getSelection().getRangeAt(0)
      // // console.log(range)
      // const text = window.getSelection().isCollapsed // true, no text selected
      // console.log(this.authorCollection)
      // console.log(anst.length === anssimpx.length)
    },
    saveScript () {
      // console.log(this.demoArrayClone)
      // documentation: https://developers.google.com/apps-script/reference/slides/slide
      const gc = []
      // console.log(this.dayjs.duration(100))
      this.demoArrayClone.forEach((item) => {
        console.log(item)
        gc.push({ trad: item.sub, simp: item.subsimp, id: item.vid, start: this.dayjs.duration(item.start * 1000).format('H:mm:ss') })
        // gc.push({ id: item.vid, start: item.start })
      })
      const gc1 = JSON.stringify(gc)
      const gc2 = 'const simp = true; const urls = ' + gc1 + '; function Snippets() {}; const presentation = SlidesApp.getActivePresentation(); urls.forEach(item => { const slide = presentation.appendSlide(); const video = slide.insertVideo("https://www.youtube.com/watch?v=" + item.id, 10, 10, 520, 340); const shape = slide.insertTextBox(item.start, 600, 10, 80, 30); const char = simp ? item.simp : item.trad; const textBox = slide.insertTextBox(char, 10, 350, 500, 30); })'
      this.pptscript = gc2
    },
    codeSearch () {
      // console.log(this.selCode)
      if (!this.selCode) { return }
      this.videoCollection = []
      this.catItems = []
      this.resultCount = 0
      this.catCount = 0
      this.$fire.firestore.collection(this.selCode).get().then((res) => {
        // console.log(res.docs)
        res.docs.forEach((item) => {
          this.$fire.firestore.collection('-video_meta').doc(item.id).get().then((meta) => {
            this.catItems = []
            // console.log(meta.id)
            // console.log(item.id)
            // console.log(item.data())
            for (const key in item.data()) {
              this.resultCount += 1
              const tmp = item.data()[key]
              this.catItems.push({ demo: false, html: tmp.html.split('display-1').join('subtitle-1'), vid: item.id, start: tmp.start, sub: tmp.sub })
            }
            this.catCount += 1
            this.videoCollection.push({ cc: meta.data().cc, title: meta.data().title, entry: this.catItems })
          })
        })
      })
      // console.log(this.videoCollection)
    },
    keypress (evt) {
      // console.log(evt, evt.keyCode)
      if (evt.keyCode === 13) {
        this.parse()
      }
    },
    ready () {
      console.log('youtube player ready')
      this.$refs.youtube.player.seekTo(this.startTime, true)
      this.$refs.youtube.player.playVideo()
    },
    reorder () {
      const tmp = this.fromto.split(' ')
      const from = tmp[0]
      const to = tmp[1]
      // Delete the item from it's current position
      const item = this.demoArrayClone.splice(from, 1)
      // Move the item to its new position
      this.demoArrayClone.splice(to, 0, item[0])
    },
    async getSaved (demoid) {
      const res = await this.$fire.firestore.collection('-video_demo').doc(demoid).get()
      // console.log(res)
      // console.log(res.data())
      this.demodocid = res.id
      this.demoArrayClone = res.data().demo
      this.demonote = res.data().note
      this.demourl = this.baseURL + res.id
      this.keyword = res.data().search
    },
    removeTag (entry) {
      // console.log(entry)
      entry.start2 = entry.start
    },
    insertStartSymbol (i, evt) {
      // console.warn(entry.html)
      // console.warn(evt)
      this.demoArrayClone[i].html = String(evt)
    },
    getCurrentTime (entry) {
      // console.log(entry) // ➜
      this.yt.getCurrentTime().then((time) => {
        if (time < 1) {
          entry.start2 = time
        } else {
          entry.start2 = time - 0.8
        }
      })
    },
    getBlacklist () {
      this.$fire.firestore.collection('-video_meta').where('access', '==', 0).get().then((res) => {
        // console.log(res)
        if (!res.empty) {
          res.docs.forEach((doc) => {
            // console.log(doc.id, doc.data())
            this.N_A.push(doc.id)
          })
        }
      }).catch((error) => { console.error(error.message) })
    },
    openLink () {
      window.open(this.baseURL + this.demodocid, '_blank')
    },
    async doUpdate () {
      const utime = dayjs().format('MM-DD-YYYY h:mm A')
      let searchTrim = ''
      if (this.keyword.trim().includes('x')) {
        searchTrim = this.keyword.trim().split('').join('').split('x').join(' x ')
      } else if (this.keyword.trim().includes('X')) {
        searchTrim = this.keyword.trim().split('').join('').split('X').join(' X ')
      } else {
        searchTrim = this.keyword.trim()
      }
      const temp = { email: this.$fire.auth.currentUser.email, contributor: this.demoauthor, note: this.demonote, time: utime, search: searchTrim, demo: this.demoArrayClone }
      const res = await this.$fire.firestore.collection('-video_demo').doc(this.demodocid).set(temp)
      console.warn('do update', res)
    },
    async doAdd () {
      const utime = dayjs().format('MM-DD-YYYY h:mm A')
      let searchTrim = ''
      if (this.keyword.trim().includes('x')) {
        searchTrim = this.keyword.trim().split('').join('').split('x').join(' x ')
      } else if (this.keyword.trim().includes('X')) {
        searchTrim = this.keyword.trim().split('').join('').split('X').join(' X ')
      } else {
        searchTrim = this.keyword.trim()
      }
      const temp = { email: this.$fire.auth.currentUser.email, note: this.demonote, time: utime, search: searchTrim, demo: this.demoArrayClone }
      // console.log(temp)
      const res = await this.$fire.firestore.collection('-video_demo').add(temp)
      this.demodocid = res.id
      this.demourl = this.baseURL + res.id
    },
    saveDemo () {
      if (this.demodocid === '') {
        this.doAdd()
        this.addSetCount()
      } else {
        this.doUpdate()
      }
    },
    addDemo (demoentry) {
      // console.log(demoentry)
      if (this.$store.state.userObj && this.$store.state.userObj.email) {
        if (demoentry.demo) { // add
          // console.log(demoentry)
          const OpenCC = require('opencc-js')
          OpenCC.Converter('tw', 'cn').then((convert) => {
            console.log(convert(demoentry.sub))
            let simp = convert(demoentry.sub).replace('\r', '')
            simp = convert(demoentry.sub).replace('\n', '')
            const tmp = { subsimp: simp, start2: demoentry.start, menu: false, ...demoentry }
            this.demoArrayClone = this.demoArrayClone.concat(JSON.parse(JSON.stringify(tmp)))
            console.log(this.demoArrayClone)
          })
          // console.log(this.demoArrayClone)
        } else { // remove
          const found = this.demoArrayClone.findIndex((ele) => { return ele.start === demoentry.start })
          // console.log(found)
          if (found >= 0) {
            this.demoArrayClone.splice(found, 1)
          }
        }
      } else {
        // console.log('You have to sign in to save the list.')
        this.noResult = true
        this.sorry = 'You have to sign in to save the list.'
      }
    },
    setPlayerSpeed () {
      this.$refs.youtube.player.setPlaybackRate(this.slider)
    },
    async convertChar (str) {
      const OpenCC = require('opencc-js')
      const convert = await OpenCC.Converter('tw', 'cn')
      this.subsimp = convert(str)
      // console.log(this.subsimp)
      // this.subsimp = this.subsimp.replace(/[\x00-\x1F\x7F-\x9F]/g, '')
      this.subsimp = this.subsimp.replace('\r', '')
      this.subsimp = this.subsimp.replace('\n', '')
      // console.log(JSON.stringify(this.subsimp))
    },
    playSegment (obj) {
      console.log(obj)
      // this.convertChar(obj.sub)
      // this.convertChar(obj.html)
      this.subtrad = obj.html
      let starttime = 0
      if (obj.start2) {
        starttime = (obj.start === obj.start2) ? obj.start : obj.start2
      } else {
        starttime = obj.start
      }
      // console.log(starttime)
      if (obj.vid === this.videoId) { // same video
        this.$refs.youtube.player.seekTo(starttime, true)
        this.$refs.youtube.player.playVideo()
      } else {
        this.videoId = obj.vid
        this.startTime = starttime
        this.$refs.youtube.player.loadVideoById({ videoId: this.videoId, startSeconds: starttime })
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
      let spacex = 0
      let pattern = ''
      // let regex = '.{1,'
      if (keyword.includes('x')) {
        const tmp = keyword.split(' ').join('').split('x')
        g1 = tmp[0]
        g2 = tmp[1]
      } else if (keyword.includes('X')) {
        const tmp = keyword.split(' ').join('').split('X')
        g1 = tmp[0]
        g2 = tmp[1]
      }
      if (g2 === '') {
        this.vsearch(g1, res)
      } else {
        const g2Arr = g2.split('')
        const g2x = g2Arr[0]

        if (parseInt(g2x) > 0) {
          spacex = parseInt(g2x)
          g2Arr.shift() // remove first element
          g2 = g2Arr.join('')
          pattern = g1 + '.{' + spacex + '}' + g2
        } else {
          spacex = 0
          pattern = g1 + '.{1,}' + g2
        }
        // console.log(g1, g2, parseInt(g2x))
        const excludePunc = '[，。！；：、,.]'
        res.forEach((item) => {
          // console.log(item) // video id
          this.$fire.firestore.collection('-video_meta').doc(item.id).get().then((meta) => {
            // console.log(meta)
            this.catItems = []
            for (const prop in item.data()) {
              const sub = item.data()[prop]
              // console.log(sub.sub)
              // ***************************************
              // const pattern = g1 + '.{' + (spacex - 1) + '}' + g2
              // console.log('******************', pattern)
              let found = sub.sub.match(new RegExp(pattern, 'gi'))
              found = [...new Set(found)] // remove duplicates
              if (found) {
                // console.log(found)
                found.forEach((str) => {
                  let tag = ''
                  if (spacex > 0) { // 一 x1 都 // 一個都
                    if (!str.match(new RegExp(excludePunc, 'gi'))) {
                      tag = sub.sub.split(str).join(`<span class="pink--text">${str}</span>`)
                      this.resultCount += 1
                      this.catItems.push({ demo: false, html: tag, vid: item.id, start: sub.start, sub: sub.sub })
                    }
                  } else {
                    tag = sub.sub.split(str).join(`<span class="pink--text">${str}</span>`)
                    this.resultCount += 1
                    this.catItems.push({ demo: false, html: tag, vid: item.id, start: sub.start, sub: sub.sub })
                  }
                })
              }
            }
            // sort by start time
            this.catItems.sort((a, b) => a.start - b.start)
            if (this.catItems.length > 0) {
              this.catCount += 1
              this.videoCollection.push({ cc: meta.data().cc, title: meta.data().title, entry: this.catItems })
            } else {
              // console.warn('(-1) no data by the key phrase')
              this.videoFound = this.videoFound - 1
              if (this.videoFound === 0) {
                // console.warn('Sorry, no data found by this phrase')
                // show alert
                this.noResult = true
                this.sorry = 'Sorry, no data found by this phrase or pattern'
                // record in db
                this.logNoFound(keyword)
              }
            }
          }).catch((err) => { console.log(err.message) })
        })
      }
      // if (this.videoCollection.length === 0) {
      //   console.warn('no data by the pattern')
      // }
    },
    vsearch (keyword, res) {
      res.forEach((item) => {
        // console.warn(item.id)
        // console.warn(item.id, item.data())
        this.$fire.firestore.collection('-video_meta').doc(item.id).get().then((meta) => {
          // console.log(meta.data())
          this.catItems = []
          // console.log(Object.entries(item.data()))
          for (const prop in item.data()) {
            const sub = item.data()[prop]
            // console.log(sub)
            // console.log(sub.sub)
            if (sub.sub.includes(keyword)) {
              const tag = sub.sub.split(keyword).join(`<span class="pink--text">${keyword}</span>`)
              this.resultCount += 1
              this.catItems.push({ demo: false, html: tag, vid: item.id, start: sub.start, sub: sub.sub })
            }
          }
          // console.log(this.catItems)
          this.catItems.sort((a, b) => a.start - b.start)
          if (this.catItems.length > 0) {
            this.catCount += 1
            this.videoCollection.push({ cc: meta.data().cc, title: meta.data().title, entry: this.catItems })
            if (this.catCount === 10) {
              this.videoCollection10 = this.videoCollection.slice(0, 10)
            }
          } else {
            // console.warn('(-1) no data by the key phrase')
            this.videoFound = this.videoFound - 1
            if (this.videoFound === 0) {
              // console.warn('Sorry, no data found by this phrase')
              // show alert
              this.noResult = true
              this.sorry = 'Sorry, no data found by this phrase'
              // record in db
              this.logNoFound(keyword)
            }
          }
        })
      })
    },
    showMore () {
      this.videoCollection10 = this.videoCollection.slice(0, 124)
    },
    async doSearch (keyword) {
      const firstChar = keyword.split('')[0]
      this.videoCollection = []
      this.videoCollection10 = []
      this.demoArray = []
      if (this.clearList) {
        this.demoArrayClone = []
      }
      // this.demourl = ''
      // this.demodocid = ''
      // this.demonote = ''
      this.videoFound = 0
      this.resultCount = 0
      this.catCount = 0
      this.noResult = false
      this.addSearchCount()
      const resOrig = await this.$fire.firestore.collection(firstChar).get()
      // const res = await this.$fire.firestore.collection(firstChar).get()
      // console.log(firstChar, res)
      // console.log(firstChar, resOrig)
      // let res = []
      const res = resOrig.docs.filter((doc) => { return !this.N_A.includes(doc.id) })
      // console.log(res)
      // this.videoFound = res.size
      this.videoFound = res.length
      // console.log(res.length)
      if (res.length > 0) {
        if (keyword.includes('x') || keyword.includes('X')) {
          // console.log('grammar search ...')
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
        // console.warn('no data by the keyword')
        this.noResult = true
        this.sorry = 'Sorry, no data found by this phrase'
      }
    },
    async addSearchCount () {
      const res = await this.$fire.firestore.collection('-video_stats').doc('stats_doc')
        .update({
          total_search: this.$fireModule.firestore.FieldValue.increment(1)
        })
      console.warn(res, 'search count + 1')
    },
    async addSetCount () {
      const res = await this.$fire.firestore.collection('-video_stats').doc('stats_doc')
        .update({
          total_set: this.$fireModule.firestore.FieldValue.increment(1)
        })
      console.warn(res, 'sentence set count + 1')
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
      // console.log(dayjs())
      const sdate = dayjs().format('MM-DD-YYYY')
      const stime = dayjs().format('HH:mm:ss.SSS')
      // console.log(stime)
      const uemail = this.$store.state.userObj === null ? 'anonymous' : this.$store.state.userObj.email
      const obj = { [`${stime}`]: { email: uemail, search: keyword } }
      const res = await this.$fire.firestore.collection('-video_search_by_date').doc(sdate).set(obj, { merge: true })
      console.log(res)
    },
    async logSearchPattern (keyword) {
      const sdate = dayjs().format('MM-DD-YYYY')
      const stime = dayjs().format('HH:mm:ss.SSS')
      const uid = this.$fire.auth.currentUser.uid
      const obj = { [`${uid}`]: { date: sdate, time: stime, search: keyword } }
      const key = keyword.split('')[0]
      const res = await this.$fire.firestore.collection('-video_search_pattern').doc(key).set(obj, { merge: true })
      console.log(res)
    },
    async logSearchKeyword (keyword) {
      const sdate = dayjs().format('MM-DD-YYYY')
      const stime = dayjs().format('HH:mm:ss.SSS')
      // const uid = this.$store.state.uid
      const uid = this.$fire.auth.currentUser.uid
      const obj = { [`${uid}`]: { date: sdate, time: stime, search: keyword } }
      const key = keyword.split('')[0]
      const res = await this.$fire.firestore.collection('-video_search_keyword').doc(key).set(obj, { merge: true })
      console.log('search keyword logged: ', res)
    },
    async logNoFound (keyword) {
      const sdate = dayjs().format('MM-DD-YYYY')
      const stime = dayjs().format('HH:mm:ss.SSS')
      const uid = this.$fire.auth.currentUser.uid
      // const uid = this.$store.state.uid
      const obj = { [`${uid}`]: { date: sdate, time: stime, search: keyword } }
      const key = keyword.split('')[0]
      const res = await this.$fire.firestore.collection('-video_search_nofound').doc(key).set(obj, { merge: true })
      console.log(res)
    }
  }
}
</script>

<style scoped>
/* .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  padding: 0 4px;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  padding: 0 2px;
} */
.v-subheader {
  font-size: 20px;
}
.theme--light .v-subheader {
  color: #2196f3;
}
.iframe_wrap {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 64px;
  background-color: white;
  z-index: 1;
}
.vidlist {
  z-index: 0;
}
</style>
