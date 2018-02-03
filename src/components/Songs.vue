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
    <ul>
        <li v-for="(song,index) in songs" :key="index" style="width:200px; min-height:200px;margin: 10px; vertical-aling:top">
          <router-link :to="{ name: 'Song', params: { id: song['.key'], title: song.title, author: song.author }}">
            <img :src="song.image_url" style="border-radius: 50%" height="150" width="150" />
            <br>{{song.title}}
          </router-link>
        </li>
    </ul>
  </div>
</template>

<script>
import {songsRef} from '../firebase'

export default {
  name: 'Songs',
  firebase: {
    songs: songsRef
  },
  data () {
    return {
      newSong: {
        title: '',
        author: '',
        image_url: ''
      }
    }
  },
  methods: {
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
