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
          <img src="https://www.thesun.co.uk/wp-content/uploads/2017/12/af-eurovision-topic-desktop.jpg" style="max-width: 100%">
          <router-view></router-view>
        </b-col>
      </b-row>
    </b-container>
    <loading-panel></loading-panel>
    <notifications></notifications>
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
        this.isLogged = false
        this.$router.replace('login')
      })
    }
  }
}
</script>

<style src="vue-notifyjs/themes/default.css"></style>
