
/**
 * Module dependencies
 */

const { expect } = require('chai')
const faker = require('faker')
const db = require('../db')

const Agent = require('./Agent')

/**
 * Module
 */

describe('projects', () => {
  before(async () => {
    db.projects.removeAll()
    this.agent = new Agent()
    await this.agent.login()
  })

  after(() => db.projects.removeAll())

  describe('insert', () => {
    it('only title', async () => {
      const data = {
        title: faker.random.alphaNumeric(24),
      }

      const { body } = await this.agent.agent
        .post('/projects')
        .send(data)

      expect(body).to.be.an('object')
      expect(body).to.have.property('id').and.be.a('string')
      expect(body).to.have.property('images').and.deep.equal([])

      const {
        id,
        images,
        ...actual
      } = body

      expect(actual).to.deep.equal(data)
    })

    it('only description', async () => {
      const data = {
        description: faker.lorem.paragraph(12),
      }

      const { body } = await this.agent.agent
        .post('/projects')
        .send(data)

      expect(body).to.be.an('object')
      expect(body).to.have.property('id').and.be.a('string')
      expect(body).to.have.property('images').and.deep.equal([])

      const {
        id,
        images,
        ...actual
      } = body

      expect(actual).to.deep.equal(data)
    })

    it('only images', async () => {
      const data = {
        images: [
          faker.internet.url(),
          faker.internet.url(),
        ],
      }

      const { body } = await this.agent.agent
        .post('/projects')
        .send(data)

      expect(body).to.be.an('object')
      expect(body).to.have.property('id').and.be.a('string')

      const {
        id,
        ...actual
      } = body

      expect(actual).to.deep.equal(data)
    })

    it('all properties provided', async () => {
      const data = {
        title: faker.random.alphaNumeric(24),
        description: faker.lorem.paragraph(12),
        images: [
          faker.internet.url(),
          faker.internet.url(),
        ],
      }

      const { body } = await this.agent.agent
        .post('/projects')
        .send(data)

      expect(body).to.be.an('object')
      expect(body).to.have.property('id').and.be.a('string')

      const {
        id,
        ...actual
      } = body

      expect(actual).to.deep.equal(data)
    })
  })

  describe('list', () => {
    before(async () => {
      db.projects.removeAll()

      this.projects = []

      for (let i = 0; i < 5; i++) {
        const { body } = await this.agent.agent
          .post('/projects')
          .send({
            title: faker.random.alphaNumeric(24),
            description: faker.lorem.paragraph(12),
            images: [
              faker.internet.url(),
              faker.internet.url(),
            ],
          })

        this.projects.push(body)
      }
    })

    it('lists all', async () => {
      const { body } = await this.agent.agent
        .get('/projects')

      expect(body.sort()).to.deep.equal(this.projects.sort())
    })
  })

  describe('update', () => {
    before(async () => {
      db.projects.removeAll()

      this.projects = []

      for (let i = 0; i < 5; i++) {
        const { body } = await this.agent.agent
          .post('/projects')
          .send({
            title: faker.random.alphaNumeric(24),
            description: faker.lorem.paragraph(12),
            images: [
              faker.internet.url(),
              faker.internet.url(),
            ],
          })

        this.projects.push(body)
      }
    })

    it('title', async () => {
      const data = {
        title: faker.random.alphaNumeric(24)
      }

      const { body: updated } = await this.agent.agent
        .post(`/projects/${this.projects[0].id}`)
        .send(data)


      const expected = {
        ...this.projects[0],
        ...data
      }

      expect(updated).to.deep.equal(expected)

      const { body: listed } = await this.agent.agent
        .get('/projects')

      const actual = listed.find(item => item.id === this.projects[0].id)
      expect(actual).to.deep.equal(expected)
    })
  })

  describe('remove', () => {
    before(async () => {
      db.projects.removeAll()

      this.projects = []

      for (let i = 0; i < 5; i++) {
        const { body } = await this.agent.agent
          .post('/projects')
          .send({
            title: faker.random.alphaNumeric(24),
            description: faker.lorem.paragraph(12),
            images: [
              faker.internet.url(),
              faker.internet.url(),
            ],
          })

        this.projects.push(body)
      }
    })

    it('success', async () => {
      await this.agent.agent
        .delete(`/projects/${this.projects[0].id}`)

      const { body: listed } = await this.agent.agent
        .get('/projects')

      const actual = listed.find(item => item.id === this.projects[0].id)
      expect(actual).to.equal(undefined)
    })
  })
})