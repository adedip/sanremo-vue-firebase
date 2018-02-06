// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'
import VueFire from 'vuefire'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import lodash from 'lodash'
import VueLodash from 'vue-lodash'
import Vuelidate from 'vuelidate'
import 'babel-polyfill'
import ToggleButton from 'vue-js-toggle-button'

Vue.use(ToggleButton)
Vue.use(VueLodash, lodash)
Vue.use(Vuelidate)

Vue.use(BootstrapVue)
Vue.use(VueFire)
Vue.config.productionTip = false
Vue.prototype.$firebase = firebase

let app

firebase.auth().onAuthStateChanged(function (user) {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    })
  }
})
