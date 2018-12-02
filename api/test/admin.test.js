
/**
 * Module dependencies
 */

const { expect } = require('chai')
const faker = require('faker')
const Agent = require('./Agent')
const db = require('../db')

/**
 * Module
 */

describe('admin', () => {
  describe('login', () => {
    it('correct credentials', async () => {
      const agent = new Agent()
      const res = await agent.agent
        .post('/api/login')
        .send(agent.credentials)

      expect(res.statusCode).to.equal(302)
      expect(res).to.have.property('set-cookie').to.be.an('array').with.length(1)
      expect(res.headers.location).to.equal('/')
    })

    it('invalid username', async () => {
      const agent = new Agent()
      const res = await agent.agent
        .post('/api/login')
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
        .post('/api/login')
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
        .post('/api/login')
        .send({
          username: 'wrong',
          password: 'wrong',
        })

      expect(res.statusCode).to.equal(302)
      expect(res.headers).to.not.have.property('set-cookie')
      expect(res.headers.location).to.equal('/login')
    })
  })

  describe('logout', () => {
    it('logged in', async () => {
      const agent = new Agent()
      await agent.agent
        .post('/api/login')
        .send(agent.credentials)

      const res = await agent.agent
        .get('/api/logout')

      expect(res.statusCode).to.equal(302)
      expect(res.headers).to.not.have.property('set-cookie')
      expect(res.headers.location).to.equal('/')
    })

    it('already logged out', async () => {
      const agent = new Agent()

      const res = await agent.agent
        .get('/api/logout')

      expect(res.statusCode).to.equal(302)
      expect(res.headers).to.not.have.property('set-cookie')
      expect(res.headers.location).to.equal('/')
    })
  })

  describe('change password', () => {
    describe('success', () => {
      it('current password matches', async () => {
        const agent = new Agent()
        await agent.login()

        const new_password = faker.random.alphaNumeric(15)
        const credentials = agent.credentials

        const res = await agent.agent
          .post('/api/change_password')
          .send({
            current_password: credentials.password,
            new_password,
          })

        expect(res.statusCode).to.equal(302)
        expect(res.headers).to.not.have.property('set-cookie')
        expect(res.headers.location).to.equal('/')

        const updated = db.admin.getCredentials()
        expect(updated.username).equal(credentials.username)
        expect(db.admin.checkPassword(new_password)).to.equal(true)
      })
    })

    describe('failure', () => {
      it('incorrect current password', async () => {
        const agent = new Agent()
        await agent.login()

        const new_password = faker.random.alphaNumeric(15)
        const credentials = agent.credentials

        const res = await agent.agent
          .post('/api/change_password')
          .send({
            current_password: 'invalid',
            new_password,
          })

        expect(res.statusCode).to.equal(500)
        expect(res.text).to.equal('incorrect password')

        const updated = db.admin.getCredentials()
        expect(updated.username).equal(credentials.username)
        expect(db.admin.checkPassword(credentials.password)).to.equal(true)
      })

      it('unauthenticated', async () => {
        const agent = new Agent()

        const new_password = faker.random.alphaNumeric(15)
        const credentials = agent.credentials

        const res = await agent.agent
          .post('/api/change_password')
          .send({
            current_password: credentials.password,
            new_password,
          })

        expect(res.statusCode).to.equal(500)
        expect(res.text).to.equal('Not authenticated')

        const updated = db.admin.getCredentials()
        expect(updated.username).equal(credentials.username)
        expect(db.admin.checkPassword(new_password)).to.equal(false)
        expect(db.admin.checkPassword(credentials.password)).to.equal(true)
      })
    })
  })
})

describe('change username', () => {
  describe('success', () => {
    it('current password and username match', async () => {
      const agent = new Agent()
      await agent.login()

      const new_username = faker.random.alphaNumeric(15)
      const credentials = agent.credentials

      const res = await agent.agent
        .post('/api/change_username')
        .send({
          password: credentials.password,
          new_username,
        })

      expect(res.statusCode).to.equal(302)
      expect(res.headers).to.not.have.property('set-cookie')
      expect(res.headers.location).to.equal('/')

      const updated = db.admin.getCredentials()
      expect(updated.username).equal(new_username)
      expect(db.admin.checkPassword(credentials.password)).to.equal(true)
    })
  })

  describe('failure', () => {
    it('unauthenticated', async () => {
      const agent = new Agent()

      const new_username = faker.random.alphaNumeric(15)
      const credentials = agent.credentials

      const res = await agent.agent
        .post('/api/change_username')
        .send({
          new_username,
          password: credentials.password,
        })

      expect(res.statusCode).to.equal(500)
      expect(res.text).to.equal('Not authenticated')

      const updated = db.admin.getCredentials()
      expect(updated.username).equal(credentials.username)
      expect(db.admin.checkPassword(credentials.password)).to.equal(true)
    })

    it('incorrect current password', async () => {
      const agent = new Agent()
      await agent.login()

      const new_username = faker.random.alphaNumeric(15)
      const credentials = agent.credentials

      const res = await agent.agent
        .post('/api/change_username')
        .send({
          new_username,
          password: 'incorrect',
        })

      expect(res.statusCode).to.equal(500)
      expect(res.text).to.equal('incorrect password')

      const updated = db.admin.getCredentials()
      expect(updated.username).equal(credentials.username)
      expect(db.admin.checkPassword(credentials.password)).to.equal(true)
    })
  })
})
