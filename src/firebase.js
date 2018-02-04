import firebase from 'firebase'
import _ from 'lodash'

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
export let totalVotes = function(votes, fields) {
  if (votes == null) {
    return 0
  }
  const total = votes.length * 10
  let resutl = {}
  fields.forEach(field => {
    const tot = 100 * _.sumBy(votes, field) / total
    resutl[field] = isNaN(tot) ? 0 : tot
  })

  return resutl
}
