
export default {
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
  contact(state, data) {
    state.contact = data
  },
  projects(state, data) {
    state.projects = data
  }
}
