import * as sdk from 'microsoft-cognitiveservices-speech-sdk'
import Vue from 'vue'
// let connection
// export const eventBus = new Vue()

const key = window.$nuxt.$store.getters.randomstring
const region = 'centralus'
let player
let speechConfig
let audioConfig
let synthesizer

function dialogxml (item) {
  let tmp = ''
  if (item.voice === 'pink') {
    tmp = `<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
      <voice name="zh-CN-XiaoxiaoNeural">
          ${item.dialogue}
      </voice>
      <voice name="zh-CN-XiaoxiaoNeural"><prosody rate="-35%" pitch="0%">
          ${item.dialogue} </prosody>
      </voice>
      </speak>`
  } else if (item.voice === 'info') {
    tmp = `<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
      <voice name="zh-CN-YunyangNeural">
          ${item.dialogue}
      </voice>
      <voice name="zh-CN-YunyangNeural"><prosody rate="-35%" pitch="0%">
          ${item.dialogue} </prosody>
      </voice>
      </speak>`
  }
  return tmp
}

function xml (str) {
  return `<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="zh-CN-XiaoxiaoNeural">
        ${str}
    </voice>
    <voice name="zh-CN-XiaoxiaoNeural"><prosody rate="-25%" pitch="0%">
        ${str} </prosody>
    </voice>
    <voice name="zh-CN-YunyangNeural">
        ${str}
    </voice>
    <voice name="zh-CN-YunyangNeural"><prosody rate="-25%" pitch="0%">
        ${str} </prosody>
    </voice>
    </speak>`
}

const initSpeech = new Vue({
  methods: {
    init (lang = 'zh-CN') {
      player = new sdk.SpeakerAudioDestination()
      player.onAudioStart = function (_) {
        // console.log('synthesis audio started ===')
        window.$nuxt.$emit('audiostarted')
      }
      player.onAudioEnd = function (_) {
        // console.log('synthesis audio ended ===')
        window.$nuxt.$emit('audioended')
      }
      speechConfig = sdk.SpeechConfig.fromSubscription(key, region)
      audioConfig = sdk.AudioConfig.fromSpeakerOutput(player)
      if (lang === 'zh-CN') {
        // speechConfig.speechSynthesisLanguage = 'en-US' or 'zh-CN' 'en-US-JennyNeural'
        speechConfig.speechSynthesisVoiceName = 'zh-CN-XiaoxiaoNeural'
      } else {
        speechConfig.speechSynthesisLanguage = 'en-US'
        speechConfig.speechSynthesisVoiceName = 'en-US-JennyNeural'
      }
      // https://docs.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/speechsynthesisoutputformat?view=azure-node-latest
      speechConfig.speechSynthesisOutputFormat = 4 // audio-16khz-128kbitrate-mono-mp3
      synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig)
      // console.log(synthesizer)
      /*
      synthesizer.synthesizing = (s, e) => {
        console.log('synthesizing')
      } */
      synthesizer.synthesisStarted = function (s, e) {
        // console.log('synthesizer started ===')
        window.$nuxt.$emit('synstarted')
      }
      synthesizer.synthesisCompleted = function (s, e) {
        // console.log('synthesizer completed ===')
        window.$nuxt.$emit('synended')
      }
      synthesizer.SynthesisCanceled = function (s, e) {
        // console.warn('synthesizer cancled or ERROR')
        window.$nuxt.$emit('syncanceled')
      }
      // return synthesizer
    },
    close () {
      player.pause()
    },
    dialogspeakssml (sentence) {
      synthesizer.speakSsmlAsync(dialogxml(sentence),
        (result) => {
          if (result) {
            // return result.audioData
            // SynthesizingAudioCompleted = 10, Indicates the synthesized audio is now complete for this phrase.
            // console.log(result.reason)
            if (result.reason !== 10) {
              window.$nuxt.$emit('speakerror')
            }
          }
          synthesizer.close()
        },
        (error) => {
          console.log(error)
        }
      )
    },
    speakssml (phrase) {
      synthesizer.speakSsmlAsync(xml(phrase),
        (result) => {
          if (result) {
            // return result.audioData
            // SynthesizingAudioCompleted = 10, Indicates the synthesized audio is now complete for this phrase.
            // console.log(result.reason)
            if (result.reason !== 10) {
              window.$nuxt.$emit('speakerror')
            }
          }
          synthesizer.close()
        },
        (error) => {
          console.log(error)
        }
      )
    },
    speak (phrase) {
      synthesizer.speakTextAsync(phrase,
        (result) => {
          if (result) {
            // return result.audioData
            // SynthesizingAudioCompleted = 10, Indicates the synthesized audio is now complete for this phrase.
            console.log(result.reason)
          }
          synthesizer.close()
        },
        (error) => {
          console.log(error)
        }
      )
    }
  }
})

export { initSpeech }
