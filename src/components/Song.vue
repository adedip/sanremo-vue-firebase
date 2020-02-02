<template>
  <div class="hello">
    <router-link :to="{ name: 'Songs'}"><button class="btn btn-secondary">Classifica</button></router-link>
    <br>
    <br>
    <b-row>
      <b-col lg="8" offset-lg="2">
        <!-- <div class="jumbotron" :style="'background: url('+$route.params.image+'); background-size: cover'"> -->
        <div class="jumbotron">
          <div class="vote-container">
            <h1>{{ $route.params.title }}</h1>
            <h3>{{ $route.params.author }}</h3>
            <form id="form" v-on:submit.prevent="addVote" v-if="voted"> <!-- voted -->
              <div class="form-group">
                <label for="songVote">Canzone</label>
                <vue-slider v-model="newVote.song" :max=10 :dot-size=25></vue-slider>
                <!-- <input type="number" id="songVote" class="form-control" v-model.trim.number="newVote.song" @input="$v.newVote.song.$touch()"> -->
              </div>
              <div v-if="$v.newVote.song.$error">
                <span class="form-group__message" v-if="!$v.newVote.song.required">Obbligatorio</span><span class="form-group__message" v-if="!$v.newVote.song.numeric">Inserisci un numero.</span>
              </div>
              <div class="form-group">
                <label for="lookVote">Look</label>
                <vue-slider v-model="newVote.look" :max=10 :dot-size=25></vue-slider>
                <!-- <input type="number" id="lookVote" class="form-control" v-model.trim.number="newVote.look" @input="$v.newVote.look.$touch()"> -->
              </div>
              <div v-if="$v.newVote.look.$error">
                <span class="form-group__message" v-if="!$v.newVote.look.required">Obbligatorio</span><span class="form-group__message" v-if="!$v.newVote.look.numeric">Inserisci un numero.</span>
              </div>
              <div class="form-group">
                <label for="duetVote">Ospite duetto</label>
                <vue-slider v-model="newVote.duet" :max=10 :dot-size=25></vue-slider>
                <!-- <input type="number" id="duetVote" class="form-control" v-model.trim.number="newVote.duet" @input="$v.newVote.duet.$touch()"> -->
              </div>
              <div v-if="$v.newVote.duet.$error">
                <span class="form-group__message" v-if="!$v.newVote.duet.numeric">Inserisci un numero.</span>
              </div>
              <br>
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
        <br>
        <b-progress
                    :variant="bar.variant3"
                    :key="bar.variant3"
                    :striped="bar.striped">
                    <b-progress-bar :value="totalDuetVotes">
                      <div style="position:absolute;padding-left:3px">
                        Duetto: <strong>{{ (totalDuetVotes / 10).toFixed(2) }}</strong>
                      </div>
                    </b-progress-bar>
        </b-progress>
        <table class="table">
          <thead>
            <tr>
              <th width="40%" style="text-align:center">Utente</th>
              <th width="20%" style="text-align:center">Canzone</th>
              <th width="20%" style="text-align:center">Look</th>
              <th width="20%" style="text-align:center">Duetto</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(vote,index) in reverseFilteredVotes" :key="index">
              <td colspan="4" style="padding: 0">
                <table width="100%" style="border: 1px solid #666" class="table striped">
                  <tr style="background-color: #efefef">
                    <td width="40%" style="text-align:center">{{vote.winner ? '🏆' : ''}}{{vote.user.split('@')[0]}}</td>
                    <td width="20%" style="text-align:center">{{vote.song}}</td>
                    <td width="20%" style="text-align:center">{{vote.look}}</td>
                    <td width="20%" style="text-align:center">{{vote.duet}}</td>
                  </tr>
                  <tr>
                    <td colspan="4" style="text-align:left;word-break:break-word;">
                      <small style="float:right; color:#999"><i>[{{vote.created_at | toDate}}]</i></small>{{vote.comment}}
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
import { required, numeric } from 'vuelidate/lib/validators'
import vueSlider from 'vue-slider-component'

export default {
  components: {
    vueSlider
  },
  name: 'Song',
  data () {
    return {
      bar: {
        value: 80,
        variant: 'info',
        variant2: 'warning',
        variant3: 'success',
        striped: true
      },
      user: this.$firebase.auth().currentUser.email,
      id: this.$route.params.id,
      filteredVotes: null,
      nestedVotes: [],
      newVote: {
        song: 0,
        look: 0,
        duet: 0,
        comment: '',
        winner: false,
        user: this.$firebase.auth().currentUser.email,
        user_id: this.$firebase.auth().currentUser.uid,
        created_at: Date.now()
      }
    }
  },
  validations: {
    newVote: {
      song: {
        required,
        numeric
      },
      look: {
        required,
        numeric
      },
      duet: {
        numeric
      }
    }
  },
  created () {
    this.nestedVotes = db.ref('/songs/' + this.id + '/votes')
    this.activeSong = db.ref('/songs/' + this.id)
    this.$bindAsArray('filteredVotes', this.nestedVotes.orderByChild('created_at'))
  },
  mounted () {
    this.$loadingPanel.load()
  },
  watch: {
    reverseFilteredVotes: function(newVal, old) {
      if (newVal.length > 0) {
        this.$loadingPanel.hide()
      }

      if (this._.filter(this.filteredVotes, {'user': this.user}).length === 0) {
        this.$loadingPanel.hide()
      }
    }
  },
  computed: {
    reverseFilteredVotes () {
      if (this.filteredVotes == null) {
        return []
      }
      return this.filteredVotes.slice().reverse()
    },
    voted () {
      if (this.filteredVotes != null) {
        let timeNow = new Date()
        let userVotes = this._.filter(this.filteredVotes, {'user': this.user})
        if (userVotes.length === 0) {
          return true
        } else {
          return this._.last(userVotes).created_at < (timeNow.valueOf() - 21600000)
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
    },
    totalDuetVotes () {
      if (this.filteredVotes == null) {
        return 0
      }
      const duetVotes = this._.filter(this.filteredVotes, function(o) { return o.duet !== '' && o.duet >= 0 })
      const total = duetVotes.length * 10
      const totalDuetVotes = 100 * this._.sumBy(duetVotes, 'duet') / total
      return isNaN(totalDuetVotes) ? 0 : totalDuetVotes
    }
  },
  filters: {
    toDate: function(timestamp) {
      let d = new Date(timestamp)
      return d.toLocaleString()
    }
  },
  methods: {
    addVote: function () {
      this.newVote.song = parseInt(this.newVote.song)
      this.newVote.look = parseInt(this.newVote.look)
      if (this.newVote.duetto) {
        this.newVote.duetto = parseInt(this.newVote.duetto)
      }
      // this.nestedVotes.push(this.newVote)
      this.nestedVotes.push().set(this.newVote, (err) => {
        if (err) {
          console.log(err)
          this.$notify({
            message: 'Errore durante il salvataggio del voto',
            timeout: 2000,
            horizontalAlign: 'center',
            verticalAlign: 'top',
            type: 'warning'
          })
        } else {
          this.newVote.song = 0
          this.newVote.look = 0
          this.newVote.duet = 0
          this.newVote.comment = ''
          this.$notify({
            message: 'Perché Sanremo è Sanremo!',
            timeout: 2000,
            horizontalAlign: 'center',
            verticalAlign: 'top',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.vote-container{
  background: rgba(250,250,250,0.8);
  border-radius: 20px;
  padding: 20px;
  max-width: 100%;
  width: 400px;
  margin: auto;
}

.vue-slider-component{
  margin-top: 25px;
}

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
