import firebase from 'firebase'
import 'firebase/firestore' // if use firestore
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/functions'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyAmwNOu33m2X5d6noWqiS8ljqBeLtEAV5M',
    authDomain: 'liju30m.firebaseapp.com',
    databaseURL: 'https://liju30m-default-rtdb.firebaseio.com',
    projectId: 'liju30m',
    storageBucket: 'liju30m.appspot.com',
    messagingSenderId: '976433116219',
    appId: '1:976433116219:web:1669665295da140149981e',
    measurementId: 'G-D8QHWBJYDZ'
  })
}

// firebase.firestore().settings({ timestampsInSnapshots: true })
// firebase.firestore().settings({ ssl: false, host: 'localhost:8080', timestampsInSnapshots: true })
// data persist
// firebase emulators:start --import=./db_data --export-on-exit

const db = firebase.firestore() // for production
const storage = firebase.storage() // if use storage
const auth = firebase.auth()

export { storage, db, auth }

// denormailize data sets
// const taskCategory = {}
// snapshots.forEach(snap => {
//   const task = snap.val()
//   const { category } = task
//   if (taskCategory[category] == null) {
//     taskCategory[category] = {}
//   }
//   taskCategory[category][snap.key] = task
// })
