/**
 * Module dependencies
 */

const path = require('path')
const Projects = require('./Projects')
const Store = require('./Store')

/**
 * Module
 */

const store = new Store(path.join(__dirname, 'db.json'))

/**
 * Module exports
 */

module.exports = {
  projects: new Projects(store)
}
