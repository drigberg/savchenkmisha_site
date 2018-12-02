import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import login from '@/components/login'
import admin from '@/components/admin'

Vue.use(Router)

function guard (condition, failurePath) {
  return (to, from, next) => {
    if (condition()) {
      next()
    } else {
      next(failurePath)
    }
  }
}

const isAuthenticated = () => localStorage.getItem('mishasite-user-token')
const notAuthenticated = () => !localStorage.getItem('mishasite-user-token')

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      beforeEnter: guard(notAuthenticated, '/admin')
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin,
      beforeEnter: guard(isAuthenticated, '/login')
    }
  ]
})
