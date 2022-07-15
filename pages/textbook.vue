<template>
  <div>
  <v-card
    class="mx-auto"
    outlined
  >
    <v-card-title class="text-h5"> Unit 1-1 Meeting People For The First Time </v-card-title>
  </v-card>
  <v-stepper
    v-model="e6"
    vertical
    non-linear
    v-for="(item, i) in steps"
    :key="i"
  >
    <v-stepper-step
      @click="stepClick(item, i)"
      editable
      :step="i+1"
    >
      {{ item.title }}
      <small> {{ item.small }} </small>
    </v-stepper-step>
    <v-stepper-content :step="i+1">
      <!-- ---  Dialogue -->
      <div v-if="item.type==='dialogue'">
        <textbook-dialogue v-if="item.active" :sheeturl="item.url" />
      <iframe
        v-if="item.active"
        :src="item.src"
        frameborder="0"
        :width="iframew"
        :height="iframeh"
        allow="camera *; geolocation *; microphone *; autoplay *"
        allowfullscreen="true"
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
        @load="iframeloaded"
      >
      </iframe></div>
      <!-- ---  vocabulary -->
      <div v-if="item.type==='list'">
        <textbook-vocab v-if="item.active" :sheeturl="item.url" /></div>
      <!-- ---  practice: fill in the blanks -->
      <div v-if="item.type==='blank'">
        <textbook-practice v-if="item.active" :practiceid="item.docid" /></div>
      <!-- ---  card -->
      <v-card
        v-if="item.type==='card'"
        color="grey lighten-1"
        class="mb-12"
        height="200px"
      ></v-card>
      <!-- ---  PowerPoint: in-class activity / assignment / learning objectives -->
      <div v-if="item.type==='ppt'">
      <iframe
        v-if="item.active"
        :src="item.src"
        frameborder="0"
        :width="iframew"
        :height="iframeh"
        allow="camera *; geolocation *; microphone *; autoplay *"
        allowfullscreen="true"
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
        @load="iframeloaded"
      >
      </iframe></div>
      <!-- ---  Chatbot -->
      <div v-if="item.type==='chatbot'">
        <textbook-chatbot v-if="item.active" /></div>
      <!-- <df-messenger
        v-if="item.active"
        df-cx="true"
        location="us-central1"
        chat-title="WangPeng"
        agent-id="783d094c-70b8-4acf-9ee1-a8d071ccd7d7"
        language-code="en"
        ></df-messenger></div> -->
    </v-stepper-content>
  </v-stepper>
  </div>
</template>

<script>
export default {
  data () {
    return {
      steps: [
        {
          title: 'Learning Objectives',
          small: '学习目标',
          type: 'ppt',
          src: 'https://docs.google.com/presentation/d/e/2PACX-1vQk9MhKpNQcKj2ZDFAt2Gb2bN4pJYaSat3vXYYcbUhCLHRLAOdcDnAGg1yz-uKQ7JaZ3PgkMZSM9ie2/embed?start=false&loop=false&delayms=60000',
          active: true
        },
        {
          title: 'Vocabulary & Expressions',
          small: '生词 ／ 成语 ／ 俗语 ／ 惯用语',
          type: 'list',
          active: false,
          url: 'https://docs.google.com/spreadsheets/d/1ir9WAXK-82IySCQcl2h8Bmy4lRl2xX9XJevWQ9Ih5xw/edit#gid=0'
        },
        {
          title: 'Dialogue Video',
          small: '对话视频',
          type: 'dialogue',
          src: 'https://docs.google.com/presentation/d/e/2PACX-1vTdGUhsWsJFI5l33cdkrneQ-kaZKaTOIAAmjdjS0yo9Gdp_0_t0SJ4OOhdKL7852FbRYXGLX-BEuggA/embed?start=false&loop=false&delayms=60000',
          active: false,
          url: 'https://docs.google.com/spreadsheets/d/1oj5soHl3_H3OZZb_Qo9diNUtzrkl73s7rtrXxm1-sqE/edit?usp=sharing'
        },
        {
          title: 'Grammar',
          small: '语法',
          type: 'ppt',
          src: 'https://docs.google.com/presentation/d/e/2PACX-1vQ9P704Iqapqr8jSc72FnewBDW9kbDVGC4IYX5KoaTJ1wk7QJv6l5L0EnAaCZKhp7T0UzWcvLHOIqtQ/embed?start=false&loop=false&delayms=60000',
          active: false
        },
        {
          title: 'Cultural Notes',
          small: '文化知识点',
          type: 'ppt',
          src: 'https://docs.google.com/presentation/d/e/2PACX-1vQXKrp5zfHr32ot2Lt12OXkZQmZrjPQeFYJKek0H6n-DELj7kaNgjm1nGUx-4BKxWJKsV_i4RJC1IWb/embed?start=false&loop=false&delayms=60000',
          active: false
        },
        {
          title: 'Activities',
          small: '课堂活动',
          type: 'ppt',
          src: 'https://docs.google.com/presentation/d/e/2PACX-1vQs6JXXpRyTskXMRJ0Gc3kfkYcsS-l7GLLEjMuWFaFMnymcik9rfTs63j7I3YF1lWvGRsxSBP6Dfnel/embed?start=false&loop=false&delayms=60000',
          active: false
        },
        {
          title: 'Practice Questions',
          small: '听力练习',
          type: 'blank',
          active: false,
          docid: 'ic_01_01'
        },
        {
          title: 'Speaking Exercises',
          small: '口语练习',
          type: 'chatbot',
          active: false
        },
        {
          title: 'Assignments',
          small: '作业',
          type: 'ppt',
          src: 'https://docs.google.com/presentation/d/e/2PACX-1vS-oO6xnPEyLARizJjSkBEVU49jY681aV9rn0W9U1pAgm3QepP9rxScYcEx7hshSAr0NDo8fj5FDZ_I/embed?start=false&loop=false&delayms=60000',
          active: false
        }
      ],
      e6: 1,
      iframeh: 800,
      iframew: 560
      // src: 'https://docs.google.com/presentation/d/e/2PACX-1vQObdpCuBgBpfrvLqkC_DTp8YJlH3JfJxDpDpmNDWZH5CSj0NSNBY9UZ3WNRsnZttV6k44pxzg-vjeU/embed?start=false&loop=false&delayms=60000'
    }
  },
  methods: {
    stepClick (item, i) {
      console.log(item.type)
      item.active = true
      // if (item.type === 'ppt') {
      //   item.active = true
      // }
      this.steps.splice(i, 1, JSON.parse(JSON.stringify(item)))
    },
    iframeloaded (evt) {
      // default 960/569 = 1.68717
      // console.log(parseInt(1.68717))
      console.log('iframe loaded', evt.path[1].clientWidth)
      this.iframew = evt.path[1].clientWidth
      this.iframeh = parseInt(this.iframew / 1.68717)
    }
  }
}
</script>
