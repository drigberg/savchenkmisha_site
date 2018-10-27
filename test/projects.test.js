
/**
 * Module dependencies
 */

const {
  flushDb,
  request,
} = require('./helpers')
const { expect } = require('chai')
const faker = require('faker')

/**
 * Module
 */

describe('projects', () => {
  before(flushDb)
  after(flushDb)

  describe('insert', () => {
    it('only title', async () => {
      const data = {
        title: faker.random.alphaNumeric(24),
      }

      const res = await request({
        path: 'projects',
        method: 'post',
        form: data
      })

      expect(res).to.be.an('object')
      expect(res).to.have.property('id').and.be.a('string')
      expect(res).to.have.property('images').and.deep.equal([])

      const {
        id,
        images,
        ...actual
      } = res

      expect(actual).to.deep.equal(data)
    })

    it('only description', async () => {
      const data = {
        description: faker.lorem.paragraph(12),
      }

      const res = await request({
        path: 'projects',
        method: 'post',
        form: data
      })

      expect(res).to.be.an('object')
      expect(res).to.have.property('id').and.be.a('string')
      expect(res).to.have.property('images').and.deep.equal([])

      const {
        id,
        images,
        ...actual
      } = res

      expect(actual).to.deep.equal(data)
    })

    it('only images', async () => {
      const data = {
        images: [
          faker.internet.url(),
          faker.internet.url(),
        ],
      }

      const res = await request({
        path: 'projects',
        method: 'post',
        form: data
      })

      expect(res).to.be.an('object')
      expect(res).to.have.property('id').and.be.a('string')

      const {
        id,
        ...actual
      } = res

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

      const res = await request({
        path: 'projects',
        method: 'post',
        form: data
      })

      expect(res).to.be.an('object')
      expect(res).to.have.property('id').and.be.a('string')

      const {
        id,
        ...actual
      } = res

      expect(actual).to.deep.equal(data)
    })
  })

  describe('list', () => {
    before(async () => {
      flushDb()

      this.projects = []

      for (let i = 0; i < 5; i++) {
        this.projects.push(await request({
          path: 'projects',
          method: 'post',
          form: {
            title: faker.random.alphaNumeric(24),
            description: faker.lorem.paragraph(12),
            images: [
              faker.internet.url(),
              faker.internet.url(),
            ],
          }
        }))
      }
    })

    it('lists all', async () => {
      const res = await request({
        path: 'projects',
        method: 'get',
      })

      expect(res.sort()).to.deep.equal(this.projects.sort())
    })
  })

  describe('update', () => {
    beforeEach(async () => {
      this.projects = []

      for (let i = 0; i < 5; i++) {
        this.projects.push(await request({
          path: 'projects',
          method: 'post',
          form: {
            title: faker.random.alphaNumeric(24),
            description: faker.lorem.paragraph(12),
            images: [
              faker.internet.url(),
              faker.internet.url(),
            ],
          }
        }))
      }
    })

    it('title', async () => {
      const data = {
        title: faker.random.alphaNumeric(24)
      }

      const updateResponse = await request({
        path: `projects/${this.projects[0].id}`,
        method: 'post',
        form: data
      })

      const expected = {
        ...this.projects[0],
        ...data
      }

      expect(updateResponse).to.deep.equal(expected)

      const listResponse = await request({
        path: 'projects',
        method: 'get',
      })

      const actual = listResponse.find(item => item.id === this.projects[0].id)
      expect(actual).to.deep.equal(expected)
    })
  })

  describe('remove', () => {
    before(async () => {
      flushDb()

      this.projects = []

      for (let i = 0; i < 5; i++) {
        this.projects.push(await request({
          path: 'projects',
          method: 'post',
          form: {
            title: faker.random.alphaNumeric(24),
            description: faker.lorem.paragraph(12),
            images: [
              faker.internet.url(),
              faker.internet.url(),
            ],
          }
        }))
      }
    })

    it('success', async () => {
      await request({
        path: `projects/${this.projects[0].id}`,
        method: 'delete',
      })

      const listResponse = await request({
        path: 'projects',
        method: 'get',
      })

      const actual = listResponse.find(item => item.id === this.projects[0].id)
      expect(actual).to.equal(undefined)
    })
  })
})