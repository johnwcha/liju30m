<template>
  <v-row justify="center" align="center">
    <v-col
      cols="12"
    >
      <BaseMaterialCard
        color="info"
        class="px-5 py-3 my-6"
      >
        <template #heading>
          <div class="display-1 font-weight-light">
            {{ title }}
          </div>

          <!-- <div class="subtitle-1 font-weight-light">
            New employees on 15th September, 2016
          </div> -->
        </template>
        <v-alert
          dismissible
          type="success"
          v-show="emailsent"
        >
          {{ alertmsg }}
        </v-alert>
        <v-alert
          dismissible
          type="error"
          v-show="errormessage!=''"
        >
          {{ errormessage }}
        </v-alert>
        <p class="mt-3" />
        <v-text-field v-model="pwlessemail" label="Enter email:" />
        <v-btn class="info" :disabled="!tos || pwlessemail===''" @click="getloginlink"> Get Login Link </v-btn>
        <hr class="my-5">
        <v-row align="center" justify="center">
          <p class="mt-3 display-1"> Terms of Service </p>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>(1) The website and service provided here are intended for Mandarin Chinese teaching and learning.</v-list-item-title>
              <v-list-item-title>(2) Use of this website and service for any other purposes are prohibited.</v-list-item-title>
              <v-list-item-title>(3) We reserve the right to refuse or discontinue service to anyone that violates the terms of service.</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-checkbox label="I agree to the above terms of service." v-model="tos" />
        </v-row>
      </BaseMaterialCard>
    </v-col>
  </v-row>
</template>

<script>
// import * as firebaseui from 'firebaseui'
// import 'firebaseui/dist/firebaseui.css'
// import MaterialCard from '~/components/base/MaterialCard'

export default {
//   components: {
//     MaterialCard
//   },
  data () {
    return {
      google_logo: require('../static/google_logo.svg'),
      // filter: '',
      title: 'Please enter your email to continue:',
      pwlessemail: '',
      emailsent: false,
      alertmsg: 'A login link has just been sent to your email (also check the SPAM folder).',
      errormessage: '',
      tos: false
    }
  },
  //   asyncData ({ req, redirect }) {
  //     console.log(req, redirect)
  //     // loading from server (true) or navigate from another page (false)
  //     console.warn('reload from server ?', process.server)
  //   },
  methods: {
    getloginlink () {
      const actionCodeSettings = {
        // url: 'http://localhost:3000/account',
        url: 'https://liju30m.web.app/account',
        handleCodeInApp: true
      }
      this.$fire.auth.sendSignInLinkToEmail(this.pwlessemail, actionCodeSettings).then(() => {
        window.localStorage.setItem('lijuemailForSignIn', this.pwlessemail)
        this.emailsent = true
        console.log('email sent')
      }).catch((err) => {
        this.errormessage = err.message
        console.log(err.message)
      })
    }
  }
}
</script>

<style scoped>
.v-sheet {
  border-radius: 8px;
}
</style>
