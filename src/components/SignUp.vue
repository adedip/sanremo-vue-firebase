<template>
  <div class="sign-up">
    <h3>Registrati</h3>
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
          <b-button type="button" variant="primary" v-on:click='signUp'>Registrati</b-button>
          <router-link to='/login'>vai al login</router-link>
        </b-form>
      </b-col>
    </b-row>
    <!-- <input type="text" v-model="email" placeholder="Email"><br>
    <input type="password" v-model="password" placeholder="Password"><br>
    <button v-on:click='signUp'>registrati</button>
    <p>oppure torna al <router-link to='/login'>login</router-link></p> -->
  </div>
</template>

<script>
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
      this.$firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          this.$router.replace('login')
        },
        (err) => {
          console.log('Ops... ' + err.message)
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
