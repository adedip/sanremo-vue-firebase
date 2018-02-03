import Vue from 'vue'
import Router from 'vue-router'

import Songs from '@/components/Songs'
import Song from '@/components/Song'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/songs/:id/:title/:author',
      name: 'Song',
      component: Song,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/songs',
      name: 'Songs',
      component: Songs,
      meta: {
        requiresAuth: true
      }
    }

  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser && to.path !== '/login') next('login')
  else if (!requiresAuth && currentUser) next('songs')
  else next()
})

export default router
