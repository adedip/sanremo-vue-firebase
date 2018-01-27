// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false

let app;
// Initialize Firebase
let config = {
  apiKey: "AIzaSyC1T8rzAevGQeisRzkuis55T-LpYHci1IY",
  authDomain: "fir-tutorial-45864.firebaseapp.com",
  databaseURL: "https://fir-tutorial-45864.firebaseio.com",
  projectId: "fir-tutorial-45864",
  storageBucket: "",
  messagingSenderId: "703240000781"
}

firebase.initializeApp(config)
firebase.auth().onAuthStateChanged(function(user){
  if(!app){
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    })

  }
})
