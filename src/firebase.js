import firebase from 'firebase'

let config = {
  apiKey: 'AIzaSyC1T8rzAevGQeisRzkuis55T-LpYHci1IY',
  authDomain: 'fir-tutorial-45864.firebaseapp.com',
  databaseURL: 'https://fir-tutorial-45864.firebaseio.com',
  projectId: 'fir-tutorial-45864',
  storageBucket: '',
  messagingSenderId: '703240000781'
}

let firebaseApp = firebase.initializeApp(config)
let firebaseDB = firebaseApp.database()
export let db = firebaseDB
export let songsRef = firebaseDB.ref('songs')
export let votessRef = firebaseDB.ref('votes')
