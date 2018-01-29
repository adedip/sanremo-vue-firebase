<template>
  <div class="login">
    <h3>Login</h3>
    <input type="text" v-model="email" placeholder="Email"><br>
    <input type="password" v-model="password" placeholder="Password"><br>
    <button v-on:click='login'>vai</button>
    <p>oppure <router-link to='/sign-up'>registrati</router-link></p>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'login',
  data: function() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login: function() {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          this.$user = user
          this.$router.replace('songs')
        },
        (err) => {
          alert(err)
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
