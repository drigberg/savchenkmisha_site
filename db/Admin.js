/**
 * Module dependencies
 */

const crypto = require('crypto')

/**
 * Module
 */

class Admin {
  constructor(store) {
    this.store = store
    if (!this.store.data.admin) {
      const credentials = this.createCredentials()
      console.log('Created default credentials. Change immediately!', credentials)
    }

    this.schema = {}
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
  }

  updatePassword(password) {
    const salt = this.createSalt()
    const hash = this.generateHash(password, salt)

    this.update({
      hash,
      salt,
    })
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

  createCredentials() {
    const username = crypto.randomBytes(6).toString('hex')
    const password = crypto.randomBytes(6).toString('hex')
    const salt = this.createSalt()
    const hash = this.hashPassword(password, salt)

    this.update({
      username,
      hash,
      salt
    })

    return {
      username,
      password,
    }
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
}

module.exports = Admin