<template>
  <div id="app">
    <b-container fluid>
      <b-row type="dark" variant="light" v-if="isLogged">
        <b-col lg="8"></b-col>
        <b-col>{{user.email}}</b-col>
        <b-col><a href="#" v-on:click="logout">logout</a></b-col>
      </b-row>
      <b-row class="text-center">
        <b-col>
          <img src="./assets/logo.png" style="max-width: 100%">
          <router-view></router-view>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: function () {
    return {
      isLogged: false,
      user: this.$firebase.auth().currentUser
    }
  },
  mounted () {
    this.isLogged = this.user != null
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
</style>
