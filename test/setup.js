

/**
 * Module dependencies
 */

const {
  before,
  after,
} = require('mocha')

const server = require('../server')

/**
 * Module
 */

before(() => server.start())
after(() => server.stop())
