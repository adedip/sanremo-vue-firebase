<template>
  <div id="app">
    <b-navbar type="dark" variant="light">
      <b-navbar-brand href="#">Sanremo 2018</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item v-if="isLogged" href="#" disabled>{{user.email}}</b-nav-item>
        <b-nav-item v-on:click="logout" v-if="isLogged">logout</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <b-container fluid>

      <b-row class="text-center">
        <b-col>
          <img src="./assets/logo.png" style="max-width: 100%">
          <pre>{{this.user ? this.user.email : ''}}</pre>
          <button v-on:click="logout" v-if="isLogged">logout</button>
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
      user: this.$firebase.auth().currentUser
    }
  },
  computed: {
    isLogged() {
      return this.user != null
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
</style>
