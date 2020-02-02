<template>
  <div class="reset-password">
    <h3>Reset password</h3>
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
          <b-button type="button" variant="primary" v-on:click='resetPassword'>Reset password</b-button>
          <br>
          <router-link to='/login'>vai al login</router-link>
        </b-form>
      </b-col>
    </b-row>
    <!-- <input type="text" v-model="email" placeholder="Email"><br>
    <input type="password" v-model="password" placeholder="Password"><br>
    <button v-on:click='resetPassword'>registrati</button>
    <p>oppure torna al <router-link to='/login'>login</router-link></p> -->
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

export default {
  name: 'ResetPassword',
  data: function() {
    return {
      email: ''
    }
  },
  methods: {
    resetPassword: function() {
      var auth = firebase.auth()
      return auth.sendPasswordResetEmail(this.email.trim())
        .then(() => {
          console.log('email sent')
          this.$router.replace('login')
        })
        .catch((error) => {
          console.log(error)
          this.$notify({
            message: 'Email non valida',
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
