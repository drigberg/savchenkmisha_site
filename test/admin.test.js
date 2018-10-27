
/**
 * Module dependencies
 */

const Agent = require('./Agent')
const { expect } = require('chai')

/**
 * Module
 */

describe('admin', () => {
  describe('login', () => {
    it('correct credentials', async () => {
      const agent = new Agent()
      const res = await agent.agent
        .post('/login')
        .send(agent.credentials)

      expect(res.statusCode).to.equal(302)
      expect(res.headers).to.have.property('set-cookie').to.be.an('array').with.length(1)
      expect(res.headers.location).to.equal('/')
    })

    it('invalid username', async () => {
      const agent = new Agent()
      const res = await agent.agent
        .post('/login')
        .send({
          username: 'wrong',
          password: agent.credentials.password,
        })

      expect(res.statusCode).to.equal(302)
      expect(res.headers).to.not.have.property('set-cookie')
      expect(res.headers.location).to.equal('/login')
    })

    it('invalid password', async () => {
      const agent = new Agent()
      const res = await agent.agent
        .post('/login')
        .send({
          username: agent.credentials.username,
          password: 'wrong',
        })

      expect(res.statusCode).to.equal(302)
      expect(res.headers).to.not.have.property('set-cookie')
      expect(res.headers.location).to.equal('/login')
    })

    it('invalid username and password', async () => {
      const agent = new Agent()
      const res = await agent.agent
        .post('/login')
        .send({
          username: 'wrong',
          password: 'wrong',
        })

      expect(res.statusCode).to.equal(302)
      expect(res.headers).to.not.have.property('set-cookie')
      expect(res.headers.location).to.equal('/login')
    })
  })
})