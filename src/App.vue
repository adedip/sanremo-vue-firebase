<template>
  <b-container>
    <b-jumbotron header="Sanremo 2018"
                 lead="...perché Sanremo è Sanremo"
    >
      <div id="app">
        <img src="./assets/logo.png">
        <button v-on:click="logout">logout</button>
        <pre>{{this.user ? this.user.email : ''}}</pre>
        <router-view></router-view>
      </div>
    </b-jumbotron>
  </b-container>
</template>

<script>
export default {
  name: 'App',
  data: function () {
    return {
      user: this.$firebase.auth().currentUser
    }
  },
  methods: {
    logout: function () {
      this.$firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
