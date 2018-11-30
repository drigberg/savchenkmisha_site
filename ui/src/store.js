import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const token = localStorage.getItem('mishasite-user-token')
if (token) {
  axios.defaults.headers.common['Authorization'] = token
}

export const store = new Vuex.Store({
  state: {
    contact: {},
    projects: [],
    login: {
      success: false,
      message: "",
    }
  },
  actions: {
    async loadData({ commit }) {
      commit("updateContact", await axios.get("/api/contact"))
      commit("updateProjects", await axios.get("/api/projects"))
    },
    async login({ commit }, { username, password }) {
      console.log('posting!!!', username, password)
      try {
        const { data } = await axios
          .post("/api/login", {
            username,
            password
          })

        const token = data.token;
        if (!token) {
          commit('loginFailure', {
            message: data.message || "Login failed, sry brah"
          })
          return
        }

        localStorage.setItem("mishasite-user-token", token);
        axios.defaults.headers.common["Authorization"] = token;
        commit('loginSuccess')
      } catch (err) {
        localStorage.removeItem("mishasite-user-token");
        commit('loginFailure', {
          message: 'Login failed, sry brah'
        })
      }
    },
  },
  mutations: {
    loginFailure(state, { message }) {
      state.login.message = message
      state.login.success = false
    },
    loginSuccess(state) {
      state.login.success = true
    },
    updateContact(state, { data }) {
      state.contact = data
    },
    updateProjects(state, { data }) {
      state.projects = data
    },
  }
})
