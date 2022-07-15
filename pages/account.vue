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
            Account
          </div>

          <!-- <div class="subtitle-1 font-weight-light">
            New employees on 15th September, 2016
          </div> -->
        </template>
        <v-text-field v-model="userData.email" label="Email" />
        <v-select v-model="userData.membership" :items="role" label="Membership" prepend-icon="mdi-book-account" />
        <v-text-field v-model="userData.displayName" label="Screen name" />
        <v-text-field v-model="userData.school" label="School" />
        <v-text-field v-model="userData.classes" label="Classes" />
        <v-card-actions>
          <v-btn color="primary" outlined @click="updateProfile"> Update </v-btn>
          <v-spacer />
          <v-btn color="pink" outlined @click="logout"> logout </v-btn>
        </v-card-actions>
      </BaseMaterialCard>
      <v-alert
        dismissible
        type="success"
        v-show="showalert"
      >
        {{ alertmsg }}
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
// import * as firebaseui from 'firebaseui'
// import 'firebaseui/dist/firebaseui.css'
// import MaterialCard from '~/components/base/MaterialCard'

export default {
  asyncData ({ req, redirect }) {
    // console.log(req, redirect)
    console.warn(process.server) // loading from server (true) or navigate from another page (false)
    if (process.server) {
      redirect('/')
    }
  },
  data () {
    return {
      google_logo: require('../static/google_logo.svg'),
      // filter: '',
      // title: 'Please enter your email to continue:',
      role: ['Instructor', 'Student'],
      // pwlessemail: '',
      userData: { email: '', membership: '', displayName: '', school: '', classes: '' },
      showalert: false,
      alertmsg: '',
      // errormessage: '',
      // tos: false,
      items: []
    }
  },
  mounted () {
    // console.warn(this.$fire.auth.currentUser)
    this.confirmEmailSignIn()
  },
  methods: {
    updateProfile () {
      this.$fire.firestore.collection('-video_user').doc(this.userData.email)
        .set(this.userData).then(() => {
          this.showalert = true
          this.alertmsg = 'Account info updated successfully'
        }).catch((err) => {
          console.log(err.message)
        })
    },
    confirmEmailSignIn () {
      // Confirm the link is a sign-in with email link.
      // console.log(window.location.href)
      if (this.$fire.auth.isSignInWithEmailLink(window.location.href)) {
        // Additional state parameters can also be passed via URL.
        // This can be used to continue the user's intended action before triggering
        // the sign-in operation.
        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        let email = window.localStorage.getItem('lijuemailForSignIn')
        if (!email) {
          // User opened the link on a different device. To prevent session fixation
          // attacks, ask the user to provide the associated email again. For example:
          email = window.prompt('Please provide your email for confirmation')
          console.log(email)
        }
        // The client SDK will parse the code from the link for you.
        this.$fire.auth.signInWithEmailLink(email, window.location.href).then((result) => {
          // Clear email from storage.
          window.localStorage.removeItem('lijuemailForSignIn')
          // console.log(result.user)
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
          const email = result.user.email
          // const obj = { displayName: result.user.displayName, email: result.user.email, photoURL: result.user.photoURL }
          // this.userData = obj
          // this.$store.dispatch('setUserData', obj)
          // Get saved collection
          this.getUserData(email)
          // this.init(email)
        }).catch((err) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
          this.errormessage = err.message
        })
      } else {
        // this.$router.push('/')
        // console.log('get user obj from VUEX store', this.$store.state.userObj)
        // this.userData.email = this.$store.state.userObj.email
        this.getUserData(this.$store.state.userObj.email)
      }
    },
    getUserData (uemail) {
      this.$fire.firestore.collection('-video_user').doc(uemail).get()
        .then((res) => {
          // console.log(res.data())
          if (res.exists) {
            // console.log(res.data())
            this.userData = res.data()
            this.$store.dispatch('setUserData', res.data())
          } else {
            // console.log(email)
            const temp = { email: uemail, displayName: 'Anonymous', membership: 'Instructor', school: '', classes: '' }
            this.$fire.firestore.collection('-video_user').doc(uemail).set(temp).then(() => {
              console.log('user data saved')
              this.showalert = true
              this.alertmsg = 'Account created successfully'
              this.userData = temp
              this.$store.dispatch('setUserData', this.userData)
            }).catch((err) => {
              console.log(err.message)
            })
          }
        }).catch((err) => {
          this.errormessage = err.message
        })
    },
    logout () {
      this.$fire.auth.signOut().then(() => {
        // this.title = 'SIGN IN'
        this.emailsent = false
        this.$router.push('/')
      }).catch((err) => {
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
