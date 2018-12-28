/**
 * Module dependencies
 */

const path = require('path')
const Admin = require('./Admin')
const Banner = require('./Banner')
const Contact = require('./Contact')
const Projects = require('./Projects')
const Store = require('./Store')

/**
 * Module
 */

const storePath = process.env.NODE_ENV === 'test'
  ? 'db.test.json'
  : 'db.json'

const store = new Store(path.join(__dirname, storePath))

/**
 * Module exports
 */

module.exports = {
  admin: new Admin(store),
  banner: new Banner(store),
  contact: new Contact(store),
  flush: function () {
    store.flush()
  },
  projects: new Projects(store),
}
