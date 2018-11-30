import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

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
    login({ commit }, { username, password }) {
      console.log('posting!!!', username, password)
      axios
        .post("/api/login", {
          username,
          password
        })
        .then(response => {
          const token = response.data.token;
          if (!token) {
            commit('loginFailure', {
              message: response.message || "Login failed, sry brah"
            })
            return
          }

          localStorage.setItem("mishasite-user-token", token);
          axios.defaults.headers.common["Authorization"] = token;
          commit('loginSuccess')
        })
        .catch(err => {
          localStorage.removeItem("mishasite-user-token");
          commit('loginFailure', {
            message: 'Login failed, sry br'
          })
        });
    }
  },
  mutations: {
    loginFailure(state, { message }) {
      state.login.message = message
      state.login.success = false
    },
    loginSuccess(state) {
      state.login.success = true
    },
    updateContact(state, data) {
      state.contact = data
    },
    updateProjects(state, data) {
      state.projects = data
    },
  }
})
