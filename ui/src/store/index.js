import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

const token = localStorage.getItem('mishasite-user-token')
if (token) {
  console.log('token!!!')
  axios.defaults.headers.common['Authorization'] = token
}

export const store = new Vuex.Store({
  state: {
    contact: {},
    projects: [],
    loaded: false,
    login: {
      success: false,
      message: ''
    }
  },
  getters,
  actions,
  mutations
})
