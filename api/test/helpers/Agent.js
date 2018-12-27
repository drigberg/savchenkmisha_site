
/**
 * Module dependencies
 */

const supertest = require('supertest')
const { expect } = require('chai')
const db = require('../../db')
const server = require('../../server')

/**
 * Module
 */


class Agent {

  constructor(credentials) {
    this.agent = supertest.agent(server.server)
    this.resetCredentials(credentials)
    this.csrfRe = /^.*<meta content="(.*)" name="csrf"\/>.*/
  }

  resetCredentials(credentials) {
    this.credentials = credentials || db.admin.resetCredentials()
  }

  async login() {
    const res = await this.agent
      .post('/api/login')
      .send(this.credentials)

    expect(res.statusCode).to.equal(200)

    const { text } = await this.agent.get('/')
    this.csrf = this.csrfRe.exec(text)[1]
  }
}

/**
 * Module exports
 */

module.exports = Agent