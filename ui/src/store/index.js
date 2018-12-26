import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const [csrfElement] = document.getElementsByName('csrf')
const [loginElement] = document.getElementsByName('loggedIn')

axios.defaults.headers.common['csrf'] = csrfElement ? csrfElement.content : null

export const store = new Vuex.Store({
  state: {
    contact: {},
    header: {},
    projects: [],
    loaded: false,
    loggedIn: loginElement ? loginElement.content : false,
    login: {
      success: null,
      message: ''
    }
  },
  actions,
  mutations
})
