
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

describe('Banner', () => {
  before(async () => {
    this.agents = {
      unauthenticated: new Agent(),
    }

    this.agents.authenticated = new Agent(this.agents.unauthenticated.credentials)

    await this.agents.authenticated.login()
  })

  beforeEach(() => {
    db.banner.update({
      title: faker.random.alphaNumeric(15),
      subtitle: faker.random.alphaNumeric(15),
      bio: faker.random.alphaNumeric(15),
    })
  })

  describe('read', () => {
    it('logged in', async () => {
      const data = {
        title: faker.random.alphaNumeric(15),
        subtitle: faker.random.alphaNumeric(15),
        bio: faker.random.alphaNumeric(15),
      }

      db.banner.update(data)

      const res = await this.agents.authenticated.agent
        .get('/api/banner')

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.deep.equal(data)
    })

    it('unauthenticated', async () => {
      const data = {
        title: faker.random.alphaNumeric(15),
        subtitle: faker.random.alphaNumeric(15),
        bio: faker.random.alphaNumeric(15),
      }

      db.banner.update(data)

      const res = await this.agents.unauthenticated.agent
        .get('/api/banner')

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.deep.equal(data)
    })
  })

  describe('update', () => {
    describe('error', () => {
      it('unauthenticated', async () => {
        const original = db.banner.read()
        const title = faker.random.alphaNumeric(15)

        const res = await this.agents.unauthenticated.agent
          .post('/api/banner')
          .set('csrf', this.agents.authenticated.csrf)
          .send({
            title,
          })

        expect(res.statusCode).to.equal(401)
        expect(res.text).to.equal('Not authenticated')

        const actual = db.banner.read()
        expect(actual).to.deep.equal(original)
      })

      it('missing csrf', async () => {
        const original = db.banner.read()
        const title = faker.random.alphaNumeric(15)

        const res = await this.agents.authenticated.agent
          .post('/api/banner')
          .send({
            title,
          })

        expect(res.statusCode).to.equal(401)
        expect(res.text).to.equal('Not authenticated')

        const actual = db.banner.read()
        expect(actual).to.deep.equal(original)
      })

      it('invalid csrf', async () => {
        const original = db.banner.read()
        const title = faker.random.alphaNumeric(15)

        const res = await this.agents.authenticated.agent
          .post('/api/banner')
          .set('csrf', faker.random.alphaNumeric(10))
          .send({
            title,
          })

        expect(res.statusCode).to.equal(401)

        const actual = db.banner.read()
        expect(actual).to.deep.equal(original)
      })
    })

    describe('success', () => {
      it('just title', async () => {
        const title = faker.random.alphaNumeric(15)

        const res = await this.agents.authenticated.agent
          .post('/api/banner')
          .set('csrf', this.agents.authenticated.csrf)
          .send({
            title,
          })

        expect(res.statusCode).to.equal(200)
        expect(res.body).to.deep.equal({
          title,
        })

        const actual = db.banner.read()
        expect(actual).to.deep.equal({
          title,
        })
      })

      it('just bio', async () => {
        const bio = faker.random.alphaNumeric(15)

        const res = await this.agents.authenticated.agent
          .post('/api/banner')
          .set('csrf', this.agents.authenticated.csrf)
          .send({
            bio,
          })

        expect(res.statusCode).to.equal(200)
        expect(res.body).to.deep.equal({
          bio,
        })

        const actual = db.banner.read()
        expect(actual).to.deep.equal({
          bio,
        })
      })

      it('just subtitle', async () => {
        const subtitle = faker.random.alphaNumeric(15)

        const res = await this.agents.authenticated.agent
          .post('/api/banner')
          .set('csrf', this.agents.authenticated.csrf)
          .send({
            subtitle,
          })

        expect(res.statusCode).to.equal(200)
        expect(res.body).to.deep.equal({
          subtitle,
        })

        const actual = db.banner.read()
        expect(actual).to.deep.equal({
          subtitle: subtitle
        })
      })

      it('all', async () => {
        const banner = {
          title: faker.random.alphaNumeric(15),
          subtitle: faker.random.alphaNumeric(15),
          bio: faker.random.alphaNumeric(15),
        }

        const res = await this.agents.authenticated.agent
          .post('/api/banner')
          .set('csrf', this.agents.authenticated.csrf)
          .send(banner)

        expect(res.statusCode).to.equal(200)
        expect(res.body).to.deep.equal(banner)

        const actual = db.banner.read()
        expect(actual).to.deep.equal(banner)
      })

      it('updated data is returned in further api calls', async () => {
        const banner = {
          title: faker.random.alphaNumeric(15),
          subtitle: faker.random.alphaNumeric(15),
          bio: faker.random.alphaNumeric(15),
        }

        await this.agents.authenticated.agent
          .post('/api/banner')
          .set('csrf', this.agents.authenticated.csrf)
          .send(banner)

        const res = await this.agents.authenticated.agent
          .get('/api/banner')

        expect(res.statusCode).to.equal(200)
        expect(res.body).to.deep.equal(banner)
      })
    })
  })
})
