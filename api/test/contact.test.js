
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

describe('Contact', () => {
  before(async () => {
    this.agents = {
      unauthenticated: new Agent(),
    }

    this.agents.authenticated = new Agent(this.agents.unauthenticated.credentials)

    await this.agents.authenticated.login()
  })

  beforeEach(() => {
    db.contact.update({
      email: faker.random.alphaNumeric(15),
      github: faker.random.alphaNumeric(15),
      linkedin: faker.random.alphaNumeric(15),
    })
  })

  describe('read', () => {
    it('logged in', async () => {
      const expected = db.contact.read()

      const res = await this.agents.authenticated.agent
        .get('/api/contact')

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.deep.equal(expected)
    })

    it('unauthenticated', async () => {
      const expected = db.contact.read()

      const res = await this.agents.unauthenticated.agent
        .get('/api/contact')

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.deep.equal(expected)
    })
  })

  describe('update', () => {
    describe('error', () => {
      it('unauthenticated', async () => {
        const original = db.contact.read()
        const title = faker.random.alphaNumeric(15)

        const res = await this.agents.unauthenticated.agent
          .post('/api/contact')
          .set('csrf', this.agents.authenticated.csrf)
          .send({
            title,
          })

        expect(res.statusCode).to.equal(401)

        const actual = db.contact.read()
        expect(actual).to.deep.equal(original)
      })

      it('missing csrf', async () => {
        const original = db.contact.read()
        const title = faker.random.alphaNumeric(15)

        const res = await this.agents.authenticated.agent
          .post('/api/contact')
          .send({
            title,
          })

        expect(res.statusCode).to.equal(401)
        expect(res.text).to.equal('Not authenticated')

        const actual = db.contact.read()
        expect(actual).to.deep.equal(original)
      })

      it('invalid csrf', async () => {
        const original = db.contact.read()
        const title = faker.random.alphaNumeric(15)

        const res = await this.agents.authenticated.agent
          .post('/api/contact')
          .set('csrf', faker.random.alphaNumeric(10))
          .send({
            title,
          })

        expect(res.statusCode).to.equal(401)
        expect(res.text).to.equal('Not authenticated')

        const actual = db.contact.read()
        expect(actual).to.deep.equal(original)
      })

      it('request params', async () => {
        const email = 'email'

        const res = await this.agents.authenticated.agent
          .post('/api/contact?key=value')
          .set('csrf', this.agents.authenticated.csrf)
          .send({
            email,
          })

        expect(res.statusCode).to.equal(400)
        expect(res.body.message).to.equal('This application doesn\'t use querystrings.')
      })

      it('malformed email', async () => {
        const email = 'email**'

        const res = await this.agents.authenticated.agent
          .post('/api/contact')
          .set('csrf', this.agents.authenticated.csrf)
          .send({
            email,
          })

        expect(res.statusCode).to.equal(400)
        expect(res.body.message).to.equal('At least one request body property is malformed: email')
      })

      it('malformed github', async () => {
        const github = '((('

        const res = await this.agents.authenticated.agent
          .post('/api/contact')
          .set('csrf', this.agents.authenticated.csrf)
          .send({
            github,
          })

        expect(res.statusCode).to.equal(400)
        expect(res.body.message).to.equal('At least one request body property is malformed: github')
      })

      it('malformed linkedin', async () => {
        const linkedin = '?'

        const res = await this.agents.authenticated.agent
          .post('/api/contact')
          .set('csrf', this.agents.authenticated.csrf)
          .send({
            linkedin,
          })

        expect(res.statusCode).to.equal(400)
        expect(res.body.message).to.equal('At least one request body property is malformed: linkedin')
      })

      it('all malformed', async () => {
        const contact = {
          email: '***',
          github: '(((',
          linkedin: '$$$',
        }
        const res = await this.agents.authenticated.agent
          .post('/api/contact')
          .set('csrf', this.agents.authenticated.csrf)
          .send(contact)

        expect(res.statusCode).to.equal(400)
        expect(res.body.message).to.equal('At least one request body property is malformed: email, github, linkedin')
      })
    })

    describe('success', () => {
      it('just email', async () => {
        const email = faker.random.alphaNumeric(15)

        const res = await this.agents.authenticated.agent
          .post('/api/contact')
          .set('csrf', this.agents.authenticated.csrf)
          .send({
            email,
          })

        expect(res.statusCode).to.equal(200)
        expect(res.body).to.deep.equal({
          email,
        })

        const actual = db.contact.read()
        expect(actual).to.deep.equal({
          email,
        })
      })

      it('just linkedin', async () => {
        const linkedin = faker.random.alphaNumeric(15)

        const res = await this.agents.authenticated.agent
          .post('/api/contact')
          .set('csrf', this.agents.authenticated.csrf)
          .send({
            linkedin,
          })

        expect(res.statusCode).to.equal(200)
        expect(res.body).to.deep.equal({
          linkedin,
        })

        const actual = db.contact.read()
        expect(actual).to.deep.equal({
          linkedin,
        })
      })

      it('just github', async () => {
        const github = faker.random.alphaNumeric(15)

        const res = await this.agents.authenticated.agent
          .post('/api/contact')
          .set('csrf', this.agents.authenticated.csrf)
          .send({
            github,
          })

        expect(res.statusCode).to.equal(200)
        expect(res.body).to.deep.equal({
          github,
        })

        const actual = db.contact.read()
        expect(actual).to.deep.equal({
          github: github
        })
      })

      it('all', async () => {
        const contact = {
          email: faker.random.alphaNumeric(15),
          github: faker.random.alphaNumeric(15),
          linkedin: faker.random.alphaNumeric(15),
        }

        const res = await this.agents.authenticated.agent
          .post('/api/contact')
          .set('csrf', this.agents.authenticated.csrf)
          .send(contact)

        expect(res.statusCode).to.equal(200)
        expect(res.body).to.deep.equal(contact)

        const actual = db.contact.read()
        expect(actual).to.deep.equal(contact)
      })

      it('updated data is returned in further api calls', async () => {
        const contact = {
          email: faker.random.alphaNumeric(15),
          github: faker.random.alphaNumeric(15),
          linkedin: faker.random.alphaNumeric(15),
        }

        await this.agents.authenticated.agent
          .post('/api/contact')
          .set('csrf', this.agents.authenticated.csrf)
          .send(contact)

        const res = await this.agents.authenticated.agent
          .get('/api/contact')

        expect(res.statusCode).to.equal(200)
        expect(res.body).to.deep.equal(contact)
      })
    })
  })
})
