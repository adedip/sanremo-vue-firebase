import firebase from 'firebase'
import _ from 'lodash'

var config = {
  apiKey: 'AIzaSyBuI4CEFmBz_UtDqnUqiLoRLjNaZsmIQrk',
  authDomain: 'sanremo-fae7a.firebaseapp.com',
  databaseURL: 'https://sanremo-fae7a.firebaseio.com',
  projectId: 'sanremo-fae7a',
  storageBucket: 'sanremo-fae7a.appspot.com',
  messagingSenderId: '2562111165'
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
