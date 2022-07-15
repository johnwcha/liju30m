<template>
  <div>
    <v-card-actions class="mx-0 px-0">
        <div v-if="listening">
            <v-img
            :src="require(`../static/mic-animate.gif`)"
            @click="listening = false; endSpeechRecognition();"
            />
        </div>
        <div v-else>
            <v-img
            :src="require(`../static/mic.gif`)"
            @click="listening = true; startSpeechRecognition();"
            />
        </div>
    <v-text-field
        v-model="runtimeTranscription"
        label="click on mic to start"
        type="text"
        no-details
        outlined
        append-outer-icon="mdi-send"
        @keyup.enter="sendMsg"
        @click:append-outer="sendMsg"
        hide-details
    />
    </v-card-actions>
  </div>
</template>

<script>
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = SpeechRecognition ? new SpeechRecognition() : false
recognition.continuous = true

export default {
  name: 'Speech2Text',
  // lang: 'en-US' cmn-Hans-CN
  props: {
    lang: {
      type: String,
      default: 'en-US'
    }
  },
  data () {
    return {
      error: false,
      speaking: false,
      listening: false,
      runtimeTranscription: '',
      sentences: []
    }
  },
  methods: {
    sendMsg () {
      if (this.runtimeTranscription === '') { return }
      recognition.abort()
      this.$emit('speechend', {
        text: this.runtimeTranscription
      })
      this.runtimeTranscription = ''
    //   recognition.start()
    },
    checkCompatibility () {
      if (!recognition) {
        this.error = 'Speech Recognition is not available on this browser. Please use Chrome or Firefox'
      } else {
        recognition.addEventListener('speechstart', function () {
          this.speaking = true
          console.log('SPEECH recognition STARTED')
        })

        recognition.addEventListener('speechend', function () {
          console.log('SPEECH recognition stopped')
        })

        recognition.addEventListener('result', (event) => {
          const text = Array.from(event.results).map(result => result[0]).map(result => result.transcript).join(' ')
          this.runtimeTranscription = text
        })

        recognition.addEventListener('end', () => {
          console.log('recognition service Ended')
          this.speaking = false
          if (this.listening) {
            recognition.start()
          }
        })
      }
    },
    endSpeechRecognition () {
      recognition.stop()
      this.listening = false
      // console.log(this.sentences.join(' '))
      // this.$emit('speechend', {
      // text: this.sentences.join(' ')
      // })
      // this.sentences = []
    },
    startSpeechRecognition () {
      if (!recognition) {
        this.error = 'Speech Recognition is not available on this browser. Please use Chrome or Firefox'
        return false
      }
      this.listening = true
      recognition.lang = this.lang
      recognition.interimResults = true

      // recognition.onspeechstart = function () {
      //       this.speaking = true;
      //   };

      // recognition.onspeechend = function () {
      //     this.speaking = false;
      // };

      // recognition.onerror = function (event) {
      //     this.speaking = false;
      // };

      recognition.start()
    },
    capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  },
  mounted () {
    this.checkCompatibility()
  }
}

</script>

<style>

.grid-parent {
  display: grid;
  grid-template-columns: 0fr 1fr
}

</style>
