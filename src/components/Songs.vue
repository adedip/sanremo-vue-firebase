<template>
  <div class="hello">
    <!-- FORM TO BE REMOVED -->
    <form id="form" class="form-inline" v-on:submit.prevent="addSong" style="display: none">
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
      <div class="form-group">
        <label for="songYoung">Giovani:</label>
        <input type="checkbox" id="songYoung" class="form-control" v-model="newSong.young">
      </div>
      <input type="submit" class="btn btn-primary" value="Add song">
    </form>
    <div>
      <p>ordina per:</p>
      <b-form-group>
        <b-form-radio-group buttons id="orderRadio" v-model="orderField" :options="orderOptions" name="radioOpenions">
        </b-form-radio-group>
      </b-form-group>
    </div>
    <b-row>
      <b-col offset-lg="4" lg="4">
        <b-form-group>
          <!-- <label for="songSearchForm">Cerca</label> -->
          <input id="songSearchForm" class="form-control" v-model.trim="songSearch" placeholder="cerca">
        </b-form-group>
      </b-col>
      <b-col lg="1" v-if="false">
        <toggle-button v-model="bigOnly"
                                              :labels="{checked: 'Big', unchecked: 'Giovani'}"
                                              :height="30"
                                              :width="75"
              />
      </b-col>
    </b-row>
    <ul>
      <li v-for="(song, index) in filteredSongList" :key="index" style="max-width: 220px; margin: 10px; vertical-aling:top">
        <div class="card" :class="{ 'young': song.young }">
          <h5 class="author">{{song.author}}</h5>
          <span class="thumbs" v-if="song.totalYes > 0"><span class="num">{{song.totalYes}}</span><span class="image">👍</span></span>
          <span class="thumbs" v-if="song.totalNo > 0"><span class="num">{{song.totalNo}}</span><span class="image">👎</span></span>
          <span :style="calcCupStyle(song.totalWinner)" class="cup" v-if="song.totalWinner > 0"><span class="num">{{song.totalWinner}}</span><span class="image">{{song.totalWinnerCup}}</span></span>
          <img class="card-img-top" :src="song.image_url" :alt="song.author" width="220"  height="220">
          <div class="card-block">
            <h4 class="card-title">{{song.title | ellipsed}}</h4>
            <p class="card-text">
              <b-progress
                          :variant="bar.variant"
                          :key="bar.variant"
                          :striped="bar.striped">
                          <b-progress-bar :value="song.totalSongVotes">
                            <div style="position:absolute;padding-left:3px">
                              Canzone: <strong>{{ (song.totalSongVotes / 10).toFixed(2) }}</strong>
                            </div>
                          </b-progress-bar>
              </b-progress>
              <b-progress
                          :variant="bar.variant2"
                          :key="bar.variant2"
                          :striped="bar.striped">
                          <b-progress-bar :value="song.totalLookVotes">
                            <div style="position:absolute;padding-left:3px">
                              Look: <strong>{{ (song.totalLookVotes / 10).toFixed(2) }}</strong>
                            </div>
                          </b-progress-bar>
              </b-progress>

              <b-progress v-if="!song.young"
                          :variant="bar.variant3"
                          :key="bar.variant3"
                          :striped="bar.striped">
                          <b-progress-bar :value="song.totalDuetVotes">
                            <div style="position:absolute;padding-left:3px">
                              Duetto: <strong>{{ (song.totalDuetVotes / 10).toFixed(2) }}</strong>
                            </div>
                          </b-progress-bar>
              </b-progress>
            </p>
            <router-link :to="{ name: 'Song', params: { id: song['.key'], title: song.title, author: song.author, image: song.image_url }}">
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
import {songsRef, totalVotes, totalWinners, totalYes, totalNo} from '../firebase'

export default {
  name: 'Songs',
  firebase: {
    songs: songsRef
  },
  data () {
    return {
      orderField: 'totalSongVotes',
      orderOptions: [
        { text: 'canzone', value: 'totalSongVotes' },
        { text: 'look', value: 'totalLookVotes' },
        { text: 'duetto', value: 'totalDuetVotes' }
      ],
      bar: {
        value: 80,
        variant: 'info',
        variant2: 'warning',
        variant3: 'success',
        striped: false
      },
      newSong: {
        title: '',
        author: '',
        image_url: '',
        young: false
      },
      songSearch: '',
      bigOnly: true
    }
  },
  mounted () {
    this.$loadingPanel.load()
  },
  computed: {
    isYoung: function (song) {
      return song.young ? 'young' : ''
    },
    songList: function () {
      const list = this.songs.map(song => {
        const votes = song.votes ? Object.values(song.votes) : []
        const total = totalVotes(votes, ['song', 'look', 'duet'])
        song.totalSongVotes = total.song
        song.totalLookVotes = total.look
        song.totalDuetVotes = total.duet
        song.totalYes = totalYes(votes)
        song.totalNo = totalNo(votes)
        song.totalWinner = totalWinners(votes) > 0 ? totalWinners(votes) : 0
        song.totalWinnerCup = totalWinners(votes) > 0 ? '🏆' : ''
        return song
      })

      this.$loadingPanel.hide()
      return this.orderBy(list, this.orderField)
    },
    filteredSongList: function () {
      let results = this.songList.filter(s => {
        return this.bigOnly ? (s === undefined || !s.young) : (s !== undefined && s.young)
      })

      if (this.songSearch !== '') {
        results = results.filter(song => {
          return song.author.toLowerCase().indexOf(this.songSearch.toLowerCase()) !== -1 || song.title.toLowerCase().indexOf(this.songSearch.toLowerCase()) !== -1
        })
      }

      return results
    }
  },
  filters: {
    ellipsed: function(str) {
      let n = 18
      return (str.length > n) ? str.substr(0, n - 1) + '...' : str
    }
  },
  methods: {
    calcCupStyle: function(val) {
      let size = 100 + val * 15
      return {
        'font-size': size + '%'
      }
    },
    orderBy: function(list, field) {
      return this._.chain(list).orderBy(field).reverse().value()
    },
    addSong: function () {
      this.$firebaseRefs.songs.push(this.newSong)
      this.newSong.title = ''
      this.newSong.author = ''
      this.newSong.image_url = ''
      this.newSong.young = false
    }
  }
}
</script>
<style>

#orderRadio label span span{
  margin-left: 3px;
}

</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.progress-bar {
  color: #000;
}

.card.young{
  background-color: #ECEFF1;
}

.card-title{
  padding-top: 5px;
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

.progress{
  margin: 5px auto;
}

.cup{
  position: absolute;
  bottom: 168px;
  right: 5px;
}

.thumbs{
  position: absolute;
  bottom: 168px;
  left: 5px;
}

.cup span.image, .thumbs span.image{
  margin-right: 10px;
}

.cup span.num, .thumbs span.num{
  color: red;
  font-size: 12px !important;
  line-height: 20px;
  background: #fff;
  height: 20px;
  width: 20px;
  border: 1px solid red;
  border-radius: 50%;
  position: absolute;
  top: -10px;
  right:0;
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
