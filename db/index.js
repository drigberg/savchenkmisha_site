/**
 * Module dependencies
 */

const path = require('path')
const Admin = require('./Admin')
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

function flush() {
  store.data = {}
  store.save()
}

/**
 * Module exports
 */

module.exports = {
  admin: new Admin(store),
  flush,
  projects: new Projects(store),
}
