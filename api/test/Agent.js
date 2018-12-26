
/**
 * Module dependencies
 */

const supertest = require('supertest')
const { expect } = require('chai')
const db = require('../db')
const server = require('../server')

/**
 * Module
 */

class Agent {
  constructor(credentials) {
    this.agent = supertest.agent(server.server)
    this.resetCredentials(credentials)
  }

  resetCredentials(credentials) {
    this.credentials = credentials || db.admin.resetCredentials()
  }

  async login() {
    const res = await this.agent
      .post('/api/login')
      .send(this.credentials)

    expect(res.statusCode).to.equal(200)
  }
}

/**
 * Module exports
 */

module.exports = Agent