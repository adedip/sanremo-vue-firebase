<template>
  <div class="hello">
    <!-- FORM TO BE REMOVED -->
    <form id="form" class="form-inline" v-on:submit.prevent="addSong">
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
      <b-form-group label="Ordinamento">
        <b-form-radio-group buttons id="orderRadio" v-model="orderField" :options="orderOptions" name="radioOpenions">
        </b-form-radio-group>
      </b-form-group>
    </div>
    <ul>
      <li v-for="(song, index) in songList" :key="index" style="width:200px; min-height:200px;margin: 10px; vertical-aling:top">
        <router-link :to="{ name: 'Song', params: { id: song['.key'], title: song.title, author: song.author }}">
          <img :src="song.image_url" style="border-radius: 50%" height="150" width="150" />
          <br>{{song.title}}
        </router-link>
        <div>
          Canzone: {{song.totalSongVotes}}<br>
            <b-progress :value="song.totalSongVotes"
                        :variant="bar.variant"
                        :key="bar.variant"
                        :striped="bar.striped">
            </b-progress>
            <br>
            Look: {{song.totalLookVotes}}<br>
            <b-progress :value="song.totalLookVotes"
                        :variant="bar.variant"
                        :key="bar.variant2"
                        :striped="bar.striped">
            </b-progress>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {songsRef, totalVotes} from '../firebase'

export default {
  name: 'Songs',
  firebase: {
    songs: songsRef
  },
  data () {
    return {
      orderField: 'totalSongVotes',
      orderOptions: [
        { text: 'Ordina per canzone', value: 'totalSongVotes' },
        { text: 'Ordina per look', value: 'totalLookVotes' }
      ],
      bar: {
        value: 80,
        variant: 'info',
        variant2: 'success',
        striped: true
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
        const total = totalVotes(votes, ['song', 'look'])
        song.totalSongVotes = total.song
        song.totalLookVotes = total.look

        return song
      })

      return this.orderBy(list, this.orderField)
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
