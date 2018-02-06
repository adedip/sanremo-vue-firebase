<template>
  <div class="hello">
    <!-- FORM TO BE REMOVED -->
    <form id="form" class="form-inline" v-on:submit.prevent="addSong" style="display:none">
      <div class="form-group">
        <label for="songTitle">Title:</label>
        <input type="text" id="songTitle" class="form-control" v-model="newSong.title">
      </div>
      <div class="form-group">
        <label for="songAuthor">Author:</label>
        <input type="text" id="songAuthor" class="form-control" v-model="newSong.author">
      </div>
      <div class="form-group">
        <label for="songImage">Image:</label>
        <input type="text" id="songImage" class="form-control" v-model="newSong.image_url">
      </div>
      <input type="submit" class="btn btn-primary" value="Add song">
    </form>
    <br><br>
    <div>
      <b-form-group>
        <b-form-radio-group buttons id="orderRadio" v-model="orderField" :options="orderOptions" name="radioOpenions">
        </b-form-radio-group>
      </b-form-group>
    </div>
    <ul>
      <li v-for="(song, index) in songList" :key="index" style="max-width: 220px; margin: 10px; vertical-aling:top">
        <div class="card">
          <h5 class="author">{{song.author}}</h5>
          <img class="card-img-top" :src="song.image_url" :alt="song.author" width="220"  height="220">
          <div class="card-block">
            <p>
              {{song.totalWinner}}
            </p>
            <h4 class="card-title">{{song.title | ellipsed}}</h4>
            <p class="card-text">
              <br>
              <b-progress
                          :variant="bar.variant"
                          :key="bar.variant"
                          :striped="bar.striped">
                          <b-progress-bar :value="song.totalSongVotes">
                            <div style="position:absolute;padding-left:3px">
                              Canzone: <strong>{{ song.totalSongVotes / 10 }}</strong>
                            </div>
                          </b-progress-bar>
              </b-progress>
              <br>
              <b-progress
                          :variant="bar.variant2"
                          :key="bar.variant2"
                          :striped="bar.striped">
                          <b-progress-bar :value="song.totalLookVotes">
                            <div style="position:absolute;padding-left:3px">
                              Look: <strong>{{ song.totalLookVotes / 10 }}</strong>
                            </div>
                          </b-progress-bar>
              </b-progress>
            </p>
            <router-link :to="{ name: 'Song', params: { id: song['.key'], title: song.title, author: song.author }}">
              <button class="btn btn-secondary">Vota</button>
            </router-link>

          </div>
        </div>
        <!-- <router-link :to="{ name: 'Song', params: { id: song['.key'], title: song.title, author: song.author }}">
          <img :src="song.image_url" style="border-radius: 50%" height="150" width="150" />
          <br>{{song.title}}
        </router-link> -->
      </li>
    </ul>
  </div>
</template>

<script>
import {songsRef, totalVotes, totalWinners} from '../firebase'

export default {
  name: 'Songs',
  firebase: {
    songs: songsRef
  },
  data () {
    return {
      orderField: 'totalSongVotes',
      orderOptions: [
        { text: 'Classifica canzone', value: 'totalSongVotes' },
        { text: 'Classifica look', value: 'totalLookVotes' }
      ],
      bar: {
        value: 80,
        variant: 'info',
        variant2: 'warning',
        striped: false
      },
      newSong: {
        title: '',
        author: '',
        image_url: ''
      }
    }
  },
  computed: {
    songList: function () {
      const list = this.songs.map(song => {
        const votes = song.votes ? Object.values(song.votes) : []
        const total = totalVotes(votes, ['song', 'look', 'winner'])
        song.totalSongVotes = total.song
        song.totalLookVotes = total.look
        song.totalWinner = '🏆'.repeat(totalWinners(votes))
        return song
      })

      return this.orderBy(list, this.orderField)
    }
  },
  filters: {
    ellipsed: function(str) {
      let n = 18
      return (str.length > n) ? str.substr(0, n - 1) + '...' : str
    }
  },
  methods: {
    orderBy: function(list, field) {
      return this._.chain(list).orderBy(field).reverse().value()
    },
    addSong: function () {
      this.$firebaseRefs.songs.push(this.newSong)
      this.newSong.title = ''
      this.newSong.author = ''
      this.newSong.image_url = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.progress-bar {
  color: #000;
}

.card-block {
  padding-top: 0;
}

.card-img-top {
    width: 100%;
    height: 15vw;
    object-fit: cover;
}

.card-img-top{
  height: 220px !important
}

h1, h2 {
  font-weight: normal;
}

h4{
  font-size: 1.1rem !important;
}

h5.author{
  width: 100%;
  font-size: 1.1rem !important;
  text-align: center;
  position: absolute;
  color: #fff;
  padding: 5px;
  background: rgba(0,0,0,0.4);
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
