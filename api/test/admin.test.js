
/**
 * Module dependencies
 */

const { expect } = require('chai')
const faker = require('faker')
const Agent = require('./helpers/Agent')
const db = require('../db')

/**
 * Module
 */

const csrfRe = /^.*<meta content="(.*)" name="csrf"\/>.*/

describe('Admin', () => {
  describe('login', () => {
    before(() => {
      this.agent = new Agent()
    })

    beforeEach(async () => {
      await this.agent.agent
        .get('/api/logout')
    })

    describe('success', () => {
      it('correct credentials', async () => {
        const res = await this.agent.agent
          .post('/api/login')
          .send(this.agent.credentials)

        expect(res.statusCode).to.equal(200)
        expect(res.body.success).to.equal(true)
      })

      it('injects csrf into html', async () => {
        await this.agent.agent
          .post('/api/login')
          .send(this.agent.credentials)

        const res = await this.agent.agent.get('/')

        expect(res.statusCode).to.equal(200)
        const match = csrfRe.exec(res.text)
        expect(match[1]).to.have.length(128)
      })
    })

    describe('error', () => {
      it('invalid username', async () => {
        const res = await this.agent.agent
          .post('/api/login')
          .send({
            username: 'wrong',
            password: this.agent.credentials.password,
          })

        expect(res.statusCode).to.equal(401)
      })

      it('invalid password', async () => {
        const res = await this.agent.agent
          .post('/api/login')
          .send({
            username: this.agent.credentials.username,
            password: 'wrong',
          })

        expect(res.statusCode).to.equal(401)
      })

      it('invalid username and password', async () => {
        const res = await this.agent.agent
          .post('/api/login')
          .send({
            username: 'wrong',
            password: 'wrong',
          })

        expect(res.statusCode).to.equal(401)
      })
    })
  })

  describe('logout', () => {
    it('no valid session after logout', async () => {
      const agent = new Agent()
      await agent.agent
        .post('/api/login')
        .send(agent.credentials)

      await agent.agent
        .get('/api/logout')

      const res = await agent.agent
        .post('/api/contact')
        .send({})

      expect(res.statusCode).to.equal(401)
    })

    it('logged in', async () => {
      const agent = new Agent()
      await agent.agent
        .post('/api/login')
        .send(agent.credentials)

      const res = await agent.agent
        .get('/api/logout')

      expect(res.statusCode).to.equal(200)
      expect(res.body.success).to.equal(true)
    })

    it('already logged out', async () => {
      const agent = new Agent()

      const res = await agent.agent
        .get('/api/logout')

      expect(res.statusCode).to.equal(200)
      expect(res.body.success).to.equal(true)
    })
  })

  describe('change credentials', () => {
    describe('success', () => {
      it('change password', async () => {
        const agent = new Agent()
        await agent.login()

        const new_password = faker.random.alphaNumeric(15)
        const credentials = agent.credentials

        const res = await agent.agent
          .post('/api/change_credentials')
          .set('csrf', agent.csrf)
          .send({
            current_password: credentials.password,
            current_username: credentials.username,
            new_password,
          })

        expect(res.statusCode).to.equal(200)
        expect(res.body.success).to.equal(true)

        const updated = db.admin.getCredentials()
        expect(updated.username).equal(credentials.username)
        expect(db.admin.checkPassword(new_password)).to.equal(true)
      })

      it('change username', async () => {
        const agent = new Agent()
        await agent.login()

        const new_username = faker.random.alphaNumeric(15)
        const credentials = agent.credentials

        const res = await agent.agent
          .post('/api/change_credentials')
          .set('csrf', agent.csrf)
          .send({
            current_password: credentials.password,
            current_username: credentials.username,
            new_username,
          })

        expect(res.statusCode).to.equal(200)
        expect(res.body.success).to.equal(true)

        const updated = db.admin.getCredentials()
        expect(updated.username).equal(new_username)
        expect(db.admin.checkPassword(credentials.password)).to.equal(true)
      })

      it('change both', async () => {
        const agent = new Agent()
        await agent.login()

        const new_password = faker.random.alphaNumeric(15)
        const new_username = faker.random.alphaNumeric(15)
        const credentials = agent.credentials

        const res = await agent.agent
          .post('/api/change_credentials')
          .set('csrf', agent.csrf)
          .send({
            current_password: credentials.password,
            current_username: credentials.username,
            new_password,
            new_username,
          })

        expect(res.statusCode).to.equal(200)
        expect(res.body.success).to.equal(true)

        const updated = db.admin.getCredentials()
        expect(updated.username).equal(new_username)
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
          .post('/api/change_credentials')
          .set('csrf', agent.csrf)
          .send({
            current_password: 'invalid',
            current_username: credentials.username,
            new_password,
          })

        expect(res.statusCode).to.equal(400)
        expect(res.text).to.equal('incorrect credentials')

        const actual = db.admin.getCredentials()
        expect(actual.username).equal(credentials.username)
        expect(db.admin.checkPassword(credentials.password)).to.equal(true)
      })

      it('incorrect current username', async () => {
        const agent = new Agent()
        await agent.login()

        const new_password = faker.random.alphaNumeric(15)
        const credentials = agent.credentials

        const res = await agent.agent
          .post('/api/change_credentials')
          .set('csrf', agent.csrf)
          .send({
            current_password: credentials.password,
            current_username: 'invalid',
            new_password,
          })

        expect(res.statusCode).to.equal(400)
        expect(res.text).to.equal('incorrect credentials')

        const actual = db.admin.getCredentials()
        expect(actual.username).equal(credentials.username)
        expect(db.admin.checkPassword(credentials.password)).to.equal(true)
      })

      it('missing csrf', async () => {
        const agent = new Agent()
        await agent.login()

        const new_password = faker.random.alphaNumeric(15)
        const new_username = faker.random.alphaNumeric(15)
        const credentials = agent.credentials

        const res = await agent.agent
          .post('/api/change_credentials')
          .send({
            current_password: credentials.password,
            current_username: credentials.username,
            new_password,
            new_username,
          })

        expect(res.statusCode).to.equal(401)
        expect(res.text).to.equal('Not authenticated')

        const actual = db.admin.getCredentials()
        expect(actual.username).equal(credentials.username)
        expect(db.admin.checkPassword(new_password)).to.equal(false)
        expect(db.admin.checkPassword(credentials.password)).to.equal(true)
      })

      it('invalid csrf', async () => {
        const agent = new Agent()
        await agent.login()

        const new_password = faker.random.alphaNumeric(15)
        const new_username = faker.random.alphaNumeric(15)
        const credentials = agent.credentials

        const res = await agent.agent
          .post('/api/change_credentials')
          .set('csrf', faker.random.alphaNumeric(10))
          .send({
            current_password: credentials.password,
            current_username: credentials.username,
            new_password,
            new_username,
          })

        expect(res.statusCode).to.equal(401)
        expect(res.text).to.equal('Not authenticated')

        const actual = db.admin.getCredentials()
        expect(actual.username).equal(credentials.username)
        expect(db.admin.checkPassword(new_password)).to.equal(false)
        expect(db.admin.checkPassword(credentials.password)).to.equal(true)
      })

      it('unauthenticated', async () => {
        const agent = new Agent()

        const new_password = faker.random.alphaNumeric(15)
        const credentials = agent.credentials

        const res = await agent.agent
          .post('/api/change_credentials')
          .send({
            current_password: credentials.password,
            new_password,
          })

        expect(res.statusCode).to.equal(401)
        expect(res.text).to.equal('Not authenticated')

        const actual = db.admin.getCredentials()
        expect(actual.username).equal(credentials.username)
        expect(db.admin.checkPassword(new_password)).to.equal(false)
        expect(db.admin.checkPassword(credentials.password)).to.equal(true)
      })
    })
  })
})
