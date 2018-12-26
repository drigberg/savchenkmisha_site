
export default {
  dataLoaded(state) {
    state.loaded = true
  },
  loginFailure(state, { message }) {
    state.login.message = message
    state.login.success = false
  },
  loginSuccess(state) {
    state.loggedIn = true
    state.login.success = true
  },
  contact(state, data) {
    state.contact = data
  },
  header(state, data) {
    state.header = data
  },
  projects(state, data) {
    state.projects = data
  }
}
