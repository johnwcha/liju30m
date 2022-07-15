<template>
  <div>
    <section>
      <v-parallax :src="imageLink.sub_main" height="600">
        <v-layout column align-center justify-center class="white--text">
          <h1 class="white--text mb-2 display-2 text-center" style="font-weight: 900; text-shadow: 3px 2px #000000">搜詞 • 搜語法 • 一鍵搜</h1>
          <div class="white--text display-1 mb-3 text-center" style="font-weight: 900; text-shadow: 2px 2px #000000">No more 大海撈針</div>
          <v-btn class="blue lighten-2 mt-5" dark large href="/search">
            Get Started
          </v-btn>
        </v-layout>
      </v-parallax>
    </section>

    <section>
      <v-layout
        column
        wrap
        class="my-5"
        align-center
      >
        <v-flex xs12 sm4 class="my-3">
          <div class="text-center">
            <h2 class="headline">Best way to find authentic materials on YouTube</h2>
          </div>
        </v-flex>
        <v-flex xs12>
          <v-container grid-list-xl>
            <v-layout row wrap align-center>
              <v-flex xs12 md4>
                <v-card class="elevation-0 transparent">
                  <v-card-text class="text-center">
                    <v-icon x-large class="blue--text text--lighten-2">mdi-magnify</v-icon>
                  </v-card-text>
                  <v-card-title primary-title class="layout justify-center">
                    <div class="headline text-center"> 關鍵字 • 語法點 • 一鍵搜索</div>
                  </v-card-title>
                  <v-card-text>
                    In addition to basic word/phrase searches, you can do advanced searches based on grammar patterns.
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12 md4>
                <v-card class="elevation-0 transparent">
                  <v-card-text class="text-center">
                    <v-icon x-large class="blue--text text--lighten-2">mdi-flash</v-icon>
                  </v-card-text>
                  <v-card-title primary-title class="layout justify-center">
                    <div class="headline"> 全文檢索 • 結果秒出 </div>
                  </v-card-title>
                  <v-card-text>
                    Powered by Google infrastructures, the service is reliable and search results return in seconds.
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12 md4>
                <v-card class="elevation-0 transparent">
                  <v-card-text class="text-center">
                    <v-icon x-large class="blue--text text--lighten-2">mdi-share-variant</v-icon>
                  </v-card-text>
                  <v-card-title primary-title class="layout justify-center">
                    <div class="headline text-center"> 全平台支援 </div>
                  </v-card-title>
                  <v-card-text>
                    Multiple hardware and software device support. Curated search results can be saved or exported to create PPT slides.
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </section>

    <section>
      <v-parallax :src="imageLink.social_cover" height="380">
        <v-layout column align-center justify-center>
          <div class="headline white--text mb-3 text-center"> 大海撈•珍 </div>
          <div class="headline white--text mb-3 text-center"> Authentic materials on YouTube made easy </div>
        </v-layout>
        <!-- <v-layout justify-space-around justify-center>
            <v-icon x-large dark>fab fa-facebook-f</v-icon>
            <v-icon x-large dark>fab fa-twitter</v-icon>
            <v-icon x-large dark>fab fa-reddit-alien</v-icon>
            <v-icon x-large dark>fab fa-instagram</v-icon>
            <v-icon x-large dark>fab fa-discord</v-icon>
          </v-layout> -->
      </v-parallax>
    </section>

    <section>
      <v-container grid-list-xl>
        <v-layout row wrap justify-center class="my-5">
          <v-flex xs12 sm4>
            <v-card class="elevation-0 transparent">
              <v-card-title primary-title class="layout justify-center">
                <div class="headline"> 網站項目 </div>
              </v-card-title>
              <v-card-text>
                The project was started soon after we had to teach from home in March 2020. The original idea came partly from one of my students. The video presentations have made our classes much more lively and our students have benefited greatly from the service.
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm4 offset-sm1>
            <v-card class="elevation-0 transparent">
              <v-card-title primary-title class="layout justify-center">
                <div class="headline"> 參與開發？ </div>
              </v-card-title>
              <v-card-text>
                Please consider to help with the project and become a <span class="pink--text">superuser</span> with privileged access. All help is welcome.
                Email <span class="pink--text"> johnwcha@gmail.com </span> for questions or more information.
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </section>

  <!-- <section>
    <v-card>
      <v-simple-table>
        <thead>
          <tr>
            <th> </th>
            <th class="text-center"> Membership 100 </th>
            <th class="text-center"> Membership 500 </th>
            <th class="text-center"> Membership 1000 </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> Components </td>
            <td class="text-center"> 5 </td>
            <td class="text-center"> 40+ </td>
            <td class="text-center"> 80+ </td>
          </tr>
          <tr>
            <td> Vocab Search </td>
            <td class="text-center"> limited </td>
            <td class="text-center"> unlimited </td>
            <td class="text-center"> unlimited </td>
          </tr>
          <tr>
            <td> Pattern Search </td>
            <td class="text-center"> limited </td>
            <td class="text-center"> unlimited </td>
            <td class="text-center"> unlimited </td>
          </tr>
          <tr>
            <td> Price / per month </td>
            <td class="text-center"> Free </td>
            <td class="text-center"> $5 </td>
            <td class="text-center"> $10 </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
  </section> -->
</div>
</template>

<script>
export default {
  data () {
    return {
      imageLink: {
        main:
          'https://firebasestorage.googleapis.com/v0/b/endorfinevue.appspot.com/o/assets%2Fb13f0434-b228-11e6-8e5d-5252025056ab_web_scale_0.4666667_0.4666667__.jpg?alt=media&token=660df23e-599e-434b-9313-ba69c973eeea',
        sub_main:
          'https://images.unsplash.com/photo-1540655037529-dec987208707?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=794&q=80',
        //  'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=667&q=80',
        //  'https://images.unsplash.com/photo-1567443024551-f3e3cc2be870?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80',
        // 'https://images.unsplash.com/photo-1552181903-a6af3a3d159d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1534&q=80',
        // 'https://images.unsplash.com/photo-1533312976185-c6f84ac1cb6a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80',
        // 'https://images.unsplash.com/photo-1614107151491-6876eecbff89?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1334&q=80',
        logo:
          'https://firebasestorage.googleapis.com/v0/b/endorfinevue.appspot.com/o/assets%2Fandroid-chrome-512x512.png?alt=media&token=8a0a66f6-4741-4ff6-8f28-eb9ec74374df',
        social_cover:
          'https://images.unsplash.com/photo-1472220625704-91e1462799b2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        // 'https://firebasestorage.googleapis.com/v0/b/endorfinevue.appspot.com/o/assets%2Fo-NIGHTCLUB-facebook.jpg?alt=media&token=cefc5c4c-9714-41da-9c22-f63caf5e89a4'
      },
      total_char: '',
      total_search: '',
      total_set: '',
      unique_char: '',
      video_count: '',
      video_length: '',
      hour: ''
    }
  },
  mounted () {
    // console.log(this.$store.state.userObj)
  },
  methods: {
    // async testfb () {
    //   const res = await this.$fire.firestore.collection('祝').get()
    //   // console.log(res.data())
    //   res.forEach((item) => {
    //     console.log(item.data())
    //   })
    // },
    async logEvent () {
      try {
        await this.$fire.analytics.logEvent('login')
        // alert("Event 'analytics_button_clicked' logged to Google Analytics")
      } catch (e) {
        alert(e)
      }
    }
  }
}
</script>

<style scoped>
.finedTitle {
  font-weight: 900;
  text-shadow: 2px 2px #000000;
}

.social-icon {
  font-size: 21px;
  color: white;
}
</style>
