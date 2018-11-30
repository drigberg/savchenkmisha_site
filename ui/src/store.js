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
    loaded: false,
    login: {
      success: false,
      message: "",
    }
  },
  actions: {
    async loadData({ commit }) {
      const [contact, projects] = await Promise.all([axios.get("/api/contact"), axios.get("/api/projects")])

      commit("updateContact", contact)
      commit("updateProjects", projects)
      commit("dataLoaded")
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
    dataLoaded(state) {
      state.loaded = true
    },
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
