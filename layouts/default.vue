<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item-group>
          <v-list-item :to="loggedIn && !anonymous ? '/account' : '/signin'" router exact>
            <v-list-item-icon>
              <v-icon v-if="loggedIn && !anonymous" color="info"> mdi-account-circle </v-icon>
              <v-icon v-else-if="loggedIn && anonymous" color="success"> mdi-account-circle </v-icon>
              <v-icon v-else color="warning"> mdi-account-circle </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-if="loggedIn && !anonymous"> Account </v-list-item-title>
              <v-list-item-title v-else class="title"> Sign In </v-list-item-title>
              <v-list-item-subtitle>
              <!-- <v-list-item-subtitle v-if="loggedIn && !anonymous"> -->
                {{ userEmail }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item-group>
          <v-list-item
            v-for="(item, i) in $store.state.items"
            :key="i"
            :to="item.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon :color="item.color">{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-divider> </v-divider>

      <v-list>
        <v-list-item-group>
          <v-list-item
            v-for="(item, i) in $store.state.userItems"
            :key="i"
            :to="item.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon :color="item.color">{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      app
      flat
      hide-on-scroll
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!-- <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn> -->
      <!-- <v-toolbar-title v-text="title" /> -->
      <!-- <v-spacer />
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon class="pink--text">mdi-account-circle</v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <!-- <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    > -->
    <!-- <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  computed: {
    userEmail () {
      let tmp = ''
      if (this.$fire.auth.currentUser) {
        tmp = ''
        if (this.$store.state.userObj.isAnonymous) {
          tmp = ''
        } else {
          tmp = this.$store.state.userObj.email
          // alert(tmp)
        }
      } else {
        tmp = ''
      }
      // console.log('userEmail: ', tmp)
      return tmp
    },
    loggedIn () {
      let tmp = null
      if (this.$store.state.userObj) {
        // console.log('default.vue -- logged in')
        tmp = true
      } else {
        tmp = false
      }
      return tmp
    },
    anonymous () {
      let tmp = true
      if (this.$store.state.userObj) {
        tmp = true
        if (this.$store.state.userObj.isAnonymous) {
          tmp = true
        } else {
          tmp = false
        }
      } else {
        tmp = true
      }
      return tmp
    }
  }
}
</script>
