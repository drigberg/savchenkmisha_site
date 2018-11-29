import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import projects from '@/components/projects'
import about from '@/components/about'
import contact from '@/components/contact'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/projects',
      name: 'projects',
      component: projects
    },
    {
      path: '/about',
      name: 'about',
      component: about
    },
    {
      path: '/contact',
      name: 'contact',
      component: contact
    }
  ]
})
