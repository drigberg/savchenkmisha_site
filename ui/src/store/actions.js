import axios from 'axios'

export default {
  async loadData({ commit }) {
    const [contact, projects, banner] = await Promise.all([
      axios.get('/api/contact').then(({ data }) => data),
      axios.get('/api/projects').then(({ data }) => data),
      axios.get('/api/banner').then(({ data }) => data)
    ])

    commit('contact', contact)
    commit('projects', projects)
    commit('banner', banner)

    commit('dataLoaded')
  },
  async login({ commit }, { username, password }) {
    try {
      const { data } = await axios
        .post('/api/login', {
          username,
          password
        })

      if (!data.success) {
        commit('flashMessage', {
          message: 'Invalid username/password combo, brah',
          page: '*'
        })
        return
      }

      commit('loginSuccess')
      commit('flashMessage', {
        message: 'Welcome, site owner!',
        page: '*'
      })
    } catch (err) {
      commit('flashMessage', {
        message: `Error logging in: ${err.message}`,
        page: '*'
      })
    }
  },
  async updateContact({ commit }, payload) {
    try {
      const { data } = await axios.post('/api/contact', payload)
      commit('contact', data)
      commit('flashMessage', {
        message: 'Contact info updated!',
        page: '*'
      })
    } catch (err) {
      commit('flashMessage', {
        message: `Error updating contact info: ${err.message}`,
        page: '*'
      })
    }
  },
  async updateBanner({ commit }, payload) {
    try {
      const { data } = await axios.post('/api/banner', payload)
      commit('banner', data)
      commit('flashMessage', {
        message: 'Banner info updated!',
        page: '*'
      })
    } catch (err) {
      commit('flashMessage', {
        message: `Error updating banner: ${err.message}`,
        page: '*'
      })
    }
  },
  async updateCredentials({ commit }, payload) {
    try {
      await axios.post('/api/change_credentials', payload)

      commit('flashMessage', {
        message: 'Credentials updated!',
        page: '*'
      })
    } catch (err) {
      commit('flashMessage', {
        message: `Error updating credentials: ${err.message}`,
        page: '*'
      })
    }
  }
}
