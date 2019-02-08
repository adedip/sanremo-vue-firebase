<template>
  <div id="app">
    <b-container fluid>
      <b-row type="dark" variant="light" v-if="isLogged">
        <b-col lg="8"></b-col>
        <b-col>{{user.email}}</b-col>
        <b-col><a href="#" v-on:click="logout">logout</a></b-col>
      </b-row>
      <b-row class="text-center logo-bg">
      </b-row>
      <b-row class="text-center">
        <b-col>
          <router-view></router-view>
        </b-col>
      </b-row>
    </b-container>
    <loading-panel></loading-panel>
    <notifications></notifications>
  </div>
</template>

<script>
import {messaging} from './firebase'

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
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken().then(function(currentToken) {
      if (currentToken) {
        sendTokenToServer(currentToken)
        updateUIForPushEnabled(currentToken)
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.')
        messaging.requestPermission().then(function() {
          console.log('Notification permission granted.')
          // TODO(developer): Retrieve an Instance ID token for use with FCM.
          // ...
        }).catch(function(err) {
          console.log('Unable to get permission to notify.', err)
        })
        // Show permission UI.
        updateUIForPushPermissionRequired()
        setTokenSentToServer(false)
      }
    }).catch(function(err) {
      console.log('An error occurred while retrieving token. ', err)
      showToken('Error retrieving Instance ID token. ', err)
      setTokenSentToServer(false)
    });
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
<style>

  .logo-bg{
    background: url("./assets/sanremo-bg.png");
    background-position: center center;
    background-size: cover;
    height: 330px;
    display: block;
    margin-bottom: 20px;
  }

  @media screen and (max-width: 400px) {
    .logo-bg{
      max-height: 200px;
    }
  }

</style>
