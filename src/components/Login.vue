<template>
  <div class="login">
    <h3>Login</h3>
    <b-row>
      <b-col lg="5"></b-col>
      <b-col lg="2" align-h="start">
        <b-form>
          <b-form-group id="exampleInputGroup1"
                        label="Email:"
                        label-for="exampleInput1">
            <b-form-input id="exampleInput1"
                          type="email"
                          v-model="email"
                          required
                          placeholder="Email">
            </b-form-input>
          </b-form-group>
          <b-form-group id="exampleInputGroup2"
                        label="Password:"
                        label-for="exampleInput2">
            <b-form-input id="exampleInput2"
                          type="password"
                          v-model="password"
                          required
                          placeholder="Password">
            </b-form-input>
          </b-form-group>
          <b-button type="button" variant="primary" v-on:click='login'>Entra</b-button>
          <br>
          <router-link to='/reset-password'>reset password</router-link>
          <br>
          <router-link to='/sign-up'>registrati</router-link>
        </b-form>
      </b-col>
    </b-row>
    <!-- <input type="text" v-model="email" placeholder="Email"><br>
    <input type="password" v-model="password" placeholder="Password"><br>
    <button v-on:click='login'>vai</button>
    <p>oppure <router-link to='/sign-up'>registrati</router-link></p> -->
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

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
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          this.user = user
          this.isLogged = true
          this.$router.replace('songs')
        }).catch(err => {
          console.log(err)
          this.$notify({
            message: 'Username o password errate',
            timeout: 2000,
            horizontalAlign: 'center',
            verticalAlign: 'top',
            type: 'warning'
          })
        })
    }
  }
}
</script>

<style scoped>

</style>
