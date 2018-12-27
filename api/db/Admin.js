/**
 * Module dependencies
 */

const log = require('../log')
const crypto = require('crypto')

/**
 * Module
 */

class Admin {
  constructor(store) {
    this.store = store
    if (!this.store.data || !this.store.data.admin) {
      this.resetCredentials()
    }
  }

  getCredentials() {
    return {
      username: this.store.data.admin.username,
      password: this.store.data.admin.hash,
    }
  }

  getSecret() {
    return this.store.data.admin.secret
  }

  update(data) {
    this.store.data.admin = {
      ...this.store.data.admin,
      ...data,
    }

    this.store.save()
  }

  updateUsername(username) {
    this.update({
      username
    })

    log('Updated username', { color: 'green' })
  }

  updatePassword(password) {
    const salt = this.createSalt()
    const hash = this.hashPassword(password, salt)

    this.update({
      hash,
      salt,
    })

    log('Updated password', { color: 'green' })
  }

  checkCredentials(username, password) {
    // always calculate both so that attackers can't harvest usernames
    // by checking response times
    const match = {
      username: this.checkUsername(username),
      password: this.checkPassword(password),
    }

    return match.username && match.password
  }

  checkUsername(username) {
    return username === this.store.data.admin.username
  }

  checkPassword(password) {
    const hash = this.hashPassword(password, this.store.data.admin.salt)
    return hash === this.store.data.admin.hash
  }

  resetCredentials() {
    const username = crypto.randomBytes(6).toString('hex')
    const password = crypto.randomBytes(6).toString('hex')
    const salt = this.createSalt()
    const hash = this.hashPassword(password, salt)
    const secret = crypto.randomBytes(64).toString('hex')

    this.update({
      username,
      hash,
      salt,
      secret,
    })

    log('Reset credentials. Change immediately!', {
      color: 'cyan',
      data: {
        username,
        password
      }
    })

    return {
      username,
      password,
    }
  }

  refreshSecret() {
    this.update({
      secret: crypto.randomBytes(32).toString('hex'),
    })
  }

  createSalt() {
    return crypto.randomBytes(6).toString('hex')
  }

  hashPassword(password, salt) {
    const hash = crypto
      .createHmac('sha1', salt)
      .update(password)
      .digest('hex')

    return hash
  }

  flush() {
    this.store.data.admin = {}
    this.store.save()

    return this.store.data.projects
  }
}

module.exports = Admin