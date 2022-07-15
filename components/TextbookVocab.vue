<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">
            #
          </th>
          <th class="text-left">
            Simplified
          </th>
          <th class="text-left">
            Traditional
          </th>
          <th class="text-left">
            Pinyin
          </th>
          <th class="text-left">
            Part of Speech
          </th>
          <th class="text-left">
            English
          </th>
          <th> </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, i) in vocablist"
          :key="item.name"
        >
          <td>{{ i + 1 }}</td>
          <td>{{ item.simp }}</td>
          <td>{{ item.trad }}</td>
          <td>{{ item.pinyin }}</td>
          <td>{{ item.ps }}</td>
          <td>{{ item.eng }}</td>
          <td>
            <v-btn
              v-if="item.playing"
              color="info"
              fab
              small
              outlined
              @click="requestStop(i)"> <v-icon> mdi-stop </v-icon> </v-btn>
            <v-btn
              v-else
              color="pink"
              fab
              small
              outlined
              @click="requestSpeech(item.simp, i)"> <v-icon> mdi-play </v-icon> </v-btn>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
// import * as sdk from 'microsoft-cognitiveservices-speech-sdk'
import PublicGoogleSheetsParser from 'public-google-sheets-parser'
import { initSpeech } from '../util/ttsservice'

export default {
  props: ['sheeturl'],
  data () {
    return {
      vocablist: [],
      curIndex: null
    }
  },
  computed: {
    parser () {
      return new PublicGoogleSheetsParser()
    },
    sheetid () {
      // https://docs.google.com/spreadsheets/d/1ir9WAXK-82IySCQcl2h8Bmy4lRl2xX9XJevWQ9Ih5xw/edit#gid=0
      const tmp = this.sheeturl.split('/spreadsheets/d/')[1].split('/edit')[0]
      return tmp
    }
  },
  destroyed () {
    window.$nuxt.$off('audioended')
  },
  mounted () {
    console.log('vocab list mounted')
    this.getItems(this.sheetid)
    window.$nuxt.$on('audioended', () => {
      // console.log('audio ended in textbook-vocab')
      this.audioBtnStop(this.curIndex)
    })
  },
  methods: {
    async getItems (spreadsheetId) {
      this.vocablist = await this.parser.parse(spreadsheetId)
    },
    requestSpeech (str, index) {
      this.curIndex = index
      // console.log(str)
      const item = this.vocablist[index]
      item.playing = true
      this.vocablist.splice(index, 1, JSON.parse(JSON.stringify(item)))
      initSpeech.init()
      // initSpeech.speak(str)
      initSpeech.speakssml(str)
    },
    requestStop (index) {
      this.audioBtnStop(index)
      initSpeech.close()
    },
    audioBtnStop (index) {
      const item = this.vocablist[index]
      item.playing = false
      this.vocablist.splice(index, 1, JSON.parse(JSON.stringify(item)))
    }
  }
}
</script>
