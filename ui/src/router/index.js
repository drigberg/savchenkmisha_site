import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import login from '@/components/login'
import admin from '@/components/admin'

Vue.use(Router)

const ifAuthenticated = (to, from, next) => {
  if (localStorage.getItem('mishasite-user-token')) {
    next()
    return
  }
  next('/login')
}

const ifNotAuthenticated = (to, from, next) => {
  if (!localStorage.getItem('mishasite-user-token')) {
    next()
    return
  }

  next('/admin')
}

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
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin,
      beforeEnter: ifAuthenticated,
    },
  ]
})
