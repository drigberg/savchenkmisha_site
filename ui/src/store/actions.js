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

      const token = data.token
      if (!token) {
        commit('loginFailure', {
          message: data.message || 'Login failed, sry brah'
        })
        return
      }

      localStorage.setItem('mishasite-user-token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      commit('loginSuccess')
    } catch (err) {
      localStorage.removeItem('mishasite-user-token')
      commit('loginFailure', {
        message: 'Login failed, sry brah'
      })
    }
  },
  async updateContact({ commit }, payload) {
    try {
      const { data } = await axios
        .post('/api/contact', payload)
      commit('contact', data)
      console.log('updated contact!')
    } catch (err) {
      console.log('error updating contact!', err.message)
    }
  }
}
