
export default {
  banner(state, data) {
    state.banner = data
  },
  contact(state, data) {
    state.contact = {
      email: data.email,
      linkedin: data.linkedin,
      github: data.github
    }
  },
  dataLoaded(state) {
    state.loaded = true
  },
  flashMessage(state, data) {
    const id = Math.random().toString()

    state.flash.message = data.message
    state.flash.page = data.page
    state.flash.id = id

    setTimeout(() => {
      if (state.flash.id === id) {
        state.flash.message = ''
        state.flash.page = ''
      }
    }, 5000)
  },
  loginSuccess(state) {
    state.loggedIn = true
  },
  logoutSuccess(state) {
    state.loggedIn = false
  },
  projects(state, data) {
    state.projects = data
  },
  setActiveProject(state, index) {
    state.activeProject = index
  }
}
