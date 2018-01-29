<template>
  <div class="hello">
    <form id="form" class="form-inline" v-on:submit.prevent="addSong">
      <div class="form-group">
        <label for="songTitle">Title:</label>
        <input type="text" id="songTitle" class="form-control" v-model="newSong.title">
      </div>
      <div class="form-group">
        <label for="songAuthor">Author:</label>
        <input type="text" id="songAuthor" class="form-control" v-model="newSong.author">
      </div>
      <input type="submit" class="btn btn-primary" value="Add song">
    </form>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(song,index) in songs" :key="index">
          <td><router-link :to="{ name: 'Song', params: { id: song['.key'], title: song.title }}">{{song.title}}</router-link></td>
          <td>{{song.author}}</td>
        </tr>
      </tbody>
    </table>
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
        author: ''
      }
    }
  },
  methods: {
    addSong: function () {
      this.$firebaseRefs.songs.push(this.newSong)
      this.newSong.title = ''
      this.newSong.author = ''
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
