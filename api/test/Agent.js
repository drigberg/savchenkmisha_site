
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
    this.credentials = credentials
      ? credentials
      : db.admin.createCredentials()
  }

  async login() {
    const res = await this.agent
      .post('/api/login')
      .send(this.credentials)

    expect(res.statusCode).to.equal(302)
    expect(res.headers.location).to.equal('/')
  }
}

/**
 * Module exports
 */

module.exports = Agent