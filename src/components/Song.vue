<template>
  <div class="hello">
    <router-link :to="{ name: 'Songs'}">all songs</router-link>
    <h1>{{ $route.params.title }} - {{this.user}}</h1>
    <form id="form" class="form-inline" v-on:submit.prevent="addVote">
      <div class="form-group">
        <label for="songVote">Song:</label>
        <input type="text" id="songVote" class="form-control" v-model="newVote.song">
      </div>
      <div class="form-group">
        <label for="lookVote">Look:</label>
        <input type="text" id="lookVote" class="form-control" v-model="newVote.look">
      </div>
      <input type="submit" class="btn btn-primary" value="Add vote">
    </form>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Song</th>
          <th>Look</th>
          <th>User</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(vote,index) in votes" :key="index">
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

export default {
  name: 'Song',
  firebase: {
    song: db.ref('/songs/' + this.id),
    votes: db.ref('/votes').orderByChild('id') // .equalTo(this.$route.params.id) //'-L41jlZg95DlHAKRkHnG'
  },
  data () {
    return {
      user: this.$firebase.auth().currentUser.email,
      id: this.$route.params.id,
      newVote: {
        song: '',
        look: '',
        user: this.$firebase.auth().currentUser.email,
        id: this.$route.params.id
      }
    }
  },
  methods: {
    addVote: function () {
      this.$firebaseRefs.votes.push(this.newVote)
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
