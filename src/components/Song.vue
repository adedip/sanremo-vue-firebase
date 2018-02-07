<template>
  <div class="hello">
    <router-link :to="{ name: 'Songs'}"><button class="btn btn-secondary">Classifica</button></router-link>
    <br>
    <br>
    <b-row>
      <b-col lg="8" offset-lg="2">
        <div class="jumbotron">
          <h1>{{ $route.params.title }}</h1>
          <h3>{{ $route.params.author }}</h3>
          <form id="form" v-on:submit.prevent="addVote" v-if="voted">
            <div class="form-group">
              <label for="songVote">Canzone</label>
              <input type="number" id="songVote" class="form-control" v-model.trim.number="newVote.song" @input="$v.newVote.song.$touch()">
            </div>
            <div v-if="$v.newVote.song.$error">
              <span class="form-group__message" v-if="!$v.newVote.song.between">Voto tra 1 e 10</span>
              <span class="form-group__message" v-if="!$v.newVote.song.required">Obbligatorio</span><span class="form-group__message" v-if="!$v.newVote.song.numeric">Inserisci un numero.</span>
            </div>
            <div class="form-group">
              <label for="lookVote">Look</label>
              <input type="number" id="lookVote" class="form-control" v-model.trim.number="newVote.look" @input="$v.newVote.look.$touch()">
            </div>
            <div v-if="$v.newVote.look.$error">
              <span class="form-group__message" v-if="!$v.newVote.look.between">Voto tra 1 e 10</span>
              <span class="form-group__message" v-if="!$v.newVote.look.required">Obbligatorio</span><span class="form-group__message" v-if="!$v.newVote.look.numeric">Inserisci un numero.</span>
            </div>
            <div class="form-group">
              <label for="Comment">Commento</label>
              <textarea type="number" id="Comment" class="form-control" v-model="newVote.comment"></textarea>
            </div>
            <br>
            <span>Per me vince <toggle-button v-model="newVote.winner"
                                              :labels="{checked: 'Si', unchecked: 'No'}"
                                              :height="30"
                                              :width="55"
              />
            </span>
            <br>
            <input v-bind:disabled="$v.newVote.$invalid" type="submit" class="btn btn-primary" style="margin-top:10px" value="Vota!">
          </form>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="8" offset-lg="2">
        <b-progress
                    :variant="bar.variant"
                    :key="bar.variant"
                    :striped="bar.striped">
                    <b-progress-bar :value="totalSongVotes">
                      <div style="position:absolute;padding-left:3px">
                        Canzone: <strong>{{ (totalSongVotes / 10).toFixed(2) }}</strong>
                      </div>
                    </b-progress-bar>
        </b-progress>
        <br>
        <b-progress
                    :variant="bar.variant2"
                    :key="bar.variant2"
                    :striped="bar.striped">
                    <b-progress-bar :value="totalLookVotes">
                      <div style="position:absolute;padding-left:3px">
                        Look: <strong>{{ (totalLookVotes / 10).toFixed(2) }}</strong>
                      </div>
                    </b-progress-bar>
        </b-progress>
        <table class="table">
          <thead>
            <tr>
              <th width="40%" style="text-align:center">Utente</th>
              <th width="30%" style="text-align:center">Canzone</th>
              <th width="30%" style="text-align:center">Look</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(vote,index) in reverseFilteredVotes" :key="index">
              <td colspan="3" style="padding: 0">
                <table width="100%" style="border: 1px solid #666" class="table striped">
                  <tr style="background-color: #efefef">
                    <td width="40%" style="text-align:center">{{vote.winner ? '🏆' : ''}}{{vote.user.split('@')[0]}}</td>
                    <td width="30%" style="text-align:center">{{vote.song}}</td>
                    <td width="30%" style="text-align:center">{{vote.look}}</td>
                  </tr>
                  <tr>
                    <td colspan="3" style="text-align:left">
                      {{vote.comment}}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
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
        variant2: 'warning',
        striped: true
      },
      user: this.$firebase.auth().currentUser.email,
      id: this.$route.params.id,
      filteredVotes: null,
      nestedVotes: [],
      newVote: {
        song: '',
        look: '',
        comment: '',
        winner: false,
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
    this.activeSong = db.ref('/songs/' + this.id)
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
        if (this.id !== '-L4PpLpX1ZpYjLGbPX47') {
          let maxVotes = 2
          if (this.activeSong.young) {
            maxVotes = 1
          }
          return this._.filter(this.filteredVotes, {'user': this.user}).length < maxVotes
        } else {
          return false
        }
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
.progress-bar {
  color: #000;
  height: 30px;
  line-height: 30px;
  font-size: 15px;
  padding-left: 5px;
}

.form-group{
  margin-bottom: 0;
}

.form-group__message{
  color: red;
  font-size: 12px;
  margin-bottom: 5px;
}

form{
  max-width: 100%;
  width: 300px;
  margin: auto;
}

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
