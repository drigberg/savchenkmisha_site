
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
  constructor() {
    this.agent = supertest.agent(server.server)
    this.resetCredentials()
  }

  resetCredentials() {
    this.credentials = db.admin.createCredentials()
  }

  async login() {
    const res = await this.agent
      .post('/login')
      .send(this.credentials)

    expect(res.statusCode).to.equal(302)
    expect(res.headers.location).to.equal('/')
  }
}

/**
 * Module exports
 */

module.exports = Agent