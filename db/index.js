/**
 * Module dependencies
 */

const path = require('path')
const Projects = require('./Projects')
const Store = require('./Store')

/**
 * Module
 */

let storePath = 'db.json'

if (process.env.NODE_ENV === 'test') {
  storePath = 'db.test.json'
}

const store = new Store(path.join(__dirname, storePath))

/**
 * Module exports
 */

module.exports = {
  projects: new Projects(store)
}
