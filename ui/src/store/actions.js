import axios from 'axios'

export default {
  async loadData({ commit }) {
    const [contact, projects] = await Promise.all([axios.get('/api/contact').then(({ data }) => data), axios.get('/api/projects').then(({ data }) => data)])

    commit('contact', contact)
    commit('projects', projects)
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
        commit('loginFailure', {
          message: data.message || 'Invalid username/password combo, brah'
        })
        return
      }

      commit('loginSuccess')
    } catch (err) {
      commit('loginFailure', {
        message: 'Login failed due to a server err, yo'
      })
    }
  },
  async updateContact({ commit }, payload) {
    try {
      const { data } = await axios.post('/api/contact', payload)
      commit('contact', data)
      console.log('updated contact!')
    } catch (err) {
      console.log('error updating contact!', err.message)
    }
  },
  async updateCredentials(_ctx, payload) {
    try {
      await axios.post('/api/change_credentials', payload)

      console.log('updated credentials!')
    } catch (err) {
      console.log('error updating credentials!', err.message)
    }
  }
}
