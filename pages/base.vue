<template>
  <v-stepper v-model="el">
  <v-stepper-items>
  <v-stepper-content step="1">
  <v-container class="grey lighten-5">
    <v-row>
      <v-col
        v-for="lesson in lessons"
        :key="lesson.img"
        cols="12"
        sm="4"
      >
        <v-card
          class="pa-2"
          tile
          elevation="1"
        >
          <v-img
            :src="require(`../static/IC_icons/${lesson.img}`)"
          />
          <v-card-title>
        {{ lesson.subtitle }}
        </v-card-title>

        <v-card-subtitle class="pink--text">
        {{ lesson.title }}
        </v-card-subtitle>

        <v-card-actions>
        <v-btn
            color="orange lighten-2"
            text
            @click="gotopractice(lesson.btn[0].docid, lesson.btn[0].name, lesson.title)"
        >
            {{ lesson.btn[0].name }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
            color="orange lighten-2"
            text
            @click="gotopractice(lesson.btn[1].docid, lesson.btn[1].name, lesson.title)"
        >
            {{ lesson.btn[1].name }}
        </v-btn>
        </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  </v-stepper-content>

  <v-stepper-content step="2">
    <v-container class="grey lighten-5" fluid>
    <v-row>
      <v-col cols="12" sm="7">
        <!-- <div id="player-size" style=""> -->
        <div id="cropping-div" style="">
        <div id="div-to-crop" style="">
        <div id="player-wrapper">
          <div id="mask">
          <youtube
              id="player"
              ref="youtube"
              :style="maskStyle"
              :video-id="videoId"
              :player-vars="playerVars"
              @cued="vidready"
              @paused="vidpaused"
              @buffering="vidbuffering"
              @playing="vidplaying"
          /></div>
          <!-- :style="{ position: 'absolute', top: 0, width: 100 + '%', height: subtitleHeight + '%' }" -->
        </div></div></div>
        <!-- </div> -->
          <v-slider
            v-model="slider"
            label="Playback speed"
            thumb-label
            max="1"
            min="0.1"
            step="0.05"
            @end="setPlayerSpeed"
          />
        <v-card>
          <v-card-title> Instructions: fill-in-the-blank  </v-card-title>
          <v-card-subtitle class="pink--text"> {{ lessonname }}  {{ dialoguename }} : {{ queNum }} questions </v-card-subtitle>
          <v-card-text> Watch the video clip for each question and enter the missing characters in the blank provided. <span v-if="help"> Here are the missing keywords: <span class="pink--text" v-if="simp"> {{ answerkeyssimp.join('，') }} </span> <span class="pink--text" v-else> {{ answerkeys.join('，') }} </span> </span></v-card-text>
          <v-card-actions>
            <v-btn color="info" outlined small @click="goback"> <v-icon left> mdi-arrow-left </v-icon>back </v-btn>
            <v-btn color="warning" outlined small @click="help = 1"> help </v-btn>
            <v-spacer />
            <v-btn v-if="simp" color="pink" outlined small @click="simp = 0"> traditional </v-btn>
            <v-btn v-else color="green" outlined small @click="simp = 1"> simplified </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="5">
      <v-card class="gpanel px-1" :max-height="height">
        <v-simple-table class="mb-1">
          <tbody v-for="(item, i) in mockList" :key="i">
            <tr>
              <!-- <td> <v-icon v-if="item.userAns === item.ans || item.userAns === item.anssimp" color="green"> mdi-checkbox-marked </v-icon> </td> -->
              <td> <v-icon v-if="userAns[i] === item.ans || userAns[i] === item.anssimp" color="green"> mdi-checkbox-marked </v-icon> </td>
              <td width="56"> <v-text-field v-model="userAns[i]" /> </td>
              <td> <span class="pink--text"> ({{ i + 1 }}) </span> </td>
              <td v-html="simp ? item.simphtml : item.tradhtml"> </td>
              <td>
                <v-btn
                  class="ma-2"
                  outlined
                  fab
                  x-small
                  color="primary"
                  @click="playSegment(item, i)">
                  <v-icon>mdi-play</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>
      </v-col>
    </v-row>
    </v-container>
  </v-stepper-content>
  </v-stepper-items>
  </v-stepper>
</template>

<script>
import Vue from 'vue'
import VueYoutube from 'vue-youtube'
// import dayjs from 'dayjs'
import { iclessons } from '../util/gtag'

Vue.use(VueYoutube)

export default {
  data () {
    return {
      curClipIndex: null,
      curClip: {},
      intervalID: null,
      lessonname: '',
      dialoguename: '',
      queNum: 0,
      help: 0,
      answerkeyssimp: [],
      answerkeys: [],
      slider: 1,
      simp: 1,
      mockList: [],
      maskStyle: {
        position: 'absolute',
        top: 0,
        width: 100 + '%',
        height: 137 + '%'
      },
      height: 0,
      subtitleHeight: '120',
      videoId: 'qKTAf5hSyzY',
      starttime: 0,
      // videoId: 'qYRAB6pWT8E',
      playerVars: {
        enablejsapi: 1,
        playsinline: 1,
        controls: 0,
        start: 0,
        disablekb: 0,
        autohide: 1,
        fs: 0,
        modestbranding: 1
      },
      el: 1,
      lessons: null,
      userAns: []
    }
  },
  watch: {
    subtitleHeight () {
      // console.log('subtitle height changed')
      this.maskStyle = { position: 'absolute', top: 0, width: 100 + '%', height: `${this.subtitleHeight}%` }
      // const resizeEvt = new Event('resize')
      // window.dispatchEvent(resizeEvt)
      // console.log(this.maskStyle)
    }
  },
  destroyed () {
    window.removeEventListener('resize', this.myEventHandler)
    // console.log('desdroyed')
  },
  mounted () {
    this.lessons = iclessons
    window.addEventListener('resize', this.myEventHandler)
    // console.log(document.documentElement.clientHeight)
    this.height = document.documentElement.clientHeight - 145
  },
  methods: {
    shuffle (array) {
      return array.sort(() => Math.random() - 0.5)
    },
    setPlayerSpeed () {
      this.$refs.youtube.player.setPlaybackRate(this.slider)
    },
    goback () {
      this.help = 0
      this.el = 1
      this.videoId = ''
      this.$refs.youtube.player.pauseVideo()
    },
    playSegment (item, i) {
      // console.log(item)
      this.curClipIndex = i
      this.curClip = item
      this.videoId = item.vid
      this.starttime = item.start
      this.$refs.youtube.player.loadVideoById({ videoId: this.videoId, startSeconds: item.start })
    },
    myEventHandler (e) {
      // console.log(e)
      this.height = e.currentTarget.innerHeight - 145
    },
    gotopractice (docid, dia, lsn) {
      // console.log(docid)
      this.dialoguename = dia
      this.lessonname = lsn
      this.el = 2
      // this.videoId = 'qYRAB6pWT8E'
      this.mockList = []
      this.answerkeyssimp = []
      this.answerkeys = []
      this.userAns = []
      this.$fire.firestore.collection('-video_practice').doc(docid).get().then((res) => {
        this.queNum = res.data().que.length
        res.data().que.forEach((que) => {
          this.answerkeys.push(que.ans)
          this.answerkeyssimp.push(que.anssimp)
        })
        this.answerkeys = [...new Set(this.answerkeys)]
        this.answerkeyssimp = [...new Set(this.answerkeyssimp)]
        this.shuffle(res.data().que).forEach((item) => {
          // console.log(item)
          // const tmp = JSON.parse(JSON.stringify(item))
          // console.log(tmp)
          // delete item.sub
          // item = JSON.parse(JSON.stringify(item))
          // console.log(item)
          // const obj = { ...item, userAns: '', simphtml: item.subsimp.split('___').join('<span class="pink--text">___</span>'), tradhtml: item.sub.split('___').join('<span class="pink--text">___</span>') }
          // const obj = { ...item, userAns: '', simphtml: item.subsimp, tradhtml: item.sub }
          const obj = { ...item, simphtml: item.subsimp, tradhtml: item.sub }
          this.mockList.push(obj)
          this.userAns.push('')
        })
      })
      // const resizeEvt = new Event('resize')
      // window.dispatchEvent(resizeEvt)
    },
    vidready () {
      // console.log('video ready')
      // console.log(this.videoId)
      if (this.videoId === '') {
        this.$refs.youtube.player.pauseVideo()
      } else {
        this.$refs.youtube.player.seekTo(this.starttime, true)
        this.$refs.youtube.player.playVideo()
      }
    },
    vidpaused () {
      // console.log('video paused')
      clearInterval(this.intervalID)
    },
    vidbuffering () {
      // console.log('video buffering')
      clearInterval(this.intervalID)
    },
    vidplaying () {
      // console.log('video playing')
      // console.log(this.curClip)
      // {
      //   "userAns": "",
      //   "simphtml": "刘姐，你好，我是苏珊。您<span class=\"pink--text\">___</span>？您叫什么名字？",
      //   "tradhtml": "劉姐，你好，我是蘇珊。您<span class=\"pink--text\">___</span>？您叫什麼名字？",
      //   "anssimp": "贵姓",
      //   "sub": "劉姐，你好，我是蘇珊。您___？您叫什麼名字？",
      //   "subsimp": "刘姐，你好，我是苏珊。您___？您叫什么名字？",
      //   "ans": "貴姓",
      //   "vid": "Firp5kW49P4",
      //   "start": 152.335
      // }
      this.intervalID = setInterval(this.showTime, 100)
    },
    showTime () {
      this.$refs.youtube.player.getCurrentTime().then((res) => {
        // console.log(res)
        if (!this.curClip.cuepoint) {
          console.log('no cue points found')
        } else if (this.curClip.cuepoint.length === 1) {
          // console.log('one sentence')
          this.cuepoint1(res)
        } else if (this.curClip.cuepoint.length === 2) {
          // console.log('two sentence')
          this.cuepoint2(res)
        } else if (this.curClip.cuepoint.length === 3) {
          // console.log('three sentence')
          this.cuepoint3(res)
        } else if (this.curClip.cuepoint.length === 4) {
          // console.log('four sentence')
          this.cuepoint4(res)
        } else if (this.curClip.cuepoint.length === 5) {
          // console.log('five sentence')
          this.cuepoint5(res)
        } else if (this.curClip.cuepoint.length === 6) {
          // console.log('six sentence')
          this.cuepoint6(res)
        }
      })
    },
    cuepoint1 (res) {
      if (res > this.curClip.cuepoint[0]) {
        // remove highlight
        this.curClip.tradhtml = this.curClip.sub
        this.curClip.simphtml = this.curClip.subsimp
      } else if (res > this.curClip.start) {
        // highlight 1st sentence
        this.curClip.tradhtml = '<mark>' + this.curClip.sub + '</mark>'
        this.curClip.simphtml = '<mark>' + this.curClip.subsimp + '</mark>'
      }
      this.mockList.splice(this.curClipIndex, 1, JSON.parse(JSON.stringify(this.curClip)))
    },
    cuepoint2 (res) {
      if (res > this.curClip.cuepoint[1]) {
        // remove highlight
        this.curClip.tradhtml = this.curClip.sub
        this.curClip.simphtml = this.curClip.subsimp
      } else if (res > this.curClip.cuepoint[0]) {
        // highlight 2nd sentence
        // this.curClip.tradhtml = this.curClip.subarr[0] + '<mark>' + this.curClip.subarr[1] + '</mark>'
        // this.curClip.simphtml = this.curClip.subsimparr[0] + '<mark>' + this.curClip.subsimparr[1] + '</mark>'
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[1]).join('<mark>' + this.curClip.subarr[1] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[1]).join('<mark>' + this.curClip.subsimparr[1] + '</mark>')
      } else if (res > this.curClip.start) {
        // highlight 1st sentence
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[0]).join('<mark>' + this.curClip.subarr[0] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[0]).join('<mark>' + this.curClip.subsimparr[0] + '</mark>')
      }
      this.mockList.splice(this.curClipIndex, 1, JSON.parse(JSON.stringify(this.curClip)))
    },
    cuepoint3 (res) {
      if (res > this.curClip.cuepoint[2]) {
        this.curClip.tradhtml = this.curClip.sub
        this.curClip.simphtml = this.curClip.subsimp
      } else if (res > this.curClip.cuepoint[1]) {
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[2]).join('<mark>' + this.curClip.subarr[2] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[2]).join('<mark>' + this.curClip.subsimparr[2] + '</mark>')
      } else if (res > this.curClip.cuepoint[0]) {
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[1]).join('<mark>' + this.curClip.subarr[1] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[1]).join('<mark>' + this.curClip.subsimparr[1] + '</mark>')
      } else if (res > this.curClip.start) {
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[0]).join('<mark>' + this.curClip.subarr[0] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[0]).join('<mark>' + this.curClip.subsimparr[0] + '</mark>')
      }
      this.mockList.splice(this.curClipIndex, 1, JSON.parse(JSON.stringify(this.curClip)))
    },
    cuepoint4 (res) {
      if (res > this.curClip.cuepoint[3]) {
        this.curClip.tradhtml = this.curClip.sub
        this.curClip.simphtml = this.curClip.subsimp
      } else if (res > this.curClip.cuepoint[2]) {
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[3]).join('<mark>' + this.curClip.subarr[3] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[3]).join('<mark>' + this.curClip.subsimparr[3] + '</mark>')
      } else if (res > this.curClip.cuepoint[1]) {
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[2]).join('<mark>' + this.curClip.subarr[2] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[2]).join('<mark>' + this.curClip.subsimparr[2] + '</mark>')
      } else if (res > this.curClip.cuepoint[0]) {
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[1]).join('<mark>' + this.curClip.subarr[1] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[1]).join('<mark>' + this.curClip.subsimparr[1] + '</mark>')
      } else if (res > this.curClip.start) {
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[0]).join('<mark>' + this.curClip.subarr[0] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[0]).join('<mark>' + this.curClip.subsimparr[0] + '</mark>')
      }
      this.mockList.splice(this.curClipIndex, 1, JSON.parse(JSON.stringify(this.curClip)))
    },
    cuepoint5 (res) {
      if (res > this.curClip.cuepoint[4]) {
        this.curClip.tradhtml = this.curClip.sub
        this.curClip.simphtml = this.curClip.subsimp
      } else if (res > this.curClip.cuepoint[3]) {
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[4]).join('<mark>' + this.curClip.subarr[4] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[4]).join('<mark>' + this.curClip.subsimparr[4] + '</mark>')
      } else if (res > this.curClip.cuepoint[2]) {
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[3]).join('<mark>' + this.curClip.subarr[3] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[3]).join('<mark>' + this.curClip.subsimparr[3] + '</mark>')
      } else if (res > this.curClip.cuepoint[1]) {
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[2]).join('<mark>' + this.curClip.subarr[2] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[2]).join('<mark>' + this.curClip.subsimparr[2] + '</mark>')
      } else if (res > this.curClip.cuepoint[0]) {
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[1]).join('<mark>' + this.curClip.subarr[1] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[1]).join('<mark>' + this.curClip.subsimparr[1] + '</mark>')
      } else if (res > this.curClip.start) {
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[0]).join('<mark>' + this.curClip.subarr[0] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[0]).join('<mark>' + this.curClip.subsimparr[0] + '</mark>')
      }
      this.mockList.splice(this.curClipIndex, 1, JSON.parse(JSON.stringify(this.curClip)))
    },
    cuepoint6 (res) {
      if (res > this.curClip.cuepoint[5]) {
        this.curClip.tradhtml = this.curClip.sub
        this.curClip.simphtml = this.curClip.subsimp
      } else if (res > this.curClip.cuepoint[4]) {
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[5]).join('<mark>' + this.curClip.subarr[5] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[5]).join('<mark>' + this.curClip.subsimparr[5] + '</mark>')
      } else if (res > this.curClip.cuepoint[3]) {
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[4]).join('<mark>' + this.curClip.subarr[4] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[4]).join('<mark>' + this.curClip.subsimparr[4] + '</mark>')
      } else if (res > this.curClip.cuepoint[2]) {
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[3]).join('<mark>' + this.curClip.subarr[3] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[3]).join('<mark>' + this.curClip.subsimparr[3] + '</mark>')
      } else if (res > this.curClip.cuepoint[1]) {
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[2]).join('<mark>' + this.curClip.subarr[2] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[2]).join('<mark>' + this.curClip.subsimparr[2] + '</mark>')
      } else if (res > this.curClip.cuepoint[0]) {
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[1]).join('<mark>' + this.curClip.subarr[1] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[1]).join('<mark>' + this.curClip.subsimparr[1] + '</mark>')
      } else if (res > this.curClip.start) {
        this.curClip.tradhtml = this.curClip.sub.split(this.curClip.subarr[0]).join('<mark>' + this.curClip.subarr[0] + '</mark>')
        this.curClip.simphtml = this.curClip.subsimp.split(this.curClip.subsimparr[0]).join('<mark>' + this.curClip.subsimparr[0] + '</mark>')
      }
      this.mockList.splice(this.curClipIndex, 1, JSON.parse(JSON.stringify(this.curClip)))
    }
  }
}
</script>

<style scoped>
.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  padding: 0 4px;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  padding: 0 2px;
}

#player-size {
  /* comment below line for responsive 16:9 full screen */
  width: 640px;
  /* only need to specify width since 16:9 ratio is
     preserved / automatically applied */
}

#cropping-div {
  overflow: hidden;
}

#div-to-crop {
  overflow: hidden;
  margin-top: -51%;
  margin-bottom: -20%;
}

#player-wrapper {
  position: relative;
  overflow: hidden;
  padding-top: 128.25%;
}

iframe#player {
  position: absolute;
  top: 0;
  width: 100%;
  height: 137%;
}
.gpanel {
  overflow: auto;
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 64px;
  background-color: white;
  z-index: 1;
}

#mask {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  /* background-color: blue; */
  background: rgba(255, 255, 255, 0.5);
}
</style>
