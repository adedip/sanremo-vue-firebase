<template>
  <div class="hello">
    <router-link :to="{ name: 'Songs'}">all songs</router-link>
    <h1>{{ $route.params.title }} - {{$route.params.author}}</h1>
    <form id="form" class="form-inline" v-on:submit.prevent="addVote" v-if="voted">
      <div class="form-group">
        <label for="songVote">Song:</label>
        <input type="text" id="songVote" class="form-control" v-model.trim.number="newVote.song" @input="$v.newVote.song.$touch()">
      </div>
      <div v-if="$v.newVote.song.$error">
        <span class="form-group__message" v-if="!$v.newVote.song.between">Voto tra 1 e 10</span>
        <span class="form-group__message" v-if="!$v.newVote.song.required">Obbligatorio</span><span class="form-group__message" v-if="!$v.newVote.song.numeric">Inserisci un numero.</span>
      </div>
      <div class="form-group">
        <label for="lookVote">Look:</label>
        <input type="text" id="lookVote" class="form-control" v-model.trim.number="newVote.look" @input="$v.newVote.look.$touch()">
      </div>
      <div v-if="$v.newVote.look.$error">
        <span class="form-group__message" v-if="!$v.newVote.song.between">Voto tra 1 e 10</span>
        <span class="form-group__message" v-if="!$v.newVote.look.required">Obbligatorio</span><span class="form-group__message" v-if="!$v.newVote.look.numeric">Inserisci un numero.</span>
      </div>
      <input v-bind:disabled="$v.newVote.$invalid" type="submit" class="btn btn-primary" value="Add vote">
    </form>

    Canzone: {{totalSongVotes}}<br>
    <b-progress :value="totalSongVotes"
                :variant="bar.variant"
                :key="bar.variant"
                :striped="bar.striped"
    ></b-progress>
    <br>
    Look: {{totalLookVotes}}<br>
    <b-progress :value="totalLookVotes"
                :variant="bar.variant"
                :key="bar.variant2"
                :striped="bar.striped"
    ></b-progress>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Song</th>
          <th>Look</th>
          <th>User</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(vote,index) in reverseFilteredVotes" :key="index">
          <td>{{vote.song}}</td>
          <td>{{vote.look}}</td>
          <td>{{vote.user}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {db} from '../firebase'
import { required, numeric, between } from 'vuelidate/lib/validators'

export default {
  name: 'Song',
  data () {
    return {
      bar: {
        value: 80,
        variant: 'info',
        variant2: 'success',
        striped: true
      },
      user: this.$firebase.auth().currentUser.email,
      id: this.$route.params.id,
      filteredVotes: null,
      nestedVotes: [],
      newVote: {
        song: '',
        look: '',
        user: this.$firebase.auth().currentUser.email,
        created_at: Date.now()
      }
    }
  },
  validations: {
    newVote: {
      song: {
        required,
        numeric,
        between: between(0, 10)
      },
      look: {
        required,
        numeric,
        between: between(0, 10)
      }
    }
  },
  created () {
    this.nestedVotes = db.ref('/songs/' + this.id + '/votes')
    this.$bindAsArray('filteredVotes', this.nestedVotes.orderByChild('created_at'))
  },
  mounted () { },
  computed: {
    reverseFilteredVotes () {
      if (this.filteredVotes == null) {
        return []
      }
      return this.filteredVotes.slice().reverse()
    },
    voted () {
      if (this.filteredVotes != null) {
        return this._.filter(this.filteredVotes, {'user': this.user}).length >= 0
      } else {
        return true
      }
    },
    totalSongVotes () {
      if (this.filteredVotes == null) {
        return 0
      }
      const total = this.filteredVotes.length * 10
      const totalSongVotes = 100 * this._.sumBy(this.filteredVotes, 'song') / total
      return isNaN(totalSongVotes) ? 0 : totalSongVotes
    },
    totalLookVotes () {
      if (this.filteredVotes == null) {
        return 0
      }
      const total = this.filteredVotes.length * 10
      const totalLookVotes = 100 * this._.sumBy(this.filteredVotes, 'look') / total
      return isNaN(totalLookVotes) ? 0 : totalLookVotes
    }
  },
  methods: {
    addVote: function () {
      this.nestedVotes.push(this.newVote)
      this.newVote.title = ''
      this.newVote.author = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
