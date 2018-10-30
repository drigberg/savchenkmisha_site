

/**
 * Module dependencies
 */

const {
  before,
  after,
} = require('mocha')

const db = require('../db')
const server = require('../server')

/**
 * Module
 */

before(async () => {
  db.flush()
  await server.start()
})
after(async () => {
  await server.stop()
  db.flush()
})
