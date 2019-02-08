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
  let result = {}
  fields.forEach(field => {
    const valid_votes = _.filter(votes, function(o) { return o[field] !== '' && o[field] >= 0 })
    const total = valid_votes.length * 10
    const tot = 100 * _.sumBy(valid_votes, field) / total
    result[field] = isNaN(tot) ? 0 : tot
  })

  return result
}

export let totalWinners = function(votes) {
  if (votes == null) {
    return 0
  }
  let total = 0
  votes.forEach(vote => {
    total += vote.winner ? 1 : 0
  })
  return total
}
