<template>
<div>
  <v-simple-table height="300">
    <template v-slot:default>
      <thead>
        <tr>
          <th> # </th>
          <th class="text-left">
            Dialogue
          </th>
          <th> </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, i) in vocablist"
          :key="i"
        >
          <td> <span v-if="(i % 4) === 0" > {{ parseInt(i / 4) + 1 }} </span></td>
          <td>{{ item.dialogue }}</td>
          <td> <v-btn
            v-if="item.voice && !item.playing"
            :color="item.voice"
            fab
            small
            outlined
            @click="requestSpeech(item, i)"> <v-icon> mdi-play </v-icon> </v-btn>
            <v-btn
            v-if="item.voice && item.playing"
            :color="item.voice"
            fab
            small
            outlined
            @click="requestStop(i)"> <v-icon> mdi-stop </v-icon> </v-btn>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
  <!-- <textbook-alert /> -->
</div>
</template>
<script>
import PublicGoogleSheetsParser from 'public-google-sheets-parser'
import { initSpeech } from '../util/ttsservice'

export default {
  props: {
    sheeturl: String
  },
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
    console.log('sentence list mounted')
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
    requestSpeech (item, index) {
      this.curIndex = index
      // console.log(item)
      const tmp = this.vocablist[index]
      tmp.playing = true
      this.vocablist.splice(index, 1, JSON.parse(JSON.stringify(tmp)))
      initSpeech.init()
      // initSpeech.speak(str)
      initSpeech.dialogspeakssml(item)
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
