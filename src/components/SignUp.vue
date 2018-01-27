<template>
  <div class="sign-up">
    <h3>Registrati</h3>
    <input type="text" v-model="email" placeholder="Email"><br>
    <input type="password" v-model="password" placeholder="Password"><br>
    <button v-on:click='signUp'>registrati</button>
    <p>oppure torna al <router-link to='/login'>login</router-link></p>
  </div>
</template>

<script>
  import firebase from 'firebase'

  export default {
    name: 'signUp',
    data: function() {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      signUp: function() {
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
          (user) => {
            this.$router.replace('hello')
          },
          (err) => {
            alert('Ops... '+ err.message)
          }
        )
      }
    }
  }
</script>

<style scoped>

</style>
