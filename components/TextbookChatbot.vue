<template>
  <v-container class="fill-height pa-0">
    <v-row class="no-gutters elevation-4">
    <!-- ---  LEFT column -->
      <v-col
        cols="12"
        sm="6"
        class="flex-grow-1 flex-shrink-0"
        style="border-right: 1px solid #0000001f;"
      >
        <v-responsive
          class="overflow-y-hidden fill-height"
          height="499"
        >

        </v-responsive>
      </v-col>
    <!-- ---  RIGHT column -->
      <v-col
        cols="auto"
        class="flex-grow-1 flex-shrink-0"
      >
        <v-toolbar
          color="teal lighten-1"
          dense
          dark
        >
        <v-toolbar-title> Chatbot </v-toolbar-title>
        </v-toolbar>
        <p />
        <textbook-chatbot-message-display :messages="messages" />
        <textbook-chatbot-stt @speechend="speechEnd"/>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import Vue from 'vue'
// import Vuetify from 'vuetify'
// Vue.use(Vuetify)
import { initSpeech } from '../util/ttsservice'

export default {
  data () {
    return {
      messages: [],
      sessionId: ''
    }
  },
  mounted () {
    // console.log(this.$fire.functions)
    // this.helloWorld()
    // this.messages.push({ content: 'Hello Friend! My name is Xiaoxiao. I am glad you are connecting today. What do you want to practice?', me: false, created_at: new Date().toLocaleTimeString() })
    this.sessionId = Math.random().toString(36).substring(7)
    this.dialogflowGateway('hi')
  },
  methods: {
    onMessageSubmit (msg) {
      console.log(msg)
      this.botmessages.push(msg)
    },
    speechEnd ({ text }) {
      console.log(text)
      this.dialogflowGateway(text)
      this.messages.push({ content: text, me: true, created_at: new Date().toLocaleTimeString() })
      // also send an empty message for bot speech spinner
      this.messages.push({ content: '', me: false, created_at: '' })
    },
    async dialogflowGateway (speech) {
      try {
        const res = await this.$fire.functions.httpsCallable('dialogflowGateway')({ stt: speech, sessionId: this.sessionId })
        console.log(res)
        const speakphrase = []
        this.messages.pop()
        if (res.data.message) {
          res.data.message.forEach((msg) => {
            speakphrase.push(msg[0])
            this.messages.push({ content: msg[0], me: false, created_at: new Date().toLocaleTimeString() })
          })
        }
        if (speakphrase.length > 0) {
          initSpeech.init('en-US') // only available to speak(), NOT available to speakssml() or other functions()
          initSpeech.speak(speakphrase.join(' '))
        }
      } catch (e) {
        console.log(e)
      }
    },
    async helloWorld () {
      try {
        const res = await this.$fire.functions.httpsCallable('helloWorld')({ text: 'happy world' })
        console.log(res.data)
      } catch (e) {
        console.log(e)
      } // end Try block
    }
  }
}
</script>
