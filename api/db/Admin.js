/**
 * Module dependencies
 */

const chalk = require('chalk')
const crypto = require('crypto')

/**
 * Module
 */

class Admin {
  constructor(store) {
    this.store = store
    if (!this.store.data || !this.store.data.admin) {
      const credentials = this.createCredentials()
      console.log(chalk.cyan('Created default credentials. Change immediately!'), credentials)
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

    console.log(chalk.green('Updated username'))
  }

  updatePassword(password) {
    const salt = this.createSalt()
    const hash = this.hashPassword(password, salt)

    this.update({
      hash,
      salt,
    })

    console.log(chalk.green('Updated password'))
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
    const secret = crypto.randomBytes(64).toString('hex')

    this.update({
      username,
      hash,
      salt,
      secret,
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