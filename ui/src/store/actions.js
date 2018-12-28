import axios from 'axios'
import router from '../router'

function getMessageFromError(err) {
  return err && err.response && err.response.data && err.response.data.message
}

async function loadData({ commit }) {
  const [contact, projects, banner] = await Promise.all([
    axios.get('/api/contact').then(({ data }) => data),
    axios.get('/api/projects').then(({ data }) => data),
    axios.get('/api/banner').then(({ data }) => data)
  ])

  commit('contact', contact)
  commit('projects', projects)
  commit('banner', banner)
  commit('dataLoaded')
}
async function resetPassword({ commit }, { username }) {
  try {
    const { data } = await axios
      .post('/api/reset_credentials', {
        username
      })

    if (!data.success) {
      commit('flashMessage', {
        message: 'Invalid username/password combo, brah',
        page: 'login'
      })
      return
    }

    commit('flashMessage', {
      message: 'Credentials reset! You should get an email with your new password.',
      page: 'login'
    })
  } catch (err) {
    const message = getMessageFromError(err) || err.message
    commit('flashMessage', {
      message: `Error resetting password: ${message}`,
      page: 'login'
    })
  }
}

async function login({ commit }, { username, password }) {
  try {
    const { data } = await axios
      .post('/api/login', {
        username,
        password
      })

    if (!data.success) {
      commit('flashMessage', {
        message: 'Invalid username/password combo, brah',
        page: 'login'
      })
      return
    }

    commit('loginSuccess')
    commit('flashMessage', {
      message: 'Welcome, site owner!',
      page: '*'
    })
  } catch (err) {
    const message = getMessageFromError(err) || err.message

    commit('flashMessage', {
      message: `Error logging in: ${message}`,
      page: 'login'
    })
  }
}

async function updateContact({ commit }, payload) {
  try {
    const { data } = await axios.post('/api/contact', payload)
    commit('contact', data)
    commit('flashMessage', {
      message: 'Contact info updated!',
      page: 'contact'
    })
  } catch (err) {
    const message = getMessageFromError(err) || err.message

    commit('flashMessage', {
      message: `Error updating contact info: ${message}`,
      page: 'contact'
    })
  }
}

async function logout({ commit }) {
  try {
    await axios.get('/api/logout')
    commit('logoutSuccess')

    router.push('/')
  } catch (err) {
    const message = getMessageFromError(err) || err.message

    commit('flashMessage', {
      message: `Unable to logout! ${message}`,
      page: 'banner'
    })
  }
}

async function updateBanner({ commit }, payload) {
  try {
    const { data } = await axios.post('/api/banner', payload)
    commit('banner', data)
    commit('flashMessage', {
      message: 'Banner info updated!',
      page: 'banner'
    })
  } catch (err) {
    const message = getMessageFromError(err) || err.message

    commit('flashMessage', {
      message: `Error updating banner info: ${message}`,
      page: 'banner'
    })
  }
}

async function updateCredentials({ commit }, payload) {
  try {
    await axios.post('/api/change_credentials', payload)

    commit('flashMessage', {
      message: 'Credentials updated!',
      page: 'admin'
    })

    logout({ commit })
  } catch (err) {
    const message = getMessageFromError(err) || err.message

    commit('flashMessage', {
      message: `Error updating credentials: ${message}`,
      page: 'admin'
    })
  }
}

export default {
  loadData,
  resetPassword,
  login,
  updateContact,
  logout,
  updateBanner,
  updateCredentials
}
