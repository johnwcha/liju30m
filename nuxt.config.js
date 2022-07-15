import colors from 'vuetify/es5/util/colors'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    // titleTemplate: '%s - liju30m',
    title: '大海撈 • 珍',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'one of the best ways to find targeted videon content on YouTube for your Chinese instruction' }
    ],
    script: [
      {
        src: "https://www.gstatic.com/dialogflow-console/fast/messenger-cx/bootstrap.js?v=1",
      },
      {
        src: 'https://aka.ms/csspeech/jsbrowserpackageraw',
      },
      {
        src: 'https://unpkg.com/axios/dist/axios.min.js'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: "AIzaSyAmwNOu33m2X5d6noWqiS8ljqBeLtEAV5M",
          authDomain: "liju30m.firebaseapp.com",
          databaseURL: "https://liju30m-default-rtdb.firebaseio.com",
          projectId: "liju30m",
          storageBucket: "liju30m.appspot.com",
          messagingSenderId: "976433116219",
          appId: "1:976433116219:web:1669665295da140149981e",
          measurementId: "G-D8QHWBJYDZ"
        },
        onFirebaseHosting: true,
        services: {
          // firestore: {
          //   settings: {
          //     host: 'localhost:8080',
          //     ssl: false
          //   }
          // },
          analytics: true,
          functions: true,
          firestore: true,
          auth: {
            persistence: 'local', // default
            initialize: {
              // onAuthStateChangedMutation: 'ON_AUTH_STATE_CHANGED_MUTATION',
              onAuthStateChangedAction: 'onAuthStateChangedAction',
              subscribeManually: false
            }
          }
        }
      }
    ]
  ],

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // extend (config, ctx) {
    //   config.resolve.symlinks = false
    // }
  },
  generate: {
    dir: 'dist/admin'
    // dir: 'dist/user'
    // firebase deploy --only hosting
  }
}
